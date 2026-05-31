const APP_VERSION_NUMBER = "V26";
const APP_VERSION_STAMP = "3105260915";
const APP_VERSION = `${APP_VERSION_NUMBER} - ${APP_VERSION_STAMP}`;
const APP_BUILD_STORAGE_KEY = "adsb-app-build-v1";
const PWA_INSTALLED_STORAGE_KEY = "adsb-pwa-installed-v1";
const PWA_BROWSER_CHOICE_STORAGE_KEY = "adsb-pwa-browser-choice-v1";
const FETCH_TIMEOUT_MS = 9000;
const RADIUS_FETCH_TIMEOUT_MS = 5200;
const HEX_FETCH_TIMEOUT_MS = 4200;
const AUTO_REFRESH_INTERVAL_MS = 8000;
const STORAGE_KEY = "adsb-saved-flights-v1";
const API_KEY_STORAGE_KEY = "adsb-api-key-v1";
const API_BASE_STORAGE_KEY = "adsb-api-base-v1";
const DATA_SOURCE_STORAGE_KEY = "adsb-data-source-v1";
const THEME_STORAGE_KEY = "adsb-theme-v1";
const FILTER_STORAGE_KEY = "adsb-aircraft-filters-v1";
const PERFORMANCE_STORAGE_KEY = "adsb-performance-settings-v1";
const WATCHLIST_STORAGE_KEY = "adsb-watchlist-v1";
const ALERT_SETTINGS_STORAGE_KEY = "adsb-alert-settings-v1";
const ALERT_LOG_STORAGE_KEY = "adsb-alert-log-v1";
const ALERT_FIRED_STORAGE_KEY = "adsb-alert-fired-v1";
const HISTORY_STORAGE_KEY = "adsb-flight-history-v1";
const FIRESTORE_CONFIG_STORAGE_KEY = "adsb-firestore-config-v1";
const FIRESTORE_SETUP_DISMISSED_KEY = "adsb-firestore-setup-dismissed-v1";
const FIRESTORE_DELETED_FLIGHTS_STORAGE_KEY = "adsb-firestore-deleted-flights-v1";
const FIRESTORE_CLIENT_ID_STORAGE_KEY = "adsb-firestore-client-id-v1";
const FIRESTORE_STATE_META_STORAGE_KEY = "adsb-firestore-state-meta-v1";
const FIRESTORE_STATE_DOC_ID = "__app_state";
const FIRESTORE_STATE_SECTIONS = ["api", "theme", "filters", "performance", "watchlist", "alertSettings", "alertFired"];
const FIREBASE_SDK_VERSION = "10.12.5";
const NOTIFICATION_ICON = "icon-192.png";
const FIRESTORE_COLLECTION_ROOT = "adsViewerSync";
const TRACK_STORAGE_KEY = "adsb-live-tracks-v1";
const ROUTE_CACHE_STORAGE_KEY = "adsb-route-cache-v1";
const PHOTO_CACHE_STORAGE_KEY = "adsb-photo-cache-v1";
const ADSB_BASE_URL = "https://adsb.lol/";
// WAŻNE: przycisk ADS jest obowiązkowy w panelach, w których występuje. Nie usuwać i nie zastępować inną akcją.
const ROUTE_API_URLS = [
  "https://api.adsb.lol/api/0/routeset",
  "https://adsb.im/api/0/routeset"
];
const ADSBDB_CALLSIGN_API_BASE_URL = "https://api.adsbdb.com/v0/callsign/";
const PLANESPOTTERS_PHOTO_BASE_URL = "https://api.planespotters.net/pub/photos";
const LIVE_TRACK_INTERVAL_MS = 30000;
const AUTO_LOAD_RADIUS_NM = 60;
const MAX_TRACK_POINTS = 700;
const ROUTE_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000;
const ROUTE_CACHE_MAX_ENTRIES = 220;
const PHOTO_CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
const PHOTO_CACHE_MAX_ENTRIES = 350;
const TRACK_CACHE_MAX_ENTRIES = 180;
const MAP_AIRCRAFT_LIMIT = 220;
const LIST_AIRCRAFT_LIMIT = 120;
const TRAIL_AIRCRAFT_LIMIT = 120;
const VISIBLE_TRACK_POINTS = 42;
const ALERT_COOLDOWN_MS = 3 * 60 * 1000;
const ALERT_LOG_MAX_ENTRIES = 30;
const HISTORY_MAX_ENTRIES = 450;
const HISTORY_BUCKET_MS = 15 * 60 * 1000;
const HISTORY_RECORD_LIMIT = 180;
const HISTORY_RECORD_COOLDOWN_MS = 60 * 1000;
const HISTORY_CLOSE_KM = 25;
const HISTORY_LOW_ALT_FT = 2000;
const STALE_FADE_SECONDS = 90;
const STALE_REMOVE_SECONDS = 180;
const PERFORMANCE_PRESETS = {
  responsive: { refreshIntervalMs: 5000, mapLimit: 160, listLimit: 80, trailLimit: 70, trackPoints: 28, showTrails: true, showFreshnessLabels: true, showRealPhotos: false, autoHideStale: true, removeAfterSeconds: 150 },
  balanced: { refreshIntervalMs: 8000, mapLimit: 220, listLimit: 120, trailLimit: 120, trackPoints: 42, showTrails: true, showFreshnessLabels: true, showRealPhotos: true, autoHideStale: true, removeAfterSeconds: STALE_REMOVE_SECONDS },
  economy: { refreshIntervalMs: 15000, mapLimit: 120, listLimit: 70, trailLimit: 40, trackPoints: 22, showTrails: false, showFreshnessLabels: false, showRealPhotos: false, autoHideStale: true, removeAfterSeconds: 120 }
};
const API_SOURCES = {
  adsbLol: {
    label: "adsb.lol",
    apiBase: "https://api.adsb.lol/v2",
    requiresKey: false,
    allowProxy: true
  },
  adsbFi: {
    label: "adsb.fi",
    apiBase: "https://opendata.adsb.fi/api/v2",
    requiresKey: false,
    allowProxy: true
  },
  adsbOne: {
    label: "adsb.one",
    apiBase: "https://api.adsb.one/v2",
    requiresKey: false,
    allowProxy: true
  },
  airplanesLive: {
    label: "airplanes.live",
    apiBase: "https://api.airplanes.live/v2",
    requiresKey: false,
    allowProxy: true,
    radiusStyle: "point"
  },
  adsbExchange: {
    label: "ADS-B Exchange",
    apiBase: "https://www.adsbexchange.com/api/aircraft/v2",
    requiresKey: true,
    hexCollection: true
  },
  custom: {
    label: "własne API",
    apiBase: "https://api.adsb.lol/v2",
    requiresKey: false
  }
};
const DEFAULT_DATA_SOURCE = "adsbLol";
const FREE_FALLBACK_SOURCES = ["adsbLol", "adsbFi", "adsbOne", "airplanesLive"];
const CORS_PROXY_BUILDERS = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`
];
const memoryStorage = new Map();
let persistentStorageAvailable = true;

const form = document.querySelector("#flightForm");
const searchAircraftButton = document.querySelector("#searchAircraftButton");
const saveFlightButton = document.querySelector("#saveFlightButton");
const icaoInput = document.querySelector("#icaoInput");
const nameInput = document.querySelector("#nameInput");
const dateInput = document.querySelector("#dateInput");
const zoomInput = document.querySelector("#zoomInput");
const latInput = document.querySelector("#latInput");
const lonInput = document.querySelector("#lonInput");
const importText = document.querySelector("#importText");
const flightList = document.querySelector("#flightList");
const emptyState = document.querySelector("#emptyState");
const template = document.querySelector("#flightItemTemplate");
const toast = document.querySelector("#toast");
const installButton = document.querySelector("#installButton");
const installPrompt = document.querySelector("#installPrompt");
const installPromptInstallButton = document.querySelector("#installPromptInstallButton");
const installPromptBrowserButton = document.querySelector("#installPromptBrowserButton");
const themeInput = document.querySelector("#themeInput");
const dataSourceInput = document.querySelector("#dataSourceInput");
const apiKeyInput = document.querySelector("#apiKeyInput");
const apiBaseInput = document.querySelector("#apiBaseInput");
const browseLatInput = document.querySelector("#browseLatInput");
const browseLonInput = document.querySelector("#browseLonInput");
const browseDistInput = document.querySelector("#browseDistInput");
const aircraftFilterKindInput = document.querySelector("#aircraftFilterKind");
const aircraftFilterMinAltInput = document.querySelector("#aircraftFilterMinAlt");
const aircraftFilterMaxAltInput = document.querySelector("#aircraftFilterMaxAlt");
const aircraftFilterCallsignInput = document.querySelector("#aircraftFilterCallsign");
const resetAircraftFiltersButton = document.querySelector("#resetAircraftFiltersButton");
const performanceModeInput = document.querySelector("#performanceModeInput");
const performanceRefreshInput = document.querySelector("#performanceRefreshInput");
const performanceMapLimitInput = document.querySelector("#performanceMapLimitInput");
const performanceListLimitInput = document.querySelector("#performanceListLimitInput");
const performanceTrailsInput = document.querySelector("#performanceTrailsInput");
const performanceFreshnessLabelsInput = document.querySelector("#performanceFreshnessLabelsInput");
const performanceRealPhotosInput = document.querySelector("#performanceRealPhotosInput");
const performanceAutoHideStaleInput = document.querySelector("#performanceAutoHideStaleInput");
const performanceRemoveAfterInput = document.querySelector("#performanceRemoveAfterInput");
const resetPerformanceButton = document.querySelector("#resetPerformanceButton");
const mapLocateButton = document.querySelector("#mapLocateButton");
const aircraftStatus = document.querySelector("#aircraftStatus");
const aircraftList = document.querySelector("#aircraftList");
const routeSummary = document.querySelector("#routeSummary");
const aircraftTemplate = document.querySelector("#aircraftItemTemplate");
const busyOverlay = document.querySelector("#busyOverlay");
const busyText = document.querySelector("#busyText");
const appVersionBadge = document.querySelector("#appVersionBadge");
const settingsVersionBadge = document.querySelector("#settingsVersionBadge");
const forceUpdateButton = document.querySelector("#forceUpdateButton");
const lastStatusText = document.querySelector("#lastStatusText");
const lastStatusTime = document.querySelector("#lastStatusTime");
const statusChip = document.querySelector("#statusChip");
const copyStatusButton = document.querySelector("#copyStatusButton");
const drawer = document.querySelector("#drawer");
const drawerTitle = document.querySelector("#drawerTitle");
const savedSearchInput = document.querySelector("#savedSearchInput");
const watchList = document.querySelector("#watchList");
const watchEmptyState = document.querySelector("#watchEmptyState");
const watchTemplate = document.querySelector("#watchItemTemplate");
const addCurrentWatchButton = document.querySelector("#addCurrentWatchButton");
const clearWatchButton = document.querySelector("#clearWatchButton");
const alertsEnabledInput = document.querySelector("#alertsEnabledInput");
const alertQueryInput = document.querySelector("#alertQueryInput");
const alertDistanceKmInput = document.querySelector("#alertDistanceKmInput");
const alertMaxAltitudeInput = document.querySelector("#alertMaxAltitudeInput");
const alertWatchedInput = document.querySelector("#alertWatchedInput");
const alertSpecialInput = document.querySelector("#alertSpecialInput");
const alertSystemInput = document.querySelector("#alertSystemInput");
const saveAlertSettingsButton = document.querySelector("#saveAlertSettingsButton");
const requestNotificationsButton = document.querySelector("#requestNotificationsButton");
const testAlertsButton = document.querySelector("#testAlertsButton");
const clearAlertLogButton = document.querySelector("#clearAlertLogButton");
const historySearchInput = document.querySelector("#historySearchInput");
const historyList = document.querySelector("#historyList");
const historyEmptyState = document.querySelector("#historyEmptyState");
const historyTemplate = document.querySelector("#historyItemTemplate");
const exportHistoryButton = document.querySelector("#exportHistoryButton");
const clearHistoryButton = document.querySelector("#clearHistoryButton");
const alertStatus = document.querySelector("#alertStatus");
const alertLogList = document.querySelector("#alertLogList");
const bottomNavButtons = Array.from(document.querySelectorAll(".bottom-nav button"));
const bottomMoreMenu = document.querySelector("#bottomMoreMenu");
const bottomMoreButton = document.querySelector("[data-more-toggle]");
const bottomMoreButtons = Array.from(document.querySelectorAll("#bottomMoreMenu button[data-panel]"));
const MORE_PANEL_IDS = new Set(bottomMoreButtons.map((button) => button.dataset.panel).filter(Boolean));
const aircraftSheet = document.querySelector("#aircraftSheet");
const aircraftSheetDragHandle = document.querySelector("#aircraftSheetDragHandle");
const aircraftSheetPhoto = document.querySelector("#aircraftSheetPhoto");
const aircraftSheetCallsign = document.querySelector("#aircraftSheetCallsign");
const aircraftSheetType = document.querySelector("#aircraftSheetType");
const aircraftSheetOperator = document.querySelector("#aircraftSheetOperator");
const aircraftSheetRouteFrom = document.querySelector("#aircraftSheetRouteFrom");
const aircraftSheetRouteTo = document.querySelector("#aircraftSheetRouteTo");
const aircraftSheetRouteCaption = document.querySelector("#aircraftSheetRouteCaption");
const aircraftSheetAltitude = document.querySelector("#aircraftSheetAltitude");
const aircraftSheetSpeed = document.querySelector("#aircraftSheetSpeed");
const aircraftSheetRegistration = document.querySelector("#aircraftSheetRegistration");
const aircraftSheetPhaseIcon = document.querySelector("#aircraftSheetPhaseIcon");
const aircraftSheetPhaseText = document.querySelector("#aircraftSheetPhaseText");
const aircraftSheetFreshness = document.querySelector("#aircraftSheetFreshness");
const aircraftSheetHex = document.querySelector("#aircraftSheetHex");
const aircraftSheetHeading = document.querySelector("#aircraftSheetHeading");
const aircraftSheetVerticalRate = document.querySelector("#aircraftSheetVerticalRate");
const aircraftSheetLastSignal = document.querySelector("#aircraftSheetLastSignal");
const aircraftSheetPosition = document.querySelector("#aircraftSheetPosition");
const aircraftSheetSource = document.querySelector("#aircraftSheetSource");
const aircraftSheetMorePanel = document.querySelector("#aircraftSheetMorePanel");
const aircraftSheetAds = document.querySelector("#aircraftSheetAds");
const aircraftSheetWatch = document.querySelector("#aircraftSheetWatch");
const aircraftSheetSave = document.querySelector("#aircraftSheetSave");
const aircraftSheetRoute = document.querySelector("#aircraftSheetRoute");
const firestoreSyncStatus = document.querySelector("#firestoreSyncStatus");
const firestoreSettingsButton = document.querySelector("#firestoreSettingsButton");
const firestoreSyncNowButton = document.querySelector("#firestoreSyncNowButton");
const firestoreDisableButton = document.querySelector("#firestoreDisableButton");
const firestoreSetupModal = document.querySelector("#firestoreSetupModal");
const firestoreConfigPaste = document.querySelector("#firestoreConfigPaste");
const firestoreParseConfigButton = document.querySelector("#firestoreParseConfigButton");
const firestoreApiKeyInput = document.querySelector("#firestoreApiKeyInput");
const firestoreAuthDomainInput = document.querySelector("#firestoreAuthDomainInput");
const firestoreProjectIdInput = document.querySelector("#firestoreProjectIdInput");
const firestoreStorageBucketInput = document.querySelector("#firestoreStorageBucketInput");
const firestoreMessagingSenderIdInput = document.querySelector("#firestoreMessagingSenderIdInput");
const firestoreAppIdInput = document.querySelector("#firestoreAppIdInput");
const firestoreSyncKeyInput = document.querySelector("#firestoreSyncKeyInput");
const firestoreSaveConfigButton = document.querySelector("#firestoreSaveConfigButton");
const firestoreSkipConfigButton = document.querySelector("#firestoreSkipConfigButton");
const firestoreCloseConfigButton = document.querySelector("#firestoreCloseConfigButton");
const firestoreModalStatus = document.querySelector("#firestoreModalStatus");
const drawerDragHandle = document.querySelector("#drawerDragHandle");

let deferredInstallPrompt = null;
let map = null;
let tileLayer = null;
let aircraftLayer = null;
let trailLayer = null;
let routeLayer = null;
let userLocationLayer = null;
let lastRouteBounds = null;
let liveTrackTimer = null;
let activeTrack = null;
let aircraftAutoRefreshTimer = null;
let aircraftRefreshInProgress = false;
let lastRenderSettings = null;
let busyDepth = 0;
let lastAircraftCache = [];
let startupAutoLoadInProgress = false;
let selectedAircraft = null;
let savedMapFocusActive = false;
let firestoreModulesPromise = null;
let firestoreState = {
  app: null,
  db: null,
  collectionRef: null,
  unsubscribe: null,
  ready: false,
  initializing: false,
  configSignature: "",
  stateDocRef: null,
  unsubscribeState: null
};
let firestoreApplyingRemote = false;
let firestorePushTimer = null;
let firestorePushInProgress = false;
const firestoreClientId = getOrCreateFirestoreClientId();
let lastHistoryWriteAt = 0;
const alertCooldownMap = new Map();

function isSavePanelOpen() {
  const panel = document.getElementById("savePanel");
  return Boolean(drawer?.classList.contains("is-open") && panel?.classList.contains("is-active"));
}

function markManualSearchInput(value = icaoInput?.value || "") {
  if (!icaoInput) return;
  icaoInput.dataset.manualSearchActive = "1";
  icaoInput.dataset.manualSearchValue = String(value || "");
}

function clearManualSearchInputLock() {
  if (!icaoInput) return;
  delete icaoInput.dataset.manualSearchActive;
  delete icaoInput.dataset.manualSearchValue;
}

function shouldPreserveManualSearchInput(options = {}) {
  return options.force !== true && icaoInput?.dataset.manualSearchActive === "1" && isSavePanelOpen();
}

function storageGet(key, fallback = "") {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : value;
  } catch {
    persistentStorageAvailable = false;
    return memoryStorage.has(key) ? memoryStorage.get(key) : fallback;
  }
}

function storageSet(key, value) {
  memoryStorage.set(key, value);
  try {
    localStorage.setItem(key, value);
    persistentStorageAvailable = true;
  } catch {
    persistentStorageAvailable = false;
  }
}

function storageJsonGet(key, fallback) {
  try {
    return JSON.parse(storageGet(key, JSON.stringify(fallback)));
  } catch {
    return fallback;
  }
}

function storageJsonSet(key, value) {
  storageSet(key, JSON.stringify(value));
}

function pruneCacheBySavedAt(cache, maxEntries, maxAgeMs) {
  const now = Date.now();
  return Object.fromEntries(
    Object.entries(cache || {})
      .filter(([, item]) => item && typeof item === "object" && Number.isFinite(Number(item.savedAt)) && now - Number(item.savedAt) <= maxAgeMs)
      .sort(([, a], [, b]) => Number(b.savedAt) - Number(a.savedAt))
      .slice(0, maxEntries)
  );
}

function pruneTrackCache(tracks) {
  return Object.fromEntries(
    Object.entries(tracks || {})
      .filter(([key, points]) => /^[a-f0-9]{6}:\d{4}-\d{2}-\d{2}$/.test(key) && Array.isArray(points) && points.length)
      .sort(([keyA, pointsA], [keyB, pointsB]) => {
        const lastA = pointsA[pointsA.length - 1]?.at || keyA.slice(7);
        const lastB = pointsB[pointsB.length - 1]?.at || keyB.slice(7);
        return String(lastB).localeCompare(String(lastA));
      })
      .slice(0, TRACK_CACHE_MAX_ENTRIES)
      .map(([key, points]) => [key, points.slice(-MAX_TRACK_POINTS)])
  );
}

function todayLocalDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

function normalizeIcao(value) {
  return value.trim().toLowerCase().replace(/[^a-f0-9]/g, "");
}

function isValidIcao(value) {
  return /^[a-f0-9]{6}$/.test(value);
}

function explicitIcaoFromInput(value) {
  const clean = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^hex[:\s-]*/i, "")
    .replace(/\s+/g, "");
  return isValidIcao(clean) ? clean : "";
}

function createTextElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function normalizeCallsign(value) {
  const clean = String(value || "").trim().toUpperCase().replace(/\s+/g, "");
  const match = clean.match(/^([A-Z]*)(0*[0-9]+)([A-Z]*)$/);
  if (!match) return clean;
  return `${match[1]}${String(Number.parseInt(match[2], 10))}${match[3]}`;
}

function aircraftCallsign(aircraft) {
  return normalizeCallsign(aircraft.flight || "");
}

function numberText(value, fractionDigits = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "brak danych";
  return number.toLocaleString("pl-PL", { maximumFractionDigits: fractionDigits, minimumFractionDigits: fractionDigits });
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
  element.className = `freshness-badge freshness-${info.state}`;
  element.textContent = compact ? info.label : `${info.label} • ${info.ageText}`;
  element.title = `${info.detail}. Ostatni sygnał: ${info.ageText}`;
}

function aircraftPositionText(aircraft) {
  const point = pointFromAircraft(aircraft);
  return point ? `${point.lat.toFixed(5)}, ${point.lon.toFixed(5)}` : "brak danych";
}

function aircraftSourceText(aircraft) {
  return firstFilled(aircraft?._sourceName, sourceLabel(dataSourceInput?.value), "brak danych");
}

function updateAircraftSheetLiveDetails(aircraft) {
  if (!aircraft) return;
  const verticalRate = aircraftVerticalRate(aircraft);
  const freshness = aircraftFreshnessInfo(aircraft);
  const hexValue = normalizeIcao(firstFilled(aircraft?.hex, aircraft?.icao, aircraft?.icao24)).toUpperCase() || "brak danych";
  const positionValue = aircraftPositionText(aircraft);
  if (aircraftSheetFreshness) setFreshnessBadge(aircraftSheetFreshness, aircraft);
  if (aircraftSheetHex) {
    aircraftSheetHex.textContent = hexValue;
    enableCopyableAircraftValue(aircraftSheetHex, hexValue, "HEX / #");
  }
  if (aircraftSheetHeading) aircraftSheetHeading.textContent = formatHeading(aircraftHeading(aircraft));
  if (aircraftSheetVerticalRate) aircraftSheetVerticalRate.textContent = Number.isFinite(verticalRate) ? `${numberText(verticalRate)} ft/min` : "brak danych";
  if (aircraftSheetLastSignal) aircraftSheetLastSignal.textContent = freshness.ageText;
  if (aircraftSheetPosition) {
    aircraftSheetPosition.textContent = positionValue;
    enableCopyableAircraftValue(aircraftSheetPosition, positionValue, "pozycję");
  }
  if (aircraftSheetSource) aircraftSheetSource.textContent = aircraftSourceText(aircraft);
}

function firstFilled(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
  }
  return "";
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

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
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
  if (/ULTRALIGHT|MICROLIGHT|PARAGLIDER|MOTOL|\b(C150|C152|C162|C172|C175|C177|C180|C182|C185|C206|C207|C208|C210|P28A|P28R|PA28|PA32|PA34|PA44|SR20|SR22|DA20|DA40|DA42|DV20|DR40|BE20|BE30|BE35|BE36|BE58|PC12|PC24|TBM7|TBM8|TBM9|C25A|C25B|C25C|E50P|E55P|PRM1|M20P|M20T|C680|C750|BN2P|AN2|DHC2|DHC3|DHC6|DH8A|DH8B|DH8C|DH8D|AT43|AT45|AT72|SF34|L410|P180)\b/.test(raw)) return "prop";
  if (/CARGO|FREIGHTER|HEAVY|\b(A300|A310|A330|A332|A333|A339|A340|A342|A343|A345|A346|A350|A359|A35K|A380|A388|B747|B748|B74S|B74R|B767|B763|B764|B777|B772|B773|B77L|B77W|B787|B788|B789|B78X|IL76|IL96|A124|A225|MD11|DC10|DC87)\b/.test(raw)) return "heavy";
  if (/MILITARY|WOJSK|FIGHTER|TANKER|SPECIAL|POLICE|RESCUE|AMBULANCE|\b(C17|C5M|C130|C30J|KC\d|K35R|A400|P8|P3|E3|E7|E8|F16|F-16|F18|F-18|F22|F-22|F35|F-35|MIG|MIG\d|SU\d|TYPHOON|EUFI|RAFALE|GRIPEN|TORNADO|HAWK|L159|A10|B1|B2|B52)\b/.test(raw)) return "special";
  return "jet";
}


function aircraftGroupLabel(group) {
  return {
    helicopter: "śmigłowiec",
    glider: "szybowiec",
    prop: "samolot śmigłowy",
    heavy: "duży samolot",
    special: "samolot specjalny",
    jet: "samolot odrzutowy"
  }[group] || "samolot";
}

const AIRCRAFT_ICON_FILES = {
  jet: "assets/aircraft/aircraft-jet.svg",
  heavy: "assets/aircraft/aircraft-heavy.svg",
  prop: "assets/aircraft/aircraft-prop.svg",
  helicopter: "assets/aircraft/aircraft-helicopter.svg",
  glider: "assets/aircraft/aircraft-glider.svg",
  special: "assets/aircraft/aircraft-special.svg"
};

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


function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function defaultPerformanceSettings() {
  return { mode: "balanced", ...PERFORMANCE_PRESETS.balanced };
}

function normalizePerformanceSettings(saved = {}) {
  const mode = Object.prototype.hasOwnProperty.call(PERFORMANCE_PRESETS, saved.mode) ? saved.mode : "balanced";
  const preset = PERFORMANCE_PRESETS[mode] || PERFORMANCE_PRESETS.balanced;
  return {
    mode,
    refreshIntervalMs: clampNumber(saved.refreshIntervalMs, 3000, 30000, preset.refreshIntervalMs),
    mapLimit: Math.round(clampNumber(saved.mapLimit, 40, 500, preset.mapLimit)),
    listLimit: Math.round(clampNumber(saved.listLimit, 30, 250, preset.listLimit)),
    trailLimit: Math.round(clampNumber(saved.trailLimit, 0, 250, preset.trailLimit)),
    trackPoints: Math.round(clampNumber(saved.trackPoints, 8, 120, preset.trackPoints)),
    showTrails: saved.showTrails !== undefined ? saved.showTrails === true : preset.showTrails,
    showFreshnessLabels: saved.showFreshnessLabels !== undefined ? saved.showFreshnessLabels === true : preset.showFreshnessLabels,
    showRealPhotos: saved.showRealPhotos !== undefined ? saved.showRealPhotos === true : preset.showRealPhotos,
    autoHideStale: saved.autoHideStale !== undefined ? saved.autoHideStale === true : preset.autoHideStale,
    removeAfterSeconds: Math.round(clampNumber(saved.removeAfterSeconds, 60, 600, preset.removeAfterSeconds))
  };
}

function loadPerformanceSettings() {
  const settings = normalizePerformanceSettings(storageJsonGet(PERFORMANCE_STORAGE_KEY, defaultPerformanceSettings()));
  if (performanceModeInput) performanceModeInput.value = settings.mode;
  if (performanceRefreshInput) performanceRefreshInput.value = String(Math.round(settings.refreshIntervalMs / 1000));
  if (performanceMapLimitInput) performanceMapLimitInput.value = String(settings.mapLimit);
  if (performanceListLimitInput) performanceListLimitInput.value = String(settings.listLimit);
  if (performanceTrailsInput) performanceTrailsInput.checked = settings.showTrails;
  if (performanceFreshnessLabelsInput) performanceFreshnessLabelsInput.checked = settings.showFreshnessLabels;
  if (performanceRealPhotosInput) performanceRealPhotosInput.checked = settings.showRealPhotos;
  if (performanceAutoHideStaleInput) performanceAutoHideStaleInput.checked = settings.autoHideStale;
  if (performanceRemoveAfterInput) performanceRemoveAfterInput.value = String(settings.removeAfterSeconds);
  return settings;
}

function readPerformanceSettings() {
  const mode = Object.prototype.hasOwnProperty.call(PERFORMANCE_PRESETS, performanceModeInput?.value) ? performanceModeInput.value : "balanced";
  const preset = PERFORMANCE_PRESETS[mode] || PERFORMANCE_PRESETS.balanced;
  return normalizePerformanceSettings({
    mode,
    refreshIntervalMs: clampNumber(Number(performanceRefreshInput?.value || Math.round(preset.refreshIntervalMs / 1000)) * 1000, 3000, 30000, preset.refreshIntervalMs),
    mapLimit: performanceMapLimitInput?.value || preset.mapLimit,
    listLimit: performanceListLimitInput?.value || preset.listLimit,
    trailLimit: preset.trailLimit,
    trackPoints: preset.trackPoints,
    showTrails: performanceTrailsInput ? performanceTrailsInput.checked : preset.showTrails,
    showFreshnessLabels: performanceFreshnessLabelsInput ? performanceFreshnessLabelsInput.checked : preset.showFreshnessLabels,
    showRealPhotos: performanceRealPhotosInput ? performanceRealPhotosInput.checked : preset.showRealPhotos,
    autoHideStale: performanceAutoHideStaleInput ? performanceAutoHideStaleInput.checked : preset.autoHideStale,
    removeAfterSeconds: performanceRemoveAfterInput?.value || preset.removeAfterSeconds
  });
}

function savePerformanceSettings() {
  const settings = readPerformanceSettings();
  storageJsonSet(PERFORMANCE_STORAGE_KEY, settings);
  markFirestoreStateSectionDirty("performance");
  return settings;
}

function applyPerformancePreset(mode) {
  const preset = PERFORMANCE_PRESETS[mode] || PERFORMANCE_PRESETS.balanced;
  if (performanceRefreshInput) performanceRefreshInput.value = String(Math.round(preset.refreshIntervalMs / 1000));
  if (performanceMapLimitInput) performanceMapLimitInput.value = String(preset.mapLimit);
  if (performanceListLimitInput) performanceListLimitInput.value = String(preset.listLimit);
  if (performanceTrailsInput) performanceTrailsInput.checked = preset.showTrails;
  if (performanceFreshnessLabelsInput) performanceFreshnessLabelsInput.checked = preset.showFreshnessLabels;
  if (performanceRealPhotosInput) performanceRealPhotosInput.checked = preset.showRealPhotos;
  if (performanceAutoHideStaleInput) performanceAutoHideStaleInput.checked = preset.autoHideStale;
  if (performanceRemoveAfterInput) performanceRemoveAfterInput.value = String(preset.removeAfterSeconds);
}

function getAutoRefreshIntervalMs() {
  return readPerformanceSettings().refreshIntervalMs;
}

function aircraftVisibleByLifecycle(aircraft, performance = readPerformanceSettings()) {
  if (!performance.autoHideStale) return true;
  const seconds = aircraftFreshnessSeconds(aircraft);
  if (!Number.isFinite(seconds)) return true;
  return seconds <= performance.removeAfterSeconds;
}

function lifecycleFilteredAircraft(aircraft, performance = readPerformanceSettings()) {
  return (aircraft || []).filter((item) => aircraftVisibleByLifecycle(item, performance));
}

function hiddenOldAircraftCount(aircraft, performance = readPerformanceSettings()) {
  return Math.max(0, (aircraft || []).length - lifecycleFilteredAircraft(aircraft, performance).length);
}

function aircraftLifecycleState(aircraft, performance = readPerformanceSettings()) {
  const seconds = aircraftFreshnessSeconds(aircraft);
  if (!Number.isFinite(seconds)) return "unknown";
  if (performance.autoHideStale && seconds > performance.removeAfterSeconds) return "expired";
  if (seconds > STALE_FADE_SECONDS) return "stale";
  return "active";
}

function loadAircraftFilters() {
  const saved = storageJsonGet(FILTER_STORAGE_KEY, {});
  if (aircraftFilterKindInput) aircraftFilterKindInput.value = saved.kind || "all";
  if (aircraftFilterMinAltInput) aircraftFilterMinAltInput.value = saved.minAlt || "";
  if (aircraftFilterMaxAltInput) aircraftFilterMaxAltInput.value = saved.maxAlt || "";
  if (aircraftFilterCallsignInput) aircraftFilterCallsignInput.checked = saved.callsignOnly === true;
}

function readAircraftFilters() {
  const minAlt = Number.parseInt(String(aircraftFilterMinAltInput?.value || "").trim(), 10);
  const maxAlt = Number.parseInt(String(aircraftFilterMaxAltInput?.value || "").trim(), 10);
  return {
    kind: aircraftFilterKindInput?.value || "all",
    minAlt: Number.isFinite(minAlt) ? minAlt : null,
    maxAlt: Number.isFinite(maxAlt) ? maxAlt : null,
    callsignOnly: aircraftFilterCallsignInput?.checked === true
  };
}

function saveAircraftFilters() {
  const filters = readAircraftFilters();
  storageJsonSet(FILTER_STORAGE_KEY, {
    kind: filters.kind,
    minAlt: filters.minAlt === null ? "" : String(filters.minAlt),
    maxAlt: filters.maxAlt === null ? "" : String(filters.maxAlt),
    callsignOnly: filters.callsignOnly
  });
  markFirestoreStateSectionDirty("filters");
}

function aircraftMatchesKindFilter(aircraft, kind) {
  if (!kind || kind === "all") return true;
  const group = aircraftTypeGroup(aircraft);
  if (kind === "jet") return group === "jet" || group === "heavy";
  if (kind === "helicopter") return group === "helicopter";
  if (kind === "prop") return group === "prop";
  if (kind === "glider") return group === "glider";
  if (kind === "special") return group === "special";
  return true;
}

function aircraftMatchesFilters(aircraft, filters = readAircraftFilters()) {
  if (!aircraftMatchesKindFilter(aircraft, filters.kind)) return false;
  if (filters.callsignOnly && !aircraftCallsign(aircraft)) return false;
  const altitude = aircraftAltitudeFeet(aircraft);
  if (filters.minAlt !== null && (altitude === null || altitude < filters.minAlt)) return false;
  if (filters.maxAlt !== null && (altitude === null || altitude > filters.maxAlt)) return false;
  return true;
}

function filterAircraftForDisplay(aircraft) {
  const filters = readAircraftFilters();
  const performance = readPerformanceSettings();
  return lifecycleFilteredAircraft(aircraft, performance).filter((item) => aircraftMatchesFilters(item, filters));
}

function aircraftFilterSummary(total, visible, sourceAircraft = lastAircraftCache) {
  const hiddenOld = hiddenOldAircraftCount(sourceAircraft || []);
  const filteredOut = Math.max(0, total - hiddenOld - visible);
  if (!hiddenOld && !filteredOut) return `${visible} samolotów`;
  const parts = [`${visible} z ${total} samolotów`];
  if (filteredOut) parts.push(`${filteredOut} ukryte filtrami`);
  if (hiddenOld) parts.push(`${hiddenOld} usunięte jako stare`);
  return parts.join(" • ");
}

function rerenderAircraftFromCache() {
  saveAircraftFilters();
  if (!lastAircraftCache.length) {
    setAircraftStatus("Filtry ustawione. Pobierz samoloty, żeby je zastosować.");
    return;
  }
  const visibleAircraft = filterAircraftForDisplay(lastAircraftCache);
  renderAircraft(visibleAircraft, lastRenderSettings || readBrowseSettingsSafe());
  renderAircraftMap(visibleAircraft, lastRenderSettings || readBrowseSettingsSafe(), { preserveView: true });
  setAircraftStatus(`Filtry: pokazuję ${aircraftFilterSummary(lastAircraftCache.length, visibleAircraft.length)}.`);
}

function readBrowseSettingsSafe() {
  try {
    return readBrowseSettings();
  } catch {
    return { dist: Number(browseDistInput?.value || AUTO_LOAD_RADIUS_NM) || AUTO_LOAD_RADIUS_NM };
  }
}

const AIRCRAFT_SVG_MARKUP = Object.freeze({
  jet: `
