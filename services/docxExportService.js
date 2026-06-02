/* ADS Viewer Pro — serwis eksportu DOCX w układzie Aero.
   Wydzielone z app.js, żeby ograniczyć monolit i ułatwić dalsze poprawki eksportu. */

function docxEscapeXml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;"
  }[char]));
}

function docxCell(value, options = {}) {
  const width = options.width || 2400;
  const fill = options.fill ? `<w:shd w:fill="${options.fill}"/>` : "";
  const bold = options.bold ? "<w:b/>" : "";
  const text = firstFilled(value, "-");
  return `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/><w:vAlign w:val="center"/>${fill}</w:tcPr><w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr>${bold}<w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr><w:t xml:space="preserve">${docxEscapeXml(text)}</w:t></w:r></w:p></w:tc>`;
}

function docxRow(values, options = {}) {
  const widths = options.widths || [];
  return `<w:tr>${values.map((value, index) => docxCell(value, {
    width: widths[index] || 2400,
    bold: options.bold,
    fill: options.fill
  })).join("")}</w:tr>`;
}

function docxImageCell(width = 5200) {
  return `<w:tc><w:tcPr><w:tcW w:w="${width}" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr><w:p><w:pPr><w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr><w:r><w:drawing><wp:inline xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" distT="0" distB="0" distL="0" distR="0"><wp:extent cx="3150000" cy="1900000"/><wp:docPr id="1" name="Zdjęcie samolotu"/><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="0" name="zdjecie"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rIdImage1"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="3150000" cy="1900000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p></w:tc>`;
}

function docxPhotoCell(photoInfo, width = 5200) {
  if (photoInfo?.real === true && photoInfo?.blob) return docxImageCell(width);
  return docxCell("brak", { width });
}


function absoluteUrlOrEmpty(url, base = "") {
  try {
    return new URL(String(url || "").trim(), base || window.location.href).toString();
  } catch {
    return String(url || "").trim();
  }
}

async function fetchTextWithCorsFallbacks(url, timeoutMs = 8000) {
  let lastError = null;
  for (const attemptUrl of [url, ...CORS_PROXY_BUILDERS.map((builder) => builder(url))]) {
    try {
      const response = await fetchWithTimeout(attemptUrl, { headers: { "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" } }, timeoutMs);
      if (!response.ok) throw new Error(`Źródło zwróciło ${response.status}.`);
      return await response.text();
    } catch (error) {
      lastError = error;
    }
  }
  if (lastError) throw lastError;
  return "";
}

async function fetchJsonWithCorsFallbacks(url, timeoutMs = 8000) {
  let lastError = null;
  for (const attemptUrl of [url, ...CORS_PROXY_BUILDERS.map((builder) => builder(url))]) {
    try {
      const response = await fetchWithTimeout(attemptUrl, { headers: { "Accept": "application/json" } }, timeoutMs);
      if (!response.ok) throw new Error(`Źródło zwróciło ${response.status}.`);
      return await response.json();
    } catch (error) {
      lastError = error;
    }
  }
  if (lastError) throw lastError;
  return null;
}

