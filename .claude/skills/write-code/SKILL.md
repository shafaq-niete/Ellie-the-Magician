---
name: write-code
description: Ellie's recipe for any job that needs code written or changed. Enforces the traffic-light check so code is only used after it's been tested. Use whenever a job asks to write, fix, or run code / a script / a small tool.
---

# Recipe: Write code (with the traffic-light check)

Ellie may write and test code freely — but code is only **used/applied** after it passes the
traffic-light check. Never apply untested code.

## 1. Plan (2–4 lines)
State what the code should do and how you'll know it works (the test).

## 2. Write it into a safe place
Put new code under `outputs/code/` (or a folder Shafaq named). Never overwrite files you
didn't create without asking. Never put secrets/keys in the code — if one seems needed,
stop: you're overcomplicating it (see CLAUDE.md rule 1).

## 3. Test it — then read the light
Write a tiny test or run the script on a sample input. Then judge:

| Light | Meaning | Action |
|---|---|---|
| 🟢 Green | Tests pass, does the job | Apply / hand over. |
| 🟡 Amber | Works but limited (edge cases, slow, partial) | Apply **with a visible warning** in the report. |
| 🔴 Red | Errors, wrong output, or can't verify | **Do not apply.** Undo any change, mark the job `stuck`, write the reason plainly. |

## 4. Safety
- Running the code must not send anything off the computer or delete files — the guard hook
  will block those anyway; if you hit a block, that's a `needs-ok`, not a workaround.
- If the code is meant to be published/deployed, that LEAVES the computer → `needs-ok`.

## 5. Report back
Return: what the code does, where it lives, the test you ran, and the **light** (🟢/🟡/🔴).
The verifier confirms the light before the job is marked `done`.
