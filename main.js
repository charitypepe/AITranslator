const startBtn = document.getElementById('start');
const result = document.getElementById('result');
const sourceLang = document.getElementById('sourceLang');

result.value = 'main.js е зареден!';

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.interimResults = true;

function startRecognition() {
  result.value = 'Кликнат "Запис", език: ' + sourceLang.value;
  recognition.lang = sourceLang.value;
  try {
    recognition.start();
    result.value = 'Разпознаване стартирано';
    startBtn.textContent = 'Спри';
    startBtn.onclick = stopRecognition;
  } catch (error) {
    result.value = 'Грешка при стартиране: ' + error.message;
  }
}

function stopRecognition() {
  result.value = 'Кликнат "Спри"';
  try {
    recognition.stop();
    result.value = 'Спиране извикано';
  } catch (error) {
    result.value = 'Грешка при спиране: ' + error.message;
  }
  startBtn.textContent = 'Запис';
  startBtn.onclick = startRecognition;
}

startBtn.onclick = startRecognition;

recognition.onstart = () => {
  result.value = 'Разпознаването започна';
};

recognition.onaudiostart = () => {
  result.value = 'Аудио започна – микрофонът улавя звук';
};

recognition.onsoundstart = () => {
  result.value = 'Звук открит';
};

recognition.onspeechstart = () => {
  result.value = 'Гovor открит';
};

recognition.onresult = (event) => {
  result.value = 'Резултат получен';
  let interimText = '';
  let finalText = '';
  for (let i = event.resultIndex; i < event.results.length; i++) {
    if (event.results[i].isFinal) {
      finalText += event.results[i][0].transcript;
    } else {
      interimText += event.results[i][0].transcript;
    }
  }
  result.value = finalText;
  result.placeholder = interimText;
};

recognition.onend = () => {
  result.value = 'Разпознаването спря';
  startBtn.textContent = 'Запис';
  startBtn.onclick = startRecognition;
};

recognition.onerror = (event) => {
  result.value = 'Грешка: ' + event.error + ' (подробности: ' + (event.message || 'няма допълнително инфо') + ')';
};