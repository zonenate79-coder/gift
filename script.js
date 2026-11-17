/* ==========================================================================
   Birthday Web Gift - Interactive Engine (Clean Local Video Edition)
   ========================================================================== */

(function () {
  'use strict';

  // --- 1. Query Params (Optional Universal Fallback) ---
  const urlParams = new URLSearchParams(window.location.search);
  const paramName = urlParams.get('name') || '';

  // DOM Elements
  const bdayTitle = document.getElementById('bdayTitle');

  // Stages
  const stage1 = document.getElementById('stage1');
  const stage2 = document.getElementById('stage2');
  const stage3 = document.getElementById('stage3');

  // Video elements
  const introVideo = document.getElementById('introVideo');
  const hugVideo = document.getElementById('hugVideo');

  // Stage 1 elements
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const noBtnText = document.getElementById('noBtnText');

  // Stage 2 elements
  const heartLoaderBox = document.getElementById('heartLoaderBox');
  const hugBox = document.getElementById('hugBox');
  const goToBirthdayBtn = document.getElementById('goToBirthdayBtn');

  // Stage 3 elements
  const cakeContainer = document.getElementById('cakeContainer');
  const candles = document.querySelectorAll('.candle');
  const wishInstruction = document.getElementById('wishInstruction');
  const wishGrantedMessage = document.getElementById('wishGrantedMessage');
  const replayBtn = document.getElementById('replayBtn');

  // Sound toggle
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');

  // Optional Name personalization if passed in URL
  if (paramName && bdayTitle) {
    bdayTitle.textContent = `Happy Birthday, ${escapeHtml(paramName)}! 🎉`;
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  // Ensure intro video plays
  if (introVideo) {
    introVideo.play().catch(() => {});
  }

  // --- 2. Web Audio Synthesizer (Guaranteed 100% Reliable & Offline) ---
  let audioCtx = null;
  let isSoundEnabled = true;
  let bgmInterval = null;
  let isBgmPlaying = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Cute Pop Sound
  function playPopSound() {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  // Magic Sparkle / Chime Sound
  function playSparkleSound() {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      const now = audioCtx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.45);
      });
    } catch (e) {}
  }

  // Gentle Candle Blow Sound
  function playBlowSound() {
    if (!isSoundEnabled || !audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const bufferSize = audioCtx.sampleRate * 0.25;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.linearRampToValueAtTime(200, now + 0.25);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start(now);
    } catch (e) {}
  }

  // Synthesized Music Box "Happy Birthday" Melody
  function startBirthdayMelody() {
    if (!isSoundEnabled || isBgmPlaying) return;
    initAudio();
    if (!audioCtx) return;
    isBgmPlaying = true;

    const G4 = 392.00, A4 = 440.00, B4 = 493.88, C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99;

    const melody = [
      [G4, 0.35], [G4, 0.35], [A4, 0.7], [G4, 0.7], [C5, 0.7], [B4, 1.2],
      [G4, 0.35], [G4, 0.35], [A4, 0.7], [G4, 0.7], [D5, 0.7], [C5, 1.2],
      [G4, 0.35], [G4, 0.35], [G5, 0.7], [E5, 0.7], [C5, 0.7], [B4, 0.7], [A4, 0.9],
      [F5, 0.35], [F5, 0.35], [E5, 0.7], [C5, 0.7], [D5, 0.7], [C5, 1.4]
    ];

    let noteIndex = 0;
    function playNextNote() {
      if (!isBgmPlaying || !isSoundEnabled || !audioCtx) return;
      const [freq, dur] = melody[noteIndex];
      const now = audioCtx.currentTime;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + dur + 0.05);

      noteIndex = (noteIndex + 1) % melody.length;
      bgmInterval = setTimeout(playNextNote, dur * 1000 + 40);
    }

    playNextNote();
  }

  function stopBirthdayMelody() {
    isBgmPlaying = false;
    if (bgmInterval) {
      clearTimeout(bgmInterval);
      bgmInterval = null;
    }
  }

  // Toggle Sound Button
  soundToggleBtn.addEventListener('click', () => {
    isSoundEnabled = !isSoundEnabled;
    soundIcon.textContent = isSoundEnabled ? '🎵' : '🔇';
    if (!isSoundEnabled) {
      stopBirthdayMelody();
    } else {
      initAudio();
      if (stage3.classList.contains('active')) {
        startBirthdayMelody();
      }
    }
  });

  // --- 3. Evasive "No" Button (Smooth Sliding & Hopping - Never Disappears!) ---
  let dodgeCount = 0;
  let yesScale = 1;
  let currentOffsetX = 0;
  let currentOffsetY = 0;

  const noPhrases = [
    'No',
    'Are you sure? 🥺',
    'Really? 😜',
    'Think again!',
    'Wrong one! ❌',
    'Nope! 😂',
    'Try harder! 🏃‍♂️',
    'Can’t touch this!',
    'Click YES! 💕'
  ];

  function dodgeNoButton(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    initAudio();
    playPopSound();

    dodgeCount++;

    // Cycle funny text
    const phraseIdx = Math.min(dodgeCount, noPhrases.length - 1);
    noBtnText.textContent = noPhrases[phraseIdx];

    // Grow the "Yes" button
    yesScale = Math.min(1.5, 1 + dodgeCount * 0.07);
    yesBtn.style.transform = `scale(${yesScale})`;

    // Generate random offset within card boundary (-110px to +110px X, -50px to +50px Y)
    let newX, newY;
    do {
      newX = (Math.random() - 0.5) * 220; // -110 to +110
      newY = (Math.random() - 0.5) * 110; // -55 to +55
    } while (Math.abs(newX - currentOffsetX) < 50 && Math.abs(newY - currentOffsetY) < 30);

    currentOffsetX = newX;
    currentOffsetY = newY;

    // Smooth transform - keeps it on screen and visible!
    noBtn.style.transform = `translate(${newX}px, ${newY}px)`;
  }

  // Handle both Desktop (pointerover/mouseenter) and Mobile (touchstart/pointerdown)
  noBtn.addEventListener('pointerover', dodgeNoButton);
  noBtn.addEventListener('touchstart', dodgeNoButton, { passive: false });
  noBtn.addEventListener('click', dodgeNoButton);

  // --- 4. Stage 1 -> Stage 2 ("Yes" Click) ---
  yesBtn.addEventListener('click', () => {
    initAudio();
    playSparkleSound();

    // Reset No button position
    noBtn.style.transform = 'translate(0, 0)';

    // Switch to Stage 2
    stage1.classList.remove('active');
    stage2.classList.add('active');
    heartLoaderBox.style.display = 'flex';
    hugBox.style.display = 'none';

    // 3D Bouncing Red Heart Loader plays for 1.6s, then reveals Hug
    setTimeout(() => {
      heartLoaderBox.style.display = 'none';
      hugBox.style.display = 'block';
      if (hugVideo) {
        hugVideo.currentTime = 0;
        hugVideo.play().catch(() => {});
      }
      playSparkleSound();
    }, 1600);
  });

  // --- 5. Stage 2 -> Stage 3 (Birthday Celebration) ---
  goToBirthdayBtn.addEventListener('click', () => {
    initAudio();
    playSparkleSound();

    stage2.classList.remove('active');
    stage3.classList.add('active');

    // Trigger Confetti!
    startConfetti();

    // Start background music
    setTimeout(() => {
      startBirthdayMelody();
    }, 600);
  });

  // --- 6. Interactive Cake & Candle Blowing ---
  let candlesBlown = false;

  cakeContainer.addEventListener('click', () => {
    if (candlesBlown) return;
    candlesBlown = true;
    initAudio();
    playBlowSound();

    // Extinguish candles
    candles.forEach((candle) => {
      candle.classList.add('blown');
    });

    wishInstruction.style.opacity = '0';
    setTimeout(() => {
      wishInstruction.classList.add('hidden');
      wishGrantedMessage.classList.remove('hidden');
      playSparkleSound();
      // Extra burst of celebratory confetti!
      triggerConfettiBurst();
    }, 350);
  });

  // --- 7. Replay Button ---
  replayBtn.addEventListener('click', () => {
    stopBirthdayMelody();
    candlesBlown = false;
    dodgeCount = 0;
    yesScale = 1;
    currentOffsetX = 0;
    currentOffsetY = 0;
    yesBtn.style.transform = 'scale(1)';
    noBtnText.textContent = 'No';
    noBtn.style.transform = 'translate(0, 0)';

    candles.forEach((c) => c.classList.remove('blown'));
    wishInstruction.classList.remove('hidden');
    wishInstruction.style.opacity = '1';
    wishGrantedMessage.classList.add('hidden');

    if (hugVideo) {
      hugVideo.pause();
      hugVideo.currentTime = 0;
    }
    if (introVideo) {
      introVideo.currentTime = 0;
      introVideo.play().catch(() => {});
    }

    heartLoaderBox.style.display = 'flex';
    hugBox.style.display = 'none';

    stage3.classList.remove('active');
    stage2.classList.remove('active');
    stage1.classList.add('active');
  });

  // --- 8. Built-in Lightweight Canvas Confetti Engine ---
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let confettiParticles = [];
  let isConfettiRunning = false;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const confettiColors = ['#ff4d84', '#fb7185', '#38bdf8', '#facc15', '#a855f7', '#34d399', '#f97316'];

  function createParticle(x, y, isBurst = false) {
    return {
      x: x !== undefined ? x : Math.random() * canvas.width,
      y: y !== undefined ? y : -20,
      size: Math.random() * 8 + 6,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      speedX: isBurst ? (Math.random() - 0.5) * 14 : (Math.random() - 0.5) * 4,
      speedY: isBurst ? Math.random() * -12 - 4 : Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      gravity: 0.18,
      opacity: 1
    };
  }

  function startConfetti() {
    isConfettiRunning = true;
    for (let i = 0; i < 90; i++) {
      confettiParticles.push(createParticle());
    }
    triggerConfettiBurst(canvas.width * 0.2, canvas.height * 0.5);
    triggerConfettiBurst(canvas.width * 0.8, canvas.height * 0.5);
    requestAnimationFrame(updateConfetti);
  }

  function triggerConfettiBurst(x, y) {
    const burstX = x !== undefined ? x : canvas.width / 2;
    const burstY = y !== undefined ? y : canvas.height / 2;
    for (let i = 0; i < 45; i++) {
      confettiParticles.push(createParticle(burstX, burstY, true));
    }
    if (!isConfettiRunning) {
      isConfettiRunning = true;
      requestAnimationFrame(updateConfetti);
    }
  }

  function updateConfetti() {
    if (!isConfettiRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.speedY += p.gravity;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();

      if (p.y > canvas.height + 50) {
        confettiParticles.splice(i, 1);
      }
    }

    if (confettiParticles.length > 0) {
      requestAnimationFrame(updateConfetti);
    } else {
      isConfettiRunning = false;
    }
  }
})();
