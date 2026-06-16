---
title: The Verifier Loop Is the Product
slug: llms-are-search-engines-for-science-not-answer-engines
section: ai-research
date: 2026-06-15
tags:
  - ai
  - llms
  - scientific-discovery
  - quantum-computing
  - evaluation
  - agents
keywords:
  - LLM-guided search
  - quantum error correction
  - OpenEvolve
  - FunSearch
  - AlphaEvolve
  - verifier loops
format: thesis
perspective: operator
summary: >-
  IBM's quantum-error-correction work is a clean case study in the real discovery pattern: LLMs generate candidate programs, formal verifiers create trust, and the loop compounds search.
readingTime: 5
relatedSlugs:
  - agentic-inference-memory-io-pressure-indicator
  - hooks-dont-replace-prompts
  - from-chatbot-to-workflow
sourceLinks:
  - label: "IBM Research — Can LLMs discover quantum error correction codes?"
    url: "https://research.ibm.com/blog/ai-for-qec"
  - label: "arXiv — Evolutionary Discovery of Bivariate Bicycle Codes with LLM-Guided Search"
    url: "https://arxiv.org/abs/2606.02418"
  - label: "Qiskit Community — qcode-discovery repository"
    url: "https://github.com/qiskit-community/qcode-discovery"
  - label: "Nature — FunSearch: Mathematical discoveries from program search with large language models"
    url: "https://www.nature.com/articles/s41586-023-06924-6"
  - label: "Google DeepMind — AlphaEvolve"
    url: "https://deepmind.google/discover/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/"
---

The weakest way to read IBM’s quantum-error-correction work is also the most tempting one.

AI found quantum codes. LLMs are doing science. Another frontier falls.

Nice headline. Wrong lesson.

The useful story is stranger and more practical: the LLM was not trusted to be right. It was used to generate lots of structured bets. Then a stack of checks, simulations, solvers, and human interpretation decided which bets deserved attention.

That is the part worth copying.

The verifier loop is the product.

:::metric-strip
title: "Read IBM’s Result as a Search System, Not a Chatbot Claim"
metrics:
  - {label: "465 candidate QEC codes", value: "97 CSS BB + 368 non-CSS PBB variants", note: "At n ≤ 360"}
  - {label: "~200k candidates screened", value: "five LLM-guided evolutionary campaigns", note: "Cheap search before expensive checks"}
  - {label: "Not hardware-ready", value: "architecture, noise, decoder, and implementation proof still open", note: "Candidate-level result, not deployment claim"}
  - {label: "Verifier loop creates trust", value: "rank checks + decoders + MILP-style checks + expert review", note: "The moat is evaluation, not fluent text"}
:::

## The old mistake

We keep asking LLMs for answers when we should be asking them for candidates.

That mistake is easy to make. Chat interfaces train us to expect a polished response. The model talks like it knows. It gives the impression of judgment.

But in scientific and technical work, that is usually the wrong interface. The valuable thing is not a fluent final answer. The valuable thing is a wider search over programs, explanations, molecules, proofs, schedules, circuits, or code constructions.

Then something outside the model has to decide what survives.

## What IBM actually built

The related arXiv paper, *Evolutionary Discovery of Bivariate Bicycle Codes with LLM-Guided Search*, describes a workflow for discovering quantum low-density parity-check codes, especially bivariate bicycle (BB) and perturbed bivariate bicycle (PBB) codes.

These codes matter because quantum computers need error correction. Many noisy physical qubits must encode fewer, more reliable logical qubits. A code is usually summarized as `[[n,k,d]]`: physical qubits, logical qubits, and distance.

IBM’s system did not ask a chatbot to name the best code.

It evolved Python generator programs. Those programs emitted polynomial tuples that define candidate BB or PBB codes across many lattice sizes. OpenEvolve provided the evolutionary loop: LLMs mutate programs, the pipeline scores candidates, the best patterns survive, and the evidence feeds back into future prompts.

The LLM was not proving distance. It was not running the decoder. It was not deciding physical viability.

It was generating structured bets.

