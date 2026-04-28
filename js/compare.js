// Compare — Side-by-side algorithm comparison engine
const Compare = (() => {
  let arrA = [], arrB = [];
  let highlightsA = {}, highlightsB = {};
  let running = false, stopped = false;
  let statsA = { comparisons: 0, swaps: 0, time: 0 };
  let statsB = { comparisons: 0, swaps: 0, time: 0 };
  let doneA = false, doneB = false;

  const speedMap = { 1: 200, 2: 80, 3: 30, 4: 8, 5: 1 };

  function getDelay() {
    var el = document.getElementById('compare-speed');
    return speedMap[+(el ? el.value : 3)] || 30;
  }

  function sleep(ms) { return new Promise(function(r) { setTimeout(r, ms); }); }

  function generateArray() {
    stop();
    var sizeEl = document.getElementById('compare-size');
    var n = +(sizeEl ? sizeEl.value : 30) || 30;
    var base = [];
    for (var i = 0; i < n; i++) base.push(Math.floor(Math.random() * 90) + 5);
    arrA = base.slice();
    arrB = base.slice();
    highlightsA = {}; highlightsB = {};
    statsA = { comparisons: 0, swaps: 0, time: 0 };
    statsB = { comparisons: 0, swaps: 0, time: 0 };
    doneA = false; doneB = false;
    updateStats();
    drawCanvas('canvas-a', arrA, highlightsA);
    drawCanvas('canvas-b', arrB, highlightsB);
    hideResult();
  }

  function drawCanvas(canvasId, arr, hl) {
    var canvas = document.getElementById(canvasId);
    var wrap = canvas ? canvas.parentElement : null;
    if (!canvas || !wrap) return;
    canvas.width = wrap.offsetWidth;
    canvas.height = wrap.offsetHeight;
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    var n = arr.length;
    if (n === 0) return;
    var gap = Math.max(1, Math.min(3, Math.floor(W / n * 0.15)));
    var barW = Math.max(2, (W - gap * (n + 1)) / n);
    var maxVal = Math.max.apply(null, arr) || 1;
    for (var i = 0; i < n; i++) {
      var x = gap + i * (barW + gap);
      var h = Math.max(2, (arr[i] / maxVal) * (H - 20));
      var color = '#5e7ce6';
      if (hl.sorted && hl.sorted.indexOf(i) >= 0) color = '#00e676';
      if (hl.comparing && hl.comparing.indexOf(i) >= 0) color = '#ffab40';
      if (hl.swapping && hl.swapping.indexOf(i) >= 0) color = '#ff5252';
      ctx.fillStyle = color;
      var rad = Math.min(barW / 2, 4);
      var bx = x, by = H - h - 5;
      ctx.beginPath();
      ctx.moveTo(bx, by + h);
      ctx.lineTo(bx, by + rad);
      ctx.quadraticCurveTo(bx, by, bx + rad, by);
      ctx.lineTo(bx + barW - rad, by);
      ctx.quadraticCurveTo(bx + barW, by, bx + barW, by + rad);
      ctx.lineTo(bx + barW, by + h);
      ctx.closePath();
      ctx.fill();
    }
  }

  function updateStats() {
    var ca = document.getElementById('comp-a-comparisons');
    var sa = document.getElementById('comp-a-swaps');
    var ta = document.getElementById('comp-a-time');
    var cb = document.getElementById('comp-b-comparisons');
    var sb = document.getElementById('comp-b-swaps');
    var tb = document.getElementById('comp-b-time');
    if (ca) ca.textContent = statsA.comparisons;
    if (sa) sa.textContent = statsA.swaps;
    if (ta) ta.textContent = (statsA.time / 1000).toFixed(2) + 's';
    if (cb) cb.textContent = statsB.comparisons;
    if (sb) sb.textContent = statsB.swaps;
    if (tb) tb.textContent = (statsB.time / 1000).toFixed(2) + 's';
  }

  function makeCallbacks(side) {
    return {
      isStopped: function() { return stopped; },
      delay: function() { return sleep(getDelay()); },
      onCompare: function(i, j, sorted) {
        if (side === 'A') {
          statsA.comparisons++;
          highlightsA = { comparing: [i, j].filter(function(x) { return x >= 0; }), sorted: sorted || [] };
          drawCanvas('canvas-a', arrA, highlightsA);
        } else {
          statsB.comparisons++;
          highlightsB = { comparing: [i, j].filter(function(x) { return x >= 0; }), sorted: sorted || [] };
          drawCanvas('canvas-b', arrB, highlightsB);
        }
        updateStats();
      },
      onSwap: function(i, j, sorted) {
        if (side === 'A') {
          statsA.swaps++;
          highlightsA = { swapping: [i, j].filter(function(x) { return x >= 0; }), sorted: sorted || [] };
          drawCanvas('canvas-a', arrA, highlightsA);
        } else {
          statsB.swaps++;
          highlightsB = { swapping: [i, j].filter(function(x) { return x >= 0; }), sorted: sorted || [] };
          drawCanvas('canvas-b', arrB, highlightsB);
        }
        updateStats();
      },
      onSwapCount: function() {
        if (side === 'A') statsA.swaps++; else statsB.swaps++;
        updateStats();
      },
      onMerged: function(indices) {
        if (side === 'A') { highlightsA = { sorted: indices }; drawCanvas('canvas-a', arrA, highlightsA); }
        else { highlightsB = { sorted: indices }; drawCanvas('canvas-b', arrB, highlightsB); }
      },
      onPivot: function() {}
    };
  }

  async function start(algoKeyA, algoKeyB) {
    if (running) return;
    if (!arrA.length) generateArray();
    running = true; stopped = false;
    doneA = false; doneB = false;
    statsA = { comparisons: 0, swaps: 0, time: 0 };
    statsB = { comparisons: 0, swaps: 0, time: 0 };
    highlightsA = {}; highlightsB = {};
    updateStats(); hideResult();

    var algoA = Visualizer.getAlgorithm(algoKeyA);
    var algoB = Visualizer.getAlgorithm(algoKeyB);
    if (!algoA || !algoB) { running = false; return; }

    var startA = performance.now();
    var startB = performance.now();

    var promiseA = algoA.run(arrA, makeCallbacks('A')).then(function() {
      statsA.time = performance.now() - startA;
      doneA = true;
      var idxs = []; for (var i = 0; i < arrA.length; i++) idxs.push(i);
      highlightsA = { sorted: idxs };
      drawCanvas('canvas-a', arrA, highlightsA);
      updateStats();
    });

    var promiseB = algoB.run(arrB, makeCallbacks('B')).then(function() {
      statsB.time = performance.now() - startB;
      doneB = true;
      var idxs = []; for (var i = 0; i < arrB.length; i++) idxs.push(i);
      highlightsB = { sorted: idxs };
      drawCanvas('canvas-b', arrB, highlightsB);
      updateStats();
    });

    await Promise.all([promiseA, promiseB]);
    running = false;
    if (!stopped) showResult(algoA, algoB);
  }

  function stop() {
    stopped = true; running = false;
    highlightsA = {}; highlightsB = {};
    if (arrA.length) drawCanvas('canvas-a', arrA, highlightsA);
    if (arrB.length) drawCanvas('canvas-b', arrB, highlightsB);
  }

  function showResult(algoA, algoB) {
    var el = document.getElementById('compare-result');
    if (!el) return;
    var winnerName, detail;
    if (statsA.time < statsB.time) {
      winnerName = algoA.name;
      detail = algoA.name + ' finished in ' + (statsA.time / 1000).toFixed(2) + 's vs ' + algoB.name + ' in ' + (statsB.time / 1000).toFixed(2) + 's';
    } else if (statsB.time < statsA.time) {
      winnerName = algoB.name;
      detail = algoB.name + ' finished in ' + (statsB.time / 1000).toFixed(2) + 's vs ' + algoA.name + ' in ' + (statsA.time / 1000).toFixed(2) + 's';
    } else {
      winnerName = 'Tie';
      detail = 'Both finished in ' + (statsA.time / 1000).toFixed(2) + 's';
    }
    var winEl = document.getElementById('winner-name');
    var detEl = document.getElementById('result-details');
    if (winEl) winEl.textContent = winnerName + ' wins!';
    if (detEl) detEl.textContent = detail;
    el.classList.add('visible');

    // Panel glow
    var pA = document.querySelector('.panel-a');
    var pB = document.querySelector('.panel-b');
    if (pA && pB) {
      if (statsA.time <= statsB.time) { pA.classList.add('winner'); pB.classList.add('loser'); }
      else { pB.classList.add('winner'); pA.classList.add('loser'); }
    }
  }

  function hideResult() {
    var el = document.getElementById('compare-result');
    if (el) el.classList.remove('visible');
    document.querySelectorAll('.compare-panel').forEach(function(p) {
      p.classList.remove('winner', 'loser');
    });
  }

  function init() {
    var speedEl = document.getElementById('compare-speed');
    var speedVal = document.getElementById('compare-speed-val');
    if (speedEl && speedVal) {
      speedEl.addEventListener('input', function() { speedVal.textContent = speedEl.value; });
    }
    var sizeEl = document.getElementById('compare-size');
    var sizeVal = document.getElementById('compare-size-val');
    if (sizeEl && sizeVal) {
      sizeEl.addEventListener('input', function() { sizeVal.textContent = sizeEl.value; });
    }
    var newBtn = document.getElementById('compare-new-array');
    if (newBtn) newBtn.addEventListener('click', generateArray);
    var startBtn = document.getElementById('compare-start');
    if (startBtn) {
      startBtn.addEventListener('click', function() {
        var selA = document.getElementById('algo-select-a');
        var selB = document.getElementById('algo-select-b');
        start(selA ? selA.value : 'bubble', selB ? selB.value : 'merge');
      });
    }
    var stopBtn = document.getElementById('compare-stop');
    if (stopBtn) stopBtn.addEventListener('click', stop);
    window.addEventListener('resize', function() {
      drawCanvas('canvas-a', arrA, highlightsA);
      drawCanvas('canvas-b', arrB, highlightsB);
    });
    generateArray();
  }

  return { init: init, generateArray: generateArray };
})();
