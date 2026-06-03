// ADS Viewer Pro - firestoreSync.js
// Wydzielone z app.js w wersji V59. Klasyczny skrypt, funkcje globalne.
function sanitizeFirestoreDocId(value) {
  return String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96) || `item-${Date.now()}`;
}

function getOrCreateFirestoreClientId() {
  const existing = storageGet(FIRESTORE_CLIENT_ID_STORAGE_KEY, "").trim();
  if (existing) return existing;
  const generated = `client-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  storageSet(FIRESTORE_CLIENT_ID_STORAGE_KEY, generated);
  return generated;
}

function loadDeletedFlights() {
  const raw = storageJsonGet(FIRESTORE_DELETED_FLIGHTS_STORAGE_KEY, {});
  return raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
}

function saveDeletedFlights(tombstones) {
  const now = Date.now();
  const maxAgeMs = 90 * 24 * 60 * 60 * 1000;
  const cleaned = {};
  for (const [id, value] of Object.entries(tombstones || {})) {
    const stamp = Number(value);
    if (Number.isFinite(stamp) && now - stamp <= maxAgeMs) cleaned[id] = stamp;
  }
  storageJsonSet(FIRESTORE_DELETED_FLIGHTS_STORAGE_KEY, cleaned);
}

function firestoreFlightDocId(flight) {
  if (typeof flight === "string") return sanitizeFirestoreDocId(flight);
  return sanitizeFirestoreDocId(flight?.id || `${normalizeIcao(flight?.icao || flight?.hex || "")}-${flight?.date || todayLocalDate()}`);
}

function isFlightDeletedByTombstone(flight) {
  const deleted = loadDeletedFlights();
  const id = firestoreFlightDocId(flight);
  const deletedAt = Number(deleted[id] || 0);
  return deletedAt > 0 && deletedAt >= flightTimestampMs(flight);
}

function markFlightDeletedLocally(flight) {
  const id = firestoreFlightDocId(flight);
  const deleted = loadDeletedFlights();
  deleted[id] = Date.now();
  saveDeletedFlights(deleted);
  return id;
}

function mergeRemoteTombstones(remoteTombstones) {
  const local = loadDeletedFlights();
  let changed = false;
  for (const [id, stamp] of Object.entries(remoteTombstones || {})) {
    const value = Number(stamp || 0);
    if (Number.isFinite(value) && value > Number(local[id] || 0)) {
      local[id] = value;
      changed = true;
    }
  }
  if (changed) saveDeletedFlights(local);
}

function loadFirestoreStateMeta() {
  const meta = storageJsonGet(FIRESTORE_STATE_META_STORAGE_KEY, {});
  return meta && typeof meta === "object" && !Array.isArray(meta) ? meta : {};
}

function saveFirestoreStateMeta(meta) {
  storageJsonSet(FIRESTORE_STATE_META_STORAGE_KEY, meta && typeof meta === "object" ? meta : {});
}

function firestoreSectionUpdatedAt(section) {
  const meta = loadFirestoreStateMeta();
  const value = Number(meta[section] || 0);
  return Number.isFinite(value) ? value : 0;
}

function ensureFirestoreStateMetaSeeded() {
  const meta = loadFirestoreStateMeta();
  let changed = false;
  const now = Date.now();
  for (const section of FIRESTORE_STATE_SECTIONS) {
    const current = Number(meta[section] || 0);
    if (!Number.isFinite(current) || current <= 0) {
      meta[section] = now;
      changed = true;
    }
  }
  if (changed) saveFirestoreStateMeta(meta);
}

function markFirestoreStateSectionDirty(section, stamp = Date.now()) {
  if (firestoreApplyingRemote) return;
  if (!FIRESTORE_STATE_SECTIONS.includes(section)) return;
  const meta = loadFirestoreStateMeta();
  meta[section] = Math.max(Number(meta[section] || 0), Number(stamp) || Date.now());
  saveFirestoreStateMeta(meta);
  scheduleFirestorePush();
}

function normalizeFirestoreSection(section, value) {
  if (section === "api") {
    const source = value && typeof value === "object" ? value : {};
    const dataSource = Object.prototype.hasOwnProperty.call(API_SOURCES, source.dataSource) ? source.dataSource : DEFAULT_DATA_SOURCE;
    return {
      dataSource,
      apiBase: String(source.apiBase || apiSourceByName(dataSource).apiBase || ""),
      apiKey: String(source.apiKey || "")
    };
  }
  if (section === "theme") return String(value || "light") === "dark" ? "dark" : "light";
  if (section === "filters") return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  if (section === "performance") return normalizePerformanceSettings(value && typeof value === "object" ? value : defaultPerformanceSettings());
  if (section === "watchlist") return Array.isArray(value) ? value : [];
  if (section === "alertSettings") return { ...defaultAlertSettings(), ...(value && typeof value === "object" ? value : {}) };
  if (section === "alertFired") return value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return value;
}

function localFirestoreSectionValue(section) {
  if (section === "api") {
    const dataSource = storageGet(DATA_SOURCE_STORAGE_KEY, DEFAULT_DATA_SOURCE);
    return normalizeFirestoreSection("api", {
      dataSource,
      apiBase: storageGet(API_BASE_STORAGE_KEY, apiSourceByName(dataSource).apiBase),
      apiKey: storageGet(API_KEY_STORAGE_KEY, "")
    });
  }
  if (section === "theme") return normalizeFirestoreSection("theme", storageGet(THEME_STORAGE_KEY, "light"));
  if (section === "filters") return normalizeFirestoreSection("filters", storageJsonGet(FILTER_STORAGE_KEY, {}));
  if (section === "performance") return normalizeFirestoreSection("performance", storageJsonGet(PERFORMANCE_STORAGE_KEY, defaultPerformanceSettings()));
  if (section === "watchlist") return normalizeFirestoreSection("watchlist", loadWatchlist());
  if (section === "alertSettings") return normalizeFirestoreSection("alertSettings", loadAlertSettingsObject());
  if (section === "alertFired") return normalizeFirestoreSection("alertFired", loadFiredAlertState());
  return null;
}

function buildLocalFirestoreState() {
  const config = loadFirestoreConfig();
  const sections = {};
  for (const section of FIRESTORE_STATE_SECTIONS) {
    sections[section] = {
      updatedAtMs: firestoreSectionUpdatedAt(section),
      value: localFirestoreSectionValue(section)
    };
  }
  return {
    id: FIRESTORE_STATE_DOC_ID,
    syncVersion: 2,
    syncKey: sanitizeSyncKey(config?.syncKey || ""),
    _clientId: firestoreClientId,
    _updatedAtMs: Date.now(),
    updatedAt: new Date().toISOString(),
    sections
  };
}

function encodeFirestoreAppStateForFlightDoc(state) {
  const config = loadFirestoreConfig();
  const now = Date.now();
  return {
    id: FIRESTORE_STATE_DOC_ID,
    syncKey: sanitizeSyncKey(config?.syncKey || ""),
    deleted: false,
    icao: "",
    hex: "",
    name: "ADS Viewer Pro — stan aplikacji",
    date: "app-state",
    routeShort: "app-state-v2",
    routeVerbose: JSON.stringify(state || buildLocalFirestoreState()),
    createdAt: new Date(now).toISOString(),
    updatedAt: new Date(now).toISOString(),
    _clientId: firestoreClientId,
    _updatedAtMs: now
  };
}

function decodeFirestoreAppStateFromFlightDoc(data) {
  if (!data || typeof data !== "object") return null;
  const encoded = String(data.routeVerbose || "");
  if (encoded) {
    try {
      const parsed = JSON.parse(encoded);
      if (parsed && typeof parsed === "object" && parsed.sections && typeof parsed.sections === "object") return parsed;
    } catch {
      // Jeżeli starszy zapis ma uszkodzony routeVerbose, zostaje awaryjny odczyt pola sections.
    }
  }
  if (data.sections && typeof data.sections === "object") return data;
  return null;
}

function remoteFirestoreStateSections(data) {
  const source = data && typeof data === "object" ? data.sections : null;
  return source && typeof source === "object" && !Array.isArray(source) ? source : {};
}

function protectedFirestoreRuntimeSections(options = {}) {
  if (options.protectRuntimeState === false) return new Set();
  return new Set(["api", "filters", "performance"]);
}

function restoreFirestoreLiveAircraftSnapshot(snapshot) {
  if (!snapshot || !Array.isArray(snapshot.aircraft) || !snapshot.aircraft.length) return;
  lastAircraftCache = snapshot.aircraft;
  if (snapshot.renderSettings) lastRenderSettings = snapshot.renderSettings;
  const settings = lastRenderSettings || snapshot.renderSettings || readBrowseSettingsSafe();
  const visibleAircraft = filterAircraftForDisplay(lastAircraftCache);
  renderAircraft(visibleAircraft, settings);
  renderAircraftMap(visibleAircraft, settings, { preserveView: true });
}

function applyRemoteSectionToLocal(section, value) {
  const normalized = normalizeFirestoreSection(section, value);
  if (section === "api") {
    storageSet(DATA_SOURCE_STORAGE_KEY, normalized.dataSource);
    storageSet(API_BASE_STORAGE_KEY, normalized.apiBase);
    storageSet(API_KEY_STORAGE_KEY, normalized.apiKey);
    if (dataSourceInput) dataSourceInput.value = normalized.dataSource;
    if (apiBaseInput) apiBaseInput.value = normalized.apiBase;
    if (apiKeyInput) apiKeyInput.value = normalized.apiKey;
    return;
  }
  if (section === "theme") {
    storageSet(THEME_STORAGE_KEY, normalized);
    applyTheme(normalized);
    return;
  }
  if (section === "filters") {
    storageJsonSet(FILTER_STORAGE_KEY, normalized);
    loadAircraftFilters();
    return;
  }
  if (section === "performance") {
    storageJsonSet(PERFORMANCE_STORAGE_KEY, normalized);
    loadPerformanceSettings();
    return;
  }
  if (section === "watchlist") {
    storageSet(WATCHLIST_STORAGE_KEY, JSON.stringify(normalized));
    renderWatchlist();
    updateAlertStatusText();
    return;
  }
  if (section === "alertSettings") {
    storageJsonSet(ALERT_SETTINGS_STORAGE_KEY, normalized);
    applyAlertSettingsToForm();
    return;
  }
  if (section === "alertFired") {
    storageJsonSet(ALERT_FIRED_STORAGE_KEY, normalized);
    updateAlertStatusText();
  }
}

function applyRemoteAppState(remoteData, options = {}) {
  const sections = remoteFirestoreStateSections(remoteData);
  const protectedSections = protectedFirestoreRuntimeSections(options);
  const meta = loadFirestoreStateMeta();
  const changedSections = new Set();
  let needsPush = false;

  firestoreApplyingRemote = true;
  try {
    for (const section of FIRESTORE_STATE_SECTIONS) {
      const remoteSection = sections[section];
      if (protectedSections.has(section)) {
        const remoteUpdatedAt = Number(remoteSection?.updatedAtMs || 0);
        const localUpdatedAt = Number(meta[section] || 0);
        if (Number.isFinite(localUpdatedAt) && Number.isFinite(remoteUpdatedAt) && localUpdatedAt > remoteUpdatedAt) {
          needsPush = true;
        }
        continue;
      }
      if (!remoteSection || typeof remoteSection !== "object") continue;
      const remoteUpdatedAt = Number(remoteSection.updatedAtMs || 0);
      const localUpdatedAt = Number(meta[section] || 0);
      if (!Number.isFinite(remoteUpdatedAt)) continue;
      if (remoteUpdatedAt > localUpdatedAt) {
        applyRemoteSectionToLocal(section, remoteSection.value);
        meta[section] = remoteUpdatedAt;
        changedSections.add(section);
      } else if (localUpdatedAt > remoteUpdatedAt) {
        needsPush = true;
      }
    }
    saveFirestoreStateMeta(meta);
  } finally {
    firestoreApplyingRemote = false;
  }

  if (changedSections.has("performance")) restartAircraftAutoRefresh();
  if (changedSections.has("filters") && lastAircraftCache.length) {
    const visibleAircraft = filterAircraftForDisplay(lastAircraftCache);
    renderAircraft(visibleAircraft, lastRenderSettings || readBrowseSettingsSafe());
    renderAircraftMap(visibleAircraft, lastRenderSettings || readBrowseSettingsSafe(), { preserveView: true });
  }
  return { changed: changedSections.size > 0, needsPush };
}

async function pullAppStateFromFirestore(options = {}) {
  if (!firestoreState.ready || !firestoreState.stateDocRef) return { changed: false, needsPush: false };
  const modules = await loadFirestoreModules();
  const { getDoc } = modules.firestore;
  const snapshot = await getDoc(firestoreState.stateDocRef);
  if (!snapshot.exists()) return { changed: false, needsPush: false };
  const state = decodeFirestoreAppStateFromFlightDoc(snapshot.data());
  if (!state) return { changed: false, needsPush: false };
  return applyRemoteAppState(state, options);
}

async function pushAppStateToFirestore() {
  if (!firestoreState.ready || !firestoreState.stateDocRef) return;
  const modules = await loadFirestoreModules();
  const { setDoc } = modules.firestore;
  ensureFirestoreStateMetaSeeded();
  const state = buildLocalFirestoreState();
  await setDoc(firestoreState.stateDocRef, encodeFirestoreAppStateForFlightDoc(state), { merge: true });
}

function firestoreStatusSummary(prefix = "Synchronizacja aktywna") {
  return `${prefix}. Zapisane: ${loadFlights().length}. Obserwowane: ${loadWatchlist().length}.`;
}

function defaultFirestoreConfigForForm() {
  if (typeof DEFAULT_FIRESTORE_CONFIG !== "object" || !DEFAULT_FIRESTORE_CONFIG) return null;
  return { ...DEFAULT_FIRESTORE_CONFIG, enabled: true };
}

function firestoreConfigFromForm() {
  const syncKey = sanitizeSyncKey(firestoreSyncKeyInput?.value || "");
  if (syncKey.length < 8) throw new Error("Kod synchronizacji musi mieć minimum 8 znaków.");
  const apiKey = firestoreApiKeyInput?.value.trim() || "";
  const authDomain = firestoreAuthDomainInput?.value.trim() || "";
  const projectId = firestoreProjectIdInput?.value.trim() || "";
  const appId = firestoreAppIdInput?.value.trim() || "";
  if (!apiKey || !authDomain || !projectId || !appId) {
    throw new Error("Uzupełnij apiKey, authDomain, projectId i appId z Firebase.");
  }
  return {
    enabled: true,
    apiKey,
    authDomain,
    projectId,
    storageBucket: firestoreStorageBucketInput?.value.trim() || "",
    messagingSenderId: firestoreMessagingSenderIdInput?.value.trim() || "",
    appId,
    syncKey
  };
}

function firebaseConfigForSdk(config) {
  const sdkConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    appId: config.appId
  };
  if (config.storageBucket) sdkConfig.storageBucket = config.storageBucket;
  if (config.messagingSenderId) sdkConfig.messagingSenderId = config.messagingSenderId;
  return sdkConfig;
}

function loadFirestoreConfig() {
  const config = storageJsonGet(FIRESTORE_CONFIG_STORAGE_KEY, null);
  return config && typeof config === "object" ? config : null;
}

function saveFirestoreConfig(config) {
  storageJsonSet(FIRESTORE_CONFIG_STORAGE_KEY, config);
  storageSet(FIRESTORE_SETUP_DISMISSED_KEY, "0");
}

function firestoreConfigComplete(config) {
  return Boolean(config?.enabled && config.apiKey && config.authDomain && config.projectId && config.appId && sanitizeSyncKey(config.syncKey).length >= 8);
}

function firestoreConfigSignature(config) {
  if (!config) return "";
  return JSON.stringify({ projectId: config.projectId, appId: config.appId, syncKey: sanitizeSyncKey(config.syncKey) });
}

function setFirestoreStatus(message, mode = "info") {
  const text = String(message || "").trim() || "Synchronizacja Firestore wyłączona.";
  if (firestoreSyncStatus) {
    firestoreSyncStatus.textContent = text;
    firestoreSyncStatus.dataset.mode = mode;
  }
  if (firestoreModalStatus) {
    firestoreModalStatus.textContent = text;
    firestoreModalStatus.dataset.mode = mode;
  }
}

function parseFirebaseConfigText(text) {
  const result = {};
  const source = String(text || "");
  for (const key of ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]) {
    const match = source.match(new RegExp(`${key}\\s*:\\s*["']([^"']+)["']`, "i"));
    if (match) result[key] = match[1].trim();
  }
  return result;
}

function applyParsedFirebaseConfigToForm(parsed) {
  if (!parsed || typeof parsed !== "object") return false;
  const map = {
    apiKey: firestoreApiKeyInput,
    authDomain: firestoreAuthDomainInput,
    projectId: firestoreProjectIdInput,
    storageBucket: firestoreStorageBucketInput,
    messagingSenderId: firestoreMessagingSenderIdInput,
    appId: firestoreAppIdInput
  };
  let filled = false;
  for (const [key, input] of Object.entries(map)) {
    if (input && parsed[key]) {
      input.value = parsed[key];
      filled = true;
    }
  }
  return filled;
}

function fillFirestoreForm(config = loadFirestoreConfig()) {
  const effectiveConfig = config && typeof config === "object" ? config : defaultFirestoreConfigForForm();
  if (firestoreApiKeyInput) firestoreApiKeyInput.value = effectiveConfig?.apiKey || "";
  if (firestoreAuthDomainInput) firestoreAuthDomainInput.value = effectiveConfig?.authDomain || "";
  if (firestoreProjectIdInput) firestoreProjectIdInput.value = effectiveConfig?.projectId || "";
  if (firestoreStorageBucketInput) firestoreStorageBucketInput.value = effectiveConfig?.storageBucket || "";
  if (firestoreMessagingSenderIdInput) firestoreMessagingSenderIdInput.value = effectiveConfig?.messagingSenderId || "";
  if (firestoreAppIdInput) firestoreAppIdInput.value = effectiveConfig?.appId || "";
  if (firestoreSyncKeyInput) firestoreSyncKeyInput.value = effectiveConfig?.syncKey || generateSyncKey();
  if (firestoreConfigPaste) firestoreConfigPaste.value = "";
}

function setFirestoreSetupMode(isFirstRun = false) {
  const quickMode = Boolean(isFirstRun && !firestoreConfigComplete(loadFirestoreConfig()) && defaultFirestoreConfigForForm());
  firestoreSetupModal?.classList.toggle("firestore-quick-setup", quickMode);

  const title = document.querySelector("#firestoreSetupTitle");
  const description = title?.nextElementSibling;
  if (quickMode) {
    if (title) title.textContent = "Hasło synchronizacji";
    if (description) description.textContent = "Dane Firebase są wpisane automatycznie. Sprawdź hasło i kliknij „Zapisz i synchronizuj”.";
  } else {
    if (title) title.textContent = "Konfiguracja Firestore";
    if (description) description.textContent = "Wklej konfigurację Firebase i ustaw prywatny kod synchronizacji. Ten sam kod wpisz na telefonie i komputerze.";
  }
  return quickMode;
}

function openFirestoreSetupModal(isFirstRun = false) {
  if (!firestoreSetupModal) return;
  fillFirestoreForm();
  const quickMode = setFirestoreSetupMode(isFirstRun);
  firestoreSetupModal.hidden = false;
  document.body.classList.add("modal-open");
  setFirestoreStatus(quickMode ? "Dane Firebase są już wpisane. Zapisz konfigurację, aby włączyć synchronizację." : "Edytujesz konfigurację Firestore.");
  window.setTimeout(() => (quickMode ? firestoreSyncKeyInput : firestoreConfigPaste)?.focus(), 50);
}

function closeFirestoreSetupModal() {
  if (!firestoreSetupModal) return;
  firestoreSetupModal.hidden = true;
  document.body.classList.remove("modal-open");
}

async function loadFirestoreModules() {
  if (!firestoreModulesPromise) {
    firestoreModulesPromise = Promise.all([
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-firestore.js`)
    ]).then(([app, firestore]) => ({ app, firestore }));
  }
  return firestoreModulesPromise;
}

