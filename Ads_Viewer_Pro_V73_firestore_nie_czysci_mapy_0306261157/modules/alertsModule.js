// ADS Viewer Pro - alertsModule.js
// Wydzielone z app.js w wersji V59. Klasyczny skrypt, funkcje globalne.
function loadAlertLog() {
  try {
    const parsed = JSON.parse(storageGet(ALERT_LOG_STORAGE_KEY, "[]"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAlertLog(items) {
  storageSet(ALERT_LOG_STORAGE_KEY, JSON.stringify(items.slice(0, ALERT_LOG_MAX_ENTRIES)));
}

function loadFiredAlertState() {
  const parsed = storageJsonGet(ALERT_FIRED_STORAGE_KEY, {});
  return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
}

function saveFiredAlertState(state, options = {}) {
  storageJsonSet(ALERT_FIRED_STORAGE_KEY, state && typeof state === "object" ? state : {});
  if (!options.skipSync) markFirestoreStateSectionDirty("alertFired");
}

function hasFiredAlertForIcao(icao) {
  const cleanIcao = normalizeIcao(icao || "");
  if (!isValidIcao(cleanIcao)) return false;
  return Boolean(loadFiredAlertState()[cleanIcao]);
}

function markFiredAlertForIcao(icao) {
  const cleanIcao = normalizeIcao(icao || "");
  if (!isValidIcao(cleanIcao)) return;
  const state = loadFiredAlertState();
  state[cleanIcao] = new Date().toISOString();
  saveFiredAlertState(state);
}

function clearFiredAlertForIcao(icao) {
  const cleanIcao = normalizeIcao(icao || "");
  if (!isValidIcao(cleanIcao)) return;
  const state = loadFiredAlertState();
  if (Object.prototype.hasOwnProperty.call(state, cleanIcao)) {
    delete state[cleanIcao];
    saveFiredAlertState(state);
  }
}

function pruneFiredAlertStateToWatchlist(watchedIcaos) {
  const allowed = watchedIcaos instanceof Set ? watchedIcaos : new Set();
  const state = loadFiredAlertState();
  let changed = false;
  for (const key of Object.keys(state)) {
    if (!allowed.has(normalizeIcao(key))) {
      delete state[key];
      changed = true;
    }
  }
  if (changed) saveFiredAlertState(state);
}

function defaultAlertSettings() {
  return {
    enabled: false,
    query: "",
    distanceKm: "",
    maxAltitudeFt: "",
    watched: true,
    special: false,
    system: false
  };
}

function loadAlertSettingsObject() {
  const saved = storageJsonGet(ALERT_SETTINGS_STORAGE_KEY, defaultAlertSettings());
  return { ...defaultAlertSettings(), ...(saved && typeof saved === "object" ? saved : {}) };
}

function saveAlertSettingsObject(settings, options = {}) {
  storageJsonSet(ALERT_SETTINGS_STORAGE_KEY, { ...defaultAlertSettings(), ...(settings || {}) });
  if (!options.skipSync) markFirestoreStateSectionDirty("alertSettings");
}

function ensureWatchlistAlertsEnabled() {
  const settings = loadAlertSettingsObject();
  if (settings.enabled === true && settings.watched === true) return;
  const next = { ...settings, enabled: true, watched: true };
  saveAlertSettingsObject(next);
  if (alertsEnabledInput) alertsEnabledInput.checked = true;
  if (alertWatchedInput) {
    alertWatchedInput.checked = true;
    alertWatchedInput.disabled = true;
  }
  updateAlertStatusText("Alerty włączone dla listy obserwowanych.");
}

function timeStampText() {
  return new Date().toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function readAlertSettingsFromForm() {
  return {
    enabled: alertsEnabledInput?.checked === true,
    query: alertQueryInput?.value?.trim?.() || "",
    distanceKm: alertDistanceKmInput?.value?.trim?.() || "",
    maxAltitudeFt: alertMaxAltitudeInput?.value?.trim?.() || "",
    watched: true,
    special: alertSpecialInput?.checked === true,
    system: alertSystemInput?.checked === true
  };
}

function applyAlertSettingsToForm() {
  const settings = loadAlertSettingsObject();
  if (alertsEnabledInput) alertsEnabledInput.checked = settings.enabled === true;
  if (alertQueryInput) alertQueryInput.value = settings.query || "";
  if (alertDistanceKmInput) alertDistanceKmInput.value = settings.distanceKm || "";
  if (alertMaxAltitudeInput) alertMaxAltitudeInput.value = settings.maxAltitudeFt || "";
  if (alertWatchedInput) {
    alertWatchedInput.checked = true;
    alertWatchedInput.disabled = true;
  }
  if (alertSpecialInput) alertSpecialInput.checked = settings.special === true;
  if (alertSystemInput) alertSystemInput.checked = settings.system === true;
  updateAlertStatusText();
}

function saveAlertSettingsFromForm() {
  const settings = readAlertSettingsFromForm();
  saveAlertSettingsObject(settings);
  updateAlertStatusText();
  showToast("Alerty zapisane.");
}

function updateAlertStatusText(message = "") {
  if (!alertStatus) return;
  const settings = loadAlertSettingsObject();
  const watchedCount = loadWatchlist().length;
  const firedCount = Object.keys(loadFiredAlertState()).length;
  const activeParts = [`obserwowane: ${watchedCount}`, `wysłane jednorazowo: ${firedCount}`];
  if (settings.query) activeParts.push(`filtr: ${settings.query}`);
  if (settings.special) activeParts.push("tylko wojskowe/specjalne z obserwowanych");
  if (settings.distanceKm) activeParts.push(`do ${settings.distanceKm} km`);
  if (settings.maxAltitudeFt) activeParts.push(`poniżej ${settings.maxAltitudeFt} ft`);
  const prefix = settings.enabled ? "Alerty włączone" : "Alerty wyłączone";
  alertStatus.textContent = message || `${prefix}: ${activeParts.join(", ")}.`;
}

function renderAlertLog() {
  if (!alertLogList) return;
  const log = loadAlertLog();
  alertLogList.replaceChildren();
  if (!log.length) {
    const empty = document.createElement("li");
    empty.className = "alert-log-item muted";
    empty.textContent = "Brak alertów w tej sesji.";
    alertLogList.append(empty);
    return;
  }
  const fragment = document.createDocumentFragment();
  for (const entry of log.slice(0, ALERT_LOG_MAX_ENTRIES)) {
    const item = document.createElement("li");
    item.className = "alert-log-item";
    const time = entry.at ? new Date(entry.at).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";
    item.innerHTML = `<strong>${escapeHtml(time)}</strong><span>${escapeHtml(entry.message || "Alert")}</span>`;
    fragment.append(item);
  }
  alertLogList.append(fragment);
}

function pushAlertLog(message) {
  const log = loadAlertLog();
  log.unshift({ id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`, at: new Date().toISOString(), message });
  saveAlertLog(log);
  renderAlertLog();
}

function numericSetting(value) {
  const clean = String(value ?? "").trim();
  if (!clean) return null;
  const number = Number(clean.replace(",", "."));
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function alertBasePoint() {
  const lat = Number.parseFloat(firstFilled(browseLatInput?.value, latInput?.value).replace(",", "."));
  const lon = Number.parseFloat(firstFilled(browseLonInput?.value, lonInput?.value).replace(",", "."));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lon };
}

function distanceKmBetween(a, b) {
  const earthKm = 6371;
  const toRad = (value) => Number(value) * Math.PI / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * earthKm * Math.asin(Math.min(1, Math.sqrt(h)));
}

function aircraftMatchesAlertQuery(aircraft, query) {
  const cleanQuery = normalizeSearchText(query);
  if (!cleanQuery) return false;
  return aircraftSearchValues(aircraft).some((value) => value === cleanQuery || value.includes(cleanQuery) || cleanQuery.includes(value));
}

async function ensureNotificationPermission() {
  if (!("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return Notification.requestPermission();
}

async function showSystemAlertNotification(message) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const options = {
    body: message,
    icon: NOTIFICATION_ICON,
    badge: NOTIFICATION_ICON,
    tag: `ads-viewer-alert-${String(message).slice(0, 80)}`,
    renotify: true,
    requireInteraction: false,
    data: { url: location.href },
    vibrate: [180, 80, 180]
  };

  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      if (registration?.showNotification) {
        await registration.showNotification("ADS Viewer Pro", options);
        return;
      }
    } catch {
      // Jeżeli service worker nie jest gotowy, użyj zwykłego Notification.
    }
  }

  new Notification("ADS Viewer Pro", options);
}

function notifyAlertUser(message, settings) {
  showToast(message, 6500);
  if (settings.system) {
    showSystemAlertNotification(message).catch(() => {
      // Powiadomienie systemowe jest dodatkiem. Toast nadal działa.
    });
  }
}

function canTriggerAlert(key, force = false) {
  if (force) return true;
  const now = Date.now();
  const previous = alertCooldownMap.get(key) || 0;
  if (now - previous < ALERT_COOLDOWN_MS) return false;
  alertCooldownMap.set(key, now);
  return true;
}

function mergeUniqueAircraftByIcao(baseAircraft, extraAircraft) {
  const mapByIcao = new Map();
  for (const item of [...(baseAircraft || []), ...(extraAircraft || [])]) {
    const icao = aircraftIcao(item);
    if (!isValidIcao(icao)) continue;
    const previous = mapByIcao.get(icao);
    mapByIcao.set(icao, previous ? mergeFlightRouteIntoAircraft(item, previous) : item);
  }
  return [...mapByIcao.values()];
}

function selectWatchedItemsForGlobalProbe(currentAircraft = [], options = {}) {
  const watched = loadWatchlist().filter((item) => isValidIcao(normalizeIcao(item.icao || item.hex || "")));
  if (!watched.length) return [];

  const liveIcaos = new Set((currentAircraft || []).map(aircraftIcao).filter(isValidIcao));
  const now = Date.now();
  const rotated = watched.map((item, index) => watched[(watchlistGlobalProbeCursor + index) % watched.length]);
  const selected = [];

  for (const item of rotated) {
    const icao = normalizeIcao(item.icao || item.hex || "");
    if (!isValidIcao(icao) || liveIcaos.has(icao)) continue;
    const last = watchlistProbeLastCheckedAt.get(icao) || Number(item.lastProbeAt || 0) || 0;
    if (!options.immediate && now - last < WATCHLIST_GLOBAL_CHECK_INTERVAL_MS) continue;
    selected.push(item);
    if (selected.length >= WATCHLIST_GLOBAL_CHECK_LIMIT) break;
  }

  if (watched.length) watchlistGlobalProbeCursor = (watchlistGlobalProbeCursor + Math.max(1, selected.length)) % watched.length;
  return selected;
}

function markWatchedProbeChecked(icaos) {
  const cleanSet = new Set((icaos || []).map(normalizeIcao).filter(isValidIcao));
  if (!cleanSet.size) return;
  const checkedAt = new Date().toISOString();
  const items = loadWatchlist();
  let changed = false;
  const next = items.map((item) => {
    const icao = normalizeIcao(item.icao || item.hex || "");
    if (!cleanSet.has(icao)) return item;
    changed = true;
    return { ...item, lastProbeAt: Date.now(), lastCheckedAt: checkedAt };
  });
  if (changed) saveWatchlist(next, { skipSync: true });
}

async function checkWatchedAircraftGlobalInBackground(currentAircraft = [], options = {}) {
  if (watchlistGlobalProbeInProgress || document.hidden) return;
  const settings = loadAlertSettingsObject();
  const watched = loadWatchlist();
  if (!watched.length) return;

  // Globalne odpytywanie HEX ma sens głównie dla alertów.
  // Przy wyłączonych alertach robimy tylko aktualizację UI z bieżącej mapy, bez dodatkowego obciążania API.
  if (!settings.enabled && !options.immediate) return;

  const selected = selectWatchedItemsForGlobalProbe(currentAircraft, options);
  if (!selected.length) return;

  watchlistGlobalProbeInProgress = true;
  const requestedIcaos = selected.map((item) => normalizeIcao(item.icao || item.hex || "")).filter(isValidIcao);
  for (const icao of requestedIcaos) watchlistProbeLastCheckedAt.set(icao, Date.now());

  try {
    const probes = requestedIcaos.map(async (icao) => {
      try {
        return await fetchAircraftByHex(icao, {
          preferCache: false,
          fallbackAllSources: true,
          timeoutMs: HEX_FETCH_TIMEOUT_MS,
          allowProxy: true
        });
      } catch {
        return null;
      }
    });

    const found = (await Promise.all(probes)).filter(Boolean);
    markWatchedProbeChecked(requestedIcaos);
    if (!found.length) {
      renderWatchlist();
      updateAlertStatusText();
      return;
    }

    applyCachedRoutesToAircraft(found);
    const combined = mergeUniqueAircraftByIcao(lastAircraftCache, found);
    lastAircraftCache = combined;
    const visibleAircraft = filterAircraftForDisplay(combined);
    const renderSettings = lastRenderSettings || { apiBase: API_SOURCES[DEFAULT_DATA_SOURCE].apiBase, sourceName: DEFAULT_DATA_SOURCE, apiKey: "" };
    renderAircraft(visibleAircraft, renderSettings);
    renderAircraftMap(visibleAircraft, renderSettings, { preserveView: true });
    updateWatchlistFromAircraft(found);
    recordAircraftHistory(found);
    checkAircraftAlerts(found);
    enrichAircraftRoutesInBackground(found, lastRenderSettings || {}, "obserwowane HEX");
    setAircraftStatus(`Obserwowane HEX: znaleziono LIVE ${found.map((item) => aircraftIcao(item).toUpperCase()).join(", ")}.`);
  } finally {
    watchlistGlobalProbeInProgress = false;
  }
}

function checkAircraftAlerts(aircraftArray, options = {}) {
  const settings = loadAlertSettingsObject();
  if (!settings.enabled && !options.force) {
    updateAlertStatusText();
    return;
  }

  const watchedIcaos = new Set(loadWatchlist().map((item) => normalizeIcao(item.icao || "")).filter(isValidIcao));
  pruneFiredAlertStateToWatchlist(watchedIcaos);
  if (!watchedIcaos.size) {
    if (options.toastIfEmpty) showToast("Lista obserwowanych jest pusta. Alerty działają tylko dla obserwowanych samolotów.", 3800);
    updateAlertStatusText("Alerty: brak samolotów na liście obserwowanych.");
    return;
  }

  const source = Array.isArray(aircraftArray) ? aircraftArray : [];
  if (!source.length) {
    if (options.toastIfEmpty) showToast("Brak samolotów do sprawdzenia alertów.", 3000);
    return;
  }

  const maxDistanceKm = numericSetting(settings.distanceKm);
  const maxAltitudeFt = numericSetting(settings.maxAltitudeFt);
  const basePoint = maxDistanceKm !== null ? alertBasePoint() : null;
  const triggered = [];

  for (const aircraft of source) {
    if (triggered.length >= 4) break;
    const icao = aircraftIcao(aircraft);
    if (!isValidIcao(icao)) continue;

    // Główna zasada: alerty wolno wywoływać tylko dla samolotów dodanych do listy obserwowanych.
    if (!watchedIcaos.has(icao)) continue;

    // Druga zasada: dla jednego obserwowanego samolotu wysyłamy tylko jeden alert.
    // Ponowny alert będzie możliwy dopiero po usunięciu i ponownym dodaniu samolotu do obserwowanych.
    if (!options.force && hasFiredAlertForIcao(icao)) continue;

    if (settings.query && !aircraftMatchesAlertQuery(aircraft, settings.query)) continue;

    const reasons = ["obserwowany"];

    if (settings.special) {
      if (aircraftTypeGroup(aircraft) !== "special") continue;
      reasons.push("wojskowy/specjalny");
    }

    const altitude = aircraftAltitudeFeet(aircraft);
    if (maxAltitudeFt !== null) {
      if (altitude === null || altitude > maxAltitudeFt) continue;
      reasons.push(`niski przelot ${formatAltitude(altitude)}`);
    }

    const point = pointFromAircraft(aircraft);
    if (maxDistanceKm !== null) {
      if (!basePoint || !point) continue;
      const distance = distanceKmBetween(basePoint, point);
      if (distance > maxDistanceKm) continue;
      reasons.push(`blisko: ${distance.toFixed(1)} km`);
    }

    const key = icao;
    if (!canTriggerAlert(key, options.force)) continue;
    const message = `${aircraftLabel(aircraft)} — ${reasons.join(", ")}`;
    triggered.push({ icao, message });
  }

  if (!triggered.length) {
    if (options.toastIfEmpty) showToast("Brak obserwowanych samolotów w aktualnych danych.", 3200);
    updateAlertStatusText();
    return;
  }

  for (const alert of triggered) {
    if (!options.force) markFiredAlertForIcao(alert.icao);
    pushAlertLog(alert.message);
    notifyAlertUser(`Alert: ${alert.message}`, settings);
  }
  updateAlertStatusText(`Ostatni alert: ${triggered[0].message}`);
}
