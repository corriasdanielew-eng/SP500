<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>S&P500 Futures — Pro Chart</title>
  <meta name="color-scheme" content="light dark" />
  <style>
    :root{
      --bg:#0f1115; --fg:#eaeaea; --muted:#a9b1bd; --card:#171a22; --accent:#9ad0c2; --accent2:#b7b0e8;
      --radius:18px; --shadow:0 10px 30px rgba(0,0,0,.35);
    }
    @media (prefers-color-scheme: light){
      :root{ --bg:#f4f2ec; --fg:#1d2129; --muted:#5e6a78; --card:#ffffff; --shadow:0 8px 28px rgba(0,0,0,.08); }
    }
    *{ box-sizing:border-box }
    html,body{ height:100% }
    body{ margin:0; background: radial-gradient(900px 600px at 120% 0%, var(--accent2) 0%, transparent 55%), radial-gradient(1000px 700px at -10% 10%, var(--accent) 0%, transparent 55%), var(--bg); color:var(--fg); font-family: ui-rounded, "SF Pro Rounded", Inter, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, sans-serif; display:grid; grid-template-rows:auto 1fr; padding:14px }

    .shell{ width:100%; max-width:1200px; margin:0 auto; background: color-mix(in oklab, var(--card) 92%, transparent); border:1px solid color-mix(in oklab, var(--fg) 8%, transparent); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); backdrop-filter: blur(8px); }

    .toolbar{ display:flex; flex-wrap:wrap; gap:8px; align-items:center; padding:10px; background:linear-gradient(180deg, color-mix(in oklab, var(--card) 70%, transparent), transparent); border-bottom:1px solid color-mix(in oklab, var(--fg) 8%, transparent); }
    .group{ display:flex; gap:6px; align-items:center; background: color-mix(in oklab, var(--card) 50%, transparent); padding:6px; border-radius:12px; border:1px solid color-mix(in oklab, var(--fg) 10%, transparent) }
    .label{ font-size:12px; color:var(--muted); padding:0 6px }
    .btn{ cursor:pointer; border:1px solid color-mix(in oklab, var(--fg) 12%, transparent); background: color-mix(in oklab, var(--card) 40%, transparent); color:var(--fg); padding:8px 10px; border-radius:10px; font-weight:700; font-size:12px }
    .btn:hover{ background: color-mix(in oklab, var(--card) 65%, transparent) }
    .btn.active{ background: linear-gradient(135deg, var(--accent), var(--accent2)); color:#0f0f0f; border-color: transparent }
    .select{ height:34px; border-radius:10px; border:1px solid color-mix(in oklab, var(--fg) 12%, transparent); background: color-mix(in oklab, var(--card) 40%, transparent); color:var(--fg); padding:0 10px; font-weight:600 }
    .spacer{ flex:1 }

    .chart-wrap{ position:relative; height:72vh; min-height:520px }
    #tv{ position:absolute; inset:0 }

    .footer{ display:flex; flex-wrap:wrap; gap:8px; align-items:center; justify-content:space-between; padding:8px 10px; border-top:1px solid color-mix(in oklab, var(--fg) 8%, transparent); color:var(--muted); font-size:12px }
    .badge{ padding:6px 10px; border-radius:999px; background: color-mix(in oklab, var(--card) 55%, transparent); border:1px solid color-mix(in oklab, var(--fg) 10%, transparent) }
  </style>
</head>
<body>
  <div class="shell">
    <div class="toolbar">
      <span class="label">Strumento</span>
      <select class="select" id="symbol">
        <option value="CME_MINI:ES1!">E‑mini S&P 500 (continuo) — ES1!</option>
        <option value="CME_MINI:ESU2025">E‑mini S&P 500 (Set 2025) — ESU2025</option>
        <option value="CME_MINI:ESH2026">E‑mini S&P 500 (Mar 2026) — ESH2026</option>
        <option value="SP:SPX">Indice S&P 500 — SPX</option>
        <option value="CME_MINI:NQ1!">E‑mini Nasdaq‑100 — NQ1!</option>
        <option value="CBOT_MINI:YM1!">Mini Dow — YM1!</option>
        <option value="CME:VIX1!">VIX Futures — VIX1!</option>
      </select>

      <span class="label">TF</span>
      <div class="group" id="tf">
        <button class="btn" data-int="1">1m</button>
        <button class="btn" data-int="3">3m</button>
        <button class="btn active" data-int="5">5m</button>
        <button class="btn" data-int="15">15m</button>
        <button class="btn" data-int="60">1H</button>
        <button class="btn" data-int="240">4H</button>
        <button class="btn" data-int="D">D</button>
        <button class="btn" data-int="W">W</button>
      </div>

      <span class="label">Layout</span>
      <div class="group" id="layout">
        <button class="btn active" data-layout="single">Singolo</button>
        <button class="btn" data-layout="split">Split 2×</button>
      </div>

      <div class="group" id="studies">
        <span class="label">Studi</span>
        <button class="btn" data-study="VWAP@tv-basicstudies">VWAP</button>
        <button class="btn" data-study="MASimple@tv-basicstudies?length=20">SMA20</button>
        <button class="btn" data-study="MASimple@tv-basicstudies?length=50">SMA50</button>
        <button class="btn" data-study="Volume@tv-basicstudies">Volume</button>
        <button class="btn" data-study="RSI@tv-basicstudies">RSI</button>
        <button class="btn" data-study="MACD@tv-basicstudies">MACD</button>
        <button class="btn" data-clear>Reset</button>
      </div>

      <div class="spacer"></div>

      <div class="group">
        <span class="label">Tema</span>
        <select class="select" id="theme">
          <option value="dark" selected>Dark</option>
          <option value="light">Light</option>
        </select>
      </div>

    </div>

    <div class="chart-wrap"><div id="tv"></div></div>

    <div class="footer">
      <div>
        <span class="badge">Futures: 
          <strong>ES</strong> su <strong>CME</strong> • Orario Europa/Roma • Dati via TradingView</span>
      </div>
      <div>
        <span class="badge">Suggerimento: doppio click per fullscreen nel frame Notion</span>
      </div>
    </div>
  </div>

  <!-- TradingView Library -->
  <script src="https://s3.tradingview.com/tv.js"></script>
  <script>
    // ===============================
    //  S&P500 Futures Pro Chart Widget
    // ===============================
    const $ = (s, el=document) => el.querySelector(s);
    const $$ = (s, el=document) => [...el.querySelectorAll(s)];

    // URL params per avvio rapido: ?symbol=CME_MINI:ES1!&interval=5&theme=dark
    const P = new URLSearchParams(location.search);

    const state = {
      symbol: P.get('symbol') || 'CME_MINI:ES1!',
      interval: P.get('interval') || '5',
      theme: P.get('theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'),
      studies: []
    };

    // UI init
    $('#symbol').value = state.symbol;
    $('#theme').value = state.theme;
    $$('#tf .btn').forEach(b=>{ b.classList.toggle('active', b.dataset.int===String(state.interval)); });

    let widget = null;

    function buildStudies(){
      return state.studies.slice();
    }

    function rebuild(){
      if(widget){ $('#tv').innerHTML = ''; widget = null; }

      widget = new TradingView.widget({
        symbol: state.symbol,
        interval: state.interval,
        container_id: 'tv',
        timezone: 'Europe/Rome',
        theme: state.theme,
        style: '1', // candele
        locale: 'it',
        toolbar_bg: 'rgba(0,0,0,0)',
        hide_top_toolbar: false,
        hide_legend: false,
        hide_side_toolbar: false,
        withdateranges: true,
        allow_symbol_change: true,
        details: true,
        hotlist: true,
        calendar: true,
        studies: buildStudies(),
        study_count_limit: 20,
        enable_publishing: false,
        autosize: true,
        support_host: 'https://www.tradingview.com'
      });
    }

    // Controls
    $('#symbol').addEventListener('change', e=>{ state.symbol = e.target.value; rebuild(); });
    $('#theme').addEventListener('change', e=>{ state.theme = e.target.value; rebuild(); });

    $('#tf').addEventListener('click', e=>{
      const b = e.target.closest('button'); if(!b) return;
      $$('#tf .btn').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      state.interval = b.dataset.int; rebuild();
    });

    // Studi (aggiungi/rimuovi)
    $('#studies').addEventListener('click', e=>{
      const b = e.target.closest('button'); if(!b) return;
      if(b.hasAttribute('data-clear')){ state.studies = []; rebuild(); return; }
      const st = b.dataset.study;
      const idx = state.studies.indexOf(st);
      if(idx === -1){ state.studies.push(st); b.classList.add('active'); }
      else { state.studies.splice(idx,1); b.classList.remove('active'); }
      rebuild();
    });

    // Layout demo: per Notion è più stabile ricreare 1 o 2 grafici nella stessa istanza
    $('#layout').addEventListener('click', e=>{
      const b = e.target.closest('button'); if(!b) return;
      $$('#layout .btn').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      const mode = b.dataset.layout;
      if(mode === 'single'){ document.querySelector('.chart-wrap').style.height = '72vh'; rebuild(); }
      else {
        // split: due grafici uno sotto l'altro con tf diversi (5m + D)
        const wrap = $('.chart-wrap');
        wrap.innerHTML = '<div id="tvA" style="position:absolute; inset:0 0 50% 0;"></div><div id="tvB" style="position:absolute; inset:50% 0 0 0; border-top:1px solid rgba(255,255,255,.08)"></div>';
        const A = new TradingView.widget({ symbol: state.symbol, interval: state.interval, container_id: 'tvA', timezone:'Europe/Rome', theme: state.theme, locale:'it', style:'1', studies: buildStudies(), autosize:true, hide_side_toolbar:false, withdateranges:true, support_host:'https://www.tradingview.com' });
        const B = new TradingView.widget({ symbol: state.symbol, interval: 'D', container_id: 'tvB', timezone:'Europe/Rome', theme: state.theme, locale:'it', style:'1', studies: ['Volume@tv-basicstudies','MASimple@tv-basicstudies?length=200'], autosize:true, hide_side_toolbar:false, withdateranges:true, support_host:'https://www.tradingview.com' });
        return; // evita rebuild standard
      }
    });

    // Avvio
    rebuild();
  </script>
</body>
</html>

