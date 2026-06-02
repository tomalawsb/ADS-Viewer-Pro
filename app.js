var APP_VERSION_NUMBER = "V69";
var APP_VERSION_STAMP = "0206262010";
var APP_VERSION = `${APP_VERSION_NUMBER} - ${APP_VERSION_STAMP}`;

window.addEventListener("error", (event) => {
  const msg = event?.message ? `Błąd JS: ${event.message}` : "Błąd JS aplikacji.";
  const status = document.querySelector("#aircraftStatus");
  if (status) status.textContent = msg;
  console.error("ADS Viewer Pro error", event.error || event.message || event);
});
window.addEventListener("unhandledrejection", (event) => {
  const reason = event?.reason?.message || String(event?.reason || "Nieobsłużony błąd aplikacji.");
  const status = document.querySelector("#aircraftStatus");
  if (status) status.textContent = `Błąd aplikacji: ${reason}`;
  console.error("ADS Viewer Pro promise rejection", event.reason || event);
});
var APP_BUILD_STORAGE_KEY = "adsb-app-build-v1";
var PWA_INSTALLED_STORAGE_KEY = "adsb-pwa-installed-v1";
var PWA_BROWSER_CHOICE_STORAGE_KEY = "adsb-pwa-browser-choice-v1";
var FETCH_TIMEOUT_MS = 9000;
var RADIUS_FETCH_TIMEOUT_MS = 5200;
var HEX_FETCH_TIMEOUT_MS = 4200;
var MANUAL_SEARCH_INPUT_LOCK_MS = 18000;
var TRACE_FETCH_TIMEOUT_MS = 9000;
var TRACE_HISTORY_FETCH_TIMEOUT_MS = 5200;
var TRACE_POINT_MARKER_LIMIT = 90;
var TRACE_API_RETRY_COOLDOWN_MS = 15000;
var AUTO_REFRESH_INTERVAL_MS = 8000;
var STORAGE_KEY = "adsb-saved-flights-v1";
var API_KEY_STORAGE_KEY = "adsb-api-key-v1";
var API_BASE_STORAGE_KEY = "adsb-api-base-v1";
var DATA_SOURCE_STORAGE_KEY = "adsb-data-source-v1";
var THEME_STORAGE_KEY = "adsb-theme-v1";
var FILTER_STORAGE_KEY = "adsb-aircraft-filters-v1";
var PERFORMANCE_STORAGE_KEY = "adsb-performance-settings-v1";
var WATCHLIST_STORAGE_KEY = "adsb-watchlist-v1";
var ALERT_SETTINGS_STORAGE_KEY = "adsb-alert-settings-v1";
var ALERT_LOG_STORAGE_KEY = "adsb-alert-log-v1";
var ALERT_FIRED_STORAGE_KEY = "adsb-alert-fired-v1";
var HISTORY_STORAGE_KEY = "adsb-flight-history-v1";
var FIRESTORE_CONFIG_STORAGE_KEY = "adsb-firestore-config-v1";
var FIRESTORE_SETUP_DISMISSED_KEY = "adsb-firestore-setup-dismissed-v1";
var FIRESTORE_DELETED_FLIGHTS_STORAGE_KEY = "adsb-firestore-deleted-flights-v1";
var FIRESTORE_CLIENT_ID_STORAGE_KEY = "adsb-firestore-client-id-v1";
var FIRESTORE_STATE_META_STORAGE_KEY = "adsb-firestore-state-meta-v1";
var FIRESTORE_STATE_DOC_ID = "__app_state";
var FIRESTORE_STATE_SECTIONS = ["api", "theme", "filters", "performance", "watchlist", "alertSettings", "alertFired"];
var FIREBASE_SDK_VERSION = "10.12.5";
var NOTIFICATION_ICON = "icon-192.png";
var FIRESTORE_COLLECTION_ROOT = "adsViewerSync";
var TRACK_STORAGE_KEY = "adsb-live-tracks-v1";
var HISTORY_TRACE_STORAGE_KEY = "adsb-history-traces-v1";
var ROUTE_CACHE_STORAGE_KEY = "adsb-route-cache-v1";
var PHOTO_CACHE_STORAGE_KEY = "adsb-photo-cache-v1";
var ADSB_BASE_URL = "https://adsb.lol/";
// WAŻNE: przycisk ADS jest obowiązkowy w panelach, w których występuje. Nie usuwać i nie zastępować inną akcją.
var ROUTE_API_URLS = [
  "https://api.adsb.lol/api/0/routeset",
  "https://adsb.im/api/0/routeset"
];
var ADSBDB_CALLSIGN_API_BASE_URL = "https://api.adsbdb.com/v0/callsign/";
var PLANESPOTTERS_PHOTO_BASE_URL = "https://api.planespotters.net/pub/photos";
var LIVE_TRACK_INTERVAL_MS = 30000;
var AUTO_LOAD_RADIUS_NM = 60;
var MAX_TRACK_POINTS = 700;
var MAX_HISTORY_TRACE_POINTS = 20000;
var HISTORY_TRACE_CACHE_MAX_ENTRIES = 120;
var TRACE_MAX_TIME_GAP_MS = 20 * 60 * 1000;
var TRACE_MAX_REASONABLE_KMH = 1450;
var TRACE_MAX_DISTANCE_WITHOUT_TIME_KM = 160;
var TRACE_CURRENT_MATCH_MAX_KM = 250;
var TRACE_APPEND_CURRENT_MAX_KM = 300;
var ROUTE_CACHE_MAX_AGE_MS = 6 * 60 * 60 * 1000;
var ROUTE_CACHE_MAX_ENTRIES = 220;
var PHOTO_CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
var PHOTO_CACHE_MAX_ENTRIES = 350;
var TRACK_CACHE_MAX_ENTRIES = 180;
var MAP_AIRCRAFT_LIMIT = 220;
var LIST_AIRCRAFT_LIMIT = 120;
var TRAIL_AIRCRAFT_LIMIT = 120;
var VISIBLE_TRACK_POINTS = 42;
var ALERT_COOLDOWN_MS = 3 * 60 * 1000;
var ALERT_LOG_MAX_ENTRIES = 30;
var WATCHLIST_GLOBAL_CHECK_INTERVAL_MS = 45 * 1000;
var WATCHLIST_GLOBAL_CHECK_LIMIT = 3;
var WATCHLIST_STATIC_LOOKUP_TIMEOUT_MS = 3500;
var ADSBDB_AIRCRAFT_API_BASE_URL = "https://api.adsbdb.com/v0/aircraft/";
var HISTORY_MAX_ENTRIES = 450;
var HISTORY_BUCKET_MS = 15 * 60 * 1000;
var HISTORY_RECORD_LIMIT = 180;
var HISTORY_RECORD_COOLDOWN_MS = 60 * 1000;
var HISTORY_CLOSE_KM = 25;
var HISTORY_LOW_ALT_FT = 2000;
var STALE_FADE_SECONDS = 90;
var STALE_REMOVE_SECONDS = 180;
var PERFORMANCE_PRESETS = {
  responsive: { refreshIntervalMs: 5000, mapLimit: 160, listLimit: 80, trailLimit: 70, trackPoints: 28, showTrails: true, showFreshnessLabels: true, showRealPhotos: false, autoHideStale: true, removeAfterSeconds: 150 },
  balanced: { refreshIntervalMs: 8000, mapLimit: 220, listLimit: 120, trailLimit: 120, trackPoints: 42, showTrails: true, showFreshnessLabels: true, showRealPhotos: true, autoHideStale: true, removeAfterSeconds: STALE_REMOVE_SECONDS },
  economy: { refreshIntervalMs: 15000, mapLimit: 120, listLimit: 70, trailLimit: 40, trackPoints: 22, showTrails: false, showFreshnessLabels: false, showRealPhotos: false, autoHideStale: true, removeAfterSeconds: 120 }
};
var API_SOURCES = {
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
var DEFAULT_DATA_SOURCE = "adsbLol";
var FREE_FALLBACK_SOURCES = ["adsbLol", "adsbFi", "adsbOne", "airplanesLive"];
var CORS_PROXY_BUILDERS = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`
];
var memoryStorage = new Map();
var persistentStorageAvailable = true;

var form = document.querySelector("#flightForm");
var searchAircraftButton = document.querySelector("#searchAircraftButton");
var saveFlightButton = document.querySelector("#saveFlightButton");
var icaoInput = document.querySelector("#icaoInput");
var nameInput = document.querySelector("#nameInput");
var dateInput = document.querySelector("#dateInput");
var zoomInput = document.querySelector("#zoomInput");
var latInput = document.querySelector("#latInput");
var lonInput = document.querySelector("#lonInput");
var importText = document.querySelector("#importText");
var flightList = document.querySelector("#flightList");
var emptyState = document.querySelector("#emptyState");
var template = document.querySelector("#flightItemTemplate");
var toast = document.querySelector("#toast");
var installButton = document.querySelector("#installButton");
var installPrompt = document.querySelector("#installPrompt");
var installPromptInstallButton = document.querySelector("#installPromptInstallButton");
var installPromptBrowserButton = document.querySelector("#installPromptBrowserButton");
var themeInput = document.querySelector("#themeInput");
var dataSourceInput = document.querySelector("#dataSourceInput");
var apiKeyInput = document.querySelector("#apiKeyInput");
var apiBaseInput = document.querySelector("#apiBaseInput");
var browseLatInput = document.querySelector("#browseLatInput");
var browseLonInput = document.querySelector("#browseLonInput");
var browseDistInput = document.querySelector("#browseDistInput");
var aircraftFilterKindInput = document.querySelector("#aircraftFilterKind");
var aircraftFilterMinAltInput = document.querySelector("#aircraftFilterMinAlt");
var aircraftFilterMaxAltInput = document.querySelector("#aircraftFilterMaxAlt");
var aircraftFilterCallsignInput = document.querySelector("#aircraftFilterCallsign");
var resetAircraftFiltersButton = document.querySelector("#resetAircraftFiltersButton");
var performanceModeInput = document.querySelector("#performanceModeInput");
var performanceRefreshInput = document.querySelector("#performanceRefreshInput");
var performanceMapLimitInput = document.querySelector("#performanceMapLimitInput");
var performanceListLimitInput = document.querySelector("#performanceListLimitInput");
var performanceTrailsInput = document.querySelector("#performanceTrailsInput");
var performanceFreshnessLabelsInput = document.querySelector("#performanceFreshnessLabelsInput");
var performanceRealPhotosInput = document.querySelector("#performanceRealPhotosInput");
var performanceAutoHideStaleInput = document.querySelector("#performanceAutoHideStaleInput");
var performanceRemoveAfterInput = document.querySelector("#performanceRemoveAfterInput");
var resetPerformanceButton = document.querySelector("#resetPerformanceButton");
var mapLocateButton = document.querySelector("#mapLocateButton");
var mapModeBadge = document.querySelector("#mapModeBadge");
var mapModeBadgeText = document.querySelector("#mapModeBadgeText");
var returnLiveMapButton = document.querySelector("#returnLiveMapButton");
var historyAltitudeLegend = document.querySelector("#historyAltitudeLegend");
var aircraftStatus = document.querySelector("#aircraftStatus");
var aircraftList = document.querySelector("#aircraftList");
var routeSummary = document.querySelector("#routeSummary");
var aircraftTemplate = document.querySelector("#aircraftItemTemplate");
var busyOverlay = document.querySelector("#busyOverlay");
var busyText = document.querySelector("#busyText");
var appVersionBadge = document.querySelector("#appVersionBadge");
var settingsVersionBadge = document.querySelector("#settingsVersionBadge");
var forceUpdateButton = document.querySelector("#forceUpdateButton");
var lastStatusText = document.querySelector("#lastStatusText");
var lastStatusTime = document.querySelector("#lastStatusTime");
var statusChip = document.querySelector("#statusChip");
var copyStatusButton = document.querySelector("#copyStatusButton");
var drawer = document.querySelector("#drawer");
var drawerTitle = document.querySelector("#drawerTitle");
var drawerCloseButton = document.querySelector("#drawerCloseButton");
var savedSearchInput = document.querySelector("#savedSearchInput");
var watchList = document.querySelector("#watchList");
var watchEmptyState = document.querySelector("#watchEmptyState");
var watchTemplate = document.querySelector("#watchItemTemplate");
var addCurrentWatchButton = document.querySelector("#addCurrentWatchButton");
var clearWatchButton = document.querySelector("#clearWatchButton");
var alertsEnabledInput = document.querySelector("#alertsEnabledInput");
var alertQueryInput = document.querySelector("#alertQueryInput");
var alertDistanceKmInput = document.querySelector("#alertDistanceKmInput");
var alertMaxAltitudeInput = document.querySelector("#alertMaxAltitudeInput");
var alertWatchedInput = document.querySelector("#alertWatchedInput");
var alertSpecialInput = document.querySelector("#alertSpecialInput");
var alertSystemInput = document.querySelector("#alertSystemInput");
var saveAlertSettingsButton = document.querySelector("#saveAlertSettingsButton");
var requestNotificationsButton = document.querySelector("#requestNotificationsButton");
var testAlertsButton = document.querySelector("#testAlertsButton");
var clearAlertLogButton = document.querySelector("#clearAlertLogButton");
var historySearchInput = document.querySelector("#historySearchInput");
var historyList = document.querySelector("#historyList");
var historyEmptyState = document.querySelector("#historyEmptyState");
var historyTemplate = document.querySelector("#historyItemTemplate");
var exportHistoryButton = document.querySelector("#exportHistoryButton");
var clearHistoryButton = document.querySelector("#clearHistoryButton");
var historyTraceIcaoInput = document.querySelector("#historyTraceIcaoInput");
var historyTraceDateInput = document.querySelector("#historyTraceDateInput");
var historyTraceLoadButton = document.querySelector("#historyTraceLoadButton");
var historyTraceExportButton = document.querySelector("#historyTraceExportButton");
var historyPrevDayButton = document.querySelector("#historyPrevDayButton");
var historyTodayButton = document.querySelector("#historyTodayButton");
var historyNextDayButton = document.querySelector("#historyNextDayButton");
var historyTraceStatus = document.querySelector("#historyTraceStatus");
var historyTracePlayerPanel = document.querySelector("#historyTracePlayerPanel");
var historyTracePlayerSlider = document.querySelector("#historyTracePlayerSlider");
var historyTracePlayButton = document.querySelector("#historyTracePlayButton");
var historyTracePauseButton = document.querySelector("#historyTracePauseButton");
var historyTraceResetButton = document.querySelector("#historyTraceResetButton");
var historyTracePlayerStatus = document.querySelector("#historyTracePlayerStatus");
var alertStatus = document.querySelector("#alertStatus");
var alertLogList = document.querySelector("#alertLogList");
var bottomNavButtons = Array.from(document.querySelectorAll(".bottom-nav button"));
var bottomMoreMenu = document.querySelector("#bottomMoreMenu");
var bottomMoreButton = document.querySelector("[data-more-toggle]");
var bottomMoreButtons = Array.from(document.querySelectorAll("#bottomMoreMenu button[data-panel]"));
var MORE_PANEL_IDS = new Set(bottomMoreButtons.map((button) => button.dataset.panel).filter(Boolean));
var aircraftSheet = document.querySelector("#aircraftSheet");
var aircraftSheetDragHandle = document.querySelector("#aircraftSheetDragHandle");
var aircraftSheetPhoto = document.querySelector("#aircraftSheetPhoto");
var aircraftSheetCallsign = document.querySelector("#aircraftSheetCallsign");
var aircraftSheetType = document.querySelector("#aircraftSheetType");
var aircraftSheetOperator = document.querySelector("#aircraftSheetOperator");
var aircraftSheetRouteFrom = document.querySelector("#aircraftSheetRouteFrom");
var aircraftSheetRouteTo = document.querySelector("#aircraftSheetRouteTo");
var aircraftSheetRouteFromMeta = document.querySelector("#aircraftSheetRouteFromMeta");
var aircraftSheetRouteToMeta = document.querySelector("#aircraftSheetRouteToMeta");
var aircraftSheetRouteCaption = document.querySelector("#aircraftSheetRouteCaption");
var aircraftSheetAltitude = document.querySelector("#aircraftSheetAltitude");
var aircraftSheetSpeed = document.querySelector("#aircraftSheetSpeed");
var aircraftSheetRegistration = document.querySelector("#aircraftSheetRegistration");
var aircraftSheetPhaseIcon = document.querySelector("#aircraftSheetPhaseIcon");
var aircraftSheetPhaseText = document.querySelector("#aircraftSheetPhaseText");
var aircraftSheetFreshness = document.querySelector("#aircraftSheetFreshness");
var aircraftSheetHex = document.querySelector("#aircraftSheetHex");
var aircraftSheetHeading = document.querySelector("#aircraftSheetHeading");
var aircraftSheetVerticalRate = document.querySelector("#aircraftSheetVerticalRate");
var aircraftSheetLastSignal = document.querySelector("#aircraftSheetLastSignal");
var aircraftSheetPosition = document.querySelector("#aircraftSheetPosition");
var aircraftSheetSource = document.querySelector("#aircraftSheetSource");
var aircraftSheetMorePanel = document.querySelector("#aircraftSheetMorePanel");
var aircraftSheetAds = document.querySelector("#aircraftSheetAds");
var aircraftSheetHistory = document.querySelector("#aircraftSheetHistory");
var aircraftSheetWatch = document.querySelector("#aircraftSheetWatch");
var aircraftSheetSave = document.querySelector("#aircraftSheetSave");
var aircraftSheetExport = document.querySelector("#aircraftSheetExport");
var aircraftSheetRoute = document.querySelector("#aircraftSheetRoute");
var firestoreSyncStatus = document.querySelector("#firestoreSyncStatus");
var firestoreSettingsButton = document.querySelector("#firestoreSettingsButton");
var firestoreSyncNowButton = document.querySelector("#firestoreSyncNowButton");
var firestoreDisableButton = document.querySelector("#firestoreDisableButton");
var firestoreSetupModal = document.querySelector("#firestoreSetupModal");
var firestoreConfigPaste = document.querySelector("#firestoreConfigPaste");
var firestoreParseConfigButton = document.querySelector("#firestoreParseConfigButton");
var firestoreApiKeyInput = document.querySelector("#firestoreApiKeyInput");
var firestoreAuthDomainInput = document.querySelector("#firestoreAuthDomainInput");
var firestoreProjectIdInput = document.querySelector("#firestoreProjectIdInput");
var firestoreStorageBucketInput = document.querySelector("#firestoreStorageBucketInput");
var firestoreMessagingSenderIdInput = document.querySelector("#firestoreMessagingSenderIdInput");
var firestoreAppIdInput = document.querySelector("#firestoreAppIdInput");
var firestoreSyncKeyInput = document.querySelector("#firestoreSyncKeyInput");
var firestoreSaveConfigButton = document.querySelector("#firestoreSaveConfigButton");
var firestoreSkipConfigButton = document.querySelector("#firestoreSkipConfigButton");
var firestoreCloseConfigButton = document.querySelector("#firestoreCloseConfigButton");
var firestoreModalStatus = document.querySelector("#firestoreModalStatus");
var drawerDragHandle = document.querySelector("#drawerDragHandle");

var deferredInstallPrompt = null;
var map = null;
var tileLayer = null;
var aircraftLayer = null;
var trailLayer = null;
var routeLayer = null;
var userLocationLayer = null;
var lastRouteBounds = null;
var liveTrackTimer = null;
var activeTrack = null;
var traceApiAttemptedAt = new Map();
var historyTracePlaybackPoints = [];
var historyTracePlaybackIcao = "";
var historyTracePlaybackDate = "";
var historyTracePlaybackIndex = 0;
var historyTracePlaybackTimer = null;
var historyTracePlaybackMarker = null;
var historyTraceRequestSeq = 0;
var historyTracePendingRequests = new Map();
var currentMapMode = "live";
var aircraftAutoRefreshTimer = null;
var aircraftRefreshInProgress = false;
var lastRenderSettings = null;
var busyDepth = 0;
var lastAircraftCache = [];
var startupAutoLoadInProgress = false;
var selectedAircraft = null;
var savedMapFocusActive = false;
var firestoreModulesPromise = null;
var firestoreState = {
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
var firestoreApplyingRemote = false;
var firestorePushTimer = null;
var firestorePushInProgress = false;
var firestoreClientId = getOrCreateFirestoreClientId();
var lastHistoryWriteAt = 0;
var alertCooldownMap = new Map();
var watchlistProbeLastCheckedAt = new Map();
var watchlistGlobalProbeInProgress = false;
var watchlistGlobalProbeCursor = 0;

// isSavePanelOpen przeniesiono do modules/uiPanels.js

// markManualSearchInput przeniesiono do modules/uiPanels.js

// clearManualSearchInputLock przeniesiono do modules/uiPanels.js

// manualSearchInputLocked przeniesiono do modules/uiPanels.js

// shouldPreserveManualSearchInput przeniesiono do modules/uiPanels.js

// storageGet przeniesiono do modules/coreStorage.js

// storageSet przeniesiono do modules/coreStorage.js

// storageJsonGet przeniesiono do modules/coreStorage.js

// storageJsonSet przeniesiono do modules/coreStorage.js

// pruneCacheBySavedAt przeniesiono do modules/coreStorage.js

// pruneTrackCache przeniesiono do modules/coreStorage.js

// todayLocalDate przeniesiono do modules/coreStorage.js

// normalizeIcao przeniesiono do modules/coreStorage.js

// isValidIcao przeniesiono do modules/coreStorage.js

// explicitIcaoFromInput przeniesiono do modules/coreStorage.js

// createTextElement przeniesiono do modules/coreStorage.js

// normalizeCallsign przeniesiono do modules/aircraftUtils.js

// aircraftCallsign przeniesiono do modules/aircraftUtils.js

// numberText przeniesiono do modules/coreStorage.js

// formatAltitude przeniesiono do modules/aircraftUtils.js

// formatSpeed przeniesiono do modules/aircraftUtils.js

// formatHeading przeniesiono do modules/aircraftUtils.js

// formatAge przeniesiono do modules/aircraftUtils.js

// aircraftFreshnessSeconds przeniesiono do modules/aircraftUtils.js

// aircraftFreshnessInfo przeniesiono do modules/aircraftUtils.js

// setFreshnessBadge przeniesiono do modules/aircraftUtils.js

// aircraftPositionText przeniesiono do modules/aircraftUtils.js

// aircraftSourceText przeniesiono do modules/aircraftUtils.js

// updateAircraftSheetLiveDetails przeniesiono do modules/uiPanels.js

// firstFilled przeniesiono do modules/coreStorage.js

// aircraftHeading przeniesiono do modules/aircraftUtils.js

// aircraftKind przeniesiono do modules/aircraftUtils.js

// escapeHtml przeniesiono do modules/coreStorage.js

// aircraftTypeGroup przeniesiono do modules/aircraftUtils.js


// aircraftGroupLabel przeniesiono do modules/aircraftUtils.js

var AIRCRAFT_ICON_FILES = {
  jet: "assets/aircraft/aircraft-jet.svg",
  airliner: "assets/aircraft/aircraft-airliner.svg",
  business: "assets/aircraft/aircraft-business.svg",
  cargo: "assets/aircraft/aircraft-cargo.svg",
  heavy: "assets/aircraft/aircraft-heavy.svg",
  prop: "assets/aircraft/aircraft-prop.svg",
  helicopter: "assets/aircraft/aircraft-helicopter.svg",
  glider: "assets/aircraft/aircraft-glider.svg",
  special: "assets/aircraft/aircraft-special.svg"
};

// aircraftIconAssetUrl przeniesiono do modules/aircraftUtils.js

// aircraftPngIconMarkup przeniesiono do modules/aircraftUtils.js

// aircraftPngMaskSupported przeniesiono do modules/aircraftUtils.js

// preloadAircraftPngIcons przeniesiono do modules/aircraftUtils.js

// aircraftAltitudeFeet przeniesiono do modules/aircraftUtils.js


function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

// defaultPerformanceSettings przeniesiono do modules/settingsFilters.js

// normalizePerformanceSettings przeniesiono do modules/settingsFilters.js

// loadPerformanceSettings przeniesiono do modules/settingsFilters.js

// readPerformanceSettings przeniesiono do modules/settingsFilters.js

// savePerformanceSettings przeniesiono do modules/settingsFilters.js

// applyPerformancePreset przeniesiono do modules/settingsFilters.js

// getAutoRefreshIntervalMs przeniesiono do modules/settingsFilters.js

// aircraftVisibleByLifecycle przeniesiono do modules/aircraftUtils.js

// lifecycleFilteredAircraft przeniesiono do modules/settingsFilters.js

// hiddenOldAircraftCount przeniesiono do modules/settingsFilters.js

// aircraftLifecycleState przeniesiono do modules/aircraftUtils.js

// loadAircraftFilters przeniesiono do modules/settingsFilters.js

// readAircraftFilters przeniesiono do modules/settingsFilters.js

// saveAircraftFilters przeniesiono do modules/settingsFilters.js

// aircraftMatchesKindFilter przeniesiono do modules/settingsFilters.js

// aircraftMatchesFilters przeniesiono do modules/settingsFilters.js

// filterAircraftForDisplay przeniesiono do modules/settingsFilters.js

// aircraftFilterSummary przeniesiono do modules/settingsFilters.js

// rerenderAircraftFromCache przeniesiono do modules/settingsFilters.js

// readBrowseSettingsSafe przeniesiono do modules/settingsFilters.js

var AIRCRAFT_SVG_MARKUP = Object.freeze({
  jet: `
<g transform="scale(0.125)">
<path fill="currentColor" fill-rule="evenodd" d="
    M 256 449.49 L 254 449.34 L 251.87 447 L 246.35 423 L 245 421.42 L 193 442.4 L 191.4 441 L 192 421.4 L 238.31 382 L 232 283.61 L 215 289.85 L 175 307.72 L 104 341.69 L 103.19 326 L 103.37 319 L 105 316.77 L 178.13 252 L 178.58 234 L 181 229.5 L 186 226.9 L 191 226.77 L 196 228.86 L 199 233.23 L 200 233.19 L 232.09 202 L 232.55 122 L 234.74 102 L 238.72 85 L 243.95 72 L 249 64.58 L 255 61.74 L 260.77 64 L 266.48 72 L 272.35 87 L 276.26 105 L 278.28 130 L 278.47 202 L 311 233.47 L 315 228.53 L 319 226.9 L 324 226.75 L 329 228.98 L 331.83 234 L 332.4 252 L 398 309.77 L 406.74 318 L 407.43 321 L 407.44 340 L 406 341.65 L 329 304.74 L 279 283.25 L 271.78 381 L 318.33 421 L 319.13 441 L 317 442.23 L 265 421.47 L 259.34 445 L 256 449.49 Z
  "/>
</g>
  `,
  airliner: `
<g fill="currentColor" stroke="currentColor" stroke-linejoin="round" stroke-linecap="round">
  <path d="M31.8 7.5c2.8 0 4.9 4.8 4.9 11.8v7.5l18.2 10.7c1.1.7 1.8 1.8 1.8 3.1v3.2l-20-6.2-1.4 10.9 7.2 5.1v3.1l-10.3-2.8-10.3 2.8v-3.1l7.1-5.1-1.4-10.9-20 6.2v-3.2c0-1.3.7-2.4 1.8-3.1l18.2-10.7v-7.5c0-7 2.1-11.8 4.2-11.8z"/>
  <circle cx="24.4" cy="37.3" r="2.2" fill="none" stroke-width="2.2"/>
  <circle cx="39.2" cy="37.3" r="2.2" fill="none" stroke-width="2.2"/>
</g>
  `,
  business: `
<g fill="currentColor" stroke="currentColor" stroke-linejoin="round" stroke-linecap="round">
  <path d="M32 8.5c2.1 0 3.9 4.3 3.9 10.3v9.4l15.4 9.2c1 .6 1.6 1.7 1.6 2.9v2.1l-17.3-4.2-1.1 9.3 6.4 4.7v2.6l-9-2.4-9 2.4v-2.6l6.3-4.7-1-9.3-17.2 4.2v-2.1c0-1.2.6-2.3 1.6-2.9l15.5-9.2v-9.4c0-6 1.7-10.3 3.9-10.3z"/>
  <path d="M22 28.2l-9.5-6.4v-3.3l17 4.6" opacity=".85"/>
  <path d="M42 28.2l9.5-6.4v-3.3l-17 4.6" opacity=".85"/>
</g>
  `,
  cargo: `
<g fill="currentColor" stroke="currentColor" stroke-linejoin="round" stroke-linecap="round">
  <path d="M32 6.5c3.8 0 6.4 5.7 6.4 13.7v6.3l18.7 11.1c1.1.7 1.8 1.9 1.8 3.2v3.7L38 38.4l-1.7 10.3 8.5 5.9v3.1L32 54.5l-12.8 3.2v-3.1l8.5-5.9L26 38.4 5.1 44.5v-3.7c0-1.3.7-2.5 1.8-3.2l18.7-11.1v-6.3c0-8 2.6-13.7 6.4-13.7z"/>
  <rect x="18" y="35.1" width="4.1" height="3.8" rx="1.1"/>
  <rect x="25" y="34.2" width="4.1" height="3.8" rx="1.1"/>
  <rect x="34.9" y="34.2" width="4.1" height="3.8" rx="1.1"/>
  <rect x="41.9" y="35.1" width="4.1" height="3.8" rx="1.1"/>
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
  const visualVariant = {
    airliner: "jet",
    business: "prop",
    cargo: "heavy"
  }[safeGroup] || safeGroup;
  return AIRCRAFT_SVG_MARKUP[visualVariant] || AIRCRAFT_SVG_MARKUP.jet;
}