<g transform="scale(0.125)">
<path fill="currentColor" fill-rule="evenodd" d="
    M 256 449.49 L 254 449.34 L 251.87 447 L 246.35 423 L 245 421.42 L 193 442.4 L 191.4 441 L 192 421.4 L 238.31 382 L 232 283.61 L 215 289.85 L 175 307.72 L 104 341.69 L 103.19 326 L 103.37 319 L 105 316.77 L 178.13 252 L 178.58 234 L 181 229.5 L 186 226.9 L 191 226.77 L 196 228.86 L 199 233.23 L 200 233.19 L 232.09 202 L 232.55 122 L 234.74 102 L 238.72 85 L 243.95 72 L 249 64.58 L 255 61.74 L 260.77 64 L 266.48 72 L 272.35 87 L 276.26 105 L 278.28 130 L 278.47 202 L 311 233.47 L 315 228.53 L 319 226.9 L 324 226.75 L 329 228.98 L 331.83 234 L 332.4 252 L 398 309.77 L 406.74 318 L 407.43 321 L 407.44 340 L 406 341.65 L 329 304.74 L 279 283.25 L 271.78 381 L 318.33 421 L 319.13 441 L 317 442.23 L 265 421.47 L 259.34 445 L 256 449.49 Z
  "/>
</g>
  `,
  heavy: `
