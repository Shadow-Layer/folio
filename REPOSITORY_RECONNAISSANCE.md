# Portfolio Repository Reconnaissance & Design-System Audit

**Repository:** `donnie-alvin/Portphilosphio`  
**Inspected ref:** `main` (repository default branch at inspection)  
**Report date:** 2026-11-06  
**Scope:** Read-only inspection of repository metadata, source, content, assets, workflow, and existing audit documentation. This report is the only file created for this task; no application code, project content, or dependencies were changed.

## Evidence and confidence conventions

- **Observed** means directly visible in inspected repository files or GitHub repository metadata.
- **Inference** means a likely design purpose derived from implementation, not a proven statement of author intent.
- **Recommendation** means future guidance, not an existing feature.
- Confidence: **High** for directly inspected source and file structure; **Medium** for behavior inferred from source without executing it; **Low / unverified** for behavior requiring a live browser, deployment, external service, or project-owner confirmation.

This is source inspection, not a local build, browser/device test, accessibility evaluation, or live deployment verification. Existing repository audits are useful historical context but are not a substitute for re-running their checks against the inspected ref.

---

## 01 — Executive overview

### What has been inherited

This is a public, static-site portfolio repository whose default branch is `main` and which has GitHub Pages enabled. It is not one application built with a framework: it contains two related browser experiences:

1. **The main portfolio / knowledge archive** at the repository root (`index.html`, `main.js`, `styles.css`, and `content/`). It is a framework-free, state-driven reader over Markdown records, with a manifest, on-demand requests, and in-memory caching.
2. **Alvin / Capital** under `capital/`, a separate investment-learning and opportunity-research experience with its own HTML entry points, CSS, JavaScript, content manifest, and static content. Its routes and much of its interface are separately implemented.

The repository also contains project evidence audits, a changelog, source material, a portrait image, and a CV PDF. The main portfolio's project list is editorial and evidence-oriented rather than a conventional image-card grid. It currently has two top-level project records (Town Ruins and this portfolio); Town Ruins has a tree of supporting records.

### Maturity

**Assessment (medium confidence):** The core portfolio is a purposeful, working static-site design with documented architecture and established content patterns. It has no package manifest or build system in the inspected root structure, and a Pages workflow uploads the repository contents directly. It is therefore simple to extend for text-first project records. It is not a fully validated production-quality component platform: automated tests are not evident in the inspected structure, the Markdown renderers are intentionally limited, the `capital/` subsite adds independent behavior and external form submission, and live behavior has not been tested for this report.

### Implemented vs. incomplete / unverified

| Classification | Findings |
| --- | --- |
| Implemented in source | Main archive states (initial, topics, projects, content); project hierarchy via manifest `parent`; on-demand Markdown loading and caching; root-page responsive styling; static Pages deployment workflow; separate Capital content/routes and an interest form submission path. |
| Partially implemented / constrained | Markdown parsing is a small custom subset; main archive state is not URL-addressable; Capital routing is hard-coded; form confirmation is optimistic with `no-cors`; accessible modal behavior is incomplete based on inspected code. |
| Planned | No clearly marked project feature plan was verified in the inspected implementation. Capital manifest descriptions include conditional/pending case-study material, which signals content availability constraints rather than a general project roadmap. |
| Unused / legacy | The role of the multiple nested `capital/**/index.html` shells relative to the JavaScript-managed Capital views is not conclusively established. Treat them as potential compatibility/legacy entry points until direct-path behavior is tested; do not delete them based only on naming. `source material/` is reference/source material, not runtime content. |

---

## 02 — Repository map

The following map covers the inspected repository structure and important responsibilities. Nested listings are summarized where the API returned directories; this is not a claim that every file in every source-material directory was individually read.

```text
.
├── .gitattributes                         Git attributes
├── .github/workflows/static.yml           GitHub Pages deployment workflow
├── CHANGELOG.md                            Historical change/audit log
├── POST_IMPLEMENTATION_AUDIT.md            Existing implementation audit
├── TOWN_RUINS_CV_EVIDENCE_AUDIT.md          Existing evidence/claim audit
├── index.html                              Main archive document shell
├── main.js                                 Main archive state/render/content logic
├── styles.css                              Main archive visual system
├── assets/
│   ├── cv/Alvin-Phiri-CV.pdf               Downloadable CV asset
│   └── images/alvin-head.png               Portrait image (not observed in root shell rendering)
├── content/
│   ├── manifest.json                       Main archive index and project hierarchy
│   ├── about.md, contact.md, cv.md          Profile and contact records
│   ├── design-philosophy.md, research.md   Philosophy and research records
│   └── projects/
│       ├── portfolio.md                     Portfolio case study
│       ├── town-ruins.md                    Top-level Town Ruins record
│       └── town-ruins-{system,backend,authentication,infrastructure,evidence}.md
├── capital/
│   ├── index.html, main.js, styles.css      Separate Capital application
│   ├── learn/, opportunities/, register/    Nested static entry-point directories
│   └── content/
│       ├── manifest.json                    Separate Capital content index
│       ├── learn/, opportunities/, research/
│       ├── questions/, register/, case-studies/
│       └── opportunity record(s), including azizi-venice.md
└── source material/
    ├── Alvin Phiri CV.txt                    Source CV text
    ├── ChatGPT-Implement Portfolio Architecture-20260825-1511.txt
    └── merged_file (1).txt                  Large source/reference corpus
```

