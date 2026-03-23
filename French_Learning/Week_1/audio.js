/* ============================================================
   FRENCH LEARNING COACH — Shared Audio Logic (audio.js)
   ============================================================ */

/**
 * Determines if a text is "long" (≥ 20 words).
 * Builds the appropriate player inside the given container element.
 */
function buildPlayer(text, containerId) {
  const words = text.trim().split(/\s+/);
  if (words.length < 20) {
    buildShortPlayer(text, containerId);
  } else {
    buildLongPlayer(text, containerId);
  }
}

/* ── Short Player ──────────────────────────────────────────
   Fewer than 20 words.
   Buttons: ▶ Play / ⏸ Pause | ↺ Restart
──────────────────────────────────────────────────────────── */
function buildShortPlayer(text, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let utterance = null;
  let speaking = false;
  let paused  = false;

  // ── DOM ──────────────────────────────────────────────────
  const wrap = document.createElement('div');
  wrap.className = 'audio-player';

  const playBtn = document.createElement('button');
  playBtn.className = 'audio-btn play-btn';
  playBtn.innerHTML = '▶ Play';
  playBtn.setAttribute('aria-label', 'Play audio');

  const restartBtn = document.createElement('button');
  restartBtn.className = 'audio-btn restart-btn';
  restartBtn.innerHTML = '↺';
  restartBtn.setAttribute('aria-label', 'Restart audio');
  restartBtn.title = 'Restart';

  wrap.appendChild(playBtn);
  wrap.appendChild(restartBtn);
  container.appendChild(wrap);

  // ── Helpers ──────────────────────────────────────────────
  function getVoice() {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find(v => v.lang === 'fr-CA') ||
      voices.find(v => v.lang === 'fr-FR') ||
      voices.find(v => v.lang.startsWith('fr')) ||
      null
    );
  }

  function resetState() {
    speaking = false;
    paused   = false;
    playBtn.innerHTML = '▶ Play';
    playBtn.className = 'audio-btn play-btn';
  }

  function startSpeaking() {
    window.speechSynthesis.cancel();
    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang  = 'fr-FR';
    utterance.rate  = 0.85;
    const voice = getVoice();
    if (voice) utterance.voice = voice;

    utterance.onstart = () => {
      speaking = true;
      paused   = false;
      playBtn.innerHTML = '⏸ Pause';
      playBtn.className = 'audio-btn pause-btn';
    };

    utterance.onend = () => resetState();
    utterance.onerror = () => resetState();

    window.speechSynthesis.speak(utterance);
  }

  // ── Events ────────────────────────────────────────────────
  playBtn.addEventListener('click', () => {
    // If voices not loaded yet, wait
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => handlePlay();
    } else {
      handlePlay();
    }
  });

  function handlePlay() {
    if (!speaking && !paused) {
      // Fresh start
      startSpeaking();
    } else if (speaking && !paused) {
      // Pause
      window.speechSynthesis.pause();
      paused  = true;
      speaking = false;
      playBtn.innerHTML = '▶ Play';
      playBtn.className = 'audio-btn play-btn';
    } else if (paused) {
      // Resume
      window.speechSynthesis.resume();
      paused  = false;
      speaking = true;
      playBtn.innerHTML = '⏸ Pause';
      playBtn.className = 'audio-btn pause-btn';
    }
  }

  restartBtn.addEventListener('click', () => {
    window.speechSynthesis.cancel();
    resetState();
    startSpeaking();
  });

  // Load voices if needed
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {};
  }
}