<g transform="scale(0.125)">
<path fill="currentColor" fill-rule="evenodd" d="
    M 256 435.57 L 254.82 435 L 248 413.3 L 181 429.34 L 173.86 430 L 175.75 416 L 177.56 413 L 240.02 376 L 234.69 333 L 230 280.35 L 193 291.86 L 189 303.48 L 186.77 302 L 184 294.74 L 155 304.6 L 151 315.66 L 148.81 315 L 147.23 309 L 146 307.99 L 136 311.9 L 132 322.6 L 130.33 322 L 128.54 316 L 127 315.28 L 63 339.21 L 61.74 338 L 65 317.05 L 117.75 280 L 116.18 261 L 118.24 247 L 125 245.31 L 131 245.58 L 134.32 247 L 136.13 257 L 136.12 267 L 137 267.36 L 167.54 246 L 166.11 226 L 166.83 218 L 169 213.13 L 176 211.97 L 184 213.59 L 187 230.49 L 231 181.99 L 232.44 176 L 233.61 131 L 237.82 103 L 241.76 90 L 245.59 82 L 251 75.85 L 256 74.39 L 260.7 76 L 265.25 81 L 269.38 89 L 273.27 101 L 276.26 116 L 278.13 134 L 278.92 175 L 280.41 182 L 324 230.25 L 325.25 230 L 325.59 219 L 328 213.03 L 335 211.91 L 343 213.82 L 345.17 228 L 343.55 246 L 374 267.2 L 375.27 267 L 375.37 255 L 377.08 247 L 383 245.31 L 390 245.64 L 393 246.86 L 395.03 262 L 393.48 280 L 446.37 317 L 449.42 338 L 449 339.32 L 446 338.36 L 384 315.18 L 382.6 316 L 381 321.79 L 379 322.56 L 375 311.67 L 365 307.89 L 362.36 315 L 361 316.04 L 359.54 315 L 356 304.53 L 327 294.74 L 324 302.78 L 322 303.38 L 318 291.75 L 281 280.33 L 276.3 334 L 271 375.48 L 333.64 413 L 335.33 416 L 337.24 430 L 330 429.33 L 263 413.28 L 256 435.57 Z
  "/>
</g>
  `,
  prop: `
<g transform="scale(0.125)">
<path fill="currentColor" fill-rule="evenodd" d="
    M 255 419.4 L 253.09 417 L 251 384.83 L 246.6 398 L 245 398.89 L 185 393.6 L 181.61 391 L 181.57 370 L 185.44 366 L 245.91 358 L 230.56 246 L 64 226.1 L 61.69 224 L 61.33 222 L 61.34 188 L 62.63 183 L 68 179.31 L 172 174.61 L 174.34 173 L 174.49 169 L 176 168.21 L 179 174.56 L 229 174.59 L 232.69 120 L 233.83 116 L 237 111.53 L 249 107.11 L 249.06 101 L 248 99.81 L 224 101.14 L 207 99.47 L 205.56 98 L 224 95.72 L 249 96.92 L 252 92.57 L 256 90.87 L 259.51 93 L 262 96.94 L 287 95.72 L 305.34 98 L 304 99.47 L 287 101.13 L 263 99.86 L 261.94 101 L 262 107.11 L 273 110.9 L 277.39 117 L 279.36 131 L 281.15 173 L 282 174.59 L 332 174.47 L 333.43 173 L 333.6 169 L 335 168.21 L 336.3 169 L 336.43 173 L 338 174.6 L 444 179.61 L 447.39 182 L 449.39 186 L 449.59 220 L 449.14 224 L 446 226.3 L 280.39 246 L 264.58 358 L 319 365.75 L 323.02 370 L 323.21 390 L 322.45 392 L 320 393.6 L 264 398.97 L 262.46 398 L 259 385.72 L 257 416.72 L 255 419.4 Z
    M 236.73 206 L 253 202.79 L 253 174.8 L 249 174.72 L 242 176.75 L 235.68 183 L 234.69 186 L 234.47 205 L 235 206.45 L 236.73 206 Z
    M 276.31 206 L 276.3 187 L 275.13 183 L 269 176.83 L 258 174.67 L 258 203 L 276.31 206 Z
  "/>
</g>
  `,
  helicopter: `
<g transform="scale(0.125)">
<path fill="currentColor" fill-rule="evenodd" d="
    M 263 206.58 L 256 205.07 L 249 206.37 L 219.01 178 L 218 158.39 L 209 158.67 L 208 167.49 L 202.93 163 L 203.3 137 L 206 135.58 L 208.13 137 L 208.47 152 L 218 152.68 L 218.73 120 L 220.62 109 L 223.59 100 L 228.79 90 L 236 81.57 L 243 76.55 L 253.13 73 L 253.47 63 L 256 61.62 L 258.73 63 L 259.16 73 L 268 75.84 L 275 80.5 L 281.29 87 L 288.28 99 L 293.23 118 L 294 152.65 L 303.6 152 L 303.79 138 L 305 136.03 L 307 135.56 L 309.37 138 L 309.29 163 L 304 167.44 L 303.54 159 L 294 158.45 L 293.34 178 L 263 206.58 Z
    M 259 448.02 L 253 448.33 L 251.23 447 L 248 409.51 L 208 409.48 L 205.83 408 L 208.42 393 L 210 391.5 L 247.41 391 L 244.55 296 L 242.35 289 L 228.59 267 L 224.34 255 L 250 231.01 L 257 232.58 L 263 231.08 L 287.97 255 L 282.22 270 L 270.51 288 L 267.79 295 L 263.18 390 L 264 391.48 L 288 391.52 L 289.31 393 L 291.62 406 L 287 409.48 L 262.38 410 L 259 448.02 Z
    M 379 333.33 L 376 332.66 L 349 308.25 L 280.06 245 L 264.14 230 L 264.41 229 L 268 225.36 L 269 225.81 L 324 268.74 L 386 320.38 L 387.4 322 L 387 324.92 L 379 333.33 Z
    M 244 212.59 L 208 185.14 L 129 119.38 L 123.97 115 L 124.25 112 L 132 104.48 L 136 105.9 L 198 160.83 L 248 207.6 L 244 212.59 Z
    M 269 212.18 L 268 212.59 L 263.79 208 L 314 160.77 L 376 105.37 L 380 104.93 L 387 112.22 L 387.56 114 L 386 116.19 L 311 179.38 L 269 212.18 Z
    M 134 333.3 L 131 332.84 L 123.87 325 L 124.3 321 L 198 260.75 L 243 225.91 L 244.83 226 L 248 230.26 L 134 333.3 Z
    M 205 253.38 L 202.94 251 L 202.92 184 L 204 183.68 L 208.41 188 L 209 235.35 L 220.42 235 L 219.03 197 L 220 196.51 L 223 198.72 L 243.19 215 L 243.1 224 L 220.65 241 L 209 241.57 L 208.4 250 L 205 253.38 Z
    M 308 253.39 L 303.74 250 L 303 241.44 L 292 241.36 L 269.16 224 L 269.17 215 L 272 211.78 L 293 196.61 L 291.81 235 L 303.53 235 L 303.8 188 L 309 183.4 L 309.33 251 L 308 253.39 Z
    M 225.28 134 L 236 128.7 L 252.37 126 L 252.73 100 L 239 100.77 L 231 103.61 L 226.53 107 L 223.96 116 L 224.06 133 L 225.28 134 Z
    M 288.13 134 L 288.17 114 L 285.59 107 L 276 101.57 L 260 99.52 L 259.73 126 L 276 128.66 L 288.13 134 Z
    M 260 230.36 L 252 230.3 L 247.37 227 L 244.68 223 L 244.32 217 L 245.67 213 L 249.23 209 L 254 206.81 L 258 206.75 L 262.82 209 L 266.46 213 L 268.28 218 L 266.41 225 L 260 230.36 Z
    M 284 449.41 L 278.56 447 L 289.35 420 L 286.7 414 L 288 411.1 L 293.21 407 L 299.58 381 L 304 380.9 L 305.84 383 L 295.56 409 L 298 414 L 297.46 417 L 296 419.02 L 291.7 421 L 285.37 448 L 284 449.41 Z
  "/>
