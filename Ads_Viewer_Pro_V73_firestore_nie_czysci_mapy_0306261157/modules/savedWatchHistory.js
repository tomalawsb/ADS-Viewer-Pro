// ADS Viewer Pro - savedWatchHistory.js
// Wydzielone z app.js w wersji V59. Klasyczny skrypt, funkcje globalne.
function sanitizeSyncKey(value) {
  return String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function generateSyncKey() {
  return `ads-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`;
}

function flightTimestampMs(flight) {
  const candidates = [flight?.updatedAt, flight?.createdAt, flight?.savedAt, flight?.date];
  for (const item of candidates) {
    const parsed = Date.parse(item || "");
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

function flightMergeKey(flight) {
  const icao = normalizeIcao(flight?.icao || flight?.hex || "");
  const date = String(flight?.date || "").trim();
  if (icao) return `${icao}|${date}`;
  return sanitizeFirestoreDocId(flight?.id || "");
}

function normalizeFlightForStorage(flight) {
  const source = flight && typeof flight === "object" ? flight : {};
  const now = new Date().toISOString();
  const icao = normalizeIcao(source.icao || source.hex || "");
  const date = source.date || todayLocalDate();
  const fallbackId = [icao || "samolot", date || "data"].join("-");
  const id = sanitizeFirestoreDocId(source.id || fallbackId);
  return {
    ...source,
    id,
    icao,
    date,
    createdAt: source.createdAt || now,
    updatedAt: source.updatedAt || source.createdAt || now
  };
}

function normalizeFlightsForStorage(flights) {
  const map = new Map();
  for (const item of Array.isArray(flights) ? flights : []) {
    const flight = normalizeFlightForStorage(item);
    if (!isValidIcao(flight.icao)) continue;
    if (isFlightDeletedByTombstone(flight)) continue;
    const key = flightMergeKey(flight);
    const existing = map.get(key);
    if (!existing || flightTimestampMs(flight) >= flightTimestampMs(existing)) {
      map.set(key, flight);
    }
  }
  return Array.from(map.values()).sort((a, b) => flightTimestampMs(b) - flightTimestampMs(a));
}

function loadFlights() {
  try {
    const parsed = JSON.parse(storageGet(STORAGE_KEY, "[]"));
    return normalizeFlightsForStorage(Array.isArray(parsed) ? parsed : []);
  } catch {
    return [];
  }
}

function saveFlights(flights, options = {}) {
  const normalized = normalizeFlightsForStorage(flights);
  storageSet(STORAGE_KEY, JSON.stringify(normalized));
  if (!options.skipSync && !firestoreApplyingRemote) {
    scheduleFirestorePush();
  }
}

function loadWatchlist() {
  try {
    const parsed = JSON.parse(storageGet(WATCHLIST_STORAGE_KEY, "[]"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveWatchlist(items, options = {}) {
  storageSet(WATCHLIST_STORAGE_KEY, JSON.stringify(Array.isArray(items) ? items : []));
  if (!options.skipSync) markFirestoreStateSectionDirty("watchlist");
}

function watchItemFromIcao(icao, options = {}) {
  const cleanIcao = normalizeIcao(icao);
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${cleanIcao}`,
    icao: cleanIcao,
    name: options.name || cleanIcao.toUpperCase(),
    callsign: options.callsign || "",
    registration: options.registration || "",
    type: options.type || "",
    kind: options.kind || "",
    lat: "",
    lon: "",
    altitude: "",
    speed: "",
    heading: "",
    pendingLive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSeenAt: "",
    lastCheckedAt: ""
  };
}

function watchItemFromAircraft(aircraft) {
  const flight = aircraftToFlight(aircraft);
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${flight.icao}`,
    icao: flight.icao,
    name: flight.name || flight.icao.toUpperCase(),
    callsign: flight.callsign || "",
    registration: flight.registration || "",
    type: flight.type || "",
    kind: flight.kind || aircraftTypeGroup(aircraft),
    lat: flight.lat || "",
    lon: flight.lon || "",
    altitude: flight.altitude ?? "",
    speed: flight.speed ?? "",
    heading: flight.heading ?? "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSeenAt: new Date().toISOString()
  };
}

function watchToFlight(item) {
  return {
    id: item?.id || `${Date.now()}-${item?.icao || "watch"}`,
    icao: normalizeIcao(item?.icao || item?.hex || ""),
    name: item?.name || item?.callsign || normalizeIcao(item?.icao || "").toUpperCase(),
    date: todayLocalDate(),
    zoom: zoomInput?.value?.trim?.() || "9.2",
    lat: item?.lat || "",
    lon: item?.lon || "",
    callsign: item?.callsign || "",
    type: item?.type || "",
    registration: item?.registration || "",
    altitude: item?.altitude ?? "",
    speed: item?.speed ?? "",
    heading: item?.heading ?? "",
    kind: item?.kind || ""
  };
}

function upsertWatchItem(item, options = {}) {
  const cleanIcao = normalizeIcao(item?.icao || item?.hex || "");
  if (!isValidIcao(cleanIcao)) {
    if (!options.silent) showToast("Brak poprawnego kodu ICAO/hex do obserwowania.", 3600);
    return false;
  }
  const watchItem = { ...item, icao: cleanIcao, updatedAt: new Date().toISOString() };
  const items = loadWatchlist();
  const existing = items.find((entry) => normalizeIcao(entry.icao || "") === cleanIcao);
  const next = items.filter((entry) => normalizeIcao(entry.icao || "") !== cleanIcao);
  next.unshift({ ...(existing || {}), ...watchItem, id: existing?.id || watchItem.id || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${cleanIcao}`) });
  if (!existing) clearFiredAlertForIcao(cleanIcao);
  saveWatchlist(next);
  if (options.enableAlerts !== false) ensureWatchlistAlertsEnabled();
  renderWatchlist();
  checkWatchedAircraftGlobalInBackground(lastAircraftCache, { immediate: true });
  return true;
}

function upsertWatchFromAircraft(aircraft, options = {}) {
  if (!aircraft) {
    if (!options.silent) showToast("Najpierw wybierz samolot.", 2600);
    return false;
  }
  const ok = upsertWatchItem(watchItemFromAircraft(aircraft), options);
  if (ok && !options.silent) showToast("Dodano do obserwowanych.");
  return ok;
}

async function addWatchFromCurrentInput() {
  try {
    const raw = icaoInput.value.trim();
    if (!raw) throw new Error("Wpisz samolot w polu Szukaj albo wybierz go na mapie.");
    const resolvedIcao = normalizeIcao(icaoInput.dataset.resolvedIcao || "");
    const directIcao = explicitIcaoFromInput(raw) || (isValidIcao(resolvedIcao) ? resolvedIcao : "");

    if (isValidIcao(directIcao)) {
      const liveOrSelected = aircraftIcao(selectedAircraft) === directIcao ? selectedAircraft : findAircraftByIcaoInCache(directIcao);
      if (liveOrSelected && pointFromAircraft(liveOrSelected)) {
        upsertWatchFromAircraft(liveOrSelected);
      } else {
        const staticName = nameInput?.value?.trim?.() || directIcao.toUpperCase();
        upsertWatchItem(watchItemFromIcao(directIcao, { name: staticName }));
        enrichOfflineWatchItemInBackground(directIcao);
      }
      showToast(`Dodano ${directIcao.toUpperCase()} do obserwowanych. Brak pozycji LIVE nie blokuje alertu.`, 4600);
      setAircraftStatus(`${directIcao.toUpperCase()}: dodany do obserwowanych. Jeśli nie ma pozycji LIVE, program będzie sprawdzał ten HEX globalnie w tle.`);
      checkWatchedAircraftGlobalInBackground(lastAircraftCache, { immediate: true });
      return;
    }

    const match = findAircraftBySmartQuery(raw);
    if (match) {
      const aircraft = match.icao && !match.hex ? flightToAircraft(match) : match;
      upsertWatchFromAircraft(aircraft);
      return;
    }

    const resolved = resolveSmartFlightInput(raw);
    upsertWatchItem({
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${resolved.icao}`,
      icao: resolved.icao,
      name: resolved.name || resolved.icao.toUpperCase(),
      lat: resolved.lat || "",
      lon: resolved.lon || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastSeenAt: ""
    });
    showToast("Dodano do obserwowanych.");
  } catch (error) {
    showToast(error.message || "Nie udało się dodać obserwowanego.", 4200);
  }
}

function updateWatchlistFromAircraft(aircraftArray) {
  const watched = loadWatchlist();
  if (!watched.length || !Array.isArray(aircraftArray) || !aircraftArray.length) {
    renderWatchlist();
    return;
  }

  const byIcao = new Map(aircraftArray.map((item) => [aircraftIcao(item), item]).filter(([icao]) => isValidIcao(icao)));
  let changed = false;
  const next = watched.map((item) => {
    const cleanIcao = normalizeIcao(item.icao || "");
    const live = byIcao.get(cleanIcao);
    if (!live) return item;
    const point = pointFromAircraft(live);
    const updated = watchItemFromAircraft(mergeFlightRouteIntoAircraft(live, item));
    changed = true;
    return {
      ...item,
      ...updated,
      id: item.id,
      name: updated.name || item.name,
      lat: point ? String(point.lat) : item.lat,
      lon: point ? String(point.lon) : item.lon,
      lastSeenAt: new Date().toISOString(),
      lastCheckedAt: new Date().toISOString(),
      pendingLive: false,
      updatedAt: new Date().toISOString()
    };
  });

  if (changed) saveWatchlist(next, { skipSync: true });
  renderWatchlist();
}

function renderWatchlist() {
  if (!watchList || !watchTemplate) return;
  const items = loadWatchlist();
  watchList.replaceChildren();
  if (watchEmptyState) watchEmptyState.hidden = items.length > 0;

  const liveIcaos = new Set((lastAircraftCache || []).map(aircraftIcao).filter(isValidIcao));
  const fragment = document.createDocumentFragment();
  for (const item of items) {
    const node = watchTemplate.content.firstElementChild.cloneNode(true);
    const flight = watchToFlight(item);
    const live = liveIcaos.has(flight.icao);
    setAircraftPhoto(node.querySelector(".flight-thumb"), flight, { compact: true, forceRealPhoto: true });
    node.querySelector(".flight-name").textContent = item.name || item.callsign || flight.icao.toUpperCase();
    const metaParts = [
      live ? "LIVE" : (item.lastSeenAt ? "poza mapą" : "czeka na LIVE"),
      flight.icao ? flight.icao.toUpperCase() : "",
      item.callsign,
      item.registration,
      item.type,
      item.lastSeenAt ? `ostatnio ${new Date(item.lastSeenAt).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}` : ""
    ].filter(Boolean);
    node.querySelector(".flight-meta").textContent = metaParts.join(" • ");
    node.classList.toggle("is-live", live);

    node.querySelector(".ads-watch").addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openFlightInAds(flight);
    });

    node.querySelector(".map-watch").addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      clearManualSearchInputLock();
      fillForm(flight, { force: true });
      await showSavedFlightOnMap(flight);
    });

    node.querySelector(".delete-watch").addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      clearFiredAlertForIcao(flight.icao);
      saveWatchlist(loadWatchlist().filter((entry) => entry.id !== item.id && normalizeIcao(entry.icao || "") !== flight.icao));
      renderWatchlist();
      showToast("Usunięto z obserwowanych.");
    });

    fragment.append(node);
  }
  watchList.append(fragment);
}

