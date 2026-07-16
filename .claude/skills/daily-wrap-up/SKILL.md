---
name: daily-wrap-up
description: Ellie's recipe for a short end-of-day summary. Reads today's notes and jobs and writes a dated "Done / Doing / Next" summary into the log/ folder. Use whenever a job asks for a daily wrap-up, end-of-day summary, "what did I do today", or a status recap.
---

# Recipe: Daily Wrap-Up

Goal: give Shafaq a quick, honest picture of the day in three parts — what got **Done**,
what's still **Doing**, and what's **Next** — saved as a small dated file she can keep.

## When to use this
- A job titled/described as: daily wrap-up, end-of-day summary, "recap my day", "what did I
  get done today", status update.
- Good as a last job of the day, but works any time she asks.

## Steps
1. **Get today's date** (YYYY-MM-DD, local time). Use it for the filename and the heading.
2. **Read today's notes and jobs.** Look at:
   - `tasks.json` — the `tasks` (their status + result) and today's `log` lines.
   - Any notes Shafaq left on jobs (the `note` field) and the `corrections` list.
   - If a `notes/` folder exists, read any file changed today too.
   Only count things from **today** (match the date). If nothing happened today, say so plainly —
   don't pad it.
3. **Sort into three buckets:**
   - **✅ Done** — jobs that reached `done` today (one line each: title + one-line result).
   - **🔧 Doing** — jobs currently `working` or `needs-ok` (note if one is waiting on her click).
   - **➡️ Next** — jobs still `waiting`, most important first (High → Low, then oldest).
4. **Write the summary** to `log/<YYYY-MM-DD>-wrap-up.md` using the shape in the example below.
   Keep it short, plain, and friendly. Never invent progress that isn't in the notes.
5. **Report back** — return one or two sentences plus the file path. If a job is stuck or
   needs her OK, mention it so it isn't missed.

## Safety
- This only reads files and writes one summary file into `log/` — nothing leaves the computer.
- Facts must come from the notes/jobs. If something is unclear, write "unclear" rather than guess.

## Example output (`log/2026-07-16-wrap-up.md`)
```markdown
# Daily Wrap-Up — 2026-07-16

## ✅ Done
- Draft observation feedback for Ms. Ahmed — draft saved to outputs/, verified 5/5.
- Solution For Teachers Problem — practical sourced guide saved to outputs/.

## 🔧 Doing
- Newsletter blurb — waiting on your OK to send (parked as "needs my OK").

## ➡️ Next
- (High) Prep Friday staff-meeting agenda
- (Low) Tidy the /notes folder

_1 job needs your click before it can finish._
```

## Verifier will check
Completeness (all three buckets present, only today's items), Accuracy (matches the real
job list/notes — nothing invented), Usability (short, dated, saved in log/). Must score 4-5,
nothing below 3.
