
/* --- Utility: split text into word spans --- */
function blurTextify(el, baseDelay = 0, delayStep = 100) {
  const html = el.innerHTML;
  // preserve <em> tags
  const parts = [];
  const regex = /(<br\s*\/?>|<em>[^<]*<\/em>|[^\s<]+)/g;
  let last = 0, match;
  while ((match = regex.exec(html)) !== null) {
    if (match.index > last) {
      // spaces between
      parts.push({ type: 'space', text: html.slice(last, match.index) });
    }
    parts.push({ type: 'word', text: match[0] });
    last = match.index + match[0].length;
  }
  if (last < html.length) parts.push({ type: 'space', text: html.slice(last) });

  let wordIdx = 0;
  el.innerHTML = parts.map(p => {
    if (p.type === 'space') return p.text;
    // pass through <br> tags without wrapping
    if (/^<br/i.test(p.text)) return p.text;
    const delay = baseDelay + wordIdx * delayStep;
    wordIdx++;
    return `<span class="blur-word" style="transition-delay:${delay}ms">${p.text}</span>`;
  }).join('');
  el.style.opacity = '1';
}

/* --- Hero: apply BlurText to title on load --- */
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) blurTextify(heroTitle, 200, 120);

/* --- Hero load-in sequence --- */
function heroLoadIn() {
  const eyebrow = document.querySelector('.hero-eyebrow');
  const sub      = document.querySelector('.hero-sub');
  const btns     = document.querySelector('.hero-btns');
  const badge    = document.querySelector('.hero-badge');
  const words    = document.querySelectorAll('.hero-title .blur-word');

  // Eyebrow: fade up after 100ms
  setTimeout(() => {
    if (eyebrow) {
      eyebrow.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      eyebrow.style.transform = 'translateY(16px)';
      requestAnimationFrame(() => {
        setTimeout(() => {
          eyebrow.style.opacity = '1';
          eyebrow.style.transform = 'translateY(0)';
        }, 50);
      });
    }
  }, 100);

  // Title words
  words.forEach(w => w.classList.add('visible'));

  // Subtext: blur-in at 800ms
  setTimeout(() => {
    if (sub) {
      sub.style.transition = 'opacity 0.6s ease, filter 0.6s ease, transform 0.6s ease';
      sub.style.filter = 'blur(10px)';
      sub.style.transform = 'translateY(20px)';
      requestAnimationFrame(() => {
        setTimeout(() => {
          sub.style.opacity = '1';
          sub.style.filter = 'blur(0px)';
          sub.style.transform = 'translateY(0)';
        }, 50);
      });
    }
  }, 800);

  // Buttons: blur-in at 1100ms
  setTimeout(() => {
    if (btns) {
      btns.style.transition = 'opacity 0.6s ease, filter 0.6s ease, transform 0.6s ease';
      btns.style.filter = 'blur(10px)';
      btns.style.transform = 'translateY(20px)';
      requestAnimationFrame(() => {
        setTimeout(() => {
          btns.style.opacity = '1';
          btns.style.filter = 'blur(0px)';
          btns.style.transform = 'translateY(0)';
        }, 50);
      });
    }
  }, 1100);

  // Badge: fade up at 1400ms
  setTimeout(() => {
    if (badge) {
      badge.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      badge.style.transform = 'translateX(-50%) translateY(12px)';
      requestAnimationFrame(() => {
        setTimeout(() => {
          badge.style.opacity = '1';
          badge.style.transform = 'translateX(-50%) translateY(0)';
        }, 50);
      });
    }
  }, 1400);
}

// Fire after a short paint delay
requestAnimationFrame(() => setTimeout(heroLoadIn, 60));

/* --- Nav compact on scroll --- */
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
}, { passive: true });

/* --- IntersectionObserver factory --- */
function makeObserver(threshold = 0.15) {
  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold });
}

const obs        = makeObserver(0.15);
const obsEarly   = makeObserver(0.05);

/* --- Apply BlurText to section headings on scroll --- */
document.querySelectorAll('.section-title').forEach(el => {
  blurTextify(el, 0, 90);
  el.style.opacity = '0'; // hide until observed
  const wordObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.querySelectorAll('.blur-word').forEach((w, i) => {
          setTimeout(() => w.classList.add('visible'), i * 90);
        });
        wordObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  wordObs.observe(el);
});

/* --- Section labels & dividers --- */
document.querySelectorAll('.section-label, .divider').forEach(el => obs.observe(el));

/* --- Generic reveal: section-sub, cal-text, eval-desc --- */
document.querySelectorAll('.section-sub, .cal-text, .cal-sub, .cal-steps, .eval-desc, .placeholder-hint').forEach(el => {
  el.classList.add('reveal');
  obs.observe(el);
});

/* --- Stagger: service cards --- */
document.querySelectorAll('.service-card').forEach((el, i) => {
  el.classList.add('stagger-child');
  el.style.transitionDelay = (i * 80) + 'ms';
  obsEarly.observe(el);
});

/* --- Stagger: eval steps --- */
document.querySelectorAll('.eval-step').forEach((el, i) => {
  el.classList.add('stagger-child');
  el.style.transitionDelay = (i * 100) + 'ms';
  obs.observe(el);
});

/* --- Stagger: gallery cells --- */
document.querySelectorAll('.gal-cell').forEach((el, i) => {
  el.classList.add('stagger-child');
  el.style.transitionDelay = (i * 70) + 'ms';
  obsEarly.observe(el);
});

/* --- Stagger: review cards (dentro del carrusel, no se observan) --- */
document.querySelectorAll('.reviews-track .review-card:nth-child(-n+5)').forEach((el, i) => {
  el.classList.add('stagger-child');
  el.style.transitionDelay = (i * 110) + 'ms';
  obs.observe(el);
});

/* --- Reveal: agenda & contact blocks --- */
document.querySelectorAll('.calendar-embed, .contact-btn, .hero-badge').forEach(el => {
  el.classList.add('reveal');
  obs.observe(el);
});

/* --- Stagger: contact buttons --- */
document.querySelectorAll('.contact-btn').forEach((el, i) => {
  el.classList.remove('reveal');
  el.classList.add('stagger-child');
  el.style.transitionDelay = (i * 100) + 'ms';
  obs.observe(el);
});

/* --- Reveal: footer --- */
const footer = document.querySelector('footer');
if (footer) { footer.classList.add('reveal'); obsEarly.observe(footer); }