### Key entry points and hosting

- `index.html` links `./styles.css` and loads `./main.js` as an ES module. Its `#stage` is the dynamically rendered main archive surface, marked `tabindex="-1"`, `aria-live="polite"`, and `aria-atomic="true"`.
- `capital/index.html` loads its own stylesheet and module, and has `#capital-app`. Nested Capital `index.html` files exist for `learn/`, `opportunities/`, `register/`, and `opportunities/azizi-venice/`; their compatibility with the current client-side route model needs browser verification.
- `.github/workflows/static.yml` deploys the entire repository (`path: '.'`) to Pages on pushes to `main`, or manual dispatch. The workflow configures Pages and deploys an artifact. This proves deployment automation is configured, not that a current deployment succeeded or that every nested path works.
- No conventional `docs/` directory was present in the inspected root listing. Root-level Markdown is already used for substantial audit documentation (`POST_IMPLEMENTATION_AUDIT.md`, `TOWN_RUINS_CV_EVIDENCE_AUDIT.md`, and `CHANGELOG.md`). **Documentation location decision:** place this report at the repository root, following that existing convention, rather than introduce a new documentation tree.

### Config, dependencies, tests

- The existing implementation audit reports no root `package.json`, third-party runtime dependency, or build step; the inspected root listing likewise showed no package manifest. The source imports no framework in the inspected root entry-point design.
- No environment file, backend service, CMS, or server-side content API was identified in the inspected structure. Avoid inferring secret-free status or full external-service configuration from that absence.
- No test directory or test workflow was visible in the inspected root structure. The Pages workflow is deployment-only; no automated test/lint/build gate is defined there.
- No production host status or successful Pages run was verified as part of this source-only audit.

---

## 03 — Operating philosophy

### Portfolio Operating Philosophy

> **Keep the first encounter calm, make deeper knowledge optional, and let durable evidence—not promotional claims—carry the story.** The interface is a lightweight index into readable records. It should do work in response to user intent, reveal complexity through clear steps, and keep substantive claims proportionate to verifiable artifacts.

### Observed principles (high confidence from `content/design-philosophy.md`, `content/projects/portfolio.md`, `main.js`, and `styles.css`)

1. **Knowledge-first:** Markdown records under `content/` are the durable content source; the interface reads and presents them.
2. **Progressive disclosure:** the root experience starts with identity and one Explore action, then reveals topic navigation, projects, and detail records.
3. **Evidence-first:** project narratives distinguish implementation evidence from unverified deployment, ownership, outcomes, and metrics. The Town Ruins record explicitly cautions against claims unsupported by available artifacts.
4. **Resource-aware:** the main reader has no framework; it loads its manifest on first exploration, requests content when selected, caches fetched records, and has no recurring polling in the inspected root logic.
5. **Explicit interaction:** visible native buttons provide navigation and return actions; Escape resets the root archive to its initial view. A traditional always-visible root nav is deliberately absent in the documented model.
6. **Contain complexity:** the page begins editorial and quiet, while deeper technical material remains available by choice.

### Inferences (medium confidence; not authorial fact)

- The restrained paper-like surface, serif headings, numbered archive rows, and explanatory record summaries appear intended to make technical material feel like an editorial reading archive rather than a promotional gallery.
- The relationship between projects and supporting media/details is primarily **narrative and hierarchical**: a project record is the entry point; manifest `parent` links disclose subsystem/evidence records. Text and source references carry more weight than screenshots. Only one portrait asset was identified, and the renderer supports local images, but the inspected Town Ruins lead record contains no embedded visual gallery.
- The portfolio owner should be understood as a Software Engineer with implemented full-stack/infrastructure work and clearly labeled areas of active development—not as a specialist beyond the evidence stated in content.

### Preserve these decisions

- Keep authored content independently readable in Markdown.
- Preserve the on-demand, explicit state-driven root navigation and avoid adding background work without a concrete user need.
- Keep initial-page density low and allow technical depth to be optional.
- Retain the evidence boundary: never invent authorship, production status, usage, outcomes, dates, or business metrics.
- Prefer extensions that fit the manifest and existing document view before adding a new framework, CMS, API, or project-card abstraction.