function htmlDecodedText(value) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<body>${String(value || "")}</body>`, 'text/html');
  return String(doc.body?.textContent || "").replace(/\s+/g, ' ').trim();
}

function htmlFieldValue(html, labels = []) {
  const source = String(html || "");
  for (const label of labels) {
    const escaped = String(label).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*');
    const patterns = [
      new RegExp(`<t[dh][^>]*>\\s*${escaped}\\s*</t[dh]>\\s*<t[dh][^>]*>([\\s\\S]*?)</t[dh]>`, 'i'),
      new RegExp(`${escaped}\\s*</[^>]+>\\s*<[^>]+>([\\s\\S]*?)</[^>]+>`, 'i'),
      new RegExp(`${escaped}\\s*:?\\s*</[^>]+>\\s*<[^>]+>([\\s\\S]*?)</[^>]+>`, 'i')
    ];
    for (const pattern of patterns) {
      const match = source.match(pattern);
      if (match && match[1]) {
        const cleaned = htmlDecodedText(match[1].replace(/<br\s*\/?>/gi, ' / ').replace(/<[^>]+>/g, ' '));
        if (cleaned) return cleaned;
      }
    }
  }
  return "";
}

function titleTextFromHtml(html) {
  const match = String(html || "").match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? htmlDecodedText(match[1]) : "";
}

function manufacturerFromType(typeText) {
  const source = String(typeText || "").trim();
  if (!source) return "";
  const known = [
    'Airbus', 'Boeing', 'Embraer', 'Bombardier', 'ATR', 'Antonov', 'Cessna', 'Gulfstream', 'Dassault', 'Pilatus',
    'Beechcraft', 'Lockheed', 'McDonnell Douglas', 'Douglas', 'Saab', 'Fokker', 'Tupolev', 'Ilyushin', 'De Havilland'
  ];
  const found = known.find((item) => source.toLowerCase().startsWith(item.toLowerCase()));
  if (found) return found;
  return source.split(/\s+/)[0] || "";
}

function jetPhotosDetailLinksFromHtml(html, baseUrl) {
  const links = [];
  const seen = new Set();
  const pattern = /href=["']([^"']*\/photo\/\d+[^"']*)["']/ig;
  let match;
  while ((match = pattern.exec(String(html || "")))) {
    const absolute = absoluteUrlOrEmpty(match[1], baseUrl);
    if (absolute && !seen.has(absolute)) {
      seen.add(absolute);
      links.push(absolute);
    }
    if (links.length >= 5) break;
  }
  return links;
}

async function fetchJetPhotosMetadata(registration) {
  const reg = cleanAircraftRegistration(registration);
  if (!reg) return null;
  const searchUrl = `https://www.jetphotos.com/registration/${encodeURIComponent(reg)}`;
  let listingHtml = "";
  try {
    listingHtml = await fetchTextWithCorsFallbacks(searchUrl, 9000);
  } catch {
    return null;
  }
  const detailLinks = jetPhotosDetailLinksFromHtml(listingHtml, searchUrl);
  for (const detailUrl of detailLinks) {
    try {
      const detailHtml = await fetchTextWithCorsFallbacks(detailUrl, 9000);
      const title = titleTextFromHtml(detailHtml);
      const titleParts = title.split('|').map((item) => item.trim()).filter(Boolean);
      const titleType = titleParts[1] || "";
      const titleOperator = titleParts[2] || "";
      const serial = firstFilled(
        htmlFieldValue(detailHtml, ['Serial #', 'Serial Number', 'MSN']),
        htmlFieldValue(detailHtml, ['Construction Number'])
      );
      const airline = firstFilled(htmlFieldValue(detailHtml, ['Airline']), titleOperator);
      const aircraftType = firstFilled(htmlFieldValue(detailHtml, ['Aircraft']), titleType);
      const manufacturer = firstFilled(htmlFieldValue(detailHtml, ['Manufacturer']), manufacturerFromType(aircraftType));
      const result = {
        registration: reg,
        r: reg,
        aircraftType,
        type: aircraftType,
        t: aircraftType,
        operator: airline,
        owner: airline,
        airline,
        manufacturer,
        serial_number: serial,
        serialNumber: serial,
        msn: serial,
        source_url: detailUrl,
        _jetPhotosSource: detailUrl
      };
      if (result.aircraftType || result.operator || result.serial_number || result.manufacturer) return result;
    } catch {
      // próbujemy kolejny wynik
    }
  }
  return null;
}

async function fetchAdsbDbAircraftMetadata(aircraft) {
  const cleanIcao = normalizeIcao(firstFilled(aircraft?.hex, aircraft?.icao, aircraft?.icao24));
  if (!cleanIcao) return null;
  const url = `${ADSBDB_AIRCRAFT_API_BASE_URL}${cleanIcao.toUpperCase()}`;
  try {
    const data = await fetchJsonWithCorsFallbacks(url, 8000);
    const root = data?.response?.aircraft || data?.response || data?.aircraft || data || {};
    const registration = firstFilled(root.registration, root.reg, root.tail, root.n_number);
    const aircraftType = firstFilled(root.type, root.icao_type, root.icaoType, root.aircraft_type, root.model, root.aircraft, root.description);
    const manufacturer = firstFilled(root.manufacturer, root.make);
    const owner = firstFilled(root.registered_owner, root.owner, root.operator, root.airline, root.op);
    const serial = firstFilled(root.serial_number, root.serial, root.serialNumber, root.msn, root.cn, root.construction_number, root.constructionNumber);
    const result = {
      hex: cleanIcao,
      icao: cleanIcao,
      registration,
      r: registration,
      aircraftType,
      type: aircraftType,
      t: aircraftType,
      manufacturer,
      operator: owner,
      owner,
      airline: owner,
      serial_number: serial,
      serialNumber: serial,
      msn: serial,
      line_number: firstFilled(root.line_number, root.lineNumber, root.line_no),
      first_flight: firstFilled(root.first_flight, root.firstFlight, root.firstFlightDate),
      delivery_date: firstFilled(root.delivery_date, root.deliveryDate, root.delivery, root.delivered),
      engines: firstFilled(root.engines, root.engine, root.engine_type, root.engineType),
      configuration: firstFilled(root.configuration, root.config),
      country: firstFilled(root.country, root.registration_country, root.flag)
    };
    if (Object.values(result).some((value) => String(value || '').trim())) return result;
  } catch {
    return null;
  }
  return null;
}

