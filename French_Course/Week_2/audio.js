(function(){
  let currentUtterance = null;
  let activeController = null;

  function cancelCurrent(){
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    currentUtterance = null;
    activeController = null;
  }

  function buildUtterance(text){
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.onend = function(){
      currentUtterance = null;
      activeController = null;
    };
    return utterance;
  }

  window.speakText = function(text){
    if (!('speechSynthesis' in window)) {
      alert('Speech is not supported on this device.');
      return;
    }
    cancelCurrent();
    currentUtterance = buildUtterance(text);
    window.speechSynthesis.speak(currentUtterance);
  };

  window.playPassage = function(id){
    const el = document.getElementById(id);
    if (!el) return;
    const text = el.dataset.text || el.textContent || '';
    window.speakText(text.trim());
    activeController = id;
  };

  window.stopSpeech = function(){
    cancelCurrent();
  };

  window.restartSpeech = function(id){
    const el = document.getElementById(id);
    if (!el) return;
    const text = el.dataset.text || el.textContent || '';
    window.speakText(text.trim());
    activeController = id;
  };
})();
