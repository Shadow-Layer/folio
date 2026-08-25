/* Minimal state-driven interface. No frameworks. Fetches content on demand using /content/manifest.json */
const el = (id)=>document.getElementById(id)
const stage = el('stage')
const btnOpen = el('btn-open')
let manifest = null
let state = { view: 'initial', selected: null }

async function loadManifest(){
  if(manifest) return manifest
  try{
    const res = await fetch('/content/manifest.json')
    manifest = await res.json()
    return manifest
  }catch(e){
    manifest = {items:[]}
    return manifest
  }
}

function setState(next){
  state = Object.assign({}, state, next)
  render()
}

function sanitize(html){
  // tiny sanitizer for this static site
  const div = document.createElement('div')
  div.textContent = html
  return div.innerHTML
}

function mdToHtml(md){
  // very small markdown subset: headings and paragraphs and lists
  const lines = md.split(/\r?\n/)
  let out = ''
  for(let line of lines){
    if(!line.trim()) { out += '<p></p>'; continue }
    if(line.startsWith('#')){
      const m = line.match(/^(#{1,6})\s+(.*)$/)
      if(m) out += `<h${m[1].length}>${sanitize(m[2])}</h${m[1].length}>`
      else out += `<p>${sanitize(line)}</p>`
    } else if(line.startsWith('- ')){
      if(!out.endsWith('</ul>')) out += '<ul>'
      out += `<li>${sanitize(line.slice(2))}</li>`
      if(out.endsWith('</li>')){
        // lookahead not implemented; close ul at end
      }
    } else {
      out += `<p>${sanitize(line)}</p>`
    }
  }
  if(out.includes('<ul>') && !out.includes('</ul>')) out += '</ul>'
  return out
}

async function showTopics(){
  const data = await loadManifest()
  const topics = [
    {id:'about',title:'About / Identity',file:'about.md'},
    {id:'projects',title:'Projects',file:null},
    {id:'philosophy',title:'Design Philosophy',file:'design-philosophy.md'},
    {id:'research',title:'Research / Thinking',file:'research.md'},
    {id:'contact',title:'Contact',file:'contact.md'}
  ]

  stage.innerHTML = ''
  const list = document.createElement('div'); list.className='list'
  for(const t of topics){
    const d = document.createElement('div'); d.className='item'; d.tabIndex=0
    const h = document.createElement('h3'); h.textContent = t.title
    d.appendChild(h)
    const p = document.createElement('p'); p.className='muted'
    if(t.file){
      p.textContent = data.items.find(i=>i.path.endsWith(t.file))? 'Open to read' : 'No content yet — add /content/'+t.file
    } else {
      p.textContent = 'Explore projects' 
    }
    d.appendChild(p)
    d.addEventListener('click',()=>{
      if(t.id==='projects') showProjectsList()
      else openContent(t.file)
    })
    d.addEventListener('keydown',(e)=>{ if(e.key==='Enter') d.click() })
    list.appendChild(d)
  }
  stage.appendChild(list)
}

async function showProjectsList(){
  const data = await loadManifest()
  const projects = data.items.filter(i=>i.path.startsWith('projects/'))
  stage.innerHTML = ''
  const wrap = document.createElement('div')
  wrap.className='content'
  if(projects.length===0){
    wrap.innerHTML = '<p class="muted">No project content found. Add files under /content/projects/ with .md</p>'
    const back = document.createElement('button'); back.textContent='Back'; back.addEventListener('click',showTopics)
    wrap.appendChild(back)
    stage.appendChild(wrap); return
  }
  const list = document.createElement('div'); list.className='list'
  for(const p of projects){
    const d = document.createElement('div'); d.className='item'; d.tabIndex=0
    const h = document.createElement('h3'); h.textContent = p.title || p.name || p.path.replace(/^projects\//,'')
    d.appendChild(h)
    const pmuted = document.createElement('p'); pmuted.className='muted'; pmuted.textContent = p.summary || ''
    d.appendChild(pmuted)
    d.addEventListener('click',()=>openContent(p.path))
    d.addEventListener('keydown',(e)=>{ if(e.key==='Enter') d.click() })
    list.appendChild(d)
  }
  stage.appendChild(list)
}

async function openContent(path){
  if(!path) return
  try{
    const res = await fetch('/content/'+path)
    if(!res.ok) throw new Error('Not found')
    const md = await res.text()
    stage.innerHTML = ''
    const div = document.createElement('div'); div.className='card content'
    div.innerHTML = mdToHtml(md)
    const back = document.createElement('button'); back.textContent='Back'; back.addEventListener('click',()=>setState({view:'topics'}))
    div.appendChild(back)
    stage.appendChild(div)
  }catch(e){
    stage.innerHTML = '<p class="muted">Content could not be loaded.</p>'
  }
}

btnOpen.addEventListener('click',async()=>{ await loadManifest(); setState({view:'topics'}); showTopics() })

// Restore minimal state on load
window.addEventListener('hashchange',()=>{})

// Expose for keyboard navigation
stage.addEventListener('keydown',(e)=>{
  if(e.key==='Escape'){
    stage.innerHTML = '<div class="card"><h2>Identity</h2><p class="muted">No durable \"About\" content found. Click to reveal available knowledge.</p><div class="actions"><button id="btn-open">Explore</button></div></div>'
    document.getElementById('btn-open').addEventListener('click',()=>{ loadManifest(); setState({view:'topics'}); showTopics() })
  }
})