</g>
  `,
  glider: `
<g transform="scale(0.125)">
<path fill="currentColor" fill-rule="evenodd" d="
    M 256 353.13 L 253 340.51 L 227 338.29 L 225.4 337 L 226 332.69 L 252 328.41 L 253.41 327 L 250.86 249 L 250.23 244 L 248 241.51 L 82 228.22 L 65 226.29 L 62 225.2 L 62.1 224 L 66 222.53 L 84 221.69 L 248 218.55 L 249.61 178 L 252.62 162 L 253.65 159 L 256 156.95 L 259.23 164 L 261.43 176 L 262.65 192 L 262.57 217 L 264 218.83 L 430 221.76 L 446 222.64 L 449.26 224 L 449 225.43 L 446 226.32 L 429 228.2 L 263 241.63 L 261.55 243 L 260.46 249 L 257.94 327 L 259 328.37 L 285 332.56 L 285.92 337 L 284 338.27 L 258 340.59 L 256 353.13 Z
    M 258.61 202 L 260.69 200 L 260.14 181 L 258.41 175 L 255 173.54 L 252.84 175 L 251.59 178 L 250.55 200 L 253 202.13 L 258.61 202 Z
  "/>
</g>
  `,
  special: `
<g transform="scale(0.125)">
<path fill="currentColor" fill-rule="evenodd" d="
    M 319 449.23 L 317 449.43 L 285.82 422 L 279 394.97 L 276 411.9 L 268.88 420 L 267 420.22 L 259.58 412 L 259.08 406 L 257.42 404 L 256.6 400 L 257.1 393 L 256 391.75 L 253.84 393 L 254.39 399 L 253.54 404 L 251.99 406 L 251.38 412 L 243 420.78 L 234.94 412 L 232 394.93 L 225.29 422 L 194 449.38 L 163 440.1 L 162 439 L 162.47 417 L 192 388.74 L 209 400.7 L 209.84 400 L 192.2 384 L 192.01 371 L 214.57 346 L 190.26 369 L 189 376.86 L 133 356.5 L 120.87 344 L 121.56 324 L 208 240.21 L 207 258.27 L 211.63 241 L 208.37 235 L 213.47 186 L 235.64 166 L 239.71 118 L 242.63 97 L 246.78 80 L 255 62.12 L 256 62.12 L 263.07 77 L 268.35 97 L 271.32 118 L 275.4 166 L 297.58 186 L 302.6 235 L 299.34 241 L 304 258.28 L 303 240.27 L 390.08 325 L 390.15 344 L 378.89 356 L 322 377.02 L 320.77 369 L 297 346.46 L 318.9 371 L 318.77 384 L 302.22 399 L 303 399.97 L 319 388.68 L 348.94 418 L 348.97 439 L 348.07 440 L 319 449.23 Z
    M 259.36 186 L 262.25 185 L 263.04 180 L 264.26 148 L 261.3 132 L 256.17 125 L 255 124.81 L 249.65 132 L 247.64 141 L 246.47 151 L 246.75 167 L 248.78 185 L 254 186.47 L 259.36 186 Z
    M 299.09 403 L 301.63 401 L 301 400.1 L 297.73 403 L 299.09 403 Z
    M 213.24 403 L 210 400.18 L 209.33 401 L 213.24 403 Z
  "/>
</g>
  `
});

function aircraftShapeMarkup(group) {
  const safeGroup = Object.prototype.hasOwnProperty.call(AIRCRAFT_SVG_MARKUP, group) ? group : "jet";
  return AIRCRAFT_SVG_MARKUP[safeGroup] || AIRCRAFT_SVG_MARKUP.jet;
}

function aircraftSvgMarkup(group) {
  const safeGroup = Object.prototype.hasOwnProperty.call(AIRCRAFT_SVG_MARKUP, group) ? group : "jet";
  const label = aircraftGroupLabel(safeGroup);
  return `<svg class="aircraft-svg-icon aircraft-svg-icon-${safeGroup}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="${escapeHtml(label)}" focusable="false">${aircraftShapeMarkup(safeGroup)}</svg>`;
}

function aircraftIconDimensions(group) {
  const dimensions = {
    heavy: { width: 52, height: 52, anchorX: 26, anchorY: 26, svgWidth: 46, svgHeight: 46 },
    jet: { width: 44, height: 44, anchorX: 22, anchorY: 22, svgWidth: 38, svgHeight: 38 },
    prop: { width: 38, height: 38, anchorX: 19, anchorY: 19, svgWidth: 32, svgHeight: 32 },
    helicopter: { width: 44, height: 38, anchorX: 22, anchorY: 19, svgWidth: 40, svgHeight: 34 },
    glider: { width: 52, height: 34, anchorX: 26, anchorY: 17, svgWidth: 48, svgHeight: 30 },
    special: { width: 44, height: 44, anchorX: 22, anchorY: 22, svgWidth: 38, svgHeight: 38 }
  };
  return dimensions[group] || dimensions.jet;
}


function aircraftMiniIconSvg(aircraft) {
  const group = aircraftTypeGroup(aircraft || {});
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img">
    <rect width="64" height="64" rx="18" fill="#ecfeff"/>
    <g style="color:#0f766e; filter: drop-shadow(0 5px 8px rgba(15,23,42,.25));">${aircraftShapeMarkup(group)}</g>
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

  if (!compact && options.realPhoto !== false && readPerformanceSettings().showRealPhotos) {
    findRealAircraftPhotoUrl(source).then((photoUrl) => {
      if (!photoUrl || img.dataset.photoToken !== photoToken) return;
      img.src = photoUrl;
      img.alt = `Zdjęcie samolotu ${aircraftLabel(source)}`;
      img.dataset.realPhoto = "1";
    }).catch(() => {});
  }
}

function createAircraftPhoto(aircraft, className = "aircraft-photo", options = {}) {
  const img = document.createElement("img");
  img.className = className;
  setAircraftPhoto(img, aircraft || {}, options);
  return img;
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

function numericFirst(...values) {
  for (const value of values) {
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }
  return null;
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

function aircraftListFromResponse(data) {
  if (Array.isArray(data?.ac)) return data.ac;
  if (Array.isArray(data?.aircraft)) return data.aircraft;
  if (data && isValidIcao(normalizeIcao(data.hex || ""))) return [data];
  return [];
}

function cleanCoordinate(value, min, max, label) {
  const cleaned = value.trim().replace(",", ".");
  if (!cleaned) return "";
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) {
    throw new Error(`${label} ma niepoprawna wartosc.`);
  }
  const number = Number.parseFloat(cleaned);
  if (!Number.isFinite(number) || number < min || number > max) {
    throw new Error(`${label} ma niepoprawna wartosc.`);
  }
  return String(number);
}

function sanitizeFirestoreDocId(value) {
  return String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96) || `item-${Date.now()}`;
}

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

