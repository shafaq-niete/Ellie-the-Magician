# 🪄 Ellie the Magician — your personal bot

Ellie is a small helper that lives in this folder. You add jobs on a simple web page,
and Ellie does them for you — research, working with files, and writing code — then checks
her own work before saying it's done. She never sends anything off your computer without
your click.

There is **no server for you to run** and **no key for you to enter**. Claude Code is the
brain; this folder is just Ellie's desk.

---

## How to use it (the whole thing)

**1. The page.** Your web page is at **http://localhost:4321**. Open it in any browser.
On it you can:
- **Add a job** — a title, a plain description, and how important it is (High / Medium / Low).
- **Watch it move** — waiting → working on it → done (or *stuck*, or *needs my OK*).
- **Read what Ellie did** — a plain note on each finished job.
- **Approve with one click** — any job marked *needs my OK* gets ✓ Yes / ✗ No buttons.
- **Leave a note or correction** — Ellie saves it and learns from it.

**2. Put Ellie to work (while you're here).** In Claude Code, say:

> **run one round of Ellie's work in the my-bot folder**

…or, to keep her working every hour automatically while Claude Code is open, use the loop:

> **/loop 1h run one round of Ellie's work in the my-bot folder**

Each round, Ellie picks the most important waiting job, does it, has a second helper check
it, writes a note, and updates the log. Away-mode (background schedule) is **off** by your
choice — Ellie only works while Claude Code is open.

**3. Finished work** shows up as a note on the job, and any documents are saved in the
`outputs/` folder.

---

## The promises Ellie always keeps
- **Asks before anything risky.** Nothing that deletes your files or leaves your computer
  (a message, email, or published code) happens without your click. Those wait as *needs my OK*.
- **Never fakes success.** If a job fails, it's marked *stuck* with the reason in plain words.
- **No secret keys, ever.** If something seems to need one, Ellie stops and simplifies instead.
- **The rulebook is locked.** `CLAUDE.md` and the safety settings can't be changed by Ellie.

These are enforced automatically by a safety check (`.claude/hooks/guard.js`), not just good
intentions.

---

## What each part is (in case you're curious)
| File / folder | What it is |
|---|---|
| `CLAUDE.md` | Ellie's rulebook — re-read every time she runs. |
| `tasks.json` | The one true file: your job list + the log + saved corrections. |
| `app/` | The web page + the tiny back-end that runs it. |
| `run-round.md` | The "one round of work" steps (used every round). |
| `.claude/skills/` | Recipes — one per regular job (e.g. observation feedback). |
| `.claude/agents/` | Two helpers: **task-doer** (does one job) and **verifier** (checks it). |
| `.claude/hooks/` | The automatic safety check. |
| `.claude/settings.json` | Switches the safety check on. |
| `outputs/` | Where finished documents are saved. |

## A note on cost
The web page is free to keep open. The only thing that costs anything is **Ellie doing a
round** (that's Claude working). She runs a round every hour only while Claude Code is open —
so cost stays small and in your control.

## If something looks wrong
- **Page won't open?** The little back-end may have stopped. Ask Claude Code: *"start Ellie's
  web page again."*
- **A job is stuck?** Read the reason on the job, fix or clarify with a note, and it'll be
  retried next round.