/* ── Long Player ───────────────────────────────────────────
   20 or more words.
   Buttons: ▶ Play | ⏸ Pause | ↺ Restart
   Progress slider with real-time tracking and seek.
──────────────────────────────────────────────────────────── */
function buildLongPlayer(text, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const words = text.trim().split(/\s+/);
  const AVG_MS_PER_WORD = 420; // estimated ms per word at rate 0.85

  let currentWord = 0;
  let isPlaying   = false;
  let isPaused    = false;
  let tickInterval = null;
  let utterance   = null;
  let wordStart   = 0; // timestamp when currentWord chunk began

  // ── DOM ──────────────────────────────────────────────────
  const wrap = document.createElement('div');
  wrap.className = 'audio-long-player';

  const btnsRow = document.createElement('div');
  btnsRow.className = 'audio-long-btns';

  const playBtn = document.createElement('button');
  playBtn.className = 'audio-btn play-btn';
  playBtn.innerHTML = '▶ Play';

  const pauseBtn = document.createElement('button');
  pauseBtn.className = 'audio-btn pause-btn';
  pauseBtn.innerHTML = '⏸ Pause';
  pauseBtn.disabled = true;
  pauseBtn.style.opacity = '0.5';

  const restartBtn = document.createElement('button');
  restartBtn.className = 'audio-btn restart-btn';
  restartBtn.innerHTML = '↺ Restart';

  btnsRow.appendChild(playBtn);
  btnsRow.appendChild(pauseBtn);
  btnsRow.appendChild(restartBtn);

  const sliderWrap = document.createElement('div');
  sliderWrap.className = 'audio-slider-wrap';

  const slider = document.createElement('input');
  slider.type      = 'range';
  slider.className = 'audio-slider';
  slider.min       = '0';
  slider.max       = String(words.length - 1);
  slider.value     = '0';

  sliderWrap.appendChild(slider);
  wrap.appendChild(btnsRow);
  wrap.appendChild(sliderWrap);
  container.appendChild(wrap);

  updateSliderFill(0);

  // ── Helpers ──────────────────────────────────────────────
  function getVoice() {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find(v => v.lang === 'fr-CA') ||
      voices.find(v => v.lang === 'fr-FR') ||
      voices.find(v => v.lang.startsWith('fr')) ||
      null
    );
  }

  function updateSliderFill(wordIdx) {
    const pct = words.length > 1 ? (wordIdx / (words.length - 1)) * 100 : 0;
    slider.style.background =
      `linear-gradient(to right, #4a90d9 ${pct}%, #e9edf5 ${pct}%)`;
    slider.value = String(wordIdx);
  }

  function setPlayingUI(playing) {
    if (playing) {
      playBtn.innerHTML  = '▶ Playing';
      playBtn.disabled   = true;
      playBtn.style.opacity = '0.6';
      pauseBtn.disabled  = false;
      pauseBtn.style.opacity = '1';
    } else {
      playBtn.innerHTML  = '▶ Play';
      playBtn.disabled   = false;
      playBtn.style.opacity = '1';
      pauseBtn.disabled  = true;
      pauseBtn.style.opacity = '0.5';
    }
  }

  function clearTick() {
    if (tickInterval) { clearInterval(tickInterval); tickInterval = null; }
  }

  function resetAll() {
    window.speechSynthesis.cancel();
    clearTick();
    isPlaying   = false;
    isPaused    = false;
    currentWord = 0;
    updateSliderFill(0);
    setPlayingUI(false);
    playBtn.innerHTML = '▶ Play';
    playBtn.disabled  = false;
    playBtn.style.opacity = '1';
  }

  function speakFrom(wordIndex) {
    window.speechSynthesis.cancel();
    clearTick();

    currentWord = Math.max(0, Math.min(wordIndex, words.length - 1));
    const remaining = words.slice(currentWord).join(' ');

    utterance = new SpeechSynthesisUtterance(remaining);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.85;
    const voice = getVoice();
    if (voice) utterance.voice = voice;

    wordStart = Date.now();

    utterance.onstart = () => {
      isPlaying = true;
      isPaused  = false;
      setPlayingUI(true);
      startTick();
    };

    utterance.onend = () => {
      clearTick();
      isPlaying = false;
      isPaused  = false;
      updateSliderFill(words.length - 1);
      setPlayingUI(false);
      playBtn.innerHTML = '▶ Play';
      playBtn.disabled  = false;
      playBtn.style.opacity = '1';
    };

    utterance.onerror = () => resetAll();

    window.speechSynthesis.speak(utterance);
  }

  function startTick() {
    clearTick();
    tickInterval = setInterval(() => {
      if (isPlaying && !isPaused) {
        const elapsed   = Date.now() - wordStart;
        const wordsElapsed = Math.floor(elapsed / AVG_MS_PER_WORD);
        const idx = Math.min(currentWord + wordsElapsed, words.length - 1);
        updateSliderFill(idx);
        if (idx >= words.length - 1) clearTick();
      }
    }, 100);
  }

  // ── Events ────────────────────────────────────────────────
  playBtn.addEventListener('click', () => {
    if (!isPlaying && !isPaused) {
      speakFrom(currentWord);
    }
  });

  pauseBtn.addEventListener('click', () => {
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      clearTick();
      // estimate current word at pause
      const elapsed = Date.now() - wordStart;
      currentWord = Math.min(currentWord + Math.floor(elapsed / AVG_MS_PER_WORD), words.length - 1);
      wordStart = Date.now();
      isPaused  = true;
      isPlaying = false;
      setPlayingUI(false);
      playBtn.innerHTML = '▶ Resume';
      playBtn.disabled  = false;
      playBtn.style.opacity = '1';
    } else if (isPaused) {
      window.speechSynthesis.resume();
      wordStart = Date.now();
      isPaused  = false;
      isPlaying = true;
      setPlayingUI(true);
      startTick();
    }
  });

  restartBtn.addEventListener('click', () => {
    currentWord = 0;
    updateSliderFill(0);
    speakFrom(0);
  });

  // Slider seek
  let seekPending = false;
  slider.addEventListener('input', () => {
    seekPending = true;
    updateSliderFill(parseInt(slider.value));
  });

  slider.addEventListener('change', () => {
    if (!seekPending) return;
    seekPending = false;
    currentWord = parseInt(slider.value);
    speakFrom(currentWord);
  });

  // Load voices
  window.speechSynthesis.getVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  }
}

/* ── Global cleanup ─────────────────────────────────────── */
window.addEventListener('beforeunload', () => window.speechSynthesis.cancel());
window.addEventListener('pagehide',     () => window.speechSynthesis.cancel());
