import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

/* ═══════════════════════════════════════════════════════
   1. LENIS SMOOTH SCROLL
   ═══════════════════════════════════════════════════════ */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
})

function raf(time) {
  lenis.raf(time)
  ScrollTrigger.update()
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Anchor links work with Lenis
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault()
    const target = document.querySelector(anchor.getAttribute('href'))
    if (target) lenis.scrollTo(target, { offset: -76 })
  })
})

/* ═══════════════════════════════════════════════════════
   2. NAVBAR — scroll behaviour
   ═══════════════════════════════════════════════════════ */
const navbar = document.getElementById('navbar')

ScrollTrigger.create({
  start: 'top -80',
  onEnter: () => navbar.classList.add('scrolled'),
  onLeaveBack: () => navbar.classList.remove('scrolled'),
})

// Hamburger mobile menu
const hamburger = document.getElementById('hamburger')
const mobileMenu = document.getElementById('mobile-menu')

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open')
})

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'))
})

/* ═══════════════════════════════════════════════════════
   3. HERO ENTRANCE ANIMATION (timeline)
   ═══════════════════════════════════════════════════════ */
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })

heroTl
  .to('.hero-label', { opacity: 1, y: 0, duration: 0.7, delay: 0.3 })
  .to('#ht1', { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
  .to('#ht2', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
  .to('#ht3', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
  .to('#ht4', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
  .to('#hero-tagline', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
  .to('#hero-meta', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
  .to('#hero-ctas', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
  .to('#hero-countdown', { opacity: 1, x: 0, duration: 0.9, ease: 'power2.out' }, '-=0.6')
  .to('#hero-scroll', { opacity: 1, duration: 0.5 }, '-=0.3')

/* ═══════════════════════════════════════════════════════
   4. LIVE COUNTDOWN TIMER
   ═══════════════════════════════════════════════════════ */
const eventDate = new Date('2026-08-01T09:00:00').getTime()

function pad(n) { return String(n).padStart(2, '0') }

function updateCountdown() {
  const now = Date.now()
  const diff = eventDate - now

  if (diff <= 0) {
    document.getElementById('cd-days').textContent  = '00'
    document.getElementById('cd-hours').textContent = '00'
    document.getElementById('cd-mins').textContent  = '00'
    document.getElementById('cd-secs').textContent  = '00'
    return
  }

  const days  = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const secs  = Math.floor((diff % (1000 * 60)) / 1000)

  const daysEl  = document.getElementById('cd-days')
  const hoursEl = document.getElementById('cd-hours')
  const minsEl  = document.getElementById('cd-mins')
  const secsEl  = document.getElementById('cd-secs')

  // Flip animation on change
  function flipUpdate(el, val) {
    const newVal = pad(val)
    if (el.textContent !== newVal) {
      gsap.to(el, {
        y: -10, opacity: 0, duration: 0.15,
        onComplete: () => {
          el.textContent = newVal
          gsap.fromTo(el, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.15 })
        }
      })
    }
  }

  flipUpdate(daysEl, days)
  flipUpdate(hoursEl, hours)
  flipUpdate(minsEl, mins)
  flipUpdate(secsEl, secs)
}

updateCountdown()
setInterval(updateCountdown, 1000)

/* ═══════════════════════════════════════════════════════
   5. SCROLL ANIMATIONS — ABOUT
   ═══════════════════════════════════════════════════════ */
// Section labels + headlines
gsap.utils.toArray('.gs-label').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    opacity: 0, x: -20, duration: 0.6, ease: 'power2.out'
  })
})

gsap.utils.toArray('.gs-headline').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 85%' },
    opacity: 0, y: 40, duration: 0.9, ease: 'power3.out'
  })
})

gsap.utils.toArray('.gs-body, .gs-body-light').forEach(el => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 88%' },
    opacity: 0, y: 24, duration: 0.7, ease: 'power2.out'
  })
})

// Stats count-up
gsap.utils.toArray('.gs-stat').forEach((tile, i) => {
  gsap.from(tile, {
    scrollTrigger: { trigger: tile, start: 'top 88%' },
    opacity: 0, y: 30, duration: 0.6, delay: i * 0.1, ease: 'power2.out'
  })

  const numEl = tile.querySelector('.stat-num')
  const target = parseInt(numEl.dataset.target)
  const suffix = numEl.dataset.suffix || ''
  const prefix = numEl.dataset.prefix

  if (!prefix && target) {
    ScrollTrigger.create({
      trigger: numEl,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: function () {
            numEl.textContent = Math.round(this.targets()[0].val) + suffix
          }
        })
      }
    })
  }
})

/* ═══════════════════════════════════════════════════════
   6. SCROLL ANIMATIONS — SPEAKERS
   ═══════════════════════════════════════════════════════ */
gsap.utils.toArray('.gs-card').forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: { trigger: card, start: 'top 88%' },
    opacity: 0, y: 50, duration: 0.8, delay: i * 0.15, ease: 'power3.out'
  })
})

/* ═══════════════════════════════════════════════════════
   7. SCROLL ANIMATIONS — AGENDA TIMELINE
   ═══════════════════════════════════════════════════════ */
// Draw the timeline track
gsap.to('.timeline-track', {
  scrollTrigger: {
    trigger: '.agenda-timeline',
    start: 'top 75%',
    end: 'bottom 80%',
    scrub: 1,
  },
  scaleY: 1,
  ease: 'none',
})

// Stagger agenda items
gsap.utils.toArray('.gs-agenda').forEach((item, i) => {
  gsap.to(item, {
    scrollTrigger: { trigger: item, start: 'top 88%' },
    opacity: 1, x: 0, duration: 0.6, delay: i * 0.06, ease: 'power2.out'
  })
})

/* ═══════════════════════════════════════════════════════
   8. SCROLL ANIMATIONS — HIGHLIGHTS
   ═══════════════════════════════════════════════════════ */
gsap.from('.gs-highlights', {
  scrollTrigger: { trigger: '.gs-highlights', start: 'top 85%' },
  opacity: 0, y: 40, duration: 0.9, ease: 'power3.out'
})

/* ═══════════════════════════════════════════════════════
   9. SCROLL ANIMATIONS — SPONSORS
   ═══════════════════════════════════════════════════════ */
gsap.utils.toArray('.gs-tiers .sponsor-tier-card').forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: { trigger: card, start: 'top 88%' },
    opacity: 0, y: 30, duration: 0.6, delay: i * 0.1, ease: 'power2.out'
  })
})

gsap.from('.gs-vendor', {
  scrollTrigger: { trigger: '.gs-vendor', start: 'top 88%' },
  opacity: 0, y: 24, duration: 0.7, ease: 'power2.out'
})

/* ═══════════════════════════════════════════════════════
   10. SCROLL ANIMATIONS — REGISTER FORM
   ═══════════════════════════════════════════════════════ */
gsap.from('.gs-form', {
  scrollTrigger: { trigger: '.gs-form', start: 'top 85%' },
  opacity: 0, x: 40, duration: 0.9, ease: 'power3.out'
})