function mergeAircraftExportData(primary, extra) {
  const base = primary && typeof primary === 'object' ? primary : {};
  const supplement = extra && typeof extra === 'object' ? extra : {};
  const merged = { ...supplement, ...base };
  const registration = firstFilled(base.r, base.registration, supplement.r, supplement.registration);
  const aircraftType = firstFilled(base.t, base.type, base.aircraftType, supplement.t, supplement.type, supplement.aircraftType);
  const operator = firstFilled(base.operator, base.owner, base.airline, supplement.operator, supplement.owner, supplement.airline);
  const manufacturer = firstFilled(base.manufacturer, base.make, supplement.manufacturer, supplement.make);
  const serial = firstFilled(base.serial_number, base.serialNumber, base.msn, base.MSN, base.cn, base.constructionNumber, supplement.serial_number, supplement.serialNumber, supplement.msn, supplement.MSN, supplement.cn, supplement.constructionNumber);
  const lineNumber = firstFilled(base.line_number, base.lineNumber, base.ln, supplement.line_number, supplement.lineNumber, supplement.ln);
  const firstFlight = firstFilled(base.first_flight, base.firstFlight, base.firstFlightDate, supplement.first_flight, supplement.firstFlight, supplement.firstFlightDate);
  const deliveryDate = firstFilled(base.delivery_date, base.deliveryDate, base.delivery, base.delivered, supplement.delivery_date, supplement.deliveryDate, supplement.delivery, supplement.delivered);
  const engines = firstFilled(base.engines, base.engine, base.engine_type, base.engineType, supplement.engines, supplement.engine, supplement.engine_type, supplement.engineType);
  const configuration = firstFilled(base.configuration, base.config, supplement.configuration, supplement.config);
  const country = firstFilled(base.country, base.registration_country, base.flag, supplement.country, supplement.registration_country, supplement.flag);
  if (registration) merged.r = merged.registration = registration;
  if (aircraftType) merged.t = merged.type = merged.aircraftType = aircraftType;
  if (operator) merged.operator = merged.owner = merged.airline = operator;
  if (manufacturer) merged.manufacturer = merged.make = manufacturer;
  if (serial) merged.serial_number = merged.serialNumber = merged.msn = serial;
  if (lineNumber) merged.line_number = merged.lineNumber = lineNumber;
  if (firstFlight) merged.first_flight = merged.firstFlight = merged.firstFlightDate = firstFlight;
  if (deliveryDate) merged.delivery_date = merged.deliveryDate = merged.delivery = merged.delivered = deliveryDate;
  if (engines) merged.engines = merged.engine = merged.engine_type = merged.engineType = engines;
  if (configuration) merged.configuration = merged.config = configuration;
  if (country) merged.country = merged.registration_country = merged.flag = country;
  return merged;
}

async function buildAeroExportAircraft(aircraft) {
  let merged = mergeAircraftExportData(aircraft, {});
  try {
    const staticData = await fetchAdsbDbAircraftMetadata(merged);
    if (staticData) merged = mergeAircraftExportData(merged, staticData);
  } catch {
    // bez twardego błędu
  }
  try {
    const jetPhotosData = await fetchJetPhotosMetadata(firstFilled(merged.r, merged.registration));
    if (jetPhotosData) merged = mergeAircraftExportData(merged, jetPhotosData);
  } catch {
    // bez twardego błędu
  }
  return merged;
}

