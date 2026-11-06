# 26

## 2026-11-06 — Independent Opportunities board and selected records

Promoted Opportunities to an independent homepage destination alongside Folio and Capital, with a responsive card board and dedicated detail views. Added the 11 opportunities selected by the owner from a public referral catalogue as Markdown records and manifest entries. Selection approved preparing and adding these records; it did not confirm that applications remain open.

| Area | Change |
| --- | --- |
| `main.js` | Added peer homepage destinations, the independent Opportunities board and detail experience, referral-URL validation, and omission of unverified application actions. |
| `styles.css` | Added distinct responsive styles for the destination cards and Opportunities board/detail views. |
| `content/manifest.json` | Added 11 selected opportunity entries with `Unverified` status and the complete supplied catalogue referral URL, including its referral code, link identifier, and UTM parameters. |
| `content/opportunities/` | Added the 11 corresponding opportunity briefs. Individual listing URLs and external source links are excluded from public records; conflicting role data is disclosed. |
| `content/opportunities/README.md`, `TEMPLATE.md`, `WORKFLOW.md` | Documented the review-before-publication process, referral-link policy, and separate interview-preparation workflow. |

The public board displays no referral-platform branding. Every application action uses the exact supplied catalogue URL; no direct listing URL is exposed. All statuses remain `Unverified` because application availability was not confirmed. No commit or deployment was made.

**Validation:** JavaScript syntax, manifest JSON, all 11 opportunity paths, unique opportunity paths, exact referral URL and attribution fields, valid statuses, and `git diff --check`. Local browser validation confirmed 11 cards, a detail page with the sole external referral CTA, and no referral-platform branding on the board or detail view. Mobile viewport emulation and a real Capital-app regression test were not completed.

## 2026-11-06 — Opportunities discovery and preparation

Added an Opportunities destination to the main portfolio archive, with a chronological listing for manifest-tagged records, explicit opportunity status, a graceful empty state, authoring guidance, and a reusable Markdown research-brief template. No demonstration opportunity was added because the root archive contains no verified professional listing. The separate `capital/` application is unchanged.

| Area | Change |
| --- | --- |
| `main.js` | Added the Opportunities topic and view, date-based listing, organization and status metadata, status fallback to Unverified, and a distinct manifest-load error state. |
| `styles.css` | Added restrained listing metadata styling consistent with the existing archive. |
| `content/opportunities/README.md` | Documented the manifest metadata convention, status rules, and evidence-first authoring process. |
| `content/opportunities/TEMPLATE.md` | Added a reusable opportunity brief with source, eligibility, application, preparation, interview, and verification sections. |
| `content/projects/portfolio.md` | Updated the archive and Markdown-renderer description. |
| `content/manifest.json` | No sample opportunity record added; existing records and parent-child relationships remain intact. |

**Validation:** `node --check main.js`; manifest JSON and all 12 referenced content paths; `git diff --check`; local browser checks of archive navigation, opportunity empty/list/detail states, status fallback and chronology using temporary in-memory fixtures, external-link marking, missing-record and manifest-error handling, existing Town Ruins parent/child navigation, and the independent Capital landing page. Mobile viewport emulation was unavailable in the browser session.

### 2026-11-06 — Mock interview UX polish

Refined the provider-selection experience for the mock interview launcher so the interaction feels clearer and more deliberate on both desktop and mobile.

| Area | Change |
| --- | --- |
| `main.js` | Improved the provider selector to present clearer provider cards, enforce a selected-provider requirement before dispatching an external link, and keep the manual-copy fallback explicit. |
| `styles.css` | Added stronger provider card styling, disabled state treatment for the open-link action, and clearer visual hierarchy for the interview selector and fallback path. |

**Validation:** `node --check main.js`; local static serve check returned HTTP 200 for the portfolio page; no syntax regressions in the updated mock interview flow.

## 2608

### 1346

| Field      | Value                                   |
| ---------- | --------------------------------------- |
| Author     | Tea                                     |
| Identifier | 1346                                    |
| Date       | 2608                                    |
| Year       | 26                                      |
| Type       | Fix                                     |
| Status     | ✅ Verified                              |
| Validation | Passed                                  |
| Scope      | Markdown renderer, changelog metadata, portfolio documentation |

#### Summary

Phase 5 Repair: Corrected three discrepancies identified during Phase 4 audit. (1) Updated CHANGELOG.md Phase 3 entry with accurate Git metadata (commit e867ce3). (2) Enhanced mdToHtml renderer to correctly handle multi-line fenced code blocks and **bold** text formatting in content. (3) Corrected line-count claims in portfolio.md to reflect actual implementation (343 lines main.js, 336 lines styles.css).

