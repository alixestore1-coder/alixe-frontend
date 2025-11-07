function join(base, path) {
  const b = base.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : "/" + path;
  return b + p;
}

const host = window.location.hostname || "127.0.0.1";
const defaultBase = http://System.Management.Automation.Internal.Host.InternalHost:8000;
const base = (import.meta.env.VITE_API_URL || defaultBase).replace(/\/+$/, "");

export async function apiGet(path) {
  const res = await fetch(join(base, path), {
    headers: { "Accept": "application/json" }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error("GET " + path + " failed: " + res.status + " " + text);
  }
  return res.json();
}

export async function apiPost(path, body) {
  const res = await fetch(join(base, path), {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error("POST " + path + " failed: " + res.status + " " + text);
  }
  return res.json();
}