async function resetFirestoreConnection() {
  if (firestoreState.unsubscribe) {
    firestoreState.unsubscribe();
  }
  if (firestoreState.unsubscribeState) {
    firestoreState.unsubscribeState();
  }
  firestoreState.unsubscribe = null;
  firestoreState.unsubscribeState = null;
  firestoreState.collectionRef = null;
  firestoreState.stateDocRef = null;
  firestoreState.db = null;
  firestoreState.ready = false;
}

function remoteDocToFlight(docSnapshot) {
  const data = docSnapshot.data ? docSnapshot.data() : docSnapshot;
  if (!data || typeof data !== "object" || data.deleted) return null;
  return normalizeFlightForStorage({ ...data, id: data.id || docSnapshot.id });
}

function remoteDocsToFlightsAndTombstones(snapshot) {
  const flights = [];
  const tombstones = {};
  snapshot.forEach((docSnapshot) => {
    const data = docSnapshot.data();
    if (docSnapshot.id === FIRESTORE_STATE_DOC_ID || data?.id === FIRESTORE_STATE_DOC_ID) return;
    if (!data || typeof data !== "object") return;
    if (data.deleted) {
      tombstones[docSnapshot.id] = Number(data.deletedAt || data._updatedAtMs || Date.now());
      return;
    }
    const flight = remoteDocToFlight(docSnapshot);
    if (flight) flights.push(flight);
  });
  return { flights, tombstones };
}

