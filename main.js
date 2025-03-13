const startBtn = document.getElementById('start');
const result = document.getElementById('result');
const sourceLang = document.getElementById('sourceLang');
const targetLang = document.getElementById('targetLang');

let finalText = '';
let isSubscribed = false; // Прост абонаментен флаг (за тест)
result.value = 'main.js е зареден!';

const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!recognition) {
  result.value = 'Грешка: SpeechRecognition не се поддържа!';
} else {
  const recog = new recognition();
  recog.continuous = true;
  recog.interimResults = true;

  startBtn.onclick = () => {
    if (!isSubscribed) {
      result.value = 'Моля, абонирайте се за пълен достъп!';
      return;
    }
    if (startBtn.textContent === 'Запис') {
      finalText = '';
      result.value = 'Стартиране на запис...';
      recog.lang = sourceLang.value; // Увери се, че езикът е правилен
      try {
        recog.start();
        result.value = 'Разпознаване започна';
        startBtn.textContent = 'Спри';
      } catch (e) {
        result.value = 'Грешка при старт: ' + e.message;
      }
    } else {
      recog.stop();
      result.value = 'Превод в процес...';
      translateText(finalText, sourceLang.value, targetLang.value);
      startBtn.textContent = 'Запис';
    }
  };

  recog.onstart = () => {
    result.value = 'Микрофонът е активен';
  };

  recog.onspeechstart = () => {
    result.value = 'Гovor открит';
  };

  recog.onresult = (event) => {
    let interimText = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        finalText += event.results[i][0].transcript + ' ';
      } else {
        interimText += event.results[i][0].transcript;
      }
    }
    result.value = finalText.trim() || interimText || 'Разпознаване в процес...';
  };

  recog.onerror = (event) => {
    result.value = 'Грешка: ' + event.error;
    startBtn.textContent = 'Запис';
  };

  recog.onend = () => {
    if (startBtn.textContent === 'Спри') {
      recog.start();
    } else {
      translateText(finalText, sourceLang.value, targetLang.value);
    }
  };

  function translateText(text, source, target) {
    if (!text) {
      result.value = 'Няма текст за превод';
      return;
    }
    fetch('https://libretranslate.com/translate', {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: source,
        target: target,
        format: 'text'
      }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
      result.value = data.translatedText || 'Грешка при превод';
    })
    .catch(error =>