# Town Ruins / CV Evidence Audit

**Inspection status:** Complete  
**Inspection date:** 2026-08-31  
**Scope:** Evidence reconciliation only. No application, portfolio, or CV files were modified.

## 1. Executive Summary

The inspected Town Ruins repository contains a substantial full-stack rental-marketplace implementation: React/TypeScript frontend code, an Express backend, Prisma/PostgreSQL persistence, authentication and role-aware authorization, payment and storage integrations, notification and reconciliation workers, Docker/Nginx configuration, tests, and deployment-related files.

The evidence does **not** prove that Alvin Phiri is the sole Git author. The repository history records three Git identity groups—Tea, Ubuntu, and `hwevaproduction-debug`—and no `Alvin`/`Phiri` author identity. The supplied CV and package metadata associate Alvin with the work, so personal contribution is a defensible **Working** claim, but sole development is not **Proven** by Git.

TownRuins-Operations proves the existence of a substantial operational knowledge base and deployment/runbook documentation. It does not, by itself, prove that every documented procedure was executed by Alvin or that the public production environment is currently live. HWEVA/product/IP ownership is not established by the inspected Git evidence.

## 2. Repository Inventory

| Repository | Remote | Branches / state | Relevant evidence |
|---|---|---|---|
| Portfolio | `https://github.com/donnie-alvin/Portphilosphio.git` | `main`; worktree contains pre-existing unstaged application/content changes | `index.html`, `main.js`, `styles.css`, `content/`, `CHANGELOG.md`, `POST_IMPLEMENTATION_AUDIT.md` |
| Town Ruins | `https://github.com/hwevaproduction-debug/towruins.git` | local `stagging`; `main`, `cherry`, `lost`, `pauser`, and remote branches; worktree also has uncommitted changes | `backend/`, `frontend/`, `backend/prisma/`, `docker-compose.yml`, deployment files, tests, `.github/workflows/e2e.yml` |
| TownRuins-Operations | `https://github.com/hwevaproduction-debug/TownRuins-Operations.git` | `main`; worktree contains uncommitted/deleted Traycer and Quartz files | `content/operations/`, deployment/runbook/checklist documents, Quartz publishing configuration |
| Supplied CV | `source material/Alvin Phiri CV.txt` | Untracked source file in portfolio worktree | Self-reported profile, skills, experience, education, and contact information |

All three public Git remotes resolve successfully with `git ls-remote`.

## 3. Contribution Attribution

### Town Ruins

**Git evidence**

```text
33  Tea <tea@example.com>
13  Ubuntu <ubuntu@ip-172-31-40-185.eu-north-1.compute.internal>
 2  hwevaproduction-debug <hwevaproduction@gmail.com>
```

The first commit is `6231331`, authored by Ubuntu. Later substantive changes include Tea-authored authentication, frontend, backend, tests, and operational fixes; Ubuntu-authored environment/deployment changes; and organization-account merge commits. Important files such as `backend/app.js`, `backend/server.js`, authentication code, notification/reconciliation workers, and the Prisma schema have history under these identities rather than an Alvin-named identity.

The GitHub contributors endpoint exposes `hwevaproduction-debug` as the public contributor account, while local commits retain the Tea/Ubuntu identities. Pull requests 1 and 2 are organization-account merges. This is attribution evidence, not a legal identity mapping.

The public API lists pull requests 1 and 2 for Town Ruins, both opened by `hwevaproduction-debug` and merged by that account. TownRuins-Operations has no public pull requests in the inspected result.

**Conclusion:**

```text
Repository: Town Ruins
Primary developer: Not established as an Alvin Git identity
Other contributors: Tea, Ubuntu, hwevaproduction-debug
Solely developed by Alvin Phiri: UNVERIFIED / DO NOT CLAIM AS PROVEN
Personal contribution: WORKING (supported by supplied CV, package author metadata, and user statement; not established by commit identity)
```

### TownRuins-Operations

```text
25  donnie-alvin <hwevaproduction@gmail.com>
 2  hwevaproduction-debug <hwevaproduction@gmail.com>
```

The public contributor account is `hwevaproduction-debug`. The inspected evidence does not independently prove that `donnie-alvin` is Alvin Phiri, although the account is consistent with the project owner/organization account in the supplied material.