function aircraftAeroDocxData(aircraft, photoInfo = {}) {
  const details = Object.fromEntries(aircraftDetailsRows(aircraft));
  const raw = aircraft || {};
  const route = routeInfoFromAircraft(aircraft);
  const flight = aircraftToFlight(aircraft);
  const photo = aircraftExportPhotoMeta(photoInfo);
  return {
    registration: firstFilled(raw.r, raw.registration, details["Rejestracja"], "brak danych"),
    aircraftType: firstFilled(raw.t, raw.type, raw.aircraftType, details["Typ"], "brak danych"),
    manufacturer: firstFilled(raw.manufacturer, raw.make, raw.producer, "brak danych"),
    serialNumber: firstFilled(raw.serial_number, raw.serialNumber, raw.msn, raw.MSN, raw.cn, raw.c_n, raw.constructionNumber, raw.line_number, raw.lineNumber, "brak danych"),
    lineNumber: firstFilled(raw.line_number, raw.lineNumber, raw.ln, "brak danych"),
    hexCode: normalizeIcao(firstFilled(raw.hex, raw.icao, raw.icao24, flight.icao)).toUpperCase() || "brak danych",
    operator: firstFilled(raw.operator, raw.owner, raw.airline, details["Operator / linia"], airlineGuessFromCallsign(aircraft), "brak danych"),
    country: firstFilled(raw.country, raw.registration_country, raw.flag, "brak danych"),
    firstFlight: firstFilled(raw.first_flight, raw.firstFlight, raw.firstFlightDate, "brak danych"),
    deliveryDate: firstFilled(raw.delivery_date, raw.deliveryDate, raw.delivered, raw.delivery, "brak danych"),
    engines: firstFilled(raw.engines, raw.engine, raw.engine_type, raw.engineType, "brak danych"),
    configuration: firstFilled(raw.configuration, raw.config, "brak danych"),
    photoSource: photo.url || "brak danych",
    routeText: route.verbose || route.short || "brak danych",
    adsbUrl: buildAdsbUrl(flight),
    photo
  };
}

function aircraftAeroDocxFlightRows(aircraft) {
  const { history } = aircraftExportHistoryRows(aircraft);
  if (!history.length) {
    const route = routeInfoFromAircraft(aircraft);
    const now = new Date().toLocaleDateString("pl-PL");
    return [[now, "", aircraftCallsign(aircraft) || aircraftLabel(aircraft), route.origin || "", route.destination || "", "", "", "1 lot"]];
  }
  return history.slice(0, 80).map((item) => {
    const route = routeInfoFromAircraft(item);
    return [
      item.lastSeenAt ? new Date(item.lastSeenAt).toLocaleDateString("pl-PL") : "",
      item.lastSeenAt ? new Date(item.lastSeenAt).toLocaleTimeString("pl-PL") : "",
      item.callsign || aircraftCallsign(item) || "",
      route.origin || "",
      route.destination || "",
      "",
      "",
      String(item.count || 1)
    ];
  });
}

