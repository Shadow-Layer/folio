# Opportunities

This archive contains only opportunities selected by Alvin and approved for publication. The agent handles discovery, extraction, record preparation, and validation; referral URLs are preserved exactly. No opportunity is added to the portfolio just because it appeared in a catalogue.

## Intake and publication

Follow [WORKFLOW.md](WORKFLOW.md) for the full repeatable procedure. In short:

1. Provide one or more referral URLs, optional individual listing URLs, and any preferences.
2. The agent checks public access, discovers listings, opens each accessible job page, and prepares a discovery catalogue. No accounts, authentication bypasses, applications, or unrestricted scraping.
3. Select the specific opportunities to prepare. Unselected or rejected listings never become portfolio files or manifest entries.
4. Review the proposed record content and manifest metadata. The agent waits for explicit approval before adding selected records to `content/opportunities/` and `content/manifest.json`.
5. Commits and deployment are separate actions and never happen automatically.

Interview preparation is not part of this publication flow. Each opportunity detail page has a **Start mock interview** action that builds a neutral prompt at runtime from that specific opportunity's brief and metadata. Candidate background is not loaded or inferred; the interviewer is instructed to establish the candidate's experience through their answers. The visitor can review and edit the prompt, choose an external assistant, then use one action to copy the complete prompt and open that provider in a new tab.

## Published record conventions

- Copy `TEMPLATE.md` for each selected opportunity. The Markdown page is a complete brief, not a link-out to the employer page.
- Individual job-page URLs are research-only and must not appear in public Markdown or manifest data. Do not include source citations that expose those URLs.
- The only external opportunity link is the exact referral application URL in the manifest's `applicationUrl` field. The detail page renders it as **I'm ready to apply — Apply now**. Do not add a direct listing, direct application, or untracked alternative link.
- If the referral source has a job-specific referral application URL, use it exactly; otherwise use the complete original catalogue referral URL. Never rebuild or strip referral codes, link identifiers, or tracking parameters. If an attributed destination cannot be verified, do not publish; ask for clarification.
- The public board has its own responsive card layout and detail view. It is an independent destination, not a Folio subsection. The public Opportunities UI must not name the referral platform.
- Do not add other external links to an opportunity record. The renderer suppresses external Markdown links and raw URLs in opportunity pages; internal record navigation remains available.
- A record is shown on the board only when it has an HTTPS `applicationUrl` and `applicationUrlVerified: true`. Missing or unverified destinations are excluded instead of getting a misleading CTA.
- Label claims Verified, Unverified, or Unavailable. Missing information is not a negative answer and must not be inferred.
- Keep status editorially maintained. A listing page or visible application control is not proof of availability. Use `Open`, `Closing Soon`, `Closed`, `Paused`, or `Unverified`; default to `Unverified` when current availability is not confirmed.
- Use `dateDiscovered` and `lastVerified` as ISO `YYYY-MM-DD` dates. The archive sorts by discovery date, newest first.

## Manifest fields

Every published opportunity is a top-level `content/manifest.json` item with `kind: "opportunity"` and the existing `path`, `title`, and `summary` fields. Opportunity metadata may include `organization`, `opportunityType`, `location`, `eligibleCountries`, `workArrangement`, `employmentArrangement`, `compensation`, `workingHours`, `dateDiscovered`, `lastVerified`, `deadline`, and `status`. Omit unknown optional facts. `applicationUrl` stores the exact attributed destination; set `applicationUrlVerified` to `true` only after verifying that it is the user's supplied referral URL or the job-specific referral destination. Individual job URLs are never stored in public metadata.

The public template, manifest, and renderer are intentionally not an intake database. Keep discovery notes and individual listing URLs in agent-side working context, not in portfolio content.

## Mock interview launcher

- The launcher uses only the selected opportunity's Markdown brief and available role metadata. It never loads `cv.md` or injects portfolio-owner information.
- Candidate background is unknown by default. The prompt tells the interviewer not to assume qualifications or experience, to establish relevant background, and to evaluate the candidate's actual answers.
- The prompt is editable and remains in the visitor's browser. The portfolio does not run an interview or call an AI API.
- The visitor selects ChatGPT, Claude, or Gemini and uses one **Copy prompt & open [provider]** action. It copies the complete prompt and opens that provider in a new tab. ChatGPT's `?q=` prefill is used only when the URL is within the configured length limit; otherwise the user can paste the copied prompt. Claude and Gemini open at their provider destinations.
- Provider destinations and the ChatGPT URL limit are centralized in `main.js`. Clipboard and popup failures are reported, with the prompt left selectable for manual copying.