**Conclusion:** Operations documentation is strongly attributable to the `donnie-alvin` / HWEVA account, but personal Alvin attribution remains **Working**, not Git-proven.

## 4. HWEVA / IP Boundary

- Repositories are hosted under `hwevaproduction-debug`; Town Ruins documentation and branding refer to the Town Ruins platform and HWEVA context.
- The backend package lists `Alvin Phiri` as author, and the supplied CV describes Alvin's engineering work.
- GitHub account/repository ownership establishes control of the repository account, not personal ownership of the product, business, brand, or intellectual property.
- No inspected artifact establishes a legal IP assignment, employment agreement, or personal ownership by Alvin.

**Canonical boundary:** Alvin's engineering contribution may be described; Town Ruins ownership/IP should be described as **not established by the inspected evidence** and should not be implied as personally owned.

## 5. Technology Evidence Matrix

| Capability / technology | Artifact evidence | What it proves | Safe classification |
|---|---|---|---|
| React, TypeScript | `frontend/package.json`, `frontend/src/` | Frontend implementation and TypeScript source | Working personal experience; Proven implementation exists |
| Material UI, Redux Toolkit, Axios | frontend dependencies and Redux/API slices | UI component system, client state, and API integration code | Working |
| Node.js, Express, REST APIs | `backend/package.json`, `backend/app.js`, `backend/routes/`, controllers | HTTP server and broad REST route surface | Proven implementation; Working personal attribution |
| JWT, bcryptjs | auth utilities/controllers and route middleware | Token authentication and password hashing paths | Proven implementation; Working personal attribution |
| Authorization / RBAC | `requireRole` middleware, ownership checks, role branches | Role-aware and ownership-aware access control | Proven implementation; Working personal attribution |
| PostgreSQL, Prisma | `backend/prisma/schema.prisma`, migrations, Prisma utility | PostgreSQL datasource, relational schema, versioned migrations | Proven implementation; Working personal attribution |
| Database migrations | `backend/prisma/migrations/` | 21 migration directories and migration deployment configuration | Proven artifact |
| Docker / Compose | backend/frontend Dockerfiles, `docker-compose.yml` | Containerized service composition | Proven implementation |
| Nginx | `frontend/nginx.conf`, Compose service | Reverse-proxy/static-serving configuration | Proven implementation |
| AWS SDK / S3-compatible storage | AWS SDK dependencies, upload controller, MinIO configuration | Object-storage integration and local S3-compatible configuration | Working; not proof of live AWS hosting |
| Paynow / Stripe | payment provider modules, webhook routes, package dependencies | Provider abstractions and payment/webhook paths | Proven implementation; production use not established |
| Africa's Talking | SMS utility, dependency, environment reference | SMS channel integration code | Proven implementation; delivery not established |
| Background workers | `notificationWorker.js`, `reconciliationJob.js`, reminder/listing scanners | Queued notifications, payment reconciliation, scheduled job code | Proven implementation; personal operation Working |
| GitHub Actions / CI | `.github/workflows/e2e.yml` | Local CI definition for test and optional deployed E2E jobs | Proven configuration; successful production execution not established |
| Deployment environments | `amplify.yml`, `render.yaml`, Docker/EB-related files, Operations docs | Deployment targets/configuration references and environment separation documentation | Working; live environment not proven |
| Technical documentation | TownRuins-Operations and related docs | Architecture, API, database, deployment, runbook, checklist, and troubleshooting artifacts | Proven documentation exists |

### Explicitly not verified

- Amazon Aurora: no authoritative schema/runtime evidence; current schema says PostgreSQL and Operations references generic PostgreSQL. Do not claim Aurora.
- A specific AWS region, VPC, load balancer, autoscaling setup, or managed database service.
- A currently live public runtime, uptime, production traffic, users, revenue, or adoption.

## 6. Personal Contribution Matrix

