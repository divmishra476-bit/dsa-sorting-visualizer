// Controls — UI bindings, info panel updates
const Controls = (() => {
  let selectedAlgo = 'bubble';
  let arrayMode = 'random';

  function updateInfoPanel(algoKey) {
    const algo = Visualizer.getAlgorithm(algoKey);
    if (!algo) return;
    const descEl = document.getElementById('algo-description');
    if (descEl) descEl.textContent = algo.description;
    const compTable = document.getElementById('complexity-body');
    if (compTable) {
      compTable.innerHTML =
        '<tr><td>Best Case</td><td>' + algo.timeBest + '</td></tr>' +
        '<tr><td>Average Case</td><td>' + algo.timeAvg + '</td></tr>' +
        '<tr><td>Worst Case</td><td>' + algo.timeWorst + '</td></tr>' +
        '<tr><td>Space</td><td>' + algo.space + '</td></tr>';
    }
    const timeEl = document.getElementById('stat-time-complexity');
    const spaceEl = document.getElementById('stat-space-complexity');
    if (timeEl) timeEl.textContent = algo.timeAvg;
    if (spaceEl) spaceEl.textContent = algo.space;
    const propsEl = document.getElementById('algo-properties');
    if (propsEl) {
      const s = algo.stable ? '<span class="badge badge-stable">✓ Stable</span>' : '<span class="badge badge-unstable">✗ Unstable</span>';
      const p = algo.inPlace ? '<span class="badge badge-inplace">✓ In-Place</span>' : '<span class="badge badge-unstable">✗ Not In-Place</span>';
      propsEl.innerHTML = s + p;
    }
    const codeEl = document.getElementById('pseudocode');
    if (codeEl) codeEl.textContent = algo.pseudocode;
    const titleEl = document.getElementById('algo-title');
    if (titleEl) titleEl.textContent = algo.name;
  }

  function selectAlgorithm(key) {
    selectedAlgo = key;
    document.querySelectorAll('.algo-btn').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.algo === key);
    });
    updateInfoPanel(key);
    var a = Visualizer.getAlgorithm(key);
    if (a) Visualizer.setStatus('idle', a.name + ' selected.');
  }

  function selectArrayMode(mode) {
    arrayMode = mode;
    document.querySelectorAll('.array-mode-btn').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    if (mode !== 'custom') {
      Visualizer.generateArray(mode);
      var iw = document.getElementById('custom-input-wrap');
      if (iw) iw.style.display = 'none';
    } else {
      var iw2 = document.getElementById('custom-input-wrap');
      if (iw2) iw2.style.display = 'flex';
    }
  }

  function applyCustomArray() {
    var input = document.getElementById('custom-array-input');
    if (!input) return;
    var values = input.value.split(/[,\s]+/).filter(function(v) { return v.trim() !== ''; }).map(Number);
    if (values.length < 2) {
      Visualizer.setStatus('idle', 'Enter at least 2 comma-separated numbers.');
      return;
    }
    Visualizer.setCustomArray(values);
  }

  function init() {
    var speedEl = document.getElementById('speed');
    var speedVal = document.getElementById('speed-val');
    if (speedEl && speedVal) {
      speedEl.addEventListener('input', function() { speedVal.textContent = speedEl.value; });
    }
    var sizeEl = document.getElementById('size');
    var sizeVal = document.getElementById('size-val');
    if (sizeEl && sizeVal) {
      sizeEl.addEventListener('input', function() {
        sizeVal.textContent = sizeEl.value;
        Visualizer.generateArray(arrayMode !== 'custom' ? arrayMode : 'random');
      });
    }
    document.querySelectorAll('.algo-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (Visualizer.isRunning()) return;
        selectAlgorithm(btn.dataset.algo);
      });
    });
    document.querySelectorAll('.array-mode-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (Visualizer.isRunning()) return;
        selectArrayMode(btn.dataset.mode);
      });
    });
    var sortBtn = document.getElementById('btn-sort');
    if (sortBtn) sortBtn.addEventListener('click', function() { Visualizer.start(selectedAlgo); });
    var newBtn = document.getElementById('btn-new-array');
    if (newBtn) newBtn.addEventListener('click', function() { Visualizer.generateArray(arrayMode !== 'custom' ? arrayMode : 'random'); });
    var stopBtn = document.getElementById('btn-stop');
    if (stopBtn) stopBtn.addEventListener('click', function() { Visualizer.stop(); });
    var stepToggle = document.getElementById('step-toggle');
    if (stepToggle) {
      stepToggle.addEventListener('change', function(e) {
        Visualizer.toggleStepMode(e.target.checked);
        var sb = document.getElementById('btn-step');
        if (sb) sb.style.display = e.target.checked ? 'inline-flex' : 'none';
      });
    }
    var stepBtn = document.getElementById('btn-step');
    if (stepBtn) stepBtn.addEventListener('click', function() { Visualizer.nextStep(); });
    var audioToggle = document.getElementById('audio-toggle');
    if (audioToggle) {
      audioToggle.addEventListener('change', function() {
        var on = AudioEngine.toggle();
        var lbl = document.getElementById('audio-label');
        if (lbl) lbl.textContent = on ? 'Sound On' : 'Sound Off';
      });
    }
    var applyBtn = document.getElementById('btn-apply-custom');
    if (applyBtn) applyBtn.addEventListener('click', applyCustomArray);
    var ci = document.getElementById('custom-array-input');
    if (ci) ci.addEventListener('keydown', function(e) { if (e.key === 'Enter') applyCustomArray(); });
    window.addEventListener('resize', function() { Visualizer.draw(); });
    selectAlgorithm('bubble');
    Visualizer.generateArray('random');
  }

  return { init: init, selectAlgorithm: selectAlgorithm, getSelectedAlgo: function() { return selectedAlgo; } };
})();