---

## 04 — Design system

### Visual identity: main archive

Source of truth is `styles.css`.

| Token / property | Observed value | Semantic use |
| --- | --- | --- |
| `--paper` | `#f4f1e9` | Warm page background |
| `--ink` | `#24211c` | Primary text |
| `--ink-soft` | `#676158` | Supporting text |
| `--rule` | `#cfc8bb` | Dividers and borders |
| `--accent` | `#8a4831` | Kicker, emphasis, links, focus, active details |
| `--accent-wash` | `rgba(138, 72, 49, 0.09)` | Archive-row hover surface |
| `--serif` | Iowan Old Style → Palatino/Book Antiqua/Georgia fallback stack | Editorial display and long-form reading |
| `--sans` | Inter followed by system UI fallbacks | Interface labels and general UI |
| `--mono` | Platform monospace stack | Numbering and code |

There is no observed remote font import; `Inter` may fall back to a system font if unavailable. The body uses a subtle CSS radial-dot paper texture, not a background image. Surfaces use low-opacity warm white, fine borders, a restrained shadow, and modest corner rounding. No icon library is used; arrows and separators are text characters.

### Layout and responsive behavior

- Header, app, and footer share a centered `min(100% - 3rem, 75rem)` width on wider screens.
- `.stage` is capped at `68rem`, with clamp-based padding, a light border, rounded corners, and translucent background.
- Opening text and detail/list views use narrower/asymmetric reading columns; project/topic entries are a numbered three-column grid (index, text, arrow), not cards.
- Main CSS has breakpoints at `720px` and `420px`; it reduces horizontal margins, removes some left offsets, tightens list columns, and adjusts body reading size. Fluid `clamp()` sizing is used for headings and whitespace.
- No explicit tablet breakpoint is separately named; responsive behavior is fluid plus those two mobile cutoffs.

### Components, interactions, and states

- **Header/footer:** restrained text labels and hairline rules. No conventional root nav. Footer message: “Content-first. Read at your own pace.”
- **Opening view:** large serif name, uppercase role, serif summary, underlined text-like Explore button. It also exposes a separate Capital section link.
- **Archive rows:** full-width semantic buttons, number/title/summary/arrow, subtle accent background and horizontal shift on hover; active color wash and visible focus outline.
- **Documents:** metadata label, large serif title, generous section spacing, readable serif body, accent links, inline image treatment, and thin-rule code blocks.
- **Loading/error/empty states:** a loading message appears while content fetches; failed content displays an unavailable message and return control; an empty project set has a message and return button. These are implemented in `main.js`; not tested under network failure in a browser for this report.
- **Motion:** main archive uses short 160ms transitions for hover affordances, no observed entrance choreography, and disables transitions under `prefers-reduced-motion`.
- **Keyboard:** native buttons allow keyboard activation; `:focus-visible` is styled; focus moves to the stage after views change; Escape resets to initial. Back actions are explicit. Source inspection does not establish a comprehensive WCAG conformance result.

### Capital design system is separate

`capital/styles.css` defines a distinct dark palette (`--night: #101316`, `--night-soft: #171b1e`, `--paper: #e8e4da`, `--paper-soft: #b7b7ad`, `--accent: #d39a63`) and a wider 86rem layout. It uses larger cinematic typography, dark panels/grids, longer reveal transitions, and CSS modal/dock treatments. Its breakpoints are 760px and 480px. This is not a token variation currently shared with the main archive: do not apply Capital colors/components to the root portfolio by assumption.

Capital has a reduced-motion media query, visible focus styles, and responsive grids. `capital/styles.css` also contains a clearly labeled “Temporary debug override” forcing `.capital-view` descendants visible and removing transforms; it can override reveal animation behavior. Treat this as a confirmed maintenance concern, but do not remove without testing intended motion and visibility behavior.

### Enforceable design rules

