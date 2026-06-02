// ADS Viewer Pro - uiPanels.js
// Wydzielone z app.js w wersji V59. Klasyczny skrypt, funkcje globalne.
function isSavePanelOpen() {
  const panel = document.getElementById("savePanel");
  return Boolean(drawer?.classList.contains("is-open") && panel?.classList.contains("is-active"));
}

function markManualSearchInput(value = icaoInput?.value || "") {
  if (!icaoInput) return;
  icaoInput.dataset.manualSearchActive = "1";
  icaoInput.dataset.manualSearchValue = String(value || "");
  icaoInput.dataset.manualSearchAt = String(Date.now());
}

function clearManualSearchInputLock() {
  if (!icaoInput) return;
  delete icaoInput.dataset.manualSearchActive;
  delete icaoInput.dataset.manualSearchValue;
  delete icaoInput.dataset.manualSearchAt;
}

function manualSearchInputLocked() {
  if (!icaoInput || icaoInput.dataset.manualSearchActive !== "1") return false;
  const startedAt = Number(icaoInput.dataset.manualSearchAt || 0);
  if (!Number.isFinite(startedAt) || startedAt <= 0) return isSavePanelOpen();
  const stillFresh = Date.now() - startedAt <= MANUAL_SEARCH_INPUT_LOCK_MS;
  if (!stillFresh && !isSavePanelOpen()) {
    clearManualSearchInputLock();
    return false;
  }
  return true;
}

function shouldPreserveManualSearchInput(options = {}) {
  return options.force !== true && manualSearchInputLocked();
}

function updateAircraftSheetLiveDetails(aircraft) {
  if (!aircraft) return;
  const verticalRate = aircraftVerticalRate(aircraft);
  const freshness = aircraftFreshnessInfo(aircraft);
  const hexValue = normalizeIcao(firstFilled(aircraft?.hex, aircraft?.icao, aircraft?.icao24)).toUpperCase() || "brak danych";
  const positionValue = aircraftPositionText(aircraft);
  const sourceValue = aircraftSourceText(aircraft);
  if (aircraftSheetFreshness) setFreshnessBadge(aircraftSheetFreshness, aircraft);
  if (aircraftSheetHex) {
    aircraftSheetHex.textContent = hexValue;
    enableCopyableAircraftValue(aircraftSheetHex, hexValue, "HEX / #");
  }
  if (aircraftSheetHeading) aircraftSheetHeading.textContent = formatHeading(aircraftHeading(aircraft));
  if (aircraftSheetVerticalRate) {
    const rateText = Number.isFinite(verticalRate)
      ? `${verticalRate > 0 ? "+" : ""}${numberText(verticalRate)} ft/m`
      : "brak danych";
    aircraftSheetVerticalRate.textContent = rateText;
    aircraftSheetVerticalRate.classList.toggle("is-positive", Number.isFinite(verticalRate) && verticalRate > 0);
    aircraftSheetVerticalRate.classList.toggle("is-negative", Number.isFinite(verticalRate) && verticalRate < 0);
  }
  if (aircraftSheetLastSignal) aircraftSheetLastSignal.textContent = `Ostatni sygnał: ${freshness.ageText}`;
  if (aircraftSheetPosition) {
    aircraftSheetPosition.textContent = positionValue;
    enableCopyableAircraftValue(aircraftSheetPosition, positionValue, "pozycję");
  }
  if (aircraftSheetSource) aircraftSheetSource.textContent = sourceValue;
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
  updateSelectedAircraftMarkerHighlight();
  const label = aircraftLabel(aircraft);
  const registration = firstFilled(aircraft?.r, aircraft?.registration, normalizeIcao(aircraft?.hex || "").toUpperCase(), "brak danych");
  const type = firstFilled(
    aircraft?.t,
    aircraft?.type,
    aircraft?.aircraftType,
    aircraftKind(aircraft),
    aircraftGroupLabel(aircraftTypeGroup(aircraft)),
    "brak danych"
  );
  const route = routePartsForDisplay(aircraft);
  const operator = airlineGuessFromCallsign(aircraft) || "brak danych";

  if (aircraftSheetCallsign) aircraftSheetCallsign.textContent = label;
  if (aircraftSheetType) aircraftSheetType.textContent = `${type} · ${registration}`;
  if (aircraftSheetOperator) aircraftSheetOperator.textContent = operator;
  if (aircraftSheetRouteFrom) aircraftSheetRouteFrom.textContent = route.from;
  if (aircraftSheetRouteTo) aircraftSheetRouteTo.textContent = route.to;
  if (aircraftSheetRouteFromMeta) aircraftSheetRouteFromMeta.textContent = "start";
  if (aircraftSheetRouteToMeta) aircraftSheetRouteToMeta.textContent = "cel";
  if (aircraftSheetRouteCaption) aircraftSheetRouteCaption.textContent = route.caption;
  if (aircraftSheetAltitude) aircraftSheetAltitude.textContent = formatAltitude(aircraft?.alt_baro);
  if (aircraftSheetSpeed) aircraftSheetSpeed.textContent = formatSpeed(aircraft?.gs);
  if (aircraftSheetRegistration) aircraftSheetRegistration.textContent = registration;
  if (aircraftSheetPhaseIcon) aircraftSheetPhaseIcon.innerHTML = aircraftPhaseMarkup(aircraft);
  updateAircraftSheetRouteProgress(aircraft);
  if (aircraftSheetPhaseText) aircraftSheetPhaseText.textContent = aircraftFlightPhase(aircraft).detail;
  updateAircraftSheetLiveDetails(aircraft);
  if (aircraftSheetPhoto) setAircraftPhoto(aircraftSheetPhoto, aircraft, { realPhoto: true });

  if (aircraftSheetMorePanel) renderAircraftDetailsPanel(aircraft);
  setAircraftDetailsVisible(false);
  aircraftSheet.hidden = false;
  aircraftSheet.classList.remove("is-expanded", "is-dragging", "is-half-hidden");
  aircraftSheet.style.removeProperty("--sheet-drag-y");
  aircraftSheet.classList.add("is-open");
  setAircraftActionsMode(true);
}

