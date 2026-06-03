// ADS Viewer Pro - mapRoutes.js
// Wydzielone z app.js w wersji V59. Klasyczny skrypt, funkcje globalne.
function initMap() {
  if (map || !window.L) return;
  map = L.map("flightMap", {
    zoomControl: true,
    worldCopyJump: true,
    preferCanvas: true
  }).setView([50.496, 20.749], 7);

  map.createPane("trailPane");
  map.getPane("trailPane").style.zIndex = "410";
  map.getPane("trailPane").style.pointerEvents = "none";
  map.createPane("routePane");
  map.getPane("routePane").style.zIndex = "430";
  map.getPane("routePane").style.pointerEvents = "none";
  map.createPane("aircraftPane");
  map.getPane("aircraftPane").style.zIndex = "650";
  map.createPane("userPane");
  map.getPane("userPane").style.zIndex = "760";
  map.getPane("userPane").style.pointerEvents = "none";

  trailLayer = L.layerGroup().addTo(map);
  routeLayer = L.layerGroup().addTo(map);
  aircraftLayer = L.layerGroup().addTo(map);
  userLocationLayer = L.layerGroup().addTo(map);
  map.on("click", () => {
    hideSelectedAircraftSheet();
    const historyPanelLockedOpen = Boolean(
      drawer?.classList.contains("is-open") &&
      drawer?.classList.contains("is-history-panel")
    );
    if (!historyPanelLockedOpen) closeDrawerPanel();
    map.closePopup?.();
  });
  refreshTileLayer();
}

function refreshTileLayer() {
  if (!map || !window.L) return;
  const config = currentTileConfig();
  if (tileLayer) map.removeLayer(tileLayer);
  tileLayer = L.tileLayer(config.url, {
    maxZoom: 19,
    attribution: config.attribution
  }).addTo(map);
}

function setRouteSummary(message) {
  if (routeSummary) routeSummary.textContent = message;
}

function validPoint(point) {
  return point && Number.isFinite(point.lat) && Number.isFinite(point.lon);
}

function pointTimeMs(point) {
  if (!point?.at) return null;
  const time = Date.parse(point.at);
  return Number.isFinite(time) ? time : null;
}

function tracePointAltitudeFt(point) {
  const raw = point?.altitude ?? point?.alt_baro ?? point?.alt_geom ?? null;
  if (String(raw || "").toLowerCase() === "ground") return 0;
  return finiteNumberOrNull(raw);
}

function tracePointSpeedKt(point) {
  return finiteNumberOrNull(point?.speed ?? point?.gs);
}

function isGroundLikeTracePoint(point) {
  const altitude = tracePointAltitudeFt(point);
  const speed = tracePointSpeedKt(point);
  return (altitude !== null && altitude <= 500) && (speed === null || speed <= 90);
}