| Rule | Evidence / scope | Status |
| --- | --- | --- |
| Use the main archive palette and existing typography tokens for root portfolio additions; do not invent a parallel palette. | `styles.css :root`; root shell and archive components. | **Mandatory** |
| Keep durable project copy in Markdown and list it in `content/manifest.json`; do not hard-code project prose in `main.js`. | Main content model and philosophy. | **Mandatory** for a project record |
| Keep the first view uncluttered; expose detailed evidence by intentional navigation. | Opening view and archive sequence. | **Mandatory** for root experience |
| Use native links for navigation to destinations and native buttons for in-place state changes. | Existing HTML, generated archive rows, and actions. | **Mandatory** |
| Provide visible keyboard focus and preserve the stage focus transition. | `:focus-visible`, `focusStage()`. | **Mandatory** |
| Keep text contrast, legibility, and responsive reading columns consistent with existing tokens and sizing. | `styles.css` and responsive breakpoints. | **Mandatory**; verify new combinations |
| Honor `prefers-reduced-motion`; keep root transitions short and purposeful. | Root media query. | **Mandatory** |
| Use images as supporting evidence, with meaningful alt text and lazy loading, rather than decorative filler. | `formatImages()` creates alt text and `loading="lazy"`. | **Mandatory when adding images** |
| Use Capital’s dark identity only inside `capital/`, unless an explicitly approved redesign coordinates both systems. | Independent Capital CSS and app. | **Mandatory boundary** |
| New animation or bespoke visual effects. | Existing main archive is restrained; Capital has its own motion conventions. | **Optional, justify and test** |

---

## 05 — Technical architecture

### Main archive

- **Rendering:** browser-native HTML/CSS/ES modules; no framework or server-side rendering. Static files are expected to be served by GitHub Pages or another static host.
- **State:** `main.js` holds `{ view, selected }`; `setState()` merges updates and calls `render()`. Root views are `initial`, `topics`, `projects`, and `content`.
- **Routing:** state-driven in-page navigation; no root URL router and no root history updates observed. Direct links to a particular root project record are not provided by the current state model.
- **Data flow:** user action → state transition → specific view function → manifest lookup or Markdown request → DOM output. The root manifest is loaded on first Explore and cached. Markdown text is cached by path. A current-selection guard prevents stale asynchronous results from replacing a newer selection.
- **Content paths:** `contentBase` is module-relative via `new URL('./content/', import.meta.url)`, and resource paths use that base. Preserve this pattern for static hosting under a subpath.
- **Markdown:** custom renderer handles headings, paragraphs, unordered lists, fenced code blocks, basic `**bold**`, Markdown links, and local images with a restrictive extension check. It is not a complete CommonMark implementation: do not assume nested lists, tables, blockquotes, inline code, italics, ordered lists, or arbitrary Markdown syntax works correctly. Test any syntax before using it.
- **Security:** HTML text is escaped in the custom formatting path; links are parsed and protocols restricted to HTTP(S) in the root implementation; external links use `noopener noreferrer`; local images are constrained to same-origin URLs and image extensions. Preserve escaping and URL validation. Do not concatenate untrusted HTML into dynamic markup.
- **Error handling:** manifest fetch failure yields an empty manifest; content fetch failure yields a user-facing error and return button. This is graceful but manifest failure is not differentiated from a valid empty index.

### Capital subsite

- Separate `capital/main.js`, `capital/styles.css`, and content manifest; still static browser code, not a backend service.
- JavaScript defines a fixed `routes` mapping and `viewFromLocation()`, writes browser history on route navigation, and re-renders on `popstate`. Capital Markdown reads are cached in a `Map`.
- A small separate parser supports headings (`#`–`###`), unordered lists, paragraphs, and links, but not the main reader's exact formatting feature set. Keep content within its supported subset unless implementation and tests are intentionally changed.
- The registration form maps fields to fixed Google Forms entry IDs and posts to Google Forms using `mode: 'no-cors'`. The browser cannot inspect the cross-origin response in this mode; the code displays a success state after the fetch promise resolves, not after confirmed server acceptance. This is an observed reliability/UX limitation, not evidence that the remote form is currently operational.
- Capital modal code sets dialog roles and restores focus, but source inspection shows no focus trap, and each `create()` adds a document-level Escape listener without removing it. These are accessibility/maintenance risks if the modal is used.

### Naming and extension conventions

- Lowercase kebab-case Markdown filenames, with paths relative to `content/` in the root manifest.
- Manifest item fields currently observed: `path` (required for lookup), `title`, `summary`, optional `parent`. The file ordering is the display ordering for top-level projects. No schema validator is present.
- Reuse the current `projects/` path convention and parent hierarchy. Avoid a new client-side data model for ordinary additions.
- Use semantic Markdown headings (`#` one document title, `##` primary sections, `###` subsections), concise opening copy, evidence-based language, and only supported Markdown constructs.
- Root uses direct DOM construction for generated rows and `innerHTML` for fixed templates/renderer output. Maintain text escaping for all data-originated values; use DOM `textContent` for titles and summaries where practical.

### SEO, performance, security, compatibility

