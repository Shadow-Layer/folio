const app = document.getElementById('capital-app');
const base = new URL('./content/', import.meta.url);
const cache = new Map();
let state = { view: 'home' };

const contentUrl = (path) => new URL(path, base).href;
const escapeHtml = (value) => {
  const node = document.createElement('span');
  node.textContent = value;
  return node.innerHTML;
};

function markdown(md) {
  let html = '';
  let inList = false;
  for (const line of md.split(/\r?\n/)) {
    if (line.startsWith('- ')) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${escapeHtml(line.slice(2))}</li>`;
      continue;
    }
    if (inList) { html += '</ul>'; inList = false; }
    if (!line.trim()) continue;
    if (line.startsWith('### ')) html += `<h3>${escapeHtml(line.slice(4))}</h3>`;
    else if (line.startsWith('## ')) html += `<h2>${escapeHtml(line.slice(3))}</h2>`;
    else if (line.startsWith('# ')) html += `<h1>${escapeHtml(line.slice(2))}</h1>`;
    else html += `<p>${escapeHtml(line)}</p>`;
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
  history.pushState({ capitalView: view }, '', view === 'home' ? './' : `#${view}`);
  render();
}

function action(label, view, secondary = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `capital-button${secondary ? ' secondary' : ''}`;
  button.textContent = label;
  button.addEventListener('click', () => navigate(view));
  return button;
}

function renderHome() {
  app.innerHTML = `
    <div class="capital-view">
      <section class="capital-hero" aria-labelledby="capital-title">
        <div>
          <p class="eyebrow">ALVIN / CAPITAL</p>
          <h1 id="capital-title">What if investing didn't<br>start with millions?</h1>
          <p class="hero-deck">Explore property and business opportunities. Understand the numbers. Follow the progress. Decide for yourself.</p>
          <div class="hero-actions" id="hero-actions"></div>
          <p class="scroll-note">↓ Begin with curiosity</p>
        </div>
      </section>

      <section class="capital-section" aria-labelledby="opportunities-title">
        <div class="section-heading"><p class="section-index">01 / DISCOVERY</p><h2 id="opportunities-title">What are people building?</h2><p>Research subjects, not recommendations. Start with the shape of an opportunity before looking for an answer.</p></div>
        <div class="opportunity-grid">
          <article class="opportunity"><p class="eyebrow">SUBJECT / 001</p><h3>Property</h3><p>Places, use, ownership, construction, and the assumptions around value.</p></article>
          <article class="opportunity"><p class="eyebrow">SUBJECT / 002</p><h3>Business</h3><p>Products, operations, customers, margins, and the work required to make an idea durable.</p></article>
          <article class="opportunity"><p class="eyebrow">SUBJECT / 003</p><h3>Development</h3><p>How a plan moves from land and approvals to a built environment.</p></article>
        </div>
        <div class="section-actions" id="opportunity-actions"></div>
      </section>

      <section class="dream-band" aria-label="Dream to numbers transition"><p>Beautiful.<br><span>But that's not the question.</span></p></section>

      <section class="numbers-intro" aria-labelledby="numbers-title"><p class="section-index">02 / UNDERSTANDING</p><h2 id="numbers-title">The question is whether the opportunity makes sense.</h2><p>Here, the dream becomes assumptions, structures, timelines, and open questions.</p></section>

      <section class="capital-section" aria-labelledby="research-title"><div class="section-heading"><p class="section-index">03 / METHOD</p><h2 id="research-title">Research before conclusion.</h2><p>Facts, source claims, interpretations, assumptions, and open questions stay distinct.</p></div><div class="section-actions" id="research-actions"></div></section>

      <section class="capital-section" aria-labelledby="simulation-title"><div class="section-heading"><p class="section-index">04 / CONCEPTUAL MODEL</p><h2 id="simulation-title">Participation, as arithmetic.</h2><p>This illustrative simulation demonstrates how a nominal target can be divided by an illustrative contribution. It is not a fundraising campaign or ownership structure.</p></div><div class="simulation"><form class="simulation-form" id="simulation-form"><label for="target">Illustrative target capital<input id="target" name="target" type="number" min="1" step="1" value="1000000"></label><label for="contribution">Illustrative average contribution<input id="contribution" name="contribution" type="number" min="1" step="0.01" value="2500"></label></form><div class="simulation-result"><span class="data-label">Estimated participants</span><output class="result-number" id="participant-result" for="target contribution">400</output><p class="simulation-note">Illustrative simulation. Arithmetic only — not an actual opportunity, offer, or expected return.</p></div></div></section>

      <section class="capital-section" aria-labelledby="dashboard-title"><div class="section-heading"><p class="section-index">05 / TRANSPARENCY MODEL</p><h2 id="dashboard-title">What could transparent reporting look like?</h2><p>DEMO DATA · ILLUSTRATIVE MODEL</p></div><div class="metric-grid"><div class="metric"><span class="data-label">Funding target</span><strong>$1,000,000</strong><small>Example project</small></div><div class="metric"><span class="data-label">Illustrative committed</span><strong>$780,000</strong><small>Demo data</small></div><div class="metric"><span class="data-label">Illustrative remaining</span><strong>$220,000</strong><small>Demo data</small></div><div class="metric"><span class="data-label">Project status</span><strong>●</strong><small>Conceptual lifecycle</small></div></div><p class="simulation-note">These values are demonstration-only and do not describe Azizi Venice, a live project, or actual investor data.</p></section>

      <section class="capital-section" aria-labelledby="progress-title"><div class="section-heading"><p class="section-index">06 / PROGRESS</p><h2 id="progress-title">A project has a shape in time.</h2><p>Illustrative project lifecycle — neutral labels, no claim about a real development.</p></div><div class="timeline"><div class="timeline-item"><span>✓</span><strong>Land / acquisition</strong></div><div class="timeline-item"><span>✓</span><strong>Planning</strong></div><div class="timeline-item"><span>●</span><strong>Construction</strong></div><div class="timeline-item"><span>○</span><strong>Completion</strong></div></div></section>

      <section class="capital-section" aria-labelledby="questions-title"><div class="section-heading"><p class="section-index">07 / DUE DILIGENCE</p><h2 id="questions-title">Questions before capital.</h2><p>The strongest signal is often the question that has not been answered yet.</p></div><div class="section-actions" id="question-actions"></div></section>

      <section class="capital-section" id="interest" aria-labelledby="interest-title"><div class="section-heading"><p class="section-index">08 / STAY CLOSE</p><h2 id="interest-title">Follow the research.</h2><p class="interest-note">If you want to explore property, business, or the research itself, register interest through the existing contact route. No financial details are requested or collected.</p></div><div class="section-actions"><a class="capital-link" href="mailto:aphiri1658@gmail.com?subject=Alvin%20%2F%20Capital%20research">Register interest</a></div></section>

      <section class="capital-section final-section" aria-labelledby="final-title"><p class="eyebrow">ALVIN / CAPITAL</p><h2 id="final-title">Capital shouldn't be mysterious.</h2><p class="hero-deck">I'm building a better way to explore investment opportunities — starting with understanding them properly.</p><div class="hero-actions" id="final-actions"></div></section>
    </div>`;
  document.getElementById('hero-actions').append(action('Explore opportunities', 'opportunities'));
  document.getElementById('hero-actions').append(action("I'm interested", 'interest', true));
  document.getElementById('opportunity-actions').append(action('Explore opportunity research →', 'opportunities'));
  document.getElementById('research-actions').append(action('Open research method →', 'research'));
  document.getElementById('question-actions').append(action('Open questions →', 'questions'));
  document.getElementById('final-actions').append(action('Explore opportunities', 'opportunities'));
  document.getElementById('final-actions').append(action('Register interest', 'interest', true));
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
  const records = { opportunities: ['Opportunities', 'opportunities/index.md'], research: ['Research', 'research/index.md'], 'case-study': ['Case Studies', 'case-studies/index.md'], questions: ['Questions Before Capital', 'questions/index.md'] };
  const record = records[view];
  if (!record) return renderHome();
  app.innerHTML = `<div class="capital-view"><section class="capital-section content-panel"><p class="eyebrow">ALVIN / CAPITAL</p><div class="loading">Reading the research…</div></section></div>`;
  try {
    const md = await readContent(record[1]);
    if (state.view !== view) return;
    const panel = app.querySelector('.content-panel');
    panel.innerHTML = `<p class="eyebrow">ALVIN / CAPITAL · ${escapeHtml(record[0])}</p>${markdown(md)}<button class="capital-button return-link" type="button">← Return to Capital</button>`;
    panel.querySelector('.return-link').addEventListener('click', () => navigate('home'));
  } catch (error) {
    if (state.view !== view) return;
    app.querySelector('.content-panel').innerHTML = '<p class="eyebrow">RECORD UNAVAILABLE</p><p>That research record could not be opened.</p><button class="capital-button return-link" type="button">← Return to Capital</button>';
    app.querySelector('.return-link').addEventListener('click', () => navigate('home'));
  }
}

function render() {
  if (state.view === 'home' || state.view === 'interest') {
    renderHome();
    if (state.view === 'interest') document.getElementById('interest').scrollIntoView({ block: 'start' });
    return;
  }
  renderContent(state.view);
}

window.addEventListener('popstate', () => {
  state = { view: window.location.hash.slice(1) || 'home' };
  render();
});

state.view = window.location.hash.slice(1) || 'home';
render();
