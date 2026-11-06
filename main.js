/* State-driven portfolio interface. No frameworks. Fetches content on demand using /content/manifest.json */

const el = (id) => document.getElementById(id);
const stage = el('stage');

let manifest = null;
let manifestLoadFailed = false;
let contentCache = {};
let state = { view: 'initial', selected: null };
const contentBase = new URL('./content/', import.meta.url);
const opportunityStatuses = ['Open', 'Closing Soon', 'Closed', 'Paused', 'Unverified'];

function contentUrl(path) {
  return new URL(path, contentBase).href;
}

// Load manifest once, cache content
async function loadManifest() {
  if (manifest) return manifest;
  try {
    const res = await fetch(contentUrl('manifest.json'));
    if (!res.ok) throw new Error('Manifest request failed');
    manifest = await res.json();
    if (!manifest || !Array.isArray(manifest.items)) throw new Error('Manifest has an invalid shape');
    return manifest;
  } catch (e) {
    manifestLoadFailed = true;
    manifest = { items: [] };
    return manifest;
  }
}

function getOpportunityStatus(item) {
  return opportunityStatuses.includes(item.status) ? item.status : 'Unverified';
}

function getOpportunityApplicationUrl(item) {
  if (item.applicationUrlVerified !== true) return null;
  if (typeof item.applicationUrl !== 'string' || !item.applicationUrl) return null;

  try {
    const url = new URL(item.applicationUrl);
    if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) return null;
    return item.applicationUrl;
  } catch {
    return null;
  }
}

// Update state and re-render
function setState(next) {
  state = Object.assign({}, state, next);
  render();
}

function setStageBusy(isBusy) {
  stage.setAttribute('aria-busy', String(isBusy));
}

function focusStage({ resetScroll = false } = {}) {
  if (resetScroll) stage.scrollIntoView({ block: 'start', behavior: 'auto' });
  stage.focus({ preventScroll: !resetScroll });
}

// Render based on state
function render() {
  switch (state.view) {
    case 'initial':
      renderInitial();
      break;
    case 'topics':
      showTopics();
      break;
    case 'projects':
      showProjectsList();
      break;
    case 'opportunities':
      showOpportunitiesList();
      break;
    case 'content':
      if (state.selected) openContent(state.selected);
      break;
  }
}

// Initial state
function renderInitial() {
  setStageBusy(false);
  stage.classList.remove('stage-opportunities');
  stage.innerHTML = '';
  const home = document.createElement('section');
  home.className = 'home-view';
  home.innerHTML = `
    <header class="home-heading">
      <p class="kicker">Alvin Phiri <span aria-hidden="true">/</span> Software Engineer</p>
      <h1>Three ways to explore my work.</h1>
      <p>Engineering, selected opportunities, and the study of capital — each with its own space.</p>
    </header>
    <nav class="destination-grid" aria-label="Portfolio destinations">
      <button class="destination-card destination-folio" type="button" data-destination="folio">
        <span class="destination-label">01 / Engineering</span>
        <span class="destination-title">Folio</span>
        <span class="destination-description">Projects, notes, and evidence from my engineering work.</span>
        <span class="destination-action">Explore Folio <span aria-hidden="true">→</span></span>
      </button>
      <button class="destination-card destination-opportunities" type="button" data-destination="opportunities">
        <span class="destination-label">02 / Career</span>
        <span class="destination-title">Opportunities</span>
        <span class="destination-description">A curated board of roles, with the details available here.</span>
        <span class="destination-action">Browse opportunities <span aria-hidden="true">→</span></span>
      </button>
      <a class="destination-card destination-capital" href="./capital/">
        <span class="destination-label">03 / Investment</span>
        <span class="destination-title">Capital</span>
        <span class="destination-description">A separate space for learning how capital moves.</span>
        <span class="destination-action">Explore Capital <span aria-hidden="true">→</span></span>
      </a>
    </nav>
  `;
  stage.appendChild(home);
  home.querySelector('[data-destination="folio"]').addEventListener('click', async () => {
    await loadManifest();
    setState({ view: 'topics' });
  });
  home.querySelector('[data-destination="opportunities"]').addEventListener('click', () => {
    setState({ view: 'opportunities' });
  });
}

