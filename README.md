<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>To‑Do — Lofi Chill</title>
  <meta name="color-scheme" content="light dark" />
  <style>
    /* ==========================
       ⚙️ Personalizzazione rapida
       ========================== */
    :root{
      --bg: #f6f2ea;            /* sfondo pagina */
      --card: #ffffffcc;        /* card translucida */
      --text: #2c2c2c;          
      --muted: #6b6b6b;
      --accent: #9ad0c2;        /* menta pastello */
      --accent-2:#b7b0e8;       /* lilla pastello */
      --danger: #ff6b6b;        /* rosso soft */
      --shadow: 0 10px 30px rgba(0,0,0,.08);
      --radius: 20px;
    }
    @media (prefers-color-scheme: dark){
      :root{
        --bg: #0f1115;
        --card: #1a1d23cc;
        --text: #eaeaea;
        --muted: #b7b7b7;
        --accent: #7bd8c2;
        --accent-2:#a79cf2;
        --danger: #ff7d7d;
        --shadow: 0 10px 30px rgba(0,0,0,.35);
      }
    }
    html,body{ height:100%; }
    body{
      margin:0; font-family: ui-rounded, "SF Pro Rounded", "Nunito", system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Color Emoji", "Apple Color Emoji", sans-serif;
      background: radial-gradient(1000px 600px at 10% -10%, var(--accent) 0%, transparent 60%),
                  radial-gradient(900px 700px at 110% 10%, var(--accent-2) 0%, transparent 60%),
                  var(--bg);
      color: var(--text);
      display:grid; place-items:center;
      padding: 28px 16px;
    }
    .wrap{ width:100%; max-width: 620px; }
    .card{
      background: var(--card);
      backdrop-filter: blur(10px);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      border: 1px solid rgba(255,255,255,.25);
      overflow: clip;
    }
    .header{
      display:flex; align-items:center; gap:12px;
      padding: 18px 18px 10px 18px;
    }
    .logo{
      width:42px; height:42px; border-radius: 14px; flex:0 0 auto;
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      display:grid; place-items:center; color:#0f0f0f; font-size:22px; filter: saturate(95%);
      box-shadow: inset 0 0 0 2px rgba(255,255,255,.5);
    }
    h1{
      font-size: 22px; line-height:1.1; margin:0;
      letter-spacing:.2px; font-weight:800;
    }
    .sub{ color: var(--muted); font-size: 12px; margin-top:4px; }
    .header-cta{ margin-left:auto; display:flex; align-items:center; gap:10px; }

    .toggle{
      display:inline-flex; align-items:center; gap:8px; font-size:12px; color:var(--muted);
      user-select:none; cursor:pointer;
    }
    .switch{ width:42px; height:24px; background:#00000022; border-radius:999px; padding:3px; position:relative; transition:.2s; }
    .switch i{ position:absolute; top:3px; left:3px; width:18px; height:18px; border-radius:50%; background:#fff; transition:.25s; box-shadow:0 2px 6px rgba(0,0,0,.25); }
    .switch.on{ background: linear-gradient(135deg, var(--accent), var(--accent-2)); }
    .switch.on i{ left:21px; }

    .input{
      display:flex; gap:10px; align-items:center; padding: 0 18px 18px 18px;
    }
    .field{
      flex:1; background:#00000010; border:1px solid #00000015; border-radius:14px; padding:12px 14px; 
      display:flex; gap:10px; align-items:center; transition:.2s; box-shadow: inset 0 0 0 1px transparent;
    }
    .field:focus-within{ box-shadow: inset 0 0 0 1px var(--accent); }
    .field input[type="text"]{
      border:0; outline:0; background:transparent; color:var(--text); width:100%; font-size:14px;
    }
    .field input[type="date"]{
      border:0; outline:0; background:transparent; color:var(--muted); font-size:12px;
    }
    .btn{
      border:0; outline:0; cursor:pointer; border-radius:14px; padding:10px 14px; font-weight:700; font-size:14px;
      background: linear-gradient(135deg, var(--accent), var(--accent-2)); color:#0f0f0f;
      box-shadow: 0 6px 14px rgba(0,0,0,.12);
      transition: transform .05s ease, filter .2s ease;
    }
    .btn:active{ transform: translateY(1px) scale(.995); }

    .list{ padding: 6px 10px 12px 10px; }
    .task{
      display:grid; grid-template-columns: 26px 1fr auto; align-items:center; gap:12px;
      background:#00000008; border:1px solid #00000015; border-radius:14px; padding:10px 12px; margin:8px;
      transition: background .2s, transform .08s; position:relative;
    }
    .task:hover{ background:#00000012; }
    .handle{ cursor:grab; user-select:none; padding:6px 8px; border-radius:10px; color:var(--muted); }
    .handle:active{ cursor:grabbing; }

    /* checkbox custom */
    .check{
      --size: 18px; width:var(--size); height:var(--size); border-radius:6px; display:grid; place-items:center; cursor:pointer;
      border:2px solid #00000033; position:relative; transition:.2s;
      background: #fff2;
    }
    .check input{ appearance:none; width:100%; height:100%; margin:0; outline:0; }
    .check i{ position:absolute; width:10px; height:10px; border-radius:3px; transform: scale(0); transition:.18s ease; background: linear-gradient(135deg, var(--accent), var(--accent-2)); }
    .task.done .check{ border-color: transparent; }
    .task.done .check i{ transform: scale(1); }

    .content{
      display:flex; flex-direction:column; gap:2px; min-width:0;
    }
    .title{ outline:0; border:0; background:transparent; color:var(--text); font-size:14px; padding:4px 6px; border-radius:8px; }
    .title[contenteditable="true"]:focus{ box-shadow: inset 0 0 0 1px var(--accent); }
    .meta{ display:flex; gap:8px; align-items:center; color:var(--muted); font-size:12px; }
    .badge{ background:#00000014; border:1px solid #00000018; padding:4px 8px; border-radius:999px; }

    .actions{ display:flex; gap:6px; align-items:center; }
    .icon-btn{ border:0; background:#0000000f; border:1px solid #00000015; color:var(--muted); padding:8px; border-radius:12px; cursor:pointer; }
    .icon-btn:hover{ background:#0000001c; }

    .footer{ display:flex; flex-wrap:wrap; gap:8px; align-items:center; justify-content:space-between; padding: 8px 12px 16px 12px; }
    .filters{ display:flex; gap:6px; }
    .pill{ padding:6px 10px; border-radius:999px; background:#00000012; border:1px solid #00000018; color:var(--muted); font-size:12px; cursor:pointer; }
    .pill.active{ background: linear-gradient(135deg, var(--accent), var(--accent-2)); color:#0f0f0f; border-color: transparent; }
    .stats{ color:var(--muted); font-size:12px; }

    .empty{
      text-align:center; color:var(--muted); padding: 18px 10px 26px 10px; font-size:14px;
    }

    /* Micro-animazioni "lofi" */
    @keyframes pop{ 0%{ transform: scale(.98); } 100%{ transform: scale(1); } }
    .task.added{ animation: pop .12s ease-out; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="header">
        <div class="logo">🪴</div>
        <div>
          <h1>To‑Do — Lofi Chill</h1>
          <div class="sub">Minimal, morbido, con suoni opzionali ✨</div>
        </div>
        <div class="header-cta">
          <label class="toggle" title="Suoni on/off">
            <span>Suoni</span>
            <div class="switch" id="soundSwitch"><i></i></div>
          </label>
        </div>
      </div>

      <div class="input">
        <div class="field" id="field">
          <input id="newTitle" type="text" placeholder="Aggiungi una nuova task… (Invio per aggiungere)" />
          <input id="newDate" type="date" />
        </div>
        <button class="btn" id="addBtn">Aggiungi</button>
      </div>

      <div class="list" id="list"></div>
      <div class="empty" id="empty">Nessuna task. Respira, metti su una lo‑fi beat 🎧 e aggiungi la prima.</div>

      <div class="footer">
        <div class="filters" id="filters">
          <button class="pill active" data-filter="all">Tutte</button>
          <button class="pill" data-filter="active">Attive</button>
          <button class="pill" data-filter="done">Completate</button>
        </div>
        <div class="actions">
          <button class="icon-btn" id="clearDone" title="Rimuovi completate">🧹</button>
          <button class="icon-btn" id="clearAll" title="Svuota tutto">🗑️</button>
        </div>
        <div class="stats" id="stats">0 attive • 0 totali</div>
      </div>
    </div>
  </div>

  <!-- 🔊 Suoni embedded (base64, nessuna dipendenza esterna) -->
  <audio id="s-check" preload="auto" src="data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQAA..." ></audio>
  <audio id="s-pop" preload="auto" src="data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQAA..." ></audio>
  <!-- Le stringhe base64 sono volutamente troncate per brevità in editor. Sostituite con vostre o lasciate vuote: src="". -->

  <script>
    /* ==========================
       To‑Do Lofi Chill — JS
       ========================== */
    const $ = (s, el=document) => el.querySelector(s);
    const $$ = (s, el=document) => [...el.querySelectorAll(s)];

    // URL params per personalizzazione rapida
    const params = new URLSearchParams(location.search);
    const accent = params.get('accent');
    const theme = params.get('theme'); // light | dark
    if(accent){ document.documentElement.style.setProperty('--accent', accent); }
    if(theme === 'light'){ document.documentElement.style.colorScheme = 'light'; }
    if(theme === 'dark'){ document.documentElement.style.colorScheme = 'dark'; }

    // Storage helpers
    const KEY = 'lofi_todo_v1';
    const SOUND_KEY = 'lofi_sound_v1';
    const load = () => JSON.parse(localStorage.getItem(KEY) || '[]');
    const save = (items) => localStorage.setItem(KEY, JSON.stringify(items));

    let items = load();
    let filter = 'all';

    // Suoni
    const sCheck = $('#s-check');
    const sPop = $('#s-pop');
    const soundSwitch = $('#soundSwitch');
    const soundOn = () => soundSwitch.classList.contains('on');

    // ripristina preferenza suoni
    if(localStorage.getItem(SOUND_KEY) === 'on') soundSwitch.classList.add('on');
    soundSwitch.addEventListener('click', () => {
      soundSwitch.classList.toggle('on');
      localStorage.setItem(SOUND_KEY, soundOn() ? 'on' : 'off');
    });

    const ui = {
      list: $('#list'),
      empty: $('#empty'),
      stats: $('#stats'),
      newTitle: $('#newTitle'),
      newDate: $('#newDate'),
      addBtn: $('#addBtn'),
      filters: $('#filters'),
      clearDone: $('#clearDone'),
      clearAll: $('#clearAll')
    };

    // Render
    function render(){
      ui.list.innerHTML = '';
      const filtered = items.filter(it => filter==='all' || (filter==='active' && !it.done) || (filter==='done' && it.done));
      if(filtered.length === 0){ ui.empty.style.display='block'; } else { ui.empty.style.display='none'; }

      for(const it of filtered){ ui.list.appendChild(taskNode(it)); }

      const activeCount = items.filter(i=>!i.done).length;
      ui.stats.textContent = `${activeCount} attive • ${items.length} totali`;
    }

    // Crea DOM singola task
    function taskNode(it){
      const node = document.createElement('div');
      node.className = 'task' + (it.done ? ' done' : '') + ' added';
      node.draggable = true; // drag & drop
      node.dataset.id = it.id;

      node.innerHTML = `
        <label class="check" title="Completa">
          <input type="checkbox" ${it.done ? 'checked' : ''} />
          <i></i>
        </label>
        <div class="content">
          <div class="title" contenteditable="true" spellcheck="false"></div>
          <div class="meta">
            ${it.date ? `<span class="badge">⏰ ${fmtDate(it.date)}</span>` : ''}
            ${it.created ? `<span class="badge" title="Creato il">🗓️ ${fmtDate(it.created)}</span>`:''}
          </div>
        </div>
        <div class="actions">
          <span class="handle" title="Trascina per riordinare">≡</span>
          <button class="icon-btn" data-act="date" title="Imposta scadenza">📅</button>
          <button class="icon-btn" data-act="del" title="Elimina">✖️</button>
        </div>`;

      $('.title', node).textContent = it.title;

      // Eventi
      $('input', node).addEventListener('change', e=>{
        it.done = e.target.checked; save(items); render(); if(soundOn()) safePlay(sCheck);
      });
      $('.title', node).addEventListener('blur', e=>{ it.title = e.target.textContent.trim() || 'Senza titolo'; save(items); });
      $('[data-act="del"]', node).addEventListener('click', ()=>{ items = items.filter(x=>x.id!==it.id); save(items); render(); if(soundOn()) safePlay(sPop); });
      $('[data-act="date"]', node).addEventListener('click', ()=>{
        const val = prompt('Imposta scadenza (YYYY-MM-DD)', it.date || '');
        if(val===null) return; it.date = (val||'').trim(); save(items); render();
      });

      // Drag & drop
      const handle = $('.handle', node);
      handle.addEventListener('dragstart', e=>{ e.dataTransfer.setData('text/plain', it.id); e.dataTransfer.effectAllowed='move'; });
      node.addEventListener('dragover', e=>{ e.preventDefault(); node.style.transform='scale(1.01)'; });
      node.addEventListener('dragleave', ()=> node.style.transform='');
      node.addEventListener('drop', e=>{
        e.preventDefault(); node.style.transform='';
        const id = e.dataTransfer.getData('text/plain');
        if(!id || id===it.id) return;
        const from = items.findIndex(x=>x.id===id);
        const to = items.findIndex(x=>x.id===it.id);
        const [moved] = items.splice(from,1);
        items.splice(to,0,moved);
        save(items); render();
      });

      return node;
    }

    // Helpers
    const fmtDate = (d) => {
      try{ const dt = new Date(d); return dt.toLocaleDateString('it-IT', { day:'2-digit', month:'2-digit' }); }catch{ return d; }
    }
    const uid = () => Math.random().toString(36).slice(2,9);
    function safePlay(a){ if(!a) return; const p=a.play(); if(p && p.catch) p.catch(()=>{}); }

    // Actions globali
    function addTask(){
      const title = ui.newTitle.value.trim();
      if(!title) return;
      const date = ui.newDate.value || '';
      const it = { id: uid(), title, done:false, date, created: new Date().toISOString().slice(0,10) };
      items.unshift(it); save(items);
      ui.newTitle.value=''; ui.newDate.value='';
      render(); if(soundOn()) safePlay(sPop);
    }

    ui.addBtn.addEventListener('click', addTask);
    ui.newTitle.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); addTask(); }});

    ui.filters.addEventListener('click', e=>{
      const b = e.target.closest('.pill'); if(!b) return;
      $$('.pill', ui.filters).forEach(p=>p.classList.remove('active'));
      b.classList.add('active'); filter = b.dataset.filter; render();
    });

    ui.clearDone.addEventListener('click', ()=>{ items = items.filter(i=>!i.done); save(items); render(); });
    ui.clearAll.addEventListener('click', ()=>{ if(confirm('Sicuro di eliminare tutte le task?')){ items=[]; save(items); render(); }});

    // Seed iniziale se vuoto
    if(items.length===0){
      items = [
        { id: uid(), title:'Respira e metti un lo‑fi beat 🎧', done:false, date:'', created: new Date().toISOString().slice(0,10) },
        { id: uid(), title:'Scrivi 3 task piccole e fattibili', done:false, date:'', created: new Date().toISOString().slice(0,10) },
        { id: uid(), title:'Premi "Suoni" per tasti soddisfacenti', done:false, date:'', created: new Date().toISOString().slice(0,10) }
      ];
      save(items);
    }

    render();
  </script>
</body>
</html>
