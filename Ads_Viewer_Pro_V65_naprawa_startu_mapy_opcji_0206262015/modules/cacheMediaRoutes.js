// ADS Viewer Pro - cacheMediaRoutes.js
// Wydzielone z app.js w wersji V59. Klasyczny skrypt, funkcje globalne.
function photoCache() {
  const cache = storageJsonGet(PHOTO_CACHE_STORAGE_KEY, {});
  return cache && typeof cache === "object" ? cache : {};
}

function savePhotoCache(cache) {
  storageJsonSet(PHOTO_CACHE_STORAGE_KEY, pruneCacheBySavedAt(cache, PHOTO_CACHE_MAX_ENTRIES, PHOTO_CACHE_MAX_AGE_MS));
}

function cleanAircraftRegistration(value) {
  return String(value || "").trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
}

function aircraftPhotoLookupKeys(aircraft) {
  const reg = cleanAircraftRegistration(firstFilled(aircraft?.r, aircraft?.registration));
  const hex = normalizeIcao(firstFilled(aircraft?.hex, aircraft?.icao));
  const keys = [];
  if (reg) keys.push({ type: "reg", value: reg });
  if (hex) keys.push({ type: "hex", value: hex });
  return keys;
}

function photoUrlFromPlanespottersResponse(data) {
  const photos = Array.isArray(data?.photos) ? data.photos : [];
  const first = photos[0];
  if (!first) return "";
  return first?.thumbnail_large?.src || first?.thumbnail?.src || first?.thumbnail_large || first?.thumbnail || first?.link || first?.src || "";
}

const realPhotoQueue = [];
let realPhotoQueueRunning = 0;
const REAL_PHOTO_QUEUE_LIMIT = 2;

function enqueueRealAircraftPhoto(task) {
  if (typeof task !== "function") return;
  realPhotoQueue.push(task);
  drainRealAircraftPhotoQueue();
}

function drainRealAircraftPhotoQueue() {
  while (realPhotoQueueRunning < REAL_PHOTO_QUEUE_LIMIT && realPhotoQueue.length) {
    const task = realPhotoQueue.shift();
    realPhotoQueueRunning += 1;
    Promise.resolve()
      .then(task)
      .catch(() => {})
      .finally(() => {
        realPhotoQueueRunning = Math.max(0, realPhotoQueueRunning - 1);
        window.setTimeout(drainRealAircraftPhotoQueue, 80);
      });
  }
}

function scheduleRealAircraftPhoto(task) {
  const start = () => enqueueRealAircraftPhoto(task);
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(start, { timeout: 1800 });
  } else {
    window.setTimeout(start, 900);
  }
}

async function findRealAircraftPhotoUrl(aircraft) {
  const keys = aircraftPhotoLookupKeys(aircraft);
  if (!keys.length) return "";

  const cache = photoCache();
  for (const key of keys) {
    const cacheKey = `${key.type}:${key.value}`;
    const cached = cache[cacheKey];
    if (cached && Date.now() - cached.savedAt < 7 * 24 * 60 * 60 * 1000) {
      return cached.url || "";
    }
  }

  for (const key of keys) {
    const cacheKey = `${key.type}:${key.value}`;
    try {
      const url = `${PLANESPOTTERS_PHOTO_BASE_URL}/${key.type}/${encodeURIComponent(key.value)}`;
      const response = await fetchWithTimeout(url, { headers: { "Accept": "application/json" } }, 4500);
      if (!response.ok) continue;
      const photoUrl = photoUrlFromPlanespottersResponse(await response.json());
      cache[cacheKey] = { url: photoUrl || "", savedAt: Date.now() };
      savePhotoCache(cache);
      if (photoUrl) return photoUrl;
    } catch {
      cache[cacheKey] = { url: "", savedAt: Date.now() };
      savePhotoCache(cache);
    }
  }
  return "";
}

function setAircraftPhoto(img, aircraft, options = {}) {
  if (!img) return;
  const source = aircraft || {};
  const compact = options.compact || img.classList.contains("flight-thumb");
  const photoToken = `${normalizeIcao(firstFilled(source.hex, source.icao))}|${cleanAircraftRegistration(firstFilled(source.r, source.registration))}|${aircraftCallsign(source)}`;
  img.dataset.photoToken = photoToken;
  delete img.dataset.realPhoto;
  img.src = compact ? aircraftMiniIconDataUrl(source) : aircraftThumbDataUrl(source);
  img.alt = `Grafika poglądowa: ${aircraftGroupLabel(aircraftTypeGroup(source))}`;
  img.loading = "lazy";

  const shouldLoadRealPhoto = options.realPhoto !== false && (options.forceRealPhoto === true || readPerformanceSettings().showRealPhotos);
  if (shouldLoadRealPhoto) {
    scheduleRealAircraftPhoto(async () => {
      if (!img.isConnected || img.dataset.photoToken !== photoToken) return;
      const photoUrl = await findRealAircraftPhotoUrl(source);
      if (!photoUrl || img.dataset.photoToken !== photoToken) return;
      img.src = photoUrl;
      img.alt = `Zdjęcie samolotu ${aircraftLabel(source)}`;
      img.dataset.realPhoto = "1";
      img.classList.add("has-real-photo");
    });
  }
}

function createAircraftPhoto(aircraft, className = "aircraft-photo", options = {}) {
  const img = document.createElement("img");
  img.className = className;
  setAircraftPhoto(img, aircraft || {}, options);
  return img;
}

