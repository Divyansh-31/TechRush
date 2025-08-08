const drums = new Howl({
    "src": [
      "./drums/drums.webm",
      "./drums/drums.mp3"
    ],
   "sprite": {
      "clap": [
        0,
        734.2630385487529
      ],
      "closed-hihat": [
        2000,
        445.94104308390035
      ],
      "crash": [
        4000,
        1978.6848072562354
      ],
      "kick": [
        7000,
        553.0839002267571
      ],
      "open-hihat": [
        9000,
        962.7664399092968
      ],
      "snare": [
        11000,
        354.48979591836684
      ]
    }
  });

  const drumkit = document.querySelector('.drumkit');
  function playDrum(event) {
    if (event.target.classList.contains('pad')) {
      event.preventDefault();
      let soundToPlay = event.target.dataset.sound;
      drums.play(soundToPlay);
    }
  }

  function setViewportHeight() {
    let vh = window.innerHeight * 0.01;
    console.log(vh);
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  
  setViewportHeight();
  window.addEventListener('resize', () => {
    setTimeout(setViewportHeight, 100);
  });

  drumkit.addEventListener('click', playDrum);
  drumkit.addEventListener('touchstart', playDrum);
<<<<<<< HEAD




  // Get Howler's AudioContext and masterGain
const audioCtx = Howler.ctx;
const destination = audioCtx.createMediaStreamDestination();
Howler.masterGain.connect(destination);

// Setup MediaRecorder
let mediaRecorder = new MediaRecorder(destination.stream);
let recordedChunks = [];

// Record button handlers
document.getElementById('startRecordingBtn').addEventListener('click', () => {
  recordedChunks = [];
  mediaRecorder.start();
  console.log("🎙️ Recording started...");
  alert("Recording started.");
});

document.getElementById('stopRecordingBtn').addEventListener('click', () => {
  mediaRecorder.stop();
  console.log("⏹️ Recording stopped.");
  alert("Recording stopped. File will be saved.");
});

mediaRecorder.ondataavailable = function (e) {
  if (e.data.size > 0) {
    recordedChunks.push(e.data);
  }
};

mediaRecorder.onstop = function () {
  const blob = new Blob(recordedChunks, { type: 'audio/webm' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'drum-recording.webm';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Optional: preview
  const audio = new Audio(url);
  audio.controls = true;
  document.body.appendChild(audio);
  audio.play();
  alert("You can now preview your recording below.");

};

=======
  
>>>>>>> 3f6a0be00df2e4828f3773d0da8c2b9e99b4afcc