// Sanitize HTML to prevent injection
function sanitize(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

// Simple markdown renderer: h1-h6, paragraphs, lists, bold, code blocks
function mdToHtml(md, { allowExternalLinks = true } = {}) {
  const lines = md.split(/\r?\n/);
  let out = '';
  let inList = false;
  let inCodeBlock = false;
  let codeContent = '';

  for (let line of lines) {
    const trimmed = line.trim();
    
    // Code block fence
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        // Starting a code block
        if (inList) {
          out += '</ul>';
          inList = false;
        }
        inCodeBlock = true;
        codeContent = '';
      } else {
        // Ending a code block
        out += '<pre><code>' + sanitize(codeContent.trimEnd()) + '</code></pre>';
        inCodeBlock = false;
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent += line + '\n';
      continue;
    }

    // Empty line
    if (!trimmed) {
      out += '<p></p>';
      continue;
    }

    // Headings
    if (line.startsWith('#')) {
      const m = line.match(/^(#{1,6})\s+(.*)$/);
      if (m) {
        out += `<h${m[1].length}>${sanitizeAndFormat(m[2], { allowExternalLinks })}</h${m[1].length}>`;
      } else {
        out += `<p>${sanitizeAndFormat(line, { allowExternalLinks })}</p>`;
      }
      if (inList) {
        out += '</ul>';
        inList = false;
      }
    }
    // Unordered lists
    else if (line.startsWith('- ')) {
      if (!inList) {
        out += '<ul>';
        inList = true;
      }
      out += `<li>${sanitizeAndFormat(line.slice(2), { allowExternalLinks })}</li>`;
    }
    // Regular paragraphs
    else {
      if (inList) {
        out += '</ul>';
        inList = false;
      }
      out += `<p>${sanitizeAndFormat(trimmed, { allowExternalLinks })}</p>`;
    }
  }

  if (inList) {
    out += '</ul>';
  }
  
  if (inCodeBlock) {
    // Unclosed code block: output what we have
    out += '<pre><code>' + sanitize(codeContent.trimEnd()) + '</code></pre>';
  }

  return out;
}

// Render safe Markdown links while preserving HTML safety. Relative links are
// resolved from the repository's content root so documents can point to local
// static assets (for example, the downloadable CV PDF).
function formatLinks(text, { allowExternalLinks = true } = {}) {
  const linkPattern = /\[([^\]]+)\]\(([^\s)]+)\)/g;
  let html = '';
  let lastIndex = 0;
  let match;

  while ((match = linkPattern.exec(text))) {
    html += sanitize(text.slice(lastIndex, match.index));

    try {
      const url = new URL(match[2], contentBase);
      if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Unsupported link protocol');
      const external = url.origin !== window.location.origin;
      if (external && !allowExternalLinks) {
        html += sanitize(match[1]);
        lastIndex = linkPattern.lastIndex;
        continue;
      }
      html += '<a href="' + sanitize(url.href) + '"' +
        (external ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' +
        sanitize(match[1]) + '</a>';
    } catch (e) {
      html += sanitize(allowExternalLinks ? match[0] : match[1]);
    }

    lastIndex = linkPattern.lastIndex;
  }

  return html + sanitize(text.slice(lastIndex));
}

// Render local Markdown images as lazy, semantic evidence. Image URLs are
// resolved from the content root and never fetched until their document opens.
function formatImages(text) {
  return text.replace(/!\[([^\]]*)\]\(([^\s)]+)\)/g, (whole, alt, path) => {
    try {
      const url = new URL(path, contentBase);
      if (url.origin !== window.location.origin || !/^\.(?:png|jpe?g|webp|gif)$/i.test(url.pathname.slice(url.pathname.lastIndexOf('.')))) {
        return sanitize(whole);
      }
      return '<img class="document-image" src="' + sanitize(url.href) + '" alt="' + sanitize(alt) + '" loading="lazy">';
    } catch (e) {
      return sanitize(whole);
    }
  });
}

