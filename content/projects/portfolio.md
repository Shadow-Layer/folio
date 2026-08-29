# Portfolio (this project)

This is a personal portfolio that is itself an implementation of its stated philosophy.

## What It Is

A minimal, knowledge-first professional system that exposes engineering capability through evidence and progressive disclosure.

The portfolio is not a conventional marketing website. It is a small, purposeful tool designed to communicate systems engineering thinking through its own structure and behavior.

## Why It Exists

Most developer portfolios make the same mistake: they treat the portfolio as content to be designed and styled, rather than as a system to be architected.

This portfolio treats itself as what it describes: a system whose complexity emerges through interaction rather than visual bombardment; whose knowledge is durable rather than ephemeral; whose claims are evidence-backed rather than aspirational.

The portfolio itself is evidence. It demonstrates:

- Knowledge-first architecture (Markdown as source of truth)
- State-driven interfaces (no polling, no continuous computation)
- Progressive disclosure (interaction reveals depth)
- Resource-aware design (minimal dependencies, lightweight execution)
- Evidence-first claims (every technical decision is justified)
- Interaction as navigation (interface reveals structure)
- Complexity containment (calm surface, deep system)

## Design Philosophy

See the **Design Philosophy** section for the seven principles that govern this implementation.

The philosophy is demonstrated by the system itself rather than merely documented.

## Architecture

### No Framework

The portfolio uses no frontend framework (React, Vue, Svelte, etc.). It is built with:

- HTML — semantic markup
- CSS — responsive layout and typography
- JavaScript — state-driven interaction

This choice demonstrates resource awareness and complexity containment. The overhead of the system should be substantially less than the overhead of the content.

### Content-First

All durable knowledge lives in Markdown files under `/content/`:

```
about.md                 — Identity
design-philosophy.md     — The principles
projects/town-ruins.md   — Primary project evidence
projects/portfolio.md    — This file
research.md              — Technical thinking
contact.md               — Contact methods
```

A single `manifest.json` indexes available content. The interface reads and renders content on demand.

### State-Driven

The interface maintains explicit state:

```javascript
state = {
  view: 'initial|topics|content|projects|project',
  selected: null
}
```

State changes trigger specific rendering functions. There is no polling, no continuous re-rendering, no observers.

### Progressive Disclosure

Users discover depth through interaction:

1. **Initial:** Identity card + "Explore" button
2. **Topics:** Menu of areas (About, Projects, Philosophy, Research, Contact)
3. **Content:** Individual topic or project detail
4. **Deeper:** Verified project documentation and evidence, where available

Each layer is optional. Casual visitors see identity and projects. Technical visitors access depth.

### Minimal Content Loading

Content fetches only on demand:

- Manifest loads once on first "Explore" click
- Individual content files load when selected
- Loaded content is cached in memory
- No repeated fetches for unchanged content
- No preloading

### Lightweight Rendering

Markdown rendering supports:

- Headings (H1-H6)
- Paragraphs
- Lists (unordered)
- Basic text sanitization

This is intentionally minimal. It avoids:

- Markdown frameworks (which add kilobytes)
- HTML injection vulnerabilities
- Unnecessary feature complexity

### Keyboard Navigation

All interactions are keyboard-accessible:

- Tab to navigate items
- Enter to activate
- Escape to reset to initial state
- Back buttons for explicit navigation

### Responsive Design

CSS media queries support:

- Desktop (full width)
- Tablet (constrained width)
- Mobile (single column)

No separate mobile framework or architecture. Single responsive design.

## Implementation Details

**Files:**

- `index.html` — Semantic HTML structure
- `main.js` — State management, content loading, markdown rendering (343 lines)
- `styles.css` — Layout, typography, responsive design, accessibility (336 lines)
- `content/manifest.json` — Content index

**Total JavaScript:** 343 lines (no dependencies)

**Total CSS:** 336 lines (no framework)

**Build process:** None. Static files served directly.

**Deployment:** Any static host (GitHub Pages, Netlify, Vercel, traditional web server)

## Performance Characteristics

- **Initial load:** Single HTML file + CSS + JavaScript
- **First interaction:** Manifest loads once
- **Content requests:** Individual Markdown files load on demand
- **Memory usage:** Manifest + selected content cached
- **Idle state:** No background work, no polling, no continuous rendering

The system idles when the user stops interacting.

## Evidence Level

**Proven** — Implemented and verified to demonstrate all stated principles.

Every claim about this portfolio's architecture is demonstrable by:
- Reading the HTML, CSS, and JavaScript source
- Interacting with the interface
- Inspecting network requests
- Examining Git history

## What This Portfolio Does NOT Do

To remain true to its philosophy, this portfolio deliberately does NOT include:

- Unnecessary animations or visual effects
- A frontend framework
- A build system
- A database
- An API server
- Authentication/login
- Analytics or tracking
- Ads or promotional content
- Auto-generated content
- CMS or content editor
- Artificial complexity

These omissions are intentional. Each represents a constraint that keeps the system simple, efficient, and focused on knowledge.

## Conclusion

This portfolio is an example, not an exception. Systems can be elegant, efficient, and powerful without unnecessary frameworks, complexity, or overhead.

The philosophy it describes is demonstrated by its implementation.
