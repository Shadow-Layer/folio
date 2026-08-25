# Design Philosophy

This section documents the concrete system principles the portfolio implements.

## State-driven execution

Don't continuously compute what you already know. The UI is a projection of application state. When state changes, the system performs only the necessary computation and updates. Idle state should approach computational inactivity.

State → transition → required computation → UI projection

## Progressive disclosure

Reveal complexity only as the visitor's intent becomes more specific. Start with a small surface; allow exploration to unlock deeper layers of context, decisions, and technical detail.

## Knowledge-first content

Durable content (Markdown files) is the primary source of truth. The interface interprets and projects knowledge; it does not own or obscure it.

## Resource-aware interfaces

Minimize unnecessary JS execution, DOM updates, network requests, and background work. Fetch and render content on demand. Respect reduced-motion and accessibility preferences.

## Interaction as navigation

Meaningful state transitions replace excessive link proliferation. Every interaction maps to a clear state change (e.g., open project → selectedProject changes).

## Complexity containment

Complexity belongs in the system; clarity belongs in the interface. Expose only what is relevant to the current state.

## Interface as projection

The visible UI represents the current state, not the entirety of the application or knowledge base.