function aircraftSvgMarkup(group) {
  const safeGroup = Object.prototype.hasOwnProperty.call(AIRCRAFT_SVG_MARKUP, group) ? group : "jet";
  const label = aircraftGroupLabel(safeGroup);
  return `<svg class="aircraft-svg-icon aircraft-svg-icon-${safeGroup}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="${escapeHtml(label)}" focusable="false">${aircraftShapeMarkup(safeGroup)}</svg>`;
}

function aircraftIconDimensions(group) {
  const dimensions = {
    cargo: { width: 48, height: 48, anchorX: 24, anchorY: 24, svgWidth: 40, svgHeight: 40 },
    heavy: { width: 46, height: 46, anchorX: 23, anchorY: 23, svgWidth: 38, svgHeight: 38 },
    airliner: { width: 42, height: 42, anchorX: 21, anchorY: 21, svgWidth: 35, svgHeight: 35 },
    business: { width: 38, height: 38, anchorX: 19, anchorY: 19, svgWidth: 31, svgHeight: 31 },
    jet: { width: 40, height: 40, anchorX: 20, anchorY: 20, svgWidth: 33, svgHeight: 33 },
    prop: { width: 36, height: 36, anchorX: 18, anchorY: 18, svgWidth: 29, svgHeight: 29 },
    helicopter: { width: 40, height: 34, anchorX: 20, anchorY: 17, svgWidth: 36, svgHeight: 30 },
    glider: { width: 46, height: 30, anchorX: 23, anchorY: 15, svgWidth: 42, svgHeight: 26 },
    special: { width: 40, height: 40, anchorX: 20, anchorY: 20, svgWidth: 33, svgHeight: 33 }
  };
  return dimensions[group] || dimensions.jet;
}


