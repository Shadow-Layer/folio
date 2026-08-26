/* State-driven portfolio interface. No frameworks. Fetches content on demand using /content/manifest.json */

const el = (id) => document.getElementById(id);
const stage = el('stage');
const btnOpen = el('btn-open');

let manifest = null;
let contentCache = {};
let state = { view: 'initial', selected: null };

// Load manifest once, cache content
async function loadManifest() {
  if (manifest) return manifest;
  try {
    const res = await fetch('/content/manifest.json');
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
  stage.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h2>Portfolio</h2>
    <p class="muted">A state-driven, progressively revealing knowledge interface.</p>
    <div class="actions">
      <button id="btn-explore">Explore</button>
    </div>
  `;
  stage.appendChild(card);
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

// Format text with **bold** while preserving HTML safety
function sanitizeAndFormat(text) {
  // Split on ** patterns, capturing the bold sections
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  let html = '';
  
  for (const part of parts) {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Bold section
      const content = part.slice(2, -2);
      const div = document.createElement('div');
      div.textContent = content;
      html += '<strong>' + div.innerHTML + '</strong>';
    } else if (part) {
      // Regular text
      const div = document.createElement('div');
      div.textContent = part;
      html += div.innerHTML;
    }
  }
  
  return html;
}

// Show topics menu
async function showTopics() {
  const data = await loadManifest();
  const topics = [
    { id: 'about', title: 'About / Identity', file: 'about.md' },
    { id: 'projects', title: 'Projects', file: null },
    { id: 'philosophy', title: 'Design Philosophy', file: 'design-philosophy.md' },
    { id: 'research', title: 'Research / Thinking', file: 'research.md' },
    { id: 'contact', title: 'Contact', file: 'contact.md' }
  ];

  stage.innerHTML = '';
  const list = document.createElement('div');
  list.className = 'list';

  for (const t of topics) {
    const d = document.createElement('div');
    d.className = 'item';
    d.tabIndex = 0;

    const h = document.createElement('h3');
    h.textContent = t.title;
    d.appendChild(h);

    const p = document.createElement('p');
    p.className = 'muted';

    if (t.file) {
      const item = data.items.find(i => i.path === t.file);
      p.textContent = item ? (item.summary || 'Open to read') : 'No content';
    } else {
      p.textContent = 'Explore projects';
    }

    d.appendChild(p);

    d.addEventListener('click', () => {
      if (t.id === 'projects') {
        setState({ view: 'projects' });
      } else {
        setState({ view: 'content', selected: t.file });
      }
    });

    d.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') d.click();
    });

    list.appendChild(d);
  }

  stage.appendChild(list);
}

// Show projects list
async function showProjectsList() {
  const data = await loadManifest();
  const projects = data.items.filter(i => i.path.startsWith('projects/'));

  stage.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'content';

  if (projects.length === 0) {
    wrap.innerHTML = '<p class="muted">No projects found.</p>';
    const back = document.createElement('button');
    back.textContent = 'Back';
    back.addEventListener('click', () => setState({ view: 'topics' }));
    wrap.appendChild(back);
    stage.appendChild(wrap);
    return;
  }

  const list = document.createElement('div');
  list.className = 'list';

  for (const p of projects) {
    const d = document.createElement('div');
    d.className = 'item';
    d.tabIndex = 0;

    const h = document.createElement('h3');
    h.textContent = p.title || p.path.replace(/^projects\//, '').replace('.md', '');
    d.appendChild(h);

    const pmuted = document.createElement('p');
    pmuted.className = 'muted';
    pmuted.textContent = p.summary || '';
    d.appendChild(pmuted);

    d.addEventListener('click', () => {
      setState({ view: 'content', selected: p.path });
    });

    d.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') d.click();
    });

    list.appendChild(d);
  }

  stage.appendChild(list);

  const back = document.createElement('button');
  back.textContent = 'Back';
  back.className = 'back-button';
  back.addEventListener('click', () => setState({ view: 'topics' }));
  stage.appendChild(back);
}

// Load and display content
async function openContent(path) {
  if (!path) return;

  // Check cache first
  if (contentCache[path]) {
    displayContent(contentCache[path]);
    return;
  }

  try {
    const res = await fetch('/content/' + path);
    if (!res.ok) throw new Error('Not found');
    const md = await res.text();
    contentCache[path] = md; // Cache
    displayContent(md);
  } catch (e) {
    stage.innerHTML = '<p class="muted">Content could not be loaded.</p>';
    const back = document.createElement('button');
    back.textContent = 'Back';
    back.addEventListener('click', () => setState({ view: 'topics' }));
    stage.appendChild(back);
  }
}

// Display content with back button
function displayContent(md) {
  stage.innerHTML = '';
  const div = document.createElement('div');
  div.className = 'card content';
  div.innerHTML = mdToHtml(md);

  const back = document.createElement('button');
  back.textContent = 'Back';
  back.className = 'back-button';
  back.addEventListener('click', () => setState({ view: 'topics' }));
  div.appendChild(back);

  stage.appendChild(div);
}

// Initial button listener
btnOpen.addEventListener('click', async () => {
  await loadManifest();
  setState({ view: 'topics' });
});

// Escape key resets to initial
stage.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    setState({ view: 'initial' });
  }
});