- Root `index.html` has language, viewport, and title, but no description, social metadata, canonical URL, or structured data was observed. Capital has a description meta and title.
- Main archive defers content fetching until interaction and caches it; image markup is lazy-loaded. Static assets are small in count, though image compression and actual transfer measurements were not tested.
- The no-build static approach reduces build/dependency failure surface but means there is no compile-time Markdown/manifest validation evidenced by the workflow.
- ES modules and `fetch()` require a web server; opening files directly with `file://` is not a valid test of production behavior.
- No CSP/security headers or browser-compatibility matrix was inspected. Keep output escaped and links constrained; do not assume hosting security headers are configured.

---

## 06 — Content architecture

### Main portfolio content

`content/manifest.json` is the navigation index. `main.js` constructs a fixed topics list for about, projects, philosophy, research, CV, and contact. For non-project topics it finds title/summary metadata in the manifest; the project list is generated by filtering manifest entries whose paths start with `projects/` and that have no `parent`.

Projects are therefore **static Markdown records indexed at build/repository time**, not dynamically generated from a CMS, API, or database. The current top-level project order follows the array order in `manifest.json`. Supporting records are connected by exact path values in the optional `parent` field and displayed under the parent document. There are no explicit category, technology tag, start/end date, development status, role, image-gallery, or result fields in the current manifest schema; those details, when present, belong in prose.

Images are Markdown inline references. Root rendering resolves local images from the content directory, requires same-origin image URLs with PNG/JPEG/WebP/GIF extension, adds alt text and `loading="lazy"`, and displays them within the reading column. The repository has `assets/images/alvin-head.png`; because content image URLs resolve relative to the content root, a Markdown link to that asset must use a correct relative path such as `../assets/images/alvin-head.png` (verify at served path).

### Capital content

Capital has a separate `capital/content/manifest.json` with IDs, titles, paths, summaries and hard-coded route/render logic in `capital/main.js`. Its content is also static Markdown, but it does not share the main archive manifest, renderer, or project model. Do not assume a new root project belongs in the Capital content tree.

### Validation gaps

No manifest schema, automated link checker, or content test is configured in the inspected Pages workflow. A typo, duplicate path, broken parent reference, unsupported markup, or missing file could therefore surface only in browser behavior unless manually checked.

---

## 07 — Project contribution standard

### Recommended required fields (content standard, not current machine-enforced schema)

1. **Title** (`#` heading) and a concise, factual opening summary.
2. **Context / problem:** what the project addresses, stated within evidence.
3. **Contribution:** the author's specific role and work, with uncertainty made explicit.
4. **Implementation evidence:** concrete components, decisions, or technical artifacts that can be inspected.
5. **Evidence boundary/status:** what is implemented versus what cannot be verified (especially live production, users, results, ownership, or dates).
6. **Manifest entry:** unique existing file path, visible title, and one-line summary.

### Optional fields

Detailed overview, objectives, proposed solution, features, architecture, technologies, implementation decisions, challenges, screenshots/diagrams, live demo URL, source repository URL, status, timeline, outcomes, and future improvements. Include each only where the owner can verify it. Use links only after checking their target and relevance.

### Conditional fields

- **Collaborative work:** describe personal contribution and collaborators/attribution boundaries when known; do not imply sole authorship without evidence.
- **Live product:** include public demo/runtime and operational claims only when verified and safe to share.
- **Measured outcomes:** provide metric definition, source, time period, and ownership context; omit if unavailable.
- **Visual-heavy project:** include optimized local screenshots/diagrams with descriptive alt text, image rights confirmed, and Markdown paths tested.
- **Research/learning project:** clearly label hypotheses, learning status, and unvalidated assumptions.

### Recommended detailed narrative

1. **What it is** — one paragraph, audience and purpose.
2. **Problem and constraints** — the need, users, context, and known constraints.
3. **My role** — specific individual contributions and collaboration boundary.
4. **System design** — architecture and important boundaries, with diagram only if it adds clarity.
5. **Implementation** — selected technical choices and evidence-backed details.
6. **Challenges and decisions** — a real trade-off, failure mode, or lesson; do not invent a rationale.
7. **Evidence and outcomes** — links, artifacts, tests, and measured outcomes if verified.
8. **Limitations and next steps** — unfinished, uncertain, or future work.

The existing Town Ruins record is the strongest example of cautious evidence language; its supporting records show the parent-child hierarchy. Do not copy all of its depth for a small project.

### Current record model

```json
{
  "path": "projects/example-project.md",
  "title": "Example Project",
  "summary": "One short factual sentence describing the record.",
  "parent": "projects/parent-record.md"
}
```

`parent` is omitted for a top-level project. This is a documentation example of observed fields, not a validator-enforced schema. Keep paths unique and ensure every parent points to a real manifest item.

---

## 08 — Extension guide: add a root portfolio project

For a normal text-first project, the minimum correct change is **one new Markdown document plus one manifest item**; no JavaScript or CSS change is ordinarily needed.