// aircraftMiniIconSvg przeniesiono do modules/aircraftUtils.js

// aircraftMiniIconDataUrl przeniesiono do modules/aircraftUtils.js

// aircraftThumbSvg przeniesiono do modules/aircraftUtils.js

// aircraftThumbDataUrl przeniesiono do modules/aircraftUtils.js

// photoCache przeniesiono do modules/cacheMediaRoutes.js

// savePhotoCache przeniesiono do modules/cacheMediaRoutes.js

// cleanAircraftRegistration przeniesiono do modules/cacheMediaRoutes.js

// aircraftPhotoLookupKeys przeniesiono do modules/cacheMediaRoutes.js

// photoUrlFromPlanespottersResponse przeniesiono do modules/cacheMediaRoutes.js

// findRealAircraftPhotoUrl przeniesiono do modules/cacheMediaRoutes.js

// setAircraftPhoto przeniesiono do modules/cacheMediaRoutes.js

// createAircraftPhoto przeniesiono do modules/cacheMediaRoutes.js

// routeEndpointIcon przeniesiono do modules/mapRoutes.js

// routeAirports przeniesiono do modules/mapRoutes.js

// routeAirportLabel przeniesiono do modules/mapRoutes.js

// routeAirportVerbose przeniesiono do modules/mapRoutes.js

