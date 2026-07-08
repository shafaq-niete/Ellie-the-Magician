#!/usr/bin/env node
// Ellie's safety guard. Runs automatically BEFORE any Bash command or file write
// (wired up in .claude/settings.json). It blocks dangerous or off-computer actions.
//
// How Claude Code hooks work: this script gets a JSON object on stdin describing the
// tool call. Exit 0 = allow. Exit 2 = BLOCK, and whatever we print to stderr is shown
// to the bot as the reason, so it can stop and ask Shafaq instead.

let raw = "";
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  let data = {};
  try { data = JSON.parse(raw || "{}"); } catch { process.exit(0); }

  const tool = data.tool_name || "";
  const input = data.tool_input || {};

  const block = (why) => { console.error("🛑 Ellie's safety check blocked this.\n" + why); process.exit(2); };

  // --- Protect the rulebook + settings (read-only to the bot) ---------------
  if (["Write", "Edit", "NotebookEdit"].includes(tool)) {
    const fp = (input.file_path || "").replace(/\\/g, "/").toLowerCase();
    if (fp.endsWith("/claude.md") || fp.endsWith("my-bot/claude.md") ||
        fp.includes(".claude/settings.json") || fp.includes(".claude/hooks/")) {
      block("CLAUDE.md, settings.json, and the hooks are the bot's rulebook — read-only. " +
            "Ask Shafaq to change these by hand.");
    }
    process.exit(0);
  }

  // --- Guard shell commands --------------------------------------------------
  if (tool === "Bash") {
    const cmd = (input.command || "").toLowerCase();

    // 1) Destructive — never allowed without asking.
    const destructive = [
      /\brm\s+-[a-z]*r/, /\brm\s+-[a-z]*f/, /\bremove-item\b[^|]*-recurse/,
      /\brmdir\s+\/s/, /\bdel\s+\/[sq]/, /\bformat\s/, /\bmkfs\b/,
      /\bdd\s+if=/, />\s*\/dev\/sd/, /\bgit\s+reset\s+--hard/, /\bgit\s+clean\s+-[a-z]*f/,
      /\bshutdown\b/, /\btaskkill\s+\/f/, /\b:\(\)\s*\{/,
    ];
    for (const re of destructive) {
      if (re.test(cmd)) block(
        "That command can delete data or is hard to undo:\n  " + input.command +
        "\nEllie must ask Shafaq first. Put it in front of her as a 'needs my OK' step.");
    }

    // 2) Sending things OFF the computer — needs Shafaq's click ('ask first' is ON).
    const offComputer = [
      /\bgit\s+push\b/, /\bnpm\s+publish\b/, /\byarn\s+publish\b/, /\bscp\b/, /\bsftp\b/,
      /\bssh\b/, /\bmail\b/, /\bsendmail\b/,
      /\bcurl\b.*(-x\s*(post|put)|(^|\s)-d(\s|$)|--data)/, /\bwget\b.*--post/,
    ];
    const touchesExternal = /\bhttps?:\/\//.test(cmd) &&
      !/(localhost|127\.0\.0\.1)/.test(cmd);
    for (const re of offComputer) {
      // curl/wget to the bot's OWN localhost API is fine; only block external targets.
      if (re.test(cmd)) {
        if (/\b(curl|wget)\b/.test(cmd) && !touchesExternal) continue;
        block(
          "That would send something off the computer:\n  " + input.command +
          "\n'Ask before risky things' is ON. Stop, prepare a draft, and mark the job " +
          "'needs my OK' so Shafaq can approve with one click.");
      }
    }
  }

  process.exit(0);
});