function loadRouteCache() {
  const cache = storageJsonGet(ROUTE_CACHE_STORAGE_KEY, {});
  return cache && typeof cache === "object" ? cache : {};
}

function saveRouteCache(cache) {
  storageJsonSet(ROUTE_CACHE_STORAGE_KEY, pruneCacheBySavedAt(cache, ROUTE_CACHE_MAX_ENTRIES, ROUTE_CACHE_MAX_AGE_MS));
}

function routeFromCache(cache, callsign) {
  const item = cache[callsign];
  if (!item || !item.route || !item.savedAt) return null;
  if (Date.now() - item.savedAt > ROUTE_CACHE_MAX_AGE_MS) return null;
  return item.route;
}

function parseJsonLoose(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function flightRouteRoot(route) {
  if (!route || typeof route !== "object") return null;
  return route.flightroute || route.response?.flightroute || route.data?.flightroute || null;
}

function normalizeAirportForRoute(airport) {
  if (!airport || typeof airport !== "object") return null;
  const iata = firstRouteValue(airport.iata, airport.iata_code, airport.iataCode);
  const icao = firstRouteValue(airport.icao, airport.icao_code, airport.icaoCode, airport.ident);
  const code = firstRouteValue(airport.code, airport.ident, iata, icao);
  const name = firstRouteValue(airport.name, airport.airport, airport.municipality, airport.city, airport.location);
  const lat = numericFirst(airport.lat, airport.latitude, airport.latDeg, airport.lat_deg, airport.position?.lat, airport.location?.lat, airport.geo?.lat);
  const lon = numericFirst(airport.lon, airport.lng, airport.longitude, airport.lonDeg, airport.lon_deg, airport.position?.lon, airport.position?.lng, airport.location?.lon, airport.location?.lng, airport.geo?.lon);
  if (!code && !name) return null;

  return {
    ...airport,
    iata: iata || airport.iata,
    icao: icao || airport.icao,
    code: code || airport.code,
    ident: icao || code || airport.ident,
    name: name || airport.name,
    city: firstRouteValue(airport.city, airport.municipality, airport.location) || airport.city,
    lat: Number.isFinite(lat) ? lat : airport.lat,
    lon: Number.isFinite(lon) ? lon : airport.lon
  };
}

function routeAirportCandidates(route) {
  const root = flightRouteRoot(route);
  const origin = normalizeAirportForRoute(root?.origin || route.originAirport || route.fromAirport || route.departureAirport || route.origin || route.from || route.departure || route.dep);
  const destination = normalizeAirportForRoute(root?.destination || route.destinationAirport || route.toAirport || route.arrivalAirport || route.destination || route.to || route.arrival || route.arr || route.dest);
  return origin && destination ? [origin, destination] : [];
}

function normalizeRouteResult(route, callsign = "") {
  if (!route || typeof route !== "object") return null;
  const directAirports = routeAirports(route).map((airport) => normalizeAirportForRoute(airport) || airport).filter(Boolean);
  if (directAirports.length >= 2) {
    return {
      ...route,
      callsign: normalizeCallsign(route.callsign || route.flight || callsign),
      _airports: directAirports,
      confirmed: route.confirmed !== false
    };
  }

  const airportCandidates = routeAirportCandidates(route);
  if (airportCandidates.length >= 2) {
    const fromAirport = airportCandidates[0];
    const toAirport = airportCandidates[airportCandidates.length - 1];
    const from = routeAirportLabel(fromAirport);
    const to = routeAirportLabel(toAirport);
    if (from && to) {
      return {
        ...route,
        callsign: normalizeCallsign(route.callsign || route.flight || route?.response?.callsign || callsign),
        from,
        to,
        verbose: `${routeAirportVerbose(fromAirport)} → ${routeAirportVerbose(toAirport)}`,
        _airports: airportCandidates,
        confirmed: route.confirmed !== false
      };
    }
  }

  const root = flightRouteRoot(route);
  const from = firstRouteValue(
    route.from,
    route.origin,
    route.departure,
    route.dep,
    route.fromAirport,
    route.originAirport,
    route.departureAirport,
    root?.origin?.iata_code,
    root?.origin?.icao_code,
    route?.response?.flightroute?.origin?.iata_code,
    route?.response?.flightroute?.origin?.icao_code
  );
  const to = firstRouteValue(
    route.to,
    route.destination,
    route.dest,
    route.arrival,
    route.arr,
    route.toAirport,
    route.destinationAirport,
    route.arrivalAirport,
    root?.destination?.iata_code,
    root?.destination?.icao_code,
    route?.response?.flightroute?.destination?.iata_code,
    route?.response?.flightroute?.destination?.icao_code
  );
  if (!from || !to) return null;

  const originName = firstRouteValue(
    root?.origin?.name,
    root?.origin?.municipality,
    route?.response?.flightroute?.origin?.name,
    route?.response?.flightroute?.origin?.municipality
  );
  const destName = firstRouteValue(
    root?.destination?.name,
    root?.destination?.municipality,
    route?.response?.flightroute?.destination?.name,
    route?.response?.flightroute?.destination?.municipality
  );

  return {
    callsign: normalizeCallsign(route.callsign || route.flight || route?.response?.callsign || callsign),
    from,
    to,
    verbose: `${originName || from} → ${destName || to}`,
    confirmed: route.confirmed !== false
  };
}

function routeEntriesFromResponse(rawRoutes) {
  if (!rawRoutes) return [];
  if (Array.isArray(rawRoutes)) {
    return rawRoutes.map((route) => [route?.callsign || route?.flight || route?.hex || "", route]);
  }
  const root = rawRoutes.routes || rawRoutes.results || rawRoutes.planes || rawRoutes.response || rawRoutes;
  if (Array.isArray(root)) {
    return root.map((route) => [route?.callsign || route?.flight || route?.hex || "", route]);
  }
  if (root && typeof root === "object") {
    return Object.entries(root).map(([key, value]) => [value?.callsign || value?.flight || key, Array.isArray(value) ? { callsign: key, _airports: value } : value]);
  }
  return [];
}

async function enrichAircraftRoutes(aircraft) {
  const cache = loadRouteCache();
  const toLookup = [];
  const seen = new Set();

  for (const item of aircraft.slice(0, 120)) {
    const callsign = aircraftCallsign(item);
    if (!callsign || seen.has(callsign)) continue;
    seen.add(callsign);
    const cached = routeFromCache(cache, callsign);
    if (cached) {
      item._route = cached;
      continue;
    }
    const point = pointFromAircraft(item);
    toLookup.push({
      callsign,
      lat: point?.lat ?? 0,
      lng: point?.lon ?? 0
    });
  }

  if (!toLookup.length) return;

  const now = Date.now();
  const byCallsign = new Map();

  try {
    const rawRoutes = await fetchRouteset(toLookup);
    for (const [rawCallsign, rawRoute] of routeEntriesFromResponse(rawRoutes)) {
      const callsign = normalizeCallsign(rawCallsign || rawRoute?.callsign || rawRoute?.flight || "");
      const route = normalizeRouteResult(rawRoute, callsign);
      if (!callsign || !route) continue;
      cache[callsign] = { route, savedAt: now };
      byCallsign.set(callsign, route);
    }
  } catch {
    // Pierwsze źródło tras bywa niedostępne albo blokowane przez CORS. Niżej działa zapasowe uzupełnianie po callsign.
  }

  const missing = toLookup.filter((plane) => !byCallsign.has(plane.callsign) && !routeFromCache(cache, plane.callsign)).slice(0, 25);
  for (const plane of missing) {
    try {
      const route = await fetchAdsbDbRoute(plane.callsign);
      if (!route) continue;
      cache[plane.callsign] = { route, savedAt: now };
      byCallsign.set(plane.callsign, route);
    } catch {
      // Zapasowe API jest dodatkiem. Brak trasy nie może zatrzymać radaru.
    }
  }

  saveRouteCache(cache);
  for (const item of aircraft) {
    const callsign = aircraftCallsign(item);
    const route = byCallsign.get(callsign) || routeFromCache(cache, callsign);
    if (route) item._route = route;
  }
}

function applyCachedRoutesToAircraft(aircraft) {
  const cache = loadRouteCache();
  for (const item of aircraft || []) {
    const route = routeFromCache(cache, aircraftCallsign(item));
    if (route) item._route = route;
  }
}

function refreshSelectedAircraftRouteUi() {
  if (!selectedAircraft) return;
  const updated = findAircraftByIcaoInCache(aircraftIcao(selectedAircraft));
  if (updated) selectedAircraft = updated;
  if (aircraftSheet?.classList.contains("is-open")) {
    showSelectedAircraftSheet(selectedAircraft);
    if (aircraftSheetMorePanel && !aircraftSheetMorePanel.hidden) {
      renderAircraftDetailsPanel(selectedAircraft);
    }
  }
  if (routeLayer && routeSummary?.textContent) drawSelectedAircraftRoute(selectedAircraft, { fitMap: false });
}

function trackKey(icao, date) {
  return `${normalizeIcao(icao)}:${date || todayLocalDate()}`;
}

function loadTracks() {
  const tracks = storageJsonGet(TRACK_STORAGE_KEY, {});
  return tracks && typeof tracks === "object" ? tracks : {};
}

function loadHistoryTraceCache() {
  const traces = storageJsonGet(HISTORY_TRACE_STORAGE_KEY, {});
  return traces && typeof traces === "object" ? traces : {};
}

function historyTraceCacheItem(points, source = "", requestLabel = "") {
  const clean = Array.isArray(points) ? points.filter(validPoint) : [];
  return {
    savedAt: Date.now(),
    source,
    requestLabel,
    pointCount: clean.length,
    firstAt: clean[0]?.at || "",
    lastAt: clean[clean.length - 1]?.at || "",
    points: clean.slice(-MAX_HISTORY_TRACE_POINTS)
  };
}

function pruneHistoryTraceCache(cache) {
  return Object.fromEntries(
    Object.entries(cache || {})
      .filter(([key, item]) => /^[a-f0-9]{6}:\d{4}-\d{2}-\d{2}$/.test(key) && item && typeof item === "object" && Array.isArray(item.points) && item.points.length)
      .sort(([, a], [, b]) => Number(b.savedAt || 0) - Number(a.savedAt || 0))
      .slice(0, HISTORY_TRACE_CACHE_MAX_ENTRIES)
      .map(([key, item]) => [key, {
        ...item,
        pointCount: Array.isArray(item.points) ? item.points.length : Number(item.pointCount || 0),
        points: Array.isArray(item.points) ? item.points.filter(validPoint).slice(-MAX_HISTORY_TRACE_POINTS) : []
      }])
  );
}

function saveHistoryTraceCache(cache) {
  storageJsonSet(HISTORY_TRACE_STORAGE_KEY, pruneHistoryTraceCache(cache));
}

function loadHistoryTracePoints(icao, date) {
  const cleanIcao = normalizeIcao(icao);
  const key = trackKey(cleanIcao, date);
  const cache = loadHistoryTraceCache();
  const item = cache[key];
  if (item && Array.isArray(item.points)) return item.points.filter(validPoint);

  // Migracja awaryjna z wcześniejszych wersji: jeżeli użytkownik miał już zapisaną historię
  // w starym magazynie śladów live, pokaż ją, ale nowy zapis trafi już do osobnego cache historii.
  const legacy = loadTrackPoints(cleanIcao, date).filter(validPoint);
  return legacy;
}

function saveHistoryTracePoints(icao, date, points, meta = {}) {
  const cleanIcao = normalizeIcao(icao);
  const cleanPoints = Array.isArray(points) ? points.filter(validPoint) : [];
  if (!isValidIcao(cleanIcao) || cleanPoints.length < 2) return cleanPoints;

  const key = trackKey(cleanIcao, date);
  const cache = loadHistoryTraceCache();
  const current = Array.isArray(cache[key]?.points) ? cache[key].points.filter(validPoint) : [];
  if (cleanPoints.length >= current.length) {
    cache[key] = historyTraceCacheItem(cleanPoints, meta.source || cache[key]?.source || "", meta.requestLabel || cache[key]?.requestLabel || "");
    saveHistoryTraceCache(cache);
  }
  return cleanPoints;
}

function loadTrackPoints(icao, date) {
  const tracks = loadTracks();
  const points = tracks[trackKey(icao, date)] || [];
  return Array.isArray(points) ? points : [];
}

function loadLatestTrackPoints(icao) {
  const prefix = `${normalizeIcao(icao)}:`;
  const tracks = loadTracks();
  const keys = Object.keys(tracks)
    .filter((key) => key.startsWith(prefix) && Array.isArray(tracks[key]) && tracks[key].length)
    .sort();
  const key = keys[keys.length - 1];
  return key ? { date: key.slice(prefix.length), points: tracks[key] } : { date: "", points: [] };
}

function saveTracePointsIfUseful(icao, date, points, meta = {}) {
  return saveHistoryTracePoints(icao, date, points, meta);
}

function saveTrackPoints(icao, date, points) {
  const tracks = loadTracks();
  tracks[trackKey(icao, date)] = points.slice(-MAX_TRACK_POINTS);
  storageJsonSet(TRACK_STORAGE_KEY, pruneTrackCache(tracks));
}

function addTrackPoint(icao, date, point) {
  if (!validPoint(point)) return loadTrackPoints(icao, date);
  let points = loadTrackPoints(icao, date).filter(validPoint);
  const previous = points[points.length - 1];

  if (previous && shouldBreakTraceSegment(previous, point)) {
    points = [point];
    saveTrackPoints(icao, date, points);
    return points;
  }

  const moved = !previous || Math.abs(previous.lat - point.lat) > 0.0005 || Math.abs(previous.lon - point.lon) > 0.0005;
  if (moved) {
    points.push(point);
    saveTrackPoints(icao, date, points);
  }
  return points;
}

function tracePointsFromData(data) {
  if (!data || !Array.isArray(data.trace)) return [];
  const base = Number(data.timestamp || 0);
  return data.trace
    .map((row) => {
      const lat = Number(row[1]);
      const lon = Number(row[2]);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
      const offset = Number(row[0] || 0);
      const at = base && Number.isFinite(offset) ? new Date((base + offset) * 1000).toISOString() : "";
      return {
        lat,
        lon,
        at,
        altitude: row[3] ?? null,
        speed: row[4] ?? null,
        track: row[5] ?? null
      };
    })
    .filter(Boolean);
}

function traceHeadersForSettings(settings) {
  const headers = { "Accept": "application/json" };
  const key = settings?.apiKey || "";
  if (key) {
    headers["X-Api-Key"] = key;
    headers["api-auth"] = key;
  }
  return headers;
}

function traceSourceCandidates(baseSettings) {
  const names = [baseSettings.sourceName, ...FREE_FALLBACK_SOURCES].filter((name, index, list) => list.indexOf(name) === index);
  const candidates = names.map((name) => settingsForSource(baseSettings, name));
  if (baseSettings.sourceName === "custom") candidates.unshift(baseSettings);
  if (baseSettings.sourceName === "adsbExchange" && baseSettings.apiKey) candidates.unshift(baseSettings);
  return candidates.filter((candidate, index, list) => {
    if (candidate.sourceName === "adsbExchange" && !candidate.apiKey) return false;
    return list.findIndex((item) => item.sourceName === candidate.sourceName && item.apiBase === candidate.apiBase) === index;
  });
}

function uniqueTraceRequests(requests) {
  const seen = new Set();
  return requests.filter((request) => {
    if (!request?.url || seen.has(request.url)) return false;
    seen.add(request.url);
    return true;
  });
}

function safeUrlOrigin(value) {
  try {
    const parsed = new URL(String(value || "").trim());
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return "";
  }
}

function traceDateParts(date) {
  const clean = String(date || "").slice(0, 10);
  const match = clean.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return { year: match[1], month: match[2], day: match[3], clean };
}

function todayUtcDate() {
  return new Date().toISOString().slice(0, 10);
}

function traceBaseUrlsForSettings(settings) {
  const urls = [];
  const add = (value) => {
    const clean = String(value || "").trim().replace(/\/+$/, "");
    if (clean && !urls.includes(clean)) urls.push(clean);
  };

  const configured = normalizeApiBase(settings.apiBase);
  add(configured);
  add(configured.replace(/\/api\/aircraft\/v2$/i, ""));
  add(configured.replace(/\/v2$/i, ""));

  const configuredOrigin = safeUrlOrigin(configured);
  add(configuredOrigin);

  // Ten adres jest tym samym punktem odniesienia, który otwiera przycisk „ADS”.
  // Strona ADS rysuje ślad z plików trace w katalogach data/traces albo globe_history,
  // więc program próbuje te same publiczne ścieżki JSON przed narysowaniem trasy.
  add(ADSB_BASE_URL);
  add(safeUrlOrigin(ADSB_BASE_URL));

  if (settings.sourceName === "adsbLol") {
    add("https://api.adsb.lol");
    add("https://adsb.lol");
  } else if (settings.sourceName === "adsbFi") {
    add("https://opendata.adsb.fi");
    add("https://globe.adsb.fi");
  } else if (settings.sourceName === "adsbOne") {
    add("https://api.adsb.one");
    add("https://globe.adsb.one");
  } else if (settings.sourceName === "airplanesLive") {
    add("https://api.airplanes.live");
    add("https://airplanes.live");
    add("https://globe.airplanes.live");
  } else if (settings.sourceName === "adsbExchange") {
    add("https://gateway.adsbexchange.com/api/aircraft/v2");
    add("https://www.adsbexchange.com/api/aircraft/v2");
    add("https://globe.adsbexchange.com");
  }

  return urls;
}

function addTraceUrlVariants(requests, base, folder, file, label, filterDate, dateInfo = null) {
  const cleanBase = String(base || "").trim().replace(/\/+$/, "");
  if (!cleanBase) return;

  const origin = safeUrlOrigin(cleanBase);
  const apiRoot = cleanBase.replace(/\/v2$/i, "").replace(/\/api\/aircraft\/v2$/i, "");
  const bases = [cleanBase, apiRoot, origin].filter(Boolean)
    .filter((value, index, list) => list.indexOf(value) === index);

  for (const item of bases) {
    requests.push({ url: `${item}/data/traces/${folder}/${file}`, filterDate, label: `${label}/data` });
    requests.push({ url: `${item}/traces/${folder}/${file}`, filterDate, label });
    requests.push({ url: `${item}/api/aircraft/v2/traces/${folder}/${file}`, filterDate, label: `${label}/api` });
  }

  if (dateInfo) {
    for (const item of bases) {
      requests.push({
        url: `${item}/globe_history/${dateInfo.year}/${dateInfo.month}/${dateInfo.day}/traces/${folder}/${file}`,
        filterDate,
        label: `${label}/globe_history`
      });
      requests.push({
        url: `${item}/data/globe_history/${dateInfo.year}/${dateInfo.month}/${dateInfo.day}/traces/${folder}/${file}`,
        filterDate,
        label: `${label}/data_globe_history`
      });
    }
  }
}

function traceUrlsForFlight(settings, flight) {
  const cleanIcao = normalizeIcao(flight?.icao || "");
  if (!isValidIcao(cleanIcao)) return [];

  const folder = cleanIcao.slice(-2);
  const dateInfo = traceDateParts(flight?.date);
  const requestedDate = dateInfo?.clean || todayLocalDate();
  const isCurrentDay = !dateInfo || requestedDate === todayLocalDate() || requestedDate === todayUtcDate();
  const recentFile = `trace_recent_${cleanIcao}.json`;
  const fullFile = `trace_full_${cleanIcao}.json`;

  const requests = [];
  for (const base of traceBaseUrlsForSettings(settings)) {
    // Bieżący lot: najpierw recent trace, czyli ślad używany przez mapę live.
    if (isCurrentDay) {
      addTraceUrlVariants(requests, base, folder, recentFile, "trace_recent", false, null);
      // Awaryjnie sprawdzamy też full, bo różne mirrory mogą mieć różną organizację plików.
      addTraceUrlVariants(requests, base, folder, fullFile, "trace_full", true, dateInfo);
    } else {
      // Lot historyczny: najpierw pełny ślad z globe_history dla konkretnej daty.
      addTraceUrlVariants(requests, base, folder, fullFile, "trace_full", true, dateInfo);
      addTraceUrlVariants(requests, base, folder, recentFile, "trace_recent", true, null);
    }
  }
  return uniqueTraceRequests(requests);
}

async function loadOfficialTraceDetailed(flight, options = {}) {
  const baseSettings = readApiOnlySettings();
  const candidates = traceSourceCandidates(baseSettings);
  let lastError = null;
  let checkedCount = 0;
  const checkedSources = [];
  const timeoutMs = options.timeoutMs || TRACE_FETCH_TIMEOUT_MS;
  const maxRequestsPerSource = Number.isFinite(Number(options.maxRequestsPerSource)) ? Number(options.maxRequestsPerSource) : Infinity;

  for (const candidate of candidates) {
    await yieldToUi();
    const headers = traceHeadersForSettings(candidate);
    const source = apiSourceByName(candidate.sourceName);
    let requests = traceUrlsForFlight(candidate, flight);
    const sourceName = sourceLabel(candidate.sourceName);
    if (Number.isFinite(maxRequestsPerSource)) requests = requests.slice(0, Math.max(1, maxRequestsPerSource));
    if (!checkedSources.includes(sourceName)) checkedSources.push(sourceName);
    if (typeof options.onSourceStart === "function") {
      options.onSourceStart(sourceName, checkedSources.slice());
    }

    for (const request of requests) {
      checkedCount += 1;
      if (typeof options.onRequestProgress === "function") {
        options.onRequestProgress({ sourceName, checkedCount, label: request.label, checkedSources: checkedSources.slice() });
      }
      if (checkedCount % 3 === 0) await yieldToUi();
      try {
        const data = await fetchJsonWithFallback(request.url, candidate, headers, {
          timeoutMs,
          allowProxy: source.allowProxy === true
        });
        const rawPoints = tracePointsFromData(data);
        const points = prepareTracePointsForFlight(rawPoints, flight, { filterDate: request.filterDate });
        if (points.length >= 2) {
          console.info(`Trace OK: ${sourceName} ${request.label}, punkty: ${points.length}, URL: ${request.url}`);
          return {
            points,
            sourceName,
            sourceKey: candidate.sourceName,
            requestLabel: request.label,
            checkedCount,
            checkedSources,
            url: request.url
          };
        }
        lastError = new Error(`Źródło ${sourceName} zwróciło plik trace, ale bez odcinka pasującego do wskazanej daty.`);
      } catch (error) {
        lastError = error;
      }
    }
  }

  const suffix = checkedCount ? ` Sprawdzonych adresów trace: ${checkedCount}. Źródła: ${checkedSources.join(", ")}.` : "";
  throw lastError || new Error(`Nie udało się pobrać śladu lotu z API.${suffix}`);
}

async function loadOfficialTrace(flight) {
  const result = await loadOfficialTraceDetailed(flight);
  return result.points;
}

function stopLiveTracking() {
  if (liveTrackTimer) window.clearInterval(liveTrackTimer);
  liveTrackTimer = null;
  activeTrack = null;
  setRouteSummary("Śledzenie zatrzymane.");
}

async function pollLiveTrack() {
  if (!activeTrack) return;
  try {
    setRouteSummary(`Śledzenie live: odświeżam dane dla ${activeTrack.icao.toUpperCase()}...`);
    const aircraft = await fetchAircraftByHex(activeTrack.icao);
    if (!aircraft) {
      setRouteSummary(`Nie widzę teraz ${activeTrack.icao.toUpperCase()} w danych live.`);
      return;
    }
    const point = pointFromAircraft(aircraft);
    if (!point) {
      setRouteSummary(`Samolot ${activeTrack.icao.toUpperCase()} jest widoczny, ale bez pozycji GPS.`);
      return;
    }
    const points = addTrackPoint(activeTrack.icao, activeTrack.date, point);
    drawRoute(points, activeTrack.name || activeTrack.icao.toUpperCase());
    setRouteSummary(`Śledzenie live: ${activeTrack.icao.toUpperCase()}, punktów ${points.length}. Odświeżanie co ${LIVE_TRACK_INTERVAL_MS / 1000} s.`);
  } catch (error) {
    setRouteSummary(`Nie udało się odświeżyć live: ${error.message}`);
  }
}

async function startLiveTracking(flight = null) {
  const finishBusy = beginBusy("Uruchamiam śledzenie na żywo...");
  try {
    const target = flight || readFormFlight();
    const liveDate = todayLocalDate();
    if (target.date && target.date !== liveDate) {
      dateInput.value = liveDate;
      showToast("Śledzenie live zapisuje dzisiejszy ślad.");
    }
    activeTrack = {
      icao: target.icao,
      date: liveDate,
      name: target.name || target.icao.toUpperCase()
    };
    if (liveTrackTimer) window.clearInterval(liveTrackTimer);
    setRouteSummary(`Uruchamiam śledzenie live dla ${activeTrack.icao.toUpperCase()}...`);
    await pollLiveTrack();
    liveTrackTimer = window.setInterval(pollLiveTrack, LIVE_TRACK_INTERVAL_MS);
    showToast("Śledzenie włączone.");
  } catch (error) {
    showToast(error.message);
  } finally {
    finishBusy();
  }
}

async function refreshAreaAroundFoundAircraft(aircraft, options = {}) {
  const point = pointFromAircraft(aircraft);
  const cleanIcao = aircraftIcao(aircraft);
  if (!point || !isValidIcao(cleanIcao)) return aircraft;

  if (browseLatInput) browseLatInput.value = point.lat.toFixed(5);
  if (browseLonInput) browseLonInput.value = point.lon.toFixed(5);
  const settings = browseSettingsAroundAircraft(aircraft);
  if (!settings) return aircraft;

  setAircraftStatus(`Odświeżam obszar znalezionego samolotu: ${aircraftLabel(aircraft)}...`);
  const headers = { "Accept": "application/json" };
  if (settings.apiKey) headers["X-Api-Key"] = settings.apiKey;

  try {
    const result = await fetchFirstAircraftResult(settings, headers);
    let areaAircraft = Array.isArray(result.aircraft) ? result.aircraft : [];
    const foundInArea = findAircraftByIcaoInCache(cleanIcao, areaAircraft);
    const finalAircraft = foundInArea ? mergeFlightRouteIntoAircraft(foundInArea, aircraft) : aircraft;

    if (!foundInArea) {
      areaAircraft = [finalAircraft, ...areaAircraft.filter((item) => aircraftIcao(item) !== cleanIcao)];
    }

    applyCachedRoutesToAircraft(areaAircraft);
    lastAircraftCache = areaAircraft;
    lastRenderSettings = result.candidate || settings;

    const visibleAircraft = filterAircraftForDisplay(areaAircraft);
    renderAircraft(visibleAircraft, lastRenderSettings);
    renderAircraftMap(visibleAircraft, lastRenderSettings, { preserveView: true });
    updateWatchlistFromAircraft(areaAircraft);
    recordAircraftHistory(areaAircraft);
    checkAircraftAlerts(areaAircraft);
    checkWatchedAircraftGlobalInBackground(areaAircraft);
    enrichAircraftRoutesInBackground(areaAircraft, lastRenderSettings, result.sourceName || sourceLabel(settings.sourceName));

    setAircraftStatus(`Odświeżono obszar znalezionego samolotu: ${aircraftLabel(finalAircraft)}. ${aircraftFilterSummary(areaAircraft.length, visibleAircraft.length, areaAircraft)}.`);
    return finalAircraft;
  } catch (error) {
    const fallbackAircraft = aircraft;
    lastAircraftCache = [fallbackAircraft, ...lastAircraftCache.filter((item) => aircraftIcao(item) !== cleanIcao)];
    renderAircraft(filterAircraftForDisplay(lastAircraftCache), lastRenderSettings || settings);
    renderAircraftMap(filterAircraftForDisplay(lastAircraftCache), lastRenderSettings || settings, { preserveView: true });
    setAircraftStatus(`Nie udało się odświeżyć obszaru po wyszukaniu. Pokazuję znaleziony samolot: ${aircraftLabel(fallbackAircraft)}. ${explainFetchError(error)}.`);
    return fallbackAircraft;
  }
}

async function enrichAircraftRoutesInBackground(aircraft, candidate, sourceName) {
  try {
    await enrichAircraftRoutes(aircraft);
    const visibleAircraft = filterAircraftForDisplay(aircraft);
    renderAircraft(visibleAircraft, candidate);
    renderAircraftMap(visibleAircraft, candidate, { preserveView: true });
    refreshSelectedAircraftRouteUi();
    setAircraftStatus(`Znaleziono ${aircraftFilterSummary(aircraft.length, visibleAircraft.length)}. Źródło: ${sourceName}. Trasy skąd/dokąd zaktualizowane automatycznie.`);
  } catch {
    const visibleAircraft = filterAircraftForDisplay(aircraft);
    setAircraftStatus(`Znaleziono ${aircraftFilterSummary(aircraft.length, visibleAircraft.length)}. Źródło: ${sourceName}. Danych skąd/dokąd nie udało się uzupełnić automatycznie.`);
  }
}

function updateSelectedAircraftAfterRefresh(aircraft) {
  const selectedIcao = aircraftIcao(selectedAircraft);
  if (!selectedIcao) return;
  const updated = findAircraftByIcaoInCache(selectedIcao, aircraft);
  if (!updated) return;
  selectedAircraft = updated;
  updateSelectedAircraftMarkerHighlight();
  if (routeLayer && routeSummary?.textContent) drawSelectedAircraftRoute(updated, { fitMap: false });
  if (aircraftSheet?.classList.contains("is-open")) {
    if (aircraftSheetAltitude) aircraftSheetAltitude.textContent = formatAltitude(updated?.alt_baro);
    if (aircraftSheetSpeed) aircraftSheetSpeed.textContent = formatSpeed(updated?.gs);
    if (aircraftSheetPhaseText) {
      const phase = aircraftFlightPhase(updated);
      aircraftSheetPhaseText.textContent = `${phase.label} • ${phase.detail}`;
    }
    if (aircraftSheetPhaseIcon) aircraftSheetPhaseIcon.innerHTML = aircraftPhaseMarkup(updated);
    updateAircraftSheetRouteProgress(updated);
    updateAircraftSheetLiveDetails(updated);
    if (aircraftSheetMorePanel && !aircraftSheetMorePanel.hidden) {
      renderAircraftDetailsPanel(updated);
    }
  }
}

function startAircraftAutoRefresh() {
  if (aircraftAutoRefreshTimer) return;
  aircraftAutoRefreshTimer = window.setInterval(refreshAircraftInBackground, getAutoRefreshIntervalMs());
}

function restartAircraftAutoRefresh() {
  if (aircraftAutoRefreshTimer) {
    window.clearInterval(aircraftAutoRefreshTimer);
    aircraftAutoRefreshTimer = null;
  }
  startAircraftAutoRefresh();
}

async function refreshFocusedAircraftInBackground() {
  if (isHistoryMapMode()) return;
  const cleanIcao = aircraftIcao(selectedAircraft);
  if (!isValidIcao(cleanIcao)) return;
  try {
    const updated = await fetchAircraftByHex(cleanIcao, { preferCache: false, fallbackAllSources: false, timeoutMs: HEX_FETCH_TIMEOUT_MS, allowProxy: false });
    if (!updated) return;
    applyCachedRoutesToAircraft([updated]);
    selectedAircraft = updated;
    updateSelectedAircraftMarkerHighlight();
    focusAircraftOnMap(updated, { singleMarker: true, showSheet: aircraftSheet?.classList.contains("is-open"), drawRoute: true, centerMap: false });
    enrichAircraftRoutesInBackground([updated], lastRenderSettings || {}, "auto");
    setAircraftStatus(`Auto-odświeżenie: ${aircraftLabel(updated)}.`);
  } catch (error) {
    setAircraftStatus(`Auto-odświeżenie wybranego samolotu nieudane: ${explainFetchError(error)}.`);
  }
}

async function refreshAircraftInBackground() {
  if (aircraftRefreshInProgress || document.hidden) return;
  if (savedMapFocusActive && aircraftIcao(selectedAircraft)) {
    aircraftRefreshInProgress = true;
    try {
      await refreshFocusedAircraftInBackground();
    } finally {
      aircraftRefreshInProgress = false;
    }
    return;
  }
  let settings;
  try {
    settings = readBrowseSettings();
  } catch {
    return;
  }

  aircraftRefreshInProgress = true;
  try {
    const headers = { "Accept": "application/json" };
    if (settings.apiKey) headers["X-Api-Key"] = settings.apiKey;
    const result = await fetchFirstAircraftResult(settings, headers);
    applyCachedRoutesToAircraft(result.aircraft);
    const visibleAircraft = filterAircraftForDisplay(result.aircraft);
    lastAircraftCache = result.aircraft;
    lastRenderSettings = result.candidate;
    renderAircraft(visibleAircraft, result.candidate);
    renderAircraftMap(visibleAircraft, result.candidate, { preserveView: true });
    updateSelectedAircraftAfterRefresh(result.aircraft);
    updateWatchlistFromAircraft(result.aircraft);
    recordAircraftHistory(result.aircraft);
    checkAircraftAlerts(result.aircraft);
    checkWatchedAircraftGlobalInBackground(result.aircraft);
    setAircraftStatus(`Auto-odświeżenie: ${aircraftFilterSummary(result.aircraft.length, visibleAircraft.length)}. Źródło: ${result.sourceName}.`);
    enrichAircraftRoutesInBackground(result.aircraft, result.candidate, result.sourceName);
  } catch (error) {
    setAircraftStatus(`Auto-odświeżenie nieudane: ${explainFetchError(error)}.`);
  } finally {
    aircraftRefreshInProgress = false;
  }
}

async function loadAircraft() {
  setMapMode("live");
  syncBrowseInputsFromMapCenter();
  let settings;
  try {
    settings = readBrowseSettings();
  } catch (error) {
    showToast(error.message);
    return;
  }

  const finishBusy = beginBusy("Pobieram samoloty z API...");
  try {
    setAircraftStatus("Pobieram samoloty...");
    aircraftList.replaceChildren();
    lastAircraftCache = [];
    savedMapFocusActive = false;
    clearAircraftMap();
    if (routeLayer) routeLayer.clearLayers();
    lastRouteBounds = null;

    const headers = { "Accept": "application/json" };
    if (settings.apiKey) headers["X-Api-Key"] = settings.apiKey;

    try {
      const candidates = candidateSettings(settings);
      const sourceNames = candidates.map((candidate) => sourceLabel(candidate.sourceName)).join(" / ");
      setAircraftStatus(`Pobieram samoloty: ${sourceNames}...`);
      setBusyVisible(true, `Pobieram samoloty: ${sourceNames}...`);

      const result = await fetchFirstAircraftResult(settings, headers);
      const aircraft = result.aircraft;
      const candidate = result.candidate;
      const sourceName = result.sourceName;
      applyCachedRoutesToAircraft(aircraft);
      const visibleAircraft = filterAircraftForDisplay(aircraft);

      lastAircraftCache = aircraft;
      lastRenderSettings = candidate;
      setAircraftStatus(`Znaleziono ${aircraft.length} samolotów. Rysuję mapę...`);
      setBusyVisible(true, "Rysuję samoloty na mapie...");
      renderAircraft(visibleAircraft, candidate);
      renderAircraftMap(visibleAircraft, candidate);
      updateWatchlistFromAircraft(aircraft);
      recordAircraftHistory(aircraft);
      checkAircraftAlerts(aircraft);
      checkWatchedAircraftGlobalInBackground(aircraft);
      startAircraftAutoRefresh();

      if (aircraft.length) {
        setAircraftStatus(`Znaleziono ${aircraftFilterSummary(aircraft.length, visibleAircraft.length)}. Źródło: ${sourceName}. Mapa odświeża pozycje i ślady automatycznie co ${Math.round(getAutoRefreshIntervalMs() / 1000)} s.`);
        enrichAircraftRoutesInBackground(aircraft, candidate, sourceName);
      } else {
        setAircraftStatus(`Nie znaleziono samolotów w tym promieniu. Źródło: ${sourceName}.`);
      }
    } catch (error) {
      const details = explainFetchError(error);
      setAircraftStatus(`Nie udało się pobrać danych. Ostatni błąd: ${details}.`);
      showToast(`Błąd pobierania: ${details}`, 5200);
    }
  } finally {
    finishBusy();
  }
}
