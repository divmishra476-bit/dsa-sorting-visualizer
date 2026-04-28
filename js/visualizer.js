// Visualizer — Core canvas drawing, state management, sorting orchestration
const Visualizer = (() => {
  // --- State ---
  let arr = [];
  let highlights = {};
  let running = false;
  let stopped = false;
  let paused = false;
  let stepMode = false;
  let stepResolve = null;
  let comparisons = 0;
  let swapCount = 0;
  let startTime = 0;
  let elapsedTime = 0;
  let timerInterval = null;
  let currentAlgo = null;
  let pivotIdx = -1;

  // --- Algorithm Registry ---
  const algorithms = {};

  function registerAlgorithm(algo) {
    algorithms[algo.key] = algo;
  }

  function getAlgorithm(key) {
    return algorithms[key] || null;
  }

  function getAllAlgorithms() {
    return Object.values(algorithms);
  }

  // --- Speed ---
  const speedMap = { 1: 200, 2: 80, 3: 30, 4: 8, 5: 1 };
  function getDelay() {
    const el = document.getElementById('speed');
    return speedMap[+(el ? el.value : 3)] || 30;
  }

  function getSize() {
    const el = document.getElementById('size');
    return +(el ? el.value : 30) || 30;
  }

  // --- Array Generation ---
  function generateArray(mode) {
    stop();
    const n = getSize();
    switch (mode) {
      case 'random':
        arr = Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 5);
        break;
      case 'nearly':
        arr = Array.from({ length: n }, (_, i) => Math.floor(((i + 1) / n) * 90) + 5);
        // Slightly perturb ~15% of elements
        for (let i = 0; i < Math.floor(n * 0.15); i++) {
          const a = Math.floor(Math.random() * n);
          const b = Math.min(n - 1, a + Math.floor(Math.random() * 3) + 1);
          [arr[a], arr[b]] = [arr[b], arr[a]];
        }
        break;
      case 'reversed':
        arr = Array.from({ length: n }, (_, i) => Math.floor(((n - i) / n) * 90) + 5);
        break;
      case 'few-unique':
        const vals = [15, 35, 55, 75, 90];
        arr = Array.from({ length: n }, () => vals[Math.floor(Math.random() * vals.length)]);
        break;
      default:
        arr = Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 5);
    }
    highlights = {};
    pivotIdx = -1;
    comparisons = 0;
    swapCount = 0;
    elapsedTime = 0;
    updateStats();
    updateTimer();
    draw();
    setStatus('idle', 'Array generated. Select an algorithm and press Sort.');
  }

  function setCustomArray(values) {
    stop();
    arr = values.map(v => Math.max(5, Math.min(95, parseInt(v) || 0)));
    highlights = {};
    pivotIdx = -1;
    comparisons = 0;
    swapCount = 0;
    elapsedTime = 0;
    updateStats();
    updateTimer();
    draw();
    setStatus('idle', `Custom array of ${arr.length} elements loaded.`);
  }

  // --- Drawing ---
  function draw() {
    const canvas = document.getElementById('canvas');
    const wrap = document.getElementById('canvas-wrap');
    if (!canvas || !wrap) return;

    canvas.width = wrap.offsetWidth;
    canvas.height = wrap.offsetHeight;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const n = arr.length;
    if (n === 0) return;

    const gap = Math.max(1, Math.min(3, Math.floor(W / n * 0.15)));
    const barW = Math.max(2, (W - gap * (n + 1)) / n);
    const maxVal = Math.max(...arr, 1);

    for (let i = 0; i < n; i++) {
      const x = gap + i * (barW + gap);
      const h = Math.max(2, (arr[i] / maxVal) * (H - 20));

      // Determine bar color
      let color = getComputedStyle(document.documentElement).getPropertyValue('--bar-default').trim() || '#5e7ce6';

      if (highlights.sorted && highlights.sorted.includes(i)) {
        color = getComputedStyle(document.documentElement).getPropertyValue('--bar-sorted').trim() || '#00e676';
      }
      if (i === pivotIdx) {
        color = getComputedStyle(document.documentElement).getPropertyValue('--bar-pivot').trim() || '#e040fb';
      }
      if (highlights.comparing && highlights.comparing.includes(i)) {
        color = getComputedStyle(document.documentElement).getPropertyValue('--bar-comparing').trim() || '#ffab40';
      }
      if (highlights.swapping && highlights.swapping.includes(i)) {
        color = getComputedStyle(document.documentElement).getPropertyValue('--bar-swapping').trim() || '#ff5252';
      }

      // Draw bar with rounded top
      const radius = Math.min(barW / 2, 4);
      const bx = x;
      const by = H - h - 5;
      const bw = barW;
      const bh = h;

      ctx.beginPath();
      ctx.moveTo(bx, by + bh);
      ctx.lineTo(bx, by + radius);
      ctx.quadraticCurveTo(bx, by, bx + radius, by);
      ctx.lineTo(bx + bw - radius, by);
      ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + radius);
      ctx.lineTo(bx + bw, by + bh);
      ctx.closePath();

      // Gradient fill
      const grad = ctx.createLinearGradient(bx, by, bx, by + bh);
      grad.addColorStop(0, color);
      grad.addColorStop(1, adjustBrightness(color, -30));
      ctx.fillStyle = grad;
      ctx.fill();

      // Subtle shine effect
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fillRect(bx, by, bw * 0.4, bh);
    }
  }

  function adjustBrightness(hex, amount) {
    let color = hex.replace('#', '');
    if (color.length === 3) color = color.split('').map(c => c + c).join('');
    const num = parseInt(color, 16);
    const r = Math.max(0, Math.min(255, ((num >> 16) & 0xFF) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0xFF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0xFF) + amount));
    return `rgb(${r},${g},${b})`;
  }

  // --- Stats ---
  function updateStats() {
    const compEl = document.getElementById('comparisons');
    const swapEl = document.getElementById('swaps');
    if (compEl) compEl.textContent = comparisons;
    if (swapEl) swapEl.textContent = swapCount;
  }

  function updateTimer() {
    const el = document.getElementById('timer');
    if (el) el.textContent = (elapsedTime / 1000).toFixed(2) + 's';
  }

  function startTimer() {
    startTime = performance.now();
    timerInterval = setInterval(() => {
      elapsedTime = performance.now() - startTime;
      updateTimer();
    }, 50);
  }

  function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = null;
    elapsedTime = performance.now() - startTime;
    updateTimer();
  }

  // --- Status ---
  function setStatus(state, text) {
    const statusEl = document.getElementById('status-text');
    const dotEl = document.getElementById('status-dot');
    if (statusEl) statusEl.textContent = text;
    if (dotEl) {
      dotEl.className = 'status-dot';
      if (state) dotEl.classList.add(state);
    }
    // Card glow
    const card = document.querySelector('.canvas-card');
    if (card) {
      card.classList.remove('sorting', 'done');
      if (state === 'running') card.classList.add('sorting');
      if (state === 'done') card.classList.add('done');
    }
  }

  // --- Sleep / Step ---
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function delayOrStep() {
    if (stepMode && paused) {
      return new Promise(resolve => { stepResolve = resolve; });
    }
    return sleep(getDelay());
  }

  function nextStep() {
    if (stepResolve) {
      const r = stepResolve;
      stepResolve = null;
      r();
    }
  }

  // --- Sorting ---
  async function start(algoKey) {
    if (running) return;
    const algo = algorithms[algoKey];
    if (!algo) return;
    if (!arr.length) generateArray('random');

    currentAlgo = algo;
    running = true;
    stopped = false;
    paused = stepMode;
    comparisons = 0;
    swapCount = 0;
    highlights = {};
    pivotIdx = -1;
    updateStats();
    setStatus('running', `Sorting with ${algo.name}...`);
    startTimer();

    const workArr = [...arr];
    arr = workArr;

    const maxVal = Math.max(...arr, 1);

    const callbacks = {
      isStopped: () => stopped,
      delay: () => delayOrStep(),
      onCompare: (i, j, sorted) => {
        comparisons++;
        highlights = { comparing: [i, j].filter(x => x >= 0), sorted: sorted || [] };
        updateStats();
        draw();
        AudioEngine.playCompare(arr[i] || 0, arr[j] || 0, maxVal);
      },
      onSwap: (i, j, sorted) => {
        swapCount++;
        highlights = { swapping: [i, j].filter(x => x >= 0), sorted: sorted || [] };
        updateStats();
        draw();
        AudioEngine.playSwap(arr[i] || 0, arr[j] || 0, maxVal);
      },
      onSwapCount: () => {
        swapCount++;
        updateStats();
      },
      onMerged: (indices) => {
        highlights = { sorted: indices };
        draw();
      },
      onPivot: (idx) => {
        pivotIdx = idx;
      }
    };

    await algo.run(arr, callbacks);

    stopTimer();
    pivotIdx = -1;

    if (!stopped) {
      highlights = { sorted: Array.from({ length: arr.length }, (_, i) => i) };
      draw();
      AudioEngine.playDone();
      setStatus('done', `Done! ${comparisons} comparisons, ${swapCount} swaps in ${(elapsedTime / 1000).toFixed(2)}s`);
    }
    running = false;
  }

  function stop() {
    stopped = true;
    running = false;
    paused = false;
    pivotIdx = -1;
    if (stepResolve) { stepResolve(); stepResolve = null; }
    stopTimer();
    highlights = {};
    if (arr.length) draw();
    setStatus('idle', 'Stopped.');
  }

  function toggleStepMode(on) {
    stepMode = on;
    if (running) paused = on;
  }

  function getArray() { return arr; }
  function isRunning() { return running; }

  return {
    registerAlgorithm,
    getAlgorithm,
    getAllAlgorithms,
    generateArray,
    setCustomArray,
    draw,
    start,
    stop,
    nextStep,
    toggleStepMode,
    getArray,
    isRunning,
    getDelay,
    setStatus
  };
})();