| Proposed personal contribution | Evidence | Classification |
|---|---|---|
| Developed/maintained Town Ruins across frontend and backend | Supplied CV; package author metadata; substantial repository implementation | Working; Git does not map commits to Alvin |
| Implemented REST/API domain functionality | Route/controller implementation exists; personal ownership not isolated by Git | Working |
| Implemented authentication, authorization, and RBAC | Auth middleware/controllers and role/ownership checks exist | Working |
| Implemented property/listing and booking workflows | Listing, accommodation, room, booking, stay, payment, and moderation controllers/routes exist | Working |
| Implemented payment provider/webhook/reconciliation behavior | Provider modules, webhook routes, reconciliation job exist | Working |
| Implemented notification/background processing | Notification service/worker and related scanners exist | Working |
| Configured Docker, Compose, Nginx, and deployment files | Configuration artifacts exist; commit authors are not Alvin-named | Working |
| Produced/maintained operational documentation | Operations repository contains extensive runbooks/checklists; authored by `donnie-alvin` account | Working |
| Personally executed production troubleshooting | Procedures describe troubleshooting, but no incident records or Alvin-attributed runtime logs were found | Don't claim |
| Solely developed the entire product | Conflicted by multiple local Git author identities | Don't claim as Proven |

## 7. Operations Evidence Matrix

| Operations artifact | What it establishes | Boundary |
|---|---|---|
| `content/operations/DEPLOYMENT.md` | Documented AWS Amplify/Elastic Beanstalk/S3/Cloudflare deployment model, build order, migrations, health checks, and environment concepts | Configuration/documentation; not proof deployment completed |
| `OPERATIONS_RUNBOOK.md` | Daily checks, health verification, core user journeys, queue review, incident triage, and handoff procedure | Operational procedure; not proof Alvin executed it |
| Pre/post-deployment checklists | Release gates, migration checks, environment and integration checks | Checklist state includes configured/verified language; execution records are not populated evidence |
| `ROLLBACK.md`, `TROUBLESHOOTING.md` | Rollback and failure-remediation procedures | Written operational knowledge; no incident outcome proof |
| `SMOKE_TEST_PLAN.md` | API, frontend, auth, listings, uploads, payments, and booking smoke-test plans | Test plan; blank execution logs do not prove successful live tests |
| `ENVIRONMENT_VARIABLES.md` | Names, purposes, and sensitivity classes for runtime configuration | Does not expose or prove secret values; no secrets copied into this audit |
| Quartz/GitHub Pages workflow | Operations knowledge publication mechanism | Proves documentation publishing configuration, not application runtime health |

## 8. CV Claim Audit

The following classifies substantive CV statements for safe publication. “Working” means implementation or self-reported evidence is strong but personal authorship, execution, date, or production scope is incomplete.

