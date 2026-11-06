# Opportunities

This archive contains only opportunities selected by Alvin and approved for publication. The agent handles discovery, extraction, record preparation, and validation; referral URLs are preserved exactly. No opportunity is added to the portfolio just because it appeared in a catalogue.

## Intake and publication

Follow [WORKFLOW.md](WORKFLOW.md) for the full repeatable procedure. In short:

1. Provide one or more referral URLs, optional individual listing URLs, and any preferences.
2. The agent checks public access, discovers listings, opens each accessible job page, and prepares a discovery catalogue. No accounts, authentication bypasses, applications, or unrestricted scraping.
3. Select the specific opportunities to prepare. Unselected or rejected listings never become portfolio files or manifest entries.
4. Review the proposed record content and manifest metadata. The agent waits for explicit approval before adding selected records to `content/opportunities/` and `content/manifest.json`.
5. Commits and deployment are separate actions and never happen automatically.

Interview preparation is not part of this flow. Request it separately for a specific opportunity.

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
