const drums = new Howl({
    "src": [
        "./drums/drums.webm",
        "./drums/drums.mp3"
    ],
    "sprite": {
        "clap": [0, 734.26],
        "closed-hihat": [2000, 445.94],
        "crash": [4000, 1978.68],
        "kick": [7000, 553.08],
        "open-hihat": [9000, 962.76],
        "snare": [11000, 354.48]
    }
});

const drumkit = document.querySelector('.drumkit');


//Recording State

let isRecording = false;
let recordedNotes = [];
let recordingStartTime = 0;
let uploadedNotes = [];

// Buttons
const startBtn = document.getElementById("startRecordingBtn");
const stopBtn = document.getElementById("stopRecordingBtn");
const saveBtn = document.getElementById("saveRecordingBtn");
const uploadInput = document.getElementById("uploadJson");
const playUploadBtn = document.getElementById("playUploadedBtn");

// 🔊 Play Drum Sound
function playSound(soundName) {
    drums.play(soundName);
}


// Mouse/touch play

function playDrum(event) {
    let pad = event.target.closest('.pad');
    if (!pad) return;

    let soundToPlay = pad.dataset.sound;
    playSound(soundToPlay);

    // Record if active
    if (isRecording) {
        recordedNotes.push({
            sound: soundToPlay,
            time: Date.now() - recordingStartTime
        });
    }
}


// Keyboard mapping
const keyMap = {
    'a': 'clap',
    's': 'snare',
    'd': 'crash',
    'j': 'open-hihat',
    'k': 'kick',
    'l': 'closed-hihat'
};

function playDrumFromKey(event) {
    const sound = keyMap[event.key.toLowerCase()];
    if (sound) {
        playSound(sound);

        // Visual feedback
        const pad = document.querySelector(`.pad[data-sound="${sound}"]`);
        if (pad) {
            pad.classList.add('active');
            setTimeout(() => pad.classList.remove('active'), 100);
        }

        // Record if active
        if (isRecording) {
            recordedNotes.push({
                sound,
                time: Date.now() - recordingStartTime
            });
        }
    }
}


//Viewport height adjustment
function setViewportHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setViewportHeight();
window.addEventListener('resize', () => {
    setTimeout(setViewportHeight, 100);
});


// Recording Controls
startBtn.addEventListener("click", () => {
    recordedNotes = [];
    isRecording = true;
    recordingStartTime = Date.now();

    startBtn.disabled = true;
    stopBtn.disabled = false;
    saveBtn.disabled = true;
});

stopBtn.addEventListener("click", () => {
    isRecording = false;

    startBtn.disabled = false;
    stopBtn.disabled = true;
    saveBtn.disabled = recordedNotes.length === 0;
});

saveBtn.addEventListener("click", () => {
    if (recordedNotes.length === 0) return;

    const blob = new Blob(
        [JSON.stringify(recordedNotes, null, 2)],
        { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "drum-recording.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Upload & Play JSON Recording
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

    uploadedNotes.forEach(note => {
        setTimeout(() => {
            playSound(note.sound);
        }, note.time);
    });
});


// Event Listeners
drumkit.addEventListener('click', playDrum);
drumkit.addEventListener('touchstart', playDrum);
window.addEventListener('keydown', playDrumFromKey);
