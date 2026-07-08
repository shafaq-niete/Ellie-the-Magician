// Ellie the Magician — tiny back-end. No installs, only built-in Node modules.
// It serves the web page and reads/writes the one true file: tasks.json.

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");          // the my-bot folder
const TASKS_FILE = path.join(ROOT, "tasks.json");
const INDEX_FILE = path.join(__dirname, "index.html");
const PORT = 4321;

// --- helpers -------------------------------------------------------------
function readState() {
  try {
    return JSON.parse(fs.readFileSync(TASKS_FILE, "utf8"));
  } catch {
    return { tasks: [], log: [], corrections: [] };
  }
}

function writeState(state) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(state, null, 2));
}

function logLine(state, jobId, what, how) {
  state.log.unshift({
    when: new Date().toISOString(),
    jobId: jobId || "-",
    what,
    how, // "added" | "passed" | "stuck" | "needs my OK" | "approved" | "declined"
  });
}

function sendJson(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => {
      try { resolve(JSON.parse(data || "{}")); }
      catch { resolve({}); }
    });
  });
}

// --- server --------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  // The web page
  if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
    fs.readFile(INDEX_FILE, (err, buf) => {
      if (err) { res.writeHead(500); res.end("Page not found"); return; }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(buf);
    });
    return;
  }

  // Read everything (jobs + log + corrections)
  if (req.method === "GET" && url.pathname === "/api/state") {
    return sendJson(res, 200, readState());
  }

  // Add a job
  if (req.method === "POST" && url.pathname === "/api/tasks") {
    const body = await readBody(req);
    const title = (body.title || "").trim();
    if (!title) return sendJson(res, 400, { error: "A title is required." });
    const state = readState();
    const now = new Date().toISOString();
    const task = {
      id: "t" + now.replace(/\D/g, "").slice(-10),
      title,
      description: (body.description || "").trim(),
      priority: ["High", "Medium", "Low"].includes(body.priority) ? body.priority : "Medium",
      status: "waiting",
      created: now,
      updated: now,
      result: "",
      reason: "",
      scores: null,
    };
    state.tasks.unshift(task);
    logLine(state, task.id, `Added job: "${title}"`, "added");
    writeState(state);
    return sendJson(res, 200, readState());
  }

  // Approve / decline a "needs my OK" job (one click on the page)
  if (req.method === "POST" && url.pathname === "/api/decision") {
    const body = await readBody(req);
    const state = readState();
    const t = state.tasks.find((x) => x.id === body.id);
    if (!t) return sendJson(res, 404, { error: "Job not found." });
    const now = new Date().toISOString();
    if (body.decision === "yes") {
      t.status = "waiting"; t.approved = true; t.updated = now;
      logLine(state, t.id, `Approved: "${t.title}"`, "approved");
    } else {
      t.status = "stuck"; t.reason = "Declined by Shafaq."; t.updated = now;
      logLine(state, t.id, `Declined: "${t.title}"`, "declined");
    }
    writeState(state);
    return sendJson(res, 200, readState());
  }

  // Leave a note on a job (a question, correction, or extra detail)
  if (req.method === "POST" && url.pathname === "/api/note") {
    const body = await readBody(req);
    const state = readState();
    const t = state.tasks.find((x) => x.id === body.id);
    if (!t) return sendJson(res, 404, { error: "Job not found." });
    t.note = (body.note || "").trim();
    t.updated = new Date().toISOString();
    logLine(state, t.id, `Note added to "${t.title}"`, "note");
    writeState(state);
    return sendJson(res, 200, readState());
  }

  res.writeHead(404); res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`Ellie's page is running at http://localhost:${PORT}`);
});
