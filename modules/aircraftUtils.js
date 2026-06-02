// ADS Viewer Pro - aircraftUtils.js
// Wydzielone z app.js w wersji V59. Klasyczny skrypt, funkcje globalne.
function normalizeCallsign(value) {
  const clean = String(value || "").trim().toUpperCase().replace(/\s+/g, "");
  const match = clean.match(/^([A-Z]*)(0*[0-9]+)([A-Z]*)$/);
  if (!match) return clean;
  return `${match[1]}${String(Number.parseInt(match[2], 10))}${match[3]}`;
}

function aircraftCallsign(aircraft) {
  return normalizeCallsign(aircraft.flight || "");
}

function formatAltitude(value) {
  if (value === "ground") return "na ziemi";
  if (value === undefined || value === null || value === "") return "brak danych";
  return `${numberText(value)} ft`;
}

function formatSpeed(value) {
  if (value === undefined || value === null || value === "") return "brak danych";
  return `${numberText(value)} kt`;
}

function formatHeading(value) {
  if (value === undefined || value === null || value === "") return "brak danych";
  return `${numberText(value)}°`;
}

function formatAge(value) {
  if (value === undefined || value === null || value === "") return "brak danych";
  const seconds = Math.max(0, Math.round(Number(value)));
  if (!Number.isFinite(seconds)) return "brak danych";
  if (seconds < 60) return `${seconds} s temu`;
  return `${Math.floor(seconds / 60)} min ${seconds % 60} s temu`;
}

function aircraftFreshnessSeconds(aircraft) {
  return numericFirst(aircraft?.seen_pos, aircraft?.seen, aircraft?.lastSeenSeconds, aircraft?.age);
}

function aircraftFreshnessInfo(aircraft) {
  const seconds = aircraftFreshnessSeconds(aircraft);
  if (!Number.isFinite(seconds)) {
    return { state: "unknown", label: "brak czasu", detail: "źródło nie podało wieku pozycji", ageText: "brak danych" };
  }
  if (seconds <= 10) return { state: "live", label: "LIVE", detail: "pozycja świeża", ageText: formatAge(seconds) };
  if (seconds <= 30) return { state: "fresh", label: "Świeże", detail: "pozycja aktualna", ageText: formatAge(seconds) };
  if (seconds <= 90) return { state: "delayed", label: "Opóźnione", detail: "pozycja ma opóźnienie", ageText: formatAge(seconds) };
  return { state: "stale", label: "Stare", detail: "pozycja może być nieaktualna", ageText: formatAge(seconds) };
}

function setFreshnessBadge(element, aircraft, compact = false) {
  if (!element) return;
  const info = aircraftFreshnessInfo(aircraft);
  const isLive = info.state === "live" || info.state === "fresh";
  element.className = `freshness-badge freshness-${info.state}`;
  if (isLive && !compact) {
    element.innerHTML = `<span class="live-dot"></span><span>Na żywo</span>`;
  } else {
    element.textContent = compact ? info.label : info.ageText;
  }
  element.title = `${info.detail}. Ostatni sygnał: ${info.ageText}`;
}

function aircraftPositionText(aircraft) {
  const point = pointFromAircraft(aircraft);
  return point ? `${point.lat.toFixed(5)}, ${point.lon.toFixed(5)}` : "brak danych";
}

function aircraftSourceText(aircraft) {
  return firstFilled(aircraft?._sourceName, sourceLabel(dataSourceInput?.value), "brak danych");
}

function aircraftHeading(aircraft) {
  const value = firstFilled(aircraft.track, aircraft.true_heading, aircraft.mag_heading, aircraft.nav_heading, aircraft.calc_track);
  const heading = Number(value);
  return Number.isFinite(heading) ? heading : null;
}

function aircraftKind(aircraft) {
  const parts = [];
  if (aircraft.t) parts.push(String(aircraft.t).trim());
  if (aircraft.type) parts.push(String(aircraft.type).trim());
  if (aircraft.aircraftType) parts.push(String(aircraft.aircraftType).trim());
  if (aircraft.r) parts.push(String(aircraft.r).trim());
  if (aircraft.registration) parts.push(String(aircraft.registration).trim());
  return parts.filter(Boolean).join(" / ");
}

