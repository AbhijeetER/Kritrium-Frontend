const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ─── ORIGINALS ──────────────────────────────────────────────
export async function uploadOriginal({ video_url, title, sport, event }) {
  const res = await fetch(`${BASE}/api/originals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ video_url, title, sport, event }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
  // returns { original_id, status, message }
}

export async function getOriginals() {
  const res = await fetch(`${BASE}/api/originals`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
  // returns [{ original_id, title, sport, status }]
}

export async function getOriginalStatus(original_id) {
  const res = await fetch(`${BASE}/api/originals/${original_id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ─── ANALYZE ────────────────────────────────────────────────
// Send a suspected URL for analysis
export async function analyzeUrl({ video_url, original_id, source = "manual", notes = "" }) {
  const res = await fetch(`${BASE}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ video_url, original_id, source, notes }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
  // returns { job_id, status, message }
}

// Send a video FILE for analysis (multipart/form-data)
export async function analyzeFile({ file, original_id, notes = "", username = "" }) {
  const formData = new FormData();
  formData.append("video", file);
  formData.append("original_id", original_id);
  formData.append("notes", notes);
  formData.append("username", username);
  formData.append("source", "upload");

  const res = await fetch(`${BASE}/api/analyze`, {
    method: "POST",
    body: formData,
    // DO NOT set Content-Type header — browser sets it with correct boundary
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
  // returns { job_id, status, message }
}

// ─── RESULTS ────────────────────────────────────────────────
export async function getResults(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.append("status", filters.status);
  if (filters.source) params.append("source", filters.source);
  if (filters.limit)  params.append("limit",  filters.limit);

  const url = `${BASE}/api/results${params.toString() ? "?" + params.toString() : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
  
}

export async function getJobResult(job_id) {
  const res = await fetch(`${BASE}/api/results/${job_id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
  // returns job with status + scores when done
}

// ─── HEALTH ─────────────────────────────────────────────────
export async function getHealth() {
  const res = await fetch(`${BASE}/api/health`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