async function createAeroStyleDocxBlob(aircraft, photoInfo = {}) {
  const data = aircraftAeroDocxData(aircraft, photoInfo);
  const title = `SAMOLOT ${data.aircraftType !== "brak danych" ? data.aircraftType : ""} ${data.registration !== "brak danych" ? data.registration : ""} ${data.operator !== "brak danych" ? data.operator : ""}`.replace(/\s+/g, " ").trim() || "ZESTAWIENIE SAMOLOTU";
  const summaryHeaders = ["NUMER SERYJNY", "NUMER REJESTRACYJNY / BOCZNY", "RODZAJ SILNIKA", "HEX", "DATA PIERWSZEGO LOTU", "DATA ODBIORU / PRZEKAZANIA", "GALERIA"];
  const summaryValues = [data.serialNumber, data.registration, data.engines, data.hexCode, data.firstFlight, data.deliveryDate];
  const summaryWidths = [1650, 2100, 1800, 1300, 1750, 1900, 5200];
  const details = [
    ["Rejestracja / numer boczny", data.registration],
    ["Typ samolotu", data.aircraftType],
    ["Producent", data.manufacturer],
    ["Numer seryjny / MSN", data.serialNumber],
    ["Numer linii produkcyjnej", data.lineNumber],
    ["HEX / Mode-S", data.hexCode],
    ["Operator", data.operator],
    ["Kraj rejestracji", data.country],
    ["Data pierwszego lotu", data.firstFlight],
    ["Data dostawy / przekazania", data.deliveryDate],
    ["Silniki", data.engines],
    ["Konfiguracja", data.configuration],
    ["Trasa", data.routeText],
    ["Link ADS", data.adsbUrl],
    ["Źródło zdjęcia", data.photoSource]
  ];
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:body>
<w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="36"/></w:rPr><w:t>${docxEscapeXml(title)}</w:t></w:r></w:p>
<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="single" w:sz="4"/><w:left w:val="single" w:sz="4"/><w:bottom w:val="single" w:sz="4"/><w:right w:val="single" w:sz="4"/><w:insideH w:val="single" w:sz="4"/><w:insideV w:val="single" w:sz="4"/></w:tblBorders></w:tblPr>
${docxRow(summaryHeaders, { bold: true, fill: "DDEBF7", widths: summaryWidths })}
<w:tr>${summaryValues.map((value, index) => docxCell(value, { width: summaryWidths[index] })).join("")}${docxPhotoCell(photoInfo, summaryWidths[6])}</w:tr>
</w:tbl>
<w:p/>
<w:p><w:r><w:rPr><w:b/></w:rPr><w:t>DANE SAMOLOTU</w:t></w:r></w:p>
<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="single" w:sz="4"/><w:left w:val="single" w:sz="4"/><w:bottom w:val="single" w:sz="4"/><w:right w:val="single" w:sz="4"/><w:insideH w:val="single" w:sz="4"/><w:insideV w:val="single" w:sz="4"/></w:tblBorders></w:tblPr>
${details.map(([label, value]) => docxRow([label, value], { widths: [3000, 11000] })).join("\n")}
</w:tbl>
<w:sectPr><w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/><w:pgMar w:top="680" w:right="680" w:bottom="680" w:left="680" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr>
</w:body></w:document>`;
  const imageExt = (photoInfo.fileName || "zdjecie.jpg").split(".").pop().toLowerCase() || "jpg";
  const files = [
    { name: "[Content_Types].xml", blob: blobFromText(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="jpeg" ContentType="image/jpeg"/><Default Extension="jpg" ContentType="image/jpeg"/><Default Extension="png" ContentType="image/png"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`, "application/xml") },
    { name: "_rels/.rels", blob: blobFromText(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`, "application/xml") },
    { name: "word/document.xml", blob: blobFromText(documentXml, "application/xml") },
    { name: "word/_rels/document.xml.rels", blob: blobFromText(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${photoInfo?.real === true && photoInfo?.blob ? `<Relationship Id="rIdImage1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/zdjecie.${imageExt}"/>` : ""}</Relationships>`, "application/xml") }
  ];
  if (photoInfo?.real === true && photoInfo?.blob) files.push({ name: `word/media/zdjecie.${imageExt}`, blob: photoInfo.blob });
  return createZipBlob(files);
}

async function downloadAeroStyleDocxForAircraft(aircraft) {
  const exportAircraft = await buildAeroExportAircraft(aircraft);
  let photoInfo;
  try {
    photoInfo = await aircraftPhotoBlobForExport(exportAircraft);
  } catch (photoError) {
    console.warn("Nie udało się pobrać zdjęcia do DOCX.", photoError);
    photoInfo = { blob: null, fileName: "", url: "", real: false };
  }
  const docxBlob = await createAeroStyleDocxBlob(exportAircraft, photoInfo);
  const fileName = `${makeAircraftExportBaseName(exportAircraft)}_zestawienie.docx`;
  downloadBlob(fileName, new Blob([docxBlob], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }));
  return fileName;
}

function blobFromText(text, type = "text/plain;charset=utf-8") {
  return new Blob([text], { type });
}

async function blobFromDataUrl(dataUrl) {
  const response = await fetch(dataUrl);
  return response.blob();
}

async function aircraftPhotoBlobForExport(aircraft) {
  let photoUrl = "";
  try {
    photoUrl = await findRealAircraftPhotoUrl(aircraft);
    if (photoUrl) {
      const attempts = [photoUrl, ...CORS_PROXY_BUILDERS.map((builder) => builder(photoUrl))];
      for (const attemptUrl of attempts) {
        try {
          const response = await fetchWithTimeout(attemptUrl, { headers: { "Accept": "image/*,*/*;q=0.8" } }, 10000);
          if (!response.ok) continue;
          const blob = await response.blob();
          if (blob && blob.size > 0) {
            const mime = blob.type || "image/jpeg";
            const ext = mime.includes("png") ? "png" : mime.includes("webp") ? "webp" : mime.includes("jpeg") ? "jpg" : "jpg";
            return { blob, fileName: `zdjecie.${ext}`, url: photoUrl, real: true };
          }
        } catch {
          // próbujemy kolejne podejście
        }
      }
    }
  } catch {
    // Brak prawdziwego zdjęcia albo blokada pobierania. Nie zapisujemy grafiki zastępczej do eksportu.
  }
  return { blob: null, fileName: "", url: photoUrl, real: false };
}
