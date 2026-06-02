// ADS Viewer Pro - exportModule.js
// Wydzielone z app.js w wersji V59. Klasyczny skrypt, funkcje globalne.
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

function makeAircraftExportBaseName(aircraft) {
  const icao = aircraftIcao(aircraft).toUpperCase();
  const callsign = aircraftCallsign(aircraft) || "";
  const registration = firstFilled(aircraft?.r, aircraft?.registration);
  return sanitizeFileName([icao, registration, callsign].filter(Boolean).join("_"), "samolot");
}

function makeAircraftExportZipName(aircraft) {
  const icao = aircraftIcao(aircraft).toUpperCase();
  return sanitizeFileName(icao, "samolot");
}

function aircraftExportHistoryRows(aircraft) {
  const icao = aircraftIcao(aircraft);
  const flight = aircraftToFlight(aircraft);
  const latestTrack = loadLatestTrackPoints(icao);
  const points = loadTrackPoints(icao, flight.date).length ? loadTrackPoints(icao, flight.date) : latestTrack.points;
  const history = loadFlightHistory().filter((item) => normalizeIcao(item?.icao || "") === icao);
  return { points, history, trackDate: latestTrack.date || flight.date };
}

function aircraftTrackCsv(aircraft) {
  const { points } = aircraftExportHistoryRows(aircraft);
  const header = "czas;lat;lon;wysokosc_ft;predkosc_kt;kurs;wznoszenie_ft_min";
  const rows = points.map((point) => [
    point.at || "",
    point.lat ?? "",
    point.lon ?? "",
    point.altitude ?? "",
    point.speed ?? "",
    point.track ?? "",
    point.verticalRate ?? ""
  ].map(csvCell).join(";"));
  return [header, ...rows].join("\n");
}

function aircraftSeenHistoryCsv(aircraft) {
  const { history } = aircraftExportHistoryRows(aircraft);
  const header = "pierwszy_wpis;ostatni_wpis;icao;callsign;rejestracja;typ;lat;lon;wysokosc;predkosc;kurs;powod;liczba";
  const rows = history.map((item) => [
    item.firstSeenAt || "",
    item.lastSeenAt || "",
    item.icao || "",
    item.callsign || "",
    item.registration || "",
    item.type || "",
    item.lat || "",
    item.lon || "",
    item.altitude ?? "",
    item.speed ?? "",
    item.heading ?? "",
    item.reason || "",
    item.count || 1
  ].map(csvCell).join(";"));
  return [header, ...rows].join("\n");
}

function aircraftExportPhotoMeta(photoInfo = {}) {
  const hasRealPhoto = photoInfo.real === true && !!photoInfo.blob;
  return {
    fileName: hasRealPhoto ? (photoInfo.fileName || "zdjecie.jpg") : "",
    url: photoInfo.url || "",
    real: hasRealPhoto,
    mimeType: hasRealPhoto ? (photoInfo.blob?.type || photoInfo.mimeType || "") : "",
    sizeBytes: hasRealPhoto ? (photoInfo.blob?.size || photoInfo.sizeBytes || 0) : 0,
    note: hasRealPhoto
      ? "Zapisano prawdziwe zdjęcie samolotu pobrane z API zdjęć."
      : "Brak prawdziwego zdjęcia do zapisania. Grafika poglądowa nie jest dodawana do paczki ZIP."
  };
}

function flattenExportValue(value, prefix = "", rows = []) {
  if (value === undefined || typeof value === "function") return rows;
  if (value === null || typeof value !== "object") {
    rows.push([prefix || "wartosc", value ?? ""]);
    return rows;
  }
  if (Array.isArray(value)) {
    if (!value.length) rows.push([prefix, "[]"]);
    value.forEach((item, index) => flattenExportValue(item, `${prefix}[${index}]`, rows));
    return rows;
  }
  const keys = Object.keys(value);
  if (!keys.length) rows.push([prefix, "{}"]);
  for (const key of keys) {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    flattenExportValue(value[key], nextPrefix, rows);
  }
  return rows;
}