function loadFlightHistory() {
  const parsed = storageJsonGet(HISTORY_STORAGE_KEY, []);
  return Array.isArray(parsed) ? parsed : [];
}

function saveFlightHistory(items) {
  storageJsonSet(HISTORY_STORAGE_KEY, Array.isArray(items) ? items.slice(0, HISTORY_MAX_ENTRIES) : []);
}

function historyTimeText(value) {
  if (!value) return "brak czasu";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "brak czasu";
  return date.toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function historySearchText(item) {
  return [
    item?.name,
    item?.icao,
    item?.callsign,
    item?.registration,
    item?.type,
    item?.kind,
    item?.routeShort,
    item?.reason,
    item?.firstSeenAt,
    item?.lastSeenAt
  ].filter(Boolean).join(" ").toUpperCase();
}

function historyReasonForAircraft(aircraft, watchedIcaos, basePoint) {
  const reasons = [];
  const icao = aircraftIcao(aircraft);
  const alt = aircraftAltitudeNumber(aircraft);
  const point = pointFromAircraft(aircraft);
  if (watchedIcaos.has(icao)) reasons.push("obserwowany");
  if (aircraftTypeGroup(aircraft) === "special") reasons.push("specjalny/wojskowy");
  if (Number.isFinite(alt) && alt <= HISTORY_LOW_ALT_FT) reasons.push(`niski: ${formatAltitude(alt)}`);
  if (basePoint && point) {
    const distance = distanceKmBetween(basePoint, point);
    if (Number.isFinite(distance) && distance <= HISTORY_CLOSE_KM) reasons.push(`blisko: ${numberText(distance, 1)} km`);
  }
  return reasons.length ? reasons.join(", ") : "widziany na mapie";
}

function historyEntryFromAircraft(aircraft, reason, nowIso) {
  const flight = aircraftToFlight(aircraft);
  const point = pointFromAircraft(aircraft);
  return {
    id: `${flight.icao}-${Math.floor(Date.now() / HISTORY_BUCKET_MS)}`,
    icao: flight.icao,
    name: flight.name || flight.icao.toUpperCase(),
    callsign: flight.callsign || aircraftCallsign(aircraft),
    registration: flight.registration || "",
    type: flight.type || "",
    kind: flight.kind || aircraftTypeGroup(aircraft),
    routeShort: flight.routeShort || "",
    routeVerbose: flight.routeVerbose || "",
    lat: point ? String(point.lat) : flight.lat,
    lon: point ? String(point.lon) : flight.lon,
    altitude: aircraft.alt_baro ?? flight.altitude ?? "",
    speed: aircraft.gs ?? flight.speed ?? "",
    heading: aircraftHeading(aircraft) ?? flight.heading ?? "",
    firstSeenAt: nowIso,
    lastSeenAt: nowIso,
    count: 1,
    reason
  };
}

function recordAircraftHistory(aircraftArray) {
  if (!Array.isArray(aircraftArray) || !aircraftArray.length) {
    renderFlightHistory();
    return;
  }
  const now = Date.now();
  if (now - lastHistoryWriteAt < HISTORY_RECORD_COOLDOWN_MS) return;
  lastHistoryWriteAt = now;

  const watchedIcaos = new Set(loadWatchlist().map((item) => normalizeIcao(item.icao || "")).filter(isValidIcao));
  const basePoint = alertBasePoint();
  const nowIso = new Date(now).toISOString();
  const history = loadFlightHistory();
  const byId = new Map(history.map((item) => [item.id, item]));
  const performance = readPerformanceSettings();
  const candidates = lifecycleFilteredAircraft(aircraftArray, performance).slice(0, Math.min(HISTORY_RECORD_LIMIT, performance.mapLimit || HISTORY_RECORD_LIMIT));

  for (const aircraft of candidates) {
    const icao = aircraftIcao(aircraft);
    if (!isValidIcao(icao) || !pointFromAircraft(aircraft)) continue;
    const bucket = Math.floor(now / HISTORY_BUCKET_MS);
    const id = `${icao}-${bucket}`;
    const reason = historyReasonForAircraft(aircraft, watchedIcaos, basePoint);
    const fresh = historyEntryFromAircraft(aircraft, reason, nowIso);
    const existing = byId.get(id);
    byId.set(id, existing ? {
      ...existing,
      ...fresh,
      id,
      firstSeenAt: existing.firstSeenAt || fresh.firstSeenAt,
      count: Number(existing.count || 1) + 1,
      reason: Array.from(new Set([existing.reason, fresh.reason].filter(Boolean).join(", ").split(", ").filter(Boolean))).join(", ")
    } : fresh);
  }

  const next = Array.from(byId.values())
    .sort((a, b) => new Date(b.lastSeenAt || 0) - new Date(a.lastSeenAt || 0))
    .slice(0, HISTORY_MAX_ENTRIES);
  saveFlightHistory(next);
  renderFlightHistory();
}

function historyItemToFlight(item) {
  return {
    id: item?.id || `${Date.now()}-${item?.icao || "history"}`,
    icao: normalizeIcao(item?.icao || ""),
    name: item?.name || item?.callsign || normalizeIcao(item?.icao || "").toUpperCase(),
    date: todayLocalDate(),
    zoom: zoomInput?.value?.trim?.() || "9.2",
    lat: item?.lat || "",
    lon: item?.lon || "",
    callsign: item?.callsign || "",
    type: item?.type || "",
    registration: item?.registration || "",
    routeShort: item?.routeShort || "",
    routeVerbose: item?.routeVerbose || "",
    altitude: item?.altitude ?? "",
    speed: item?.speed ?? "",
    heading: item?.heading ?? "",
    kind: item?.kind || ""
  };
}

function renderFlightHistory() {
  if (!historyList || !historyTemplate) return;
  const items = loadFlightHistory();
  const query = String(historySearchInput?.value || "").trim().toUpperCase();
  const visibleItems = query ? items.filter((item) => historySearchText(item).includes(query)) : items;
  historyList.replaceChildren();
  if (historyEmptyState) historyEmptyState.hidden = items.length > 0;

  const fragment = document.createDocumentFragment();
  for (const item of visibleItems) {
    const node = historyTemplate.content.firstElementChild.cloneNode(true);
    const flight = historyItemToFlight(item);
    setAircraftPhoto(node.querySelector(".flight-thumb"), flight, { realPhoto: false, compact: true });
    node.querySelector(".flight-name").textContent = item.name || item.callsign || flight.icao.toUpperCase();
    const metaParts = [
      historyTimeText(item.lastSeenAt),
      item.icao ? item.icao.toUpperCase() : "",
      item.callsign,
      item.registration,
      item.type,
      item.routeShort,
      item.reason,
      item.count > 1 ? `${item.count} odświeżeń` : ""
    ].filter(Boolean);
    node.querySelector(".flight-meta").textContent = metaParts.join(" • ");

    node.querySelector(".ads-history").addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openFlightInAds(flight);
    });
    node.querySelector(".map-history").addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      clearManualSearchInputLock();
      fillForm(flight, { force: true });
      await showSavedFlightOnMap(flight);
    });
    node.querySelector(".watch-history").addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      upsertWatchItem({
        id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${flight.icao}`,
        icao: flight.icao,
        name: flight.name,
        callsign: flight.callsign,
        registration: flight.registration,
        type: flight.type,
        kind: flight.kind,
        lat: flight.lat,
        lon: flight.lon,
        altitude: flight.altitude,
        speed: flight.speed,
        heading: flight.heading,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastSeenAt: item.lastSeenAt || ""
      });
    });
    node.querySelector(".delete-history").addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      saveFlightHistory(loadFlightHistory().filter((entry) => entry.id !== item.id));
      renderFlightHistory();
      showToast("Usunięto wpis z historii.");
    });
    fragment.append(node);
  }
  historyList.append(fragment);
}

async function deleteSavedFlight(flight) {
  const id = markFlightDeletedLocally(flight);
  saveFlights(loadFlights().filter((item) => firestoreFlightDocId(item) !== id), { skipSync: true });
  renderFlights();
  showToast("Usunięto zapis.");
  try {
    await pushDeletedFlightToFirestore(id);
    setFirestoreStatus(firestoreStatusSummary("Usunięcie zsynchronizowane z Firestore"), "ok");
  } catch (error) {
    setFirestoreStatus(`Usunięto lokalnie. Firestore zsynchronizuje później: ${error.message || error}`, "error");
  }
}

async function clearSavedFlights() {
  const flights = loadFlights();
  for (const flight of flights) markFlightDeletedLocally(flight);
  saveFlights([], { skipSync: true });
  renderFlights();
  showToast("Lista wyczyszczona.");
  try {
    await pushLocalTombstonesToFirestore();
    setFirestoreStatus(firestoreStatusSummary("Usunięcia zsynchronizowane z Firestore"), "ok");
  } catch (error) {
    setFirestoreStatus(`Wyczyszczono lokalnie. Firestore zsynchronizuje później: ${error.message || error}`, "error");
  }
}

function refreshSavedFlightSnapshot(originalFlight, aircraft) {
  if (!originalFlight || !aircraft) return;
  const point = pointFromAircraft(aircraft);
  const updated = aircraftToFlight(mergeFlightRouteIntoAircraft(aircraft, originalFlight));
  const flights = loadFlights();
  const next = flights.map((item) => {
    const same = item.id === originalFlight.id || (item.icao === originalFlight.icao && item.date === originalFlight.date);
    if (!same) return item;
    return {
      ...item,
      name: updated.name || item.name,
      callsign: updated.callsign || item.callsign,
      type: updated.type || item.type,
      registration: updated.registration || item.registration,
      routeShort: updated.routeShort || item.routeShort,
      routeVerbose: updated.routeVerbose || item.routeVerbose,
      altitude: updated.altitude !== "" ? updated.altitude : item.altitude,
      speed: updated.speed !== "" ? updated.speed : item.speed,
      heading: updated.heading !== "" ? updated.heading : item.heading,
      lat: point ? String(point.lat) : item.lat,
      lon: point ? String(point.lon) : item.lon,
      updatedAt: new Date().toISOString()
    };
  });
  saveFlights(next);
  renderFlights();
}

function resolveSavedFlightAircraft(flight) {
  const cached = findAircraftByIcaoInCache(flight?.icao || flight?.hex || "");
  const aircraft = cached ? mergeFlightRouteIntoAircraft(cached, flight) : flightToAircraft(flight);
  return pointFromAircraft(aircraft) ? aircraft : null;
}

async function refreshSavedFlightLiveInBackground(flight) {
  const cleanIcao = normalizeIcao(flight?.icao || "");
  if (!isValidIcao(cleanIcao)) return;
  try {
    const live = await fetchAircraftByHex(cleanIcao, { preferCache: false, fallbackAllSources: false, timeoutMs: HEX_FETCH_TIMEOUT_MS, allowProxy: false });
    if (!live) return;
    const aircraft = mergeFlightRouteIntoAircraft(live, flight);
    refreshSavedFlightSnapshot(flight, aircraft);
    if (savedMapFocusActive && aircraftIcao(selectedAircraft) === cleanIcao) {
      selectedAircraft = aircraft;
      focusAircraftOnMap(aircraft, { singleMarker: true, showSheet: false, drawRoute: true, zoom: flight.zoom || zoomInput?.value });
      setRouteSummary(`${flight.name || cleanIcao.toUpperCase()}: pozycja odświeżona w tle.`);
    }
  } catch {
    // Odświeżanie live jest dodatkiem. Zapisany punkt ma pozostać widoczny bez czekania na API.
  }
}

async function showSavedFlightOnMap(flight) {
  closeDrawerPanel();
  hideSelectedAircraftSheet();
  map?.closePopup?.();
  initMap();
  if (aircraftLayer) aircraftLayer.clearLayers();
  if (routeLayer) routeLayer.clearLayers();
  lastRouteBounds = null;

  let aircraft = resolveSavedFlightAircraft(flight);
  if (!aircraft) {
    setRouteSummary(`${flight.name || flight.icao?.toUpperCase() || "Samolot"}: szukam aktualnej pozycji, bo zapis nie ma punktu mapy.`);
    try {
      const live = await fetchAircraftByHex(normalizeIcao(flight.icao), { preferCache: false, fallbackAllSources: false, timeoutMs: HEX_FETCH_TIMEOUT_MS, allowProxy: false });
      aircraft = live ? mergeFlightRouteIntoAircraft(live, flight) : null;
      if (aircraft) refreshSavedFlightSnapshot(flight, aircraft);
    } catch {
      aircraft = null;
    }
  }

  if (!aircraft) {
    setRouteSummary(`${flight.name || flight.icao?.toUpperCase() || "Samolot"}: brak aktualnej pozycji i brak zapisanego punktu mapy.`);
    showToast("Nie mam pozycji tego samolotu. Odśwież radar i spróbuj ponownie.", 3600);
    return;
  }

  selectedAircraft = aircraft;
  savedMapFocusActive = true;
  focusAircraftOnMap(aircraft, { singleMarker: true, showSheet: false, drawRoute: true, zoom: flight.zoom || zoomInput?.value });
  setRouteSummary(`${flight.name || flight.icao?.toUpperCase() || "Samolot"}: pokazuję punkt natychmiast. Pozycja live odświeża się w tle.`);
  refreshSavedFlightLiveInBackground(flight);
}

function readFormFlight() {
  const resolved = resolveSmartFlightInput(icaoInput.value);
  const lat = cleanCoordinate(resolved.lat || latInput.value, -90, 90, "Szerokość");
  const lon = cleanCoordinate(resolved.lon || lonInput.value, -180, 180, "Długość");

  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${resolved.icao}`,
    icao: resolved.icao,
    name: resolved.name || resolved.icao.toUpperCase(),
    date: dateInput.value || todayLocalDate(),
    zoom: zoomInput.value.trim() || "9.2",
    lat,
    lon,
    createdAt: new Date().toISOString()
  };
}