function aircraftTypeGroup(aircraft) {
  const typeCode = firstFilled(aircraft?.t, aircraft?.type, aircraft?.aircraftType).toUpperCase();
  const category = firstFilled(aircraft?.category, aircraft?.emitter_category, aircraft?.emergencyCategory).toUpperCase();
  const raw = [
    typeCode,
    category,
    aircraft?.kind,
    aircraft?.desc,
    aircraft?.description,
    aircraft?.name,
    aircraft?.operator,
    aircraft?.registration,
    aircraft?.r
  ].filter(Boolean).join(" ").toUpperCase();

  // ADS-B/Mode-S kategorie: A7/C7 = rotorcraft, B1 = szybowiec,
  // B4 = ultralekki, A1 = lekki, A5 = heavy, A6 = high performance/military.
  if (/\b(A7|C7)\b/.test(category)) return "helicopter";
  if (/\bB1\b/.test(category)) return "glider";
  if (/\b(B4|A1)\b/.test(category)) return "prop";
  if (/\bA5\b/.test(category)) return "heavy";
  if (/\bA6\b/.test(category)) return "special";

  if (/HELICOPTER|ROTORCRAFT|ŚMIGŁ|SMIGL|GYROCOPTER|GYROPLANE|\b(R44|R66|R22|R20|B06|B407|B429|B412|B212|B427|H500|H60|UH60|EC20|EC30|EC35|EC45|EC55|AS50|AS55|AS65|S76|S92|A109|AW09|AW10|AW11|AW13|AW16|AW18|MD50|MD52|MD60|MD90)\b/.test(raw)) return "helicopter";
  if (/GLIDER|SAILPLANE|MOTORGLIDER|SZYBOW|\b(ASW|ASK|DG\d|LS\d|JS\d|SZD|VENTUS|JANUS|DISCUS|DUODISCUS|ARCUS|S12|GROB|TWIN\s?ASTIR)\b/.test(raw)) return "glider";
  if (/MILITARY|WOJSK|FIGHTER|TANKER|SPECIAL|POLICE|RESCUE|AMBULANCE|\b(C17|C5M|C130|C30J|KC\d|K35R|A400|P8|P3|E3|E7|E8|F16|F-16|F18|F-18|F22|F-22|F35|F-35|MIG|MIG\d|SU\d|TYPHOON|EUFI|RAFALE|GRIPEN|TORNADO|HAWK|L159|A10|B1|B2|B52)\b/.test(raw)) return "special";
  if (/CARGO|FREIGHTER|\b(A124|A225|IL76|MD11|DC10|B74F|B744F|B748F|B763F|B77L|B77F|A332F|A306|A30B|C130|C30J)\b/.test(raw)) return "cargo";
  if (/BUSINESS|BIZJET|PRIVATE|EXECUTIVE|\b(C25A|C25B|C25C|C510|C525|C550|C560|C56X|C650|C680|C700|C750|E50P|E55P|PRM1|FA10|FA20|FA50|FA6X|FA7X|FA8X|GLF2|GLF3|GLF4|GLF5|GLF6|GLEX|GL5T|GL7T|LJ31|LJ35|LJ45|LJ60|H25B|H25C)\b/.test(raw)) return "business";
  if (/ULTRALIGHT|MICROLIGHT|PARAGLIDER|MOTOL|\b(C150|C152|C162|C172|C175|C177|C180|C182|C185|C206|C207|C208|C210|P28A|P28R|PA28|PA32|PA34|PA44|SR20|SR22|DA20|DA40|DA42|DV20|DR40|BE20|BE30|BE35|BE36|BE58|PC12|PC24|TBM7|TBM8|TBM9|M20P|M20T|BN2P|AN2|DHC2|DHC3|DHC6|DH8A|DH8B|DH8C|DH8D|AT43|AT45|AT72|SF34|L410|P180)\b/.test(raw)) return "prop";
  if (/\b(A220|BCS1|BCS3|A319|A320|A321|A20N|A21N|A330|A332|A333|A339|A340|A342|A343|A345|A346|A350|A359|A35K|A380|A388|B717|B737|B738|B739|B38M|B39M|B744|B748|B752|B753|B763|B764|B772|B773|B77W|B788|B789|B78X|E170|E175|E190|E195|E290|E295|CRJ2|CRJ7|CRJ9|CRJX|SU95|RJ85)\b/.test(raw)) return "airliner";
  if (/HEAVY|\b(A300|A310|A330|A332|A333|A339|A340|A342|A343|A345|A346|A350|A359|A35K|A380|A388|B747|B748|B74S|B74R|B767|B763|B764|B777|B772|B773|B77L|B77W|B787|B788|B789|B78X|IL96)\b/.test(raw)) return "heavy";
  return "jet";
}