function distanceKmBetweenPoints(a, b) {
  if (!validPoint(a) || !validPoint(b)) return null;
  const radiusKm = 6371;
  const lat1 = a.lat * Math.PI / 180;
  const lat2 = b.lat * Math.PI / 180;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLon = (b.lon - a.lon) * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return radiusKm * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function normalizeLongitude(lon) {
  return ((lon + 540) % 360) - 180;
}

function greatCirclePointBetween(start, end, fraction) {
  if (!validPoint(start) || !validPoint(end)) return null;
  const lat1 = start.lat * Math.PI / 180;
  const lon1 = start.lon * Math.PI / 180;
  const lat2 = end.lat * Math.PI / 180;
  const lon2 = end.lon * Math.PI / 180;

  const delta = 2 * Math.asin(Math.sqrt(
    Math.sin((lat2 - lat1) / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2
  ));

  if (!Number.isFinite(delta) || delta === 0) {
    return { ...start };
  }

  const sinDelta = Math.sin(delta);
  const a = Math.sin((1 - fraction) * delta) / sinDelta;
  const b = Math.sin(fraction * delta) / sinDelta;

  const x = a * Math.cos(lat1) * Math.cos(lon1) + b * Math.cos(lat2) * Math.cos(lon2);
  const y = a * Math.cos(lat1) * Math.sin(lon1) + b * Math.cos(lat2) * Math.sin(lon2);
  const z = a * Math.sin(lat1) + b * Math.sin(lat2);

  const lat = Math.atan2(z, Math.sqrt(x * x + y * y)) * 180 / Math.PI;
  const lon = Math.atan2(y, x) * 180 / Math.PI;
  return {
    lat,
    lon: normalizeLongitude(lon),
    at: "",
    altitude: null,
    speed: null,
    track: null
  };
}

function greatCircleRoutePoints(start, end) {
  if (!validPoint(start) || !validPoint(end)) return [];
  const distanceKm = distanceKmBetweenPoints(start, end) || 0;
  const steps = Math.min(180, Math.max(32, Math.ceil(distanceKm / 90)));
  const result = [];

  for (let index = 0; index <= steps; index += 1) {
    const point = greatCirclePointBetween(start, end, index / steps);
    if (point) result.push(point);
  }

  if (result.length) {
    result[0] = { ...result[0], ...start };
    result[result.length - 1] = { ...result[result.length - 1], ...end };
  }
  return result;
}

function combineRouteLegs(...legs) {
  const combined = [];
  for (const leg of legs) {
    const cleanLeg = (Array.isArray(leg) ? leg : []).filter(validPoint);
    for (const point of cleanLeg) {
      const previous = combined[combined.length - 1];
      const sameAsPrevious = previous && Math.abs(previous.lat - point.lat) < 0.000001 && Math.abs(previous.lon - point.lon) < 0.000001;
      if (!sameAsPrevious) combined.push(point);
    }
  }
  return combined;
}

function plannedAirportRoutePointsThroughAircraft(aircraft, endpoints) {
  if (!endpoints?.start || !endpoints?.end) return [];
  const aircraftPoint = pointFromAircraft(aircraft);
  if (!validPoint(aircraftPoint)) {
    return greatCircleRoutePoints(endpoints.start, endpoints.end).filter(validPoint);
  }

  const distanceFromStartKm = distanceKmBetweenPoints(endpoints.start, aircraftPoint);
  const distanceFromEndKm = distanceKmBetweenPoints(aircraftPoint, endpoints.end);
  if (distanceFromStartKm !== null && distanceFromStartKm < 8) {
    return greatCircleRoutePoints(aircraftPoint, endpoints.end).filter(validPoint);
  }
  if (distanceFromEndKm !== null && distanceFromEndKm < 8) {
    return greatCircleRoutePoints(endpoints.start, aircraftPoint).filter(validPoint);
  }

  return combineRouteLegs(
    greatCircleRoutePoints(endpoints.start, aircraftPoint),
    greatCircleRoutePoints(aircraftPoint, endpoints.end)
  );
}

function shouldBreakTraceSegment(previous, point) {
  if (!validPoint(previous) || !validPoint(point)) return true;
  const distanceKm = distanceKmBetweenPoints(previous, point);
  const previousTime = pointTimeMs(previous);
  const pointTime = pointTimeMs(point);

  if (previousTime !== null && pointTime !== null) {
    const deltaMs = pointTime - previousTime;
    if (deltaMs < -60 * 1000) return true;
    if (deltaMs > TRACE_MAX_TIME_GAP_MS) return true;
    if (distanceKm !== null && deltaMs > 0) {
      const speedKmh = distanceKm / (deltaMs / 3600000);
      if (distanceKm > 35 && speedKmh > TRACE_MAX_REASONABLE_KMH) return true;
    }
  } else if (distanceKm !== null && distanceKm > TRACE_MAX_DISTANCE_WITHOUT_TIME_KM) {
    return true;
  }

  return false;
}

function splitTraceIntoPlausibleSegments(points) {
  const clean = (Array.isArray(points) ? points : []).filter(validPoint);
  if (clean.length < 2) return clean.length ? [clean] : [];

  const sorted = clean.slice().sort((a, b) => {
    const aTime = pointTimeMs(a);
    const bTime = pointTimeMs(b);
    if (aTime === null || bTime === null) return 0;
    return aTime - bTime;
  });

  const segments = [];
  let current = [];
  for (const point of sorted) {
    const previous = current[current.length - 1];
    if (previous && shouldBreakTraceSegment(previous, point)) {
      if (current.length) segments.push(current);
      current = [];
    }
    current.push(point);
  }
  if (current.length) segments.push(current);
  return segments.filter((segment) => segment.length);
}

function flightPointFromFormLikeObject(flight) {
  const lat = Number.parseFloat(flight?.lat);
  const lon = Number.parseFloat(flight?.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lon };
}

function segmentLastTimeMs(segment) {
  for (let i = segment.length - 1; i >= 0; i -= 1) {
    const time = pointTimeMs(segment[i]);
    if (time !== null) return time;
  }
  return 0;
}

function selectTraceSegmentForFlight(points, flight) {
  const segments = splitTraceIntoPlausibleSegments(points)
    .filter((segment) => segment.length >= 2)
    .sort((a, b) => segmentLastTimeMs(b) - segmentLastTimeMs(a));

  if (!segments.length) return [];

  const currentPoint = flightPointFromFormLikeObject(flight);
  if (currentPoint) {
    const nearCurrent = segments
      .map((segment) => ({
        segment,
        distanceKm: distanceKmBetweenPoints(segment[segment.length - 1], currentPoint)
      }))
      .filter((item) => item.distanceKm !== null && item.distanceKm <= TRACE_CURRENT_MATCH_MAX_KM)
      .sort((a, b) => a.distanceKm - b.distanceKm);
    if (nearCurrent.length) return nearCurrent[0].segment;
    return [];
  }

  return segments[0];
}

function filterTracePointsByUtcDate(points, requestedDate) {
  const date = String(requestedDate || "").slice(0, 10);
  if (!date) return points;
  return points.filter((point) => {
    const time = pointTimeMs(point);
    if (time === null) return true;
    return new Date(time).toISOString().slice(0, 10) === date;
  });
}

function prepareTracePointsForFlight(points, flight, options = {}) {
  let clean = (Array.isArray(points) ? points : []).filter(validPoint);
  if (options.filterDate === true) {
    clean = filterTracePointsByUtcDate(clean, flight?.date);
  }
  return selectTraceSegmentForFlight(clean, flight);
}

function appendCurrentAircraftPointToTrace(points, aircraft) {
  const clean = (Array.isArray(points) ? points : []).filter(validPoint);
  const current = pointFromAircraft(aircraft);
  if (!validPoint(current)) return clean;
  if (!clean.length) return [current];

  const last = clean[clean.length - 1];
  const distanceKm = distanceKmBetweenPoints(last, current);
  if (distanceKm !== null && distanceKm < 1) return clean;
  if (distanceKm !== null && distanceKm > TRACE_APPEND_CURRENT_MAX_KM) return clean;

  const lastTime = pointTimeMs(last);
  const currentTime = pointTimeMs(current);
  if (lastTime !== null && currentTime !== null && currentTime < lastTime - 60000) return clean;

  if (shouldBreakTraceSegment(last, current) && !(distanceKm !== null && distanceKm <= TRACE_APPEND_CURRENT_MAX_KM)) return clean;
  return [...clean, current];
}

function pointFromAircraft(aircraft) {
  const lat = Number.parseFloat(aircraft.lat);
  const lon = Number.parseFloat(aircraft.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return {
    lat,
    lon,
    at: new Date().toISOString(),
    altitude: aircraft.alt_baro ?? null,
    speed: aircraft.gs ?? null,
    track: aircraftHeading(aircraft),
    verticalRate: aircraft.baro_rate ?? aircraft.geom_rate ?? null
  };
}

function destinationPoint(lat, lon, bearingDeg, distanceKm) {
  const radiusKm = 6371;
  const bearing = bearingDeg * Math.PI / 180;
  const lat1 = lat * Math.PI / 180;
  const lon1 = lon * Math.PI / 180;
  const d = distanceKm / radiusKm;
  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(bearing));
  const lon2 = lon1 + Math.atan2(Math.sin(bearing) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(lat2));
  return [lat2 * 180 / Math.PI, ((lon2 * 180 / Math.PI + 540) % 360) - 180];
}

function directionDistanceKm(speedKt) {
  const speed = Number(speedKt);
  if (!Number.isFinite(speed) || speed <= 0) return 30;
  return Math.min(90, Math.max(15, speed * 1.852 * 5 / 60));
}

function drawDirectionLine(layer, point, heading, speed, options = {}) {
  if (!validPoint(point) || !Number.isFinite(Number(heading))) return null;
  const end = destinationPoint(point.lat, point.lon, Number(heading), directionDistanceKm(speed));
  return L.polyline([[point.lat, point.lon], end], {
    pane: "routePane",
    interactive: false,
    color: options.color || "#0ea5e9",
    weight: options.weight || 2,
    opacity: options.opacity || 0.82,
    dashArray: options.dashArray || "8 7"
  }).addTo(layer);
}

function drawRoute(points, label = "Trasa", options = {}) {
  initMap();
  if (!map || !routeLayer) return;
  routeLayer.clearLayers();
  const clean = points.filter(validPoint);
  lastRouteBounds = null;

  if (!clean.length) {
    setRouteSummary("Brak punktów trasy do pokazania.");
    return;
  }

  const latLngs = clean.map((point) => [point.lat, point.lon]);
  const plannedOnly = options.plannedOnly === true;
  if (latLngs.length > 1) {
    L.polyline(latLngs, {
      pane: "routePane",
      interactive: false,
      color: "#ffffff",
      weight: plannedOnly ? 7 : 9,
      opacity: plannedOnly ? 0.74 : 0.88,
      dashArray: plannedOnly ? "10 10" : undefined
    }).addTo(routeLayer);

    L.polyline(latLngs, {
      pane: "routePane",
      interactive: false,
      color: plannedOnly ? "#2563eb" : "#f97316",
      weight: plannedOnly ? 3 : 5,
      opacity: plannedOnly ? 0.82 : 0.98,
      dashArray: plannedOnly ? "10 10" : undefined
    }).addTo(routeLayer);
  } else if (options.showHeadingWhenSingle === true && Number.isFinite(Number(clean[0].track))) {
    drawDirectionLine(routeLayer, clean[0], clean[0].track, clean[0].speed, { color: "#f97316", weight: 4, opacity: 0.96 });
  }

  const start = clean[0];
  const end = clean[clean.length - 1];
  const endpoints = options.endpoints || null;

  if (latLngs.length === 1 && options.showCurrentMarker !== false) {
    L.marker([start.lat, start.lon], {
      pane: "routePane",
      interactive: false,
      keyboard: false,
      icon: routeEndpointIcon("AKTUALNIE", "start"),
      title: "Aktualna pozycja"
    }).addTo(routeLayer);
  }

  if (endpoints?.start && endpoints?.end) {
    L.marker([endpoints.start.lat, endpoints.start.lon], {
      pane: "routePane",
      interactive: false,
      keyboard: false,
      icon: routeEndpointIcon("START", "start"),
      title: `Start: ${endpoints.start.label || "potwierdzony punkt startu"}`
    }).addTo(routeLayer);

    const endMarkerText = options.endMarkerText || (plannedOnly ? "CEL" : "STOP");
    const endMarkerTitle = plannedOnly ? "Cel" : "Stop";
    L.marker([endpoints.end.lat, endpoints.end.lon], {
      pane: "routePane",
      interactive: false,
      keyboard: false,
      icon: routeEndpointIcon(endMarkerText, "end"),
      title: `${endMarkerTitle}: ${endpoints.end.label || "potwierdzony punkt końcowy"}`
    }).addTo(routeLayer);
  }

  lastRouteBounds = L.latLngBounds(latLngs);
  if (options.fitMap !== false) {
    map.fitBounds(lastRouteBounds.pad(0.18), { maxZoom: latLngs.length === 1 ? 10 : 11 });
  }

  const suffix = latLngs.length === 1
    ? (options.showHeadingWhenSingle === true ? "1 punkt + kierunek lotu" : "1 punkt rzeczywisty")
    : (plannedOnly ? `${latLngs.length} punkty znanej trasy lotniskowej` : `${latLngs.length} punktów rzeczywistego śladu`);
  const endpointText = endpoints?.start && endpoints?.end
    ? ` Start ${endpoints.start.label}; ${plannedOnly ? "cel" : "stop"} ${endpoints.end.label}.`
    : " Bez potwierdzonego startu i lądowania — nie pokazuję znaczników START/STOP.";
  setRouteSummary(`${label}: ${suffix}.${endpointText}`);
}

function clearRoute() {
  if (isHistoryMapMode()) setMapMode("live");
  if (routeLayer) routeLayer.clearLayers();
  lastRouteBounds = null;
  setRouteSummary("Mapa wyczyszczona.");
}

function routeEndpointIcon(text, type = "start") {
  return L.divIcon({
    className: "route-endpoint-div-icon",
    iconSize: [66, 30],
    iconAnchor: [33, 15],
    html: `<div class="route-endpoint ${type}">${escapeHtml(text)}</div>`
  });
}

function routeAirports(route) {
  if (!route) return [];
  const candidates = [route._airports, route.airports, route.route, route.stops, route.points];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
}

function routeAirportLabel(airport) {
  if (!airport) return "";
  if (typeof airport === "string") return airport.trim();
  return firstFilled(airport.iata, airport.icao, airport.code, airport.ident, airport.location, airport.city, airport.name);
}

function routeAirportVerbose(airport) {
  if (!airport || typeof airport === "string") return routeAirportLabel(airport);
  const code = firstFilled(airport.iata, airport.icao, airport.code, airport.ident);
  const place = firstFilled(airport.location, airport.city, airport.name, airport.country);
  if (code && place) return `${code} (${place})`;
  return code || place;
}

function routeValueText(value) {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value === "object") return routeAirportVerbose(value);
  return String(value).trim();
}

function firstRouteValue(...values) {
  for (const value of values) {
    const text = routeValueText(value);
    if (text) return text;
  }
  return "";
}

function routeInfo(route) {
  if (!route) return { short: "", verbose: "" };
  const airports = routeAirports(route);
  if (airports.length) {
    const short = airports.map(routeAirportLabel).filter(Boolean).join(" → ");
    const verbose = airports.map(routeAirportVerbose).filter(Boolean).join(" → ");
    return {
      short: route.plausible === false && short ? `? ${short}` : short,
      verbose: route.plausible === false && verbose ? `Dane niepewne: ${verbose}` : verbose
    };
  }

  const from = firstRouteValue(route.from, route.origin, route.departure, route.dep, route.source, route.start, route.fromAirport, route.originAirport, route.departureAirport);
  const to = firstRouteValue(route.to, route.destination, route.dest, route.arrival, route.arr, route.target, route.end, route.toAirport, route.destinationAirport, route.arrivalAirport);
  if (from && to) return { short: `${from} → ${to}`, verbose: route.verbose || `${from} → ${to}` };
  const fallback = firstRouteValue(route.short, route.verbose, route.text, route.name);
  return fallback ? { short: fallback, verbose: fallback } : { short: "", verbose: "" };
}

function routeInfoFromAircraft(aircraft) {
  const fromRoute = routeInfo(aircraft?._route);
  if (fromRoute.short) return fromRoute;

  const from = firstRouteValue(
    aircraft?.from,
    aircraft?.origin,
    aircraft?.departure,
    aircraft?.dep,
    aircraft?.from_airport,
    aircraft?.origin_airport,
    aircraft?.departure_airport
  );
  const to = firstRouteValue(
    aircraft?.to,
    aircraft?.destination,
    aircraft?.dest,
    aircraft?.arrival,
    aircraft?.arr,
    aircraft?.to_airport,
    aircraft?.destination_airport,
    aircraft?.arrival_airport
  );
  if (from && to) return { short: `${from} → ${to}`, verbose: `${from} → ${to}` };
  return { short: "", verbose: "" };
}

function routeText(aircraft) {
  const info = routeInfoFromAircraft(aircraft);
  return info.short ? `Skąd/dokąd: ${info.short}` : "Skąd/dokąd: brak danych";
}

function airportPoint(airport) {
  if (!airport || typeof airport !== "object") return null;
  const lat = numericFirst(airport.lat, airport.latitude, airport.latDeg, airport.lat_deg, airport.position?.lat, airport.location?.lat, airport.geo?.lat);
  const lon = numericFirst(airport.lon, airport.lng, airport.longitude, airport.lonDeg, airport.lon_deg, airport.position?.lon, airport.position?.lng, airport.location?.lon, airport.location?.lng, airport.geo?.lon, airport.geo?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lon, at: "", altitude: null, speed: null, track: null, airportLabel: routeAirportLabel(airport) };
}

function routeAirportPoints(aircraft) {
  return routeAirports(aircraft?._route).map(airportPoint).filter(validPoint);
}

function confirmedRouteEndpointPoints(aircraft) {
  const route = aircraft?._route;
  if (!route || route.plausible === false || route.confirmed === false) return null;
  const airports = routeAirports(route);
  if (airports.length < 2) return null;

  const startAirport = airports[0];
  const endAirport = airports[airports.length - 1];
  const startPoint = airportPoint(startAirport);
  const endPoint = airportPoint(endAirport);
  if (!validPoint(startPoint) || !validPoint(endPoint)) return null;

  const startLabel = routeAirportLabel(startAirport);
  const endLabel = routeAirportLabel(endAirport);
  if (!startLabel || !endLabel) return null;

  return {
    start: { ...startPoint, label: startLabel },
    end: { ...endPoint, label: endLabel }
  };
}

function routePartsForDisplay(aircraft) {
  const info = routeInfoFromAircraft(aircraft);
  const text = info.short || "";
  const parts = text.split(/\s*→\s*/).filter(Boolean);
  return {
    from: parts[0] || "N/A",
    to: parts.length > 1 ? parts[parts.length - 1] : "N/A",
    caption: info.verbose || "Skąd/dokąd: brak danych"
  };
}

function routeProgressFraction(start, current, end) {
  if (!validPoint(start) || !validPoint(current) || !validPoint(end)) return null;
  const meanLat = ((start.lat + end.lat) / 2) * Math.PI / 180;
  const cosLat = Math.cos(meanLat) || 1;
  const startX = start.lon * cosLat;
  const startY = start.lat;
  const currentX = current.lon * cosLat;
  const currentY = current.lat;
  const endX = end.lon * cosLat;
  const endY = end.lat;
  const dx = endX - startX;
  const dy = endY - startY;
  const lengthSquared = dx * dx + dy * dy;

  if (!Number.isFinite(lengthSquared) || lengthSquared <= 0) return null;
  return clampNumber(((currentX - startX) * dx + (currentY - startY) * dy) / lengthSquared, 0, 1);
}

function formatRouteDistanceKm(distanceKm) {
  const distance = Number(distanceKm);
  if (!Number.isFinite(distance)) return "";
  if (distance < 10) return `${distance.toFixed(1).replace(".", ",")} km`;
  return `${numberText(Math.round(distance))} km`;
}

function aircraftRouteProgressInfo(aircraft) {
  const endpoints = confirmedRouteEndpointPoints(aircraft);
  const current = pointFromAircraft(aircraft);
  if (!endpoints?.start || !endpoints?.end || !validPoint(current)) {
    return { known: false, percent: 50, distanceToDestinationText: "" };
  }

  const totalDistanceKm = distanceKmBetweenPoints(endpoints.start, endpoints.end);
  const distanceToDestinationKm = distanceKmBetweenPoints(current, endpoints.end);
  if (!Number.isFinite(totalDistanceKm) || totalDistanceKm <= 0 || !Number.isFinite(distanceToDestinationKm)) {
    return { known: false, percent: 50, distanceToDestinationText: "" };
  }

  const projectedFraction = routeProgressFraction(endpoints.start, current, endpoints.end);
  const fromStartKm = distanceKmBetweenPoints(endpoints.start, current);
  const ratioFraction = Number.isFinite(fromStartKm) ? fromStartKm / (fromStartKm + distanceToDestinationKm) : null;
  const fraction = Number.isFinite(projectedFraction) ? projectedFraction : ratioFraction;
  const percent = clampNumber((Number.isFinite(fraction) ? fraction : 0.5) * 100, 4, 96);
  const distanceToDestinationText = formatRouteDistanceKm(distanceToDestinationKm);

  return {
    known: true,
    percent,
    distanceToDestinationText,
    destinationLabel: endpoints.end.label || routePartsForDisplay(aircraft).to
  };
}

function updateAircraftSheetRouteProgress(aircraft) {
  if (!aircraftSheetPhaseIcon) return;
  const routeLine = aircraftSheetPhaseIcon.closest(".route-line");
  const progress = aircraftRouteProgressInfo(aircraft);

  if (!routeLine || !progress.known) {
    routeLine?.classList.remove("progress-known");
    routeLine?.style.setProperty("--route-progress", "50%");
    aircraftSheetPhaseIcon.removeAttribute("data-distance");
    aircraftSheetPhaseIcon.title = "Brak danych o odległości do celu";
    if (aircraftSheetRouteToMeta) aircraftSheetRouteToMeta.textContent = "cel";
    return;
  }

  routeLine.classList.add("progress-known");
  routeLine.style.setProperty("--route-progress", `${progress.percent}%`);
  aircraftSheetPhaseIcon.dataset.distance = progress.distanceToDestinationText;
  aircraftSheetPhaseIcon.title = `Do celu: ${progress.distanceToDestinationText}`;

  if (aircraftSheetRouteToMeta) {
    aircraftSheetRouteToMeta.textContent = progress.distanceToDestinationText ? `cel · ${progress.distanceToDestinationText}` : "cel";
  }
}

function routeDetailRows(aircraft) {
  const route = routePartsForDisplay(aircraft);
  return [
    ["Skąd", route.from],
    ["Dokąd", route.to],
    ["Planowany start", firstTimeValue(aircraft?.scheduled_departure, aircraft?.departure_time, aircraft?.dep_time, aircraft?.takeoff_time, aircraft?._route?.scheduled_departure, aircraft?._route?.departure_time, aircraft?.departure?.time, aircraft?.origin?.time)],
    ["Planowany przylot", firstTimeValue(aircraft?.scheduled_arrival, aircraft?.arrival_time, aircraft?.arr_time, aircraft?.landing_time, aircraft?.eta, aircraft?._route?.scheduled_arrival, aircraft?._route?.arrival_time, aircraft?.arrival?.time, aircraft?.destination?.time)],
    ["Opis trasy", route.caption],
    ["Aktualna wysokość", formatAltitude(aircraft?.alt_baro)],
    ["Aktualna prędkość", formatSpeed(aircraft?.gs)],
    ["Kurs", formatHeading(aircraftHeading(aircraft))]
  ];
}

async function drawRouteForFlight(flight) {
  if (routeLayer) routeLayer.clearLayers();
  lastRouteBounds = null;
  let points = [];
  try {
    points = await loadOfficialTrace(flight);
    if (points.length) {
      saveTracePointsIfUseful(flight.icao, flight.date, points);
      drawRoute(points, flight.name || flight.icao.toUpperCase());
      if (flight.date !== todayLocalDate()) {
        setRouteSummary(`Uwaga: trace API może zwrócić najbliższy dostępny ślad zamiast dokładnej daty z linku. ${routeSummary.textContent}`);
      }
      return;
    }
  } catch (error) {
    showToast(`Nie pobrałem pełnego śladu z API: ${error.message}`);
  }

  points = loadTrackPoints(flight.icao, flight.date).filter(validPoint);
  if (points.length >= 2) points = selectTraceSegmentForFlight(points, flight);
  let fallbackMessage = "";
  if (!points.length) {
    const latestTrack = loadLatestTrackPoints(flight.icao);
    if (latestTrack.points.length) {
      points = latestTrack.points.filter(validPoint);
      if (points.length >= 2) points = selectTraceSegmentForFlight(points, flight);
      fallbackMessage = `Nie mam lokalnego śladu z dnia ${flight.date}; pokazuję ślad z ${latestTrack.date}.`;
    }
  }
  if (!points.length && flight.lat && flight.lon) {
    const savedPoint = { lat: Number(flight.lat), lon: Number(flight.lon), at: new Date().toISOString() };
    if (validPoint(savedPoint)) points = [savedPoint];
  }

  if (points.length) {
    drawRoute(points, flight.name || flight.icao.toUpperCase());
    if (fallbackMessage) {
      setRouteSummary(`${fallbackMessage} ${routeSummary.textContent}`);
    }
    if (points.length === 1) {
      setRouteSummary("Mam tylko jeden punkt. Dalsze punkty będą dopisywane automatycznie podczas odświeżania mapy.");
    }
    return;
  }

  setRouteSummary("Darmowe API pokazuje aktualne pozycje, ale nie daje gotowego historycznego śladu. Program buduje ślad z kolejnych automatycznych odświeżeń.");
}

async function drawRouteFromForm() {
  try {
    await runBusy("Rysuję samolot na mapie...", () => drawRouteForFlight(readFormFlight()));
  } catch (error) {
    showToast(error.message);
  }
}

function drawKnownAirportRouteFallback(aircraft, options = {}, messagePrefix = "") {
  const endpoints = confirmedRouteEndpointPoints(aircraft);
  if (!endpoints?.start || !endpoints?.end) return false;

  const aircraftPoint = pointFromAircraft(aircraft);
  const points = plannedAirportRoutePointsThroughAircraft(aircraft, endpoints).filter(validPoint);
  if (points.length < 2) return false;

  drawRoute(points, `${aircraftLabel(aircraft)} • trasa lotniskowa przez aktualną pozycję`, {
    endpoints,
    fitMap: options.fitMap === true,
    showCurrentMarker: false,
    showHeadingWhenSingle: false,
    plannedOnly: true,
    endMarkerText: "CEL"
  });

  const currentText = validPoint(aircraftPoint) ? " i aktualną pozycję samolotu" : "";
  setRouteSummary(`${messagePrefix}${aircraftLabel(aircraft)}: znam start i cel (${endpoints.start.label} → ${endpoints.end.label})${currentText}. Brak pełnego śladu ADS-B z API, więc pokazuję trasę orientacyjną START → aktualna pozycja → CEL. To nie jest zapis punkt po punkcie z ADS-B.`);
  return true;
}

async function ensureAircraftRouteData(aircraft) {
  if (!aircraft || hasConfirmedEndpointCoordinates(aircraft)) return aircraft;
  const callsign = aircraftCallsign(aircraft);
  if (!callsign) return aircraft;
  const cache = loadRouteCache();
  const cached = routeFromCache(cache, callsign);
  if (cached) {
    aircraft._route = cached;
    return aircraft;
  }
  try {
    await enrichAircraftRoutes([aircraft]);
  } catch {
    // Brak danych skąd/dokąd nie może zatrzymać pobierania trace.
  }
  return aircraft;
}

function drawStoredTrackForAircraft(aircraft) {
  const icao = normalizeIcao(aircraft.hex || "");
  const point = pointFromAircraft(aircraft);
  if (!icao || !point) return [];
  const points = addTrackPoint(icao, todayLocalDate(), point);
  const clean = points.filter(validPoint);
  if (clean.length > 1) {
    L.polyline(clean.map((item) => [item.lat, item.lon]), {
      pane: "routePane",
      interactive: false,
      color: "#16a34a",
      weight: 3,
      opacity: 0.68
    }).addTo(aircraftLayer);
  } else if (Number.isFinite(Number(point.track))) {
    drawDirectionLine(aircraftLayer, point, point.track, point.speed, { color: "#0ea5e9", weight: 2, opacity: 0.72 });
  }
  return clean;
}

function drawLocalSelectedAircraftRoute(aircraft, options = {}, messagePrefix = "") {
  const flight = aircraftToFlight(aircraft);
  const point = pointFromAircraft(aircraft);
  const confirmedEndpoints = confirmedRouteEndpointPoints(aircraft);
  let points = [];

  if (isValidIcao(flight.icao)) {
    points = loadTrackPoints(flight.icao, flight.date).filter(validPoint);
    if (point) points = addTrackPoint(flight.icao, flight.date, point).filter(validPoint);
    if (points.length >= 2) points = selectTraceSegmentForFlight(points, flight);
  }
  if (!points.length && point) points = [point];

  if (points.length) {
    drawRoute(points, `${aircraftLabel(aircraft)} • rzeczywisty ślad przelotu`, {
      endpoints: null,
      fitMap: options.fitMap === true,
      showCurrentMarker: points.length === 1,
      showHeadingWhenSingle: false
    });

    if (points.length === 1) {
      setRouteSummary(`${messagePrefix}${aircraftLabel(aircraft)}: mam tylko jeden rzeczywisty punkt. Nie rysuję sztucznej prostej START → CEL; kolejne punkty będą dopisywane z odświeżeń.`);
    } else {
      setRouteSummary(`${messagePrefix}${aircraftLabel(aircraft)}: pokazuję lokalny rzeczywisty ślad z ${points.length} punktów.`);
    }
    return points;
  }

  clearRoute();
  setRouteSummary(`${aircraftLabel(aircraft)}: brak rzeczywistych punktów przelotu do narysowania trasy.`);
  return [];
}

async function drawSelectedAircraftRouteAsync(aircraft, options = {}) {
  aircraft = await ensureAircraftRouteData(aircraft);
  let flight = aircraftToFlight(aircraft);
  fillForm(flight);

  const point = pointFromAircraft(aircraft);
  if (point && isValidIcao(flight.icao)) {
    addTrackPoint(flight.icao, flight.date, point);
  }

  if (!isValidIcao(flight.icao)) {
    drawLocalSelectedAircraftRoute(aircraft, options);
    return;
  }

  const traceKey = trackKey(flight.icao, flight.date);
  const lastTraceAttempt = traceApiAttemptedAt.get(traceKey) || 0;
  if (options.forceApiTrace !== true && Date.now() - lastTraceAttempt < TRACE_API_RETRY_COOLDOWN_MS) {
    drawLocalSelectedAircraftRoute(aircraft, options, "Trace API sprawdzane przed chwilą — ");
    return;
  }
  traceApiAttemptedAt.set(traceKey, Date.now());

  setRouteSummary(`${aircraftLabel(aircraft)}: sprawdzam publiczne pliki trace używane przez mapę ADS...`);
  try {
    const apiPoints = await loadOfficialTrace(flight);
    const mergedApiPoints = appendCurrentAircraftPointToTrace(apiPoints, aircraft);
    const cleanApiPoints = saveTracePointsIfUseful(flight.icao, flight.date, mergedApiPoints);
    if (cleanApiPoints.length >= 2) {
      drawRoute(cleanApiPoints, `${aircraftLabel(aircraft)} • realny ślad lotu z API`, {
        endpoints: null,
        fitMap: options.fitMap === true,
        showCurrentMarker: false,
        showHeadingWhenSingle: false
      });
      setRouteSummary(`${aircraftLabel(aircraft)}: pokazuję realny ślad punktowy z API do aktualnej pozycji, ${cleanApiPoints.length} punktów. Jeśli samolot wcześniej krążył, zakręty będą widoczne tylko wtedy, gdy API zwróciło te punkty.`);
      return;
    }
  } catch (error) {
    console.warn("Nie udało się pobrać pełnego trace API:", error);
    drawLocalSelectedAircraftRoute(aircraft, options, "Trace API niedostępne — ");
    return;
  }

  drawLocalSelectedAircraftRoute(aircraft, options, "Nie znalazłem pełnego trace z mapy ADS — ");
}

function drawSelectedAircraftRoute(aircraft, options = {}) {
  drawSelectedAircraftRouteAsync(aircraft, options).catch((error) => {
    console.error("Nie udało się narysować trasy samolotu:", error);
    drawLocalSelectedAircraftRoute(aircraft, options, "Błąd pobierania trasy — ");
  });
}

function clearAircraftMap() {
  initMap();
  if (aircraftLayer) aircraftLayer.clearLayers();
  if (trailLayer) trailLayer.clearLayers();
}

function renderAircraftMap(aircraft, settings = {}, options = {}) {
  if (isHistoryMapMode() && options.forceLiveRender !== true) return;
  initMap();
  invalidateMapSoon();
  if (!map || !aircraftLayer) return;
  aircraftLayer.clearLayers();
  const performance = readPerformanceSettings();
  const visibleAircraft = filterAircraftForDisplay(aircraft).slice(0, performance.mapLimit);
  const bounds = [];

  drawVisibleAircraftTracks(visibleAircraft);

  for (const item of visibleAircraft) {
    const aircraftPoint = pointFromAircraft(item);
    if (!aircraftPoint) continue;
    bounds.push([aircraftPoint.lat, aircraftPoint.lon]);
    makeAircraftMarker(item);
  }
  updateSelectedAircraftMarkerHighlight();

  if (bounds.length && !lastRouteBounds && !options.preserveView) {
    map.fitBounds(L.latLngBounds(bounds).pad(0.18), { maxZoom: Math.max(8, Number(settings.dist) > 60 ? 8 : 10) });
  }
}

function makeAircraftMarker(aircraft) {
  const aircraftPoint = pointFromAircraft(aircraft);
  if (!aircraftPoint || !aircraftLayer) return null;
  const marker = L.marker([aircraftPoint.lat, aircraftPoint.lon], {
    pane: "aircraftPane",
    icon: aircraftIcon(aircraft),
    title: aircraftLabel(aircraft),
    riseOnHover: true,
    riseOffset: 900
  }).addTo(aircraftLayer);

  marker.on("click", (event) => {
    if (event?.originalEvent) L.DomEvent.stopPropagation(event.originalEvent);
    clearManualSearchInputLock();
    closeDrawerPanel();
    savedMapFocusActive = false;
    selectedAircraft = aircraft;
    updateSelectedAircraftMarkerHighlight();
    drawSelectedAircraftRoute(aircraft, { fitMap: false });
    showSelectedAircraftSheet(aircraft);
  });
  return marker;
}

function focusAircraftOnMap(aircraft, options = {}) {
  if (isHistoryMapMode() && options.keepHistoryMode !== true) {
    setMapMode("live");
    if (routeLayer) routeLayer.clearLayers();
    lastRouteBounds = null;
  }
  initMap();
  invalidateMapSoon();
  if (!map || !aircraft || !aircraftLayer) return false;

  const point = pointFromAircraft(aircraft);
  if (!point) {
    setRouteSummary(`${aircraftLabel(aircraft)}: brak aktualnej pozycji GPS.`);
    showSelectedAircraftSheet(aircraft);
    return false;
  }

  if (options.singleMarker) {
    aircraftLayer.clearLayers();
    if (trailLayer) trailLayer.clearLayers();
    makeAircraftMarker(aircraft);
  }

  if (options.drawRoute !== false) drawSelectedAircraftRoute(aircraft, { fitMap: options.fitMap === true });
  if (options.showSheet !== false) showSelectedAircraftSheet(aircraft);

  if (options.centerMap === true) {
    const requestedZoom = Number(options.zoom ?? zoomInput?.value ?? 9.2);
    const currentZoom = Number(map.getZoom?.() || 0);
    const nextZoom = Number.isFinite(requestedZoom) ? Math.min(13, Math.max(currentZoom || 0, requestedZoom)) : Math.max(currentZoom || 0, 9);
    map.setView([point.lat, point.lon], nextZoom || 9, { animate: false });
  }
  return true;
}

function updateSelectedAircraftMarkerHighlight() {
  const selectedIcao = aircraftIcao(selectedAircraft);
  document.querySelectorAll(".plane-marker-wrap[data-icao]").forEach((element) => {
    const isSelected = isValidIcao(selectedIcao) && normalizeIcao(element.dataset.icao) === selectedIcao;
    element.classList.toggle("aircraft-selected", isSelected);
    element.closest(".aircraft-div-icon")?.classList.toggle("aircraft-selected", isSelected);
  });
}

function drawVisibleAircraftTracks(aircraft) {
  if (!trailLayer) return;
  trailLayer.clearLayers();
  // Ślady wszystkich samolotów są nadal zapisywane w pamięci sesji,
  // ale na mapie rysujemy wyłącznie ścieżkę wybranego samolotu.
  visibleTrackSets(aircraft);
}

function visibleTrackSets(aircraft) {
  const tracks = loadTracks();
  const date = todayLocalDate();
  const result = [];
  let changed = false;

  const performance = readPerformanceSettings();
  for (const item of aircraft.slice(0, performance.trailLimit)) {
    const icao = aircraftIcao(item);
    const point = pointFromAircraft(item);
    if (!isValidIcao(icao) || !point) continue;

    const key = trackKey(icao, date);
    let points = Array.isArray(tracks[key]) ? tracks[key].filter(validPoint) : [];
    const previous = points[points.length - 1];

    if (previous && shouldBreakTraceSegment(previous, point)) {
      points = [point];
      tracks[key] = points;
      changed = true;
    } else {
      const moved = !previous || Math.abs(previous.lat - point.lat) > 0.0005 || Math.abs(previous.lon - point.lon) > 0.0005;
      if (moved) {
        points.push(point);
        tracks[key] = points.slice(-MAX_TRACK_POINTS);
        changed = true;
      }
    }
    result.push({ icao, points: (tracks[key] || points).filter(validPoint).slice(-performance.trackPoints) });
  }

  if (changed) storageJsonSet(TRACK_STORAGE_KEY, pruneTrackCache(tracks));
  return result;
}

function hasConfirmedEndpointCoordinates(aircraft) {
  const endpoints = confirmedRouteEndpointPoints(aircraft);
  return Boolean(endpoints?.start && endpoints?.end);
}