function upsertFlight(flight) {
  const flights = loadFlights();
  const withoutDuplicate = flights.filter((item) => !(item.icao === flight.icao && item.date === flight.date));
  withoutDuplicate.unshift(flight);
  saveFlights(withoutDuplicate);
  renderFlights();
}

function parseFlightText(text) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  let url = null;
  try {
    const match = trimmed.match(/https?:\/\/\S+/i);
    url = new URL(match ? match[0] : trimmed);
  } catch {
    url = null;
  }

  const urlIcao = url ? normalizeIcao(url.searchParams.get("icao") || "") : "";
  const plainIcao = normalizeIcao((trimmed.match(/\b[a-fA-F0-9]{6}\b/) || [""])[0]);
  const icao = isValidIcao(urlIcao) ? urlIcao : plainIcao;

  if (!isValidIcao(icao)) return null;

  return {
    icao,
    date: url?.searchParams.get("showTrace") || todayLocalDate(),
    lat: url?.searchParams.get("lat") || "",
    lon: url?.searchParams.get("lon") || "",
    zoom: url?.searchParams.get("zoom") || "9.2"
  };
}

function fillForm(parsed, options = {}) {
  if (shouldPreserveManualSearchInput(options)) return;

  const icao = normalizeIcao(parsed.icao || parsed.hex || "");
  const displayName = parsed.name || parsed.callsign || parsed.flight || (icao ? icao.toUpperCase() : "");
  const searchValue = options.searchValue !== undefined ? String(options.searchValue || "") : displayName;
  icaoInput.value = options.keepSearchInput === true ? String(icaoInput.value || "") : searchValue;
  icaoInput.dataset.resolvedIcao = icao;
  nameInput.value = displayName;
  dateInput.value = parsed.date || todayLocalDate();
  zoomInput.value = parsed.zoom || "9.2";
  latInput.value = parsed.lat || "";
  lonInput.value = parsed.lon || "";
}

