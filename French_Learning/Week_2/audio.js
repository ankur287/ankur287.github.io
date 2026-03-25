/**
 * audio.js — Shared audio playback logic for French Learning Coach
 * Supports two player types based on word count:
 *   Short Player  (<  20 words): Play/Pause + Restart
 *   Long Player   (>= 20 words): Play + Pause + Restart + seek slider
 */

// Cancel any ongoing speech when navigating away
window.addEventListener('beforeunload', () => window.speechSynthesis.cancel());

/**
 * Count words in a text string.
 */
function wordCount(text) {
  return text.trim().split(/\s+/).length;
}

/**
 * Build the right player automatically based on word count.
 * @param {string} text       - The French text to speak
 * @param {string} containerId - ID of the container element
 */
function buildPlayer(text, containerId) {
  if (wordCount(text) < 20) {
    buildShortPlayer(text, containerId);
  } else {
    buildLongPlayer(text, containerId);
  }
}

/* ─────────────────────────────────────────
   SHORT PLAYER  (<20 words)
   Buttons: ▶ Play / ⏸ Pause  +  ↺ Restart
───────────────────────────────────────── */
function buildShortPlayer(text, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let utterance = null;
  let paused = false;

  // Build DOM
  container.innerHTML = '';
  container.classList.add('audio-player');

  const playBtn = document.createElement('button');
  playBtn.className = 'audio-btn btn-play';
  playBtn.innerHTML = '▶ Play';

  const restartBtn = document.createElement('button');
  restartBtn.className = 'audio-btn btn-restart';
  restartBtn.innerHTML = '↺';
  restartBtn.title = 'Restart';
  restartBtn.style.flex = '0 0 auto';
  restartBtn.style.minWidth = '56px';

  container.appendChild(playBtn);
  container.appendChild(restartBtn);

  function resetToPlay() {
    paused = false;
    utterance = null;
    playBtn.className = 'audio-btn btn-play';
    playBtn.innerHTML = '▶ Play';
  }

  function startSpeech() {
    window.speechSynthesis.cancel();
    paused = false;
    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    utterance.onend = () => resetToPlay();
    utterance.onerror = () => resetToPlay();
    window.speechSynthesis.speak(utterance);
    playBtn.className = 'audio-btn btn-pause';
    playBtn.innerHTML = '⏸ Pause';
  }

  playBtn.addEventListener('click', () => {
    if (window.speechSynthesis.speaking && !paused) {
      // Currently playing → pause
      window.speechSynthesis.pause();
      paused = true;
      playBtn.className = 'audio-btn btn-play';
      playBtn.innerHTML = '▶ Play';
    } else if (paused) {
      // Paused → resume
      window.speechSynthesis.resume();
      paused = false;
      playBtn.className = 'audio-btn btn-pause';
      playBtn.innerHTML = '⏸ Pause';
    } else {
      // Stopped → start fresh
      startSpeech();
    }
  });

  restartBtn.addEventListener('click', () => {
    resetToPlay();
    startSpeech();
  });
}

