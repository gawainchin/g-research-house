---
title: Prompt Engineering Was the Warm-Up. Loop Engineering Is the Job.
slug: prompt-engineering-was-the-warm-up-loop-engineering-is-the-job
section: ai-research
visualKey: loops
date: 2026-06-18
tags:
  - ai
  - agents
  - workflow
  - evals
  - observability
  - data-science
  - operator
keywords:
  - loop engineering
  - agent workflows
  - AI evals
  - agent observability
  - human in the loop
  - workflow automation
  - DS operator AI
format: workflow
perspective: operator
summary: "The prompt starts the work. The loop decides whether the work is real: observe, act, verify, recover, escalate, and learn."
readingTime: 9
relatedSlugs:
  - hooks-dont-replace-prompts
  - from-chatbot-to-workflow
  - agentic-coding-real-bottleneck
  - agentic-inference-memory-io-pressure-indicator
sourceLinks:
  - label: "Anthropic — Building effective agents"
    url: "https://www.anthropic.com/research/building-effective-agents"
  - label: "Anthropic — Writing tools for agents"
    url: "https://www.anthropic.com/engineering/writing-tools-for-agents"
  - label: "OpenAI Agents SDK — Tracing"
    url: "https://openai.github.io/openai-agents-python/tracing"
  - label: "ReAct paper"
    url: "https://arxiv.org/abs/2210.03629"
  - label: "Reflexion paper"
    url: "https://arxiv.org/abs/2303.11366"
  - label: "NIST AI RMF"
    url: "https://www.nist.gov/itl/ai-risk-management-framework"
heroImage:
  url: "/images/loop-engineering-hero.svg"
  alt: "Diagram of a prompt feeding an engineered agent loop with observe, act, verify, recover, escalate, and learn stages."
  caption: "The prompt is the input. The loop is the operating system around the model."
---
:::paragraph
text: "The awkward truth about agents is that a good prompt can still produce a bad workflow."
:::

:::paragraph
text: |-
  You see it the moment the demo leaves the chat box. The agent uses stale context. It calls the wrong tool. It gives an answer that sounds right but does not tie back to evidence. It fails halfway through and leaves no trace of what happened. It keeps retrying the same mistake because nothing in the system remembers the failure.
:::

:::paragraph
text: "That is not a prompt problem. It is a loop problem."
:::

:::paragraph
text: |-
  Prompt engineering mattered because it taught teams to describe the task clearly. That skill still matters. But once AI systems start using tools, reading data, writing code, drafting emails, or touching customer workflows, the prompt is only the opening instruction.
:::

:::paragraph
text: "The job becomes loop engineering."
:::

:::paragraph
text: |-
  Call it loop engineering, agent engineering, or workflow design. The label matters less than the operating frame: the value sits in the control system around the model, not just the prompt.
:::

:::paragraph
text: |-
  For this piece, loop engineering means designing the system around an AI agent:
:::

:::paragraph
text: "observe -> act -> verify -> recover -> escalate -> learn."
:::

:::paragraph
text: |-
  It asks a different set of questions:
:::

:::bullets
items:
  - "What does the agent observe before it acts?"
  - "What tools can it use, and under what permissions?"
  - "How does it know whether the action worked?"
  - "What happens when evidence is weak, a tool fails, or the output is risky?"
  - "When does it stop and ask a human?"
  - "What gets logged, evaluated, and improved before the next run?"
:::

:::paragraph
text: |-
  That is where the operating leverage sits. The prompt starts the work. The loop decides whether the work is real.
:::

:::thesis-card
label: "Core thesis"
title: "A prompt asks once. A loop keeps the system honest."
text: |-
  Prompt engineering shapes a model response. Loop engineering shapes the workflow around the model: what it observes, what it can do, how it verifies the result, when it recovers, when it escalates, and what it learns for next time.
:::

:::key-takeaways
takeaways:
  -
      icon: "↻"
      text: "The prompt is still useful, but it is only the opening instruction."
  -
      icon: "✓"
      text: "Agent reliability depends on observation, evals, permissions, traces, and recovery paths."
  -
      icon: "⚙"
      text: "For DS and operator teams, the new skill is designing observable workflows, not collecting clever prompt templates."
  -
      icon: "⛔"
      text: "The safest agent is often the one that knows when to stop and ask a human."
:::

:::heading
text: "Prompting controls a response. Loop engineering controls a workflow."
:::

:::paragraph
text: "Prompt engineering shapes the model's next answer."
:::

:::paragraph
text: "Loop engineering shapes the behavior of the system over time."
:::

