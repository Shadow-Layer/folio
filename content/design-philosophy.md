# Design Philosophy

This portfolio is not a conventional website. It is a knowledge-first professional system that communicates systems engineering through evidence and progressive disclosure.

The following principles govern its design and implementation.

## 1. State-driven execution

**Why:** Do work when state changes. Not continuously.

The interface is a projection of application state. When state changes, the system performs only the necessary computation and updates.

Idle state should approach computational inactivity. There is no polling, no continuous re-renders, no background monitoring of unchanged information.

The principle:

> Do work when state changes require work.

**How it's implemented:**

- Content loads only on interaction
- State changes trigger specific functions
- Loaded content is cached; repeated requests don't re-fetch
- No setInterval, no observers, no polling loops
- When the user stops interacting, the system stops working

## 2. Progressive disclosure

**Why:** Complexity should be revealed, not removed.

Visitors should not see the entire system at once. Depth should be accessible but not mandatory.

Reveal complexity progressively as the visitor's intent becomes more specific.

**How it's implemented:**

- Initial state: Identity card with a single "Explore" button
- First interaction: Topics menu (About, Projects, Philosophy, Research, Contact)
- Second interaction: Topic content or project list
- Third interaction: Individual project details
- Deeper: Evidence, architecture, and verified external project documentation where available

Technical users can access depth. Casual visitors can understand identity and projects without technical detail.

## 3. Knowledge-first architecture

**Why:** Content is durable. Interfaces are temporary.

Durable content (Markdown files) is the primary source of truth. The interface interprets and projects knowledge; it does not own or obscure it.

**How it's implemented:**

- All durable content lives in Markdown files under `/content/`
- A single manifest (`manifest.json`) indexes available content
- The JavaScript reads content on demand and renders it
- If the interface disappeared, the Markdown files would still be valid knowledge
- Content is never embedded in JavaScript
- No CMS, no database, no content API

The interface is a reader over a knowledge corpus.

## 4. Resource-aware interfaces

**Why:** Computation should be minimal. Efficiency is a feature.

Avoid unnecessary:

- Dependencies
- JavaScript execution
- DOM updates
- Network requests
- Background work
- Rendering complexity

The objective is not merely visual minimalism. It is computational minimalism.

**How it's implemented:**

- No framework (React, Vue, Svelte)
- No build step
- No CSS framework
- No animation library
- No unnecessary npm packages
- Content fetched on demand, not preloaded
- Static HTML/CSS/JavaScript only
- Minimal markdown rendering (headings, paragraphs, lists)

The overhead of the system should be substantially less than the overhead of the content.

## 5. Evidence-first claims

**Why:** Credibility comes from evidence.

Every substantive professional claim must be backed by verifiable evidence. Do not turn uncertainty into marketing language.

Use the established evidence taxonomy:

- **Proven:** Built and shipped in production
- **Working:** Built and understand deeply
- **Developing:** Learning actively
- **Target:** Planning to learn
- **Don't claim:** Uncertain or speculative

If evidence is unavailable: Do not claim it.

**How it's implemented:**

- Technology claims are grounded in project artifacts; public links are included only when verified
- Projects reference actual artifacts (source repositories and documentation)
- No metrics, dates, or outcomes that cannot be verified
- No invented organizational structure
- No fabricated accomplishments
- Implemented technology claims are tied to project artifacts where available

## 6. Interaction as navigation

**Why:** Navigation should reveal structure.

Interaction should reveal the knowledge structure. The interface should not depend on a conventional navigation bar containing every possible destination.

The user should discover deeper structure through interaction.

However, interaction must remain understandable without documentation.

**How it's implemented:**

- No traditional navbar
- Single "Explore" entry point
- Topics menu discovered through interaction
- Projects listed only when requested
- Back/Escape buttons for clear navigation
- Meaningful state transitions map to clear interactions

## 7. Complexity containment

**Why:** Simple surface, deep system.

Complexity belongs underneath the surface. The initial interface should remain calm. Technical depth should exist behind intentional interaction rather than being removed.

**How it's implemented:**

- Initial screen: Single identity card
- Technical depth available progressively
- Architecture details behind "project" interactions
- Infrastructure details behind "what it proves" interactions
- No technical jargon on the initial screen
- Depth emerges from interaction, not from overwhelming initial complexity

---

## Implementation Consequences

This design philosophy has structural implications:

1. **No router needed.** State drives navigation, not URLs.
2. **No state library needed.** Plain JavaScript state suffices.
3. **No database needed.** Markdown files are the database.
4. **No API needed.** Content is fetched as static files.
5. **No authentication needed.** All knowledge is public.
6. **No build system needed.** Static files served directly.
7. **No server needed.** Deploy to any static host.

This design philosophy is demonstrated by the portfolio itself. The system you are interacting with right now is an example of these principles.