// Format text with **bold** and HTTPS links while preserving HTML safety
function sanitizeAndFormat(text, { allowExternalLinks = true } = {}) {
  const safeText = allowExternalLinks
    ? text
    : text
      .replace(/!\[([^\]]*)\]\((?:https?:)?\/\/[^\s)]+\)/gi, '$1')
      .replace(/\[([^\]]+)\]\((?:https?:\/\/|ftp:\/\/|mailto:|www\.)[^\s)]+\)/gi, '$1')
      .replace(/\b(?:https?:\/\/|ftp:\/\/|mailto:)[^\s)]+/gi, '')
      .replace(/\bwww\.[^\s)]+/gi, '')
      .replace(/\b(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s)]*)?/gi, '');
  const imageParts = formatImages(safeText);
  if (imageParts !== safeText) return imageParts;
  // Split on ** patterns, capturing the bold sections
  const parts = safeText.split(/(\*\*[^*]+\*\*)/);
  let html = '';
  
  for (const part of parts) {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Bold section
      const content = part.slice(2, -2);
      html += '<strong>' + formatLinks(content, { allowExternalLinks }) + '</strong>';
    } else if (part) {
      // Regular text
      html += formatLinks(part, { allowExternalLinks });
    }
  }
  
  return html;
}

// Show topics menu
async function showTopics() {
  const data = await loadManifest();
  if (state.view !== 'topics') return;
  setStageBusy(false);
  stage.classList.remove('stage-opportunities');
  const topics = [
    { id: 'about', title: 'About / Identity', file: 'about.md' },
    { id: 'projects', title: 'Projects', file: null },
    { id: 'opportunities', title: 'Opportunities', file: null },
    { id: 'philosophy', title: 'Design Philosophy', file: 'design-philosophy.md' },
    { id: 'research', title: 'Research / Thinking', file: 'research.md' },
    { id: 'cv', title: 'CV', file: 'cv.md' },
    { id: 'contact', title: 'Contact', file: 'contact.md' }
  ];

  stage.innerHTML = '';
  const view = document.createElement('section');
  view.className = 'archive-view topics-view';
  view.innerHTML = `
    <header class="view-heading">
      <p class="kicker">Archive index <span aria-hidden="true">—</span> 02</p>
      <h1>Choose a thread.</h1>
      <p>Each entry opens a different part of the work.</p>
    </header>
  `;
  const list = document.createElement('div');
  list.className = 'archive-list';

  for (const [index, t] of topics.entries()) {
    const d = document.createElement('button');
    d.className = 'archive-entry';
    d.type = 'button';
    d.setAttribute('aria-label', `Open ${t.title}`);

    const number = document.createElement('span');
    number.className = 'entry-number';
    number.textContent = String(index + 1).padStart(2, '0');
    number.setAttribute('aria-hidden', 'true');
    d.appendChild(number);

    const copy = document.createElement('span');
    copy.className = 'entry-copy';
    const h = document.createElement('span');
    h.className = 'entry-title';
    h.textContent = t.title;
    copy.appendChild(h);

    const p = document.createElement('span');
    p.className = 'entry-summary';

    if (t.file) {
      const item = data.items.find(i => i.path === t.file);
      p.textContent = item ? (item.summary || 'Open to read') : 'No content';
    } else if (t.id === 'opportunities') {
      p.textContent = 'Selected roles with verified details and referral-only application links';
    } else {
      p.textContent = 'Explore projects';
    }

    copy.appendChild(p);
    d.appendChild(copy);

    const arrow = document.createElement('span');
    arrow.className = 'entry-arrow';
    arrow.textContent = '→';
    arrow.setAttribute('aria-hidden', 'true');
    d.appendChild(arrow);

    d.addEventListener('click', () => {
      if (t.id === 'projects') {
        setState({ view: 'projects' });
      } else if (t.id === 'opportunities') {
        setState({ view: 'opportunities' });
      } else {
        setState({ view: 'content', selected: t.file });
      }
    });

    list.appendChild(d);
  }

  view.appendChild(list);
  stage.appendChild(view);
  focusStage();
}