:::flowchart
title: "Scientific LLM Workflow: Search First, Answer Later"
steps:
  - {label: "Generate", note: "LLM acts as generator/search operator, mutating programs or candidate designs"}
  - {label: "Filter", note: "Cheap deterministic screens remove invalid, duplicate, or low-signal candidates"}
  - {label: "Verify", note: "Simulators, decoders, theorem provers, MILP-style checks, tests, or assays create the trust layer"}
  - {label: "Interpret", note: "Domain experts decide novelty, usefulness, and failure modes"}
  - {label: "Feed back", note: "Verified winners and failures seed the next search round"}
:::

## Why QEC is a good test case

Quantum error correction is almost tailor-made for this pattern.

The search space is huge. Human intuition matters, but it cannot enumerate every useful algebraic construction. At the same time, many candidate properties are checkable: commutativity constraints, rank, distance bounds, decoder behavior, equivalence classes, and figure of merit.

That combination is where LLM search starts to make sense.

The model can propose odd-looking program mutations. The formal pipeline can reject most of them without sentimentality. The scientist studies the survivors.

The 465 codes should be read in that frame. They are not deployable quantum-computing breakthroughs. They are a catalog of candidate constructions, including known recoveries, new finite-length representatives, and non-CSS variants with interesting trade-offs.

Some look better on figure of merit. Some are decomposable. Some need stronger distance confidence. All remain far from proving practical fault-tolerant hardware performance.

:::comparison-table
title: "Answer Engine vs. Discovery Search Engine"
columns: ["Lens", "Answer engine", "Discovery search engine"]
rows:
  - ["Role", "Return a polished answer directly to the user", "Generate many structured bets for a downstream evaluation loop"]
  - ["Failure mode", "Hallucinated certainty: fluent output gets mistaken for truth", "Verifier gaming, blind spots, or validation cost become the bottleneck"]
  - ["Reliability layer", "Prompting, citations, and model self-consistency", "External tests, simulations, solvers, MILP-style checks, assays, and expert review"]
  - ["Best domains", "Low-stakes language tasks where errors are cheap", "Combinatorial search spaces where candidates are hard to invent but easier to score"]
  - ["Weak domains", "High-consequence claims without independent checks", "Domains where verification is slow, subjective, sparse, political, or weakly tied to reality"]
:::

## The distance trap

The most useful detail in the paper is not the big candidate count. It is the verifier failure.

Some BB codes with `A = B` have exact distance `d = 2`. BP-OSD missed that trap even after heavy trials. MILP caught it quickly.

That is the whole article in miniature.

Even the verifier stack has failure modes. A discovery system does not need one magic score. It needs layered evaluators, each with known weaknesses, plus humans who understand what those weaknesses mean.

## The operator lesson

This is the same family resemblance that made FunSearch and AlphaEvolve interesting. The model expands the candidate frontier. The evaluator decides what deserves another round.

For a DS or platform team, the protocol is straightforward:

:::bullets
items:
  - "Ask the model for many candidates, not one perfect answer."
  - "Make the evaluation harness explicit."
  - "Keep cheap filters before expensive checks."
  - "Track verifier failures as first-class evidence."
  - "Let humans interpret the survivors."
:::

Feature ideas should face leakage tests and holdout metrics. Forecasting ideas should face backtests and calibration checks. Data-quality hypotheses should face reproducible queries. Code changes should face unit tests, type checks, benchmarks, and production guardrails.

The LLM widens the candidate pool. The harness decides what earns attention.

## What remains unproven

IBM has not shown that these candidates improve real quantum hardware outcomes. Code parameters and simulations are necessary, not sufficient. Physical layout, syndrome extraction, thresholds, correlated noise, decoder practicality, and implementation overhead still matter.

The workflow proves search utility, not scientific autonomy. Humans define the representation, scoring cascade, campaigns, and interpretation.

Generalization depends on verifier quality. LLM-guided discovery is strongest when candidates can be scored reliably and often. It is weakest where ground truth is expensive, delayed, subjective, or politically shaped.

So the takeaway is not that LLMs can now do science.

It is sharper: stop publishing chatbot demos. Publish the verifier loop.

## The question

Where in your workflow are you still asking the model for an answer when you should be building a search-and-verify loop?