function mergeFlightCollections(localFlights, remoteFlights) {
  const merged = new Map();
  for (const item of [...(localFlights || []), ...(remoteFlights || [])]) {
    const flight = normalizeFlightForStorage(item);
    if (isFlightDeletedByTombstone(flight)) continue;
    const key = flightMergeKey(flight);
    const existing = merged.get(key);
    if (!existing || flightTimestampMs(flight) >= flightTimestampMs(existing)) {
      merged.set(key, flight);
    }
  }
  return Array.from(merged.values()).sort((a, b) => flightTimestampMs(b) - flightTimestampMs(a));
}

function applyRemoteFlights(remoteFlights, remoteTombstones = {}) {
  firestoreApplyingRemote = true;
  try {
    mergeRemoteTombstones(remoteTombstones);
    const merged = mergeFlightCollections(loadFlights(), remoteFlights);
    saveFlights(merged, { skipSync: true });
    renderFlights();
    return merged;
  } finally {
    firestoreApplyingRemote = false;
  }
}

async function pushFlightsToFirestore(flights) {
  if (!firestoreState.ready || !firestoreState.collectionRef) return;
  const modules = await loadFirestoreModules();
  const { doc, setDoc } = modules.firestore;
  const config = loadFirestoreConfig();
  const syncKey = sanitizeSyncKey(config?.syncKey || "");
  const active = normalizeFlightsForStorage(flights).filter((flight) => !isFlightDeletedByTombstone(flight));
  const chunkSize = 8;
  for (let index = 0; index < active.length; index += chunkSize) {
    const chunk = active.slice(index, index + chunkSize);
    await Promise.all(chunk.map((flight) => {
      const id = firestoreFlightDocId(flight);
      const payload = {
        ...flight,
        id,
        syncKey,
        deleted: false,
        _clientId: firestoreClientId,
        _updatedAtMs: Date.now()
      };
      return setDoc(doc(firestoreState.collectionRef, id), payload, { merge: true });
    }));
    await new Promise((resolve) => (document.hidden ? window.setTimeout(resolve, 0) : window.requestAnimationFrame(resolve)));
  }
}