:::paragraph
text: |-
  That distinction matters because useful agents do not live in blank chat boxes. They sit inside workflows. They search, retrieve, classify, draft, execute code, call APIs, inspect results, and hand work back to humans.
:::

:::paragraph
text: |-
  The research pattern has been visible for a while. ReAct, the 2023 ICLR paper by Yao et al., showed the value of interleaving reasoning with actions and observations. The model does not just answer from memory. It acts, observes what comes back, updates its next step, and leaves a more inspectable trajectory. That does not make every agent reliable. It does show why the one-shot framing is too small for tool-using systems.
:::

:::paragraph
text: |-
  Reflexion pushed a related idea: feedback from a task can be turned into memory for later attempts. In the paper's setup, agents used verbal reflections from feedback to improve subsequent runs across reasoning, coding, and decision tasks. The safe takeaway is not "agents self-improve forever." It is narrower and more useful: a failure can become an input to the next run if the system captures it properly.
:::

:::paragraph
text: |-
  Across the major agent stacks, the implementation emphasis is shifting beyond prompt text toward traces, evals, checkpoints, approval gates, permissions, and telemetry.
:::

:::paragraph
text: |-
  OpenAI's Agents SDK has tracing built in. Traces record model calls, tool calls, handoffs, guardrails, and custom events. LangSmith frames traces and evaluations as the raw material for debugging and improving agent behavior. Microsoft Foundry packages evaluators, production monitoring, distributed tracing, quality gates, and agent-specific metrics like tool-call accuracy and task completion. LangGraph talks about durable execution, persistence, recovery, and human-in-the-loop workflows.
:::

:::paragraph
text: "Prompts are not dead. They are just not the whole product."
:::

:::comparison-table
title: "Prompt engineering vs loop engineering"
columns:
  - "Question"
  - "Prompt engineering"
  - "Loop engineering"
rows:
  - ["Primary object", "The model response", "The workflow behavior"]
  - ["Main lever", "Instructions, examples, tone, constraints", "State, tools, evals, permissions, traces, recovery"]
  - ["Good for", "One-shot drafting, framing, judgment posture", "Repeated work with evidence, side effects, or risk"]
  - ["Failure mode", "The model misunderstands or forgets", "The system has no eyes, brakes, memory, or escalation path"]
  - ["Operator question", "Did the answer sound right?", "Did the work actually complete, and can we prove it?"]
:::

:::heading
text: |-
  The failure mode is "no eyes, no brakes, no memory"
:::

:::paragraph
text: |-
  A prompt-only workflow often looks clean in a demo:
:::

:::numbered-list
items:
  - "User asks for work."
  - "Model answers."
  - "Human checks it."
  - "Everyone moves on."
:::

:::paragraph
text: |-
  That can be fine for low-stakes drafting. It breaks down when the workflow has state, tools, uncertainty, or consequences.
:::

:::paragraph
text: |-
  The failure mode is usually not that the prompt was bad. It is that the system had no eyes, no brakes, and no memory.
:::

:::paragraph
text: |-
  No eyes: the agent cannot reliably see whether its inputs are fresh, whether the tool returned the right object, or whether the evidence supports the answer.
:::

:::paragraph
text: |-
  No brakes: the agent has no approval gate before sensitive actions, no least-privilege boundary, and no threshold for "stop, this needs a human."
:::

:::paragraph
text: |-
  No memory: the same failure happens again next week because the trace never became an eval case, a rule, a test, or a better tool contract.
:::

:::paragraph
text: "This is why classical software instincts start to matter again."
:::

:::paragraph
text: "Not because LLM agents are deterministic. They are not."
:::

:::paragraph
text: "Because non-deterministic systems need more instrumentation, not less."
:::

:::paragraph
text: |-
  A web service can return HTTP 200 and still give a useless AI answer. A coding agent can run a command successfully and still patch the wrong file. A research agent can cite five sources and still overstate what those sources prove. Traditional uptime and latency monitoring are not enough for this class of failure. You need quality-aware checks: groundedness, task completion, tool-call accuracy, source coverage, policy compliance, and review outcomes.
:::

:::flowchart
title: "The engineered loop"
steps:
  -
      label: "Observe"
      note: "Collect fresh context, source boundaries, tool outputs, errors, and user feedback."
  -
      label: "Act"
      note: "Use tools within explicit permissions and reversible-action rules."
  -
      label: "Verify"
      note: "Run tests, evals, schema checks, citation checks, or human review."
  -
      label: "Recover"
      note: "Retry narrowly, switch tools, roll back, or capture the failed trace."
  -
      label: "Escalate"
      note: "Stop when risk, uncertainty, or authority exceeds the loop."
  -
      label: "Learn"
      note: "Turn repeated failures into eval cases, rules, better tools, or regression checks."