function getOrCreateFirestoreClientId() {
  const existing = storageGet(FIRESTORE_CLIENT_ID_STORAGE_KEY, "").trim();
  if (existing) return existing;
  const generated = `client-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  storageSet(FIRESTORE_CLIENT_ID_STORAGE_KEY, generated);
  return generated;
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

function timeStampText() {
  return new Date().toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function updateStatusPanel(message, mode = "info") {
  const clean = String(message || "").trim() || "Gotowy.";
  if (lastStatusText) lastStatusText.textContent = clean;
  if (lastStatusTime) lastStatusTime.textContent = `Ostatnio: ${timeStampText()}`;
  if (statusChip) {
    statusChip.textContent = mode === "busy" ? "Pracuję" : mode === "error" ? "Błąd" : "Gotowy";
    statusChip.dataset.mode = mode;
  }
}

function hideToast() {
  if (!toast) return;
  toast.classList.remove("show");
  window.clearTimeout(showToast.timer);
}

function showToast(message, durationMs = 1900) {
  updateStatusPanel(message, String(message || "").toLowerCase().includes("błąd") || String(message || "").toLowerCase().includes("nie uda") ? "error" : "info");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(hideToast, durationMs);
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
  if (data.sections && typeof data.sections === "object") return data;
  const encoded = String(data.routeVerbose || "");
  if (!encoded) return null;
  try {
    const parsed = JSON.parse(encoded);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function remoteFirestoreStateSections(data) {
  const source = data && typeof data === "object" ? data.sections : null;
  return source && typeof source === "object" && !Array.isArray(source) ? source : {};
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

function applyRemoteAppState(remoteData) {
  const sections = remoteFirestoreStateSections(remoteData);
  const meta = loadFirestoreStateMeta();
  const changedSections = new Set();
  let needsPush = false;

  firestoreApplyingRemote = true;
  try {
    for (const section of FIRESTORE_STATE_SECTIONS) {
      const remoteSection = sections[section];
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

async function pullAppStateFromFirestore() {
  if (!firestoreState.ready || !firestoreState.stateDocRef) return { changed: false, needsPush: false };
  const modules = await loadFirestoreModules();
  const { getDoc } = modules.firestore;
  const snapshot = await getDoc(firestoreState.stateDocRef);
  if (!snapshot.exists()) return { changed: false, needsPush: false };
  const state = decodeFirestoreAppStateFromFlightDoc(snapshot.data());
  if (!state) return { changed: false, needsPush: false };
  return applyRemoteAppState(state);
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
  if (firestoreApiKeyInput) firestoreApiKeyInput.value = config?.apiKey || "";
  if (firestoreAuthDomainInput) firestoreAuthDomainInput.value = config?.authDomain || "";
  if (firestoreProjectIdInput) firestoreProjectIdInput.value = config?.projectId || "";
  if (firestoreStorageBucketInput) firestoreStorageBucketInput.value = config?.storageBucket || "";
  if (firestoreMessagingSenderIdInput) firestoreMessagingSenderIdInput.value = config?.messagingSenderId || "";
  if (firestoreAppIdInput) firestoreAppIdInput.value = config?.appId || "";
  if (firestoreSyncKeyInput) firestoreSyncKeyInput.value = config?.syncKey || generateSyncKey();
  if (firestoreConfigPaste) firestoreConfigPaste.value = "";
}

function openFirestoreSetupModal(isFirstRun = false) {
  if (!firestoreSetupModal) return;
  fillFirestoreForm();
  firestoreSetupModal.hidden = false;
  document.body.classList.add("modal-open");
  setFirestoreStatus(isFirstRun ? "Wklej konfigurację Firebase i ustaw kod synchronizacji." : "Edytujesz konfigurację Firestore.");
  window.setTimeout(() => firestoreConfigPaste?.focus(), 50);
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
    await initFirestoreSync({ silent: options.silent });
    return true;
  }
  if (firestorePushInProgress) return true;
  firestorePushInProgress = true;
  try {
    if (!options.silent) setFirestoreStatus("Synchronizuję dane programu...", "busy");
    await pushFlightsToFirestore(loadFlights());
    await pushLocalTombstonesToFirestore();
    await pushAppStateToFirestore();
    setFirestoreStatus(firestoreStatusSummary(), "ok");
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
    const stateResult = await pullAppStateFromFirestore();
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
      const result = applyRemoteAppState(state);
      if (result.needsPush) scheduleFirestorePush();
      if (result.changed) setFirestoreStatus(firestoreStatusSummary(), "ok");
    }, (error) => {
      setFirestoreStatus(`Błąd synchronizacji ustawień: ${error.message || error}`, "error");
    });


    setFirestoreStatus(firestoreStatusSummary(), "ok");
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


function setBusyVisible(isVisible, message = "Pracuję...") {
  if (isVisible) updateStatusPanel(message, "busy");
  else if (statusChip) statusChip.textContent = "Gotowy";
  if (busyText) busyText.textContent = message;
  if (busyOverlay) busyOverlay.hidden = !isVisible;
  document.body.classList.toggle("is-busy", isVisible);
  document.body.setAttribute("aria-busy", isVisible ? "true" : "false");
  for (const selector of ["#loadAircraftButton", "#refreshAircraftButton", "#drawRouteButton", "#locateButton", "#forceUpdateButton"]) {
    const button = document.querySelector(selector);
    if (button) button.disabled = isVisible;
  }
}

function beginBusy(message) {
  busyDepth += 1;
  setBusyVisible(true, message);
  let released = false;
  return () => {
    if (released) return;
    released = true;
    busyDepth = Math.max(0, busyDepth - 1);
    if (busyDepth === 0) setBusyVisible(false);
  };
}

async function runBusy(message, callback) {
  const finishBusy = beginBusy(message);
  try {
    return await callback();
  } finally {
    finishBusy();
  }
}

function invalidateMapSoon() {
  if (!map) return;
  window.setTimeout(() => map.invalidateSize?.(), 80);
  window.setTimeout(() => map.invalidateSize?.(), 240);
}

function closeBottomMoreMenu({ keepActive = false } = {}) {
  if (!bottomMoreMenu) return;
  bottomMoreMenu.classList.remove("is-open");
  bottomMoreMenu.hidden = true;
  bottomMoreButton?.setAttribute("aria-expanded", "false");
  if (!keepActive) bottomMoreButton?.classList.remove("is-active");
}

function toggleBottomMoreMenu() {
  if (!bottomMoreMenu || !bottomMoreButton) return;
  const shouldOpen = bottomMoreMenu.hidden || !bottomMoreMenu.classList.contains("is-open");
  if (shouldOpen) {
    bottomMoreMenu.hidden = false;
    bottomMoreMenu.classList.add("is-open");
    bottomMoreButton.setAttribute("aria-expanded", "true");
    bottomMoreButton.classList.add("is-active");
  } else {
    closeBottomMoreMenu();
  }
}

function selectedAircraftAlertQuery(aircraft) {
  if (!aircraft) return "";
  const icao = aircraftIcao(aircraft).toUpperCase();
  const callsign = aircraftCallsign(aircraft).toUpperCase();
  const registration = firstFilled(aircraft?.r, aircraft?.registration).toUpperCase();
  return icao || callsign || registration || aircraftLabel(aircraft);
}

function prepareAlertsPanelForSelectedAircraft() {
  if (!selectedAircraft || !alertQueryInput) return;
  const query = selectedAircraftAlertQuery(selectedAircraft);
  if (!query) return;

  // Alerty mają działać wyłącznie dla listy obserwowanych.
  // Nie tworzymy tu globalnego alertu po frazie, żeby program nie alarmował dla przypadkowych samolotów.
  upsertWatchFromAircraft(selectedAircraft, { silent: true });
  alertQueryInput.value = "";
  if (alertsEnabledInput) alertsEnabledInput.checked = true;
  if (alertWatchedInput) alertWatchedInput.checked = true;
  if (alertSpecialInput) alertSpecialInput.checked = false;
  if (alertSystemInput && "Notification" in window) alertSystemInput.checked = true;

  const settings = readAlertSettingsFromForm();
  saveAlertSettingsObject(settings);
  updateAlertStatusText(`Alert włączony dla listy obserwowanych. Dodano: ${query}.`);
}

function closeDrawerPanel() {
  clearManualSearchInputLock();
  if (!drawer) return;
  drawer.classList.remove("is-open", "is-expanded", "is-dragging");
  drawer.style.removeProperty("--sheet-drag-y");
  drawer.setAttribute("aria-hidden", "true");
  for (const panel of drawer.querySelectorAll(".drawer-panel")) panel.classList.remove("is-active");
  for (const button of bottomNavButtons) button.classList.remove("is-active");
  closeBottomMoreMenu();
  invalidateMapSoon();
}

function openDrawerPanel(panelId, title = "Panel") {
  const panel = document.getElementById(panelId);
  if (!drawer || !panel) return;

  if (panelId === "alertsPanel") prepareAlertsPanelForSelectedAircraft();

  const alreadyOpen = drawer.classList.contains("is-open") && panel.classList.contains("is-active");
  if (alreadyOpen) {
    closeDrawerPanel();
    return;
  }

  hideSelectedAircraftSheet();
  map?.closePopup?.();
  closeBottomMoreMenu({ keepActive: MORE_PANEL_IDS.has(panelId) });
  for (const item of drawer.querySelectorAll(".drawer-panel")) item.classList.toggle("is-active", item === panel);
  for (const button of bottomNavButtons) {
    if (button === bottomMoreButton) {
      button.classList.toggle("is-active", MORE_PANEL_IDS.has(panelId));
    } else {
      button.classList.toggle("is-active", button.dataset.panel === panelId);
    }
  }
  if (drawerTitle) drawerTitle.textContent = title;
  drawer.classList.remove("is-expanded", "is-dragging");
  drawer.style.removeProperty("--sheet-drag-y");
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  invalidateMapSoon();
}

function applyAppVersion() {
  if (appVersionBadge) appVersionBadge.textContent = APP_VERSION.startsWith("V") ? APP_VERSION : `v${APP_VERSION}`;
  if (settingsVersionBadge) settingsVersionBadge.textContent = APP_VERSION.startsWith("V") ? APP_VERSION : `v${APP_VERSION}`;
  document.title = `ADS Viewer Pro ${APP_VERSION}`;
  document.documentElement.dataset.appVersion = APP_VERSION_STAMP;
  storageSet(APP_BUILD_STORAGE_KEY, APP_VERSION);
}

function isStandaloneApp() {
  return window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator.standalone === true;
}

function updateInstallButtonVisibility() {
  if (installButton) {
    const standalone = isStandaloneApp();
    const markedInstalled = storageGet(PWA_INSTALLED_STORAGE_KEY, "") === "1";
    installButton.hidden = standalone || markedInstalled;
    installButton.disabled = false;
    installButton.textContent = deferredInstallPrompt ? "Zainstaluj" : "Jak zainstalować";
    installButton.title = deferredInstallPrompt
      ? "Zainstaluj aplikację na urządzeniu"
      : "Pokaż informację, jak zainstalować aplikację z menu przeglądarki";
  }
  updateInstallPromptVisibility();
}

function updateInstallPromptVisibility() {
  if (!installPrompt) return;
  const browserChoice = storageGet(PWA_BROWSER_CHOICE_STORAGE_KEY, "") === "browser";
  const markedInstalled = storageGet(PWA_INSTALLED_STORAGE_KEY, "") === "1";
  installPrompt.hidden = isStandaloneApp() || markedInstalled || browserChoice;
}

function dismissInstallPromptForBrowser() {
  storageSet(PWA_BROWSER_CHOICE_STORAGE_KEY, "browser");
  updateInstallPromptVisibility();
  showToast("Zostajesz w wersji przeglądarkowej. Instalację znajdziesz w ustawieniach programu.", 3600);
}

async function promptPwaInstall() {
  if (isStandaloneApp()) {
    showToast("Aplikacja jest już uruchomiona jako zainstalowana PWA.", 2600);
    updateInstallButtonVisibility();
    return;
  }

  if (!deferredInstallPrompt) {
    updateInstallPromptVisibility();
    showToast("Ta przeglądarka nie udostępniła przycisku instalacji. Użyj menu przeglądarki: Zainstaluj aplikację / Dodaj do ekranu głównego.", 6200);
    return;
  }

  deferredInstallPrompt.prompt();
  const choice = await deferredInstallPrompt.userChoice;
  if (choice?.outcome === "accepted") {
    storageSet(PWA_INSTALLED_STORAGE_KEY, "1");
    storageSet(PWA_BROWSER_CHOICE_STORAGE_KEY, "installed");
  }
  deferredInstallPrompt = null;
  updateInstallButtonVisibility();
}

function deleteWritableCookies() {
  if (!document.cookie) return;
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (!name) continue;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
}

async function forceProgramUpdate() {
  const finishBusy = beginBusy("Odświeżam program i pobieram najnowszą wersję...");
  try {
    if ("caches" in window) {
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));
    }

    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }

    deleteWritableCookies();
    try { sessionStorage.clear(); } catch {}

    const url = new URL(window.location.href);
    url.searchParams.set("fresh", APP_VERSION_STAMP);
    showToast("Program odświeżony. Ładuję najnowszą wersję...", 1600);
    window.setTimeout(() => window.location.replace(url.toString()), 350);
  } catch (error) {
    showToast(`Nie udało się odświeżyć programu: ${error.message}`, 4200);
  } finally {
    finishBusy();
  }
}

function explainFetchError(error) {
  if (!navigator.onLine) return "telefon nie ma aktywnego internetu";
  if (error?.name === "AbortError") return "przekroczono czas oczekiwania na API";
  if (error?.message) return error.message;
  return "nieznany błąd sieci";
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

function applyTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = nextTheme;
  if (themeInput) themeInput.value = nextTheme;
  storageSet(THEME_STORAGE_KEY, nextTheme);
  const themeMeta = document.querySelector("meta[name='theme-color']");
  if (themeMeta) themeMeta.setAttribute("content", nextTheme === "light" ? "#f3f6fb" : "#0f172a");
  refreshTileLayer();
}

function currentTileConfig() {
  if (document.documentElement.dataset.theme === "light") {
    return {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; OpenStreetMap contributors'
    };
  }

  return {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
  };
}

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
    closeDrawerPanel();
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
  if (latLngs.length > 1) {
    L.polyline(latLngs, {
      pane: "routePane",
      interactive: false,
      color: "#ffffff",
      weight: 9,
      opacity: 0.88
    }).addTo(routeLayer);

    L.polyline(latLngs, {
      pane: "routePane",
      interactive: false,
      color: "#f97316",
      weight: 5,
      opacity: 0.98
    }).addTo(routeLayer);
  } else if (Number.isFinite(Number(clean[0].track))) {
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

    L.marker([endpoints.end.lat, endpoints.end.lon], {
      pane: "routePane",
      interactive: false,
      keyboard: false,
      icon: routeEndpointIcon("STOP", "end"),
      title: `Stop: ${endpoints.end.label || "potwierdzony punkt lądowania"}`
    }).addTo(routeLayer);
  }

  lastRouteBounds = L.latLngBounds(latLngs);
  if (options.fitMap !== false) {
    map.fitBounds(lastRouteBounds.pad(0.18), { maxZoom: latLngs.length === 1 ? 10 : 11 });
  }

  const suffix = latLngs.length === 1 ? "1 punkt + kierunek lotu" : `${latLngs.length} punktów`;
  const endpointText = endpoints?.start && endpoints?.end
    ? ` Start ${endpoints.start.label}; stop ${endpoints.end.label}.`
    : " Bez potwierdzonego startu i lądowania — nie pokazuję znaczników START/STOP.";
  setRouteSummary(`${label}: ${suffix}.${endpointText}`);
}

function clearRoute() {
  if (routeLayer) routeLayer.clearLayers();
  lastRouteBounds = null;
  setRouteSummary("Mapa wyczyszczona.");
}

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
    allowProxy: false
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

function aircraftPhaseMarkup(aircraft) {
  const phase = aircraftFlightPhase(aircraft);
  const group = aircraftTypeGroup(aircraft || {});
  return `<span class="phase-plane phase-${phase.css}" style="--phase-angle:${phase.angle}deg">${aircraftSvgMarkup(group)}</span>`;
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

function firstTimeValue(...values) {
  for (const value of values) {
    if (value === undefined || value === null || value === "") continue;
    if (typeof value === "number" && Number.isFinite(value)) {
      const date = new Date(value > 10_000_000_000 ? value : value * 1000);
      if (!Number.isNaN(date.getTime())) return date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
    }
    const text = String(value).trim();
    if (!text) continue;
    const date = new Date(text);
    if (!Number.isNaN(date.getTime())) return date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
    return text;
  }
  return "brak danych";
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

function renderAircraftDetailsPanel(aircraft) {
  if (!aircraftSheetMorePanel) return;
  aircraftSheetMorePanel.replaceChildren();
  for (const [name, value] of aircraftDetailsRows(aircraft)) {
    const row = document.createElement("div");
    row.className = "detail-row";
    const valueElement = createTextElement("strong", "detail-value", value);
    if (["Callsign", "HEX", "Rejestracja", "Pozycja"].includes(name)) {
      enableCopyableAircraftValue(valueElement, value, name);
    }
    row.append(createTextElement("span", "detail-name", name), valueElement);
    aircraftSheetMorePanel.append(row);
  }
}

function setAircraftDetailsVisible(visible) {
  if (!aircraftSheet || !aircraftSheetMorePanel) return;
  aircraftSheetMorePanel.hidden = !visible;
  aircraftSheet.classList.toggle("is-expanded", visible);
  if (aircraftSheetRoute) aircraftSheetRoute.textContent = visible ? "Ukryj szczegóły" : "Szczegóły";
  if (visible) {
    invalidateMapSoon();
    window.setTimeout(() => aircraftSheetMorePanel.scrollIntoView({ block: "nearest", behavior: "smooth" }), 80);
  }
}

function showSelectedAircraftSheet(aircraft) {
  if (!aircraftSheet || !aircraft) return;
  selectedAircraft = aircraft;
  const label = aircraftLabel(aircraft);
  const type = firstFilled(aircraft?.t, aircraft?.type, aircraft?.aircraftType, aircraftKind(aircraft), aircraftGroupLabel(aircraftTypeGroup(aircraft)));
  const route = routePartsForDisplay(aircraft);
  const phase = aircraftFlightPhase(aircraft);

  if (aircraftSheetCallsign) aircraftSheetCallsign.textContent = label;
  if (aircraftSheetType) aircraftSheetType.textContent = type || "brak danych";
  if (aircraftSheetOperator) aircraftSheetOperator.textContent = airlineGuessFromCallsign(aircraft);
  if (aircraftSheetRouteFrom) aircraftSheetRouteFrom.textContent = route.from;
  if (aircraftSheetRouteTo) aircraftSheetRouteTo.textContent = route.to;
  if (aircraftSheetRouteCaption) aircraftSheetRouteCaption.textContent = route.caption;
  if (aircraftSheetAltitude) aircraftSheetAltitude.textContent = formatAltitude(aircraft?.alt_baro);
  if (aircraftSheetSpeed) aircraftSheetSpeed.textContent = formatSpeed(aircraft?.gs);
  if (aircraftSheetRegistration) aircraftSheetRegistration.textContent = firstFilled(aircraft?.r, aircraft?.registration, normalizeIcao(aircraft?.hex || "").toUpperCase(), "brak danych");
  if (aircraftSheetPhaseIcon) aircraftSheetPhaseIcon.innerHTML = aircraftPhaseMarkup(aircraft);
  if (aircraftSheetPhaseText) aircraftSheetPhaseText.textContent = `${phase.label} • ${phase.detail}`;
  updateAircraftSheetLiveDetails(aircraft);
  if (aircraftSheetPhoto) setAircraftPhoto(aircraftSheetPhoto, aircraft, { realPhoto: true });

  if (aircraftSheetMorePanel) renderAircraftDetailsPanel(aircraft);
  setAircraftDetailsVisible(false);
  aircraftSheet.hidden = false;
  aircraftSheet.classList.remove("is-expanded", "is-dragging");
  aircraftSheet.style.removeProperty("--sheet-drag-y");
  aircraftSheet.classList.add("is-open");
}

function hideSelectedAircraftSheet() {
  if (!aircraftSheet) return;
  aircraftSheet.classList.remove("is-open", "is-expanded", "is-dragging");
  aircraftSheet.style.removeProperty("--sheet-drag-y");
  window.setTimeout(() => { if (!aircraftSheet.classList.contains("is-open")) aircraftSheet.hidden = true; }, 160);
}

function selectedAircraftShareText(aircraft) {
  const route = routeInfoFromAircraft(aircraft);
  return [
    aircraftLabel(aircraft),
    route.short ? `Trasa: ${route.short}` : "Trasa: brak danych",
    `Typ: ${firstFilled(aircraft?.t, aircraft?.type, aircraft?.aircraftType, "brak danych")}`,
    `Rejestracja: ${firstFilled(aircraft?.r, aircraft?.registration, "brak danych")}`,
    `Wysokość: ${formatAltitude(aircraft?.alt_baro)}`,
    `Prędkość: ${formatSpeed(aircraft?.gs)}`,
    `Kurs: ${formatHeading(aircraftHeading(aircraft))}`
  ].join("\n");
}

function openAircraftQuickPopup(marker, aircraft) {
  if (!map || window.matchMedia?.("(max-width: 760px)")?.matches) return;
  L.popup({ maxWidth: 245, autoPan: true, keepInView: true })
    .setLatLng(marker.getLatLng())
    .setContent(aircraftPopupContent(aircraft))
    .openOn(map);
}

function aircraftPopupContent(aircraft) {
  const wrapper = document.createElement("div");
  wrapper.className = "map-popup";
  const phase = aircraftFlightPhase(aircraft);

  const head = document.createElement("div");
  head.className = "map-popup-head";
  const titleBlock = document.createElement("div");
  titleBlock.className = "map-popup-title-block";
  titleBlock.append(
    createTextElement("strong", "map-popup-title", aircraftLabel(aircraft)),
    createTextElement("span", "map-popup-type", firstFilled(aircraft?.t, aircraft?.type, aircraft?.aircraftType, aircraftGroupLabel(aircraftTypeGroup(aircraft))))
  );
  const phaseNode = document.createElement("div");
  phaseNode.className = "map-popup-phase";
  phaseNode.innerHTML = aircraftPhaseMarkup(aircraft);
  phaseNode.append(createTextElement("span", "map-popup-phase-text", phase.label));
  head.append(titleBlock, phaseNode);

  const photo = createAircraftPhoto(aircraft, "map-popup-photo", { realPhoto: true });
  const route = routePartsForDisplay(aircraft);
  const routeGrid = document.createElement("div");
  routeGrid.className = "map-popup-route-grid";
  routeGrid.append(
    createTextElement("strong", "route-code", route.from),
    createTextElement("span", "route-plane", "✈"),
    createTextElement("strong", "route-code", route.to)
  );

  const popupHex = normalizeIcao(firstFilled(aircraft?.hex, aircraft?.icao, aircraft?.icao24)).toUpperCase() || "brak danych";
  const popupHexRow = createTextElement("span", "map-popup-hex copyable-aircraft-value", `# ${popupHex}`);
  enableCopyableAircraftValue(popupHexRow, popupHex, "HEX / #");

  const metrics = document.createElement("div");
  metrics.className = "map-popup-metrics";
  metrics.append(
    metricCard("Wys.", formatAltitude(aircraft?.alt_baro)),
    metricCard("Pręd.", formatSpeed(aircraft?.gs)),
    metricCard("Kurs", formatHeading(aircraftHeading(aircraft))),
    metricCard("Dane", aircraftFreshnessInfo(aircraft).label)
  );

  wrapper.append(
    head,
    photo,
    routeGrid,
    popupHexRow,
    createTextElement("span", "map-popup-route", route.caption),
    metrics,
    createTextElement("span", "map-popup-meta", `${phase.label} • ${phase.detail}`)
  );

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = "primary-button popup-save-button";
  saveButton.textContent = "Zapisz";
  saveButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    upsertFlight(aircraftToFlight(aircraft));
    showToast("Samolot zapisany.");
  });
  wrapper.append(saveButton);

  return wrapper;
}

