// ============================================================
//  AUDIO.JS — Week 3 French Learning Audio System
//  Short player (<20 words): Play/Pause + Restart
//  Long player (≥20 words): Play/Pause + Restart + Seek slider
// ============================================================

function getWordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ── SHORT PLAYER ─────────────────────────────────────────────
function buildShortPlayer(text, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const playBtn    = container.querySelector('.play-btn');
  const restartBtn = container.querySelector('.restart-btn');
  if (!playBtn || !restartBtn) return;

  let isPlaying = false;
  let isPaused  = false;

  function speak() {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'fr-FR';
    u.rate = 0.88;
    u.onstart = () => { isPlaying = true;  isPaused = false; playBtn.textContent = '⏸ Pause'; };
    u.onend   = () => { isPlaying = false; isPaused = false; playBtn.textContent = '▶ Play'; };
    u.onpause = () => { isPaused = true; };
    window.speechSynthesis.speak(u);
  }

  playBtn.addEventListener('click', () => {
    if (!isPlaying && !isPaused) {
      speak();
    } else if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      isPlaying = false; isPaused = true;
      playBtn.textContent = '▶ Play';
    } else if (isPaused) {
      window.speechSynthesis.resume();
      isPlaying = true; isPaused = false;
      playBtn.textContent = '⏸ Pause';
    }
  });

  restartBtn.addEventListener('click', () => {
    window.speechSynthesis.cancel();
    isPlaying = false; isPaused = false;
    playBtn.textContent = '▶ Play';
    setTimeout(speak, 80);
  });
}

// ── LONG PLAYER ──────────────────────────────────────────────
function buildLongPlayer(text, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const playBtn    = container.querySelector('.play-btn');
  const restartBtn = container.querySelector('.restart-btn');
  const slider     = container.querySelector('.progress-slider');
  const fill       = container.querySelector('.slider-fill');
  if (!playBtn) return;

  const words     = text.trim().split(/\s+/).filter(Boolean);
  const avgWordMs = 400;
  let currentWord = 0;
  let isPlaying   = false;
  let isPaused    = false;
  let interval    = null;

  function setSlider(idx) {
    const pct = words.length > 1 ? (Math.min(idx, words.length - 1) / (words.length - 1)) * 100 : 0;
    if (slider) slider.value = pct;
    if (fill)   fill.style.width = pct + '%';
  }

  function startInterval() {
    clearInterval(interval);
    interval = setInterval(() => {
      if (isPlaying && !isPaused) {
        currentWord = Math.min(currentWord + 1, words.length);
        setSlider(currentWord);
        if (currentWord >= words.length) clearInterval(interval);
      }
    }, avgWordMs);
  }

  function speakFrom(idx) {
    window.speechSynthesis.cancel();
    clearInterval(interval);
    currentWord = idx;
    const remaining = words.slice(idx).join(' ');
    const u = new SpeechSynthesisUtterance(remaining);
    u.lang = 'fr-FR';
    u.rate = 0.85;
    u.onstart = () => { isPlaying = true; isPaused = false; playBtn.textContent = '⏸ Pause'; startInterval(); };
    u.onend   = () => {
      clearInterval(interval);
      isPlaying = false; isPaused = false;
      currentWord = words.length;
      setSlider(words.length - 1);
      playBtn.textContent = '▶ Play';
    };
    window.speechSynthesis.speak(u);
  }

  playBtn.addEventListener('click', () => {
    if (!isPlaying && !isPaused) {
      speakFrom(currentWord >= words.length ? 0 : currentWord);
    } else if (isPlaying) {
      window.speechSynthesis.pause();
      clearInterval(interval);
      isPlaying = false; isPaused = true;
      playBtn.textContent = '▶ Play';
    } else if (isPaused) {
      window.speechSynthesis.resume();
      isPlaying = true; isPaused = false;
      playBtn.textContent = '⏸ Pause';
      startInterval();
    }
  });

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      speakFrom(0);
      setSlider(0);
    });
  }

  if (slider) {
    slider.addEventListener('input', () => {
      const pct     = parseFloat(slider.value) / 100;
      const wordIdx = Math.round(pct * (words.length - 1));
      if (fill) fill.style.width = slider.value + '%';
      if (isPlaying || isPaused) {
        speakFrom(wordIdx);
      } else {
        currentWord = wordIdx;
      }
    });
  }
}

// ── AUTO-INIT ─────────────────────────────────────────────────
// Reads [data-audio] attribute on each player container,
// auto-selects short or long player based on word count.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-audio]').forEach(el => {
    const text = el.getAttribute('data-audio');
    if (!text || !el.id) return;
    if (getWordCount(text) < 20) {
      buildShortPlayer(text, el.id);
    } else {
      buildLongPlayer(text, el.id);
    }
  });
});
