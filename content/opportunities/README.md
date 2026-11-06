# Adding an opportunity

Opportunities belong to the main portfolio archive. Do not add them to the separate `capital/` application.

## Add a record

- Copy `TEMPLATE.md` to a descriptive file such as `content/opportunities/backend-engineer.md`.
- Complete the brief using verified sources. Leave unavailable facts explicitly unverified; do not infer requirements, availability, salary, deadline, or interview stages.
- Add a top-level item to `content/manifest.json` with `kind` set to `opportunity`.
- Check the content path, original source, verification date, claims, and status before publishing.

The manifest item uses the existing `path`, `title`, and `summary` fields and supports these opportunity fields:

- `kind`: exactly `opportunity`.
- `organization`: verified organisation name.
- `opportunityType`: for example, employment or internship when supported by the source.
- `location`, `workArrangement`, `employmentArrangement`: include only when known.
- `dateDiscovered`, `lastVerified`: ISO dates in `YYYY-MM-DD` form; do not claim a current verification if none occurred.
- `deadline`: verified deadline, including time zone where available; omit it if unknown.
- `status`: exactly `Open`, `Closing Soon`, `Closed`, `Paused`, or `Unverified`. Missing or unrecognized values display as `Unverified`.

The listing sorts by `dateDiscovered`, newest first. Records without a usable date appear after dated records. Status is editorially maintained; it is not inferred from the deadline or from the record's presence.

## Write the brief

The Markdown record is the detailed, standalone research brief. Identify the original source and verification date near the top. Clearly label:

- Original employer information, preserving requirements without silent edits.
- Independently researched organisation facts, with sources.
- Editorial interpretation.
- Candidate recommendations.
- Potential interview questions developed independently (not actual employer questions).

State when a source is unavailable or information could not be verified. Distinguish confirmed application instructions from recommendations. Keep expired records only when useful as references and mark them `Closed`.

The reader supports headings, paragraphs, unordered lists, fenced code blocks, bold text, HTTP(S) links, and local images. It does not support Markdown tables, ordered lists, YAML front matter, or inline code formatting. Use numbered headings such as `## 1 — Submit the application` for ordered application steps. External HTTP(S) links are visually identified by the reader.

There are no opportunity records published yet. Do not add a demonstration entry unless an actual professional opportunity and its original source have been verified.
