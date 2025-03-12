const startBtn = document.getElementById('start');
const result = document.getElementById('result');
const sourceLang = document.getElementById('sourceLang');

result.value = 'main.js е зареден!'; // Показва, че JS работи

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.interimResults = true;

startBtn.onclick = () => {
  result.value = 'Кликнат "Запис", език: ' + sourceLang.value;
  recognition.lang = sourceLang.value;
  recognition.start();
  startBtn.textContent = 'Спри';
  startBtn.onclick = () => {
    result.value = 'Кликнат "Спри"';
    recognition.stop();
  };
};

recognition.onresult = (event) => {
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
  startBtn.onclick = () => {
    recognition.start();
  };
};

recognition.onerror = (event) => {
  result.value = 'Грешка: ' + event.error;
};