function savedFlightSearchValues(flight) {
  return [
    flight?.name,
    flight?.icao,
    flight?.callsign,
    flight?.registration,
    flight?.type,
    flight?.date,
    flight?.routeShort,
    flight?.routeVerbose
  ].filter(Boolean).join(" ").toUpperCase();
}

function renderFlights() {
  const flights = loadFlights();
  const query = String(savedSearchInput?.value || "").trim().toUpperCase();
  const visibleFlights = query ? flights.filter((flight) => savedFlightSearchValues(flight).includes(query)) : flights;
  flightList.replaceChildren();
  emptyState.hidden = flights.length > 0;

  for (const flight of visibleFlights) {
    const node = template.content.firstElementChild.cloneNode(true);
    setAircraftPhoto(node.querySelector(".flight-thumb"), flight, { compact: true, forceRealPhoto: true });
    node.querySelector(".flight-name").textContent = flight.name || flight.icao.toUpperCase();
    const metaParts = [
      flight.icao ? flight.icao.toUpperCase() : "",
      flight.date,
      aircraftKind(flight),
      flight.routeShort,
      flight.altitude !== undefined && flight.altitude !== "" ? formatAltitude(flight.altitude) : "",
      flight.speed !== undefined && flight.speed !== "" ? formatSpeed(flight.speed) : ""
    ].filter(Boolean);
    node.querySelector(".flight-meta").textContent = metaParts.join(" • ");

    node.querySelector(".ads-flight").addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openFlightInAds(flight);
    });

    node.querySelector(".map-flight").addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      clearManualSearchInputLock();
      fillForm(flight, { force: true });
      await showSavedFlightOnMap(flight);
    });

    node.querySelector(".delete-flight").addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      await deleteSavedFlight(flight);
    });

    flightList.append(node);
  }
}

