<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>To‑Do — Lofi Chill</title>
  <meta name="color-scheme" content="light dark" />
  <style>
    :root{
      --bg: #f6f2ea;
      --card: #ffffffcc;
      --text: #2c2c2c;
      --muted: #6b6b6b;
      --accent: #9ad0c2;
      --accent-2:#b7b0e8;
      --danger: #ff6b6b;
      --shadow: 0 8px 20px rgba(0,0,0,.08);
      --radius: 16px;
      --scale: 1;
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
        --shadow: 0 8px 22px rgba(0,0,0,.35);
      }
    }

    html,body{ height:100%; }
    body{
      margin:0; font-family: ui-rounded, "SF Pro Rounded", "Nunito", system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, sans-serif;
      background: radial-gradient(800px 500px at 10% -10%, var(--accent) 0%, transparent 60%),
                  radial-gradient(700px 600px at 110% 10%, var(--accent-2) 0%, transparent 60%),
                  var(--bg);
      color: var(--text);
      display:grid; place-items:center;
      padding: 10px;
      transform: scale(var(--scale));
      transform-origin: top center;
    }

    .wrap{ width:100%; max-width: 420px; }
    .card{
      background: var(--card);
      backdrop-filter: blur(8px);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      border: 1px solid rgba(255,255,255,.15);
      overflow: clip;
    }

    h1{
      font-size: 18px;
      margin:0;
      font-weight:700;
    }

    .sub{ color: var(--muted); font-size: 12px; margin-top:2px; }

    .header{
      display:flex; align-items:center; justify-content:space-between;
      padding: 14px;
    }

    .logo{
      width:32px; height:32px; border-radius: 10px; flex:0 0 auto;
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      display:grid; place-items:center; color:#0f0f0f; font-size:18px;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,.5);
    }

    .input{
      display:flex; gap:6px; align-items:center; padding: 0 12px 12px;
    }

    .field{
      flex:1; background:#00000010; border:1px solid #00000015; border-radius:10px; padding:8px;
      display:flex; gap:8px; align-items:center;
    }

    .field input[type="text"]{
      border:0; outline:0; background:transparent; color:var(--text); width:100%; font-size:13px;
    }

    .field input[type="date"]{
      border:0; outline:0; background:transparent; color:var(--muted); font-size:11px;
    }

    .btn{
      border:0; outline:0; cursor:pointer; border-radius:10px; padding:8px 10px; font-weight:600; font-size:12px;
      background: linear-gradient(135deg, var(--accent), var(--accent-2)); color:#0f0f0f;
      box-shadow: 0 3px 6px rgba(0,0,0,.1);
    }

    .list{ padding: 4px 8px 8px; }
    .task{
      display:grid; grid-template-columns: 20px 1fr auto; align-items:center; gap:6px;
      background:#00000008; border:1px solid #00000015; border-radius:10px; padding:6px 8px; margin:6px 0;
    }

    .check{
      --size: 14px; width:var(--size); height:var(--size); border-radius:4px; display:grid; place-items:center; cursor:pointer;
      border:2px solid #00000033; position:relative;
    }

    .check input{ appearance:none; width:100%; height:100%; margin:0; outline:0; }
    .check i{ position:absolute; width:8px; height:8px; border-radius:2px; transform: scale(0); transition:.15s ease; background: linear-gradient(135deg, var(--accent), var(--accent-2)); }
    .task.done .check i{ transform: scale(1); }

    .title{ outline:0; border:0; background:transparent; color:var(--text); font-size:13px; padding:2px 4px; border-radius:6px; }
    .meta{ color:var(--muted); font-size:10px; }

    .footer{
      display:flex; gap:6px; align-items:center; justify-content:space-between;
      padding: 6px 8px 10px;
      font-size:10px; color:var(--muted);
    }

    .filters{ display:flex; gap:4px; }
    .pill{ padding:4px 8px; border-radius:999px; background:#00000012; border:1px solid #00000018; font-size:10px; cursor:pointer; }
    .pill.active{ background: linear-gradient(135deg, var(--accent), var(--accent-2)); color:#0f0f0f; border-color: transparent; }

      /* Scala responsiva/override per Notion */
    body{ zoom: var(--scale); }
    body.compact .wrap{ max-width: 520px; }
    body.compact h1{ font-size:20px; }
    body.compact .btn{ padding:8px 12px; font-size:13px; }
    body.compact .task{ padding:8px 10px; margin:6px; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="header">
        <div style="display:flex;gap:8px;align-items:center;">
          <div class="logo">🪴</div>
          <div>
            <h1>To‑Do — Lofi Chill</h1>
            <div class="sub">Minimal, morbido, con suoni opzionali ✨</div>
          </div>
        </div>
      </div>

      <div class="input">
        <div class="field">
          <input id="newTitle" type="text" placeholder="Aggiungi una nuova task…" />
          <input id="newDate" type="date" />
        </div>
        <button class="btn" id="addBtn">Aggiungi</button>
      </div>

      <div class="list" id="list"></div>
      <div class="footer">
        <div class="filters" id="filters">
          <button class="pill active" data-filter="all">Tutte</button>
          <button class="pill" data-filter="active">Attive</button>
          <button class="pill" data-filter="done">Completate</button>
        </div>
        <div id="stats">0 attive • 0 totali</div>
      </div>
    </div>
  </div>

  <script>(function(){try{const p=new URLSearchParams(location.search);const s=parseFloat(p.get('scale')||'1');if(!Number.isNaN(s)&&s>0&&s<=1.5){document.documentElement.style.setProperty('--scale',String(s));}if(p.get('density')==='compact'){document.body.classList.add('compact');}}catch(e){}})();</script>
  <script>
    const $ = (s, el=document) => el.querySelector(s);
    const $$ = (s, el=document) => [...el.querySelectorAll(s)];

    const KEY = 'lofi_todo_v2';
    const load = () => JSON.parse(localStorage.getItem(KEY) || '[]');
    const save = (items) => localStorage.setItem(KEY, JSON.stringify(items));

    let items = load();
    let filter = 'all';

    const ui = {
      list: $('#list'),
      stats: $('#stats'),
      newTitle: $('#newTitle'),
      newDate: $('#newDate'),
      addBtn: $('#addBtn'),
      filters: $('#filters')
    };

    function render(){
      ui.list.innerHTML = '';
      const filtered = items.filter(it => filter==='all' || (filter==='active' && !it.done) || (filter==='done' && it.done));

      for(const it of filtered){ ui.list.appendChild(taskNode(it)); }

      const activeCount = items.filter(i=>!i.done).length;
      ui.stats.textContent = `${activeCount} attive • ${items.length} totali`;
    }

    function taskNode(it){
      const node = document.createElement('div');
      node.className = 'task' + (it.done ? ' done' : '');
      node.dataset.id = it.id;

      node.innerHTML = `
        <label class="check"><input type="checkbox" ${it.done ? 'checked' : ''} /><i></i></label>
        <div>
          <div class="title" contenteditable="true"></div>
          <div class="meta">${it.date ? `⏰ ${fmtDate(it.date)}` : ''}</div>
        </div>
        <button style="background:none;border:none;color:#f77;cursor:pointer;font-size:12px;">✖</button>`;

      $('.title', node).textContent = it.title;

      $('input', node).addEventListener('change', e=>{ it.done = e.target.checked; save(items); render(); });
      $('.title', node).addEventListener('blur', e=>{ it.title = e.target.textContent.trim() || 'Senza titolo'; save(items); });
      $('button', node).addEventListener('click', ()=>{ items = items.filter(x=>x.id!==it.id); save(items); render(); });

      return node;
    }

    const fmtDate = (d) => { try{ const dt = new Date(d); return dt.toLocaleDateString('it-IT', { day:'2-digit', month:'2-digit' }); }catch{ return d; } }
    const uid = () => Math.random().toString(36).slice(2,9);

    function addTask(){
      const title = ui.newTitle.value.trim();
      if(!title) return;
      const date = ui.newDate.value || '';
      const it = { id: uid(), title, done:false, date, created: new Date().toISOString().slice(0,10) };
      items.unshift(it); save(items);
      ui.newTitle.value=''; ui.newDate.value='';
      render();
    }

    ui.addBtn.addEventListener('click', addTask);
    ui.newTitle.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); addTask(); }});

    ui.filters.addEventListener('click', e=>{
      const b = e.target.closest('.pill'); if(!b) return;
      $$('.pill', ui.filters).forEach(p=>p.classList.remove('active'));
      b.classList.add('active'); filter = b.dataset.filter; render();
    });

    if(items.length===0){
      items = [
        { id: uid(), title:'Respira e metti un lo‑fi beat 🎧', done:false, date:'', created: new Date().toISOString().slice(0,10) }
      ];
      save(items);
    }

    // Leggi parametro URL "scale" per ridimensionamento
    const params = new URLSearchParams(location.search);
    const scale = parseFloat(params.get('scale'));
    if(!isNaN(scale)) document.documentElement.style.setProperty('--scale', scale);

    render();
  </script>
</body>
</html>

