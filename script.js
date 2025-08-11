const instrumentKeys = document.querySelectorAll(".instrument-keys .key-item"),
  volumeControl = document.querySelector(".volume-control input"),
  keyVisibility = document.querySelector(".key-visibility input");

let allKeys = [];
let audio = new Audio(`tunes/a.wav`);

// === Play sound and highlight keys ===
const playTune = (key) => {
  audio.src = `tunes/${key}.wav`;
  audio.play();

  const clickedKey = document.querySelector(`[data-key="${key}"]`);
  if (!clickedKey) return;

  clickedKey.classList.add("active");

  setTimeout(() => clickedKey.classList.remove("active"), 150);

  if (isRecording) {
    recordedNotes.push({
      key,
      time: Date.now() - recordingStartTime,
    });
  }
};

instrumentKeys.forEach((key) => {
  allKeys.push(key.dataset.key);
  key.addEventListener("click", () => {
    playTune(key.dataset.key);
    if (gameActive) handleGameInput(key.dataset.key);
  });
});

volumeControl.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

keyVisibility.addEventListener("click", () => {
  instrumentKeys.forEach((key) => key.classList.toggle("hide"));
});

document.addEventListener("keydown", (e) => {
  const keyPressed = e.key.toLowerCase();
  if (allKeys.includes(keyPressed)) {
    playTune(keyPressed);
    if (gameActive) handleGameInput(keyPressed);
  }
});

// ==============================
// 🎙️ Recording Functionality
// ==============================

let isRecording = false;
let recordedNotes = [];
let recordingStartTime = 0;

const startBtn = document.getElementById("start-recording");
const stopBtn = document.getElementById("stop-recording");
const saveBtn = document.getElementById("save-recording");
const playBtn = document.getElementById("play-recording");

startBtn.addEventListener("click", () => {
  recordedNotes = [];
  isRecording = true;
  recordingStartTime = Date.now();

  startBtn.disabled = true;
  stopBtn.disabled = false;
  saveBtn.disabled = true;
  playBtn.disabled = true;
});

stopBtn.addEventListener("click", () => {
  isRecording = false;

  startBtn.disabled = false;
  stopBtn.disabled = true;
  saveBtn.disabled = recordedNotes.length === 0;
  playBtn.disabled = recordedNotes.length === 0;
});

saveBtn.addEventListener("click", () => {
  if (recordedNotes.length === 0) return;

  const blob = new Blob([JSON.stringify(recordedNotes, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "melody-recording.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

playBtn.addEventListener("click", () => {
  if (recordedNotes.length === 0) return;

  recordedNotes.forEach((note) => {
    setTimeout(() => {
      playTune(note.key);
    }, note.time);
  });
});

// ==============================
// 📂 Upload & Play JSON Recording
// ==============================

const uploadInput = document.getElementById("upload-json");
const playUploadBtn = document.getElementById("play-upload");
let uploadedNotes = [];

uploadInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      uploadedNotes = JSON.parse(event.target.result);
      if (Array.isArray(uploadedNotes) && uploadedNotes.length > 0) {
        playUploadBtn.disabled = false;
      } else {
        alert("Invalid JSON format.");
        playUploadBtn.disabled = true;
      }
    } catch (err) {
      alert("Error reading JSON file.");
      playUploadBtn.disabled = true;
    }
  };
  reader.readAsText(file);
});

playUploadBtn.addEventListener("click", () => {
  if (uploadedNotes.length === 0) return;

  uploadedNotes.forEach((note) => {
    setTimeout(() => {
      playTune(note.key);
    }, note.time);
  });
});

// ==============================
// 🎮 Mini-game Logic
// ==============================

const startGameBtn = document.getElementById("start-game-btn");
const scoreDisplay = document.getElementById("score");
const messageDisplay = document.getElementById("message");

let gameActive = false;
let currentHighlightedKey = null;
let score = 0;
let roundTimeout = null;
const roundTime = 3000;

function clearHighlights() {
  instrumentKeys.forEach((key) => key.classList.remove("highlight"));
}

function highlightRandomKey() {
  clearHighlights();
  const randomIndex = Math.floor(Math.random() * instrumentKeys.length);
  currentHighlightedKey = instrumentKeys[randomIndex];
  currentHighlightedKey.classList.add("highlight");
}

function updateScore(change) {
  score += change;
  if (score < 0) score = 0;
  scoreDisplay.textContent = score;
}

function handleGameInput(key) {
  if (!gameActive || !currentHighlightedKey) return;

  const expectedKey = currentHighlightedKey.dataset.key;

  if (key === expectedKey) {
    updateScore(1);
    messageDisplay.textContent = "Correct! +1 point";
    nextRound();
  } else {
    updateScore(-1);
    messageDisplay.textContent = `Wrong! Press "${expectedKey}"`;
  }
}

function nextRound() {
  clearTimeout(roundTimeout);
  highlightRandomKey();
  setTimeout(() => (messageDisplay.textContent = ""), 1500);

  roundTimeout = setTimeout(() => {
    updateScore(-1);
    messageDisplay.textContent = `Too slow! -1 point. Press "${currentHighlightedKey.dataset.key}"`;
    nextRound();
  }, roundTime);
}

function startGame() {
  if (gameActive) return;

  gameActive = true;
  score = 0;
  scoreDisplay.textContent = score;
  messageDisplay.textContent = "Game Started! Press the highlighted key.";
  startGameBtn.textContent = "Restart Mini Game";
  highlightRandomKey();

  roundTimeout = setTimeout(() => {
    updateScore(-1);
    messageDisplay.textContent = `Too slow! -1 point. Press "${currentHighlightedKey.dataset.key}"`;
    nextRound();
  }, roundTime);
}

function stopGame() {
  gameActive = false;
  clearHighlights();
  clearTimeout(roundTimeout);
  messageDisplay.textContent = "Game stopped.";
  startGameBtn.textContent = "Start Mini Game";
}

startGameBtn.addEventListener("click", () => {
  if (gameActive) stopGame();
  startGame();
});