function aircraftCurrentDataCsv(aircraft, photoInfo = {}) {
  const photo = aircraftExportPhotoMeta(photoInfo);
  const rows = [["sekcja", "pole", "wartosc"]];
  for (const [name, value] of aircraftDetailsRows(aircraft)) rows.push(["dane", name, value]);
  for (const [name, value] of routeDetailRows(aircraft)) rows.push(["trasa", name, value]);
  rows.push(["linki", "ADS", buildAdsbUrl(aircraftToFlight(aircraft))]);
  rows.push(["zdjecie", "plik", photo.fileName]);
  rows.push(["zdjecie", "url", photo.url || "brak danych"]);
  rows.push(["zdjecie", "prawdziwe_zdjecie", photo.real ? "tak" : "nie"]);
  for (const [path, value] of flattenExportValue(aircraft)) rows.push(["raw", path, value]);
  return rows.map((row) => row.map(csvCell).join(";")).join("\n");
}

function aircraftExportJson(aircraft, photoInfo = {}) {
  const flight = aircraftToFlight(aircraft);
  const details = Object.fromEntries(aircraftDetailsRows(aircraft));
  const routeDetails = Object.fromEntries(routeDetailRows(aircraft));
  const { points, history, trackDate } = aircraftExportHistoryRows(aircraft);
  return {
    exportedAt: new Date().toISOString(),
    appVersion: APP_VERSION,
    flight,
    details,
    routeDetails,
    route: routeInfoFromAircraft(aircraft),
    rawAircraft: aircraft,
    photo: aircraftExportPhotoMeta(photoInfo),
    adsbUrl: buildAdsbUrl(flight),
    localTrack: { date: trackDate, count: points.length, points },
    localSeenHistory: history
  };
}

function aircraftExportText(aircraft, photoInfo = {}) {
  const flight = aircraftToFlight(aircraft);
  const photo = aircraftExportPhotoMeta(photoInfo);
  const rows = aircraftDetailsRows(aircraft).map(([name, value]) => `${name}: ${value}`);
  const { points, history } = aircraftExportHistoryRows(aircraft);
  return [
    `ADS Viewer Pro — karta samolotu`,
    `Eksport: ${new Date().toLocaleString("pl-PL")}`,
    `Wersja programu: ${APP_VERSION}`,
    "",
    ...rows,
    "",
    `Link ADS: ${buildAdsbUrl(flight)}`,
    `Plik zdjęcia: ${photo.fileName}`,
    photo.url ? `Zdjęcie źródłowe: ${photo.url}` : "Zdjęcie źródłowe: brak danych",
    `Prawdziwe zdjęcie zapisane: ${photo.real ? "tak" : "nie"}`,
    "",
    `Lokalne punkty trasy/przelotu zapisane przez program: ${points.length}`,
    `Lokalne wpisy historii widzeń: ${history.length}`,
    "",
    "Uwaga: pełna historyczna lista dawnych przelotów jest dostępna tylko wtedy, gdy źródło API ją udostępnia albo program wcześniej obserwował ten samolot."
  ].join("\n");
}

function aircraftExportHtml(aircraft, imageFileName, photoInfo = {}) {
  const detailsRows = aircraftDetailsRows(aircraft).map(([name, value]) => `<tr><th>${escapeHtml(name)}</th><td>${escapeHtml(value)}</td></tr>`).join("");
  const routeRows = routeDetailRows(aircraft).map(([name, value]) => `<tr><th>${escapeHtml(name)}</th><td>${escapeHtml(value)}</td></tr>`).join("");
  const photo = aircraftExportPhotoMeta(photoInfo);
  const { points, history } = aircraftExportHistoryRows(aircraft);
  const title = aircraftLabel(aircraft);
  const photoBlock = photo.real && imageFileName
    ? `<div><img src="${escapeHtml(imageFileName)}" alt="Zdjęcie samolotu"><p class="muted">Plik zdjęcia: ${escapeHtml(photo.fileName)} · prawdziwe: tak</p></div>`
    : `<div class="photo-missing"><strong>Brak prawdziwego zdjęcia w eksporcie.</strong><p class="muted">Program nie zapisuje grafiki poglądowej jako zdjęcia samolotu.</p></div>`;
  return `<!doctype html>
<html lang="pl"><head><meta charset="utf-8"><title>${escapeHtml(title)} — ADS Viewer Pro</title>
<style>
body{font-family:Segoe UI,Arial,sans-serif;margin:24px;background:#f8fafc;color:#0f172a}main{max-width:980px;margin:auto;background:white;border-radius:18px;padding:24px;box-shadow:0 12px 40px #0002}img{max-width:360px;border-radius:14px}table{border-collapse:collapse;width:100%;margin:16px 0}th,td{border-bottom:1px solid #e5e7eb;text-align:left;padding:8px}th{width:230px;color:#475569}.muted{color:#64748b}.grid{display:grid;grid-template-columns:380px 1fr;gap:20px}.photo-missing{border:1px dashed #cbd5e1;border-radius:14px;padding:18px;background:#f8fafc}@media(max-width:760px){.grid{grid-template-columns:1fr}}
</style></head><body><main>
<h1>${escapeHtml(title)}</h1>
<p class="muted">Eksport: ${escapeHtml(new Date().toLocaleString("pl-PL"))} · ${escapeHtml(APP_VERSION)}</p>
<div class="grid">${photoBlock}<div><table>${detailsRows}</table></div></div>
<h2>Trasa / przelot</h2><table>${routeRows}</table>
<p>Lokalne punkty trasy zapisane przez program: <strong>${points.length}</strong></p>
<p>Lokalne wpisy historii widzeń: <strong>${history.length}</strong></p>
<p>Link ADS: <a href="${escapeHtml(buildAdsbUrl(aircraftToFlight(aircraft)))}">otwórz</a></p>
${photo.url ? `<p>Źródło zdjęcia: <a href="${escapeHtml(photo.url)}">${escapeHtml(photo.url)}</a></p>` : ""}
</main></body></html>`;
}

