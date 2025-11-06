
const EVENT_DATE_ISO = "2025-12-06T18:00:00-03:00"; // hora local (GMT-3)
const KID_NAME = "Delfina";
const PORTADA_BG = "assets/portada_delfi.webp";
const HERO_PHOTO = "assets/portada_delfi.webp";
const PARTY_ICON = "assets/icono-fiesta.svg";
const AUDIO_SRC = "assets/musica.mp3";
const phone = '59894857166';
const message = 'Hola, confirmo la asistencia al cumple 🎉';

var confettiEngine = null;

const btn = document.getElementById('btn-wa');
btn.addEventListener('click', () => {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
});

/* === Confeti  === */
(function celebrateOnView() {
  if (!window.IntersectionObserver || !window.requestAnimationFrame) return;
  var sections = document.querySelectorAll(".seccion");
  var fired = [];

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && entry.intersectionRatio > 0.6 && fired.indexOf(entry.target) === -1) {
        fired.push(entry.target);
        if (confettiEngine && typeof confettiEngine.fire === "function") {
          confettiEngine.fire(30);
        }
      }
    });
  }, { threshold: [0.6] });

  for (var i = 0; i < sections.length; i++) io.observe(sections[i]);
})();

/* ==== Fondo lazy ==== */
var lazy = document.querySelectorAll(".lazy-bg");
for (var i = 0; i < lazy.length; i++) {
  var bg = lazy[i].getAttribute("data-bg");
  if (bg) lazy[i].style.backgroundImage = "url(" + bg + ")";
}

/* ==== Countdown ==== */
startCountdown(EVENT_DATE_ISO);

/* ==== Audio ==== */
setupAudioToggle();

/* ==== RSVP ==== */
initRsvp();

/* ==== Confetti engine ==== */
confettiEngine = createConfettiEngine("confettiCanvas");

/* ==== Mensaje + confeti al cerrar modal ==== */
try {
  $("#formModal").on("hidden.bs.modal", function () {
    if (confettiEngine && typeof confettiEngine.fire === "function") confettiEngine.fire(70);
    var after = document.getElementById("afterRsvpMsg");
    if (after) {
      after.style.display = "block";
      setTimeout(function () { after.style.display = "none"; }, 4200);
    }
  });
} catch (e) { }

/* ===== load gallery ===== */
function loadGallery(items) {
  var carouselInner = document.getElementById("carouselInner");
  var galleryThumbs = document.getElementById("galleryThumbs");
  if (!carouselInner || !galleryThumbs) return;

  carouselInner.innerHTML = "";
  galleryThumbs.innerHTML = "";

  for (var i = 0; i < items.length; i++) {
    var it = items[i];
    var slide = document.createElement("div");
    slide.className = "carousel-item" + (i === 0 ? " active" : "");
    slide.innerHTML =
      '<a data-fancybox="gallery" href="' + it.src + '">' +
      '  <img src="' + it.src + '" class="d-block w-100" alt="Foto ' + (i + 1) + '">' +
      "</a>" +
      '<div class="carousel-caption d-none d-md-block"><small>' + it.caption + "</small></div>";
    carouselInner.appendChild(slide);

    var col = document.createElement("div");
    col.className = "col-auto thumb mb-2";
    col.innerHTML = '<a data-fancybox="gallery" href="' + it.src + '"><img src="' + it.src + '" alt="Mini ' + (i + 1) + '"/></a>';
    galleryThumbs.appendChild(col);
  }

  try { $("#galleryCarousel").carousel(); } catch (e) { }
}

/* ===== Countdown ===== */
function startCountdown(isoDate) {
  var target = new Date(isoDate).getTime();
  if (isNaN(target)) return;
  var liveRegion = document.getElementById("countdown");
  if (liveRegion) liveRegion.setAttribute("aria-live", "polite");

  var iv;
  function tick() {
    var now = Date.now();
    var diff = Math.max(0, target - now);
    var s = Math.floor(diff / 1000);
    var days = Math.floor(s / (3600 * 24));
    var hours = Math.floor((s % (3600 * 24)) / 3600);
    var minutes = Math.floor((s % 3600) / 60);
    var seconds = s % 60;

    var d = document.getElementById("cd-days"); if (d) d.textContent = days;
    var h = document.getElementById("cd-hours"); if (h) h.textContent = String(hours).padStart(2, "0");
    var m = document.getElementById("cd-mins"); if (m) m.textContent = String(minutes).padStart(2, "0");
    var sec = document.getElementById("cd-secs"); if (sec) sec.textContent = String(seconds).padStart(2, "0");

    if (diff <= 0) {
      clearInterval(iv);
      var cd = document.getElementById("countdown");
      if (cd) cd.innerHTML = '<p role="status">¡Feliz Cumpleaños, ' + KID_NAME + '!</p>';
    }
  }
  tick();
  iv = setInterval(tick, 1000);
}

