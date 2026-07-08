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
/* ═══════════════════════════════════════════════════════
   SPEAKER BIO MODAL
   ═══════════════════════════════════════════════════════ */
const speakers = {
  jd: {
    name: 'Jesudamilare "JD" Adesegun-David',
    role: "Co-founder & CEO, Ennovate Lab",
    img: "/speaker-jd.jpg",
    bio: `<p>Jesudamilare "JD" Adesegun-David is a Thought Alchemist and Community Transformation Strategist. He is co-founder and CEO of Ennovate Lab, an Innovation Hub and Startup Foundry committed to building resilient innovation ecosystems in underserved university communities.</p>
    <p>JD believes the future of Africa is to be found in its secondary cities — building not in Lagos or Abuja, but in Ogbomoso, a city many overlook. He describes his life's work as "designing redemptive futures for people and places the world overlooks."</p>
    <p>A graduate of Agronomy and a Teach with Africa Fellow (South Africa), he has been recognized by YNaija in its New Establishment List and his work featured by Radical, Ziwani, African Blockchain Institute, and Charter Cities Institute among others.</p>
    <p>In 2024, he launched the Brave Redemptive Fellowship — a 9-month fully-funded residential programme. In 2025, he led the opening of the first purpose-built innovation park in Ogbomoso, The Assembly. That same year, he was named on Chude Jideonwo's #TheJoy150 — a definitive list of the most interesting people shaping culture across Africa.</p>
    <p>He is married to Temitayo and they are blessed with four amazing children.</p>`,
  },
  victor: {
    name: "Adekunle Victor",
    role: "CMO, Genomac & Lead Marketer, Certifyer",
    img: "/speaker-victor.jpg",
    bio: `<p>Adekunle Victor is a Business and Marketing Strategist, Content Writer, and Growth Professional currently serving as the Chief Marketing Officer at Genomac — where he has contributed to impacting over 120,000+ people across 120+ countries — and Lead Marketer at Certifyer.</p>
    <p>He specializes in business growth, helping founders, professionals, and organizations build visibility and drive meaningful results through real strategies. Over the years, he has assisted 30+ businesses in creating high-impact strategies that strengthened brand presence, generated leads, and drove business opportunities across different industries.</p>
    <p>His experience spans storytelling, demand generation, and growth-focused marketing campaigns. Passionate about business, building sustainable enterprises, and leveraging AI as a tool for innovation and growth, Adekunle is committed to helping brands and professionals transform ideas into influence, systems, and long-term impact.</p>`,
  },
  abayomi: {
    name: "Abayomi-Perez",
    role: "Startup Ecosystem Catalyst & Impact Consultant",
    img: "/speaker-abayomi.jpeg",
    bio: `<p>Abayomi-Perez is a startup ecosystem catalyst, development and impact consultant, and agripreneur with impact footprints in over 30 countries across Africa, Europe, and the U.S. He considers his greatest gift to be the ability to inspire people, build systems, and solve complex problems through wisdom.</p>
    <p>Over the past 15 years, he has dedicated his life to active service across diverse capacities and international organizations, impacting over 100,000 people within Nigeria and beyond.</p>
    <p>He currently serves at Ennovate Lab, leading the marketing team and consulting on portfolio projects. He also serves as a consultant to the YMCA Africa Headquarters in Nairobi, supporting impact tracking across 24 African countries. In addition, he is Co-founder of Avra Agric, a subsidiary of Avra Ventures.</p>
    <p>He resides in Ogbomoso with his dear wife, and a community of brave hearts committed to doing great work that positively impacts the world.</p>`,
  },
  bori: {
    name: "Olubori Paul",
    role: "Founder, GO Holdings & Finance Coach",
    img: "/speaker-bori.jpeg",
    bio: `<p>Olubori Paul is a visionary businessman, finance coach, and mentor whose life mission is simple: to ensure that the next generation doesn't just survive the economy, but owns it. Known for his "Chaos to Clarity" approach, he has dedicated his career to turning financial confusion into a roadmap for freedom.</p>
    <p>As the founder of GO Holdings, Paul doesn't just teach wealth — he creates it. Through subsidiaries like Go-Digits, GoRealtyandhomes, GoFarms, GOmum, and GOkids, he has trained over 5,000 forex traders and helped more than 1,500 individuals become landowners.</p>
    <p>His impact is global — recognized as a Mandela Washington Fellow and a West Africa Youth Ambassador, with academic roots stretching from the University of Uyo to the Roxbourg Institute in Switzerland and the University of Notre Dame in the USA.</p>
    <p>Through his NextGen Youth Entrepreneurship Fellowship, he provides the funding and mentorship young people need to break cycles of poverty and build sustainable businesses.</p>`,
  },
  samuel: {
    name: "Samuel Ojelade",
    role: "Leadership & Personal Development Advocate",
    img: "/speaker-samuel.png",
    bio: `<p>Samuel Ojelade is a leadership and personal development advocate with a passion for helping people pursue excellence, discover purpose, and maximize opportunities through knowledge. For over a decade, he has served in various leadership capacities — organizing academic tutorials, leading student and faith-based organizations, and mentoring aspiring writers.</p>
    <p>He graduated with distinction from Ladoke Akintola University of Technology (LAUTECH) with a degree in Physiology. Following his NYSC, he was selected as a National Health Fellow, representing Obafemi-Owode Local Government Area at the national level, earning the Award of Diligence from the Ogun State health sector.</p>
    <p>Samuel is the author of <em>Purpose, Plan and Portion</em> — a book that inspires readers to embrace intentional living and purpose-driven leadership. Beyond his work in leadership and public health, he is a business professional with interests in investment and enterprise development.</p>`,
  },
};

 /* ═══════════════════════════════════════════════════════
   SPEAKER BIO MODAL
   ═══════════════════════════════════════════════════════ */
const modal = document.getElementById('bio-modal')
const modalImg = document.getElementById('modal-img')
const modalName = document.getElementById('modal-name')
const modalRole = document.getElementById('modal-role')
const modalBio = document.getElementById('modal-bio')
const modalClose = document.getElementById('modal-close')
const modalCard = modal.querySelector('.modal-card')

document.querySelectorAll('.speaker-card').forEach(card => {
  card.addEventListener('click', () => {
    const key = card.dataset.speaker
    const s = speakers[key]
    if (!s) return
    modalImg.src = s.img
    modalImg.alt = s.name
    modalName.textContent = s.name
    modalRole.textContent = s.role
    modalBio.innerHTML = s.bio
    modal.classList.add('open')
    document.body.style.overflow = 'hidden'
    modalCard.scrollTop = 0
    if (typeof lenis !== 'undefined') lenis.stop()
  })
})

function closeModal() {
  modal.classList.remove('open')
  document.body.style.overflow = ''
  if (typeof lenis !== 'undefined') lenis.start()
}

modalClose.addEventListener('click', closeModal)
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal()
})
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal()
})

// Fix iOS touch scrolling inside modal
let touchStartY = 0
modalCard.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY
}, { passive: true })

modalCard.addEventListener('touchmove', (e) => {
  const touchY = e.touches[0].clientY
  const scrollTop = modalCard.scrollTop
  const scrollHeight = modalCard.scrollHeight
  const clientHeight = modalCard.clientHeight

  const atTop = scrollTop <= 0 && touchY > touchStartY
  const atBottom = scrollTop + clientHeight >= scrollHeight && touchY < touchStartY

  if (atTop || atBottom) {
    e.preventDefault()
  }
}, { passive: false })