// Show curated opportunities from top-level manifest records
async function showOpportunitiesList() {
  const data = await loadManifest();
  if (state.view !== 'opportunities') return;
  setStageBusy(false);

  stage.classList.add('stage-opportunities');
  stage.innerHTML = '';
  const wrap = document.createElement('section');
  wrap.className = 'opportunities-view';
  wrap.innerHTML = `
    <header class="opportunities-heading">
      <p class="opportunities-eyebrow">Career board</p>
      <h1>Opportunities</h1>
      <p>Selected roles, with the available details collected in one place.</p>
    </header>
  `;

  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'opportunities-back';
  back.textContent = '← Home';
  back.addEventListener('click', () => setState({ view: 'initial' }));

  if (manifestLoadFailed) {
    const error = document.createElement('p');
    error.className = 'opportunities-empty';
    error.textContent = 'Opportunities could not be loaded. Please try again later.';
    wrap.appendChild(error);
    wrap.appendChild(back);
    stage.appendChild(wrap);
    focusStage();
    return;
  }

  const opportunities = data.items.filter(item => {
    if (item.kind !== 'opportunity') return false;
    if (!getOpportunityApplicationUrl(item)) {
      console.error(`Opportunity "${item.title || item.path}" is not shown because its application destination is not verified.`);
      return false;
    }
    return true;
  });

  if (opportunities.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'opportunities-empty';
    empty.textContent = 'No opportunities are available here yet.';
    wrap.appendChild(empty);
    wrap.appendChild(back);
    stage.appendChild(wrap);
    focusStage();
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'opportunity-grid';

  for (const opportunity of opportunities) {
    const entry = document.createElement('button');
    entry.className = 'opportunity-card';
    entry.type = 'button';
    entry.setAttribute('aria-label', `Open ${opportunity.title || 'opportunity record'}; status ${getOpportunityStatus(opportunity)}`);

    const organization = document.createElement('span');
    organization.className = 'opportunity-card-organization';
    organization.textContent = opportunity.organization || '';
    if (organization.textContent) entry.appendChild(organization);

    const title = document.createElement('span');
    title.className = 'opportunity-card-title';
    title.textContent = opportunity.title || opportunity.path.replace(/^opportunities\//, '').replace('.md', '');
    entry.appendChild(title);

    if (opportunity.summary) {
      const summary = document.createElement('span');
      summary.className = 'opportunity-card-summary';
      summary.textContent = opportunity.summary;
      entry.appendChild(summary);
    }

    const metadata = [
      ['Location', opportunity.location],
      ['Work arrangement', opportunity.workArrangement],
      ['Employment type', opportunity.employmentArrangement || opportunity.opportunityType],
      ['Compensation', opportunity.compensation],
      ['Status', opportunityStatuses.includes(opportunity.status) && opportunity.status !== 'Unverified' ? opportunity.status : null]
    ].filter(([, value]) => value);
    if (metadata.length) {
      const details = document.createElement('dl');
      details.className = 'opportunity-card-metadata';
      for (const [label, value] of metadata) {
        const row = document.createElement('div');
        const term = document.createElement('dt');
        term.textContent = label;
        const description = document.createElement('dd');
        description.textContent = value;
        row.append(term, description);
        details.appendChild(row);
      }
      entry.appendChild(details);
    }

    const action = document.createElement('span');
    action.className = 'opportunity-card-action';
    action.textContent = 'View opportunity →';
    entry.appendChild(action);

    entry.addEventListener('click', () => setState({ view: 'content', selected: opportunity.path }));
    grid.appendChild(entry);
  }

  wrap.appendChild(grid);
  wrap.appendChild(back);
  stage.appendChild(wrap);
  focusStage();
}

// Show projects list
async function showProjectsList() {
  const data = await loadManifest();
  if (state.view !== 'projects') return;
  setStageBusy(false);
  stage.classList.remove('stage-opportunities');
  const projects = data.items.filter(i => i.path.startsWith('projects/') && !i.parent);

  stage.innerHTML = '';
  const wrap = document.createElement('section');
  wrap.className = 'archive-view projects-view';
  wrap.innerHTML = `
    <header class="view-heading">
      <p class="kicker">Engineering evidence <span aria-hidden="true">—</span> 03</p>
      <h1>Projects, examined.</h1>
      <p>Open a record to move from the surface into its supporting material.</p>
    </header>
  `;

  if (projects.length === 0) {
    wrap.insertAdjacentHTML('beforeend', '<p class="empty-state">No project records are available.</p>');
    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'return-link';
    back.innerHTML = '<span aria-hidden="true">←</span> Return to index';
    back.addEventListener('click', () => setState({ view: 'topics' }));
    wrap.appendChild(back);
    stage.appendChild(wrap);
    focusStage();
    return;
  }

  const list = document.createElement('div');
  list.className = 'archive-list project-list';

  for (const [index, p] of projects.entries()) {
    const d = document.createElement('button');
    d.className = 'archive-entry';
    d.type = 'button';
    d.setAttribute('aria-label', `Open ${p.title || 'project record'}`);

    const number = document.createElement('span');
    number.className = 'entry-number';
    number.textContent = String(index + 1).padStart(2, '0');
    number.setAttribute('aria-hidden', 'true');
    d.appendChild(number);

    const copy = document.createElement('span');
    copy.className = 'entry-copy';
    const h = document.createElement('span');
    h.className = 'entry-title';
    h.textContent = p.title || p.path.replace(/^projects\//, '').replace('.md', '');
    copy.appendChild(h);

    const pmuted = document.createElement('span');
    pmuted.className = 'entry-summary';
    pmuted.textContent = p.summary || '';
    copy.appendChild(pmuted);
    d.appendChild(copy);

    const arrow = document.createElement('span');
    arrow.className = 'entry-arrow';
    arrow.textContent = '→';
    arrow.setAttribute('aria-hidden', 'true');
    d.appendChild(arrow);

    d.addEventListener('click', () => {
      setState({ view: 'content', selected: p.path });
    });

    list.appendChild(d);
  }

  const back = document.createElement('button');
  back.type = 'button';
  back.innerHTML = '<span aria-hidden="true">←</span> Return to index';
  back.className = 'return-link';
  back.addEventListener('click', () => setState({ view: 'topics' }));
  wrap.appendChild(list);
  wrap.appendChild(back);
  stage.appendChild(wrap);
  focusStage();
}

// Load and display content
async function openContent(path) {
  if (!path) return;

  const isCurrentSelection = () => state.view === 'content' && state.selected === path;

  // Check cache first
  if (contentCache[path]) {
    if (isCurrentSelection()) displayContent(contentCache[path], path);
    return;
  }

  setStageBusy(true);
  stage.innerHTML = '<div class="loading-state"><p class="kicker">Opening record</p><p>Reading from the archive…</p></div>';

  try {
    const res = await fetch(contentUrl(path));
    if (!res.ok) throw new Error('Not found');
    const md = await res.text();
    contentCache[path] = md; // Cache
    if (isCurrentSelection()) displayContent(md, path);
  } catch (e) {
    if (!isCurrentSelection()) return;
    setStageBusy(false);
    stage.innerHTML = '<div class="loading-state"><p class="kicker">Record unavailable</p><p>Content could not be loaded.</p></div>';
    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'return-link';
    back.innerHTML = '<span aria-hidden="true">←</span> Return';
    back.addEventListener('click', () => navigateBack(path));
    stage.appendChild(back);
    focusStage({ resetScroll: true });
  }
}

// Display content with back button
function navigateBack(path) {
  const item = manifest && manifest.items.find(i => i.path === path);
  if (item && item.parent) {
    setState({ view: 'content', selected: item.parent });
  } else if (item && item.kind === 'opportunity') {
    setState({ view: 'opportunities', selected: null });
  } else if (path && path.startsWith('projects/')) {
    setState({ view: 'projects', selected: null });
  } else {
    setState({ view: 'topics', selected: null });
  }
}

function displayContent(md, path) {
  setStageBusy(false);
  stage.innerHTML = '';
  const record = manifest && manifest.items.find(item => item.path === path);
  const isOpportunity = record?.kind === 'opportunity';
  stage.classList.toggle('stage-opportunities', isOpportunity);

  if (isOpportunity) {
    displayOpportunityContent(md, record, path);
    return;
  }

  const div = document.createElement('article');
  div.className = 'document content';
  div.innerHTML = mdToHtml(md);

  const title = div.querySelector('h1');
  if (title) title.classList.add('document-title');
  const meta = document.createElement('p');
  meta.className = 'document-meta';
  meta.textContent = record && record.parent
    ? 'Supporting record'
    : record && record.kind === 'opportunity'
      ? `Opportunity brief · ${getOpportunityStatus(record)}`
      : path.startsWith('projects/')
        ? 'Project record'
        : 'Archive note';
  div.insertBefore(meta, div.firstChild);

  const children = manifest ? manifest.items.filter(i => i.parent === path) : [];
  if (children.length) {
    const navHeading = document.createElement('h2');
    navHeading.className = 'continue-heading';
    navHeading.textContent = 'Continue into the record';
    div.appendChild(navHeading);

    const list = document.createElement('div');
    list.className = 'archive-list child-list';
    for (const [index, child] of children.entries()) {
      const item = document.createElement('button');
      item.className = 'archive-entry';
      item.type = 'button';
      item.setAttribute('aria-label', `Open ${child.title}`);

      const number = document.createElement('span');
      number.className = 'entry-number';
      number.textContent = String(index + 1).padStart(2, '0');
      number.setAttribute('aria-hidden', 'true');
      item.appendChild(number);

      const copy = document.createElement('span');
      copy.className = 'entry-copy';
      const title = document.createElement('span');
      title.className = 'entry-title';
      title.textContent = child.title;
      copy.appendChild(title);

      const summary = document.createElement('span');
      summary.className = 'entry-summary';
      summary.textContent = child.summary || 'Open to read';
      copy.appendChild(summary);
      item.appendChild(copy);

      const arrow = document.createElement('span');
      arrow.className = 'entry-arrow';
      arrow.textContent = '→';
      arrow.setAttribute('aria-hidden', 'true');
      item.appendChild(arrow);

      const open = () => setState({ view: 'content', selected: child.path });
      item.addEventListener('click', open);
      list.appendChild(item);
    }
    div.appendChild(list);
  }

  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'return-link';
  const returnLabel = record && record.parent
    ? 'Return to parent record'
    : record && record.kind === 'opportunity'
      ? 'Return to opportunities'
      : path.startsWith('projects/')
        ? 'Return to projects'
        : 'Return to index';
  back.innerHTML = '<span aria-hidden="true">←</span> ' + returnLabel;
  back.addEventListener('click', () => navigateBack(path));
  div.appendChild(back);

  stage.appendChild(div);
  focusStage({ resetScroll: true });
}

function displayOpportunityContent(md, record, path) {
  const detail = document.createElement('article');
  detail.className = 'opportunity-detail';

  const header = document.createElement('header');
  header.className = 'opportunity-detail-heading';
  const title = document.createElement('h1');
  title.textContent = record.title || path.replace(/^opportunities\//, '').replace('.md', '');
  header.appendChild(title);
  if (record.organization) {
    const organization = document.createElement('p');
    organization.className = 'opportunity-detail-organization';
    organization.textContent = record.organization;
    header.appendChild(organization);
  }
  detail.appendChild(header);

  const metadata = [
    ['Location', record.location],
    ['Eligible countries', record.eligibleCountries],
    ['Work arrangement', record.workArrangement],
    ['Employment type', record.employmentArrangement || record.opportunityType],
    ['Compensation', record.compensation],
    ['Working hours', record.workingHours],
    ['Application deadline', record.deadline],
    ['Status', opportunityStatuses.includes(record.status) && record.status !== 'Unverified' ? record.status : null]
  ].filter(([, value]) => value);
  if (metadata.length) {
    const list = document.createElement('dl');
    list.className = 'opportunity-detail-metadata';
    for (const [label, value] of metadata) {
      const item = document.createElement('div');
      const term = document.createElement('dt');
      term.textContent = label;
      const description = document.createElement('dd');
      description.textContent = value;
      item.append(term, description);
      list.appendChild(item);
    }
    detail.appendChild(list);
  }

  const body = document.createElement('div');
  body.className = 'opportunity-detail-copy';
  const content = md.replace(/^# [^\r\n]*(?:\r?\n+|$)/, '');
  body.innerHTML = mdToHtml(content, { allowExternalLinks: false });
  detail.appendChild(body);

  const applicationUrl = getOpportunityApplicationUrl(record);
  if (applicationUrl) {
    const apply = document.createElement('a');
    apply.className = 'opportunity-apply';
    apply.setAttribute('href', applicationUrl);
    apply.target = '_blank';
    apply.rel = 'noopener noreferrer';
    apply.textContent = "I'm ready to apply — Apply now";
    detail.appendChild(apply);
  } else {
    console.error(`Opportunity "${record.title || path}" is missing a verified application destination.`);
  }

  const back = document.createElement('button');
  back.type = 'button';
  back.className = 'opportunities-back';
  back.textContent = '← Back to opportunities';
  back.addEventListener('click', () => setState({ view: 'opportunities', selected: null }));
  detail.appendChild(back);

  stage.appendChild(detail);
  focusStage({ resetScroll: true });
}

// Escape key resets to initial
stage.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    setState({ view: 'initial' });
  }
});

// Render the declared initial state instead of relying on static fallback markup.
render();
