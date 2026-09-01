const app = document.getElementById('capital-app');
const base = new URL('./content/', import.meta.url);
const capitalRoot = new URL('./', import.meta.url);
const cache = new Map();
const routes = { home: './', learn: './learn/', opportunities: './opportunities/', 'azizi-venice': './opportunities/azizi-venice/', research: './#research', questions: './#questions', register: './register/' };
let state = { view: 'home' };

if (!document.querySelector('.interest-dock')) {
  const dock = document.createElement('a');
  dock.className = 'interest-dock';
  dock.href = new URL('./register/', capitalRoot);
  dock.setAttribute('aria-label', 'Register interest in Capital');
  dock.innerHTML = 'Interested? <span>Register →</span>';
  document.body.append(dock);
}

const contentUrl = (path) => new URL(path, base).href;
const escapeHtml = (value) => {
  const node = document.createElement('span');
  node.textContent = value;
  return node.innerHTML;
};

function inline(value) {
  const pattern = /\[([^\]]+)\]\(([^\s)]+)\)/g;
  let html = '';
  let last = 0;
  let match;
  while ((match = pattern.exec(value))) {
    html += escapeHtml(value.slice(last, match.index));
    try {
      const url = new URL(match[2], capitalRoot);
      if (!['https:', 'mailto:'].includes(url.protocol)) throw new Error('Unsupported link');
      html += `<a href="${escapeHtml(url.href)}">${escapeHtml(match[1])}</a>`;
    } catch (error) {
      html += escapeHtml(match[0]);
    }
    last = pattern.lastIndex;
  }
  return html + escapeHtml(value.slice(last));
}