1. **Collect verified source material** from the owner: project name and one-line summary; project purpose/problem; exact personal contribution and collaboration context; implemented stack/architecture confirmed from source; development status and dates if supported; repository/demo/docs links; actual outcomes with source; and any limitations or claims that must not be made.
2. **Choose a stable lowercase kebab-case path** under `content/projects/`, e.g. `content/projects/example-project.md`. Avoid ambiguous names and collisions.
3. **Write a standalone Markdown case study** using the narrative order in §07. Begin with one `#` title. Keep to the root renderer's known subset: headings, paragraphs, unordered lists, fenced code blocks, `**bold**`, Markdown links, and supported local images. Do not rely on tables, blockquotes, italics, inline code formatting, or ordered lists without checking actual output.
4. **Add the manifest entry** in `content/manifest.json` under `items`. For a top-level project add `path`, `title`, and `summary`; omit `parent`. Place it in the desired position—the array order controls list ordering. For a supporting record, include `parent` equal to the exact parent document path; it will be disclosed inside that parent record and will not show in the top-level list.
5. **Add supporting records only when useful.** Each new Markdown file needs its own manifest item. Build a deliberate parent tree and make the user-facing titles/summaries understandable without opening the record.
6. **Add media only if it strengthens evidence.** Put optimized assets in the appropriate existing asset location; use a relative path resolved from `content/`, factual alt text, and confirm same-origin/extension restrictions. Do not add a gallery component for a single image.
7. **Validate manually before handoff:** parse `content/manifest.json`; verify every manifest path resolves to a file; ensure paths are unique and every parent exists; inspect ordering; check links and image paths; render the Markdown in the actual served application; check narrow/mobile layout and keyboard focus; inspect browser console/network errors.
8. **Do not edit `main.js` or `styles.css`** for a content-only project. If the desired content feature (gallery, metadata badges, categories, new Markdown syntax, deep links) needs code, first explain the gap and scope a separate implementation task. Update this report only if architecture, content schema, renderer, routing, or design standards change.

### Files normally changed

- **Required:** `content/projects/<slug>.md`, `content/manifest.json`.
- **As needed:** additional supporting Markdown and manifest entries; image/diagram assets.
- **Not normally needed:** `main.js`, `styles.css`, `index.html`, GitHub Actions workflow, Capital files.

---

## 09 — Quality baseline and confirmed risks

This is a source-based review, not a formal WCAG conformance audit or runtime benchmark.

| Area | Observed baseline | Finding / confidence |
| --- | --- | --- |
| Responsive | Fluid type/padding and root breakpoints at 720px/420px; Capital at 760px/480px. | Responsive intent is implemented; actual device/browser behavior not tested. **Medium** |
| Semantic HTML | Main shell uses header, main, footer, section; generated content uses article/section and native button controls. | Positive baseline; heading structure and all Capital generated views still need runtime review. **Medium** |
| Keyboard | Native buttons, focus-visible rules, stage focus management, explicit return buttons, Escape behavior in root. | Keyboard path appears considered; no full keyboard-only test conducted. **Medium** |
| Screen reader | Root stage has polite live-region attributes and busy state. | Helpful implementation; dynamic announcement quality not verified. **Medium** |
| Modal accessibility | Capital dialog role/aria-modal, close label, initial focus, focus restoration. | **Potential risk:** no focus trap/inert background observed; document Escape handler accumulates. **High source confidence** |
| Reduced motion | Root disables transitions; Capital disables animations/transitions and resets hidden reveal elements. | Positive accommodation in CSS. Verify new motion follows it. **High** |
| Markdown safety | Root escapes text, validates link schemes, limits local image origins/extensions. | Preserve sanitization. Custom parser security and edge cases are not penetration-tested. **Medium** |
| Capital form | Google Forms endpoint, `no-cors`, optimistic success display. | **Confirmed source behavior / potential user-facing defect:** response acceptance cannot be confirmed but success is displayed after fetch resolves. **High** |
| SEO | Root title, language and viewport; Capital also description. | Root description/social/canonical metadata not observed; page content is client-rendered. Search indexing behavior unverified. **High source confidence** |
| Performance | Static delivery, small custom JS/CSS, on-demand Markdown and lazy images. | Good structural baseline; no Lighthouse/Core Web Vitals measurements or image audit run. **Medium** |
| Browser support | Standard browser APIs including ES modules, `fetch`, `URL`, `history`, `matchMedia`. | No compatibility matrix; use a modern browser baseline and test deployed URLs. **Medium** |
| Build reliability | Pages workflow uploads repository directly. | No build/test/lint validation step in inspected workflow; broken references may deploy. **High** |
| External dependency | No npm/framework dependency observed in main app; Capital submits to Google Forms. | Root is self-contained for core browsing; Capital relies on third-party form handling. **High** |
| Existing audit discrepancies | `POST_IMPLEMENTATION_AUDIT.md` records earlier renderer/documentation defects and repair recommendations; `CHANGELOG.md` records later renderer repair claims. | These are historical claims; source currently includes fenced-code collection and basic bold/link/image handling. Revalidate audits before treating PASS entries as current test results. **High** |
| Temporary CSS override | Capital stylesheet explicitly labels a debug override forcing visible/transform-free content. | **Confirmed maintainability concern**, with visual effects likely neutralized; intended persistence unknown. **High** |
| Project detail links | Main manifest links records by path, not browser URL. | Direct shareable project routes are not implemented in the root state model. **High** |

