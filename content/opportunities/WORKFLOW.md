# Opportunity intake workflow

This is a supervised curation workflow, not a general job scraper. The user decides which opportunities belong in the portfolio. The agent discovers, extracts, prepares, and validates. Selection and record approval are separate gates.

## 1 — Intake

The user may provide one or more referral URLs, individual listing URLs, already identified opportunities, and optional preferences. Preserve each supplied referral URL as-is, including its scheme, host, path, query parameters, referral codes, link identifiers, and tracking values.

The agent may use the public referral page and public listing pages. Do not create accounts, enter credentials, bypass access controls, or submit applications. Do not repeatedly retry a blocked endpoint after reasonable public navigation alternatives fail.

## 2 — Discover and extract

For each referral source:

- Determine whether the catalogue is accessible without authentication.
- Discover the listings returned by that source and capture observed individual listing URLs in agent-side working context only.
- Open each accessible listing. Record exact access failures and identify what requires manual input.
- Extract title, organisation, description, responsibilities, qualifications, skills, experience, compensation, engagement type, location and eligible countries, work arrangement, hours, deadline, application availability, and discovery date when present.
- Distinguish listing text from feed/API data and secondary information. Do not promote inference to verified fact.
- Check application availability where possible. A page existing, a job card appearing, or an Apply control being visible is not sufficient evidence to mark it Open.
- Keep each requested fact in one of three evidence states: Verified (explicitly confirmed by an authoritative source), Unverified (present but ambiguous or not independently confirmed), or Unavailable (not retrievable).

Do not save individual listing URLs, external source citations, or direct application URLs into public Markdown or the portfolio manifest. They are research aids for the agent, not visitor-facing links.

## 3 — Present the discovery catalogue; wait

Present a concise catalogue before generating any opportunity record. Include for each discovered listing:

- Title and organisation.
- Location and work arrangement.
- Compensation, if shown.
- Brief description and significant eligibility restrictions.
- Completeness, access limitations, and important unknowns.
- A stable title or identifier the user can use to select it.

Offer to provide more information or assess suitability against the user's background when requested. Do not create Markdown files or manifest entries at this stage.

Wait for an explicit selection. Selected listings may proceed to preparation; rejected and unselected listings remain outside portfolio content and the manifest. The user may leave listings for later consideration.

Keep the discovery catalogue in the current task/conversation context so the user can return to unselected roles without managing portfolio files. If that context is unavailable in a later session, ask the user to provide the referral URL again and rediscover the current listings.

## 4 — Prepare selected records as proposals

For each selected listing, prepare a complete record using TEMPLATE.md and a proposed manifest entry. Show the proposed Markdown and metadata in the review response or a private review artifact, not in the published content directory. Do not edit the portfolio manifest yet.

The proposed record must preserve the employer's details accurately, label Verified, Unverified, and Unavailable information, and state what manual input remains. Do not add unsolicited interview preparation or generic candidate advice.

The manifest uses the existing opportunity schema. Include the existing path, title, summary, kind, organization, opportunityType, location/work arrangement/employment arrangement when known, dateDiscovered, lastVerified, deadline when verified, and status. Status must be one of Open, Closing Soon, Closed, Paused, or Unverified. Use Unverified whenever current application availability is not affirmatively established.

Add opportunity-specific fields `applicationUrl` and `applicationUrlVerified`. Set the verification field to `true` only when the exact application URL is the user's supplied referral URL or a job-specific referral destination verified from the referral source:

- Prefer the job-specific referral application URL when the platform provides one.
- Otherwise use the complete original catalogue referral URL.
- Preserve every attribution parameter exactly. Never reconstruct, shorten, or strip tracking data.
- The public board renders an application action only for HTTPS URLs with `applicationUrlVerified: true`.
- If an attributed destination cannot be identified or verified, pause and ask the user; do not substitute the individual job page or a direct application URL.

## 5 — Validate and request record approval

Before asking for approval, check:

- The user selected this listing and no unselected listing is in the proposal.
- Required manifest fields, valid status, date format, and proposed file path are correct.
- No duplicate opportunity or existing path would be overwritten.
- The Markdown page is complete, readable in the portfolio's Markdown renderer, and clear about unknowns.
- The exact applicationUrl matches the supplied/referral-derived URL and retains the complete attribution string.
- `applicationUrlVerified` is true only after that comparison succeeds.
- No individual listing URL, direct application link, or other external opportunity link appears in proposed public content.
- The intended status does not overstate application availability.

Present the selected titles, proposed paths, metadata, referral CTA destination, verification limits, and validation results. Ask the user to approve the records or request revisions. Do not add the proposals to content or manifest before explicit approval.

## 6 — Add approved records

After explicit approval, add only the approved Markdown files under content/opportunities/ and their corresponding top-level opportunity items to content/manifest.json. The renderer lists only manifest items, orders opportunities by dateDiscovered newest first, opens a dedicated local detail page, and renders the application action from applicationUrl.

The detail page presents the complete extracted information locally. Its only external opportunity link is labelled **I'm ready to apply — Apply now** and points to the exact applicationUrl. Individual source URLs are not shown or linked. The renderer suppresses external Markdown links and raw external URLs inside opportunity pages so the application CTA remains the sole external opportunity link. A record without a verified referral destination is excluded from the public board and flagged for review.

Adding approved files to the working tree is not a git commit or deployment. Do not commit, merge, or deploy unless separately requested and authorized.

## 7 — Keep interview preparation separate

Do not create interview guides during discovery, selection, record generation, or publication. When the user later requests preparation for a particular role, use that role's extracted requirements and the user's actual background to provide a private, tailored session. Keep those notes out of the public record.
