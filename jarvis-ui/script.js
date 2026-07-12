(() => {
  const canvas = document.getElementById("hud-canvas");
  const ctx = canvas.getContext("2d");
  const coreLabel = document.getElementById("core-label");
  const statusText = document.getElementById("status-text");
  const micBtn = document.getElementById("mic-toggle");

  const tlm = {
    pwr: document.getElementById("tlm-pwr"),
    freq: document.getElementById("tlm-freq"),
    sync: document.getElementById("tlm-sync"),
    lat: document.getElementById("tlm-lat"),
    net: document.getElementById("tlm-net"),
    temp: document.getElementById("tlm-temp"),
  };

  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let size = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    size = rect.width;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  // --- Audio setup -----------------------------------------------------
  let audioCtx = null;
  let analyser = null;
  let freqData = null;
  let micActive = false;

  async function enableMic() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      freqData = new Uint8Array(analyser.frequencyBinCount);
      source.connect(analyser);
      micActive = true;
      micBtn.textContent = "MICROFONO ATTIVO";
      micBtn.classList.add("active");
      statusText.textContent = "LISTENING";
    } catch (err) {
      statusText.textContent = "MIC DENIED";
      micBtn.textContent = "ACCESSO NEGATO";
    }
  }

  micBtn.addEventListener("click", () => {
    if (!micActive) enableMic();
  });

  // Bars used for the reactive ring: real data when mic is on,
  // simulated organic motion otherwise so the HUD always feels alive.
  const BAR_COUNT = 48;
  const simPhase = new Array(BAR_COUNT).fill(0).map((_, i) => i * 0.35);

  function getLevels(t) {
    if (micActive && analyser) {
      analyser.getByteFrequencyData(freqData);
      const step = Math.floor(freqData.length / BAR_COUNT);
      const levels = new Array(BAR_COUNT);
      for (let i = 0; i < BAR_COUNT; i++) {
        levels[i] = freqData[i * step] / 255;
      }
      return levels;
    }
    return simPhase.map((p, i) =>
      0.28 + 0.22 * Math.sin(t * 0.0018 + p) + 0.08 * Math.sin(t * 0.006 + p * 2)
    );
  }

  // --- Drawing helpers ---------------------------------------------------
  function drawTicks(cx, cy, radius, count, len, angleOffset, alpha) {
    ctx.save();
    ctx.strokeStyle = `rgba(75, 245, 255, ${alpha})`;
    ctx.lineWidth = 1.5;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + angleOffset;
      const x1 = cx + Math.cos(a) * radius;
      const y1 = cy + Math.sin(a) * radius;
      const x2 = cx + Math.cos(a) * (radius - len);
      const y2 = cy + Math.sin(a) * (radius - len);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawArc(cx, cy, radius, start, end, width, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(cx, cy, radius, start, end);
    ctx.stroke();
    ctx.restore();
  }

  function drawCore(cx, cy, radius, pulse) {
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * (1 + pulse * 0.3));
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.25, "rgba(75,245,255,0.9)");
    g.addColorStop(0.6, "rgba(75,245,255,0.25)");
    g.addColorStop(1, "rgba(75,245,255,0)");
    ctx.save();
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * (1 + pulse * 0.3), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawReactiveRing(cx, cy, baseRadius, levels, t) {
    ctx.save();
    for (let i = 0; i < levels.length; i++) {
      const a = (i / levels.length) * Math.PI * 2 + t * 0.00015;
      const barLen = 8 + levels[i] * 34;
      const x1 = cx + Math.cos(a) * baseRadius;
      const y1 = cy + Math.sin(a) * baseRadius;
      const x2 = cx + Math.cos(a) * (baseRadius + barLen);
      const y2 = cy + Math.sin(a) * (baseRadius + barLen);
      const alpha = 0.35 + levels[i] * 0.6;
      ctx.strokeStyle = `rgba(75, 245, 255, ${alpha})`;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.restore();
  }

  // --- Main loop -----------------------------------------------------
  let sweepAngle = 0;

  function frame(t) {
    ctx.clearRect(0, 0, size, size);
    const cx = size / 2;
    const cy = size / 2;
    const R = size * 0.42;

    const levels = getLevels(t);
    const avgLevel = levels.reduce((a, b) => a + b, 0) / levels.length;
    const pulse = 0.5 + 0.5 * Math.sin(t * 0.0025) * (0.4 + avgLevel);

    // outer static tick ring
    drawTicks(cx, cy, R, 72, 8, 0, 0.25);
    // rotating mid ring, ticks
    drawTicks(cx, cy, R * 0.86, 36, 10, t * 0.00025, 0.4);
    // slow counter-rotating segmented arcs
    const arcOffset = t * 0.0004;
    drawArc(cx, cy, R * 0.94, arcOffset, arcOffset + 1.1, 2, "rgba(75,245,255,0.55)");
    drawArc(cx, cy, R * 0.94, arcOffset + Math.PI, arcOffset + Math.PI + 1.6, 2, "rgba(75,245,255,0.55)");
    drawArc(cx, cy, R * 1.0, -arcOffset * 1.4, -arcOffset * 1.4 + 0.6, 3, "rgba(255,180,67,0.65)");

    // radar sweep
    sweepAngle += 0.012 + avgLevel * 0.01;
    const sweep = ctx.createConicGradient
      ? ctx.createConicGradient(sweepAngle, cx, cy)
      : null;
    if (sweep) {
      sweep.addColorStop(0, "rgba(75,245,255,0.28)");
      sweep.addColorStop(0.05, "rgba(75,245,255,0)");
      sweep.addColorStop(1, "rgba(75,245,255,0)");
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.86, 0, Math.PI * 2);
      ctx.fillStyle = sweep;
      ctx.fill();
      ctx.restore();
    }

    // reactive spike ring (audio or simulated)
    drawReactiveRing(cx, cy, R * 0.55, levels, t);

    // pulsating core
    drawCore(cx, cy, R * 0.18, pulse);

    coreLabel.textContent = micActive ? "ASCOLTO" : "STANDBY";
    coreLabel.style.textShadow = `0 0 ${10 + avgLevel * 30}px var(--cyan)`;

    updateTelemetry(t, avgLevel);
    requestAnimationFrame(frame);
  }

  // --- Fake telemetry readout, purely cosmetic ---------------------------
  let lastTlmUpdate = 0;
  function updateTelemetry(t, level) {
    if (t - lastTlmUpdate < 180) return;
    lastTlmUpdate = t;
    tlm.pwr.textContent = `${(78 + level * 20).toFixed(1)}%`;
    tlm.freq.textContent = `${(432 + level * 96).toFixed(1)} Hz`;
    tlm.sync.textContent = micActive ? "LIVE" : "SIM";
    tlm.lat.textContent = `${(4 + Math.random() * 3).toFixed(1)} ms`;
    tlm.net.textContent = "STABLE";
    tlm.temp.textContent = `${(36 + level * 4).toFixed(1)}°C`;
  }

  requestAnimationFrame(frame);
})();