function aircraftGroupLabel(group) {
  return {
    helicopter: "śmigłowiec",
    glider: "szybowiec",
    prop: "samolot śmigłowy",
    business: "odrzutowiec biznesowy",
    airliner: "samolot pasażerski",
    cargo: "samolot transportowy",
    heavy: "duży samolot",
    special: "samolot specjalny",
    jet: "samolot odrzutowy"
  }[group] || "samolot";
}

function aircraftIconAssetUrl(group) {
  return AIRCRAFT_ICON_FILES[group] || AIRCRAFT_ICON_FILES.jet;
}

function aircraftPngIconMarkup(group) {
  const safeGroup = Object.prototype.hasOwnProperty.call(AIRCRAFT_ICON_FILES, group) ? group : "jet";
  const url = aircraftIconAssetUrl(safeGroup);
  return `
    <span class="aircraft-icon-stack aircraft-png-icon-${safeGroup}" aria-hidden="true">
      <svg class="aircraft-icon-fallback" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" focusable="false">${aircraftShapeMarkup(safeGroup)}</svg>
      <span class="aircraft-png-icon" style="-webkit-mask-image:url('${url}');mask-image:url('${url}');"></span>
    </span>`;
}

function aircraftPngMaskSupported() {
  const style = document.createElement("span").style;
  if (("webkitMaskImage" in style) || ("maskImage" in style)) return true;
  if (!window.CSS || typeof window.CSS.supports !== "function") return false;
  return window.CSS.supports("-webkit-mask-image", `url("data:image/png;base64,iVBORw0KGgo=")`) ||
    window.CSS.supports("mask-image", `url("data:image/png;base64,iVBORw0KGgo=")`);
}

function preloadAircraftPngIcons() {
  if (!aircraftPngMaskSupported()) {
    document.documentElement.classList.remove("aircraft-png-icons-ready");
    return;
  }
  const urls = Object.values(AIRCRAFT_ICON_FILES);
  Promise.all(urls.map((url) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = url;
  }))).then(() => {
    document.documentElement.classList.add("aircraft-png-icons-ready");
  }).catch(() => {
    document.documentElement.classList.remove("aircraft-png-icons-ready");
  });
}