// routeValueText przeniesiono do modules/mapRoutes.js

// firstRouteValue przeniesiono do modules/mapRoutes.js

// routeInfo przeniesiono do modules/mapRoutes.js

// routeInfoFromAircraft przeniesiono do modules/mapRoutes.js

// routeText przeniesiono do modules/mapRoutes.js

// numericFirst przeniesiono do modules/coreStorage.js

// airportPoint przeniesiono do modules/mapRoutes.js

// routeAirportPoints przeniesiono do modules/mapRoutes.js

// confirmedRouteEndpointPoints przeniesiono do modules/mapRoutes.js

// aircraftListFromResponse przeniesiono do modules/aircraftUtils.js

// cleanCoordinate przeniesiono do modules/coreStorage.js

// sanitizeFirestoreDocId przeniesiono do modules/firestoreSync.js

// sanitizeSyncKey przeniesiono do modules/savedWatchHistory.js

// generateSyncKey przeniesiono do modules/savedWatchHistory.js

// getOrCreateFirestoreClientId przeniesiono do modules/firestoreSync.js

// flightTimestampMs przeniesiono do modules/savedWatchHistory.js

// flightMergeKey przeniesiono do modules/savedWatchHistory.js

// loadDeletedFlights przeniesiono do modules/firestoreSync.js