:::

:::heading
text: "The loop stack"
:::

:::paragraph
text: "A practical loop has six layers."
:::

:::paragraph
text: |-
  First, the goal. What is the loop optimizing for? Not "help with email." More like: classify inbound messages, draft responses only when confidence is high, never send externally without approval, and escalate anything involving legal, finance, or customer commitments.
:::

:::paragraph
text: |-
  Second, context. What does the agent know, and what is untrusted? This includes source boundaries, retrieval rules, freshness checks, and explicit treatment of user-provided text as untrusted when tool use or external action is involved.
:::

:::paragraph
text: |-
  Third, action. What can it do? Search, summarize, label, draft, execute code, update a CRM field, open a ticket. The loop needs permissions, not just tools. Reversible actions should be treated differently from irreversible ones.
:::

:::paragraph
text: |-
  Fourth, observation. What comes back from the world? Tool outputs, logs, database rows, tests, errors, user feedback, source extracts. If the system does not capture observations, the agent is flying blind.
:::

:::paragraph
text: |-
  Fifth, evaluation. How do we know if the step worked? This can be a deterministic test, a schema check, a citation coverage check, a rubric-based eval, a human review, or a sampled production audit. OpenAI's Evals repo makes the basic point well: high-quality evals for actual use cases are one of the most important assets teams can build around LLM systems.
:::

:::paragraph
text: |-
  Sixth, adaptation. What changes after failure or new evidence? Retry with narrower context. Switch tools. Roll back. Escalate. Add a regression test. Turn a bad trace into an eval example. Update the tool description because the model keeps misusing it. Anthropic's tool-writing guidance is basically this loop: prototype, test on realistic tasks, analyze transcripts and metrics, improve tools, rerun evals, and validate on held-out cases.
:::

:::comparison-table
title: "The loop stack"
columns:
  - "Layer"
  - "Design question"
  - "If missing"
rows:
  - ["Goal", "What counts as success, failure, and stop?", "The agent optimizes for vibes."]
  - ["Context", "What can it trust, retrieve, and cite?", "Stale or poisoned inputs steer the run."]
  - ["Action", "What tools and permissions are allowed?", "Capability outruns control."]
  - ["Observation", "What evidence comes back from the world?", "The agent is flying blind."]
  - ["Evaluation", "What check decides whether the step worked?", "Fluent output replaces proof."]
  - ["Adaptation", "What happens after failure or weak evidence?", "The same mistake repeats."]
:::

:::heading
text: "Five workflows where loop engineering changes the outcome"
:::

:::heading
text: "1. Inbox triage"
:::

:::paragraph
text: |-
  A prompt-only inbox assistant says: "Read this email and draft a reply."
:::

:::paragraph
text: "A loop-engineered inbox assistant does more work before it writes."
:::

:::paragraph
text: |-
  It observes the sender, thread history, calendar context, customer status, and whether the email contains sensitive topics. It classifies the message. It drafts a reply only when confidence is high. It verifies sender identity and checks that the draft does not invent commitments. It escalates refunds, legal issues, pricing, HR, and anything externally sensitive. It learns from corrections by saving accepted and rejected drafts as eval examples.
:::

:::paragraph
text: |-
  The value is not that the email sounds polished. The value is that the assistant knows when not to send.
:::

:::paragraph
text: |-
  This is where least privilege matters. A triage agent can label emails early. It should earn the right to draft. It should earn even more trust before it sends anything outside the company. The World Economic Forum's agent governance paper makes the same point in policy language: as autonomy grows, safeguards need to grow with it.
:::

:::heading
text: "2. Research agent"
:::

:::paragraph
text: "A prompt-only research agent gives you a confident summary."
:::

:::paragraph
text: "A loop-engineered research agent leaves a trail."
:::

:::paragraph
text: |-
  It searches. It reads. It extracts claims. It compares sources. It marks weak evidence. It distinguishes "source says" from "we infer." It verifies that every strong claim has citation coverage. When sources conflict, it does not smooth over the contradiction. It either searches further or flags the uncertainty.
:::

:::paragraph
text: |-
  The artifact is not just the memo. It is the trace of what the agent read and how each claim was supported.
:::

:::paragraph
text: |-
  This is the difference between a useful research assistant and a confident but weakly grounded summary engine. ReAct supports the underlying pattern: external observations can ground later reasoning and make the trajectory more inspectable. But the agent still needs evals around citation quality, source selection, and unsupported broadening.
:::

