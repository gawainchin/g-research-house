# Research Memo — Editor Review
**Article:** hooks-dont-replace-prompts.md
**Date:** 2026-05-20
**Author:** ai-researcher (Harvey)
**For:** DS lead / technical operator audience

---

## 1. Three Specific Upgrade Recommendations

### R1 — Replace vague "PreToolUse" reference with the exact blocking pattern from the Claude Code docs

Lines 86–92 list hook examples but the "PreToolUse" and "PostToolUse" mentions are bare names. The [Claude Code hooks reference](https://code.claude.com/docs/en/hooks) defines specific matchers and handler types (command/http/mcp_tool/prompt/agent). The article loses specificity by not naming them.

**Upgrade:** Replace the bullet "Protected actions: Blocking destructive edits..." with the exact pattern from the docs — a `PreToolUse` hook with a shell command that exits 2 on protected file patterns (`.env`, `package-lock.json`, `.git/`). The docs show this as a copy-paste block. That's more useful to a DS lead than the abstract description.

> URL: https://code.claude.com/docs/en/hooks-guide — "Block Edits to Protected Files" section

---

### R2 — Give LangGraph's durable execution three explicit modes, not just a name-drop

Line 125 says LangGraph treats "persistence, replay safety, checkpoints, and external approval as first-class concepts." That's true but vague. The [LangGraph durable execution docs](https://docs.langchain.com/oss/python/langgraph/durable-execution) specify three explicit durability modes:

| Mode | Persists | Recovery |
|------|----------|----------|
| `"exit"` | On graph exit only | None mid-execution |
| `"async"` | Asynchronously while next step runs | Small risk on crash |
| `"sync"` | Before next step starts | Full checkpoint integrity |

For a DS lead evaluating LangGraph vs Temporal for production workflows, "first-class concepts" is marketing copy. The three-mode table is what they'd actually use to make a trade-off.

**Upgrade:** Replace the broad LangGraph generalization with that table. Drop the Temporal reference entirely unless the article is making a specific comparison — right now it name-drops both without saying what either does concretely.

---

### R3 — Add the SessionStart hook pattern for context injection

The article mentions startup context loading as a hooks use case (line 89) but doesn't show how it actually works. The [Claude Code hooks guide](https://code.claude.com/docs/en/hooks-guide) documents a specific SessionStart pattern:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Reminder: use Bun, not npm. Run bun test before committing.'"
          }
        ]
      }
    ]
  }
}
```

The `matcher: "compact"` fires only after context compaction — a concrete example of the "timing and enforcement layer" concept the article is arguing for. Without this, the startup bullet reads like a claim rather than a demonstrated pattern.

**Upgrade:** Replace "Startup context loading: 'Always load project context at session start'" with the SessionStart+matcher pattern and explicitly note that this fires only on compaction, solving the "model forgets" failure mode directly.

---

## 2. Two Concrete Examples That Cleanly Separate Prompts from Hooks

### Example A — Prompt for judgment: Audience-specific content generation

**Prompt role (semantic):**
> "Write the results section for a DS lead who evaluates agent reliability tools for their team. Assume they understand workflow concepts and trade-offs. Do not simplify terminology for a general audience."

This is a judgment call. The model must decide what "DS lead" means in context, weight technical precision over accessibility, and choose how much background to include. A hook cannot make this decision — it has no concept of audience or quality.

**Hook role (enforcement):**
> A `PostToolUse` hook runs `grammar_checker --strict` on every file matching `results-*.md` before the session ends. It fires regardless of the model's mood or token budget. The prompt telling the model "run a grammar check" is advisory; the hook is deterministic.

The article's version ("Prompts define goals, hooks fire at lifecycle moments") is abstract. This framing — prompt as "what to decide," hook as "what must happen" — makes the division actionable.

---

### Example B — Hook for enforcement: PreToolUse block with matcher on destructive tools

**Hook role (timing/enforcement):**
From the [Claude Code hooks reference](https://code.claude.com/docs/en/hooks), the block-protect script:

```bash
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
PROTECTED_PATTERNS=(".env" "package-lock.json" ".git/")
for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    echo "Blocked: $FILE_PATH matches protected pattern '$pattern'" >&2
    exit 2
  fi
done
```

This fires on `Edit|Write` operations matching `.env` or `package-lock.json`. The hook is a gate — it doesn't reason about whether deleting `.env` might be acceptable, it blocks the action unconditionally.

**Why this cleanly separates the concerns:** No amount of prompt engineering can guarantee the model won't write to `.env` when tired or context-saturated. The hook's exit code is a mechanical guarantee, not a probabilistic one. The prompt can still instruct "never commit secrets" — but the hook enforces it.

The article's "failure mode: model forgets" (comparison table, line 60) is the right concept but could show this exact pattern as the illustration.

---

## 3. One Overclaim, Weak Analogy, or Ambiguity to Trim

### Overclaim in paragraph 3 (lines 94–96):

> "If a PreToolUse or PostToolUse control point exists, you can attach deterministic checks to it. That is a different class of reliability than 'the model usually remembers.'"

**The problem:** The claim that hooks provide "deterministic" reliability over model memory is overstated. Hooks fire in the same execution context as the model and can be bypassed — not by the model forgetting, but by the hook handler failing, timing out, or exiting with a non-2 code that the system doesn't enforce.

Specifically:
- If the blocking script exits non-zero on a protected file, the hook blocks the edit. Good.
- But the hook's own execution can fail silently if `async: true` is set and the error isn't surfaced. The docs explicitly note: "Non-2xx responses produce non-blocking errors."
- The claim "that is a different class of reliability" ignores that hooks have their own failure modes: timeouts (default 600s for command hooks), matcher misconfiguration, and async error suppression.

**The trim:** Change "a different class of reliability" to "a mechanized rather than probabilistic guarantee" — and add one sentence:

> "Hook reliability is mechanized, not absolute — misconfigured matchers, timeouts, and async errors can silently pass or block unintentionally."

That framing is honest, more credible to a technical audience, and reinforces the article's own point that control-plane design matters.

---

## 4. Exact URLs for Factual Additions Proposed

| Addition | URL |
|----------|-----|
| Block-protect file pattern (recommendation R1) | https://code.claude.com/docs/en/hooks-guide — "Block Edits to Protected Files" |
| PreToolUse/PostToolUse lifecycle events | https://code.claude.com/docs/en/hooks — "Hook Lifecycle" table |
| SessionStart + matcher:compact pattern (R3) | https://code.claude.com/docs/en/hooks-guide — "Re-inject Context After Compaction" |
| LangGraph durability modes table (R2) | https://docs.langchain.com/oss/python/langgraph/durable-execution — "Durability Modes" section |
| Temporal human-in-the-loop pattern (if kept) | https://docs.temporal.io/ai-cookbook/human-in-the-loop-python |

---

## Summary for Editor

The draft's thesis and structure are solid. The three recommendations tighten it by replacing abstract claims (LangGraph "first-class concepts," PreToolUse as a name-drop, "deterministic" as an unqualified superlative) with concrete patterns from primary docs. The two examples and the overclaim trim are the highest-leverage changes — they make the article useful to a DS lead who needs to apply this, not just agree with it.

No changes to the article file itself — this memo is the deliverable.