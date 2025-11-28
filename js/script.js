// ============================
// Global Unlock Schedule
// ============================
// JS months are 0-based: 10 = November, 11 = December
const unlockSchedule = {
  day1: { month: 10, day: 29 }, // 29 Nov
  day2: { month: 10, day: 30 }, // 30 Nov
  day3: { month: 11, day: 1 },  // 1 Dec
  day4: { month: 11, day: 2 },  // 2 Dec
  day5: { month: 11, day: 3 },  // 3 Dec
  day6: { month: 11, day: 4 },  // 4 Dec
  day7: { month: 11, day: 5 }   // 5 Dec
};

function getTodayDate() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function getUnlockDate(pageKey) {
  const schedule = unlockSchedule[pageKey];
  if (!schedule) return null;
  const now = new Date();
  return new Date(now.getFullYear(), schedule.month, schedule.day);
}

// ============================
// Preloader
// ============================
function setupPreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  window.addEventListener("load", () => {
    preloader.classList.add("hide");
  });
}

// ============================
// Day Unlock Logic
// ============================
function isPageUnlocked(pageKey) {
  const schedule = unlockSchedule[pageKey];
  if (!schedule) return true;

  const today = getTodayDate();
  const unlockDate = getUnlockDate(pageKey);

  return today >= unlockDate;
}

function handleDayUnlock(pageKey) {
  const content = document.querySelector(".memory-content");
  const locked = document.querySelector(".locked-message");

  if (!isPageUnlocked(pageKey)) {
    if (content) content.style.display = "none";
    if (locked) locked.style.display = "flex";
  } else {
    if (locked) locked.style.display = "none";
    if (content) content.style.display = "block";
  }
}

// ============================
// Countdown (Home page)
// ============================
function setupCountdown() {
  const countdownEl = document.getElementById("countdown");
  if (!countdownEl) return;

  const now = new Date();
  let targetYear = now.getFullYear();
  let target = new Date(targetYear, 11, 5, 0, 0, 0); // 5 Dec

  if (now > target) {
    target = new Date(targetYear + 1, 11, 5, 0, 0, 0);
  }

  function updateCountdown() {
    const current = new Date();
    const diff = target - current;

    if (diff <= 0) {
      countdownEl.textContent = "It's your 19th Birthday Today! 🥳❤️";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    countdownEl.textContent =
      `${days}d ${hours}h ${minutes}m ${seconds}s left for 5 December 🎂`;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// ============================
// Audio Players for each day
// ============================
function setupAudioPlayers() {
  const buttons = document.querySelectorAll(".play-btn");
  const audios = document.querySelectorAll(".day-audio");

  function pauseAll() {
    audios.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    buttons.forEach((btn) => {
      btn.classList.remove("playing");
      btn.innerHTML = "▶ Play Song";
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const audioId = btn.dataset.audioId;
      const audio = document.getElementById(audioId);
      if (!audio) return;

      if (audio.paused) {
        pauseAll();
        audio.play();
        btn.classList.add("playing");
        btn.innerHTML = "⏸ Pause Song";
      } else {
        audio.pause();
        btn.classList.remove("playing");
        btn.innerHTML = "▶ Play Song";
      }
    });
  });
}

// ============================
// Background Music (Home page) - fixed
// ============================
function setupBackgroundMusicToggle() {
  const toggleBtn = document.querySelector(".bg-music-toggle");
  const bgAudio = document.getElementById("bg-music");

  if (!toggleBtn || !bgAudio) return;

  let isPlaying = false;

  toggleBtn.innerHTML = "▶ Play Lofi Heartbeat";
  toggleBtn.classList.remove("playing");

  toggleBtn.addEventListener("click", async () => {
    try {
      if (isPlaying) {
        bgAudio.pause();
        isPlaying = false;
        toggleBtn.classList.remove("playing");
        toggleBtn.innerHTML = "▶ Play Lofi Heartbeat";
      } else {
        await bgAudio.play();
        isPlaying = true;
        toggleBtn.classList.add("playing");
        toggleBtn.innerHTML = "⏸ Stop Lofi Heartbeat";
      }
    } catch (err) {
      console.log("Autoplay blocked or error:", err);
    }
  });
}

// ============================
// Smooth Scroll for # links
// ============================
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// ============================
// Level 3: Page Curtain
// ============================
function setupCurtain() {
  const curtain = document.createElement("div");
  curtain.className = "page-curtain";
  document.body.appendChild(curtain);
  setTimeout(() => {
    curtain.remove();
  }, 1400);
}

// ============================
// Level 3: Cursor / Touch Hearts
// ============================
function setupCursorHearts() {
  let lastTime = 0;

  function spawnHeart(x, y) {
    const heart = document.createElement("span");
    heart.className = "cursor-heart";
    heart.style.left = x + "px";
    heart.style.top = y + "px";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 900);
  }

  function handleMove(e) {
    const now = Date.now();
    if (now - lastTime < 60) return;
    lastTime = now;

    let x, y;
    if (e.touches && e.touches[0]) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }
    spawnHeart(x, y);
  }

  document.addEventListener("mousemove", handleMove);
  document.addEventListener("touchmove", handleMove, { passive: true });
}

