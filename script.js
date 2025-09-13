// --- DOM shortcuts
const $ = (s, scope = document) => scope.querySelector(s);

const start = $('#start');
const card = $('#card');
const memory = $('#memory');
const openCardBtn = $('#openCardBtn');
const toMemoryBtn = $('#toMemoryBtn');
const backToCardBtn = $('#backToCardBtn');
const musicCard = $('#musicCard');
const musicMemory = $('#musicMemory');
const confettiCanvas = $('#confetti');
const muteBtn = $('#muteBtn');

// Track mute state
let isMuted = false;

// Ensure audio resumes from start when switching sections
function playCardMusic() {
  if (isMuted) return;
  musicMemory.pause();
  musicCard.currentTime = 0;
  musicCard.play().catch(() => {});
}
function playMemoryMusic() {
  if (isMuted) return;
  musicCard.pause();
  musicMemory.currentTime = 0;
  musicMemory.play().catch(() => {});
}

// Navigation
openCardBtn.addEventListener('click', () => {
  start.hidden = true;
  card.hidden = false;
  playCardMusic();
  fireConfetti(180);
});

toMemoryBtn.addEventListener('click', () => {
  card.hidden = true;
  memory.hidden = false;
  playMemoryMusic();
  fireConfetti(120);
});

backToCardBtn.addEventListener('click', () => {
  memory.hidden = true;
  card.hidden = false;
  playCardMusic();
});

// --- Floating hearts generation
const hearts = document.getElementById('hearts');
function spawnHearts() {
  const count = 26; // performance-friendly
  for (let i = 0; i < count; i++) {
    const h = document.createElement('div');
    h.className = 'heart';
    const size = 10 + Math.random() * 24; // 10–34
    h.style.width = size + 'px';
    h.style.height = size + 'px';
    h.style.left = Math.random() * 100 + 'vw';
    h.style.bottom = (-10 + Math.random() * 20) + 'vh';
    h.style.opacity = 0.3 + Math.random() * 0.6;
    h.style.background = '#fff';
    h.style.animation = `floatUp ${10 + Math.random() * 14}s linear ${Math.random() * -20}s infinite`;
    hearts.appendChild(h);
  }
}
spawnHearts();

// --- Confetti (lightweight)
const ctx = confettiCanvas.getContext('2d');
let confettiPieces = [];
function fireConfetti(amount = 120) {
  confettiCanvas.width = innerWidth;
  confettiCanvas.height = innerHeight;
  for (let i = 0; i < amount; i++) {
    confettiPieces.push({
      x: Math.random() * innerWidth,
      y: -10,
      vy: 2 + Math.random() * 4,
      vx: -2 + Math.random() * 4,
      size: 5 + Math.random() * 8,
      rot: Math.random() * 360,
      vr: -6 + Math.random() * 12,
      color: `hsl(${Math.random() * 360}, 90%, 60%)`
    });
  }
}
function step() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.vy *= 0.995;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot * Math.PI / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    ctx.restore();
  });
  confettiPieces = confettiPieces.filter(p => p.y < innerHeight + 40);
  requestAnimationFrame(step);
}
step();

// --- Mute/Unmute button
muteBtn.addEventListener('click', () => {
  isMuted = !isMuted;
  if (isMuted) {
    musicCard.pause();
    musicMemory.pause();
    muteBtn.textContent = '🔇';
  } else {
    if (!card.hidden) {
      playCardMusic();
    } else if (!memory.hidden) {
      playMemoryMusic();
    }
    muteBtn.textContent = '🔊';
  }
});

// --- Accessibility: keyboard shortcuts
document.addEventListener('keydown', (e) => {
  // Enter key: open card if on start screen
  if (e.key === 'Enter' && !start.hidden && card.hidden) {
    openCardBtn.click();
  }
  // Right arrow: go forward (card → memory)
  if (e.key === 'ArrowRight' && !card.hidden) {
    toMemoryBtn.click();
  }
  // Left arrow: go back (memory → card)
  if (e.key === 'ArrowLeft' && !memory.hidden) {
    backToCardBtn.click();
  }
  // "C" key: celebrate (confetti)
  if (e.key.toLowerCase() === 'c' && !card.hidden) {
    fireConfetti(200);
  }
  // "M" key: mute/unmute
  if (e.key.toLowerCase() === 'm') {
    muteBtn.click();
  }
});
