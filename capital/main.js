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
         <h1 id="capital-title">I'm studying investment.</h1>
         <p class="hero-deck">I'm learning how property, business and capital work — and exploring better ways to understand investment opportunities.</p>
         <p class="affiliation">Investment opportunities are accessed through my partner network.</p>
         <div class="hero-actions" id="hero-actions"></div>
         <p class="scroll-note">↓ Choose your path</p>
       </div>
     </section>

     <section class="capital-section path-section" aria-labelledby="paths-title">
       <div class="path-grid">
         <article class="path-card"><p class="path-number">01</p><p class="eyebrow">LEARN</p><h3>Join with me.</h3><p class="path-description">Learn investment fundamentals through Astra Terra, a community for understanding property, business and capital together.</p><button class="capital-button" type="button" data-route="register">Join Astra Terra →</button></article>
         <article class="path-card"><p class="path-number">02</p><p class="eyebrow">INVEST</p><h3>Explore opportunities.</h3><p class="path-description">Discover opportunities I'm currently researching and book an appointment if you'd like to learn more or invest.</p><button class="capital-button" type="button" data-route="opportunities">Explore opportunities →</button></article>
       </div>
     </section>

     <section class="capital-section" aria-labelledby="opportunity-title">
       <div class="section-heading"><p class="section-index">CURRENT OPPORTUNITY</p><h2 id="opportunity-title">Azizi Venice</h2><p>Dubai · Property</p></div>
       <div class="opportunity-card-simple"><p class="opportunity-meta">A property opportunity I'm currently exploring. Interested in this opportunity?</p><button class="capital-button" type="button" data-route="azizi-venice">Explore details →</button></div>
     </section>

     <section class="capital-section closing-section" aria-labelledby="final-title"><p class="eyebrow">ALVIN / CAPITAL</p><h2 id="final-title">I'm not an investment adviser or fund manager.</h2><p class="affiliation">I'm a researcher exploring investment opportunities and learning how to present them better.</p></section>
   </div>`;
  document.getElementById('hero-actions').append(action('Join Astra Terra →', 'register'));
  document.getElementById('hero-actions').append(action('Explore opportunities →', 'opportunities', true));
  app.querySelectorAll('[data-route]').forEach((control) => control.addEventListener('click', () => navigate(control.dataset.route)));
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