async function pushDeletedFlightToFirestore(flightOrId) {
  if (!firestoreState.ready || !firestoreState.collectionRef) return;
  const modules = await loadFirestoreModules();
  const { doc, setDoc } = modules.firestore;
  const config = loadFirestoreConfig();
  const syncKey = sanitizeSyncKey(config?.syncKey || "");
  const id = firestoreFlightDocId(flightOrId);
  const deletedAt = Number(loadDeletedFlights()[id] || Date.now());
  await setDoc(doc(firestoreState.collectionRef, id), {
    id,
    syncKey,
    deleted: true,
    deletedAt,
    updatedAt: new Date(deletedAt).toISOString(),
    _clientId: firestoreClientId,
    _updatedAtMs: deletedAt
  }, { merge: true });
}

async function pushLocalTombstonesToFirestore() {
  const deleted = loadDeletedFlights();
  for (const id of Object.keys(deleted)) {
    await pushDeletedFlightToFirestore(id);
  }
}

function scheduleFirestorePush() {
  if (firestoreApplyingRemote || firestorePushInProgress) return;
  if (!firestoreState.ready) return;
  window.clearTimeout(firestorePushTimer);
  firestorePushTimer = window.setTimeout(() => {
    syncFirestoreNow({ silent: true }).catch((error) => {
      setFirestoreStatus(`Błąd synchronizacji: ${error.message || error}`, "error");
    });
  }, 700);
}

