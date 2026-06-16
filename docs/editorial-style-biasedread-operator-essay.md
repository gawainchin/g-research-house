# BiasedRead-style operator essay format

Use this for G Research House AI/operator essays when the topic is about workflow, tooling, agents, evals, second-brain systems, or DS operating habits.

The reference is the format of Martin's BiasedRead piece, "Why I Stopped Organizing My Second Brain." Do not copy the exact voice. Adopt the reader path.

## Core shift

Old default:

> thesis -> mechanism -> evidence -> implications -> caveats

Better for operator essays:

> scene -> pain -> villain -> reframing -> mechanism -> ritual -> payoff -> question

The goal is still evidence-backed analysis. The difference is that the reader enters through a lived problem, not a whitepaper thesis.

## Required structure

### 1. Personal cold open
Start with a concrete, slightly familiar moment.

Good:

> The first time I realized the workflow was broken, I was not thinking about AI strategy. I was copy-pasting the same note into ChatGPT for the third time.

Avoid:

> AI agents are transforming modern knowledge work.

### 2. Confession before thesis
Admit the old belief or bad habit.

Patterns:
- "I used to think..."
- "For years, I told myself..."
- "The embarrassing part is..."
- "Okay, actually, that is not quite true..."

### 3. Name the villain
Give the broken pattern a memorable handle.

Examples:
- Digital Graveyard
- Agent Babysitting Tax
- Prompt Graveyard
- Dashboard Theatre
- Context Debt
- The 3am Worker Problem
- Verifier Loop

The name should be concrete enough that a reader can repeat it later.

### 4. Breaking point
Show the exact moment the old workflow became absurd.

Good:

> I was manually acting as the data pipe between storage and compute. I was the friction.

### 5. Reframe with one dominant metaphor
Pick one metaphor and carry it through.

Examples:
- Personal knowledge = data lake
- Evals = immune system
- Agents = production line
- LLM memory = cache hierarchy
- AI coding = junior dev with infinite stamina and no taste

Do not stack five frameworks in one article.

### 6. Practical protocol
Give the reader the actual operating pattern.

Use short, blunt steps:

1. Capture the raw material.
2. Generate the search beacon.
3. Link it to prior context.
4. Review for hallucination.
5. Move on.

### 7. Technical nod
For technical readers, name the formal concept after the story has landed.

Pattern:

> If you are a data person, yes, this is basically RAG. That is the point.

### 8. Payoff
Show what changed in human terms.

Good:

> My Sundays are mine again.

For G Research House, this can be operational:

> The team stops babysitting the agent and starts reviewing decisions.

### 9. Closing question
End with a pointed self-audit question.

Examples:
- "How much of your second brain is actually a digital graveyard?"
- "How much of your agent workflow is just you doing ops by hand?"
- "What part of your AI stack only works because one tired person remembers to check it?"

## Voice rules

- Use short paragraphs. Mostly 1-3 sentences.
- Let the writer be present. Controlled first person is good.
- Prefer plain irritation over polished neutrality.
- Use one-line paragraphs when the point deserves a beat.
- Do not overdo title case in body headings. Sentence case is usually more human.
- Avoid generic AI-signposting: "Let's dive in", "This highlights", "In today's landscape".
- Keep evidence discipline. Story opens the door; proof keeps trust.

## Article template

```md
# [Concrete contrarian title]

[Personal scene. Specific. Slightly embarrassing or familiar.]

[Admission: I used to think X.]

But that was the trap.

[Name the broken pattern.]

For years, I treated [thing] like [old model]. I thought if I just organized it better, tagged it better, dashboarded it better, the system would finally work.

It did not.

## The real problem

[Concrete failure mode.]

The problem was not [obvious culprit]. The problem was that I had become [bottleneck role].

I was the friction.

## The better model

Stop thinking of this as [old model].

Think of it as [new model].

[Technical bridge, simply explained.]

## The protocol

Here is the version I would actually use:

1. [Action]
2. [Action]
3. [Action]
4. [Human review / guardrail]

No ceremony. No dashboard theatre.

## Where it works

[Conditions where the pattern is reliable.]

## Where it breaks

[Verifier gaps, human judgment gaps, cost, governance, taste.]

## The question

[Pointed self-audit question.]
```

## Final readiness check

Before publishing, ask:

- Does the first screen contain a human situation, not just a thesis?
- Is there one named metaphor readers can remember?
- Does the article offer a protocol, not just an opinion?
- Is the technical concept introduced after the reader understands the pain?
- Is the ending a question or decision point rather than a generic conclusion?
- Did we keep source links and factual claims tight?