/* ─────────────────────────────────────────
   LONG PLAYER  (≥20 words)
   Buttons: ▶ Play  ⏸ Pause  ↺ Restart
   + seek slider tracking word position
───────────────────────────────────────── */
function buildLongPlayer(text, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const words = text.trim().split(/\s+/);
  const avgWordMs = 400; // ~400ms per word at rate 0.9
  let currentWord = 0;
  let isPlaying = false;
  let isPaused = false;
  let tickInterval = null;

  // Build DOM
  container.innerHTML = '';
  container.classList.add('long-player-wrap');

  const controls = document.createElement('div');
  controls.className = 'long-player-controls';

  const playBtn = document.createElement('button');
  playBtn.className = 'audio-btn btn-play';
  playBtn.innerHTML = '▶ Play';

  const pauseBtn = document.createElement('button');
  pauseBtn.className = 'audio-btn btn-pause';
  pauseBtn.innerHTML = '⏸ Pause';
  pauseBtn.style.display = 'none';

  const restartBtn = document.createElement('button');
  restartBtn.className = 'audio-btn btn-restart';
  restartBtn.innerHTML = '↺ Restart';
  restartBtn.style.flex = '0 1 auto';
  restartBtn.style.minWidth = '110px';

  controls.appendChild(playBtn);
  controls.appendChild(pauseBtn);
  controls.appendChild(restartBtn);

  const sliderWrap = document.createElement('div');
  sliderWrap.className = 'progress-slider-wrap';

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = 0;
  slider.max = words.length - 1;
  slider.value = 0;
  slider.className = 'progress-slider';

  // Blue fill effect via background gradient
  function updateSliderFill(val) {
    const pct = (val / (words.length - 1)) * 100;
    slider.style.background = `linear-gradient(to right, #4a90d9 ${pct}%, #e2e8f0 ${pct}%)`;
  }
  updateSliderFill(0);

  sliderWrap.appendChild(slider);
  container.appendChild(controls);
  container.appendChild(sliderWrap);

  function clearTick() {
    if (tickInterval) { clearInterval(tickInterval); tickInterval = null; }
  }

  function resetAll() {
    window.speechSynthesis.cancel();
    clearTick();
    currentWord = 0;
    isPlaying = false;
    isPaused = false;
    slider.value = 0;
    updateSliderFill(0);
    playBtn.style.display = '';
    pauseBtn.style.display = 'none';
  }

  function speakFrom(wordIndex) {
    window.speechSynthesis.cancel();
    clearTick();
    currentWord = wordIndex;
    isPlaying = true;
    isPaused = false;

    const remaining = words.slice(wordIndex).join(' ');
    const utter = new SpeechSynthesisUtterance(remaining);
    utter.lang = 'fr-FR';
    utter.rate = 0.9;

    utter.onend = () => {
      clearTick();
      currentWord = words.length - 1;
      slider.value = currentWord;
      updateSliderFill(currentWord);
      isPlaying = false;
      isPaused = false;
      playBtn.style.display = '';
      pauseBtn.style.display = 'none';
    };

    utter.onerror = () => resetAll();

    window.speechSynthesis.speak(utter);

    // Tick to update slider
    tickInterval = setInterval(() => {
      if (!isPaused && currentWord < words.length - 1) {
        currentWord++;
        slider.value = currentWord;
        updateSliderFill(currentWord);
      }
      if (currentWord >= words.length - 1) clearTick();
    }, avgWordMs);

    playBtn.style.display = 'none';
    pauseBtn.style.display = '';
  }

  playBtn.addEventListener('click', () => {
    if (isPaused) {
      // Resume
      window.speechSynthesis.resume();
      isPaused = false;
      tickInterval = setInterval(() => {
        if (!isPaused && currentWord < words.length - 1) {
          currentWord++;
          slider.value = currentWord;
          updateSliderFill(currentWord);
        }
        if (currentWord >= words.length - 1) clearTick();
      }, avgWordMs);
      playBtn.style.display = 'none';
      pauseBtn.style.display = '';
    } else {
      speakFrom(currentWord);
    }
  });

  pauseBtn.addEventListener('click', () => {
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      clearTick();
      isPaused = true;
      pauseBtn.style.display = 'none';
      playBtn.style.display = '';
    }
  });

  restartBtn.addEventListener('click', () => {
    resetAll();
    speakFrom(0);
  });

  // Slider seek
  let seeking = false;

  slider.addEventListener('mousedown', () => { seeking = true; });
  slider.addEventListener('touchstart', () => { seeking = true; }, { passive: true });

  slider.addEventListener('input', () => {
    currentWord = parseInt(slider.value, 10);
    updateSliderFill(currentWord);
  });

  slider.addEventListener('change', () => {
    seeking = false;
    const targetWord = parseInt(slider.value, 10);
    if (isPlaying || isPaused) {
      speakFrom(targetWord);
    } else {
      currentWord = targetWord;
      updateSliderFill(targetWord);
    }
  });
}

/* ─────────────────────────────────────────
   REVEAL HELPERS
───────────────────────────────────────── */
function setupReveal(btnId, contentId, showLabel, hideLabel) {
  const btn = document.getElementById(btnId);
  const content = document.getElementById(contentId);
  if (!btn || !content) return;

  btn.addEventListener('click', () => {
    const isShown = content.classList.contains('shown');
    content.classList.toggle('shown', !isShown);
    btn.textContent = isShown ? showLabel : hideLabel;
  });
}

/* ─────────────────────────────────────────
   EXPANDABLE SECTIONS
───────────────────────────────────────── */
function setupExpandable(btnId, contentId) {
  const btn = document.getElementById(btnId);
  const content = document.getElementById(contentId);
  if (!btn || !content) return;

  btn.addEventListener('click', () => {
    const isOpen = content.classList.contains('open');
    content.classList.toggle('open', !isOpen);
    btn.classList.toggle('open', !isOpen);
  });
}