async function syncFirestoreNow(options = {}) {
  const config = loadFirestoreConfig();
  if (!firestoreConfigComplete(config)) {
    if (!options.silent) openFirestoreSetupModal(true);
    return false;
  }
  if (!firestoreState.ready) {
    return await initFirestoreSync({ silent: options.silent, protectRuntimeState: true });
  }
  if (firestorePushInProgress) return true;
  firestorePushInProgress = true;
  try {
    if (!options.silent) setFirestoreStatus("Synchronizuję dane programu...", "busy");
    await pushFlightsToFirestore(loadFlights());
    await pushLocalTombstonesToFirestore();
    await pushAppStateToFirestore();
    setFirestoreStatus(firestoreStatusSummary(), "ok");
    if (!options.silent) showToast(firestoreStatusSummary("Synchronizacja zakończona"), 4200);
    return true;
  } finally {
    firestorePushInProgress = false;
  }
}

async function initFirestoreSync(options = {}) {
  const config = loadFirestoreConfig();
  if (!firestoreConfigComplete(config)) {
    setFirestoreStatus("Synchronizacja Firestore nie jest skonfigurowana.", "info");
    if (!options.silent) openFirestoreSetupModal(true);
    return false;
  }
  const signature = firestoreConfigSignature(config);
  if (firestoreState.ready && firestoreState.configSignature === signature) return true;
  if (firestoreState.initializing) return false;

  const liveSnapshot = {
    aircraft: Array.isArray(lastAircraftCache) ? lastAircraftCache.slice() : [],
    renderSettings: lastRenderSettings || null
  };

  firestoreState.initializing = true;
  try {
    setFirestoreStatus("Łączę z Firestore...", "busy");
    await resetFirestoreConnection();
    const modules = await loadFirestoreModules();
    const { initializeApp, getApps } = modules.app;
    const { getFirestore, collection, doc, getDocs, onSnapshot } = modules.firestore;
    const appName = `ads-viewer-${sanitizeFirestoreDocId(config.projectId)}-${sanitizeFirestoreDocId(config.syncKey)}`;
    const existing = getApps().find((item) => item.name === appName);
    const app = existing || initializeApp(firebaseConfigForSdk(config), appName);
    const db = getFirestore(app);
    const collectionRef = collection(db, FIRESTORE_COLLECTION_ROOT, sanitizeSyncKey(config.syncKey), "flights");
    const stateDocRef = doc(collectionRef, FIRESTORE_STATE_DOC_ID);
    firestoreState = {
      ...firestoreState,
      app,
      db,
      collectionRef,
      stateDocRef,
      ready: true,
      configSignature: signature
    };

    const snapshot = await getDocs(collectionRef);
    const { flights: remoteFlights, tombstones } = remoteDocsToFlightsAndTombstones(snapshot);
    const merged = applyRemoteFlights(remoteFlights, tombstones);
    await pushFlightsToFirestore(merged);
    await pushLocalTombstonesToFirestore();
    const stateResult = await pullAppStateFromFirestore({ protectRuntimeState: options.protectRuntimeState !== false });
    await pushAppStateToFirestore();
    if (stateResult.needsPush) scheduleFirestorePush();

    firestoreState.unsubscribe = onSnapshot(collectionRef, (liveSnapshot) => {
      const { flights, tombstones: liveTombstones } = remoteDocsToFlightsAndTombstones(liveSnapshot);
      applyRemoteFlights(flights, liveTombstones);
      setFirestoreStatus(firestoreStatusSummary(), "ok");
    }, (error) => {
      setFirestoreStatus(`Błąd Firestore: ${error.message || error}`, "error");
    });

    firestoreState.unsubscribeState = onSnapshot(stateDocRef, (stateSnapshot) => {
      if (!stateSnapshot.exists()) return;
      const state = decodeFirestoreAppStateFromFlightDoc(stateSnapshot.data());
      if (!state) return;
      const result = applyRemoteAppState(state, { protectRuntimeState: true });
      if (result.needsPush) scheduleFirestorePush();
      if (result.changed) setFirestoreStatus(firestoreStatusSummary(), "ok");
    }, (error) => {
      setFirestoreStatus(`Błąd synchronizacji ustawień: ${error.message || error}`, "error");
    });


    restoreFirestoreLiveAircraftSnapshot(liveSnapshot);
    setFirestoreStatus(firestoreStatusSummary(options.silent ? "Synchronizacja aktywna" : "Połączono z Firestore"), "ok");
    if (!options.silent) showToast("Połączono z Firestore. Synchronizacja aktywna.", 4200);
    return true;
  } catch (error) {
    firestoreState.ready = false;
    setFirestoreStatus(`Nie udało się połączyć z Firestore: ${error.message || error}`, "error");
    if (!options.silent) showToast("Nie udało się połączyć z Firestore.", 4200);
    return false;
  } finally {
    firestoreState.initializing = false;
  }
}

function startFirestoreStartupFlow() {
  const config = loadFirestoreConfig();
  if (firestoreConfigComplete(config)) {
    initFirestoreSync({ silent: true });
    return;
  }
  setFirestoreStatus("Synchronizacja Firestore nie jest skonfigurowana.", "info");
  if (storageGet(FIRESTORE_SETUP_DISMISSED_KEY, "") !== "1") {
    window.setTimeout(() => openFirestoreSetupModal(true), 900);
  }
}