### Confirmed defects vs potential risks

- **Confirmed source-level behavior:** Capital registration UI treats a resolved `no-cors` fetch as successful submission without being able to inspect server acceptance.
- **Confirmed source-level maintainability issue:** the Capital stylesheet contains a debug override that globally forces visibility and removes transforms under `.capital-view`.
- **Potential accessibility defects requiring testing:** Capital modal lacks a visible focus-trap implementation in inspected code; root live-region and focus behavior have not been tested with assistive technology.
- **Potential content/render defect:** root Markdown parsing is deliberately partial and may mishandle unsupported Markdown or malformed input; validate each syntax used.
- **Potential deployment issue:** Pages publishes the complete repository including source material; inspect whether all repository artifacts are intended to be public. The repository is public, so treat every tracked file as public.
- **Not established:** broken current production URL, image performance, deployed form function, or current Pages deployment failure.

---

## 10 — Development guardrails (AI and human contributors)

1. Inspect the relevant HTML, JavaScript, CSS, manifest, and content before making changes.
2. For an ordinary root portfolio project, prefer adding Markdown plus a manifest entry; do not duplicate project text in JavaScript.
3. Preserve the root archive's paper/ink/rust palette, serif-led editorial hierarchy, numbered list treatment, narrow reading measure, subtle texture, and low-motion interaction language.
4. Keep Capital as a distinct application and visual identity. Do not reuse its routes, dark tokens, form behavior, or CSS in the main archive without an explicit requirement.
5. Preserve module-relative asset/content URL resolution so deployment works under repository subpaths.
6. Preserve explicit state transitions, fetch-on-demand, cache behavior, stale-request guards, and the idle-without-polling principle in root code.
7. Use native HTML controls, visible keyboard focus, clear return paths, semantic headings, descriptive link text, and reduced-motion behavior.
8. Keep Markdown within the renderer's actual supported syntax; render-test new syntax rather than assuming full Markdown.
9. Preserve escaping, URL protocol checks, same-origin image restrictions, and external-link protections. Never insert project-owner or manifest text as raw HTML.
10. Do not introduce frameworks, npm dependencies, build infrastructure, CMS, API, or abstractions without a concrete need and explicit justification.
11. Do not invent project achievements, authorship, metrics, deployment, users, dates, ownership, or technical claims. Ask the owner for evidence or label uncertainty.
12. Avoid unrelated refactors and do not remove nested Capital entry pages or assets as “dead” without verifying direct-path use.
13. For code changes, verify JSON and JS syntax, all manifest paths/parents, links and assets, static subpath resolution, root and Capital navigation as applicable, mobile width, keyboard/focus, reduced motion, console/network behavior, and Pages workflow implications.
14. Do not claim tests passed unless run during the task and record exactly what was run. Existing changelog/audit statements are not fresh validation.
15. Update this report and relevant content/audit notes when changing renderer capabilities, routes, manifest schema, design tokens, deployment, or accessibility behavior.

---

## 11 — Technical debt and recommendations

Prioritized to improve reliability without requiring a framework migration.

### P1 — Add repeatable content checks (recommendation)

A small dependency-free validation script or CI check could confirm JSON validity, unique manifest paths, file existence, valid parent references, and local Markdown asset references before Pages deployment. Keep it proportional; this does not require a build system or runtime package.

### P1 — Clarify Capital form success semantics (recommendation)

The current `no-cors` request cannot confirm Google Forms acceptance. Align the user-facing confirmation with what can actually be verified, or use an integration mechanism that returns an observable response, after owner approval. Do not silently change the form endpoint or data collection.

### P2 — Resolve Capital modal and debug override (recommendation)

Test modal keyboard/screen-reader behavior, implement proper focus containment and listener cleanup if retained, and decide whether the temporary CSS override is still needed. This is a separate Capital-specific change, not required for adding a root project.

### P2 — Specify root content/Markdown contract (recommendation)