// saveDeletedFlights przeniesiono do modules/firestoreSync.js

// firestoreFlightDocId przeniesiono do modules/firestoreSync.js

// isFlightDeletedByTombstone przeniesiono do modules/firestoreSync.js

// markFlightDeletedLocally przeniesiono do modules/firestoreSync.js

// mergeRemoteTombstones przeniesiono do modules/firestoreSync.js

// normalizeFlightForStorage przeniesiono do modules/savedWatchHistory.js

// normalizeFlightsForStorage przeniesiono do modules/savedWatchHistory.js

// loadFlights przeniesiono do modules/savedWatchHistory.js

// saveFlights przeniesiono do modules/savedWatchHistory.js

// loadWatchlist przeniesiono do modules/savedWatchHistory.js

// saveWatchlist przeniesiono do modules/savedWatchHistory.js

// loadAlertLog przeniesiono do modules/alertsModule.js

// saveAlertLog przeniesiono do modules/alertsModule.js

// loadFiredAlertState przeniesiono do modules/alertsModule.js

// saveFiredAlertState przeniesiono do modules/alertsModule.js

// hasFiredAlertForIcao przeniesiono do modules/alertsModule.js

// markFiredAlertForIcao przeniesiono do modules/alertsModule.js

// clearFiredAlertForIcao przeniesiono do modules/alertsModule.js

// pruneFiredAlertStateToWatchlist przeniesiono do modules/alertsModule.js

// defaultAlertSettings przeniesiono do modules/alertsModule.js

// loadAlertSettingsObject przeniesiono do modules/alertsModule.js

// saveAlertSettingsObject przeniesiono do modules/alertsModule.js

// ensureWatchlistAlertsEnabled przeniesiono do modules/alertsModule.js

// timeStampText przeniesiono do modules/alertsModule.js

// updateStatusPanel przeniesiono do modules/uiPanels.js

// hideToast przeniesiono do modules/uiPanels.js

// showToast przeniesiono do modules/uiPanels.js


// loadFirestoreStateMeta przeniesiono do modules/firestoreSync.js

// saveFirestoreStateMeta przeniesiono do modules/firestoreSync.js

// firestoreSectionUpdatedAt przeniesiono do modules/firestoreSync.js

// ensureFirestoreStateMetaSeeded przeniesiono do modules/firestoreSync.js

// markFirestoreStateSectionDirty przeniesiono do modules/firestoreSync.js

// normalizeFirestoreSection przeniesiono do modules/firestoreSync.js

// localFirestoreSectionValue przeniesiono do modules/firestoreSync.js

// buildLocalFirestoreState przeniesiono do modules/firestoreSync.js


// encodeFirestoreAppStateForFlightDoc przeniesiono do modules/firestoreSync.js

// decodeFirestoreAppStateFromFlightDoc przeniesiono do modules/firestoreSync.js

// remoteFirestoreStateSections przeniesiono do modules/firestoreSync.js

// applyRemoteSectionToLocal przeniesiono do modules/firestoreSync.js

// applyRemoteAppState przeniesiono do modules/firestoreSync.js

// pullAppStateFromFirestore przeniesiono do modules/firestoreSync.js

// pushAppStateToFirestore przeniesiono do modules/firestoreSync.js

// firestoreStatusSummary przeniesiono do modules/firestoreSync.js

// firestoreConfigFromForm przeniesiono do modules/firestoreSync.js

// firebaseConfigForSdk przeniesiono do modules/firestoreSync.js

// loadFirestoreConfig przeniesiono do modules/firestoreSync.js

// saveFirestoreConfig przeniesiono do modules/firestoreSync.js

// firestoreConfigComplete przeniesiono do modules/firestoreSync.js

// firestoreConfigSignature przeniesiono do modules/firestoreSync.js

// setFirestoreStatus przeniesiono do modules/firestoreSync.js

// parseFirebaseConfigText przeniesiono do modules/firestoreSync.js

// applyParsedFirebaseConfigToForm przeniesiono do modules/firestoreSync.js

// fillFirestoreForm przeniesiono do modules/firestoreSync.js

// openFirestoreSetupModal przeniesiono do modules/firestoreSync.js

// closeFirestoreSetupModal przeniesiono do modules/firestoreSync.js

// loadFirestoreModules przeniesiono do modules/firestoreSync.js

// resetFirestoreConnection przeniesiono do modules/firestoreSync.js

// remoteDocToFlight przeniesiono do modules/firestoreSync.js

// remoteDocsToFlightsAndTombstones przeniesiono do modules/firestoreSync.js

// mergeFlightCollections przeniesiono do modules/firestoreSync.js

// applyRemoteFlights przeniesiono do modules/firestoreSync.js

// pushFlightsToFirestore przeniesiono do modules/firestoreSync.js

// pushDeletedFlightToFirestore przeniesiono do modules/firestoreSync.js

// pushLocalTombstonesToFirestore przeniesiono do modules/firestoreSync.js

// scheduleFirestorePush przeniesiono do modules/firestoreSync.js

// syncFirestoreNow przeniesiono do modules/firestoreSync.js

// initFirestoreSync przeniesiono do modules/firestoreSync.js

// startFirestoreStartupFlow przeniesiono do modules/firestoreSync.js

// deleteSavedFlight przeniesiono do modules/savedWatchHistory.js

// clearSavedFlights przeniesiono do modules/savedWatchHistory.js


// setBusyVisible przeniesiono do modules/uiPanels.js

// beginBusy przeniesiono do modules/uiPanels.js

// runBusy przeniesiono do modules/uiPanels.js

var manualBusyRelease = null;

// startBusy przeniesiono do modules/uiPanels.js

// finishBusy przeniesiono do modules/uiPanels.js

// invalidateMapSoon przeniesiono do modules/uiPanels.js

// closeBottomMoreMenu przeniesiono do modules/uiPanels.js

// setAircraftActionsMode przeniesiono do modules/uiPanels.js

// toggleBottomMoreMenu przeniesiono do modules/uiPanels.js

// selectedAircraftAlertQuery przeniesiono do modules/uiPanels.js

// prepareAlertsPanelForSelectedAircraft przeniesiono do modules/uiPanels.js

// closeDrawerPanel przeniesiono do modules/uiPanels.js

// openDrawerPanel przeniesiono do modules/uiPanels.js

// applyAppVersion przeniesiono do modules/uiPanels.js

// isStandaloneApp przeniesiono do modules/uiPanels.js

// updateInstallButtonVisibility przeniesiono do modules/uiPanels.js

// updateInstallPromptVisibility przeniesiono do modules/uiPanels.js

// dismissInstallPromptForBrowser przeniesiono do modules/uiPanels.js

// promptPwaInstall przeniesiono do modules/uiPanels.js

// deleteWritableCookies przeniesiono do modules/uiPanels.js

// forceProgramUpdate przeniesiono do modules/uiPanels.js

// explainFetchError przeniesiono do modules/apiSources.js

// fetchWithTimeout przeniesiono do modules/apiSources.js