:::heading
text: "3. Coding agent"
:::

:::paragraph
text: "A prompt-only coding agent edits until the code looks plausible."
:::

:::paragraph
text: "A loop-engineered coding agent works like a junior engineer with a harness."
:::

:::paragraph
text: |-
  It observes the repo before touching it. It traces symbol definitions and usages. It makes a small change. It runs targeted tests. It inspects the diff. It checks for secrets and broad unintended edits. If a test fails, it uses the failure as an observation, not as an excuse to thrash. If the patch affects security, data, money, or production behavior, it escalates for review.
:::

:::paragraph
text: |-
  The important part is the harness: tests, lint, type checks, diff review, rollback, and human approval before merge.
:::

:::paragraph
text: |-
  Reflexion is relevant here, but only if used carefully. The paper supports the idea that feedback from failed attempts can improve later attempts in specific coding and reasoning setups. It does not mean a coding agent should be allowed to loop forever. Good loop engineering sets a retry budget, captures the failure, and escalates when the system is out of its depth.
:::

:::heading
text: "4. Data quality monitoring"
:::

:::paragraph
text: "Data teams already understand loops. They just do not always call them that."
:::

:::paragraph
text: |-
  A bad monitoring setup says: pipeline ran, dashboard is green.
:::

:::paragraph
text: |-
  A better loop observes schema changes, anomaly scores, sample rows, freshness, volume, joins, downstream complaints, and business-rule violations. It acts by flagging, quarantining, backfilling, or opening an incident. It verifies the anomaly against thresholds and historical distributions. It recovers through rollback or replay. It escalates when the issue affects decisions. It learns by adding the failure as a regression check.
:::

:::paragraph
text: "This is the same instinct AI agents need."
:::

:::paragraph
text: |-
  The lesson from LLM observability is useful here: the request can succeed while the work fails. A model can return a valid JSON object that is semantically wrong. A report can generate on time with numbers that do not reconcile. A monitoring system that only checks availability will miss the failure that actually matters.
:::

:::heading
text: "5. Sales and reporting"
:::

:::paragraph
text: |-
  A sales/reporting agent is tempting because the workflow is repetitive: pull CRM data, summarize account status, draft follow-up, produce a forecast narrative, build the QBR slide.
:::

:::paragraph
text: "It is also dangerous because the numbers travel."
:::

:::paragraph
text: |-
  A loop-engineered reporting agent observes CRM records, pricing rules, account history, source docs, pipeline changes, and prior commitments. It drafts the narrative. It verifies factual grounding, reconciles totals, checks customer-specific claims, and flags anomalies. It escalates before external sends, pricing changes, or customer commitments. It learns from what reps edit, accept, or reject.
:::

:::paragraph
text: |-
  The model output is not the whole challenge. The hard part is deciding which actions require approval and which numbers must tie out before the draft leaves the system.
:::

:::paragraph
text: |-
  Microsoft's Foundry docs are useful here because they treat evaluation, quality gates, monitoring, tracing, and agent-specific metrics as production concerns, not research extras. For sales workflows, that means measuring more than "did the agent generate a report?" It means checking whether the report was grounded, accurate, compliant, useful, and approved where it needed approval.
:::

:::heading
text: "Loop engineering is a DS/operator skill"
:::

:::paragraph
text: "For data scientists and operators, loop engineering should feel familiar."
:::

:::paragraph
text: "It is part ML evaluation, part workflow design, part observability, part risk management."
:::

:::paragraph
text: |-
  You are not just writing instructions for a model. You are designing a process that handles uncertainty.
:::

:::paragraph
text: "That changes the work."
:::

:::paragraph
text: |-
  You need task-specific evals, not just generic benchmark scores. A benchmark can tell you something about a model. It cannot tell you whether your research agent cites sources correctly, whether your inbox agent escalates sensitive threads, or whether your reporting agent reconciles CRM totals.
:::

:::paragraph
text: |-
  You need traces, because screenshots of chat outputs are not an audit trail. A trace should show which tools were called, what evidence came back, what the model did with it, where the verifier passed or failed, and when a human took over.
:::

:::paragraph
text: |-
  You need permissions. More tools do not automatically make an agent better. Anthropic's agent guidance is blunt on this: start with simple systems, add agentic complexity only when it improves outcomes, and use workflows and gates when the task is predictable.
:::

:::paragraph
text: |-
  You need escalation rules. Human-in-the-loop is not magic dust. It only works if the system knows when to stop, what context to show the reviewer, and what authority the reviewer has.
:::

