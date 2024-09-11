export function niceDate(d: Date): string {
  return localDateString(d).split("T")[0];
}

export function niceTime(d: Date): string {
  return localDateString(d).split("T")[1].split(".")[0];
}

export function safeTime(d: Date): string {
  return niceTime(d).replace(/:/g, "-");
}

export function localDateString(d: Date): string {
  return d.getFullYear() +
    "-" + String(d.getMonth() + 1).padStart(2, "0") +
    "-" + String(d.getDate()).padStart(2, "0") +
    "T" + String(d.getHours()).padStart(2, "0") +
    ":" + String(d.getMinutes()).padStart(2, "0") +
    ":" + String(d.getSeconds()).padStart(2, "0") +
    "." + String(d.getMilliseconds()).padStart(3, "0");
}
