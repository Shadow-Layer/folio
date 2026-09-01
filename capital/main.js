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
          <h1 id="capital-title">I'm learning how investment works.</h1>
          <p class="hero-deck">I'm studying property, business and collective investment to understand the opportunities, the risks and the systems behind them — while exploring better ways to present investment opportunities to everyday people.</p>
          <p class="affiliation">Investment opportunities are presented through my partner network. I'm not an investment adviser, fund manager, or regulated intermediary — I'm a researcher exploring the field.</p>
          <div class="hero-actions" id="hero-actions"></div>
          <p class="scroll-note">↓ Begin with curiosity</p>
        </div>
      </section>

      <section class="capital-section path-section" aria-labelledby="paths-title">
        <div class="section-heading"><p class="section-index">00 / YOUR JOURNEY</p><h2 id="paths-title">Learn. Explore. Participate.</h2><p>Three clear paths through investment research.</p></div>
        <div class="path-grid">
          <article class="path-card"><p class="path-number">01</p><p class="eyebrow">LEARN</p><h3>Understand investment before you commit.</h3><p class="path-description">Property, business, capital structures, ROI, risk, payment plans — the fundamentals before putting money in.</p><button class="capital-button" type="button" data-route="learn">Explore learning →</button></article>
          <article class="path-card"><p class="path-number">02</p><p class="eyebrow">EXPLORE</p><h3>Examine real opportunities and their structures.</h3><p class="path-description">Study what I'm currently researching: the numbers, assumptions, timelines, and questions that shape a real opportunity.</p><button class="capital-button" type="button" data-route="opportunities">View opportunities →</button></article>
          <article class="path-card"><p class="path-number">03</p><p class="eyebrow">PARTICIPATE</p><h3>Connect when you're ready.</h3><p class="path-description">Register interest to explore an opportunity further or book an appointment with the appropriate investment representative.</p><button class="capital-button" type="button" data-route="register">Register interest →</button></article>
        </div>
      </section>

      <section class="capital-section" aria-labelledby="astra-title">
        <div class="section-heading"><p class="section-index">01 / LEARNING COMMUNITY</p><h2 id="astra-title">Astra Terra</h2><p>A place to learn investment together.</p></div>
        <div class="astra-panel">
          <div class="astra-content">
            <p>I joined Astra Terra, a learning group for people who want to understand property, business and emerging investment opportunities — without pretending to already know everything.</p>
            <p>The tone is humble, investigative and credible. We explore ideas, ask questions, examine assumptions, and learn together.</p>
            <div class="topic-tags">
              <span class="topic-tag">PROPERTY</span>
              <span class="topic-tag">BUSINESS</span>
              <span class="topic-tag">CAPITAL</span>
              <span class="topic-tag">ROI</span>
              <span class="topic-tag">RISK</span>
              <span class="topic-tag">PAYMENT PLANS</span>
              <span class="topic-tag">COLLECTIVE INVESTMENT</span>
            </div>
          </div>
          <div class="section-actions"><a class="capital-link" href="mailto:aphiri1658@gmail.com?subject=Interested%20in%20Astra%20Terra">Join Astra Terra →</a></div>
        </div>
      </section>

      <section class="capital-section" aria-labelledby="opportunities-title">
        <div class="section-heading"><p class="section-index">02 / CURRENTLY EXPLORING</p><h2 id="opportunities-title">Real Opportunities</h2><p>I'm studying these opportunities as part of my investment research.</p></div>
        <div class="opportunity-grid">
          <article class="opportunity opportunity-feature"><p class="eyebrow">CASE STUDY / 001</p><h3>Azizi Venice</h3><p>Dubai · Property</p><p class="opportunity-meta">I'm studying this opportunity as part of my investment research. Source material and current opportunity details remain pending verification. Any investment relationship would be presented through an appropriate partner representative.</p><button class="capital-button" type="button" data-route="azizi-venice">Explore opportunity →</button></article>
          <article class="opportunity"><p class="eyebrow">COMING SOON</p><h3>Business</h3><p>No opportunity published yet.</p></article>
          <article class="opportunity"><p class="eyebrow">COMING SOON</p><h3>Property</h3><p>No opportunity published yet.</p></article>
        </div>
      </section>

      <section class="dream-band" aria-label="Philosophy transition"><p>What if investment<br><span>could be understood first?</span></p></section>

      <section class="numbers-intro" aria-labelledby="philosophy-title"><p class="section-index">03 / EXPLORATION</p><h2 id="philosophy-title">I'm interested in what comes next.</h2><p>What if investment opportunities were easier to understand? What if investors could see the project, capital structure, timeline, payment plan and risks in one place? What if participation didn't require knowing someone already?</p><p>I'm exploring these ideas through Capital.</p></section>

      <section class="capital-section" id="research" aria-labelledby="research-title"><div class="section-heading"><p class="section-index">04 / METHOD</p><h2 id="research-title">Research before conclusion.</h2><p>Facts, source claims, interpretations, assumptions, and open questions stay distinct.</p></div><div class="section-actions" id="research-actions"></div></section>

      <section class="capital-section" aria-labelledby="simulation-title"><div class="section-heading"><p class="section-index">05 / ILLUSTRATIVE MODEL</p><h2 id="simulation-title">Participation, as arithmetic.</h2><p>This illustrative simulation demonstrates how a nominal target can be divided by an illustrative contribution. It is not a fundraising campaign or ownership structure.</p></div><div class="simulation"><form class="simulation-form" id="simulation-form"><label for="target">Illustrative target capital<input id="target" name="target" type="number" min="1" step="1" value="1000000"></label><label for="contribution">Illustrative average contribution<input id="contribution" name="contribution" type="number" min="1" step="0.01" value="2500"></label></form><div class="simulation-result"><span class="data-label">Estimated participants</span><output class="result-number" id="participant-result" for="target contribution">400</output><p class="simulation-note">Illustrative simulation. Arithmetic only — not an actual opportunity, offer, or expected return.</p></div></div></section>

      <section class="capital-section" aria-labelledby="dashboard-title"><div class="section-heading"><p class="section-index">06 / TRANSPARENCY MODEL</p><h2 id="dashboard-title">What could transparent reporting look like?</h2><p>CONCEPT / DEMONSTRATION · ILLUSTRATIVE PROJECT VIEW</p></div><div class="metric-grid"><div class="metric"><span class="data-label">Funding target</span><strong>$1,000,000</strong><small>Example project</small></div><div class="metric"><span class="data-label">Illustrative committed</span><strong>$780,000</strong><small>Demo data</small></div><div class="metric"><span class="data-label">Illustrative remaining</span><strong>$220,000</strong><small>Demo data</small></div><div class="metric"><span class="data-label">Project status</span><strong>●</strong><small>Conceptual lifecycle</small></div></div><p class="simulation-note">These values are demonstration-only and do not describe Azizi Venice, a live project, or actual investor data.</p></section>

      <section class="capital-section" aria-labelledby="progress-title"><div class="section-heading"><p class="section-index">07 / PROGRESS</p><h2 id="progress-title">A project has a shape in time.</h2><p>Illustrative project lifecycle — neutral labels, no claim about a real development.</p></div><div class="timeline"><div class="timeline-item"><span>✓</span><strong>Land / acquisition</strong></div><div class="timeline-item"><span>✓</span><strong>Planning</strong></div><div class="timeline-item"><span>●</span><strong>Construction</strong></div><div class="timeline-item"><span>○</span><strong>Completion</strong></div></div></section>

      <section class="capital-section" id="questions" aria-labelledby="questions-title"><div class="section-heading"><p class="section-index">08 / DUE DILIGENCE</p><h2 id="questions-title">Questions before capital.</h2><p>The strongest signal is often the question that has not been answered yet.</p></div><div class="section-actions" id="question-actions"></div></section>

      <section class="capital-section" id="interest" aria-labelledby="interest-title"><div class="section-heading"><p class="section-index">09 / NEXT STEPS</p><h2 id="interest-title">Where do you want to go?</h2></div><div class="next-steps-grid"><div class="next-step"><p class="eyebrow">LEARN</p><h3>Understand investment fundamentals</h3><p>Join Astra Terra and explore learning resources.</p><button class="capital-button" type="button" data-route="learn">Learn →</button></div><div class="next-step"><p class="eyebrow">EXPLORE</p><h3>Study real opportunities</h3><p>Examine opportunities I'm currently researching.</p><button class="capital-button" type="button" data-route="opportunities">Explore →</button></div><div class="next-step"><p class="eyebrow">PARTICIPATE</p><h3>Interested in an opportunity?</h3><p>Register interest or book an appointment.</p><button class="capital-button" type="button" data-route="register">Register interest →</button></div></div></section>

      <section class="capital-section final-section" aria-labelledby="final-title"><p class="eyebrow">ALVIN / CAPITAL</p><h2 id="final-title">Capital shouldn't be mysterious.</h2><p class="hero-deck">I'm building a better way to explore investment opportunities — starting with understanding them properly.</p><p class="affiliation">Your interest in Capital will be followed up through the appropriate channel. I'm not an investment adviser or fund manager — I'm a researcher exploring how investment information can be presented better.</p></section>
    </div>`;
  document.getElementById('hero-actions').append(action('Join Astra Terra', 'register'));
  document.getElementById('hero-actions').append(action('Book an appointment', 'register', true));
  document.getElementById('research-actions').append(action('Open research method →', 'research'));
  document.getElementById('question-actions').append(action('Open questions →', 'questions'));
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
   
  if (view === 'register') {
    return renderRegisterForm();
  }
   
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

function renderRegisterForm() {
  if (state.view !== 'register') return;
  const panel = app.querySelector('.content-panel');
  panel.innerHTML = `${sectionNav()}<p class="eyebrow">ALVIN / CAPITAL · REGISTER INTEREST</p><h1>Interested?</h1><p class="intro-text">Tell me what you're looking for.</p><form class="register-form" id="register-form"><fieldset class="form-fieldset"><legend class="form-legend">What interests you?</legend><div class="form-options"><label class="form-option"><input type="radio" name="interest" value="property" required> Property</label><label class="form-option"><input type="radio" name="interest" value="business" required> Business</label><label class="form-option"><input type="radio" name="interest" value="both" required> Both</label><label class="form-option"><input type="radio" name="interest" value="learning" required> Just learning</label></div></fieldset><fieldset class="form-fieldset"><legend class="form-legend">Where are you based?</legend><div class="form-options"><label class="form-option"><input type="radio" name="location" value="zimbabwe" required> Zimbabwe</label><label class="form-option"><input type="radio" name="location" value="diaspora" required> Diaspora</label><label class="form-option"><input type="radio" name="location" value="other" required> Other</label></div></fieldset><fieldset class="form-fieldset"><legend class="form-legend">What would you like to do?</legend><div class="form-options"><label class="form-option"><input type="radio" name="intent" value="learn" required> Learn</label><label class="form-option"><input type="radio" name="intent" value="explore" required> Explore opportunities</label><label class="form-option"><input type="radio" name="intent" value="book" required> Book an appointment</label><label class="form-option"><input type="radio" name="intent" value="join-astra" required> Join Astra Terra</label></div></fieldset><fieldset class="form-fieldset"><legend class="form-legend">Your details</legend><label class="form-label">Name<input type="text" name="name" required></label><label class="form-label">Email<input type="email" name="email" required></label><label class="form-label optional">Anything you'd like me to know?<textarea name="message" rows="3"></textarea></label></fieldset><div class="form-footer"><button type="submit" class="capital-button">Register interest →</button><p class="form-note">Your details are used to respond to this enquiry and connect you with the appropriate opportunity or learning path.</p></div></form><div class="content-actions"><button class="capital-button return-link" type="button">← Return to Capital</button></div>`;
   
  const form = panel.querySelector('#register-form');
  const returnBtn = panel.querySelector('.return-link');
   
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleRegisterSubmit(form);
  });
   
  returnBtn.addEventListener('click', () => navigate('home'));
}

function handleRegisterSubmit(form) {
  const data = new FormData(form);
  const interest = data.get('interest');
  const location = data.get('location');
  const intent = data.get('intent');
  const name = data.get('name');
  const email = data.get('email');
  const message = data.get('message');
   
  const subject = 'Alvin / Capital — Interest Registration';
  const body = encodeURIComponent(
    `Interested in: ${interest}\n` +
    `Location: ${location}\n` +
    `Intent: ${intent}\n` +
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    `${message ? `Message: ${message}\n` : ''}\n` +
    `---\n` +
    `Submitted from Capital registration form`
  );
   
  window.location.href = `mailto:aphiri1658@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
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
