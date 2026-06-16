---
title: LLMs Are Search Engines for Science, Not Answer Engines
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
summary: >-
  IBM's quantum-error-correction work is a clean case study in the real discovery pattern: LLMs generate candidate programs, formal verifiers create trust, and the loop compounds search.
readingTime: 6
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

The useful story in IBM's new quantum-error-correction work is not that an LLM "did quantum physics." It is that a model was placed inside a discovery loop: generate many candidate programs, reject most of them with formal checks, promote the survivors, and feed the evidence back into the next search round.

That is the mental model shift. In science and technical operations, the model is not primarily an answer engine. It is a search engine over candidate explanations, programs, molecular designs, proofs, schedules, circuits, or code constructions. The trust does not come from fluent output. It comes from the verifier loop around it.

:::metric-strip
title: "Read the IBM result as a search system, not a chatbot claim"
metrics:
  - {label: "465 candidate QEC codes", value: "97 CSS BB + 368 non-CSS PBB variants", note: "At n ≤ 360"}
  - {label: "~200k candidates screened", value: "five LLM-guided evolutionary campaigns", note: "Cheap search before expensive checks"}
  - {label: "Not hardware-ready", value: "architecture, noise, decoder, and implementation proof still open", note: "Candidate-level result, not deployment claim"}
  - {label: "Verifier loop creates trust", value: "rank checks + decoders + MILP-style checks + expert review", note: "The moat is evaluation, not fluent text"}
:::

## What IBM actually built

The related arXiv paper, *Evolutionary Discovery of Bivariate Bicycle Codes with LLM-Guided Search*, describes a workflow for discovering quantum low-density parity-check codes, especially bivariate bicycle (BB) and perturbed bivariate bicycle (PBB) codes. These codes matter because quantum computers need error correction: many noisy physical qubits must encode fewer, more reliable logical qubits. A code is usually summarized as `[[n,k,d]]`: physical qubits, logical qubits, and distance.

The system does not ask a chatbot to name the best code. It evolves Python generator programs. Those programs emit polynomial tuples that define candidate BB or PBB codes across many lattice sizes. OpenEvolve provides the evolutionary loop: LLMs mutate programs, the pipeline scores candidates, the best patterns survive, and results feed back into future prompts.

That distinction matters. The LLM is not proving distance, running a decoder, or deciding physical viability. It is generating structured bets.

## The discovery stack: generate, filter, verify, interpret

The IBM/Qiskit workflow is valuable because it routes model creativity through increasingly hard gates. First comes cheap screening: compute basic properties such as encoding dimension using GF(2) rank checks. Then approximate decoding and distance estimates filter candidates further. Then exact or stronger checks — including MILP-based distance verification for selected cases and post-hoc verification across discovered codes — decide which claims deserve trust. Finally, experts interpret whether a candidate is novel, decomposable, useful, or just an artifact of the search.

This is why the paper's distance-trap example is important. Some BB codes with `A = B` have exact distance `d = 2`; BP-OSD missed that trap even after heavy trials, while MILP caught it quickly. That is the real lesson: even the verifier stack has failure modes, so discovery systems need layered evaluators, not one magic score.

:::flowchart
title: "Scientific LLM workflow: search first, answer later"
steps:
  - {label: "Generate", note: "LLM acts as generator/search operator, mutating programs or candidate designs"}
  - {label: "Filter", note: "Cheap deterministic screens remove invalid, duplicate, or low-signal candidates"}
  - {label: "Verify", note: "Simulators, decoders, theorem provers, MILP-style checks, tests, or assays create the trust layer"}
  - {label: "Interpret", note: "Domain experts decide novelty, usefulness, and failure modes"}
  - {label: "Feed back", note: "Verified winners and failures seed the next search round"}
:::

## Why QEC is a good example

Quantum error correction is almost tailor-made for this pattern. The search space is combinatorial and enormous. Human intuition matters, but it cannot enumerate every useful algebraic construction. At the same time, many candidate properties are checkable: commutativity constraints, rank, distance bounds, decoder behavior, equivalence classes, and figure of merit.