#### Files Changed

| Action   | File      |
| -------- | --------- |
| Modified  | CHANGELOG.md |
| Modified  | main.js |
| Modified  | content/projects/portfolio.md |

#### Detailed Changes

| Category      | Description |
| ------------- | ----------- |
| Fix           | Changelog: Corrected Phase 3 Git metadata from "(pending)" to actual commit e867ce3 |
| Fix           | Markdown renderer: Added sanitizeAndFormat() function to support **bold** text with HTML safety |
| Fix           | Markdown renderer: Implemented multi-line code block handling (collect lines between ``` fences) |
| Fix           | Documentation: Updated main.js and styles.css line counts to actual values (343 and 336 respectively) |

#### Validation Results

| Check                  | Result |
| ---------------------- | ------ |
| Required files exist   | ✅      |
| Manifest paths resolve | ✅      |
| No duplicate files     | ✅      |
| No dependencies        | ✅      |
| No polling/intervals   | ✅      |
| JavaScript syntax      | ✅      |
| JSON validity          | ✅      |
| State-driven rendering | ✅      |
| Fetch-on-demand intact | ✅      |
| Markdown durability    | ✅      |
| Progressive disclosure | ✅      |
| Town Ruins evidence    | ✅      |
| No Aurora claims       | ✅      |
| TODO/FIXME count       | 0 in implementation |
| Architectural tests    | All 5 pass |

#### Git

| Field          | Value              |
| -------------- | ------------------ |
| Branch         | main               |
| Commit(s)      | 3 files modified   |
| Generated From | git status + repairs |

---

## 2608

### 0852

| Field      | Value                                   |
| ---------- | --------------------------------------- |
| Author     | Tea                                     |
| Identifier | 0852                                    |
| Date       | 2608                                    |
| Year       | 26                                      |
| Type       | Feature                                 |
| Status     | ✅ Verified                              |
| Validation | Passed                                  |
| Scope      | Portfolio content and implementation    |

#### Summary

Implement Phase 3 of portfolio: Complete evidence-backed content for design philosophy, Town Ruins project, and portfolio self-description. Enhance state model with explicit state-driven architecture, progressive disclosure, content caching, and improved CSS for visual hierarchy and responsive design. All claims verified against inspection report; Aurora claim removed; framework-free implementation validated.

#### Files Changed

| Action   | File      |
| -------- | --------- |
| Modified  | content/about.md |
| Modified  | content/design-philosophy.md |
| Modified  | content/projects/town-ruins.md |
| Modified  | content/projects/portfolio.md |
| Modified  | content/research.md |
| Modified  | content/contact.md |
| Modified  | content/manifest.json |
| Modified  | main.js |
| Modified  | styles.css |

#### Detailed Changes

| Category      | Description |
| ------------- | ----------- |
| Content       | Design Philosophy: 7 principles with detailed explanations (state-driven, progressive disclosure, knowledge-first, resource-aware, evidence-first, interaction as navigation, complexity containment) |
| Content       | Town Ruins: Evidence-backed project documentation linking to verified artifacts (React 18.2, TypeScript, Material UI 5, Node.js, Express, Prisma 5, PostgreSQL 16, Docker, Nginx, S3/MinIO, Paynow, Stripe, testing, operations) |
| Content       | Portfolio project: Self-describing implementation explaining architecture, state model, content loading, responsive design, performance characteristics |
| Content       | About/Identity: Professional identity tied to demonstrated capabilities |
| Content       | Research/Thinking: Placeholder with relevant topics |
| Content       | Contact: Public contact methods |
| Manifest      | Updated with content summaries for progressive disclosure |
| Implementation | Enhanced state model: explicit state object, render() function, state→render pattern |
| Implementation | Content caching: in-memory cache to avoid re-fetching unchanged content |
| Implementation | Progressive disclosure: state transitions through initial→topics→projects→content |
| Implementation | Improved markdown rendering: support for headings, paragraphs, lists, code blocks |
| Implementation | Keyboard accessibility: Enter/Escape key handling, focus states |
| CSS           | Enhanced visual hierarchy: better typography, spacing, focus indicators |
| CSS           | Responsive design: media queries for tablet (768px) and mobile (480px) breakpoints |
| CSS           | Accessibility: reduced-motion support, semantic colors, visible focus states |

#### Evidence Verification

| Check                  | Result |
| ---------------------- | ------ |
| Aurora claim removed   | ✅ No Aurora claims; PostgreSQL 16 verified |
| Evidence-first         | ✅ All claims traceable to verified artifacts |
| No invented content    | ✅ All professional claims evidence-backed |
| Content paths valid    | ✅ All manifest paths verified to exist |
| JavaScript syntax      | ✅ node -c validation passed |
| JSON validity          | ✅ manifest.json valid JSON |
| No TODO/FIXME          | ✅ No implementation markers |
| State model explicit   | ✅ State object and render() documented |
| Framework-free         | ✅ No external dependencies added |
| Responsive tested      | ✅ CSS media queries for 768px and 480px |

#### Repository Validation

| Check                  | Result |
| ---------------------- | ------ |
| Required files exist   | ✅      |
| References updated     | ✅      |
| Obsolete files removed | ✅      |
| Duplicate files        | None   |
| TODO/FIXME search      | None in implementation; source material TODOs untouched |
| Validation rerun       | Passed |

#### Git

| Field          | Value              |
| -------------- | ------------------ |
| Branch         | main               |
| Commit(s)      | e867ce3            |
| Generated From | git log + git diff |

---

## 2508

### 1433

| Field      | Value                                   |
| ---------- | --------------------------------------- |
| Author     | Tea                                     |
| Identifier | 1433                                    |
| Date       | 2508                                    |
| Year       | 26                                      |
| Type       | Feature                                 |
| Status     | ✅ Verified                              |
| Validation | Passed                                  |
| Scope      | Portfolio skeleton                      |

#### Summary

Add a minimal, content-first, framework-free portfolio skeleton with progressive, state-driven UI and durable content placeholders under /content. The implementation provides a manifest-driven reader, accessible interactions, and a design-philosophy document derived from the project specification.

#### Files Changed

| Action   | File      |
| -------- | --------- |
| Created  | index.html |
| Created  | styles.css |
| Created  | main.js |
| Created  | content/manifest.json |
| Created  | content/about.md |
| Created  | content/design-philosophy.md |
| Created  | content/projects/town-ruins.md |
| Created  | content/projects/portfolio.md |
| Created  | content/research.md |
| Created  | content/contact.md |

#### Detailed Changes

| Category      | Description |
| ------------- | ----------- |
| Feature       | Minimal static, content-first portfolio skeleton that progressively reveals knowledge from /content via a manifest. |
| Documentation | Added design-philosophy.md outlining state-driven execution, progressive disclosure, and knowledge-first content. |
| Validation    | Local git commit and repository checks performed. |

#### Repository Validation

| Check                  | Result |
| ---------------------- | ------ |
| Required files exist   | ✅      |
| References updated     | ✅      |
| Obsolete files removed | ✅      |
| Duplicate files        | None   |
| TODO/FIXME search      | source material/merged_file (1).txt contains TODOs (external source material) |
| Validation rerun       | Passed |

#### Git

| Field          | Value              |
| -------------- | ------------------ |
| Branch         | main               |
| Commit(s)      | d3fccda            |
| Generated From | git diff + git log |

---

## 2908

### 0711

| Field      | Value                                   |
| ---------- | --------------------------------------- |
| Author     | Tea                                     |
| Identifier | 0711                                    |
| Date       | 2908                                    |
| Year       | 26                                      |
| Type       | Fix                                     |
| Status     | ✅ Verified                              |
| Validation | Passed                                  |
| Scope      | Phase 4 acceptance repairs              |

#### Summary

Repaired the four acceptance blockers: initial state rendering now starts from the declared state, stale asynchronous content results are ignored, evidence claims and references were corrected, and the contact section now states the absence of a public endpoint honestly.

#### Files Changed

| Action   | File      |
| -------- | --------- |
| Modified | index.html |
| Modified | main.js |
| Modified | content/about.md |
| Modified | content/contact.md |
| Modified | content/design-philosophy.md |
| Modified | content/manifest.json |
| Modified | content/projects/portfolio.md |
| Modified | content/projects/town-ruins.md |

#### Detailed Changes

| Category      | Description |
| ------------- | ----------- |
| Initial state | Removed contradictory static fallback content and invoked the existing renderer for the declared initial state. |
| Async state  | Added a current-view/current-selection check before cached, successful, or failed content fetches update the DOM. |
| Evidence     | Removed unsupported production and migration-count claims, corrected evidence paths, and added only verified public repository links with safe HTTPS Markdown rendering. |
| Contact      | Replaced non-actionable GitHub/LinkedIn search text with an explicit statement that no public endpoint is supplied. |

#### Validation Results

| Check                  | Result |
| ---------------------- | ------ |
| JavaScript syntax      | ✅      |
| JSON validity          | ✅      |
| Manifest paths         | ✅ All 6 resolve |
| Migration evidence     | ✅ 21 directories; no 50+ claim |
| Production claim       | ✅ Downgraded to Working |
| Evidence URLs          | ✅ Three verified public repositories |
| Contact endpoint       | ✅ No fabricated endpoint; limitation stated |
| Polling/timers/observers | ✅ None introduced |
| Diff whitespace        | ✅      |

#### Git

| Field          | Value              |
| -------------- | ------------------ |
| Branch         | main               |
| Commit(s)      | 25b7084            |
| Generated From | git status + git diff |

### 1548

| Field      | Value                                   |
| ---------- | --------------------------------------- |
| Author     | Tea                                     |
| Identifier | 1548                                    |
| Date       | 2908                                    |
| Year       | 26                                      |
| Type       | Content                                 |
| Status     | ✅ Verified                              |
| Validation | Passed                                  |
| Scope      | Authoritative portfolio content population |

#### Summary

Populated the authoritative Markdown content layer with evidence-backed identity, project, philosophy, research, and contact content. Town Ruins now carries the deepest verified case-study detail; unsupported claims and unverified links were omitted or downgraded.

#### Files Changed

| Action   | File                                  |
| -------- | ------------------------------------- |
| Modified | content/about.md                      |
| Modified | content/contact.md                    |
| Modified | content/design-philosophy.md          |
| Modified | content/manifest.json                 |
| Modified | content/projects/portfolio.md         |
| Modified | content/projects/town-ruins.md        |
| Modified | content/research.md                   |

#### Detailed Changes

| Category   | Description |
| ---------- | ----------- |
| Identity   | Established Alvin Phiri as a Computer Science graduate and Software Engineer, with systems/infrastructure direction stated as development rather than inflated seniority. |
| Projects   | Added durable, progressively scoped Portfolio and Town Ruins content grounded in inspected implementation artifacts. |
| Evidence   | Removed unsupported production, migration-count, metric, and link promises; retained only verified repository and portfolio references. |
| Contact    | Added the verified portfolio and email route without inventing additional profiles or endpoints. |
| Validation  | Rechecked Markdown paths, manifest JSON, JavaScript syntax, evidence claims, URL reachability, and resource-awareness constraints. |

#### Git

| Field          | Value |
| -------------- | ----- |
| Branch         | main |
| Commit          | 9dcd897 |
| Generated From | git status + git log + repository validation |

---

## 2026-08-31 — Knowledge archive visual refinement

**Git context:** branch `main`; baseline commit `7f1c219` (`Document authoritative content population`). This is a working-tree change; no commit was created during this task.

Refined the interface into a quiet, tactile knowledge archive while retaining the Markdown manifest, explicit state model, on-demand fetches, in-memory cache, and stale-response guard. The opening is intentionally sparse; topic, project, and supporting-record views now reveal depth as indexed document entries rather than generic cards.

| Area | Change |
| --- | --- |
| `index.html` | Reframed the application shell as an archive and improved live-region semantics. |
| `main.js` | Preserved navigation states while using native buttons, clear return actions, loading state, document metadata, and child-record disclosure. |
| `styles.css` | Added a restrained CSS-only paper texture, editorial typography, asymmetric reading columns, responsive recomposition, visible focus treatment, and reduced-motion support. |

**Validation:** `node --check main.js`; manifest JSON parsing; all manifest paths verified; `git diff --check`; prohibited runtime/API and external-import scan; desktop and 390px local-browser visual inspection. Public Town Ruins GitHub evidence repositories were reachable at validation time.

---

## 2026-09-01 — Visual refinement acceptance repair

Repaired the two confirmed navigation issues without changing the established visual system: content resources now resolve relative to the loaded module, and newly rendered documents reset to their beginning before receiving focus.

| Area | Change |
| --- | --- |
| `main.js` | Added one module-relative content URL helper for the manifest and Markdown fetches. Document renders now use immediate scroll positioning before focus; menu and project-list navigation retain their existing focus behavior. |

**Validation:** JavaScript syntax, manifest JSON, manifest path resolution, root-relative request scan, prohibited execution scan, static fetch checks, and stale-result guard inspection passed.