function markdown(md) {
  let html = '';
  let inList = false;
  for (const line of md.split(/\r?\n/)) {
    if (line.startsWith('- ')) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${inline(line.slice(2))}</li>`;
      continue;
    }
    if (inList) { html += '</ul>'; inList = false; }
    if (!line.trim()) continue;
    if (line.startsWith('### ')) html += `<h3>${inline(line.slice(4))}</h3>`;
    else if (line.startsWith('## ')) html += `<h2>${inline(line.slice(3))}</h2>`;
    else if (line.startsWith('# ')) html += `<h1>${inline(line.slice(2))}</h1>`;
    else html += `<p>${inline(line)}</p>`;
  }
  return inList ? html + '</ul>' : html;
}

async function readContent(path) {
  if (cache.has(path)) return cache.get(path);
  const response = await fetch(contentUrl(path));
  if (!response.ok) throw new Error('Content unavailable');
  const content = await response.text();
  cache.set(path, content);
  return content;
}

function navigate(view) {
  state = { view };
  history.pushState({ capitalView: view }, '', new URL(routes[view] || routes.home, capitalRoot));
  render();
}

function viewFromLocation() {
  const path = window.location.pathname.replace(/\/$/, '');
  const root = capitalRoot.pathname.replace(/\/$/, '');
  if (path === `${root}/learn`) return 'learn';
  if (path === `${root}/opportunities`) return 'opportunities';
  if (path === `${root}/opportunities/azizi-venice`) return 'azizi-venice';
  if (path === `${root}/register`) return 'register';
  return window.location.hash === '#research' ? 'research' : window.location.hash === '#questions' ? 'questions' : 'home';
}

function action(label, view, secondary = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `capital-button${secondary ? ' secondary' : ''}`;
  button.textContent = label;
  button.addEventListener('click', () => navigate(view));
  return button;
}

function sectionNav() {
  return `<nav class="content-nav" aria-label="Capital sections"><a href="${new URL(routes.learn, capitalRoot).pathname}">Learn</a><a href="${new URL(routes.opportunities, capitalRoot).pathname}">Opportunities</a><a href="${new URL(routes.research, capitalRoot).href}">Research</a><a href="${new URL(routes.register, capitalRoot).pathname}">Register interest</a></nav>`;
}

function renderHome() {
  app.innerHTML = `
    <div class="capital-view">
      <section class="capital-hero" aria-labelledby="capital-title">
        <div>
          <p class="eyebrow">CAPITAL</p>
          <h1 id="capital-title">Understand.<br>Explore.<br>Participate.</h1>
          <p class="hero-deck">A simple way to discover property and business investment opportunities, understand how they work, and register your interest.</p>
          <p class="affiliation">Independent exploration of investment opportunities. Any opportunity relationship is identified and verified at the research stage.</p>
          <div class="hero-actions" id="hero-actions"></div>
          <p class="scroll-note">↓ Begin with curiosity</p>
        </div>
      </section>

      <section class="capital-section path-section" aria-labelledby="paths-title">
        <div class="section-heading"><p class="section-index">00 / THE GATEWAY</p><h2 id="paths-title">Understand. Explore. Participate.</h2></div>
        <div class="path-grid">
          <article class="path-card"><p class="path-number">01</p><p class="eyebrow">LEARN</p><h3>Understand investment before you commit.</h3><button class="capital-button" type="button" data-route="learn">Explore learning →</button></article>
          <article class="path-card"><p class="path-number">02</p><p class="eyebrow">OPPORTUNITIES</p><h3>See what's currently available.</h3><button class="capital-button" type="button" data-route="opportunities">View opportunities →</button></article>
          <article class="path-card"><p class="path-number">03</p><p class="eyebrow">INVEST</p><h3>Interested in participating?</h3><button class="capital-button" type="button" data-route="register">Register interest →</button></article>
        </div>
      </section>

      <section class="capital-section" aria-labelledby="opportunities-title">
        <div class="section-heading"><p class="section-index">01 / CURRENTLY EXPLORING</p><h2 id="opportunities-title">Opportunities</h2><p>Research subjects, not recommendations. Start with the shape of an opportunity before looking for an answer.</p></div>
        <div class="opportunity-grid">
          <article class="opportunity opportunity-feature"><p class="eyebrow">CASE STUDY / 001</p><h3>Azizi Venice</h3><p>Dubai · Property</p><p class="opportunity-meta">Available through our partner network. Source material and current opportunity details remain pending verification.</p><button class="capital-button" type="button" data-route="azizi-venice">Explore opportunity →</button></article>
          <article class="opportunity"><p class="eyebrow">COMING SOON</p><h3>Business</h3><p>No opportunity published yet.</p></article>
          <article class="opportunity"><p class="eyebrow">COMING SOON</p><h3>Property</h3><p>No opportunity published yet.</p></article>
        </div>
        <div class="section-actions" id="opportunity-actions"></div>
      </section>

      <section class="dream-band" aria-label="Dream to numbers transition"><p>Beautiful.<br><span>But that's not the question.</span></p></section>

      <section class="numbers-intro" aria-labelledby="numbers-title"><p class="section-index">02 / UNDERSTANDING</p><h2 id="numbers-title">The question is whether the opportunity makes sense.</h2><p>Here, the dream becomes assumptions, structures, timelines, and open questions.</p></section>

      <section class="capital-section" id="research" aria-labelledby="research-title"><div class="section-heading"><p class="section-index">03 / METHOD</p><h2 id="research-title">Research before conclusion.</h2><p>Facts, source claims, interpretations, assumptions, and open questions stay distinct.</p></div><div class="section-actions" id="research-actions"></div></section>

      <section class="capital-section" aria-labelledby="simulation-title"><div class="section-heading"><p class="section-index">04 / ILLUSTRATIVE MODEL</p><h2 id="simulation-title">Participation, as arithmetic.</h2><p>This illustrative simulation demonstrates how a nominal target can be divided by an illustrative contribution. It is not a fundraising campaign or ownership structure.</p></div><div class="simulation"><form class="simulation-form" id="simulation-form"><label for="target">Illustrative target capital<input id="target" name="target" type="number" min="1" step="1" value="1000000"></label><label for="contribution">Illustrative average contribution<input id="contribution" name="contribution" type="number" min="1" step="0.01" value="2500"></label></form><div class="simulation-result"><span class="data-label">Estimated participants</span><output class="result-number" id="participant-result" for="target contribution">400</output><p class="simulation-note">Illustrative simulation. Arithmetic only — not an actual opportunity, offer, or expected return.</p></div></div></section>

      <section class="capital-section" aria-labelledby="dashboard-title"><div class="section-heading"><p class="section-index">05 / TRANSPARENCY MODEL</p><h2 id="dashboard-title">What could transparent reporting look like?</h2><p>CONCEPT / DEMONSTRATION · ILLUSTRATIVE PROJECT VIEW</p></div><div class="metric-grid"><div class="metric"><span class="data-label">Funding target</span><strong>$1,000,000</strong><small>Example project</small></div><div class="metric"><span class="data-label">Illustrative committed</span><strong>$780,000</strong><small>Demo data</small></div><div class="metric"><span class="data-label">Illustrative remaining</span><strong>$220,000</strong><small>Demo data</small></div><div class="metric"><span class="data-label">Project status</span><strong>●</strong><small>Conceptual lifecycle</small></div></div><p class="simulation-note">These values are demonstration-only and do not describe Azizi Venice, a live project, or actual investor data.</p></section>

      <section class="capital-section" aria-labelledby="progress-title"><div class="section-heading"><p class="section-index">06 / PROGRESS</p><h2 id="progress-title">A project has a shape in time.</h2><p>Illustrative project lifecycle — neutral labels, no claim about a real development.</p></div><div class="timeline"><div class="timeline-item"><span>✓</span><strong>Land / acquisition</strong></div><div class="timeline-item"><span>✓</span><strong>Planning</strong></div><div class="timeline-item"><span>●</span><strong>Construction</strong></div><div class="timeline-item"><span>○</span><strong>Completion</strong></div></div></section>

      <section class="capital-section" id="questions" aria-labelledby="questions-title"><div class="section-heading"><p class="section-index">07 / DUE DILIGENCE</p><h2 id="questions-title">Questions before capital.</h2><p>The strongest signal is often the question that has not been answered yet.</p></div><div class="section-actions" id="question-actions"></div></section>

      <section class="capital-section" id="interest" aria-labelledby="interest-title"><div class="section-heading"><p class="section-index">08 / STAY CLOSE</p><h2 id="interest-title">Follow the research.</h2><p class="interest-note">If you want to explore property, business, or the research itself, register interest through the existing contact route. No financial details are requested or collected.</p></div><div class="section-actions"><a class="capital-link" href="mailto:aphiri1658@gmail.com?subject=Alvin%20%2F%20Capital%20research">Register interest</a></div></section>

      <section class="capital-section final-section" aria-labelledby="final-title"><p class="eyebrow">ALVIN / CAPITAL</p><h2 id="final-title">Capital shouldn't be mysterious.</h2><p class="hero-deck">I'm building a better way to explore investment opportunities — starting with understanding them properly.</p><div class="hero-actions" id="final-actions"></div></section>
    </div>`;
  document.getElementById('hero-actions').append(action('Explore opportunities', 'opportunities'));
  document.getElementById('hero-actions').append(action("I'm interested", 'register', true));
  document.getElementById('opportunity-actions').append(action('Explore opportunity research →', 'opportunities'));
  document.getElementById('research-actions').append(action('Open research method →', 'research'));
  document.getElementById('question-actions').append(action('Open questions →', 'questions'));
  document.getElementById('final-actions').append(action('Explore opportunities', 'opportunities'));
  document.getElementById('final-actions').append(action('Register interest', 'register', true));
  app.querySelectorAll('[data-route]').forEach((control) => control.addEventListener('click', () => navigate(control.dataset.route)));
  bindSimulation();
}

function bindSimulation() {
  const form = document.getElementById('simulation-form');
  const output = document.getElementById('participant-result');
  const update = () => {
    const target = Number(form.target.value);
    const contribution = Number(form.contribution.value);
    output.textContent = Number.isFinite(target) && Number.isFinite(contribution) && target > 0 && contribution > 0
      ? Math.ceil(target / contribution).toLocaleString()
      : '—';
  };
  form.addEventListener('input', update);
}

async function renderContent(view) {
  const records = { learn: ['Learn Capital', 'learn/index.md'], opportunities: ['Opportunities', 'opportunities/index.md'], 'azizi-venice': ['Azizi Venice', 'opportunities/azizi-venice.md'], research: ['Research', 'research/index.md'], 'case-study': ['Case Studies', 'case-studies/index.md'], questions: ['Questions Before Capital', 'questions/index.md'], register: ['Register Interest', 'register/index.md'] };
  const record = records[view];
  if (!record) return renderHome();
  app.innerHTML = `<div class="capital-view"><section class="capital-section content-panel"><p class="eyebrow">ALVIN / CAPITAL</p><div class="loading">Reading the research…</div></section></div>`;
  try {
    const md = await readContent(record[1]);
    if (state.view !== view) return;
    const panel = app.querySelector('.content-panel');
    panel.innerHTML = `${sectionNav()}<p class="eyebrow">ALVIN / CAPITAL · ${escapeHtml(record[0])}</p>${markdown(md)}<div class="content-actions"><button class="capital-button return-link" type="button">← Return to Capital</button>${view === 'learn' ? '<button class="capital-button" type="button" data-next="opportunities">Explore opportunities →</button>' : ''}</div>`;
    panel.querySelector('.return-link').addEventListener('click', () => navigate('home'));
    panel.querySelector('[data-next]')?.addEventListener('click', (event) => navigate(event.currentTarget.dataset.next));
  } catch (error) {
    if (state.view !== view) return;
    app.querySelector('.content-panel').innerHTML = '<p class="eyebrow">RECORD UNAVAILABLE</p><p>That research record could not be opened.</p><button class="capital-button return-link" type="button">← Return to Capital</button>';
    app.querySelector('.return-link').addEventListener('click', () => navigate('home'));
  }
}

function render() {
  if (state.view === 'home') {
    renderHome();
    return;
  }
  renderContent(state.view);
}

window.addEventListener('popstate', () => {
  state = { view: viewFromLocation() };
  render();
});

state.view = viewFromLocation();
render();