function hideSelectedAircraftSheet() {
  if (!aircraftSheet) return;
  setAircraftActionsMode(false);
  aircraftSheet.classList.remove("is-open", "is-expanded", "is-dragging", "is-half-hidden");
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

  const popupActions = document.createElement("div");
  popupActions.className = "map-popup-actions";

  const historyButton = document.createElement("button");
  historyButton.type = "button";
  historyButton.className = "secondary-button popup-history-button";
  historyButton.textContent = "Historia";
  historyButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    openHistoryTraceSettingsForAircraft(aircraft, { fromPopup: true });
  });

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
  popupActions.append(historyButton, saveButton);
  wrapper.append(popupActions);

  return wrapper;
}

function metricCard(label, value) {
  const card = document.createElement("div");
  card.className = "metric-card";
  card.append(createTextElement("span", "metric-label", label), createTextElement("strong", "metric-value", value));
  return card;
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

function startBusy(message) {
  if (manualBusyRelease) manualBusyRelease();
  manualBusyRelease = beginBusy(message);
}

function finishBusy() {
  if (!manualBusyRelease) return;
  const release = manualBusyRelease;
  manualBusyRelease = null;
  release();
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

function setAircraftActionsMode(active) {
  document.body.classList.toggle("aircraft-actions-mode", active === true);
  if (active) closeBottomMoreMenu();
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
  drawer.classList.remove("is-open", "is-expanded", "is-dragging", "is-history-panel");
  drawer.style.removeProperty("--sheet-drag-y");
  drawer.setAttribute("aria-hidden", "true");
  for (const panel of drawer.querySelectorAll(".drawer-panel")) panel.classList.remove("is-active");
  for (const button of bottomNavButtons) button.classList.remove("is-active");
  closeBottomMoreMenu();
  invalidateMapSoon();
}

function openDrawerPanel(panelId, title = "Panel", options = {}) {
  const panel = document.getElementById(panelId);
  if (!drawer || !panel) return;

  if (panelId === "alertsPanel") prepareAlertsPanelForSelectedAircraft();

  const alreadyOpen = drawer.classList.contains("is-open") && panel.classList.contains("is-active");
  if (alreadyOpen && options.forceOpen !== true) {
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
  drawer.classList.toggle("is-history-panel", panelId === "historyPanel");
  drawer.style.removeProperty("--sheet-drag-y");
  drawer.classList.add("is-open");
  drawer.setAttribute("aria-hidden", "false");
  invalidateMapSoon();
}

function openHistoryTraceSettingsForAircraft(aircraft = selectedAircraft, options = {}) {
  const icao = aircraftIcao(aircraft) || normalizeIcao(icaoInput?.value || "");
  openDrawerPanel("historyPanel", "Historia przelotów", { forceOpen: true });

  if (!isValidIcao(icao)) {
    showToast("Nie mam poprawnego HEX / ICAO24 dla wybranego samolotu.", 4200);
    window.setTimeout(() => historyTraceIcaoInput?.focus?.({ preventScroll: true }), 80);
    return false;
  }

  selectedAircraft = aircraft || selectedAircraft;
  if (historyTraceIcaoInput) historyTraceIcaoInput.value = icao.toUpperCase();
  if (historyTraceDateInput && !historyTraceDateInput.value) historyTraceDateInput.value = todayLocalDate();
  window.setTimeout(() => {
    historyTraceIcaoInput?.focus?.({ preventScroll: true });
    historyTraceLoadButton?.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
  }, 80);
  showToast(`Ustawiono historię dla ${icao.toUpperCase()}. Wybierz datę i kliknij „Pobierz trasę”.`, 4200);
  return true;
}

function applyAppVersion() {
  if (appVersionBadge) appVersionBadge.textContent = APP_VERSION.startsWith("V") ? APP_VERSION : `v${APP_VERSION}`;
  if (settingsVersionBadge) settingsVersionBadge.textContent = APP_VERSION.startsWith("V") ? APP_VERSION : `v${APP_VERSION}`;
  document.title = `ADS Viewer Pro ${APP_VERSION}`;
  document.documentElement.dataset.appVersion = APP_VERSION_STAMP;

  const previousBuild = storageGet(APP_BUILD_STORAGE_KEY, "");
  if (previousBuild && previousBuild !== APP_VERSION) {
    localStorage.removeItem(TRACK_STORAGE_KEY);
    traceApiAttemptedAt.clear();
  }
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

function setAircraftStatus(message) {
  if (aircraftStatus) aircraftStatus.textContent = message;
  updateStatusPanel(message, String(message || "").toLowerCase().includes("błąd") || String(message || "").toLowerCase().includes("nie uda") ? "error" : "info");
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
  try {
    setDefaultBrowseRadius();
    await checkStartupPermissions();
    const located = await locateUser({ autoLoad: true, startup: true });
    if (!located) {
      // Jeżeli przeglądarka/PWA blokuje lokalizację, aplikacja ma nadal załadować radar
      // z domyślnego środka mapy zamiast zostawiać pusty ekran.
      initMap();
      syncBrowseInputsFromMapCenter();
      setAircraftStatus("Nie pobrano lokalizacji. Ładuję samoloty z domyślnego środka mapy.");
      await loadAircraft();
    }
  } finally {
    startupAutoLoadInProgress = false;
  }
}

function isInsideFloatingUi(target) {
  return Boolean(target?.closest?.(".control-column, .aircraft-sheet, .bottom-nav, .bottom-more-menu, .map-floating-controls, .leaflet-marker-icon, .leaflet-control, .toast, .busy-overlay"));
}

function installBottomDrag(handle, panel, closeCallback, options = {}) {
  if (!handle || !panel) return;
  let startY = 0;
  let lastDelta = 0;
  let dragging = false;
  let startedHalfHidden = false;

  const supportsHalfHidden = () => {
    return options.halfHidden === true && window.matchMedia?.("(max-width: 760px)")?.matches;
  };

  const resetDrag = () => {
    dragging = false;
    lastDelta = 0;
    startedHalfHidden = false;
    panel.classList.remove("is-dragging");
    panel.style.removeProperty("--sheet-drag-y");
  };

  handle.addEventListener("pointerdown", (event) => {
    if (!panel.classList.contains("is-open")) return;
    event.preventDefault();
    event.stopPropagation();
    startY = event.clientY;
    lastDelta = 0;
    startedHalfHidden = supportsHalfHidden() && panel.classList.contains("is-half-hidden");
    dragging = true;
    panel.classList.add("is-dragging");
    handle.setPointerCapture?.(event.pointerId);
  });

  handle.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    event.preventDefault();
    event.stopPropagation();
    lastDelta = event.clientY - startY;

    if (supportsHalfHidden() && startedHalfHidden) {
      panel.style.setProperty("--sheet-drag-y", `calc(var(--sheet-half-y, 50%) + ${lastDelta}px)`);
      return;
    }

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
    const useHalfHidden = supportsHalfHidden();
    const wasHalfHidden = startedHalfHidden;
    resetDrag();

    if (useHalfHidden) {
      if (delta > 230 || (wasHalfHidden && delta > 70)) {
        panel.classList.remove("is-expanded", "is-half-hidden");
        closeCallback?.();
      } else if (delta > 45) {
        panel.classList.remove("is-expanded");
        panel.classList.add("is-half-hidden");
        invalidateMapSoon();
      } else if (delta < -45) {
        panel.classList.remove("is-half-hidden");
        panel.classList.add("is-expanded");
        invalidateMapSoon();
      } else if (Math.abs(delta) <= 8) {
        invalidateMapSoon();
      } else {
        panel.classList.remove("is-half-hidden");
        invalidateMapSoon();
      }
      return;
    }

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
