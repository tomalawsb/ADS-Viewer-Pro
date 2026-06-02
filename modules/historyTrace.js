// ADS Viewer Pro - moduł historii trasy
// Wydzielony z app.js wcześniej w wersji V58; podłączony w strukturze V59, aby zmniejszyć główny plik i ułatwić dalsze prace.
(function initHistoryTraceModule() {
  "use strict";

function formatHistoryTraceTime(point) {
  if (!point?.at) return "brak czasu";
  try {
    return new Date(point.at).toLocaleString("pl-PL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  } catch {
    return "brak czasu";
  }
}

function formatHistoryTraceAltitude(point) {
  const altitude = tracePointAltitudeFt(point);
  if (altitude === null) return "brak wysokości";
  return `${Math.round(altitude).toLocaleString("pl-PL")} ft`;
}

function formatHistoryTraceSpeed(point) {
  const speed = tracePointSpeedKt(point);
  if (speed === null) return "brak prędkości";
  return `${Math.round(speed)} kt`;
}

function formatHistoryTraceHeading(point) {
  const heading = finiteNumberOrNull(point?.track);
  if (heading === null) return "brak kursu";
  return `${Math.round(heading)}°`;
}

function historyTracePopupHtml(point, index, count, icao, date) {
  const lat = Number(point?.lat);
  const lon = Number(point?.lon);
  const position = Number.isFinite(lat) && Number.isFinite(lon)
    ? `${lat.toFixed(5)}, ${lon.toFixed(5)}`
    : "brak pozycji";
  return `
    <strong>${icao.toUpperCase()} — punkt ${index + 1}/${count}</strong><br>
    Data: ${date}<br>
    Czas: ${formatHistoryTraceTime(point)}<br>
    Wysokość: ${formatHistoryTraceAltitude(point)}<br>
    Prędkość: ${formatHistoryTraceSpeed(point)}<br>
    Kurs: ${formatHistoryTraceHeading(point)}<br>
    Pozycja: ${position}
  `;
}

function drawHistoryTracePointMarkers(points, icao, date) {
  if (!routeLayer || !window.L) return;
  const clean = (Array.isArray(points) ? points : []).filter(validPoint);
  if (!clean.length) return;
  const step = Math.max(1, Math.ceil(clean.length / TRACE_POINT_MARKER_LIMIT));
  const selectedIndexes = new Set([0, clean.length - 1]);
  for (let index = 0; index < clean.length; index += step) selectedIndexes.add(index);

  for (const index of Array.from(selectedIndexes).sort((a, b) => a - b)) {
    const point = clean[index];
    const isEndpoint = index === 0 || index === clean.length - 1;
    const marker = L.circleMarker([point.lat, point.lon], {
      pane: "routePane",
      radius: isEndpoint ? 6 : 4,
      weight: isEndpoint ? 3 : 2,
      opacity: 0.95,
      fillOpacity: isEndpoint ? 0.95 : 0.78,
      color: isEndpoint ? "#111827" : "#0f172a",
      fillColor: isEndpoint ? "#facc15" : "#ffffff"
    }).addTo(routeLayer);
    marker.bindPopup(historyTracePopupHtml(point, index, clean.length, icao, date));
    marker.bindTooltip(`${formatHistoryTraceTime(point)} • ${formatHistoryTraceAltitude(point)}`, {
      direction: "top",
      sticky: true,
      opacity: 0.92
    });
  }
}

function historyTraceAltitudeBand(point) {
  const altitude = tracePointAltitudeFt(point);
  if (altitude === null) return { label: "brak wysokości", color: "#64748b" };
  if (altitude < 2000) return { label: "bardzo nisko / podejście", color: "#22c55e" };
  if (altitude < 10000) return { label: "wznoszenie / zniżanie", color: "#84cc16" };
  if (altitude < 20000) return { label: "średnia wysokość", color: "#eab308" };
  if (altitude < 30000) return { label: "wysoko", color: "#f97316" };
  return { label: "przelot wysoko", color: "#dc2626" };
}

function historyTraceSegmentColor(a, b) {
  const altA = tracePointAltitudeFt(a);
  const altB = tracePointAltitudeFt(b);
  const alt = altA !== null && altB !== null ? (altA + altB) / 2 : (altA ?? altB);
  return historyTraceAltitudeBand({ alt_baro: alt }).color;
}

function drawHistoryTraceAltitudeRoute(points) {
  if (!map || !routeLayer || !window.L) return null;
  const clean = (Array.isArray(points) ? points : []).filter(validPoint);
  const latLngs = clean.map((point) => [point.lat, point.lon]);
  if (!latLngs.length) return null;

  if (latLngs.length > 1) {
    L.polyline(latLngs, {
      pane: "routePane",
      interactive: false,
      color: "#ffffff",
      weight: 9,
      opacity: 0.88
    }).addTo(routeLayer);

    for (let index = 1; index < clean.length; index += 1) {
      const previous = clean[index - 1];
      const point = clean[index];
      L.polyline([[previous.lat, previous.lon], [point.lat, point.lon]], {
        pane: "routePane",
        interactive: false,
        color: historyTraceSegmentColor(previous, point),
        weight: 5,
        opacity: 0.98
      }).addTo(routeLayer);
    }
  } else if (Number.isFinite(Number(clean[0].track))) {
    drawDirectionLine(routeLayer, clean[0], clean[0].track, clean[0].speed, { color: historyTraceAltitudeBand(clean[0]).color, weight: 4, opacity: 0.96 });
  }

  return L.latLngBounds(latLngs);
}

function historyTracePlaybackIcon(point, active = true) {
  const band = historyTraceAltitudeBand(point);
  const label = active ? "▶" : "●";
  return L.divIcon({
    className: "history-playback-marker",
    html: `<span style="background:${band.color}">${label}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
}

function stopHistoryTracePlayback() {
  if (historyTracePlaybackTimer) {
    clearInterval(historyTracePlaybackTimer);
    historyTracePlaybackTimer = null;
  }
}

function setHistoryTracePlayerEnabled(enabled) {
  [historyTracePlayerSlider, historyTracePlayButton, historyTracePauseButton, historyTraceResetButton].forEach((element) => {
    if (element) element.disabled = !enabled;
  });
  if (historyTracePlayerPanel) historyTracePlayerPanel.hidden = !enabled;
}

function updateHistoryTracePlaybackMarker(index = historyTracePlaybackIndex, options = {}) {
  if (!routeLayer || !window.L || !historyTracePlaybackPoints.length) return;
  const safeIndex = Math.max(0, Math.min(historyTracePlaybackPoints.length - 1, Number(index) || 0));
  historyTracePlaybackIndex = safeIndex;
  const point = historyTracePlaybackPoints[safeIndex];
  if (!validPoint(point)) return;

  if (historyTracePlayerSlider) historyTracePlayerSlider.value = String(safeIndex);
  if (historyTracePlaybackMarker) historyTracePlaybackMarker.remove();
  historyTracePlaybackMarker = L.marker([point.lat, point.lon], {
    pane: "routePane",
    keyboard: false,
    icon: historyTracePlaybackIcon(point, historyTracePlaybackTimer !== null),
    title: `Odtwarzanie: ${formatHistoryTraceTime(point)}`
  }).addTo(routeLayer);
  historyTracePlaybackMarker.bindPopup(historyTracePopupHtml(point, safeIndex, historyTracePlaybackPoints.length, historyTracePlaybackIcao, historyTracePlaybackDate));

  const status = `${safeIndex + 1}/${historyTracePlaybackPoints.length} • ${formatHistoryTraceTime(point)} • ${formatHistoryTraceAltitude(point)} • ${formatHistoryTraceSpeed(point)}`;
  if (historyTracePlayerStatus) historyTracePlayerStatus.textContent = status;
  if (options.pan === true && map) map.panTo([point.lat, point.lon], { animate: true, duration: 0.18 });
}

function prepareHistoryTracePlayback(points, icao, date) {
  stopHistoryTracePlayback();
  historyTracePlaybackPoints = (Array.isArray(points) ? points : []).filter(validPoint);
  historyTracePlaybackIcao = icao || "";
  historyTracePlaybackDate = date || "";
  historyTracePlaybackIndex = 0;
  if (historyTracePlayerSlider) {
    historyTracePlayerSlider.min = "0";
    historyTracePlayerSlider.max = String(Math.max(0, historyTracePlaybackPoints.length - 1));
    historyTracePlayerSlider.value = "0";
  }
  setHistoryTracePlayerEnabled(historyTracePlaybackPoints.length > 0);
  if (historyTracePlaybackPoints.length) updateHistoryTracePlaybackMarker(0, { pan: false });
}

function playHistoryTracePlayback() {
  if (!historyTracePlaybackPoints.length) return;
  stopHistoryTracePlayback();
  historyTracePlaybackTimer = setInterval(() => {
    if (historyTracePlaybackIndex >= historyTracePlaybackPoints.length - 1) {
      stopHistoryTracePlayback();
      updateHistoryTracePlaybackMarker(historyTracePlaybackIndex, { pan: false });
      return;
    }
    updateHistoryTracePlaybackMarker(historyTracePlaybackIndex + 1, { pan: true });
  }, 650);
  updateHistoryTracePlaybackMarker(historyTracePlaybackIndex, { pan: false });
}

function resetHistoryTracePlayback() {
  stopHistoryTracePlayback();
  updateHistoryTracePlaybackMarker(0, { pan: true });
}

function drawHistoryTraceOnMap(points, icao, date, options = {}) {
  enterHistoryMapMode();
  initMap();
  const clean = (Array.isArray(points) ? points : []).filter(validPoint);
  clearAircraftMap();
  if (routeLayer) routeLayer.clearLayers();
  lastRouteBounds = null;

  if (!clean.length) {
    setRouteSummary("Brak punktów trasy do pokazania.");
    prepareHistoryTracePlayback([], icao, date);
    return;
  }

  const bounds = drawHistoryTraceAltitudeRoute(clean);
  drawHistoryTracePointMarkers(clean, icao, date);
  lastRouteBounds = bounds;
  if (bounds && map && options.fitMap !== false) {
    map.fitBounds(bounds.pad(0.18), { maxZoom: clean.length === 1 ? 10 : 11 });
  }
  prepareHistoryTracePlayback(clean, icao, date);
  setRouteSummary(`Historia ${icao.toUpperCase()} ${date}: pokazuję trasę z ${clean.length} punktów. Kolor linii oznacza wysokość: zielony nisko, żółty/pomarańczowy wznoszenie lub zniżanie, czerwony wysoki przelot. Użyj suwaka albo Play, aby odtworzyć lot.`);
}

function historyTraceCacheKey(icao, date) {
  return trackKey(icao, date);
}

function getHistoryTraceCachedPoints(icao, date) {
  const cleanIcao = normalizeIcao(icao);
  const cleanDate = String(date || todayLocalDate()).slice(0, 10);
  if (!isValidIcao(cleanIcao)) return [];
  return loadHistoryTracePoints(cleanIcao, cleanDate).filter(validPoint);
}

function cachedHistoryTraceSummary(points) {
  const clean = (Array.isArray(points) ? points : []).filter(validPoint);
  if (!clean.length) return "brak punktów";
  const first = clean[0]?.at ? new Date(clean[0].at).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "brak czasu";
  const last = clean[clean.length - 1]?.at ? new Date(clean[clean.length - 1].at).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "brak czasu";
  return `${clean.length} punktów, ${first}–${last}`;
}

function setHistoryTraceLoading(isLoading, message = "") {
  if (historyTraceLoadButton) {
    historyTraceLoadButton.disabled = isLoading;
    historyTraceLoadButton.textContent = isLoading ? "Pobieram..." : "Pobierz trasę";
  }
  [historyPrevDayButton, historyTodayButton, historyNextDayButton].forEach((button) => {
    if (button) button.disabled = isLoading;
  });
  if (message) setHistoryTraceStatus(message);
}

function setHistoryTraceStatus(message) {
  if (historyTraceStatus) historyTraceStatus.textContent = message;
}

function collapseHistoryPanelAfterTraceLoaded() {
  // V67: panel historii jest panelem roboczym. Nie zamykamy go po wczytaniu trasy,
  // bo użytkownik ma dalej wygodnie zmieniać datę, odtwarzać lot i eksportować dane.
  invalidateMapSoon?.();
}

function historyTraceDateValue() {
  return historyTraceDateInput?.value || todayLocalDate();
}

let historyTraceAutoLoadTimer = null;

function scheduleHistoryTraceAutoLoad(reason = "zmiana daty") {
  window.clearTimeout(historyTraceAutoLoadTimer);
  const icao = resolveHistoryTraceIcao();
  if (!isValidIcao(icao)) {
    setHistoryTraceStatus("Wybierz samolot albo wpisz HEX / ICAO24. Po zmianie daty trasa wczyta się automatycznie.");
    return;
  }

  historyTraceAutoLoadTimer = window.setTimeout(() => {
    setHistoryTraceStatus(`Automatycznie wczytuję trasę po akcji: ${reason}...`);
    loadHistoryTraceFromFreeSource({ autoLoad: true });
  }, 220);
}

function changeHistoryTraceDay(deltaDays, options = {}) {
  if (!historyTraceDateInput) return;
  const base = new Date(`${historyTraceDateValue()}T12:00:00`);
  if (!Number.isFinite(base.getTime())) {
    historyTraceDateInput.value = todayLocalDate();
    if (options.autoLoad !== false) scheduleHistoryTraceAutoLoad("naprawa daty");
    return;
  }
  base.setDate(base.getDate() + deltaDays);
  historyTraceDateInput.value = base.toISOString().slice(0, 10);
  if (options.autoLoad !== false) scheduleHistoryTraceAutoLoad(deltaDays < 0 ? "poprzedni dzień" : "następny dzień");
}

function setHistoryTraceTodayAndLoad() {
  if (!historyTraceDateInput) return;
  historyTraceDateInput.value = todayLocalDate();
  scheduleHistoryTraceAutoLoad("dzisiaj");
}

function resolveHistoryTraceIcao() {
  const typed = String(historyTraceIcaoInput?.value || "").trim();
  const fromSelected = aircraftIcao(selectedAircraft);
  const fromSearch = normalizeIcao(icaoInput?.value || "");
  const direct = normalizeIcao(typed);
  if (isValidIcao(direct)) return direct;
  if (!typed && isValidIcao(fromSelected)) return fromSelected;
  if (!typed && isValidIcao(fromSearch)) return fromSearch;
  return "";
}

function makeHistoryTraceFlight(icao, date) {
  const live = findAircraftByIcaoInCache(icao) || (aircraftIcao(selectedAircraft) === icao ? selectedAircraft : null);
  const livePoint = pointFromAircraft(live);
  return {
    icao,
    date,
    name: aircraftLabel(live) || icao.toUpperCase(),
    lat: livePoint?.lat ?? "",
    lon: livePoint?.lon ?? "",
    zoom: 9.2
  };
}

async function loadHistoryTraceFromFreeSource(event = null) {
  const icao = resolveHistoryTraceIcao();
  if (!isValidIcao(icao)) {
    showToast("Wpisz poprawny HEX / ICAO24, np. 4ca9c1.", 4200);
    setHistoryTraceStatus("Nie pobrano trasy: wpisz poprawny HEX / ICAO24.");
    return;
  }

  const date = historyTraceDateValue();
  const forceRefresh = event?.shiftKey === true || event?.ctrlKey === true;
  const requestSeq = ++historyTraceRequestSeq;
  const cacheKey = historyTraceCacheKey(icao, date);
  if (historyTraceIcaoInput) historyTraceIcaoInput.value = icao.toUpperCase();
  if (historyTraceDateInput) historyTraceDateInput.value = date;

  const cached = getHistoryTraceCachedPoints(icao, date);
  if (cached.length >= 2 && !forceRefresh) {
    await yieldToUi();
    drawHistoryTraceOnMap(cached, icao, date, { fitMap: true });
    collapseHistoryPanelAfterTraceLoaded();
    setHistoryTraceStatus(`Cache lokalny: ${icao.toUpperCase()} ${date}. Wczytano ${cachedHistoryTraceSummary(cached)} bez ponownego pobierania z internetu. Aby wymusić nowe pobranie, kliknij Pobierz trasę z Ctrl albo Shift.`);
    showToast("Wczytano trasę z cache lokalnego.", 3000);
    return;
  }

  setHistoryTraceLoading(true, cached.length >= 2
    ? `Mam już cache (${cachedHistoryTraceSummary(cached)}), ale wymuszono odświeżenie z internetu...`
    : `Pobieram trasę ${icao.toUpperCase()} z dnia ${date}...`);

  try {
    await yieldToUi();
    const flight = makeHistoryTraceFlight(icao, date);
    const fallbackText = traceSourceCandidates(readApiOnlySettings()).map((item) => sourceLabel(item.sourceName)).join(" → ");
    setRouteSummary(`Historia ${icao.toUpperCase()} ${date}: pobieram publiczne punkty trace w tle...`);
    setHistoryTraceStatus(`Pobieram w tle. Kolejność źródeł: ${fallbackText}.`);

    const result = await runOnceForKey(historyTracePendingRequests, cacheKey, () => loadOfficialTraceDetailed(flight, {
      timeoutMs: TRACE_HISTORY_FETCH_TIMEOUT_MS,
      maxRequestsPerSource: 28,
      onSourceStart: (sourceName, checkedSources) => {
        if (requestSeq !== historyTraceRequestSeq) return;
        if (checkedSources.length === 1) {
          setHistoryTraceStatus(`Sprawdzam źródło główne: ${sourceName}...`);
        } else {
          setHistoryTraceStatus(`Brak pewnych danych z poprzedniego źródła. Sprawdzam awaryjnie: ${sourceName}. Sprawdzone: ${checkedSources.join(" → ")}.`);
        }
      },
      onRequestProgress: ({ sourceName, checkedCount, label }) => {
        if (requestSeq !== historyTraceRequestSeq) return;
        if (checkedCount === 1 || checkedCount % 4 === 0) {
          setHistoryTraceStatus(`Pobieranie w tle: ${sourceName}, próba ${checkedCount}, wariant ${label}. Interfejs pozostaje aktywny.`);
        }
      }
    }));

    if (requestSeq !== historyTraceRequestSeq) return;
    const clean = saveTracePointsIfUseful(icao, date, result.points, { source: result.sourceKey, requestLabel: result.requestLabel });
    if (!clean.length) throw new Error("Źródło zwróciło dane bez prawidłowych punktów GPS.");

    await yieldToUi();
    drawHistoryTraceOnMap(clean, icao, date, { fitMap: true });
    collapseHistoryPanelAfterTraceLoaded();

    const first = clean[0];
    const last = clean[clean.length - 1];
    const firstTime = first?.at ? new Date(first.at).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "brak czasu";
    const lastTime = last?.at ? new Date(last.at).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "brak czasu";
    setHistoryTraceStatus(`OK: ${sourceLabel(result.sourceKey)} / ${result.requestLabel}. Pobrano ${clean.length} punktów. Zakres: ${firstTime}–${lastTime}. Trasa zapisana w osobnym lokalnym cache historii.`);
    showToast(`Pobrano trasę: ${clean.length} punktów z ${sourceLabel(result.sourceKey)}.`, 3600);
  } catch (error) {
    if (requestSeq !== historyTraceRequestSeq) return;
    const fallback = getHistoryTraceCachedPoints(icao, date);
    if (fallback.length >= 2) {
      drawHistoryTraceOnMap(fallback, icao, date, { fitMap: true });
      collapseHistoryPanelAfterTraceLoaded();
      setHistoryTraceStatus(`Internet/API nie zwróciło świeżych danych, ale pokazuję cache lokalny: ${cachedHistoryTraceSummary(fallback)}.`);
      showToast("Pokazuję zapisaną trasę z cache lokalnego.", 3600);
      return;
    }
    const message = explainFetchError(error);
    setHistoryTraceStatus(`Brak trasy dla tej daty albo źródło nie udostępniło trace wprost: ${message}`);
    setRouteSummary(`Historia: nie pobrałem trasy ${icao.toUpperCase()} z dnia ${date}. ${message}`);
    showToast("Nie udało się pobrać historycznej trasy.", 5200);
  } finally {
    if (requestSeq === historyTraceRequestSeq) setHistoryTraceLoading(false);
  }
}


function historyTraceExportBaseName(icao, date) {
  return sanitizeFileName(`historia_${String(icao || "samolot").toUpperCase()}_${date || todayLocalDate()}`, "historia_lotu");
}

function historyTracePointRows(points) {
  const clean = (Array.isArray(points) ? points : []).filter(validPoint);
  return clean.map((point, index) => ({
    lp: index + 1,
    czas_iso: point.at || "",
    czas_lokalny: formatHistoryTraceTime(point),
    lat: point.lat ?? "",
    lon: point.lon ?? "",
    wysokosc_ft: tracePointAltitudeFt(point) ?? "",
    predkosc_kt: tracePointSpeedKt(point) ?? "",
    kurs_stopnie: finiteNumberOrNull(point.track) ?? "",
    wznoszenie_ft_min: finiteNumberOrNull(point.verticalRate) ?? "",
    pasmo_wysokosci: historyTraceAltitudeBand(point).label
  }));
}

function historyTraceExportCsv(points) {
  const header = "lp;czas_iso;czas_lokalny;lat;lon;wysokosc_ft;predkosc_kt;kurs_stopnie;wznoszenie_ft_min;pasmo_wysokosci";
  const rows = historyTracePointRows(points).map((row) => [
    row.lp,
    row.czas_iso,
    row.czas_lokalny,
    row.lat,
    row.lon,
    row.wysokosc_ft,
    row.predkosc_kt,
    row.kurs_stopnie,
    row.wznoszenie_ft_min,
    row.pasmo_wysokosci
  ].map(csvCell).join(";"));
  return [header, ...rows].join("\n");
}

function historyTraceExportJson(icao, date, points) {
  const clean = (Array.isArray(points) ? points : []).filter(validPoint);
  const cache = loadHistoryTraceCache();
  const meta = cache[historyTraceCacheKey(icao, date)] || {};
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    appVersion: APP_VERSION,
    icao: String(icao || "").toUpperCase(),
    date,
    source: meta.source || "",
    requestLabel: meta.requestLabel || "",
    pointCount: clean.length,
    firstAt: clean[0]?.at || "",
    lastAt: clean[clean.length - 1]?.at || "",
    points: clean
  }, null, 2);
}

function historyTraceExportHtml(icao, date, points) {
  const clean = (Array.isArray(points) ? points : []).filter(validPoint);
  const rows = historyTracePointRows(clean).map((row) => `
<tr>
<td>${row.lp}</td>
<td>${escapeHtml(row.czas_lokalny)}</td>
<td>${escapeHtml(row.lat)}</td>
<td>${escapeHtml(row.lon)}</td>
<td>${escapeHtml(row.wysokosc_ft)}</td>
<td>${escapeHtml(row.predkosc_kt)}</td>
<td>${escapeHtml(row.kurs_stopnie)}</td>
<td>${escapeHtml(row.pasmo_wysokosci)}</td>
</tr>`).join("");
  const first = clean[0];
  const last = clean[clean.length - 1];
  const boundsText = first && last
    ? `Od ${escapeHtml(formatHistoryTraceTime(first))} do ${escapeHtml(formatHistoryTraceTime(last))}`
    : "Brak zakresu czasu";
  return `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Historia lotu ${escapeHtml(String(icao || "").toUpperCase())} ${escapeHtml(date)}</title>
<style>
body{font-family:Segoe UI,Arial,sans-serif;margin:24px;background:#f8fafc;color:#0f172a}main{max-width:1180px;margin:auto;background:white;border-radius:18px;padding:24px;box-shadow:0 12px 40px #0002}table{border-collapse:collapse;width:100%;font-size:13px}th,td{border-bottom:1px solid #e5e7eb;text-align:center;padding:7px}th{background:#f1f5f9;position:sticky;top:0}.muted{color:#64748b}.summary{display:flex;gap:10px;flex-wrap:wrap;margin:14px 0}.pill{background:#eef2ff;border:1px solid #c7d2fe;border-radius:999px;padding:8px 12px}.legend{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.legend span{border-radius:999px;padding:6px 10px;background:#f8fafc;border:1px solid #e5e7eb}.green{color:#16a34a}.yellow{color:#ca8a04}.orange{color:#ea580c}.red{color:#dc2626}.gray{color:#64748b}
</style>
</head>
<body><main>
<h1>Historia lotu ${escapeHtml(String(icao || "").toUpperCase())}</h1>
<p class="muted">Data: ${escapeHtml(date)} · Eksport: ${escapeHtml(new Date().toLocaleString("pl-PL"))} · ${escapeHtml(APP_VERSION)}</p>
<div class="summary"><span class="pill">Punkty: <strong>${clean.length}</strong></span><span class="pill">${boundsText}</span></div>
<div class="legend"><span class="green">zielony: nisko</span><span class="yellow">żółty: średnio</span><span class="orange">pomarańczowy: wysoko</span><span class="red">czerwony: przelot wysoko</span><span class="gray">szary: brak wysokości</span></div>
<table><thead><tr><th>Lp.</th><th>Czas</th><th>Lat</th><th>Lon</th><th>Wysokość ft</th><th>Prędkość kt</th><th>Kurs</th><th>Pasmo</th></tr></thead><tbody>${rows}</tbody></table>
</main></body></html>`;
}

async function exportCurrentHistoryTrace() {
  const icao = resolveHistoryTraceIcao();
  const date = historyTraceDateValue();
  if (!isValidIcao(icao)) {
    showToast("Wpisz poprawny HEX / ICAO24 przed eksportem trasy.", 4200);
    return;
  }

  const points = getHistoryTraceCachedPoints(icao, date);
  if (points.length < 2) {
    showToast("Brak pobranej trasy do eksportu. Najpierw kliknij Pobierz trasę.", 5200);
    setHistoryTraceStatus("Eksport przerwany: brak zapisanych punktów trasy dla tej daty i samolotu.");
    return;
  }

  const baseName = historyTraceExportBaseName(icao, date);
  const files = [
    { name: "historia_trasy.csv", blob: blobFromText(historyTraceExportCsv(points), "text/csv;charset=utf-8") },
    { name: "historia_trasy.json", blob: blobFromText(historyTraceExportJson(icao, date, points), "application/json;charset=utf-8") },
    { name: "raport_historia.html", blob: blobFromText(historyTraceExportHtml(icao, date, points), "text/html;charset=utf-8") },
    { name: "opis.txt", blob: blobFromText(`ADS Viewer Pro — eksport historii lotu\nWersja: ${APP_VERSION}\nSamolot: ${icao.toUpperCase()}\nData: ${date}\nPunkty: ${points.length}\nEksport: ${new Date().toLocaleString("pl-PL")}\n`) }
  ];

  try {
    if (window.showDirectoryPicker && typeof writeBlobToDirectory === "function") {
      const directory = await window.showDirectoryPicker({ mode: "readwrite" });
      const writable = await ensureDirectoryWritable(directory);
      if (!writable) throw new Error("Brak zgody na zapis w wybranym folderze.");
      const target = await directory.getDirectoryHandle(baseName, { create: true });
      for (const file of files) await writeBlobToDirectory(target, file.name, file.blob);
      showToast(`Zapisano eksport historii w folderze: ${baseName}`, 6000);
      setHistoryTraceStatus(`Eksport gotowy: zapisano CSV, JSON, HTML i opis w folderze ${baseName}.`);
      return;
    }
  } catch (error) {
    if (error?.name === "AbortError") return;
    console.warn("Eksport do folderu nieudany, używam ZIP jako awaryjnego pobrania.", error);
  }

  const zipBlob = await createZipBlob(files.map((file) => ({ name: `${baseName}/${file.name}`, blob: file.blob })));
  downloadBlob(`${baseName}.zip`, zipBlob);
  showToast("Pobrano eksport historii jako ZIP z plikami CSV/JSON/HTML.", 6000);
  setHistoryTraceStatus(`Eksport gotowy: ${baseName}.zip zawiera CSV, JSON, HTML i opis.`);
}

historySearchInput?.addEventListener("input", renderFlightHistory);
historyTraceLoadButton?.addEventListener("click", loadHistoryTraceFromFreeSource);
historyTraceExportButton?.addEventListener("click", exportCurrentHistoryTrace);
historyPrevDayButton?.addEventListener("click", () => changeHistoryTraceDay(-1));
historyTodayButton?.addEventListener("click", setHistoryTraceTodayAndLoad);
historyNextDayButton?.addEventListener("click", () => changeHistoryTraceDay(1));
historyTraceDateInput?.addEventListener("change", () => scheduleHistoryTraceAutoLoad("zmiana daty w kalendarzu"));
historyTracePlayerSlider?.addEventListener("input", () => {
  stopHistoryTracePlayback();
  updateHistoryTracePlaybackMarker(Number(historyTracePlayerSlider.value), { pan: true });
});
historyTracePlayButton?.addEventListener("click", playHistoryTracePlayback);
historyTracePauseButton?.addEventListener("click", () => {
  stopHistoryTracePlayback();
  updateHistoryTracePlaybackMarker(historyTracePlaybackIndex, { pan: false });
});
historyTraceResetButton?.addEventListener("click", resetHistoryTracePlayback);
setHistoryTracePlayerEnabled(false);


  window.ADSVHistoryTrace = {
    loadHistoryTraceFromFreeSource,
    scheduleHistoryTraceAutoLoad,
    stopHistoryTracePlayback,
    resetHistoryTracePlayback,
    exportCurrentHistoryTrace
  };
})();