// applyTheme przeniesiono do modules/uiPanels.js

// currentTileConfig przeniesiono do modules/uiPanels.js

// initMap przeniesiono do modules/mapRoutes.js

// refreshTileLayer przeniesiono do modules/mapRoutes.js

// setRouteSummary przeniesiono do modules/mapRoutes.js

// validPoint przeniesiono do modules/mapRoutes.js

// finiteNumberOrNull przeniesiono do modules/coreStorage.js

// pointTimeMs przeniesiono do modules/mapRoutes.js

// tracePointAltitudeFt przeniesiono do modules/mapRoutes.js

// tracePointSpeedKt przeniesiono do modules/mapRoutes.js

// isGroundLikeTracePoint przeniesiono do modules/mapRoutes.js

// distanceKmBetweenPoints przeniesiono do modules/mapRoutes.js

// normalizeLongitude przeniesiono do modules/mapRoutes.js

// greatCirclePointBetween przeniesiono do modules/mapRoutes.js

// greatCircleRoutePoints przeniesiono do modules/mapRoutes.js

// combineRouteLegs przeniesiono do modules/mapRoutes.js

// plannedAirportRoutePointsThroughAircraft przeniesiono do modules/mapRoutes.js

// shouldBreakTraceSegment przeniesiono do modules/mapRoutes.js

// splitTraceIntoPlausibleSegments przeniesiono do modules/mapRoutes.js

// flightPointFromFormLikeObject przeniesiono do modules/mapRoutes.js

// segmentLastTimeMs przeniesiono do modules/mapRoutes.js

// selectTraceSegmentForFlight przeniesiono do modules/mapRoutes.js

// filterTracePointsByUtcDate przeniesiono do modules/mapRoutes.js

// prepareTracePointsForFlight przeniesiono do modules/mapRoutes.js

// appendCurrentAircraftPointToTrace przeniesiono do modules/mapRoutes.js

// pointFromAircraft przeniesiono do modules/mapRoutes.js


// destinationPoint przeniesiono do modules/mapRoutes.js

// directionDistanceKm przeniesiono do modules/mapRoutes.js

// drawDirectionLine przeniesiono do modules/mapRoutes.js

// drawRoute przeniesiono do modules/mapRoutes.js

// clearRoute przeniesiono do modules/mapRoutes.js

// buildAdsbUrl przeniesiono do modules/apiSources.js

// normalizeApiBase przeniesiono do modules/apiSources.js

// validatedApiBase przeniesiono do modules/apiSources.js

// selectedApiSource przeniesiono do modules/apiSources.js

// apiSourceByName przeniesiono do modules/apiSources.js

// sourceLabel przeniesiono do modules/apiSources.js

// syncApiBaseFromSource przeniesiono do modules/apiSources.js

// settingsForSource przeniesiono do modules/apiSources.js

// candidateSettings przeniesiono do modules/apiSources.js

// buildRadiusUrl przeniesiono do modules/apiSources.js

// buildHexUrl przeniesiono do modules/apiSources.js

// buildCallsignUrls przeniesiono do modules/apiSources.js

// buildRegistrationUrls przeniesiono do modules/apiSources.js

// looksLikeRegistration przeniesiono do modules/apiSources.js

// iataFlightToLikelyCallsigns przeniesiono do modules/apiSources.js

// fetchJsonWithFallback przeniesiono do modules/apiSources.js
// yieldToUi przeniesiono do modules/coreStorage.js

// runOnceForKey przeniesiono do modules/coreStorage.js


// fetchAircraftFromCandidate przeniesiono do modules/apiSources.js

// fetchFirstAircraftResult przeniesiono do modules/apiSources.js

// aircraftLabel przeniesiono do modules/aircraftUtils.js

// aircraftMeta przeniesiono do modules/aircraftUtils.js

// aircraftExtraMeta przeniesiono do modules/aircraftUtils.js

// aircraftVerticalRate przeniesiono do modules/aircraftUtils.js

// aircraftAltitudeNumber przeniesiono do modules/aircraftUtils.js

// aircraftFlightPhase przeniesiono do modules/aircraftUtils.js

// aircraftRouteIndicatorAngle przeniesiono do modules/aircraftUtils.js

// aircraftPhaseMarkup przeniesiono do modules/aircraftUtils.js

// airlineGuessFromCallsign przeniesiono do modules/aircraftUtils.js

// routePartsForDisplay przeniesiono do modules/mapRoutes.js

