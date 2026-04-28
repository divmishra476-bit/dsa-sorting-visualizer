// Audio engine for sorting visualizer — Web Audio API
const AudioEngine = (() => {
  let ctx = null;
  let enabled = false;
  let gainNode = null;

  function init() {
    if (ctx) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      gainNode = ctx.createGain();
      gainNode.gain.value = 0.08;
      gainNode.connect(ctx.destination);
    } catch (e) {
      console.warn('Web Audio API not available');
    }
  }

  function playTone(value, maxValue, duration) {
    if (!enabled || !ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const env = ctx.createGain();

    // Map value to frequency: 200Hz (low) to 800Hz (high)
    const freq = 200 + (value / maxValue) * 600;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    env.gain.setValueAtTime(0.15, ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);

    osc.connect(env);
    env.connect(gainNode);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration / 1000);
  }

  function playCompare(val1, val2, max) {
    playTone(val1, max, 50);
  }

  function playSwap(val1, val2, max) {
    playTone((val1 + val2) / 2, max, 80);
  }

  function playDone() {
    if (!enabled || !ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    // Play a pleasant ascending arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const env = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      env.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.12);
      env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
      osc.connect(env);
      env.connect(gainNode);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.3);
    });
  }

  function toggle() {
    if (!ctx) init();
    enabled = !enabled;
    return enabled;
  }

  function isEnabled() { return enabled; }

  return { init, playCompare, playSwap, playDone, toggle, isEnabled };
})();