// ============================
// Level 3: Hold-to-Reveal Memory Text
// ============================
function setupHoldToReveal(pageKey) {
  if (!pageKey || !pageKey.startsWith("day")) return;
  if (!isPageUnlocked(pageKey)) return;

  const blocks = document.querySelectorAll(".memory-text");
  blocks.forEach((block) => {
    const overlay = document.createElement("div");
    overlay.className = "hold-reveal-overlay";
    overlay.innerHTML = `
      <div class="hold-reveal-inner">
        <div class="hold-heart">❤️</div>
        <div class="hold-text">Press &amp; hold to reveal</div>
      </div>
    `;
    block.appendChild(overlay);

    let timer = null;
    const holdDuration = 800;

    function startHold(e) {
      e.preventDefault();
      if (overlay.classList.contains("revealed")) return;

      overlay.classList.add("holding");
      timer = setTimeout(() => {
        overlay.classList.add("revealed");
        setTimeout(() => {
          overlay.remove();
        }, 400);
      }, holdDuration);
    }

    function cancelHold() {
      overlay.classList.remove("holding");
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    }

    overlay.addEventListener("mousedown", startHold);
    overlay.addEventListener("touchstart", startHold);

    ["mouseup", "mouseleave", "touchend", "touchcancel"].forEach((evt) => {
      overlay.addEventListener(evt, cancelHold);
    });
  });
}

// ============================
// Level 3: Typewriter for titles
// ============================
function setupTypewriter() {
  const elements = document.querySelectorAll(".memory-header-title, .hero-title");
  elements.forEach((el) => {
    const text = el.textContent.trim();
    el.textContent = "";
    let i = 0;

    function type() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(type, 70);
      }
    }
    type();
  });
}

// ============================
// Level 3: Day 7 Confetti
// ============================
function triggerConfetti() {
  const canvasId = "confetti-canvas";
  let canvas = document.getElementById(canvasId);
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = canvasId;
    document.body.appendChild(canvas);
  }
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const pieces = [];
  const colors = ["#ff9aa9", "#fecfef", "#ffd166", "#b2f7ef"];

  for (let i = 0; i < 120; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: 5 + Math.random() * 6,
      h: 8 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: 1 + Math.random() * 3,
      speedX: (Math.random() - 0.5) * 1,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.1
    });
  }

  let running = true;
  setTimeout(() => {
    running = false;
    setTimeout(() => {
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }, 1000);
  }, 3200);

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      if (p.y > canvas.height) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });

    requestAnimationFrame(draw);
  }
  draw();
}

// ============================
// Day 7 Heart Explosion
// ============================
function triggerHeartExplosion() {
  const container = document.getElementById("heart-explosion-container");
  if (!container) return;

  const totalHearts = 40;

  for (let i = 0; i < totalHearts; i++) {
    const heart = document.createElement("span");
    heart.classList.add("burst-heart");

    const startLeft = Math.random() * 100;
    const tx = (Math.random() - 0.5) * 400;
    const ty = -200 - Math.random() * 200;

    heart.style.left = startLeft + "%";
    heart.style.bottom = "0px";
    heart.style.setProperty("--tx", tx + "px");
    heart.style.setProperty("--ty", ty + "px");
    heart.style.animationDelay = (Math.random() * 0.7).toFixed(2) + "s";

    container.appendChild(heart);
  }

  setTimeout(() => {
    container.innerHTML = "";
  }, 2500);
}

// ============================
// Day 7: Love-letter paragraph reveal
// ============================
function setupLoveLetter(pageKey) {
  if (pageKey !== "day7") return;
  if (!isPageUnlocked("day7")) return;

  const textBlock = document.querySelector(".memory-text");
  if (!textBlock) return;

  const paragraphs = Array.from(textBlock.querySelectorAll("p"));
  let delay = 400;

  paragraphs.forEach((p) => {
    setTimeout(() => {
      p.classList.add("love-visible");
    }, delay);
    delay += 900;
  });
}

// ============================
// Init
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const pageKey = document.body.dataset.page;

  setupPreloader();
  setupSmoothScroll();
  setupCursorHearts();
  setupCurtain();
  setupAudioPlayers();
  setupTypewriter();

  if (pageKey === "home") {
    setupCountdown();
    setupBackgroundMusicToggle();
  } else if (pageKey && pageKey.startsWith("day")) {
    handleDayUnlock(pageKey);
    setupHoldToReveal(pageKey);

    if (pageKey === "day7" && isPageUnlocked("day7")) {
      triggerHeartExplosion();
      triggerConfetti();
      setupLoveLetter(pageKey);
    }
  }
});