/* ===== RSVP helpers ===== */
function initRsvp() {
  var openMain = document.getElementById("openFormBtnMain");

  var shareWhats = document.getElementById("shareWhats");
  var copyLinkBtn = document.getElementById("copyLinkBtn");
  if (shareWhats) {
    var text = encodeURIComponent("Invitación al cumple de " + KID_NAME + "! 🎉 — " + location.href);
    shareWhats.href = "https://wa.me/?text=" + text;
  }
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener("click", function () {
      navigator.clipboard.writeText(location.href).then(function () {
        var notice = document.getElementById("copyNotice");
        if (notice) {
          notice.style.display = "block";
          setTimeout(function () { notice.style.display = "none"; }, 2600);
        }
      }).catch(function (e) { alert("No se pudo copiar el enlace: " + e); });
    });
  }

  var confettiBtn = document.getElementById("confettiBtn");
  if (confettiBtn) {
    confettiBtn.addEventListener("click", function () {
      if (confettiEngine && typeof confettiEngine.fire === "function") confettiEngine.fire(120);
      var msg = document.getElementById("afterRsvpMsg");
      if (msg) { msg.style.display = "block"; setTimeout(function () { msg.style.display = "none"; }, 3800); }
    });
  }
}

/* ===== Confetti engine ===== */
function createConfettiEngine(canvasId) {
  var canvas = document.getElementById(canvasId);
  if (!canvas) return null;
  var ctx = canvas.getContext("2d");
  var w = 0, h = 0, particles = [];
  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  window.addEventListener("resize", resize); resize();

  function newParticle() {
    var colors = ['#ffd6e8', '#ffd9f0', '#f6d8ff', '#fff0f6', '#ffd6ea'];
    return {
      x: Math.random() * w,
      y: -10 - Math.random() * 100,
      vx: (Math.random() - 0.5) * 6,
      vy: 2 + Math.random() * 4,
      size: 6 + Math.random() * 8,
      rot: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 10,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }

  var raf = 0;
  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06;
      p.rot += p.vrot;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }
    particles = particles.filter(function (p) { return p.y < h + 60; });
    if (particles.length > 0) raf = requestAnimationFrame(frame);
    else { cancelAnimationFrame(raf); canvas.style.display = "none"; }
  }

  return {
    fire: function (count) {
      count = (typeof count === "number" ? count : 80);
      for (var i = 0; i < count; i++) particles.push(newParticle());
      canvas.style.display = "block";
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(frame);
    }
  };
}

function setupAudioToggle() {
  var audio = document.getElementById("bgAudio");
  var toggle = document.getElementById("audioToggle");
  var volumeControl = document.getElementById("audioVolume");

  if (!toggle || !audio) return;
  if (AUDIO_SRC) audio.src = AUDIO_SRC;

  audio.play().then(function () {
    syncAudioIcons(true);
  }).catch(function () {
    syncAudioIcons(false);
  });

  toggle.addEventListener("click", function () {
    if (audio.paused) {
      audio.play().then(function () {
        syncAudioIcons(true);
      }).catch(function (err) {
        console.warn("Autoplay bloqueado incluso al click:", err);
      });
    } else {
      audio.pause();
      syncAudioIcons(false);
    }
  });

  if (volumeControl) {
    audio.volume = (typeof volumeControl.value !== "undefined" ? volumeControl.value : 1);
    volumeControl.addEventListener("input", function () {
      audio.volume = volumeControl.value;
    });
  }

  audio.addEventListener("play", function () { syncAudioIcons(true); });
  audio.addEventListener("pause", function () { syncAudioIcons(false); });
  audio.addEventListener("ended", function () { syncAudioIcons(false); });
}

function syncAudioIcons(isPlaying) {
  var playI = document.getElementById("audioPlay");
  var pauseI = document.getElementById("audioPause");
  var toggle = document.getElementById("audioToggle");
  if (!playI || !pauseI || !toggle) return;

  if (isPlaying) {
    playI.classList.add("hidden");
    pauseI.classList.remove("hidden");
    toggle.setAttribute("aria-pressed", "true");
  } else {
    playI.classList.remove("hidden");
    pauseI.classList.add("hidden");
    toggle.setAttribute("aria-pressed", "false");
  }
}


/* ==== Portada ==== */
var portadaMedia = document.querySelector(".portada-media");
if (portadaMedia && PORTADA_BG) portadaMedia.style.backgroundImage = "url('" + PORTADA_BG + "')";

var delfi = document.getElementById("delfiPhoto");
if (delfi && HERO_PHOTO) delfi.src = HERO_PHOTO;

var partyIcon = document.getElementById("partyIcon");
if (partyIcon) partyIcon.src = PARTY_ICON;

var portadaInner = document.querySelector(".portada-inner");
if (portadaInner) setTimeout(function () { portadaInner.classList.add("visible"); }, 280);

/* ==== Link mapa ==== */
var comoLlegar = document.getElementById("comoLlegar");
if (comoLlegar) comoLlegar.href = "https://maps.app.goo.gl/8hMPPE5CuvhBQKms6";


  /* ==== Galería ==== */
  var galleryImgs = [
    { src: 'assets/1.webp', caption: 'En la panza de mi mami' },
    { src: 'assets/2.webp', caption: 'Mis primeras fotos profesionales' },
    { src: 'assets/3.webp', caption: 'Explorando el mundo' },
    { src: 'assets/4.webp', caption: 'Mis primeras pascuas' },
    { src: 'assets/5.webp', caption: 'Mi momento favorito del día' },
    { src: 'assets/6.webp', caption: 'Primer parque con mami' },
    { src: 'assets/7.webp', caption: 'Modo fachera' },
    { src: 'assets/8.webp', caption: 'Relajo con papi' },
    { src: 'assets/9.webp', caption: 'Mi primer show' },
    { src: 'assets/10.webp', caption: 'Jugando en el jardin' },
    { src: 'assets/11.webp', caption: 'Princesita' },
    { src: 'assets/12.webp', caption: 'Gracias por ser parte de mi vida' }

  ];
  loadGallery(galleryImgs);

