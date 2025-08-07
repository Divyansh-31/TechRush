// Get references to all piano keys, volume input, and key label toggle
const instrumentKeys = document.querySelectorAll(".instrument-keys .key-item"),
      volumeControl = document.querySelector(".volume-control input"),
      keyVisibility = document.querySelector(".key-visibility input");

// Track all available keys for keyboard input
let allKeys = [];
let audio = new Audio(`tunes/a.wav`); // Default audio to prevent delay

// Playback function for both click and keyboard input
const playTune = (key) => {
    audio.src = `tunes/${key}.wav`;  // Set audio source
    audio.play();                    // Play audio

    // Add visual feedback
    const clickedKey = document.querySelector(`[data-key="${key}"]`);
    if (!clickedKey) return;
    clickedKey.classList.add("active");
    setTimeout(() => {
        clickedKey.classList.remove("active");
    }, 150);

    // If recording is active, store the key and relative time
    if (isRecording) {
        recordedNotes.push({
            key,
            time: Date.now() - recordingStartTime
        });
    }
};

// Attach click events to each piano key
instrumentKeys.forEach(key => {
    allKeys.push(key.dataset.key); // Store all keys for keyboard playback
    key.addEventListener("click", () => playTune(key.dataset.key));
});

// Handle volume slider input
const handleVolume = (e) => {
    audio.volume = e.target.value;
};

// Toggle visibility of key labels
const toggleKeyVisibility = () => {
    instrumentKeys.forEach(key => key.classList.toggle("hide"));
};

// Handle key presses from keyboard
const pressedKey = (e) => {
    if (allKeys.includes(e.key)) {
        playTune(e.key);
    }
};

// Listen to volume change, key label toggle, and key press
volumeControl.addEventListener("input", handleVolume);
keyVisibility.addEventListener("click", toggleKeyVisibility);
document.addEventListener("keydown", pressedKey);

// ==============================
// 🎙️ Recording Functionality
// ==============================

// State for recording
let isRecording = false;
let recordedNotes = [];
let recordingStartTime = 0;

// Buttons
const startBtn = document.getElementById("start-recording");
const stopBtn = document.getElementById("stop-recording");
const saveBtn = document.getElementById("save-recording");

// Start recording: reset previous notes and track time
startBtn.addEventListener("click", () => {
    recordedNotes = [];
    isRecording = true;
    recordingStartTime = Date.now();

    // Button states
    startBtn.disabled = true;
    stopBtn.disabled = false;
    saveBtn.disabled = true;
});

// Stop recording: disable recording and allow save
stopBtn.addEventListener("click", () => {
    isRecording = false;

    // Button states
    startBtn.disabled = false;
    stopBtn.disabled = true;
    saveBtn.disabled = recordedNotes.length === 0;
});

// Save recording to JSON file
saveBtn.addEventListener("click", () => {
    if (recordedNotes.length === 0) return;

    const blob = new Blob(
        [JSON.stringify(recordedNotes, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "melody-recording.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});