| CV claim | Classification | Reason |
|---|---|---|
| Alvin Phiri; Software Engineer | Proven | Supplied CV, portfolio identity content, and backend package author metadata agree. |
| Computer Science graduate, Africa University, 2021–2025, GPA 3.32 | Working | Supplied CV only; no academic artifact inspected. |
| Hands-on full-stack real-estate platform experience | Working | Town Ruins clearly contains the implementation; personal Git attribution is incomplete. |
| Town Ruins developed and maintained | Working | Supported by CV, package author metadata, and user statement; not proven by commit identity. |
| 2025–Present employment period | Don't claim | Repository history begins in August 2026 and does not establish employment dates. |
| Frontend and backend application development | Working | React/TypeScript and Express code exist; commit identity does not map cleanly to Alvin. |
| REST APIs and API integration | Working | Extensive route/controller and frontend API code exists. |
| Relational database design and data management | Working | Prisma schema, PostgreSQL datasource, migrations, and controllers exist. |
| Authentication, authorization, and RBAC | Working | JWT/bcrypt, role middleware, and ownership checks are implemented. |
| Containerized deployment | Working | Dockerfiles and Compose configuration exist; runtime deployment is not proven. |
| Nginx reverse-proxy configuration | Working | Nginx configuration and Compose service exist. |
| AWS/cloud infrastructure | Working | AWS SDK/S3 and deployment configuration are present; live hosting/topology is not established. |
| Background processing and scheduled workers | Working | Notification, reconciliation, reminder, and expiry job code exists. |
| Payment-related reconciliation | Working | `reconciliationJob.js` polls provider status and applies payment side effects. |
| Property/listing lifecycle workflows | Working | Listing, accommodation, room, booking, and stay routes/controllers exist. |
| PostgreSQL | Working | PostgreSQL datasource and migrations are verified; personal authorship remains incomplete. |
| Amazon Aurora | Don't claim | Not established by schema or reliable runtime evidence. |
| Production troubleshooting / live-system investigation | Don't claim | Procedures exist, but no Alvin-attributed incident or runtime evidence was found. |
| Staging/production environment separation | Working | Environment configuration and Operations documentation describe separation; execution state is not proven. |
| Git/GitHub workflows | Working | Git history and GitHub Actions workflow exist; personal role is not isolated by author identity. |
| Technical documentation | Working | Architecture, API, database, deployment, and operations documentation exist. |
| JavaScript, TypeScript, SQL, HTML, CSS | Working | Source and package evidence exists; personal authorship is not fully attributable from Git. |
| Linux environments | Working | Linux deployment/runtime references and shell/deployment artifacts exist. |
| CI/CD workflows | Working | E2E GitHub workflow exists; successful release execution is not established. |
| Phone, email, portfolio URL, and GitHub contact details | Working | Present in the supplied CV; the portfolio URL and project account are reachable, but personal account ownership is not independently established here. |
| English — Fluent | Working | Self-reported in the supplied CV; no independent language credential was inspected. |
| “Comfortable working across application and infrastructure layers” | Don't claim as fact | Broad subjective statement not independently measurable from artifacts. |
| Systems thinking | Developing | Portfolio direction and implemented cross-layer work support an emerging capability, not a quantified specialty. |
| Distributed systems / systems architecture | Developing | Stated development direction; Town Ruins provides related patterns but not specialist proof. |
| ISC2 Certified in Cybersecurity | Don't claim | CV itself says to include only after credential validity is confirmed; no confirmation inspected. |
| Cisco Networking Academy / freeCodeCamp certifications | Don't claim | No credential artifacts or verification were inspected. |

### Classification totals

```text
Proven:      1
Working:    22
Developing:  2
Target:      0
Don't claim: 5
```

## 9. Claims To Remove

- “Amazon Aurora” / “PostgreSQL/Amazon Aurora”.
- “2025–Present” unless independently dated employment evidence is supplied.
- “Production troubleshooting”, “live system”, or equivalent runtime assertions.
- “Solely developed by Alvin” as a Git-proven fact.
- Personal ownership of Town Ruins or its IP.
- Unverified certification claims.
- Unqualified claims that all deployment, staging, or production operations were personally executed.

## 10. Claims To Downgrade

- “Built and maintained Town Ruins” → “Developed and maintained Town Ruins” may be used as a Working, contribution-oriented statement, with Git attribution caveat.
- “AWS-hosted infrastructure” → “AWS-related deployment and S3 configuration are present” unless live hosting evidence is supplied.
- “Production environments” → “production-oriented configuration and operational documentation”.
- “Scheduled workers” → “implemented scheduled worker code” unless execution ownership is documented.
- “Technical documentation covering deployment and operations” → retain as an artifact claim, not proof that Alvin authored every document.

## 11. Strong Evidence Claims

The strongest defensible professional statements are:

1. Town Ruins is a substantial full-stack real-estate marketplace implementation.
2. The codebase spans React/TypeScript frontend work and Node.js/Express REST APIs.
3. It uses Prisma with PostgreSQL schema and migration artifacts.
4. It implements JWT authentication, password hashing, role-aware authorization, and ownership checks.
5. It contains payment provider/webhook/reconciliation code and asynchronous notification processing.
6. It includes Docker/Compose and Nginx infrastructure configuration.
7. TownRuins-Operations contains detailed deployment, runbook, rollback, smoke-test, troubleshooting, and environment documentation.

These prove the existence of implementation and documentation. They do not automatically prove Alvin authored every line or that the public runtime is currently operational.

## 12. Recommended Canonical Town Ruins Description

> Town Ruins is a full-stack real-estate marketplace that I developed and maintained as part of my software engineering work. The implementation spans a React/TypeScript frontend, Node.js/Express APIs, Prisma/PostgreSQL persistence, JWT authentication and role-aware authorization, payment and notification workflows, Docker/Nginx deployment configuration, and supporting operational documentation. The inspected artifacts establish substantial implemented software and infrastructure work; they do not establish a current live-production runtime, business metrics, or personal ownership of the product/IP.

