const startBtn = document.getElementById('start');
const result = document.getElementById('result');
const sourceLang = document.getElementById('sourceLang');

result.value = 'main.js е зареден!';

const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!recognition) {
  result.value = 'Грешка: SpeechRecognition не се поддържа в този браузър!';
} else {
  const recog = new recognition();
  recog.continuous = true;
  recog.interimResults = true;

  startBtn.onclick = () => {
    result.value = 'Стартиране на запис...';
    recog.lang = sourceLang.value;
    try {
      recog.start();
      result.value = 'Разпознаване започна';
    } catch (e) {
      result.value = 'Грешка при старт: ' + e.message;
    }
  };

  recog.onstart = () => {
    result.value = 'Микрофонът е активен';
  };

  recog.onspeechstart = () => {
    result.value = 'Гovor открит';
  };

  recog.onresult = (event) => {
    let finalText = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        finalText += event.results[i][0].transcript;
      }
    }
    result.value = finalText || 'Няма окончателен текст още';
  };

  recog.onerror = (event) => {
    result.value = 'Грешка: ' + event.error;
  };

  recog.onend = () => {
    result.value = 'Разпознаването спря';
  };
}