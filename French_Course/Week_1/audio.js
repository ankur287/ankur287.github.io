let activeUtterance = null;

function speakText(text, lang='fr-FR'){
  if(!('speechSynthesis' in window)){
    alert('Speech playback is not supported in this browser.');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.92;
  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

function stopSpeech(){
  if('speechSynthesis' in window){
    window.speechSynthesis.cancel();
    activeUtterance = null;
  }
}

function restartSpeech(text, lang='fr-FR'){
  stopSpeech();
  speakText(text, lang);
}

function toggleReveal(id, btn){
  const el = document.getElementById(id);
  if(!el) return;
  const isHidden = el.classList.contains('hidden');
  el.classList.toggle('hidden');
  if(btn){
    btn.textContent = isHidden ? 'Hide' : 'Reveal';
  }
}

function setAllReveal(sectionId, show){
  const root = document.getElementById(sectionId);
  if(!root) return;
  root.querySelectorAll('.reveal').forEach(el => {
    if(show){ el.classList.remove('hidden'); }
    else { el.classList.add('hidden'); }
  });
}

function resetAllPlayers(){
  stopSpeech();
}

function gradeQuiz(formId, resultId){
  const form = document.getElementById(formId);
  const result = document.getElementById(resultId);
  const questions = form.querySelectorAll('[data-answer]');
  let score = 0;

  questions.forEach(q => {
    q.classList.remove('correct', 'incorrect');
    const answer = q.dataset.answer;
    const type = q.dataset.type || 'radio';
    let user = '';

    if(type === 'radio'){
      const checked = q.querySelector('input[type="radio"]:checked');
      user = checked ? checked.value : '';
    } else if(type === 'text'){
      const input = q.querySelector('input[type="text"]');
      user = input ? input.value.trim().toLowerCase() : '';
    }

    const fb = q.querySelector('.feedback');
    if(user === answer){
      score += 1;
      q.classList.add('correct');
      if(fb){ fb.textContent = 'Correct.'; fb.className = 'feedback ok'; }
    } else {
      q.classList.add('incorrect');
      const explain = q.dataset.explain || '';
      if(fb){ fb.textContent = 'Not quite. ' + explain; fb.className = 'feedback bad'; }
    }
  });

  result.innerHTML = '<strong>Score:</strong> ' + score + ' / ' + questions.length + '.';
}

function resetQuiz(formId, resultId){
  const form = document.getElementById(formId);
  form.reset();
  form.querySelectorAll('.quiz-question').forEach(q => {
    q.classList.remove('correct', 'incorrect');
    const fb = q.querySelector('.feedback');
    if(fb){ fb.textContent = ''; fb.className = 'feedback'; }
  });
  document.getElementById(resultId).textContent = '';
  stopSpeech();
}
