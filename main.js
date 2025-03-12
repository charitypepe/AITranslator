const startBtn = document.getElementById('start');
const result = document.getElementById('result');
const sourceLang = document.getElementById('sourceLang');
const targetLang = document.getElementById('targetLang');

let finalText = '';
result.value = 'main.js е зареден!';

const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!recognition) {
  result.value = 'Грешка: SpeechRecognition не се поддържа!';
} else {
  const recog = new recognition();
  recog.continuous = true;
  recog.interimResults = true;

  startBtn.onclick = () => {
    if (startBtn.textContent === 'Запис') {
      result.value = 'Стартиране на запис...';
      recog.lang = sourceLang.value;
      try {
        recog.start();
        result.value = 'Разпознаване започна';
        startBtn.textContent = 'Спри';
      } catch (e) {
        result.value = 'Грешка при старт: ' + e.message;
      }
    } else {
      recog.stop();
      result.value = finalText || 'Разпознаването спря';
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
        finalText = event.results[i][0].transcript;
      } else {
        interimText += event.results[i][0].transcript;
      }
    }
    result.value = finalText || interimText || 'Разпознаване в процес...';
  };

  recog.onerror = (event) => {
    result.value = 'Грешка: ' + event.error;
    startBtn.textContent = 'Запис';
  };

  recog.onend = () => {
    if (startBtn.textContent === 'Спри') {
      recog.start(); // Рестартира автоматично, за да продължи
    } else {
      result.value = finalText || 'Разпознаването спря';
    }
  };
}