function metricCard(label, value) {
  const card = document.createElement("div");
  card.className = "metric-card";
  card.append(createTextElement("span", "metric-label", label), createTextElement("strong", "metric-value", value));
  return card;
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
  renderWatchlist();
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

function addWatchFromCurrentInput() {
  try {
    const raw = icaoInput.value.trim();
    if (!raw) throw new Error("Wpisz samolot w polu Szukaj albo wybierz go na mapie.");
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
    setAircraftPhoto(node.querySelector(".flight-thumb"), flight);
    node.querySelector(".flight-name").textContent = item.name || item.callsign || flight.icao.toUpperCase();
    const metaParts = [
      live ? "LIVE" : "poza mapą",
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

async function exportFlightHistory() {
  const items = loadFlightHistory();
  if (!items.length) {
    showToast("Historia jest pusta.");
    return;
  }
  const rows = items.map((item) => {
    const flight = historyItemToFlight(item);
    return [
      historyTimeText(item.lastSeenAt),
      flight.name,
      flight.icao,
      flight.callsign,
      flight.registration,
      flight.type,
      flight.lat,
      flight.lon,
      flight.altitude,
      flight.speed,
      item.reason,
      buildAdsbUrl(flight)
    ].map((value) => String(value || "").replace(/;/g, ",")).join(";");
  });
  await copyText(["czas;nazwa;icao;callsign;rejestracja;typ;lat;lon;wysokosc;predkosc;powod;link_ads", ...rows].join("\n"));
  showToast("Historia skopiowana jako CSV.");
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

function aircraftToFlight(aircraft) {
  const point = pointFromAircraft(aircraft);
  const route = routeInfoFromAircraft(aircraft);
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${firstFilled(aircraft.hex, aircraft.icao)}`,
    icao: normalizeIcao(firstFilled(aircraft.hex, aircraft.icao)),
    name: aircraftLabel(aircraft),
    date: todayLocalDate(),
    zoom: zoomInput.value.trim() || "9.2",
    lat: point ? String(point.lat) : browseLatInput.value.trim(),
    lon: point ? String(point.lon) : browseLonInput.value.trim(),
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

function openFlightInAds(flight) {
  const cleanIcao = normalizeIcao(flight?.icao || flight?.hex || "");
  if (!isValidIcao(cleanIcao)) {
    showToast("Brak kodu ICAO/hex dla tego samolotu.");
    return;
  }
  window.open(buildAdsbUrl({
    ...flight,
    icao: cleanIcao,
    date: flight?.date || todayLocalDate(),
    zoom: flight?.zoom || zoomInput?.value?.trim?.() || "9.2"
  }), "_blank", "noopener");
}

function openAircraftInAds(aircraft) {
  if (!aircraft) {
    showToast("Najpierw wybierz samolot.");
    return;
  }
  openFlightInAds(aircraftToFlight(aircraft));
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

function mergeFlightRouteIntoAircraft(aircraft, flight) {
  if (!aircraft || !flight) return aircraft;
  const routeShort = flight.routeShort || "";
  if (!aircraft._route && (routeShort || flight.routeVerbose)) {
    aircraft._route = {
      from: routeShort.split("→")?.[0]?.trim?.() || "",
      to: routeShort.split("→")?.slice?.(1)?.join?.("→")?.trim?.() || "",
      verbose: flight.routeVerbose || routeShort
    };
  }
  if (!aircraft.registration && flight.registration) aircraft.registration = flight.registration;
  if (!aircraft.r && flight.registration) aircraft.r = flight.registration;
  if (!aircraft.t && flight.type) aircraft.t = flight.type;
  if (!aircraft.flight && flight.callsign) aircraft.flight = flight.callsign;
  return aircraft;
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

function normalizeRouteResult(route, callsign = "") {
  if (!route || typeof route !== "object") return null;
  const airports = routeAirports(route);
  if (airports.length >= 2) {
    return {
      ...route,
      callsign: normalizeCallsign(route.callsign || route.flight || callsign),
      _airports: airports,
      confirmed: route.confirmed !== false
    };
  }

  const from = firstRouteValue(
    route.from,
    route.origin,
    route.departure,
    route.dep,
    route.fromAirport,
    route.originAirport,
    route.departureAirport,
    route?.flightroute?.origin?.iata_code,
    route?.flightroute?.origin?.icao_code,
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
    route?.flightroute?.destination?.iata_code,
    route?.flightroute?.destination?.icao_code,
    route?.response?.flightroute?.destination?.iata_code,
    route?.response?.flightroute?.destination?.icao_code
  );
  if (!from || !to) return null;

  const originName = firstRouteValue(
    route?.flightroute?.origin?.name,
    route?.flightroute?.origin?.municipality,
    route?.response?.flightroute?.origin?.name,
    route?.response?.flightroute?.origin?.municipality
  );
  const destName = firstRouteValue(
    route?.flightroute?.destination?.name,
    route?.flightroute?.destination?.municipality,
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

function saveTrackPoints(icao, date, points) {
  const tracks = loadTracks();
  tracks[trackKey(icao, date)] = points.slice(-MAX_TRACK_POINTS);
  storageJsonSet(TRACK_STORAGE_KEY, pruneTrackCache(tracks));
}

function addTrackPoint(icao, date, point) {
  if (!validPoint(point)) return loadTrackPoints(icao, date);
  const points = loadTrackPoints(icao, date);
  const previous = points[points.length - 1];
  const moved = !previous || Math.abs(previous.lat - point.lat) > 0.0005 || Math.abs(previous.lon - point.lon) > 0.0005;
  if (moved) {
    points.push(point);
    saveTrackPoints(icao, date, points);
  }
  return points;
}

function setAircraftStatus(message) {
  if (aircraftStatus) aircraftStatus.textContent = message;
  updateStatusPanel(message, String(message || "").toLowerCase().includes("błąd") || String(message || "").toLowerCase().includes("nie uda") ? "error" : "info");
}

function syncBrowseInputsFromMapCenter() {
  initMap();
  if (!map || !browseLatInput || !browseLonInput) return false;
  const center = map.getCenter?.();
  if (!center || !Number.isFinite(center.lat) || !Number.isFinite(center.lng)) return false;
  browseLatInput.value = center.lat.toFixed(5);
  browseLonInput.value = center.lng.toFixed(5);
  return true;
}

function readBrowseSettings() {
  const source = selectedApiSource();
  const apiKey = apiKeyInput.value.trim();
  const lat = Number.parseFloat(browseLatInput.value.replace(",", "."));
  const lon = Number.parseFloat(browseLonInput.value.replace(",", "."));
  const dist = Number.parseInt(browseDistInput.value, 10);

  if (source.requiresKey && !apiKey) throw new Error("To źródło wymaga klucza API.");
  if (!Number.isFinite(lat) || lat < -90 || lat > 90) throw new Error("Wpisz poprawną szerokość.");
  if (!Number.isFinite(lon) || lon < -180 || lon > 180) throw new Error("Wpisz poprawną długość.");
  if (!Number.isFinite(dist) || dist < 1 || dist > 250) throw new Error("Promień musi być od 1 do 250 NM.");

  return {
    apiKey,
    apiBase: validatedApiBase(apiBaseInput.value),
    sourceName: dataSourceInput.value,
    lat,
    lon,
    dist
  };
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
  if (routeLayer && routeSummary?.textContent) drawSelectedAircraftRoute(updated, { fitMap: false });
  if (aircraftSheet?.classList.contains("is-open")) {
    if (aircraftSheetAltitude) aircraftSheetAltitude.textContent = formatAltitude(updated?.alt_baro);
    if (aircraftSheetSpeed) aircraftSheetSpeed.textContent = formatSpeed(updated?.gs);
    if (aircraftSheetPhaseText) {
      const phase = aircraftFlightPhase(updated);
      aircraftSheetPhaseText.textContent = `${phase.label} • ${phase.detail}`;
    }
    if (aircraftSheetPhaseIcon) aircraftSheetPhaseIcon.innerHTML = aircraftPhaseMarkup(updated);
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
  const cleanIcao = aircraftIcao(selectedAircraft);
  if (!isValidIcao(cleanIcao)) return;
  try {
    const updated = await fetchAircraftByHex(cleanIcao, { preferCache: false, fallbackAllSources: false, timeoutMs: HEX_FETCH_TIMEOUT_MS, allowProxy: false });
    if (!updated) return;
    applyCachedRoutesToAircraft([updated]);
    selectedAircraft = updated;
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
    setAircraftStatus(`Auto-odświeżenie: ${aircraftFilterSummary(result.aircraft.length, visibleAircraft.length)}. Źródło: ${result.sourceName}.`);
    enrichAircraftRoutesInBackground(result.aircraft, result.candidate, result.sourceName);
  } catch (error) {
    setAircraftStatus(`Auto-odświeżenie nieudane: ${explainFetchError(error)}.`);
  } finally {
    aircraftRefreshInProgress = false;
  }
}

async function loadAircraft() {
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
  const freshnessHtml = performance.showFreshnessLabels ? `<span class="plane-freshness freshness-${freshness.state}">${escapeHtml(freshness.label)}</span>` : "";
  return L.divIcon({
    className: `aircraft-div-icon aircraft-kind-${group} aircraft-freshness-${freshness.state} aircraft-lifecycle-${lifecycle}`,
    iconSize: [dimensions.width, dimensions.height],
    iconAnchor: [dimensions.anchorX, dimensions.anchorY],
    popupAnchor: [0, -Math.round(dimensions.height / 2)],
    html: `
      <div class="plane-marker-wrap aircraft-kind-${group}" title="${escapeHtml(typeTitle)}">
        <div class="plane-marker${special}" style="--heading:${heading}deg; --plane-svg-width:${dimensions.svgWidth}px; --plane-svg-height:${dimensions.svgHeight}px;">
          ${aircraftSvgMarkup(group)}
        </div>
        <span class="plane-label">${escapedLabel}</span>
        ${freshnessHtml}
      </div>`
  });
}



function aircraftIcao(aircraft) {
  return normalizeIcao(aircraft?.hex || aircraft?.icao || aircraft?.icao24 || "");
}

function findAircraftByIcaoInCache(icao, source = lastAircraftCache) {
  const cleanIcao = normalizeIcao(icao);
  if (!isValidIcao(cleanIcao)) return null;
  return (source || []).find((item) => aircraftIcao(item) === cleanIcao) || null;
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
    closeDrawerPanel();
    savedMapFocusActive = false;
    drawSelectedAircraftRoute(aircraft, { fitMap: false });
    showSelectedAircraftSheet(aircraft);
  });
  return marker;
}

function focusAircraftOnMap(aircraft, options = {}) {
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

function drawSelectedAircraftRoute(aircraft, options = {}) {
  const flight = aircraftToFlight(aircraft);
  fillForm(flight);

  const point = pointFromAircraft(aircraft);
  let points = [];
  const confirmedEndpoints = confirmedRouteEndpointPoints(aircraft);

  if (confirmedEndpoints) {
    points = point ? [confirmedEndpoints.start, point, confirmedEndpoints.end] : [confirmedEndpoints.start, confirmedEndpoints.end];
    drawRoute(points, `${aircraftLabel(aircraft)} • ${routeText(aircraft)}`, {
      endpoints: confirmedEndpoints,
      fitMap: options.fitMap === true
    });
    setRouteSummary(`${aircraftLabel(aircraft)}: pokazuję potwierdzony START i STOP oraz aktualną pozycję wybranego samolotu.`);
    return;
  }

  if (point) {
    points = addTrackPoint(flight.icao, flight.date, point);
  }

  if (!points.length && point) points = [point];

  if (points.length) {
    drawRoute(points, `${aircraftLabel(aircraft)} • ślad live`, {
      fitMap: options.fitMap === true,
      showCurrentMarker: points.length === 1
    });
    if (points.length === 1) {
      setRouteSummary(`${aircraftLabel(aircraft)}: brak potwierdzonego startu i lądowania. Pokazuję aktualny punkt i kierunek tylko dla wybranego samolotu.`);
    } else {
      setRouteSummary(`${aircraftLabel(aircraft)}: brak potwierdzonego startu i lądowania. Pokazuję wyraźny ślad live budowany od uruchomienia programu.`);
    }
    return;
  }

  clearRoute();
  setRouteSummary(`${aircraftLabel(aircraft)}: brak pozycji do narysowania trasy.`);
}

function clearAircraftMap() {
  initMap();
  if (aircraftLayer) aircraftLayer.clearLayers();
  if (trailLayer) trailLayer.clearLayers();
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
    const points = Array.isArray(tracks[key]) ? tracks[key] : [];
    const previous = points[points.length - 1];
    const moved = !previous || Math.abs(previous.lat - point.lat) > 0.0005 || Math.abs(previous.lon - point.lon) > 0.0005;
    if (moved) {
      points.push(point);
      tracks[key] = points.slice(-MAX_TRACK_POINTS);
      changed = true;
    }
    result.push({ icao, points: (tracks[key] || points).filter(validPoint).slice(-performance.trackPoints) });
  }

  if (changed) storageJsonSet(TRACK_STORAGE_KEY, pruneTrackCache(tracks));
  return result;
}

function drawVisibleAircraftTracks(aircraft) {
  if (!trailLayer) return;
  trailLayer.clearLayers();
  // Ślady wszystkich samolotów są nadal zapisywane w pamięci sesji,
  // ale na mapie rysujemy wyłącznie ścieżkę wybranego samolotu.
  visibleTrackSets(aircraft);
}

function renderAircraftMap(aircraft, settings = {}, options = {}) {
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

  if (bounds.length && !lastRouteBounds && !options.preserveView) {
    map.fitBounds(L.latLngBounds(bounds).pad(0.18), { maxZoom: Math.max(8, Number(settings.dist) > 60 ? 8 : 10) });
  }
}

function renderAircraft(aircraft, settings) {
  aircraftList.replaceChildren();
  const performance = readPerformanceSettings();
  const visibleAircraft = filterAircraftForDisplay(aircraft).slice(0, performance.listLimit);
  const fragment = document.createDocumentFragment();

  for (const item of visibleAircraft) {
    const node = aircraftTemplate.content.firstElementChild.cloneNode(true);
    setAircraftPhoto(node.querySelector(".aircraft-thumb"), item, { realPhoto: false, compact: true });
    node.querySelector(".aircraft-title").textContent = aircraftLabel(item);
    const textBlock = node.querySelector(".aircraft-text-block");
    const titleNode = node.querySelector(".aircraft-title");
    const freshnessBadge = document.createElement("span");
    setFreshnessBadge(freshnessBadge, item, true);
    freshnessBadge.classList.add("aircraft-list-freshness");
    titleNode?.insertAdjacentElement("afterend", freshnessBadge);
    node.dataset.freshness = aircraftFreshnessInfo(item).state;
    node.dataset.lifecycle = aircraftLifecycleState(item);
    node.querySelector(".aircraft-meta").textContent = aircraftMeta(item);
    const routeNode = node.querySelector(".aircraft-route");
    if (routeNode) routeNode.textContent = routeText(item);
    const extraNode = node.querySelector(".aircraft-extra");
    if (extraNode) extraNode.textContent = aircraftExtraMeta(item);
    node.querySelector(".aircraft-pick").addEventListener("click", () => {
      savedMapFocusActive = false;
      focusAircraftOnMap(item, { singleMarker: false, showSheet: true });
      showToast("Wybrano samolot.");
    });
    node.querySelector(".aircraft-map").addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      savedMapFocusActive = false;
      focusAircraftOnMap(item, { singleMarker: false, showSheet: true });
    });
    node.querySelector(".aircraft-ads").addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      selectedAircraft = item;
      openAircraftInAds(item);
    });
    node.querySelector(".aircraft-save").addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      upsertFlight(aircraftToFlight(item));
      showToast("Samolot zapisany.");
    });
    fragment.append(node);
  }
  aircraftList.append(fragment);
}

function readApiOnlySettings() {
  const source = selectedApiSource();
  const apiKey = apiKeyInput.value.trim();
  if (source.requiresKey && !apiKey) throw new Error("To źródło wymaga klucza API.");
  return {
    apiKey,
    apiBase: validatedApiBase(apiBaseInput.value),
    sourceName: dataSourceInput.value
  };
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

function tracePointsFromData(data) {
  if (!data || !Array.isArray(data.trace)) return [];
  const base = Number(data.timestamp || 0);
  return data.trace
    .map((row) => {
      const lat = Number(row[1]);
      const lon = Number(row[2]);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
      return {
        lat,
        lon,
        at: base ? new Date((base + Number(row[0] || 0)) * 1000).toISOString() : "",
        altitude: row[3] ?? null,
        speed: row[4] ?? null,
        track: row[5] ?? null
      };
    })
    .filter(Boolean);
}

async function loadOfficialTrace(flight) {
  const settings = readApiOnlySettings();
  if (settings.sourceName !== "adsbExchange") {
    throw new Error("Pełny historyczny ślad wymaga ADS-B Exchange API albo własnego źródła trace.");
  }
  const folder = flight.icao.slice(-2);
  const headers = { "Accept": "application/json" };
  if (settings.apiKey) headers["X-Api-Key"] = settings.apiKey;
  const prefixes = flight.date === todayLocalDate() ? ["trace_recent", "trace_full"] : ["trace_full", "trace_recent"];
  let lastError = null;

  for (const prefix of prefixes) {
    const file = `${prefix}_${flight.icao}.json`;
    const response = await fetchWithTimeout(`${settings.apiBase}/traces/${folder}/${file}`, { headers });
    if (response.ok) return tracePointsFromData(await response.json());
    lastError = new Error(`API śladu lotu zwróciło błąd ${response.status}.`);
  }

  throw lastError || new Error("Nie udało się pobrać śladu lotu.");
}

async function drawRouteForFlight(flight) {
  if (routeLayer) routeLayer.clearLayers();
  lastRouteBounds = null;
  let points = [];
  try {
    if (dataSourceInput.value === "adsbExchange" && apiKeyInput.value.trim()) {
      points = await loadOfficialTrace(flight);
      if (points.length) {
        saveTrackPoints(flight.icao, flight.date, points);
        drawRoute(points, flight.name || flight.icao.toUpperCase());
        if (flight.date !== todayLocalDate()) {
          setRouteSummary(`Uwaga: oficjalny trace API nie wybiera daty z linku ADS-B. ${routeSummary.textContent}`);
        }
        return;
      }
    }
  } catch (error) {
    showToast(error.message);
  }

  points = loadTrackPoints(flight.icao, flight.date);
  let fallbackMessage = "";
  if (!points.length) {
    const latestTrack = loadLatestTrackPoints(flight.icao);
    if (latestTrack.points.length) {
      points = latestTrack.points;
      fallbackMessage = `Nie mam lokalnego śladu z dnia ${flight.date}; pokażuje ślad z ${latestTrack.date}.`;
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
    if (looksLikeRegistration(raw) || cleanReg.includes("-")) endpointSets.push(buildRegistrationUrls(candidate, cleanReg));

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

function normalizeSearchText(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^A-Z0-9-]/g, "");
}

function aircraftSearchValues(aircraft) {
  return [
    aircraft?.hex,
    aircraft?.icao,
    aircraft?.flight,
    aircraft?.callsign,
    aircraft?.r,
    aircraft?.registration,
    aircraft?.t,
    aircraft?.type,
    aircraft?.aircraftType,
    aircraft?.name,
    aircraft?.routeShort,
    aircraft?.routeVerbose
  ].filter(Boolean).map(normalizeSearchText).filter(Boolean);
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

  throw new Error("Nie rozpoznałem wpisu. Wpisz 6-znakowy hex albo najpierw pobierz samoloty, żeby program mógł znaleźć nazwę/callsign.");
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
  icaoInput.value = displayName;
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
    setAircraftPhoto(node.querySelector(".flight-thumb"), flight);
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

function enableCopyableAircraftValue(element, value, label = "wartość") {
  if (!element) return;
  const text = String(value ?? "").trim();
  if (!text || text === "brak danych") {
    element.classList.remove("copyable-aircraft-value");
    delete element.dataset.copyValue;
    element.removeAttribute("title");
    return;
  }
  element.classList.add("copyable-aircraft-value");
  element.dataset.copyValue = text;
  element.title = `Kliknij, aby skopiować ${label}: ${text}`;
}

function hasActiveTextSelection() {
  const selection = window.getSelection?.();
  return Boolean(selection && !selection.isCollapsed && String(selection).trim());
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const helper = document.createElement("textarea");
  helper.value = value;
  helper.style.position = "fixed";
  helper.style.opacity = "0";
  document.body.append(helper);
  helper.select();
  document.execCommand("copy");
  helper.remove();
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
      clearManualSearchInputLock();
      fillForm(aircraftToFlight(aircraft), { force: true });
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
    lastAircraftCache = [aircraft, ...lastAircraftCache.filter((item) => aircraftIcao(item) !== cleanIcao)];
    updateWatchlistFromAircraft(lastAircraftCache);
    recordAircraftHistory([aircraft]);
    checkAircraftAlerts([aircraft]);
    clearManualSearchInputLock();
    fillForm(aircraftToFlight(aircraft), { force: true });
    focusAircraftOnMap(aircraft, { singleMarker: !findAircraftByIcaoInCache(cleanIcao), showSheet: true, centerMap: true, fitMap: false, zoom: 10 });
    showToast("Znaleziono samolot i przeniesiono mapę do jego pozycji.", 4200);
  } catch (error) {
    icaoInput.value = originalValue;
    markManualSearchInput(originalValue);
    setAircraftStatus(`Nie znaleziono samolotu: ${raw}. ${explainFetchError(error)}.`);
    showToast(`Nie znaleziono samolotu: ${raw}`, 5200);
  } finally {
    finishBusy();
  }
}

savedSearchInput?.addEventListener("input", renderFlights);
historySearchInput?.addEventListener("input", renderFlightHistory);
exportHistoryButton?.addEventListener("click", exportFlightHistory);
clearHistoryButton?.addEventListener("click", () => {
  if (!loadFlightHistory().length) return;
  if (!confirm("Wyczyścić całą historię przelotów?")) return;
  saveFlightHistory([]);
  renderFlightHistory();
  showToast("Historia przelotów wyczyszczona.");
});
addCurrentWatchButton?.addEventListener("click", addWatchFromCurrentInput);
clearWatchButton?.addEventListener("click", () => {
  if (!loadWatchlist().length) return;
  if (!confirm("Usunąć wszystkie obserwowane samoloty?")) return;
  saveWatchlist([]);
  saveFiredAlertState({});
  renderWatchlist();
  showToast("Lista obserwowanych wyczyszczona.");
});
saveAlertSettingsButton?.addEventListener("click", saveAlertSettingsFromForm);
requestNotificationsButton?.addEventListener("click", async () => {
  const permission = await ensureNotificationPermission();
  if (permission === "unsupported") {
    showToast("Ta przeglądarka nie obsługuje powiadomień systemowych.", 4200);
    return;
  }
  if (alertSystemInput) alertSystemInput.checked = permission === "granted";
  saveAlertSettingsObject(readAlertSettingsFromForm());
  updateAlertStatusText(permission === "granted" ? "Powiadomienia systemowe włączone." : "Brak zgody na powiadomienia systemowe.");
  showToast(permission === "granted" ? "Powiadomienia systemowe włączone." : "Brak zgody na powiadomienia systemowe.", 4200);
});
testAlertsButton?.addEventListener("click", () => checkAircraftAlerts(lastAircraftCache, { force: true, toastIfEmpty: true }));
clearAlertLogButton?.addEventListener("click", () => {
  saveAlertLog([]);
  renderAlertLog();
  showToast("Log alertów wyczyszczony.");
});
[alertsEnabledInput, alertWatchedInput, alertSpecialInput, alertSystemInput].filter(Boolean).forEach((element) => {
  element.addEventListener("change", saveAlertSettingsFromForm);
});
[alertQueryInput, alertDistanceKmInput, alertMaxAltitudeInput].filter(Boolean).forEach((element) => {
  element.addEventListener("change", saveAlertSettingsFromForm);
});

icaoInput.addEventListener("input", () => {
  markManualSearchInput(icaoInput.value);
  if (icaoInput.value.trim() !== nameInput.value.trim()) {
    delete icaoInput.dataset.resolvedIcao;
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchAircraftFromInput();
});

saveFlightButton?.addEventListener("click", saveFlightFromForm);
searchAircraftButton?.addEventListener("click", (event) => {
  event.preventDefault();
  searchAircraftFromInput();
});

document.querySelector("#openPreviewButton").addEventListener("click", () => {
  try {
    window.open(buildAdsbUrl(readFormFlight()), "_blank", "noopener");
  } catch (error) {
    showToast(error.message);
  }
});

document.querySelector("#drawRouteButton").addEventListener("click", drawRouteFromForm);
document.querySelector("#fitMapButton").addEventListener("click", () => {
  initMap();
  if (!map) return;
  const point = selectedAircraft ? pointFromAircraft(selectedAircraft) : null;
  if (point) {
    focusAircraftOnMap(selectedAircraft, { singleMarker: false, showSheet: true, drawRoute: true, centerMap: true, fitMap: false });
    return;
  }
  if (lastRouteBounds) map.fitBounds(lastRouteBounds.pad(0.18), { maxZoom: 11 });
});
document.querySelector("#clearRouteButton").addEventListener("click", clearRoute);

document.querySelector("#pasteButton").addEventListener("click", async () => {
  try {
    const text = await navigator.clipboard.readText();
    const parsed = parseFlightText(text);
    if (!parsed) throw new Error("W schowku nie ma kodu ICAO.");
    clearManualSearchInputLock();
    fillForm(parsed, { force: true });
    showToast("Wklejono dane.");
  } catch (error) {
    showToast(error.message || "Nie udało się wkleić.");
  }
});

document.querySelector("#readImportButton").addEventListener("click", importFromText);
document.querySelector("#clearImportButton").addEventListener("click", () => {
  importText.value = "";
});

document.querySelector("#exportButton").addEventListener("click", async () => {
  const flights = loadFlights();
  if (!flights.length) {
    showToast("Nie ma czego eksportować.");
    return;
  }

  const rows = flights.map((flight) => `${flight.name};${flight.icao};${flight.date};${buildAdsbUrl(flight)}`);
  await copyText(["nazwa;icao;data;link", ...rows].join("\n"));
  showToast("Eksport skopiowany.");
});

document.querySelector("#clearAllButton").addEventListener("click", async () => {
  if (!loadFlights().length) return;
  if (!confirm("Usunąć wszystkie zapisane loty?")) return;
  await clearSavedFlights();
});

document.querySelector("#saveApiKeyButton").addEventListener("click", () => {
  try {
    const apiBase = validatedApiBase(apiBaseInput.value);
    storageSet(DATA_SOURCE_STORAGE_KEY, dataSourceInput.value);
    storageSet(API_KEY_STORAGE_KEY, apiKeyInput.value.trim());
    storageSet(API_BASE_STORAGE_KEY, apiBase);
    markFirestoreStateSectionDirty("api");
    apiBaseInput.value = apiBase;
    showToast(persistentStorageAvailable ? "Ustawienia zapisane lokalnie." : "Zapis jest tylko tymczasowy w trybie pliku.");
  } catch (error) {
    showToast(error.message);
  }
});

themeInput.addEventListener("change", () => {
  applyTheme(themeInput.value);
  markFirestoreStateSectionDirty("theme");
});

dataSourceInput.addEventListener("change", () => {
  syncApiBaseFromSource();
});

firestoreSettingsButton?.addEventListener("click", () => openFirestoreSetupModal(false));
firestoreSyncNowButton?.addEventListener("click", () => syncFirestoreNow({ silent: false }));
firestoreDisableButton?.addEventListener("click", async () => {
  if (!confirm("Wyłączyć synchronizację Firestore na tym urządzeniu? Zapisane samoloty lokalne zostaną.")) return;
  await resetFirestoreConnection();
  saveFirestoreConfig({ enabled: false });
  storageSet(FIRESTORE_SETUP_DISMISSED_KEY, "1");
  setFirestoreStatus("Synchronizacja Firestore wyłączona.", "info");
});

firestoreParseConfigButton?.addEventListener("click", () => {
  const parsed = parseFirebaseConfigText(firestoreConfigPaste?.value || "");
  if (applyParsedFirebaseConfigToForm(parsed)) {
    setFirestoreStatus("Odczytano konfigurację. Sprawdź pola i zapisz.", "ok");
  } else {
    setFirestoreStatus("Nie znalazłem poprawnego obiektu firebaseConfig.", "error");
  }
});

firestoreConfigPaste?.addEventListener("input", () => {
  const parsed = parseFirebaseConfigText(firestoreConfigPaste.value);
  applyParsedFirebaseConfigToForm(parsed);
});

firestoreSaveConfigButton?.addEventListener("click", async () => {
  try {
    const config = firestoreConfigFromForm();
    saveFirestoreConfig(config);
    setFirestoreStatus("Konfiguracja zapisana. Łączę z Firestore...", "busy");
    await initFirestoreSync({ silent: false });
    closeFirestoreSetupModal();
  } catch (error) {
    setFirestoreStatus(error.message || "Nie udało się zapisać konfiguracji.", "error");
  }
});

firestoreSkipConfigButton?.addEventListener("click", () => {
  storageSet(FIRESTORE_SETUP_DISMISSED_KEY, "1");
  closeFirestoreSetupModal();
  setFirestoreStatus("Konfiguracja Firestore pominięta. Możesz ją włączyć później w ustawieniach.", "info");
});

firestoreCloseConfigButton?.addEventListener("click", () => {
  closeFirestoreSetupModal();
});

firestoreSetupModal?.addEventListener("click", (event) => {
  if (event.target === firestoreSetupModal) closeFirestoreSetupModal();
});

[aircraftFilterKindInput, aircraftFilterMinAltInput, aircraftFilterMaxAltInput, aircraftFilterCallsignInput]
  .filter(Boolean)
  .forEach((element) => element.addEventListener("change", rerenderAircraftFromCache));

resetAircraftFiltersButton?.addEventListener("click", () => {
  if (aircraftFilterKindInput) aircraftFilterKindInput.value = "all";
  if (aircraftFilterMinAltInput) aircraftFilterMinAltInput.value = "";
  if (aircraftFilterMaxAltInput) aircraftFilterMaxAltInput.value = "";
  if (aircraftFilterCallsignInput) aircraftFilterCallsignInput.checked = false;
  rerenderAircraftFromCache();
});

function applyPerformanceSettingsAndRerender(message = "Ustawienia wydajności zapisane.") {
  savePerformanceSettings();
  restartAircraftAutoRefresh();
  if (lastAircraftCache.length) {
    const visibleAircraft = filterAircraftForDisplay(lastAircraftCache);
    renderAircraft(visibleAircraft, lastRenderSettings || readBrowseSettingsSafe());
    renderAircraftMap(visibleAircraft, lastRenderSettings || readBrowseSettingsSafe(), { preserveView: true });
    setAircraftStatus(`${message} Pokazuję ${aircraftFilterSummary(lastAircraftCache.length, visibleAircraft.length)}.`);
  } else {
    setAircraftStatus(message);
  }
}

performanceModeInput?.addEventListener("change", () => {
  applyPerformancePreset(performanceModeInput.value);
  applyPerformanceSettingsAndRerender("Zmieniono tryb wydajności.");
});
[performanceRefreshInput, performanceMapLimitInput, performanceListLimitInput, performanceRemoveAfterInput]
  .filter(Boolean)
  .forEach((element) => element.addEventListener("change", () => applyPerformanceSettingsAndRerender()));
[performanceTrailsInput, performanceFreshnessLabelsInput, performanceRealPhotosInput, performanceAutoHideStaleInput]
  .filter(Boolean)
  .forEach((element) => element.addEventListener("change", () => applyPerformanceSettingsAndRerender()));
resetPerformanceButton?.addEventListener("click", () => {
  if (performanceModeInput) performanceModeInput.value = "balanced";
  applyPerformancePreset("balanced");
  applyPerformanceSettingsAndRerender("Przywrócono domyślny tryb wydajności.");
});

document.querySelector("#loadAircraftButton").addEventListener("click", loadAircraft);
document.querySelector("#refreshAircraftButton").addEventListener("click", loadAircraft);

function geolocationErrorMessage(error) {
  if (error?.code === error?.PERMISSION_DENIED) return "Brak zgody na lokalizację w przeglądarce.";
  if (error?.code === error?.POSITION_UNAVAILABLE) return "Telefon nie zwrócił pozycji GPS / sieciowej.";
  if (error?.code === error?.TIMEOUT) return "Telefon zbyt długo ustalał lokalizację.";
  return "Nie udało się pobrać lokalizacji.";
}

function defaultBrowseRadius() {
  return AUTO_LOAD_RADIUS_NM;
}

function setDefaultBrowseRadius() {
  if (browseDistInput) browseDistInput.value = String(defaultBrowseRadius());
}

function browserLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 25000,
      maximumAge: 300000
    });
  });
}

function userLocationIcon() {
  return L.divIcon({
    className: "user-location-div-icon",
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    html: `<span class="user-location-pulse"></span><span class="user-location-dot"></span>`
  });
}

function drawUserLocation(position, options = {}) {
  initMap();
  if (!map || !window.L || !position?.coords) return false;

  const lat = Number(position.coords.latitude);
  const lon = Number(position.coords.longitude);
  const accuracy = Math.max(8, Math.min(2000, Number(position.coords.accuracy) || 0));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return false;

  if (!userLocationLayer) userLocationLayer = L.layerGroup().addTo(map);
  userLocationLayer.clearLayers();

  L.circle([lat, lon], {
    pane: "userPane",
    radius: accuracy,
    interactive: false,
    keyboard: false,
    color: "#2563eb",
    weight: 1.5,
    opacity: 0.55,
    fillColor: "#3b82f6",
    fillOpacity: 0.14
  }).addTo(userLocationLayer);

  L.marker([lat, lon], {
    pane: "userPane",
    interactive: false,
    keyboard: false,
    icon: userLocationIcon(),
    title: "Twoja lokalizacja"
  }).addTo(userLocationLayer);

  if (options.centerMap) {
    const currentZoom = Number(map.getZoom?.() || 0);
    map.setView([lat, lon], Math.max(currentZoom || 0, 13), { animate: true });
  }

  setRouteSummary(`Twoja lokalizacja: ${lat.toFixed(5)}, ${lon.toFixed(5)}. Dokładność około ${Math.round(accuracy)} m.`);
  return true;
}

function applyBrowserLocation(position, options = {}) {
  browseLatInput.value = position.coords.latitude.toFixed(5);
  browseLonInput.value = position.coords.longitude.toFixed(5);
  latInput.value = browseLatInput.value;
  lonInput.value = browseLonInput.value;
  drawUserLocation(position, { centerMap: options.centerMap === true });
}

async function locateUser({ autoLoad = false, startup = false, centerMap = false } = {}) {
  if (!navigator.geolocation) {
    const message = "Telefon lub przeglądarka nie udostępnia lokalizacji.";
    setAircraftStatus(message);
    showToast(message, 4200);
    return false;
  }

  const finishBusy = beginBusy(startup ? "Pobieram lokalizację przy starcie programu..." : "Pobieram lokalizację telefonu...");
  try {
    setAircraftStatus(startup ? "Przy pierwszym uruchomieniu przeglądarka zapyta o zgodę na lokalizację." : "Pobieram lokalizację telefonu...");
    const position = await browserLocation();
    applyBrowserLocation(position, { centerMap });
    setDefaultBrowseRadius();
    setAircraftStatus(`Lokalizacja wpisana automatycznie. Promień: ${defaultBrowseRadius()} NM. Dokładność: około ${Math.round(position.coords.accuracy || 0)} m.`);
    showToast(centerMap ? "Zlokalizowano Cię na mapie." : (startup ? "Lokalizacja pobrana automatycznie." : "Lokalizacja wpisana."));
  } catch (error) {
    const message = geolocationErrorMessage(error);
    setAircraftStatus(message);
    showToast(message, 5200);
    return false;
  } finally {
    finishBusy();
  }

  if (autoLoad) {
    await loadAircraft();
  }
  return true;
}

async function checkStartupPermissions() {
  if (!navigator.permissions?.query) return;
  try {
    const permission = await navigator.permissions.query({ name: "geolocation" });
    if (permission.state === "prompt") {
      setAircraftStatus("Za chwilę przeglądarka zapyta o zgodę na lokalizację. Bez niej automatyczne pobieranie samolotów nie ruszy.");
    } else if (permission.state === "denied") {
      setAircraftStatus("Lokalizacja jest zablokowana. Włącz zgodę w ustawieniach przeglądarki, żeby auto-start działał.");
    }
  } catch {
    // Nie każda przeglądarka obsługuje Permissions API dla geolokalizacji.
  }
}

async function startupAutoFlow() {
  if (startupAutoLoadInProgress) return;
  startupAutoLoadInProgress = true;
  setDefaultBrowseRadius();
  await checkStartupPermissions();
  await locateUser({ autoLoad: true, startup: true });
  startupAutoLoadInProgress = false;
}



for (const button of bottomNavButtons) {
  button.addEventListener("click", () => {
    if (button.dataset.moreToggle === "true") {
      toggleBottomMoreMenu();
      return;
    }
    const panelId = button.dataset.panel;
    if (!panelId) return;
    closeBottomMoreMenu();
    openDrawerPanel(panelId, button.dataset.title || button.textContent.trim() || "Panel");
  });
}

for (const button of bottomMoreButtons) {
  button.addEventListener("click", () => {
    const panelId = button.dataset.panel;
    if (!panelId) return;
    closeBottomMoreMenu({ keepActive: true });
    openDrawerPanel(panelId, button.dataset.title || button.textContent.trim() || "Panel");
  });
}


function isInsideFloatingUi(target) {
  return Boolean(target?.closest?.(".control-column, .aircraft-sheet, .bottom-nav, .bottom-more-menu, .map-floating-controls, .leaflet-marker-icon, .leaflet-control, .toast, .busy-overlay"));
}

document.addEventListener("pointerdown", (event) => {
  if (isInsideFloatingUi(event.target)) return;
  closeDrawerPanel();
  hideSelectedAircraftSheet();
  map?.closePopup?.();
});

function installBottomDrag(handle, panel, closeCallback) {
  if (!handle || !panel) return;
  let startY = 0;
  let lastDelta = 0;
  let dragging = false;

  const resetDrag = () => {
    dragging = false;
    lastDelta = 0;
    panel.classList.remove("is-dragging");
    panel.style.removeProperty("--sheet-drag-y");
  };

  handle.addEventListener("pointerdown", (event) => {
    if (!panel.classList.contains("is-open")) return;
    event.preventDefault();
    event.stopPropagation();
    startY = event.clientY;
    lastDelta = 0;
    dragging = true;
    panel.classList.add("is-dragging");
    handle.setPointerCapture?.(event.pointerId);
  });

  handle.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    event.preventDefault();
    event.stopPropagation();
    lastDelta = event.clientY - startY;
    if (lastDelta > 0) {
      panel.style.setProperty("--sheet-drag-y", `${Math.min(lastDelta, 360)}px`);
    } else {
      panel.style.setProperty("--sheet-drag-y", "0px");
    }
  });

  const finish = (event) => {
    if (!dragging) return;
    event?.preventDefault?.();
    event?.stopPropagation?.();
    const delta = lastDelta;
    resetDrag();
    if (delta > 70) {
      panel.classList.remove("is-expanded");
      closeCallback?.();
    } else if (delta < -45) {
      panel.classList.add("is-expanded");
      invalidateMapSoon();
    } else if (Math.abs(delta) <= 8) {
      // Krótkie dotknięcie uchwytu nie chowa i nie rozwija panelu przypadkowo.
      invalidateMapSoon();
    } else {
      panel.classList.toggle("is-expanded");
      invalidateMapSoon();
    }
  };

  handle.addEventListener("pointerup", finish);
  handle.addEventListener("pointercancel", finish);
}

installBottomDrag(aircraftSheetDragHandle, aircraftSheet, hideSelectedAircraftSheet);
installBottomDrag(drawerDragHandle, drawer, closeDrawerPanel);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDrawerPanel();
    hideSelectedAircraftSheet();
    map?.closePopup?.();
  }
});

document.querySelector("#locateButton").addEventListener("click", () => {
  savedMapFocusActive = false;
  locateUser({ autoLoad: false, startup: false, centerMap: true });
});
mapLocateButton?.addEventListener("click", () => {
  savedMapFocusActive = false;
  locateUser({ autoLoad: false, startup: false, centerMap: true });
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  updateInstallButtonVisibility();
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  storageSet(PWA_INSTALLED_STORAGE_KEY, "1");
  updateInstallButtonVisibility();
  showToast("Aplikacja zainstalowana.");
});

window.matchMedia?.("(display-mode: standalone)")?.addEventListener?.("change", updateInstallButtonVisibility);

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) refreshAircraftInBackground();
});

installButton?.addEventListener("click", promptPwaInstall);
installPromptInstallButton?.addEventListener("click", promptPwaInstall);
installPromptBrowserButton?.addEventListener("click", dismissInstallPromptForBrowser);

document.addEventListener("click", async (event) => {
  const copyTarget = event.target?.closest?.(".copyable-aircraft-value");
  if (!copyTarget) return;
  if (hasActiveTextSelection()) return;
  const value = String(copyTarget.dataset.copyValue || copyTarget.textContent || "").replace(/^#\s*/, "").trim();
  if (!value || value === "brak danych") return;
  event.preventDefault();
  event.stopPropagation();
  try {
    await copyText(value);
    showToast(`Skopiowano: ${value}`);
  } catch (error) {
    showToast("Nie udało się skopiować do schowka.");
  }
});

aircraftSheetAds?.addEventListener("click", () => {
  openAircraftInAds(selectedAircraft);
});

aircraftSheetWatch?.addEventListener("click", () => {
  upsertWatchFromAircraft(selectedAircraft);
});

aircraftSheetSave?.addEventListener("click", () => {
  if (!selectedAircraft) return;
  upsertFlight(aircraftToFlight(selectedAircraft));
  showToast("Samolot zapisany.");
});

aircraftSheetRoute?.addEventListener("click", () => {
  if (!selectedAircraft || !aircraftSheetMorePanel) return;
  renderAircraftDetailsPanel(selectedAircraft);
  setAircraftDetailsVisible(aircraftSheetMorePanel.hidden);
});

copyStatusButton?.addEventListener("click", async () => {
  const text = [lastStatusText?.textContent || "", lastStatusTime?.textContent || "", `Wersja: ${APP_VERSION}`].filter(Boolean).join("\n");
  await copyText(text);
  showToast("Status skopiowany.");
});

if (toast) {
  toast.addEventListener("click", hideToast);
  toast.addEventListener("pointerdown", hideToast);
}

forceUpdateButton?.addEventListener("click", forceProgramUpdate);

function readShareTargetParams() {
  const params = new URLSearchParams(window.location.search);
  const incoming = [params.get("url"), params.get("text"), params.get("title")].filter(Boolean).join(" ");
  const parsed = parseFlightText(incoming);
  if (parsed) {
    importText.value = incoming;
    clearManualSearchInputLock();
    fillForm(parsed, { force: true });
    showToast("Odczytano udostępniony samolot.");
  }
}

setBusyVisible(false);
applyAppVersion();
updateInstallButtonVisibility();
applyTheme(storageGet(THEME_STORAGE_KEY, "light"));
loadAircraftFilters();
loadPerformanceSettings();
initMap();
dateInput.value = todayLocalDate();
dataSourceInput.value = storageGet(DATA_SOURCE_STORAGE_KEY, DEFAULT_DATA_SOURCE);
apiKeyInput.value = storageGet(API_KEY_STORAGE_KEY, "");
apiBaseInput.value = storageGet(API_BASE_STORAGE_KEY, selectedApiSource().apiBase);
syncApiBaseFromSource();
renderFlights();
startFirestoreStartupFlow();
renderWatchlist();
renderFlightHistory();
applyAlertSettingsToForm();
renderAlertLog();
readShareTargetParams();
window.setTimeout(startupAutoFlow, 650);

if (!persistentStorageAvailable || window.location.protocol === "file:") {
  setAircraftStatus("Tryb pliku może blokować trwały zapis. Najlepiej uruchom aplikację z GitHub Pages albo przez lokalny adres http://.");
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`sw.js?v=${APP_VERSION_STAMP}`).then((registration) => {
      registration.update?.();
    }).catch(() => {});
  });
}
