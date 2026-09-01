/* State-driven portfolio interface. No frameworks. Fetches content on demand using /content/manifest.json */

const el = (id) => document.getElementById(id);
const stage = el('stage');

let manifest = null;
let contentCache = {};
let state = { view: 'initial', selected: null };
const contentBase = new URL('./content/', import.meta.url);

function contentUrl(path) {
  return new URL(path, contentBase).href;
}

// Load manifest once, cache content
async function loadManifest() {
  if (manifest) return manifest;
  try {
    const res = await fetch(contentUrl('manifest.json'));
    manifest = await res.json();
    return manifest;
  } catch (e) {
    manifest = { items: [] };
    return manifest;
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
    case 'content':
      if (state.selected) openContent(state.selected);
      break;
  }
}

// Initial state
function renderInitial() {
  setStageBusy(false);
  stage.innerHTML = '';
  const opening = document.createElement('section');
  opening.className = 'opening';
  opening.innerHTML = `
    <p class="kicker">Personal knowledge archive <span aria-hidden="true">—</span> 01</p>
    <h1>Alvin Phiri</h1>
    <p class="role">Software Engineer</p>
    <p class="opening-summary">I build full-stack systems across application and infrastructure layers.</p>
    <div class="actions">
      <button id="btn-explore" class="action-link" type="button">Explore the archive <span aria-hidden="true">→</span></button>
    </div>
  `;
  stage.appendChild(opening);

  const capital = document.createElement('section');
  capital.className = 'capital-surface';
  capital.setAttribute('aria-labelledby', 'capital-title');
  capital.innerHTML = `
    <p class="capital-label">ALVIN / CAPITAL</p>
    <h2 id="capital-title">Learning how capital moves.</h2>
    <p class="capital-copy">I'm documenting my journey into property and business investment — the opportunities, the numbers, the structures, and what actually makes an investment worth considering.</p>
    <p class="capital-copy">If you're interested in exploring opportunities with me, leave your details.</p>
    <a class="capital-action" href="./capital/">→ Explore investment</a>
  `;
  stage.appendChild(capital);
  document.getElementById('btn-explore').addEventListener('click', async () => {
    await loadManifest();
    setState({ view: 'topics' });
  });
}

// Sanitize HTML to prevent injection
function sanitize(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

// Simple markdown renderer: h1-h6, paragraphs, lists, bold, code blocks
function mdToHtml(md) {
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
        out += `<h${m[1].length}>${sanitizeAndFormat(m[2])}</h${m[1].length}>`;
      } else {
        out += `<p>${sanitizeAndFormat(line)}</p>`;
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
      out += `<li>${sanitizeAndFormat(line.slice(2))}</li>`;
    }
    // Regular paragraphs
    else {
      if (inList) {
        out += '</ul>';
        inList = false;
      }
      out += `<p>${sanitizeAndFormat(trimmed)}</p>`;
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
function formatLinks(text) {
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
      html += '<a href="' + sanitize(url.href) + '"' +
        (external ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' +
        sanitize(match[1]) + '</a>';
    } catch (e) {
      html += sanitize(match[0]);
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
function sanitizeAndFormat(text) {
  const imageParts = formatImages(text);
  if (imageParts !== text) return imageParts;
  // Split on ** patterns, capturing the bold sections
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  let html = '';
  
  for (const part of parts) {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Bold section
      const content = part.slice(2, -2);
      html += '<strong>' + formatLinks(content) + '</strong>';
    } else if (part) {
      // Regular text
      html += formatLinks(part);
    }
  }
  
  return html;
}

// Show topics menu
async function showTopics() {
  const data = await loadManifest();
  if (state.view !== 'topics') return;
  setStageBusy(false);
  const topics = [
    { id: 'about', title: 'About / Identity', file: 'about.md' },
    { id: 'projects', title: 'Projects', file: null },
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

// Show projects list
async function showProjectsList() {
  const data = await loadManifest();
  if (state.view !== 'projects') return;
  setStageBusy(false);
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
  } else if (path && path.startsWith('projects/')) {
    setState({ view: 'projects', selected: null });
  } else {
    setState({ view: 'topics', selected: null });
  }
}

function displayContent(md, path) {
  setStageBusy(false);
  stage.innerHTML = '';
  const div = document.createElement('article');
  div.className = 'document content';
  div.innerHTML = mdToHtml(md);

  const record = manifest && manifest.items.find(item => item.path === path);
  const title = div.querySelector('h1');
  if (title) title.classList.add('document-title');
  const meta = document.createElement('p');
  meta.className = 'document-meta';
  meta.textContent = record && record.parent ? 'Supporting record' : path.startsWith('projects/') ? 'Project record' : 'Archive note';
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
  back.innerHTML = '<span aria-hidden="true">←</span> ' + (record && record.parent ? 'Return to parent record' : path.startsWith('projects/') ? 'Return to projects' : 'Return to index');
  back.addEventListener('click', () => navigateBack(path));
  div.appendChild(back);

  stage.appendChild(div);
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