## 13. Recommended Evidence Taxonomy

### Proven

- The repositories contain the frontend, backend, database, integration, worker, infrastructure, test, and documentation artifacts listed above.
- PostgreSQL/Prisma schema and migration artifacts exist.
- TownRuins-Operations contains deployment and operational knowledge documents.
- Public repository URLs resolve.

### Working

- Alvin's personal full-stack/backend/infrastructure contribution to Town Ruins.
- Use of the verified technologies in professional work.
- AWS-related deployment configuration and environment separation.
- Personal authorship/maintenance of operational documentation through the associated account.

### Developing

- Distributed systems, systems architecture, and broader systems thinking as professional direction.
- AI systems/orchestration as described in the supplied portfolio direction.

### Target

- No separate target claim is required by the inspected CV; future goals should remain explicitly future-oriented if added later.

### Don't claim

- Amazon Aurora.
- Live production status, uptime, users, revenue, or adoption.
- 2025–Present employment dates without dated source evidence.
- Sole Git-proven development by Alvin.
- Personal Town Ruins/HWEVA IP ownership.
- Unverified certifications or runtime troubleshooting outcomes.

## 14. Portfolio Integration Map

| Portfolio area | Evidence that can safely appear |
|---|---|
| About / Identity | Alvin Phiri, Software Engineer, Computer Science background as Working, cross-layer engineering direction |
| Town Ruins / Overview | Marketplace purpose, contribution-oriented description, Working evidence level, explicit no-live-runtime caveat |
| Town Ruins / Architecture | Frontend/backend separation, REST APIs, Prisma/PostgreSQL, domain boundaries |
| Town Ruins / Authentication | JWT, bcryptjs, role-aware routes, ownership checks |
| Town Ruins / Payments and workers | Paynow/Stripe modules, webhooks, reconciliation, notification worker |
| Town Ruins / Infrastructure | Docker, Compose, Nginx, MinIO/S3-compatible storage, deployment configuration without asserting live hosting |
| Town Ruins / Operations | Existence and general relevance of runbooks/checklists; never copy secrets or claim unrecorded execution |
| Town Ruins / Evidence | Verified public repository/documentation links and inspectable artifact paths |
| Design Philosophy | Evidence-first wording; no promise that unsupported claims are linked |
| Research / Thinking | Distributed systems, cloud, security, and AI systems as active development areas |
| Contact | Only verified supplied contact routes |

## 15. Unresolved Questions

1. Is the Git identity `Tea`, `Ubuntu`, or `donnie-alvin` formally Alvin Phiri, an automation identity, or another contributor?
2. What exact employment or engagement dates apply to Alvin's Town Ruins work?
3. Who legally owns or controls Town Ruins and its IP under HWEVA?
4. Was Town Ruins ever publicly deployed, and if so, what verifiable runtime endpoint and dates can be supplied?
5. Which documented Operations procedures were actually executed, by whom, and when?
6. Is the ISC2 credential currently valid, and can the other listed certifications be independently verified?

## Validation Record

- Repository remotes checked with `git ls-remote`: all three reachable.
- Town Ruins and Operations Git authors, branches, merge commits, and file histories inspected.
- Manifest/content paths in the portfolio remain present; no portfolio files were changed by this audit.
- Portfolio-facing claim scan performed for Aurora, production/live/operational, ownership, sole-development, and AWS wording.
- No secrets, credentials, tokens, private endpoints, or environment values were copied into this report.
- No application files, portfolio content files, or CV files were modified.

```text
INSPECTION STATUS: COMPLETE

Town Ruins contribution attribution:
WORKING personal contribution; sole development by Alvin is UNVERIFIED by Git

IP ownership:
NOT ESTABLISHED BY INSPECTED EVIDENCE

CV claims:
1 Proven
22 Working
2 Developing
0 Target
5 Don't claim

Portfolio evidence readiness:
PARTIAL (strong implementation evidence; personal Git attribution and production facts remain unresolved)

Application files modified:
NONE

Portfolio files modified:
NONE

CV modified:
NONE
```