The custom parser is now more capable than the oldest implementation audit describes, but still not full Markdown. Document a supported syntax sample, add fixture coverage for actual authored patterns, and prevent unsupported tables/lists from being mistaken for supported features.

### P2 — Improve root metadata selectively (recommendation)

Consider a factual meta description and social metadata for the root shell if discoverability/sharing is a goal. This should not introduce tracking or dynamic infrastructure by default.

### P3 — Clarify nested Capital entry points and source-material publication

Browser-test each nested path on Pages. Decide whether the large `source material/` directory is required in the public repository/Pages artifact; preserve it unless the owner authorizes a change. Avoid assuming it is unused merely because runtime code does not import it.

### Explicitly not recommended now

A framework migration, CMS, database, general-purpose project schema engine, or shared component system is not justified for the current text-first static site. Extend current patterns first.

---

## 12 — Open questions

1. Are all files in `source material/` intentionally public and appropriate to publish via the Pages workflow, which uploads the repository root?
2. Are nested `capital/**/index.html` documents required aliases, direct-entry routes, or leftovers? What exact Pages URLs are expected to work?
3. Is the Google Forms endpoint and its field mapping current and approved? What confirmation can truthfully be shown to visitors?
4. Should the root page gain a description/social metadata, or is minimal metadata intentional?
5. Are project images/screenshots expected going forward, and who can provide them with usage rights and accurate alt descriptions?
6. What project status and date vocabulary should be used, if any? The current manifest has no such fields.
7. Is the temporary Capital visibility override intentionally retained for a production reason?
8. Which browsers and accessibility assistive technologies are part of the supported test baseline?
9. Which existing audit claims have been re-run on the current `main` tip, as opposed to recorded historically?
10. What evidence may be shared publicly for future projects, particularly confidential source links, ownership, deployments, and measurable outcomes?

---

## Final handoff briefing

1. **What is inherited?** A static repository with two distinct experiences: root engineering knowledge archive and separate Alvin / Capital site, plus Markdown evidence records, supporting assets, audits, source material, and a GitHub Pages deployment workflow.
2. **How does it operate?** The root archive uses explicit JavaScript state, fetches its manifest/content on demand, caches results, and renders Markdown. Capital is a separate hard-coded route/history application with its own Markdown reader and form integration.
3. **Core design philosophy?** Calm first impression; optional depth; content and evidence over promotion; computation and dependencies kept small; complexity disclosed intentionally.
4. **Visual standards?** Root warm paper, dark ink, muted rust accent; serif editorial titles, sans UI, monospace metadata; restrained separators and numbered rows; short interactions, visible focus, responsive reading layouts, and reduced motion. Capital is separately dark/gold.
5. **How are projects represented?** Static Markdown files indexed by `content/manifest.json`; array order determines top-level order; optional `parent` creates nested supporting records. No CMS/database or enforced schema.
6. **Correct addition procedure?** Add `content/projects/<slug>.md` and a `{path,title,summary}` manifest item; optionally add child records and parent references. Test file paths, hierarchy, supported Markdown, links, images, mobile, and keyboard behavior. No app-code edit normally needed.
7. **What the owner must provide?** Accurate project summary/problem, individual role and collaboration boundary, verified stack and implementation evidence, status/dates only if supportable, actual repository/demo/docs links, validated outcomes/metrics if any, limitations, and properly licensed optimized visuals with alt text.
8. **Constraints?** Static hosting and module-relative URLs; no router for root; custom limited Markdown; no schema or CI content checks; separate Capital route/content model; keep dependency-free and do not make unsupported claims.
9. **Issues that could complicate work?** Lack of automated content validation; unverified nested Capital deep paths; Capital’s optimistic `no-cors` form success and modal concerns; debug override; incomplete root SEO metadata; historical audits are not current test runs; public source-material exposure needs owner confirmation.
10. **Ready to extend?** **Yes, for content-only project additions** once the owner supplies evidence-backed copy and assets. **Not yet fully ready for new runtime features** without first scoping/testing the relevant renderer, routing, accessibility, or Capital integration behavior.

### Confidence summary

- **High:** repository layout at inspected paths; root entry points; root manifest fields/order semantics; palette tokens; Pages workflow configuration; source-level behavior of main and Capital code.
- **Medium:** intended operating philosophy and visual purpose (supported by explicit philosophy documents and implementation); current readiness assessment.
- **Unverified:** actual deployed runtime, nested Capital URL behavior, end-to-end Google Forms acceptance, WCAG conformance, browser compatibility, Core Web Vitals, and whether every tracked source-material artifact is intentionally public.

**Inspection status:** Complete for source-level reconnaissance. No application changes, dependency installations, local execution, or live deployment tests were performed.
