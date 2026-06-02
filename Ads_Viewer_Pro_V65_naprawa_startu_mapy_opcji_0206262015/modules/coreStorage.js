// ADS Viewer Pro - coreStorage.js
// Wydzielone z app.js w wersji V59. Klasyczny skrypt, funkcje globalne.
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
  return String(value || "").trim().toLowerCase().replace(/[^a-f0-9]/g, "");
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

function escapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function numberText(value, fractionDigits = 0) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "brak danych";
  return number.toLocaleString("pl-PL", { maximumFractionDigits: fractionDigits, minimumFractionDigits: fractionDigits });
}

function firstFilled(...values) {
  for (const value of values) {
    if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
  }
  return "";
}

function numericFirst(...values) {
  for (const value of values) {
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }
  return null;
}

function finiteNumberOrNull(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
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

function sanitizeFileName(value, fallback = "samolot") {
  const cleaned = String(value || "")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 90);
  return cleaned || fallback;
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[;"\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

async function yieldToUi() {
  await new Promise((resolve) => window.requestAnimationFrame(() => resolve()));
}

function runOnceForKey(map, key, factory) {
  if (map.has(key)) return map.get(key);
  const promise = Promise.resolve()
    .then(factory)
    .finally(() => map.delete(key));
  map.set(key, promise);
  return promise;
}