That combination — huge generative space plus meaningful evaluators — is exactly where LLM search becomes useful. The model can propose odd-looking program mutations that a human may not have written. The formal pipeline can reject most of them without sentimentality. The human scientist then studies the survivors.

The 465 codes should be read in that frame. They are not deployable quantum-computing breakthroughs. They are a catalog of candidate constructions, including known recoveries, new finite-length representatives, and non-CSS variants with interesting trade-offs. Some look better on figure of merit; some are decomposable; some need stronger distance confidence; all remain far from proving practical fault-tolerant hardware performance.

:::comparison-table
title: "Answer engine vs discovery search engine"
columns: ["Lens", "Answer engine", "Discovery search engine"]
rows:
  - ["Role", "Return a polished answer directly to the user", "Generate many structured bets for a downstream evaluation loop"]
  - ["Failure mode", "Hallucinated certainty: fluent output gets mistaken for truth", "Verifier gaming, blind spots, or validation cost become the bottleneck"]
  - ["Reliability layer", "Prompting, citations, and model self-consistency", "External tests, simulations, solvers, MILP-style checks, assays, and expert review"]
  - ["Best domains", "Low-stakes language tasks, summarization, drafting, and retrieval where errors are cheap", "Combinatorial search spaces where candidates are hard to invent but relatively easier to score"]
  - ["Weak domains", "High-consequence factual or technical claims without independent checks", "Domains where verification is slow, subjective, sparse, political, or weakly tied to reality"]
:::

## The operator lesson

This is the same family resemblance that made FunSearch and AlphaEvolve interesting. FunSearch paired a frozen LLM with a systematic evaluator to search over programs, producing new mathematical and algorithmic discoveries. AlphaEvolve generalized the idea into an evolutionary coding agent for algorithms and systems optimization, where automated evaluators score candidate programs and evolutionary selection compounds gains.

For a data-science or platform team, the implication is practical: do not ask the agent for one perfect answer. Ask it to generate a portfolio of candidates, then make the evaluation harness brutally explicit. Feature candidates should face leakage tests and holdout metrics. Forecasting ideas should face backtests and calibration checks. Data-quality hypotheses should face reproducible queries. Code changes should face unit tests, type checks, benchmarks, and production guardrails. The LLM widens the candidate pool; the harness decides what earns attention.

The same pattern travels well beyond quantum codes. In drug discovery, models can propose molecules while docking, ADMET predictors, synthesis constraints, and assays filter them. In materials, candidates can be screened by simulation before lab work. In chip design and systems optimization, generated code or layouts can be compiled, benchmarked, and stress-tested. In theorem proving, LLMs can suggest lemmas while proof assistants enforce correctness.

The boundary is just as important. This pattern breaks where verification is slow, subjective, sparse, or weakly correlated with reality. If there is no cheap evaluator, the LLM merely creates more plausible-looking noise. If the evaluator is gamed, the system optimizes the wrong proxy. If human review is missing, the catalog fills with artifacts.

## What remains unproven

First, IBM has not shown that these candidates improve real quantum hardware outcomes. Code parameters and simulations are necessary, not sufficient. Physical layout, syndrome extraction, thresholds, correlated noise, decoder practicality, and implementation overhead still matter.

Second, the workflow proves search utility, not scientific autonomy. Humans define the representation, the scoring cascade, the campaigns, and the interpretation. The system is powerful because the human and formal components are explicit.

Third, generalization depends on verifier quality. LLM-guided discovery is strongest when candidates can be scored reliably and often. It is weakest in domains where the ground truth is expensive, delayed, or political.

So the clean takeaway is not "LLMs can now do science." It is sharper: LLMs are becoming high-throughput proposal engines for scientific and technical work. Treat them like search. Pair them with ruthless evaluators. Publish the verifier loop, not the chatbot demo.