function aircraftAltitudeFeet(aircraft) {
  const raw = firstFilled(aircraft?.alt_baro, aircraft?.alt_geom, aircraft?.altitude);
  if (!raw) return null;
  if (String(raw).toLowerCase() === "ground") return 0;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function aircraftVisibleByLifecycle(aircraft, performance = readPerformanceSettings()) {
  if (!performance.autoHideStale) return true;
  const seconds = aircraftFreshnessSeconds(aircraft);
  if (!Number.isFinite(seconds)) return true;
  return seconds <= performance.removeAfterSeconds;
}

function aircraftLifecycleState(aircraft, performance = readPerformanceSettings()) {
  const seconds = aircraftFreshnessSeconds(aircraft);
  if (!Number.isFinite(seconds)) return "unknown";
  if (performance.autoHideStale && seconds > performance.removeAfterSeconds) return "expired";
  if (seconds > STALE_FADE_SECONDS) return "stale";
  return "active";
}

function aircraftLabel(aircraft) {
  const flight = (aircraft.flight || "").trim();
  const reg = (aircraft.r || "").trim();
  const type = (aircraft.t || "").trim();
  const hex = normalizeIcao(aircraft.hex || "");
  return flight || reg || type || (hex ? hex.toUpperCase() : "Samolot");
}

function aircraftMeta(aircraft) {
  const parts = [];
  if (aircraft.hex) parts.push(aircraft.hex.toUpperCase());
  if (aircraft.t) parts.push(String(aircraft.t).trim());
  if (aircraft.r) parts.push(String(aircraft.r).trim());
  parts.push(formatAltitude(aircraft.alt_baro));
  parts.push(formatSpeed(aircraft.gs));
  parts.push(`kurs ${formatHeading(aircraftHeading(aircraft))}`);
  const freshness = aircraftFreshnessInfo(aircraft);
  if (freshness.ageText !== "brak danych") parts.push(`${freshness.label} ${freshness.ageText}`);
  return parts.filter((item) => item && item !== "brak danych").join(" • ");
}

function aircraftExtraMeta(aircraft) {
  const details = [];
  if (aircraft.baro_rate !== undefined || aircraft.geom_rate !== undefined) {
    details.push(`wznoszenie/opadanie ${numberText(aircraft.baro_rate ?? aircraft.geom_rate)} ft/min`);
  }
  if (aircraft.squawk) details.push(`squawk ${aircraft.squawk}`);
  if (aircraft.nav_altitude_mcp) details.push(`zadana wys. ${formatAltitude(aircraft.nav_altitude_mcp)}`);
  if (aircraft.messages !== undefined) details.push(`wiad. ${numberText(aircraft.messages)}`);
  return details.join(" • ");
}

function aircraftVerticalRate(aircraft) {
  return numericFirst(aircraft?.baro_rate, aircraft?.geom_rate, aircraft?.verticalRate, aircraft?.vertical_rate);
}

function aircraftAltitudeNumber(aircraft) {
  if (aircraft?.alt_baro === "ground") return 0;
  return numericFirst(aircraft?.alt_baro, aircraft?.alt_geom, aircraft?.altitude);
}

function aircraftFlightPhase(aircraft) {
  const altitude = aircraftAltitudeNumber(aircraft);
  const speed = numericFirst(aircraft?.gs, aircraft?.speed);
  const verticalRate = aircraftVerticalRate(aircraft);

  if (aircraft?.alt_baro === "ground" || (Number.isFinite(altitude) && altitude < 150 && Number.isFinite(speed) && speed < 50)) {
    return { label: "na ziemi", detail: "samolot stoi albo kołuje", css: "ground", angle: 0 };
  }
  if (Number.isFinite(verticalRate) && verticalRate > 250) {
    return { label: "wznosi się", detail: `+${numberText(verticalRate)} ft/min`, css: "climb", angle: -18 };
  }
  if (Number.isFinite(verticalRate) && verticalRate < -250) {
    return { label: "zniża się", detail: `${numberText(verticalRate)} ft/min`, css: "descent", angle: 18 };
  }
  return { label: "lot poziomy", detail: Number.isFinite(verticalRate) ? `${numberText(verticalRate)} ft/min` : "brak danych pionowych", css: "level", angle: 0 };
}

function aircraftRouteIndicatorAngle(phase) {
  const css = String(phase?.css || "");
  if (css === "climb") return 65;
  if (css === "descent") return 115;
  return 90;
}

function aircraftPhaseMarkup(aircraft) {
  const phase = aircraftFlightPhase(aircraft);
  const group = aircraftTypeGroup(aircraft || {});
  const routeAngle = aircraftRouteIndicatorAngle(phase);
  return `<span class="phase-plane phase-${phase.css}" style="--phase-angle:${phase.angle}deg;--route-phase-angle:${routeAngle}deg">${aircraftSvgMarkup(group)}</span>`;
}

function airlineGuessFromCallsign(aircraft) {
  const flight = aircraftCallsign(aircraft);
  const operator = firstFilled(aircraft?.operator, aircraft?.ownOp, aircraft?.op, aircraft?.airline, aircraft?.owner, aircraft?.desc);
  if (operator) return operator;
  const prefixes = {
    LOT: "LOT Polish Airlines",
    RYR: "Ryanair",
    DLH: "Lufthansa",
    WZZ: "Wizz Air",
    UAE: "Emirates",
    QTR: "Qatar Airways",
    THY: "Turkish Airlines",
    AFR: "Air France",
    KLM: "KLM",
    BAW: "British Airways",
    EZY: "easyJet",
    SAS: "SAS",
    UPS: "UPS",
    FDX: "FedEx"
  };
  const prefix = String(flight || "").match(/^[A-Z]{2,3}/)?.[0] || "";
  return prefixes[prefix] || firstFilled(aircraft?.r, aircraft?.registration, "brak danych");
}

function aircraftDetailsRows(aircraft) {
  const point = pointFromAircraft(aircraft);
  const route = routeInfoFromAircraft(aircraft);
  const freshness = aircraftFreshnessInfo(aircraft);
  const verticalRate = aircraftVerticalRate(aircraft);
  const rows = [
    ["Callsign", aircraftCallsign(aircraft) || aircraftLabel(aircraft)],
    ["HEX", normalizeIcao(firstFilled(aircraft?.hex, aircraft?.icao, aircraft?.icao24)).toUpperCase() || "brak danych"],
    ["Typ", firstFilled(aircraft?.t, aircraft?.type, aircraft?.aircraftType, aircraftKind(aircraft), "brak danych")],
    ["Rejestracja", firstFilled(aircraft?.r, aircraft?.registration, "brak danych")],
    ["Operator / linia", airlineGuessFromCallsign(aircraft)],
    ["Trasa", route.verbose || route.short || "brak danych"],
    ["Status pozycji", `${freshness.label} • ${freshness.ageText}`],
    ["Wysokość", formatAltitude(aircraft?.alt_baro)],
    ["Wysokość geometryczna", formatAltitude(aircraft?.alt_geom)],
    ["Prędkość", formatSpeed(aircraft?.gs)],
    ["Kurs", formatHeading(aircraftHeading(aircraft))],
    ["Wznoszenie/opadanie", Number.isFinite(verticalRate) ? `${numberText(verticalRate)} ft/min` : "brak danych"],
    ["Squawk", firstFilled(aircraft?.squawk, "brak danych")],
    ["Zadana wysokość", aircraft?.nav_altitude_mcp ? formatAltitude(aircraft.nav_altitude_mcp) : "brak danych"],
    ["Pozycja", point ? `${point.lat.toFixed(5)}, ${point.lon.toFixed(5)}` : "brak danych"],
    ["Źródło", aircraftSourceText(aircraft)]
  ];
  return rows;
}

function aircraftToFlight(aircraft) {
  const point = pointFromAircraft(aircraft);
  const route = routeInfoFromAircraft(aircraft);
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${firstFilled(aircraft.hex, aircraft.icao)}`,
    icao: normalizeIcao(firstFilled(aircraft.hex, aircraft.icao)),
    name: aircraftLabel(aircraft),
    date: todayLocalDate(),
    zoom: zoomInput.value.trim() || "9.2",
    lat: point ? String(point.lat) : (aircraft?._offlineWatchOnly ? "" : browseLatInput.value.trim()),
    lon: point ? String(point.lon) : (aircraft?._offlineWatchOnly ? "" : browseLonInput.value.trim()),
    callsign: aircraftCallsign(aircraft),
    type: firstFilled(aircraft.t, aircraft.type, aircraft.aircraftType),
    registration: firstFilled(aircraft.r, aircraft.registration),
    routeShort: route.short,
    routeVerbose: route.verbose,
    altitude: aircraft.alt_baro ?? "",
    speed: aircraft.gs ?? "",
    heading: aircraftHeading(aircraft) ?? "",
    kind: aircraftTypeGroup(aircraft),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function flightToAircraft(flight) {
  return {
    hex: normalizeIcao(flight?.icao || flight?.hex || ""),
    flight: flight?.callsign || flight?.name || "",
    r: flight?.registration || "",
    registration: flight?.registration || "",
    t: flight?.type || flight?.aircraftType || "",
    type: flight?.type || flight?.aircraftType || "",
    lat: flight?.lat || "",
    lon: flight?.lon || "",
    alt_baro: flight?.altitude ?? "",
    gs: flight?.speed ?? "",
    track: flight?.heading ?? "",
    _route: { from: flight?.routeShort?.split?.("→")?.[0]?.trim?.() || "", to: flight?.routeShort?.split?.("→")?.slice?.(1)?.join?.("→")?.trim?.() || "", verbose: flight?.routeVerbose || flight?.routeShort || "" },
    _sourceName: "zapisane"
  };
}

function aircraftIcao(aircraft) {
  return normalizeIcao(aircraft?.hex || aircraft?.icao || aircraft?.icao24 || "");
}

function aircraftIcon(aircraft) {
  const rawHeading = aircraftHeading(aircraft) ?? Number(aircraft?.heading);
  const heading = Number.isFinite(Number(rawHeading)) ? Number(rawHeading) : 0;
  const label = aircraftCallsign(aircraft) || firstFilled(aircraft?.callsign, aircraft?.name, aircraft?.flight, normalizeIcao(aircraft?.hex || "").toUpperCase(), "SAMOLOT");
  const group = aircraftTypeGroup(aircraft || {});
  const dimensions = aircraftIconDimensions(group);
  const special = group === "special" || (aircraft?.dbFlags && (aircraft.dbFlags & 1)) ? " special" : "";
  const freshness = aircraftFreshnessInfo(aircraft);
  const performance = readPerformanceSettings();
  const lifecycle = aircraftLifecycleState(aircraft, performance);
  const escapedLabel = escapeHtml(label);
  const typeTitle = aircraftGroupLabel(group);
  const icao = aircraftIcao(aircraft);
  const selectedIcao = aircraftIcao(selectedAircraft);
  const selectedClass = isValidIcao(icao) && icao === selectedIcao ? " aircraft-selected" : "";
  const freshnessHtml = performance.showFreshnessLabels ? `<span class="plane-freshness freshness-${freshness.state}">${escapeHtml(freshness.label)}</span>` : "";
  return L.divIcon({
    className: `aircraft-div-icon aircraft-kind-${group} aircraft-freshness-${freshness.state} aircraft-lifecycle-${lifecycle}${selectedClass}`,
    iconSize: [dimensions.width, dimensions.height],
    iconAnchor: [dimensions.anchorX, dimensions.anchorY],
    popupAnchor: [0, -Math.round(dimensions.height / 2)],
    html: `
      <div class="plane-marker-wrap aircraft-kind-${group}${selectedClass}" data-icao="${escapeHtml(icao)}" title="${escapeHtml(typeTitle)}">
        <div class="plane-marker${special}" style="--heading:${heading}deg; --plane-svg-width:${dimensions.svgWidth}px; --plane-svg-height:${dimensions.svgHeight}px;">
          ${aircraftSvgMarkup(group)}
        </div>
        <span class="plane-label">${escapedLabel}</span>
        ${freshnessHtml}
      </div>`
  });
}

function aircraftMiniIconSvg(aircraft) {
  const group = aircraftTypeGroup(aircraft || {});
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img">
    <rect width="64" height="64" rx="18" fill="#ecfeff"/>
    <g style="color:#facc15; filter: drop-shadow(0 5px 8px rgba(15,23,42,.25));">${aircraftShapeMarkup(group)}</g>
  </svg>`;
}

function aircraftMiniIconDataUrl(aircraft) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(aircraftMiniIconSvg(aircraft || {}))}`;
}

function aircraftThumbSvg(aircraft) {
  const group = aircraftTypeGroup(aircraft || {});
  const kind = aircraftGroupLabel(group);
  const label = escapeHtml(firstFilled(aircraft?.t, aircraft?.type, aircraft?.aircraftType, aircraft?.registration, aircraft?.r, kind));
  const name = escapeHtml(firstFilled(aircraft?.flight, aircraft?.callsign, aircraft?.name, aircraft?.hex, "ADS-B"));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 190" role="img">
    <defs>
      <linearGradient id="sky" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#dbeafe"/><stop offset="1" stop-color="#f8fafc"/></linearGradient>
      <linearGradient id="runway" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#cbd5e1"/><stop offset="1" stop-color="#94a3b8"/></linearGradient>
    </defs>
    <rect width="320" height="190" rx="20" fill="url(#sky)"/>
    <path d="M0 150 C80 126 172 132 320 112 L320 190 L0 190Z" fill="url(#runway)" opacity="0.9"/>
    <path d="M20 150h64M124 141h78M238 130h52" stroke="#ffffff" stroke-width="5" stroke-linecap="round" opacity="0.85"/>
    <g transform="translate(92 28) scale(2.05)" style="color:#0f766e; filter: drop-shadow(0 10px 12px rgba(15,23,42,.28));">${aircraftShapeMarkup(group)}</g>
    <rect x="14" y="14" width="128" height="38" rx="12" fill="rgba(255,255,255,.86)"/>
    <text x="28" y="38" font-family="Segoe UI, Arial, sans-serif" font-size="18" font-weight="800" fill="#0f172a">${label}</text>
    <text x="18" y="178" font-family="Segoe UI, Arial, sans-serif" font-size="18" font-weight="800" fill="#0f172a">${name}</text>
  </svg>`;
}

function aircraftThumbDataUrl(aircraft) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(aircraftThumbSvg(aircraft || {}))}`;
}

function aircraftListFromResponse(data) {
  if (Array.isArray(data?.ac)) return data.ac;
  if (Array.isArray(data?.aircraft)) return data.aircraft;
  if (data && isValidIcao(normalizeIcao(data.hex || ""))) return [data];
  return [];
}