async function ensureDirectoryWritable(directoryHandle) {
  if (!directoryHandle || typeof directoryHandle.queryPermission !== "function") return true;
  const options = { mode: "readwrite" };
  let permission = await directoryHandle.queryPermission(options);
  if (permission === "granted") return true;
  if (typeof directoryHandle.requestPermission === "function") {
    permission = await directoryHandle.requestPermission(options);
  }
  return permission === "granted";
}

async function writeBlobToDirectory(directoryHandle, fileName, blob) {
  const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  try {
    await writable.write(blob);
  } finally {
    await writable.close();
  }
}

async function writeTextToDirectory(directoryHandle, fileName, text, type = "text/plain;charset=utf-8") {
  await writeBlobToDirectory(directoryHandle, fileName, blobFromText(text, type));
}

function downloadBlob(fileName, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function dosDateTime(date = new Date()) {
  const year = Math.max(1980, date.getFullYear());
  const dosTime = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { dosDate, dosTime };
}

function crc32Table() {
  if (crcTableCache) return crcTableCache;
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c >>> 0;
  }
  crcTableCache = table;
  return table;
}

function crc32(bytes) {
  const table = crc32Table();
  let c = 0xffffffff;
  for (const b of bytes) c = table[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

async function blobToUint8Array(blob) {
  return new Uint8Array(await blob.arrayBuffer());
}

function uint16(value) {
  return [value & 0xff, (value >>> 8) & 0xff];
}

function uint32(value) {
  return [value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff];
}

async function createZipBlob(files) {
  const encoder = new TextEncoder();
  const chunks = [];
  const central = [];
  let offset = 0;
  const { dosDate, dosTime } = dosDateTime();

  for (const file of files) {
    const nameBytes = encoder.encode(file.name.replace(/\\/g, "/"));
    const dataBytes = await blobToUint8Array(file.blob);
    const crc = crc32(dataBytes);
    const localHeader = new Uint8Array([
      ...uint32(0x04034b50), ...uint16(20), ...uint16(0), ...uint16(0),
      ...uint16(dosTime), ...uint16(dosDate), ...uint32(crc),
      ...uint32(dataBytes.length), ...uint32(dataBytes.length),
      ...uint16(nameBytes.length), ...uint16(0)
    ]);
    chunks.push(localHeader, nameBytes, dataBytes);

    const centralHeader = new Uint8Array([
      ...uint32(0x02014b50), ...uint16(20), ...uint16(20), ...uint16(0), ...uint16(0),
      ...uint16(dosTime), ...uint16(dosDate), ...uint32(crc),
      ...uint32(dataBytes.length), ...uint32(dataBytes.length),
      ...uint16(nameBytes.length), ...uint16(0), ...uint16(0), ...uint16(0),
      ...uint16(0), ...uint32(0), ...uint32(offset)
    ]);
    central.push(centralHeader, nameBytes);
    offset += localHeader.length + nameBytes.length + dataBytes.length;
  }

  const centralSize = central.reduce((sum, part) => sum + part.length, 0);
  const centralOffset = offset;
  const endRecord = new Uint8Array([
    ...uint32(0x06054b50), ...uint16(0), ...uint16(0),
    ...uint16(files.length), ...uint16(files.length),
    ...uint32(centralSize), ...uint32(centralOffset), ...uint16(0)
  ]);

  return new Blob([...chunks, ...central, endRecord], { type: "application/zip" });
}

function safeZipName(name) {
  return String(name || "eksport").replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").replace(/\s+/g, "_").slice(0, 120) || "eksport";
}

async function downloadAircraftExportZip(zipName, files, innerFolderName = zipName) {
  const safeZip = safeZipName(zipName);
  const safeFolder = safeZipName(innerFolderName || zipName);
  const zipFiles = files.map((file) => ({
    name: `${safeFolder}/${file.name}`,
    blob: file.blob
  }));
  const zipBlob = await createZipBlob(zipFiles);
  downloadBlob(`${safeZip}.zip`, zipBlob);
}

async function buildAircraftExportFiles(aircraft, baseName) {
  let photoInfo;
  try {
    photoInfo = await aircraftPhotoBlobForExport(aircraft);
  } catch (photoError) {
    console.warn("Nie udało się pobrać prawdziwego zdjęcia. Eksport będzie bez pliku zdjęcia.", photoError);
    photoInfo = {
      blob: null,
      fileName: "",
      url: "",
      real: false
    };
  }

  const photo = aircraftExportPhotoMeta(photoInfo);
  const files = [
    {
      name: "_eksport_start.txt",
      blob: blobFromText(`Eksport rozpoczęty: ${new Date().toLocaleString("pl-PL")}\nWersja: ${APP_VERSION}\nSamolot: ${aircraftLabel(aircraft)}\nFolder: ${baseName}\n`)
    },
    { name: "dane.json", blob: blobFromText(JSON.stringify(aircraftExportJson(aircraft, photoInfo), null, 2), "application/json;charset=utf-8") },
    { name: "aktualne_dane.csv", blob: blobFromText(aircraftCurrentDataCsv(aircraft, photoInfo), "text/csv;charset=utf-8") },
    { name: "opis.txt", blob: blobFromText(aircraftExportText(aircraft, photoInfo)) },
    { name: "historia_trasy.csv", blob: blobFromText(aircraftTrackCsv(aircraft), "text/csv;charset=utf-8") },
    { name: "historia_widzen.csv", blob: blobFromText(aircraftSeenHistoryCsv(aircraft), "text/csv;charset=utf-8") },
    { name: "raport.html", blob: blobFromText(aircraftExportHtml(aircraft, photo.fileName, photoInfo), "text/html;charset=utf-8") },
    { name: "zdjecie_zrodlo.txt", blob: blobFromText(photo.url || "Brak prawdziwego zdjęcia. Nie zapisano grafiki poglądowej.") },
    {
      name: "_eksport_zakonczony.txt",
      blob: blobFromText(`Eksport zakończony: ${new Date().toLocaleString("pl-PL")}\nFolder: ${baseName}\nPlik zdjęcia: ${photo.fileName}\nPrawdziwe zdjęcie: ${photo.real ? "tak" : "nie"}\n`)
    }
  ];

  if (photoInfo.blob) {
    files.splice(7, 0, { name: photo.fileName, blob: photoInfo.blob });
  }

  return files;
}

async function exportSelectedAircraftToFolder(event) {
  event?.preventDefault?.();
  event?.stopPropagation?.();

  if (!selectedAircraft) {
    alert("Najpierw wybierz samolot do eksportu.");
    showToast("Najpierw wybierz samolot.");
    return;
  }

  const aircraft = { ...selectedAircraft };
  try {
    startBusy("Przygotowuję plik DOCX z zestawieniem samolotu...");
    const fileName = await downloadAeroStyleDocxForAircraft(aircraft);
    finishBusy();
    showToast(`Pobrano zestawienie DOCX: ${fileName}`, 9000);
  } catch (error) {
    finishBusy();
    console.error("Nie udało się przygotować DOCX:", error);
    alert(`Nie udało się przygotować DOCX:
${error?.message || error?.name || "nieznany błąd"}`);
  }
}
