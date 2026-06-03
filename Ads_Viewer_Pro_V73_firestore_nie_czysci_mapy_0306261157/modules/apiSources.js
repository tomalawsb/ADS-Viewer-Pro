// ADS Viewer Pro - apiSources.js
// Wydzielone z app.js w wersji V59. Klasyczny skrypt, funkcje globalne.
function buildAdsbUrl(flight) {
  const params = new URLSearchParams();
  params.set("icao", flight.icao);
  if (flight.lat) params.set("lat", flight.lat);
  if (flight.lon) params.set("lon", flight.lon);
  if (flight.zoom) params.set("zoom", flight.zoom);
  params.set("showTrace", flight.date);
  params.set("trackLabels", "");
  return `${ADSB_BASE_URL}?${params.toString().replace("trackLabels=", "trackLabels")}`;
}

function normalizeApiBase(value) {
  return (value || API_SOURCES[DEFAULT_DATA_SOURCE].apiBase).trim().replace(/\/+$/, "");
}

function validatedApiBase(value) {
  const apiBase = normalizeApiBase(value);
  try {
    const url = new URL(apiBase);
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error();
    return url.href.replace(/\/+$/, "");
  } catch {
    throw new Error("Adres API musi byc pelnym adresem http/https.");
  }
}

function selectedApiSource() {
  return API_SOURCES[dataSourceInput.value] || API_SOURCES[DEFAULT_DATA_SOURCE];
}

function apiSourceByName(name) {
  return API_SOURCES[name] || API_SOURCES[DEFAULT_DATA_SOURCE];
}

function sourceLabel(name) {
  return apiSourceByName(name).label || name;
}

function syncApiBaseFromSource() {
  const source = selectedApiSource();
  if (dataSourceInput.value !== "custom") {
    apiBaseInput.value = source.apiBase;
  }
}

function settingsForSource(baseSettings, sourceName) {
  const source = apiSourceByName(sourceName);
  return {
    ...baseSettings,
    apiBase: sourceName === baseSettings.sourceName ? baseSettings.apiBase : source.apiBase,
    sourceName
  };
}

function candidateSettings(baseSettings) {
  const source = apiSourceByName(baseSettings.sourceName);
  if (source.requiresKey || baseSettings.sourceName === "custom") return [baseSettings];

  const names = [baseSettings.sourceName, ...FREE_FALLBACK_SOURCES].filter((name, index, list) => list.indexOf(name) === index);
  return names.map((name) => settingsForSource(baseSettings, name));
}

function buildRadiusUrl(settings) {
  const source = apiSourceByName(settings.sourceName);
  if (source.radiusStyle === "point") {
    return `${settings.apiBase}/point/${settings.lat}/${settings.lon}/${settings.dist}`;
  }
  return `${settings.apiBase}/lat/${settings.lat}/lon/${settings.lon}/dist/${settings.dist}`;
}

function buildHexUrl(settings, icao) {
  const source = apiSourceByName(settings.sourceName);
  const endpointHex = source.hexCollection ? `${icao},` : icao;
  return `${settings.apiBase}/hex/${endpointHex}`;
}

function buildCallsignUrls(settings, callsign) {
  const clean = normalizeCallsign(callsign);
  if (!clean) return [];
  const source = apiSourceByName(settings.sourceName);
  if (source.hexCollection) {
    return [`${settings.apiBase}/call/${encodeURIComponent(clean)}`];
  }
  return [`${settings.apiBase}/callsign/${encodeURIComponent(clean)}`];
}

function buildRegistrationUrls(settings, registration) {
  const clean = cleanAircraftRegistration(registration).toUpperCase();
  if (!clean) return [];
  const source = apiSourceByName(settings.sourceName);
  if (source.hexCollection) {
    return [`${settings.apiBase}/registration/${encodeURIComponent(clean)}`];
  }
  return [
    `${settings.apiBase}/reg/${encodeURIComponent(clean)}`,
    `${settings.apiBase}/registration/${encodeURIComponent(clean)}`
  ];
}

function looksLikeRegistration(value) {
  const clean = cleanAircraftRegistration(value).toUpperCase();
  return /^[A-Z0-9]{1,3}-[A-Z0-9]{2,5}$/.test(clean) || /^N[0-9][A-Z0-9]{1,5}$/.test(clean);
}

