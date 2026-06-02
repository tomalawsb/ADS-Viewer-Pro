// ADS Viewer Pro - settingsFilters.js
// Wydzielone z app.js w wersji V59. Klasyczny skrypt, funkcje globalne.
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

function lifecycleFilteredAircraft(aircraft, performance = readPerformanceSettings()) {
  return (aircraft || []).filter((item) => aircraftVisibleByLifecycle(item, performance));
}

function hiddenOldAircraftCount(aircraft, performance = readPerformanceSettings()) {
  return Math.max(0, (aircraft || []).length - lifecycleFilteredAircraft(aircraft, performance).length);
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
  if (kind === "jet") return ["jet", "airliner", "business", "cargo", "heavy"].includes(group);
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

function browseSettingsAroundAircraft(aircraft) {
  const point = pointFromAircraft(aircraft);
  if (!point) return null;

  let base;
  try {
    base = readBrowseSettings();
  } catch {
    const source = selectedApiSource();
    base = {
      apiKey: apiKeyInput?.value?.trim?.() || "",
      apiBase: validatedApiBase(apiBaseInput?.value || source.apiBase),
      sourceName: dataSourceInput?.value || DEFAULT_DATA_SOURCE,
      lat: point.lat,
      lon: point.lon,
      dist: Number.parseInt(browseDistInput?.value || AUTO_LOAD_RADIUS_NM, 10) || AUTO_LOAD_RADIUS_NM
    };
  }

  return {
    ...base,
    lat: point.lat,
    lon: point.lon,
    dist: Number.isFinite(Number(base.dist)) ? base.dist : AUTO_LOAD_RADIUS_NM
  };
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