function clampNumber(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

// routeProgressFraction przeniesiono do modules/mapRoutes.js

// formatRouteDistanceKm przeniesiono do modules/mapRoutes.js

// aircraftRouteProgressInfo przeniesiono do modules/mapRoutes.js

// updateAircraftSheetRouteProgress przeniesiono do modules/mapRoutes.js



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

// routeDetailRows przeniesiono do modules/mapRoutes.js

// aircraftDetailsRows przeniesiono do modules/aircraftUtils.js

// renderAircraftDetailsPanel przeniesiono do modules/uiPanels.js

// setAircraftDetailsVisible przeniesiono do modules/uiPanels.js

// showSelectedAircraftSheet przeniesiono do modules/uiPanels.js

// hideSelectedAircraftSheet przeniesiono do modules/uiPanels.js

// selectedAircraftShareText przeniesiono do modules/uiPanels.js

// openAircraftQuickPopup przeniesiono do modules/uiPanels.js

// aircraftPopupContent przeniesiono do modules/uiPanels.js

// metricCard przeniesiono do modules/uiPanels.js


// watchItemFromIcao przeniesiono do modules/savedWatchHistory.js

// watchItemFromAircraft przeniesiono do modules/savedWatchHistory.js

// watchToFlight przeniesiono do modules/savedWatchHistory.js

// upsertWatchItem przeniesiono do modules/savedWatchHistory.js

// upsertWatchFromAircraft przeniesiono do modules/savedWatchHistory.js

// addWatchFromCurrentInput przeniesiono do modules/savedWatchHistory.js

// updateWatchlistFromAircraft przeniesiono do modules/savedWatchHistory.js

// renderWatchlist przeniesiono do modules/savedWatchHistory.js


// loadFlightHistory przeniesiono do modules/savedWatchHistory.js

// saveFlightHistory przeniesiono do modules/savedWatchHistory.js

// historyTimeText przeniesiono do modules/savedWatchHistory.js

// historySearchText przeniesiono do modules/savedWatchHistory.js

// historyReasonForAircraft przeniesiono do modules/savedWatchHistory.js

// historyEntryFromAircraft przeniesiono do modules/savedWatchHistory.js

// recordAircraftHistory przeniesiono do modules/savedWatchHistory.js

// historyItemToFlight przeniesiono do modules/savedWatchHistory.js

// renderFlightHistory przeniesiono do modules/savedWatchHistory.js

// exportFlightHistory przeniesiono do modules/exportModule.js


// sanitizeFileName przeniesiono do modules/coreStorage.js

// csvCell przeniesiono do modules/coreStorage.js

// makeAircraftExportBaseName przeniesiono do modules/exportModule.js

// makeAircraftExportZipName przeniesiono do modules/exportModule.js

// aircraftExportHistoryRows przeniesiono do modules/exportModule.js

// aircraftTrackCsv przeniesiono do modules/exportModule.js

// aircraftSeenHistoryCsv przeniesiono do modules/exportModule.js

// aircraftExportPhotoMeta przeniesiono do modules/exportModule.js

// flattenExportValue przeniesiono do modules/exportModule.js

// aircraftCurrentDataCsv przeniesiono do modules/exportModule.js

// aircraftExportJson przeniesiono do modules/exportModule.js

// aircraftExportText przeniesiono do modules/exportModule.js

// aircraftExportHtml przeniesiono do modules/exportModule.js



// Eksport DOCX przeniesiony do services/docxExportService.js.

// ensureDirectoryWritable przeniesiono do modules/exportModule.js

// writeBlobToDirectory przeniesiono do modules/exportModule.js

// writeTextToDirectory przeniesiono do modules/exportModule.js

// downloadBlob przeniesiono do modules/exportModule.js


// dosDateTime przeniesiono do modules/exportModule.js

var crcTableCache = null;
// crc32Table przeniesiono do modules/exportModule.js

// crc32 przeniesiono do modules/exportModule.js

// blobToUint8Array przeniesiono do modules/exportModule.js

// uint16 przeniesiono do modules/exportModule.js

// uint32 przeniesiono do modules/exportModule.js

// createZipBlob przeniesiono do modules/exportModule.js

// safeZipName przeniesiono do modules/exportModule.js

// downloadAircraftExportZip przeniesiono do modules/exportModule.js

// buildAircraftExportFiles przeniesiono do modules/exportModule.js

// exportSelectedAircraftToFolder przeniesiono do modules/exportModule.js

// readAlertSettingsFromForm przeniesiono do modules/alertsModule.js

// applyAlertSettingsToForm przeniesiono do modules/alertsModule.js

// saveAlertSettingsFromForm przeniesiono do modules/alertsModule.js

// updateAlertStatusText przeniesiono do modules/alertsModule.js

// renderAlertLog przeniesiono do modules/alertsModule.js

// pushAlertLog przeniesiono do modules/alertsModule.js

// numericSetting przeniesiono do modules/alertsModule.js

// alertBasePoint przeniesiono do modules/alertsModule.js

// distanceKmBetween przeniesiono do modules/alertsModule.js

// aircraftMatchesAlertQuery przeniesiono do modules/alertsModule.js

// ensureNotificationPermission przeniesiono do modules/alertsModule.js

// showSystemAlertNotification przeniesiono do modules/alertsModule.js

// notifyAlertUser przeniesiono do modules/alertsModule.js

// canTriggerAlert przeniesiono do modules/alertsModule.js

// mergeUniqueAircraftByIcao przeniesiono do modules/alertsModule.js

// selectWatchedItemsForGlobalProbe przeniesiono do modules/alertsModule.js

// markWatchedProbeChecked przeniesiono do modules/alertsModule.js

// checkWatchedAircraftGlobalInBackground przeniesiono do modules/alertsModule.js

// checkAircraftAlerts przeniesiono do modules/alertsModule.js

// aircraftToFlight przeniesiono do modules/aircraftUtils.js

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

// flightToAircraft przeniesiono do modules/aircraftUtils.js

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

// refreshSavedFlightSnapshot przeniesiono do modules/savedWatchHistory.js

// resolveSavedFlightAircraft przeniesiono do modules/savedWatchHistory.js

// refreshSavedFlightLiveInBackground przeniesiono do modules/savedWatchHistory.js

// showSavedFlightOnMap przeniesiono do modules/savedWatchHistory.js

// loadRouteCache przeniesiono do modules/cacheMediaRoutes.js

// saveRouteCache przeniesiono do modules/cacheMediaRoutes.js

// routeFromCache przeniesiono do modules/cacheMediaRoutes.js

// parseJsonLoose przeniesiono do modules/cacheMediaRoutes.js

// flightRouteRoot przeniesiono do modules/cacheMediaRoutes.js

// normalizeAirportForRoute przeniesiono do modules/cacheMediaRoutes.js

// routeAirportCandidates przeniesiono do modules/cacheMediaRoutes.js

// normalizeRouteResult przeniesiono do modules/cacheMediaRoutes.js

// routeEntriesFromResponse przeniesiono do modules/cacheMediaRoutes.js

// fetchRouteset przeniesiono do modules/apiSources.js

// fetchAdsbDbRoute przeniesiono do modules/apiSources.js

// enrichAircraftRoutes przeniesiono do modules/cacheMediaRoutes.js

// applyCachedRoutesToAircraft przeniesiono do modules/cacheMediaRoutes.js

// refreshSelectedAircraftRouteUi przeniesiono do modules/cacheMediaRoutes.js


// trackKey przeniesiono do modules/cacheMediaRoutes.js

// loadTracks przeniesiono do modules/cacheMediaRoutes.js

// loadTrackPoints przeniesiono do modules/cacheMediaRoutes.js

// loadLatestTrackPoints przeniesiono do modules/cacheMediaRoutes.js

// saveTracePointsIfUseful przeniesiono do modules/cacheMediaRoutes.js


// saveTrackPoints przeniesiono do modules/cacheMediaRoutes.js

// addTrackPoint przeniesiono do modules/cacheMediaRoutes.js

// setAircraftStatus przeniesiono do modules/uiPanels.js

// syncBrowseInputsFromMapCenter przeniesiono do modules/settingsFilters.js

// readBrowseSettings przeniesiono do modules/settingsFilters.js

// browseSettingsAroundAircraft przeniesiono do modules/settingsFilters.js

// refreshAreaAroundFoundAircraft przeniesiono do modules/cacheMediaRoutes.js

// enrichAircraftRoutesInBackground przeniesiono do modules/cacheMediaRoutes.js

// updateSelectedAircraftAfterRefresh przeniesiono do modules/cacheMediaRoutes.js

// startAircraftAutoRefresh przeniesiono do modules/cacheMediaRoutes.js

// restartAircraftAutoRefresh przeniesiono do modules/cacheMediaRoutes.js

// refreshFocusedAircraftInBackground przeniesiono do modules/cacheMediaRoutes.js

// refreshAircraftInBackground przeniesiono do modules/cacheMediaRoutes.js

// loadAircraft przeniesiono do modules/cacheMediaRoutes.js

// aircraftIcon przeniesiono do modules/aircraftUtils.js



// aircraftIcao przeniesiono do modules/aircraftUtils.js

function findAircraftByIcaoInCache(icao, source = lastAircraftCache) {
  const cleanIcao = normalizeIcao(icao);
  if (!isValidIcao(cleanIcao)) return null;
  return (source || []).find((item) => aircraftIcao(item) === cleanIcao) || null;
}

// updateSelectedAircraftMarkerHighlight przeniesiono do modules/mapRoutes.js

// makeAircraftMarker przeniesiono do modules/mapRoutes.js

// focusAircraftOnMap przeniesiono do modules/mapRoutes.js

// hasConfirmedEndpointCoordinates przeniesiono do modules/mapRoutes.js

// drawKnownAirportRouteFallback przeniesiono do modules/mapRoutes.js

// ensureAircraftRouteData przeniesiono do modules/mapRoutes.js

// drawStoredTrackForAircraft przeniesiono do modules/mapRoutes.js

// drawLocalSelectedAircraftRoute przeniesiono do modules/mapRoutes.js

// drawSelectedAircraftRouteAsync przeniesiono do modules/mapRoutes.js

// drawSelectedAircraftRoute przeniesiono do modules/mapRoutes.js


// clearAircraftMap przeniesiono do modules/mapRoutes.js

// visibleTrackSets przeniesiono do modules/mapRoutes.js

// drawVisibleAircraftTracks przeniesiono do modules/mapRoutes.js

// renderAircraftMap przeniesiono do modules/mapRoutes.js

// renderAircraft przeniesiono do modules/uiPanels.js

// readApiOnlySettings przeniesiono do modules/settingsFilters.js

// fetchAircraftByHex przeniesiono do modules/apiSources.js

// offlineAircraftRecordFromIcao przeniesiono do modules/apiSources.js

// aircraftFromStaticDatabaseResponse przeniesiono do modules/apiSources.js

// fetchStaticAircraftByHex przeniesiono do modules/apiSources.js

async function enrichOfflineWatchItemInBackground(icao) {
  const cleanIcao = normalizeIcao(icao);
  if (!isValidIcao(cleanIcao)) return;
  try {
    const staticAircraft = await fetchStaticAircraftByHex(cleanIcao);
    if (!staticAircraft) return;
    const current = loadWatchlist();
    let changed = false;
    const next = current.map((item) => {
      if (normalizeIcao(item.icao || item.hex || "") !== cleanIcao) return item;
      changed = true;
      return {
        ...item,
        name: item.name && item.name !== cleanIcao.toUpperCase() ? item.name : aircraftLabel(staticAircraft),
        callsign: item.callsign || aircraftCallsign(staticAircraft),
        registration: item.registration || firstFilled(staticAircraft.r, staticAircraft.registration, ""),
        type: item.type || firstFilled(staticAircraft.t, staticAircraft.type, ""),
        kind: item.kind || aircraftTypeGroup(staticAircraft),
        staticKnown: true,
        updatedAt: new Date().toISOString()
      };
    });
    if (changed) {
      saveWatchlist(next);
      renderWatchlist();
    }
  } catch {
    // Dane statyczne są tylko dodatkiem. Alert po HEX nadal działa bez nich.
  }
}

// tracePointsFromData przeniesiono do modules/cacheMediaRoutes.js

// traceHeadersForSettings przeniesiono do modules/cacheMediaRoutes.js

// traceSourceCandidates przeniesiono do modules/cacheMediaRoutes.js

// uniqueTraceRequests przeniesiono do modules/cacheMediaRoutes.js

// safeUrlOrigin przeniesiono do modules/cacheMediaRoutes.js

// traceDateParts przeniesiono do modules/cacheMediaRoutes.js

// todayUtcDate przeniesiono do modules/cacheMediaRoutes.js

// traceBaseUrlsForSettings przeniesiono do modules/cacheMediaRoutes.js

// addTraceUrlVariants przeniesiono do modules/cacheMediaRoutes.js

// traceUrlsForFlight przeniesiono do modules/cacheMediaRoutes.js

// loadOfficialTraceDetailed przeniesiono do modules/cacheMediaRoutes.js

// loadOfficialTrace przeniesiono do modules/cacheMediaRoutes.js


// drawRouteForFlight przeniesiono do modules/mapRoutes.js

// drawRouteFromForm przeniesiono do modules/mapRoutes.js

// stopLiveTracking przeniesiono do modules/cacheMediaRoutes.js

// pollLiveTrack przeniesiono do modules/cacheMediaRoutes.js

// startLiveTracking przeniesiono do modules/cacheMediaRoutes.js

// fetchAircraftByEndpointUrls przeniesiono do modules/apiSources.js

// fetchAircraftByLiveQuery przeniesiono do modules/apiSources.js

// normalizeSearchText przeniesiono do modules/apiSources.js

// aircraftSearchValues przeniesiono do modules/apiSources.js

// findAircraftBySmartQuery przeniesiono do modules/apiSources.js

// findAircraftByExactSearchQuery przeniesiono do modules/apiSources.js

// aircraftMatchesSearchInput przeniesiono do modules/apiSources.js

// resolveSmartFlightInput przeniesiono do modules/apiSources.js

// readFormFlight przeniesiono do modules/savedWatchHistory.js

// upsertFlight przeniesiono do modules/savedWatchHistory.js

// parseFlightText przeniesiono do modules/savedWatchHistory.js

// fillForm przeniesiono do modules/savedWatchHistory.js

// savedFlightSearchValues przeniesiono do modules/savedWatchHistory.js

// renderFlights przeniesiono do modules/savedWatchHistory.js

// enableCopyableAircraftValue przeniesiono do modules/uiPanels.js

// hasActiveTextSelection przeniesiono do modules/uiPanels.js

// copyText przeniesiono do modules/uiPanels.js

// importFromText przeniesiono do modules/savedWatchHistory.js


// saveFlightFromForm przeniesiono do modules/savedWatchHistory.js

// searchAircraftFromInput przeniesiono do modules/savedWatchHistory.js



// Historia trasy została wydzielona do: modules/historyTrace.js
savedSearchInput?.addEventListener("input", renderFlights);
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
testAlertsButton?.addEventListener("click", () => {
  checkAircraftAlerts(lastAircraftCache, { force: true, toastIfEmpty: true });
  checkWatchedAircraftGlobalInBackground(lastAircraftCache, { immediate: true });
});
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


function isHistoryMapMode() {
  return currentMapMode === "history";
}

function updateMapModeUi() {
  const historyMode = isHistoryMapMode();
  mapModeBadge?.classList.toggle("is-history", historyMode);
  mapModeBadge?.classList.toggle("is-live", !historyMode);
  if (mapModeBadgeText) mapModeBadgeText.textContent = historyMode ? "Tryb: HISTORIA" : "Tryb: LIVE";
  if (returnLiveMapButton) returnLiveMapButton.hidden = !historyMode;
}

function setMapMode(mode, options = {}) {
  const nextMode = mode === "history" ? "history" : "live";
  currentMapMode = nextMode;
  updateMapModeUi();
  if (options.message) setRouteSummary(options.message);
}

function enterHistoryMapMode() {
  setMapMode("history");
}

function returnToLiveMap(options = {}) {
  window.ADSVHistoryTrace?.stopHistoryTracePlayback?.();
  setMapMode("live");
  if (routeLayer) routeLayer.clearLayers();
  lastRouteBounds = null;
  const settings = lastRenderSettings || readBrowseSettingsSafe();
  const visibleAircraft = filterAircraftForDisplay(lastAircraftCache || []);
  if (lastAircraftCache?.length) {
    renderAircraft(visibleAircraft, settings);
    renderAircraftMap(visibleAircraft, settings, { preserveView: options.preserveView !== false, forceLiveRender: true });
    setAircraftStatus(`Tryb LIVE: pokazuję ${aircraftFilterSummary(lastAircraftCache.length, visibleAircraft.length)} z ostatniego pobrania.`);
    setRouteSummary("Tryb LIVE: mapa wróciła do aktualnych samolotów. Odśwież dane, jeśli chcesz pobrać najnowsze pozycje.");
    return;
  }
  clearAircraftMap();
  setRouteSummary("Tryb LIVE: brak lokalnie zapamiętanych samolotów. Kliknij „Pobierz samoloty”.");
}

updateMapModeUi();

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
document.querySelector("#clearRouteButton").addEventListener("click", () => {
  if (isHistoryMapMode()) {
    returnToLiveMap({ preserveView: true });
    return;
  }
  clearRoute();
});
returnLiveMapButton?.addEventListener("click", () => returnToLiveMap({ preserveView: true }));

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

document.querySelector("#exportButton").addEventListener("click", async (event) => {
  if (selectedAircraft) {
    await exportSelectedAircraftToFolder(event);
    return;
  }

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

// applyPerformanceSettingsAndRerender przeniesiono do modules/settingsFilters.js

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

// geolocationErrorMessage przeniesiono do modules/uiPanels.js

// defaultBrowseRadius przeniesiono do modules/uiPanels.js

// setDefaultBrowseRadius przeniesiono do modules/uiPanels.js

// browserLocation przeniesiono do modules/uiPanels.js

// userLocationIcon przeniesiono do modules/uiPanels.js

// drawUserLocation przeniesiono do modules/uiPanels.js

// applyBrowserLocation przeniesiono do modules/uiPanels.js

// locateUser przeniesiono do modules/uiPanels.js

// checkStartupPermissions przeniesiono do modules/uiPanels.js

// startupAutoFlow przeniesiono do modules/uiPanels.js



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


// isInsideFloatingUi przeniesiono do modules/uiPanels.js

document.addEventListener("pointerdown", (event) => {
  if (isInsideFloatingUi(event.target)) return;

  const historyPanelLockedOpen = Boolean(
    drawer?.classList.contains("is-open") &&
    drawer?.classList.contains("is-history-panel")
  );

  if (!historyPanelLockedOpen) closeDrawerPanel();
  hideSelectedAircraftSheet();
  map?.closePopup?.();
});

drawerCloseButton?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  closeDrawerPanel();
});

// installBottomDrag przeniesiono do modules/uiPanels.js

installBottomDrag(aircraftSheetDragHandle, aircraftSheet, hideSelectedAircraftSheet, { halfHidden: true });
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

aircraftSheetHistory?.addEventListener("click", () => {
  openHistoryTraceSettingsForAircraft(selectedAircraft, { fromSheet: true });
});

aircraftSheetWatch?.addEventListener("click", () => {
  upsertWatchFromAircraft(selectedAircraft);
});

aircraftSheetSave?.addEventListener("click", () => {
  if (!selectedAircraft) return;
  upsertFlight(aircraftToFlight(selectedAircraft));
  showToast("Samolot zapisany.");
});

aircraftSheetExport?.addEventListener("click", exportSelectedAircraftToFolder);
document.addEventListener("click", (event) => {
  if (event.target?.closest?.("#aircraftSheetExport")) {
    exportSelectedAircraftToFolder(event);
  }
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

// readShareTargetParams przeniesiono do modules/uiPanels.js

setBusyVisible(false);
applyAppVersion();
updateInstallButtonVisibility();
applyTheme(storageGet(THEME_STORAGE_KEY, "light"));
loadAircraftFilters();
loadPerformanceSettings();
initMap();
dateInput.value = todayLocalDate();
if (historyTraceDateInput) historyTraceDateInput.value = todayLocalDate();
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