:::paragraph
text: |-
  You need a learning path. Not mystical self-improvement. Just basic engineering hygiene: failed trace -> labeled example -> eval case -> tool/prompt/retriever fix -> regression check.
:::

:::paragraph
text: |-
  In practice, that means owning eval coverage, escalation thresholds, tool permissions, audit trails, and rollback paths the same way you already own data quality checks or model monitoring.
:::

:::paragraph
text: "That is loop engineering."
:::

:::heading
text: "The control-loop analogy is useful, but keep it humble"
:::

:::paragraph
text: "There is an obvious analogy to closed-loop control systems."
:::

:::paragraph
text: |-
  A closed-loop system observes state, compares it with a target, and adjusts future action. Agent workflows can do something similar: observe tool results or user feedback, compare against success criteria, then retry, reroute, recover, escalate, or update the system.
:::

:::paragraph
text: "The analogy helps because it gets people out of the one-shot mindset."
:::

:::paragraph
text: "But it has limits."
:::

:::paragraph
text: |-
  LLM agent loops do not inherit the mathematical guarantees of classical control systems. Unless you have actually designed and proven stability, convergence, or optimality, do not imply it. The safer claim is this: loop engineering borrows the closed-loop instinct, observe, compare, correct, but it does not magically make probabilistic systems reliable.
:::

:::paragraph
text: |-
  NIST's AI Risk Management Framework is a useful governance cousin here. It frames AI risk work around Govern, Map, Measure, and Manage, with testing, evaluation, validation, documentation, and continuous improvement across the lifecycle. That is not the same as engineering an agent loop, but it supports the same operating principle: responsible AI systems need lifecycle controls, not just pre-launch review.
:::

:::heading
text: "What to build first"
:::

:::paragraph
text: "Do not start by building a fully autonomous agent."
:::

:::paragraph
text: "Start with the loop."
:::

:::paragraph
text: |-
  Pick one workflow where the pain is real and the blast radius is bounded. Inbox triage. Research collection. Test failure diagnosis. Data quality alerts. Weekly sales summaries.
:::

:::paragraph
text: |-
  Then write the loop spec:
:::

:::numbered-list
items:
  - "Goal: what counts as success, failure, and stop?"
  - "Context: what sources can it use, and what should it distrust?"
  - "Actions: what tools can it call, and which actions are reversible?"
  - "Observation: what evidence must it capture after each step?"
  - "Verification: what checks must pass before delivery?"
  - "Recovery: what happens on failure, missing data, or uncertainty?"
  - "Escalation: when does a human approve, reject, or take over?"
  - "Learning: which traces become eval cases or rule updates?"
:::

:::paragraph
text: "If you cannot answer those questions, a stronger prompt will not save you."
:::

:::paragraph
text: |-
  It may produce a better answer in the demo. It will not give the system eyes, brakes, or memory.
:::

:::paragraph
text: |-
  The teams that get the most value from agents will usually be the ones that can turn messy model behavior into observable, testable, recoverable workflows.
:::

:::paragraph
text: "Prompt engineering was the warm-up."
:::

:::paragraph
text: "Loop engineering is the job."
:::

:::heading
text: "Sources used"
:::

:::bullets
items:
  - "Anthropic, \"Building effective agents\". https://www.anthropic.com/research/building-effective-agents"
  - "Anthropic Engineering, \"Writing effective tools for AI agents\". https://www.anthropic.com/engineering/writing-tools-for-agents"
  - "OpenAI Agents SDK, \"Tracing\". https://openai.github.io/openai-agents-python/tracing"
  - "OpenAI Evals GitHub repository. https://github.com/openai/evals"
  - "LangChain, \"Why LLM observability and monitoring need evaluations\". https://www.langchain.com/resources/llm-monitoring-observability"
  - "Microsoft Foundry, \"Observability in generative AI\". https://learn.microsoft.com/en-us/azure/foundry/concepts/observability"
  - "LangGraph docs, \"Persistence\". https://docs.langchain.com/oss/python/langgraph/persistence"
  - "Yao et al., \"ReAct: Synergizing Reasoning and Acting in Language Models\". https://arxiv.org/abs/2210.03629"
  - "Shinn et al., \"Reflexion: Language Agents with Verbal Reinforcement Learning\". https://arxiv.org/abs/2303.11366"
  - "NIST, \"Artificial Intelligence Risk Management Framework (AI RMF 1.0)\". https://www.nist.gov/itl/ai-risk-management-framework"
  - "World Economic Forum, \"AI Agents in Action: Foundations for Evaluation and Governance\". https://www.weforum.org/publications/ai-agents-in-action-foundations-for-evaluation-and-governance/"
:::