function iataFlightToLikelyCallsigns(value) {
  const clean = normalizeSearchText(value).replace(/-/g, "");
  const match = clean.match(/^([A-Z]{2})([0-9]{1,4}[A-Z]?)$/);
  if (!match) return [];
  const airlineMap = {
    BA: "BAW", BT: "BTI", FR: "RYR", W6: "WZZ", LO: "LOT", LH: "DLH", KL: "KLM", AF: "AFR",
    UA: "UAL", AA: "AAL", DL: "DAL", EK: "UAE", QR: "QTR", TK: "THY", LX: "SWR", OS: "AUA",
    SK: "SAS", AY: "FIN", EI: "EIN", IB: "IBE", VY: "VLG", U2: "EZY", LS: "EXS", PC: "PGT"
  };
  const prefix = airlineMap[match[1]];
  return prefix ? [`${prefix}${match[2]}`] : [];
}

async function fetchJsonWithFallback(url, settings, headers = {}, options = {}) {
  const source = apiSourceByName(settings.sourceName);
  const timeoutMs = options.timeoutMs || FETCH_TIMEOUT_MS;
  const allowProxy = options.allowProxy !== false;
  const attempts = [url];
  if (allowProxy && source.allowProxy && !settings.apiKey) {
    attempts.push(...CORS_PROXY_BUILDERS.map((builder) => builder(url)));
  }

  let lastError = null;
  for (const attemptUrl of attempts) {
    try {
      const proxied = attemptUrl !== url;
      const response = await fetchWithTimeout(attemptUrl, {
        headers: proxied ? { "Accept": "application/json" } : headers
      }, timeoutMs);
      if (!response.ok) throw new Error(`API zwróciło błąd ${response.status}.`);
      return await response.json();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Nie udało się pobrać danych.");
}

async function fetchAircraftFromCandidate(candidate, headers) {
  const data = await fetchJsonWithFallback(buildRadiusUrl(candidate), candidate, headers, {
    timeoutMs: RADIUS_FETCH_TIMEOUT_MS,
    allowProxy: true
  });
  const aircraft = aircraftListFromResponse(data)
    .filter((item) => isValidIcao(normalizeIcao(item.hex || "")))
    .map((item) => ({ ...item, _sourceName: sourceLabel(candidate.sourceName) }));
  return { aircraft, candidate, sourceName: sourceLabel(candidate.sourceName) };
}

async function fetchFirstAircraftResult(settings, headers) {
  const candidates = candidateSettings(settings);
  if (candidates.length === 1) {
    return fetchAircraftFromCandidate(candidates[0], headers);
  }

  let firstEmptyResult = null;
  let firstRealError = null;
  const probes = candidates.map((candidate) => fetchAircraftFromCandidate(candidate, headers).then((result) => {
    if (result.aircraft.length) return result;
    if (!firstEmptyResult) firstEmptyResult = result;
    const error = new Error("Źródło zwróciło pustą listę.");
    error.emptyResult = result;
    throw error;
  }).catch((error) => {
    if (error.emptyResult && !firstEmptyResult) firstEmptyResult = error.emptyResult;
    if (!error.emptyResult && !firstRealError) firstRealError = error;
    throw error;
  }));

  try {
    return await Promise.any(probes);
  } catch (error) {
    if (firstEmptyResult) return firstEmptyResult;
    if (error instanceof AggregateError) {
      const usefulError = error.errors?.find((item) => !item.emptyResult) || error.errors?.[0];
      throw usefulError || new Error("Nie udało się pobrać danych.");
    }
    throw firstRealError || error || new Error("Nie udało się pobrać danych.");
  }
}

async function fetchAircraftByHex(icao, options = {}) {
  const cleanIcao = normalizeIcao(icao);
  if (!isValidIcao(cleanIcao)) return null;

  if (options.preferCache !== false) {
    const cached = findAircraftByIcaoInCache(cleanIcao);
    if (cached) return cached;
  }

  const settings = readApiOnlySettings();
  const headers = { "Accept": "application/json" };
  if (settings.apiKey) headers["X-Api-Key"] = settings.apiKey;

  const candidates = options.fallbackAllSources === false ? [settings] : candidateSettings(settings);
  let lastError = null;
  for (const candidate of candidates) {
    try {
      const data = await fetchJsonWithFallback(buildHexUrl(candidate, cleanIcao), candidate, headers, {
        timeoutMs: options.timeoutMs || HEX_FETCH_TIMEOUT_MS,
        allowProxy: options.allowProxy === true
      });
      const aircraft = aircraftListFromResponse(data)
        .filter((item) => isValidIcao(aircraftIcao(item)))
        .map((item) => ({ ...item, _sourceName: sourceLabel(candidate.sourceName) }));
      const match = aircraft.find((item) => aircraftIcao(item) === cleanIcao) || null;
      if (match) return match;
      if (aircraft.length) {
        lastError = new Error(`Źródło ${sourceLabel(candidate.sourceName)} zwróciło inny samolot niż ${cleanIcao.toUpperCase()}.`);
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) throw lastError;
  return null;
}

async function fetchStaticAircraftByHex(icao, options = {}) {
  const cleanIcao = normalizeIcao(icao);
  if (!isValidIcao(cleanIcao)) return null;
  const url = `${ADSBDB_AIRCRAFT_API_BASE_URL}${cleanIcao.toUpperCase()}`;
  const attempts = [url, ...CORS_PROXY_BUILDERS.map((builder) => builder(url))];
  let lastError = null;
  for (const attemptUrl of attempts) {
    try {
      const response = await fetchWithTimeout(attemptUrl, { headers: { "Accept": "application/json" } }, options.timeoutMs || WATCHLIST_STATIC_LOOKUP_TIMEOUT_MS);
      if (!response.ok) throw new Error(`Baza statyczna zwróciła ${response.status}.`);
      const data = await response.json();
      return aircraftFromStaticDatabaseResponse(cleanIcao, data);
    } catch (error) {
      lastError = error;
    }
  }
  if (options.throwOnError) throw lastError || new Error("Nie udało się pobrać danych statycznych samolotu.");
  return null;
}

async function fetchAircraftByEndpointUrls(settings, urls, headers, options = {}) {
  let lastError = null;
  for (const url of urls) {
    try {
      const data = await fetchJsonWithFallback(url, settings, headers, {
        timeoutMs: options.timeoutMs || HEX_FETCH_TIMEOUT_MS,
        allowProxy: options.allowProxy !== false
      });
      const aircraft = aircraftListFromResponse(data)
        .filter((item) => isValidIcao(normalizeIcao(item.hex || item.icao || item.icao24 || "")))
        .map((item) => ({ ...item, _sourceName: sourceLabel(settings.sourceName) }));
      if (aircraft.length) return aircraft[0];
    } catch (error) {
      lastError = error;
    }
  }
  if (lastError) throw lastError;
  return null;
}

async function fetchAircraftByLiveQuery(rawValue, options = {}) {
  const raw = String(rawValue || "").trim();
  if (!raw) return null;

  const directIcao = explicitIcaoFromInput(raw);
  if (isValidIcao(directIcao)) {
    return fetchAircraftByHex(directIcao, {
      preferCache: false,
      fallbackAllSources: options.fallbackAllSources !== false,
      timeoutMs: options.timeoutMs || HEX_FETCH_TIMEOUT_MS,
      allowProxy: options.allowProxy !== false
    });
  }

  const settings = readApiOnlySettings();
  const headers = { "Accept": "application/json" };
  if (settings.apiKey) headers["X-Api-Key"] = settings.apiKey;

  const cleanCallsign = normalizeCallsign(raw);
  const cleanReg = cleanAircraftRegistration(raw).toUpperCase();
  const callsignCandidates = [...new Set([cleanCallsign, ...iataFlightToLikelyCallsigns(raw)].filter(Boolean))];
  const candidates = candidateSettings(settings);
  let lastError = null;

  for (const candidate of candidates) {
    const endpointSets = [];
    for (const callsign of callsignCandidates) endpointSets.push(buildCallsignUrls(candidate, callsign));
    // Rejestracja / numer boczny: próbujemy nie tylko formaty z myślnikiem,
    // ale też wpisy typu SPABC, N123AB, 0112, 7701, boczny/serial.
    // Część darmowych źródeł obsługuje /reg/ lub /registration/ i sama zwraca brak wyniku,
    // więc lepiej sprawdzić tę ścieżkę niż od razu odrzucać wpis.
    if (cleanReg.length >= 2 && cleanReg.length <= 12) endpointSets.push(buildRegistrationUrls(candidate, cleanReg));
    if (cleanReg.length > 3 && !cleanReg.includes("-")) {
      const withDash = cleanReg.replace(/^([A-Z]{1,3})([A-Z0-9]{2,6})$/, "$1-$2");
      if (withDash !== cleanReg) endpointSets.push(buildRegistrationUrls(candidate, withDash));
    }

    for (const urls of endpointSets) {
      try {
        const aircraft = await fetchAircraftByEndpointUrls(candidate, urls, headers, options);
        if (aircraft) return aircraft;
      } catch (error) {
        lastError = error;
      }
    }
  }

  if (lastError) throw lastError;
  return null;
}

function offlineAircraftRecordFromIcao(icao, sourceText = "obserwowany bez pozycji LIVE") {
  const cleanIcao = normalizeIcao(icao);
  return {
    hex: cleanIcao,
    icao: cleanIcao,
    flight: cleanIcao.toUpperCase(),
    r: "",
    t: "",
    _offlineWatchOnly: true,
    _sourceName: sourceText
  };
}

function aircraftFromStaticDatabaseResponse(icao, data) {
  const cleanIcao = normalizeIcao(icao);
  const root = data?.response?.aircraft || data?.response || data?.aircraft || data || {};
  const registration = firstFilled(root.registration, root.reg, root.n_number, root.tail, "");
  const type = firstFilled(root.type, root.icao_type, root.icaoType, root.aircraft_type, root.model, root.aircraft, root.description, "");
  const manufacturer = firstFilled(root.manufacturer, root.make, "");
  const owner = firstFilled(root.registered_owner, root.owner, root.operator, root.airline, root.op, "");
  const label = firstFilled(type, registration, owner, cleanIcao.toUpperCase());
  return {
    ...offlineAircraftRecordFromIcao(cleanIcao, "baza statyczna"),
    flight: label,
    name: label,
    r: registration,
    registration,
    t: type,
    type,
    desc: [manufacturer, owner].filter(Boolean).join(" • "),
    operator: owner,
    _staticKnown: Boolean(registration || type || owner || manufacturer)
  };
}

function normalizeSearchText(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9-]/g, "");
}

function aircraftSearchValues(aircraft) {
  const rawValues = [
    aircraft?.hex,
    aircraft?.icao,
    aircraft?.icao24,
    aircraft?.flight,
    aircraft?.callsign,
    aircraft?.call,
    aircraft?.r,
    aircraft?.reg,
    aircraft?.registration,
    aircraft?.tail,
    aircraft?.tailNumber,
    aircraft?.tail_number,
    aircraft?.serial,
    aircraft?.serialNumber,
    aircraft?.militarySerial,
    aircraft?.squawk,
    aircraft?.t,
    aircraft?.type,
    aircraft?.aircraftType,
    aircraft?.name,
    aircraft?.routeShort,
    aircraft?.routeVerbose
  ].filter(Boolean);

  const values = new Set();
  for (const value of rawValues) {
    const normalized = normalizeSearchText(value);
    if (!normalized) continue;
    values.add(normalized);
    values.add(normalized.replace(/-/g, ""));
    values.add(normalized.replace(/^0+/, ""));
  }
  return Array.from(values).filter(Boolean);
}

function findAircraftBySmartQuery(rawValue) {
  const query = normalizeSearchText(rawValue);
  if (!query) return null;

  const sources = [
    ...lastAircraftCache,
    ...loadFlights(),
    ...loadWatchlist()
  ];

  let fallback = null;
  for (const item of sources) {
    const values = aircraftSearchValues(item);
    if (values.some((value) => value === query)) return item;
    if (!fallback && values.some((value) => value.includes(query) || query.includes(value))) {
      fallback = item;
    }
  }
  return fallback;
}

function findAircraftByExactSearchQuery(rawValue) {
  const query = normalizeSearchText(rawValue);
  if (!query) return null;

  const sources = [
    ...lastAircraftCache,
    ...loadFlights(),
    ...loadWatchlist()
  ];

  return sources.find((item) => aircraftSearchValues(item).some((value) => value === query)) || null;
}

function aircraftMatchesSearchInput(aircraft, rawValue) {
  const raw = String(rawValue || '').trim();
  const directIcao = explicitIcaoFromInput(raw);
  if (isValidIcao(directIcao)) return aircraftIcao(aircraft) === directIcao;

  const query = normalizeSearchText(raw);
  if (!query) return false;

  const values = aircraftSearchValues(aircraft);
  if (values.some((value) => value === query)) return true;

  const likelyCallsigns = iataFlightToLikelyCallsigns(raw).map(normalizeSearchText);
  return likelyCallsigns.length > 0 && values.some((value) => likelyCallsigns.includes(value));
}

function resolveSmartFlightInput(rawValue) {
  const raw = String(rawValue || "").trim();
  const directIcao = explicitIcaoFromInput(raw);
  if (isValidIcao(directIcao)) {
    const match = findAircraftBySmartQuery(directIcao);
    const point = match ? pointFromAircraft(match) : null;
    return {
      icao: directIcao,
      name: match ? aircraftLabel(match) : (nameInput.value.trim() || directIcao.toUpperCase()),
      lat: point ? String(point.lat) : latInput.value.trim(),
      lon: point ? String(point.lon) : lonInput.value.trim()
    };
  }

  const rememberedIcao = normalizeIcao(icaoInput.dataset.resolvedIcao || "");
  if (isValidIcao(rememberedIcao) && raw && raw === nameInput.value.trim()) {
    return {
      icao: rememberedIcao,
      name: nameInput.value.trim() || rememberedIcao.toUpperCase(),
      lat: latInput.value.trim(),
      lon: lonInput.value.trim()
    };
  }

  const match = findAircraftBySmartQuery(raw);
  if (match) {
    const icao = normalizeIcao(match.hex || match.icao || "");
    if (isValidIcao(icao)) {
      const point = pointFromAircraft(match);
      return {
        icao,
        name: aircraftLabel(match),
        lat: point ? String(point.lat) : firstFilled(match.lat, latInput.value),
        lon: point ? String(point.lon) : firstFilled(match.lon, lonInput.value)
      };
    }
  }

  throw new Error("Nie rozpoznałem wpisu. Wpisz 6-znakowy hex, callsign, rejestrację, numer boczny albo najpierw pobierz samoloty, żeby program mógł znaleźć samolot lokalnie.");
}

async function fetchWithTimeout(url, options = {}, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      cache: "no-store",
      signal: controller.signal
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error(`Przekroczono czas oczekiwania po ${Math.round(timeoutMs / 1000)} s.`);
    }
    if (!navigator.onLine) {
      throw new Error("Brak internetu w telefonie albo przeglądarka jest offline.");
    }
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
}

function explainFetchError(error) {
  if (!navigator.onLine) return "telefon nie ma aktywnego internetu";
  if (error?.name === "AbortError") return "przekroczono czas oczekiwania na API";
  if (error?.message) return error.message;
  return "nieznany błąd sieci";
}

async function fetchRouteset(planes) {
  let lastError = null;
  const safePlanes = (planes || []).map((plane) => ({
    callsign: normalizeCallsign(plane.callsign),
    lat: Number.isFinite(Number(plane.lat)) ? Number(plane.lat) : 0,
    lng: Number.isFinite(Number(plane.lng)) ? Number(plane.lng) : 0
  })).filter((plane) => plane.callsign);

  for (const url of ROUTE_API_URLS) {
    try {
      const response = await fetchWithTimeout(url, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({ planes: safePlanes })
      }, 15000);
      if (!response.ok) throw new Error(`API trasy ${url} zwróciło błąd ${response.status}.`);
      const text = await response.text();
      return parseJsonLoose(text) || [];
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("Nie udało się pobrać tras z API.");
}

async function fetchAdsbDbRoute(callsign) {
  const clean = normalizeCallsign(callsign);
  if (!clean) return null;
  const response = await fetchWithTimeout(`${ADSBDB_CALLSIGN_API_BASE_URL}${encodeURIComponent(clean)}`, {
    method: "GET",
    headers: { "Accept": "application/json" }
  }, 8000);
  if (!response.ok) return null;
  const text = await response.text();
  return normalizeRouteResult(parseJsonLoose(text), clean);
}