function importFromText() {
  const parsed = parseFlightText(importText.value);
  if (!parsed) {
    showToast("Nie znalazłem kodu ICAO.");
    return;
  }

  clearManualSearchInputLock();
  fillForm(parsed, { force: true });
  showToast("Dane wpisane do formularza.");
}

function saveFlightFromForm() {
  try {
    const flight = readFormFlight();
    upsertFlight(flight);
    form.reset();
    delete icaoInput.dataset.resolvedIcao;
    dateInput.value = todayLocalDate();
    zoomInput.value = "9.2";
    showToast("Samolot zapisany.");
  } catch (error) {
    showToast(error.message);
  }
}

async function searchAircraftFromInput() {
  const raw = icaoInput.value.trim();
  const originalValue = icaoInput.value;
  if (!raw) {
    showToast("Wpisz hex, callsign, rejestrację albo nazwę samolotu.");
    return;
  }

  markManualSearchInput(raw);

  const directIcao = explicitIcaoFromInput(raw);
  const localMatch = isValidIcao(directIcao) ? findAircraftByIcaoInCache(directIcao) : findAircraftByExactSearchQuery(raw);
  if (localMatch) {
    try {
      let aircraft = localMatch.icao && !localMatch.hex ? flightToAircraft(localMatch) : localMatch;
      const localIcao = aircraftIcao(aircraft);
      if (!pointFromAircraft(aircraft) && isValidIcao(localIcao)) {
        try {
          const live = await fetchAircraftByHex(localIcao, { preferCache: false, fallbackAllSources: true, timeoutMs: HEX_FETCH_TIMEOUT_MS, allowProxy: true });
          if (live) aircraft = mergeFlightRouteIntoAircraft(live, localMatch);
        } catch {
          // Jeśli live nie odpowie, pokazujemy dane lokalne bez zapisywania.
        }
      }
      if (!aircraftMatchesSearchInput(aircraft, raw)) throw new Error(`Znaleziony lokalnie samolot nie pasuje do wpisu: ${raw}.`);
      fillForm(aircraftToFlight(aircraft), { force: true, searchValue: raw });
      markManualSearchInput(raw);
      focusAircraftOnMap(aircraft, { singleMarker: !findAircraftByIcaoInCache(aircraftIcao(aircraft)), showSheet: true, centerMap: true, fitMap: false, zoom: 10 });
      showToast(pointFromAircraft(aircraft) ? "Znaleziono samolot i przeniesiono mapę do jego pozycji." : "Znaleziono samolot, ale brak pozycji GPS.", 3200);
    } catch (error) {
      icaoInput.value = originalValue;
      markManualSearchInput(originalValue);
      setAircraftStatus(`Nie znaleziono samolotu: ${raw}. ${explainFetchError(error)}.`);
      showToast(`Nie znaleziono samolotu: ${raw}`, 5200);
    }
    return;
  }

  const finishBusy = beginBusy("Szukam samolotu globalnie...");
  try {
    const aircraft = await fetchAircraftByLiveQuery(raw, { timeoutMs: HEX_FETCH_TIMEOUT_MS, allowProxy: true, fallbackAllSources: true });
    if (!aircraft) throw new Error("API nie zwróciło tego samolotu.");
    if (!aircraftMatchesSearchInput(aircraft, raw)) {
      throw new Error(`API zwróciło inny samolot niż wpisano: ${raw}.`);
    }

    const cleanIcao = aircraftIcao(aircraft);
    const point = pointFromAircraft(aircraft);
    fillForm(aircraftToFlight(aircraft), { force: true, searchValue: raw });
    markManualSearchInput(raw);

    if (point && map) {
      const requestedZoom = Number(zoomInput?.value || 10);
      map.setView([point.lat, point.lon], Number.isFinite(requestedZoom) ? Math.max(10, Math.min(13, requestedZoom)) : 10, { animate: false });
      invalidateMapSoon();
    }

    const finalAircraft = await refreshAreaAroundFoundAircraft(aircraft);
    const finalIcao = aircraftIcao(finalAircraft) || cleanIcao;
    fillForm(aircraftToFlight(finalAircraft), { force: true, searchValue: raw });
    markManualSearchInput(raw);
    focusAircraftOnMap(finalAircraft, { singleMarker: !findAircraftByIcaoInCache(finalIcao), showSheet: true, centerMap: false, fitMap: false, zoom: 10 });
    showToast("Znaleziono samolot, odświeżono jego obszar i pokazano dane.", 4200);
  } catch (error) {
    if (isValidIcao(directIcao)) {
      let aircraft = offlineAircraftRecordFromIcao(directIcao);
      try {
        aircraft = await fetchStaticAircraftByHex(directIcao) || aircraft;
      } catch {
        // Brak danych statycznych nie blokuje obserwowania po HEX.
      }
      selectedAircraft = aircraft;
      updateSelectedAircraftMarkerHighlight();
      showSelectedAircraftSheet(aircraft);
      fillForm(aircraftToFlight(aircraft), { force: true, searchValue: raw });
      markManualSearchInput(raw);
      setAircraftStatus(`${directIcao.toUpperCase()}: brak aktualnej pozycji LIVE w dostępnych źródłach, ale HEX jest poprawny i może zostać dodany do obserwowanych. Alert zadziała, gdy pojawi się w publicznym ADS.`);
      showToast(`${directIcao.toUpperCase()}: brak LIVE. Możesz dodać do obserwowanych.`, 5200);
      return;
    }
    icaoInput.value = originalValue;
    markManualSearchInput(originalValue);
    setAircraftStatus(`Nie znaleziono samolotu: ${raw}. ${explainFetchError(error)}.`);
    showToast(`Nie znaleziono samolotu: ${raw}`, 5200);
  } finally {
    finishBusy();
  }
}
