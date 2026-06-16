---
title: Hooks Are Door Locks, Not Better Prompts
slug: hooks-dont-replace-prompts
section: ai-research
visualKey: hooks
date: 2026-05-20
tags:
  - ai
  - agents
  - workflow
  - orchestration
  - developer-tools
  - reliability
keywords:
  - hooks vs prompts
  - workflow enforcement
  - agent reliability
  - lifecycle hooks
  - human in the loop
format: thesis
perspective: operator
summary: "Hooks are not a superior form of prompting. They are the door locks of agent systems: timing, checkpoints, and enforcement where memory is not enough."
readingTime: 5
relatedSlugs:
  - from-chatbot-to-workflow
  - agentic-coding-real-bottleneck
sourceLinks:
  - label: "Claude Code — Automate workflows with hooks"
    url: "https://code.claude.com/docs/en/hooks-guide"
  - label: "Claude Code — Hooks reference"
    url: "https://code.claude.com/docs/en/hooks"
  - label: "LangGraph durable execution"
    url: "https://docs.langchain.com/oss/python/langgraph/durable-execution"
  - label: "Temporal — Human-in-the-Loop AI Agent"
    url: "https://docs.temporal.io/ai-cookbook/human-in-the-loop-python"
---

I keep seeing the same argument show up in agent tooling discussions.

Someone tries to make an agent safer with a longer prompt. The prompt says never touch `.env`, always run validation, always ask before publishing, always preserve the user’s intent, always do the right thing at exactly the right time.

Then the agent forgets.

So the prompt gets longer.

This is how you end up taping house rules to every wall because nobody installed a lock on the door.

:::thesis-card
label: Core Thesis
title: "Prompts are house rules. Hooks are door locks."
text: "Hooks are not better prompts. They solve a different problem: enforcing timing, checkpoints, and repeatable control in agent workflows. Prompts shape judgment. Hooks make mandatory behaviors non-optional."
:::

## The category mistake

A prompt and a hook are not rival products.

A prompt tells the model how to think. A hook defines when the system should intervene.

That distinction sounds obvious until you watch teams use prompts as if they were infrastructure. They bury operational requirements inside instruction text and hope the model remembers them across compaction, tool calls, retries, and context drift.

Hope is not a control plane.

:::comparison-table
columns:
  - Question
  - Prompt
  - Hook
rows:
  - ["What is it?", "Instruction to the model", "Event-triggered action or gate"]
  - ["Best at", "Judgment, style, goals, tradeoff framing", "Timing, enforcement, validation, automation"]
  - ["Failure mode", "Model forgets, compresses, or ignores it", "Bad trigger design, bad matcher, timeout, or noisy policy"]
  - ["Good example", "Write for a DS lead audience with operator focus", "Run validation before publish or block protected-file edits"]
  - ["Bad example", "Expecting a prompt to reliably stop every risky action", "Expecting a hook to decide whether a thesis is insightful"]
:::

## Where hooks actually help

Hooks are useful when the desired behavior is mandatory, repeatable, and tied to a specific lifecycle moment.

That is the whole trick.

Claude Code’s hook system can run commands before tool use, after tool use, on notification events, or when a session starts. A `PreToolUse` hook can block writes to protected paths by exiting with a non-zero code. A `SessionStart` hook can re-inject context when a compacted session starts. A `PostToolUse` hook can log what changed.

None of this makes the model wiser.

It makes the workflow less dependent on memory.

:::key-takeaways
takeaways:
  - {icon: "🧠", text: "Prompts define goals, style, policy, and reasoning posture. They are the judgment layer."}
  - {icon: "⏱️", text: "Hooks fire at specific lifecycle moments. They are the timing and enforcement layer."}
  - {icon: "🛑", text: "If a rule must happen before publish, before tool use, or after a state change, use a hook or gate."}
  - {icon: "🧱", text: "Hooks do not replace taste or strategy. They make repeatable control points non-optional."}
:::

:::callout
label: The logic error
text: "Saying hooks are better than prompts is like saying motion sensors are better than house rules. They do different jobs. Hooks are better only for workflow enforcement tasks."
variant: warning
:::

## The protocol

When an agent rule keeps failing, do not automatically add another paragraph to the prompt.

Ask four questions:

:::bullets
items:
  - "Is this a judgment problem or an enforcement problem?"
  - "Does it need to happen at a specific moment?"
  - "Can the condition be checked mechanically?"
  - "What should happen if the check fails?"
:::

If the answer is mechanical and timing-specific, it probably belongs in a hook, gate, or workflow transition.

If the answer requires taste, context, ambiguity, or strategic interpretation, keep it in prompts, docs, examples, and human review.

:::flowchart
steps:
  - {label: Define intent, note: "Use prompts, docs, and examples to specify goals, style, and operator posture."}
  - {label: Identify mandatory checkpoints, note: "Mark steps that must happen before publish, before tools, or after state changes."}
  - {label: Attach hooks or gates, note: "Enforce validation, logging, notifications, or approvals at the lifecycle moment."}
  - {label: Preserve human judgment, note: "Let humans or higher-level prompts decide whether the output is good."}
  - {label: Improve the system, note: "When failures repeat, tighten the workflow instead of lengthening the prompt."}
title: "How to Divide the Work Between Prompts and Hooks"
:::

## Where prompts still do the real work

A hook cannot decide whether an article is worth publishing.

It cannot tell whether a caveat is honest, whether the tone is too generic, or whether the source actually supports the claim. It cannot decide that a DS lead needs the operator consequence before the product detail.

That is prompt and human territory.

This is why mature agent systems need both layers. The prompt defines judgment. The hook enforces control points. The human owns taste and accountability.

## Same pattern at workflow scale

LangGraph makes the same distinction at a larger level. Durability is not a better prompt. It is a workflow guarantee with explicit tradeoffs.

:::comparison-table
columns:
  - Mode
  - Persists
  - Recovery
rows:
  - ["`\"exit\"`", "On graph exit only", "No mid-execution recovery"]
  - ["`\"async\"`", "Asynchronously while the next step runs", "Small risk on crash during write"]
  - ["`\"sync\"`", "Before the next step starts", "Full checkpoint integrity"]
title: "LangGraph durability modes"
:::

That table is the same argument in a larger workflow system. The operator question is not whether durability is a nice concept. The question is what you are willing to trade between latency and checkpoint integrity.

Hooks answer a smaller version of the same question. They turn critical control points into machinery instead of polite requests.

## The question

Which rules in your agent stack are still written like advice when they should be enforced like locks?

:::quote
text: "A prompt can tell the model what kind of work to do. A hook can make sure a critical step actually happens."
:::
