/**
 * ================================================================
 * PAWFECT CARE v2 — script.js
 * Modules:
 *   1.  Sticky navbar
 *   2.  Mobile nav toggle
 *   3.  Smooth anchor scroll
 *   4.  Active nav link highlight
 *   5.  Scroll-reveal (IntersectionObserver)
 *   6.  Counter animation
 *   7.  Adoption listings (dynamic cards + filter)
 *   8.  Service modal
 *   9.  Contact form validation + submission
 *   10. Scroll-to-top button
 * ================================================================
 */

"use strict";

/* ---------------------------------------------------------------
   UTILITY — debounce
--------------------------------------------------------------- */
function debounce(fn, ms) {
  let id;
  return function (...args) {
    clearTimeout(id);
    id = setTimeout(() => fn.apply(this, args), ms);
  };
}

/* ---------------------------------------------------------------
   UTILITY — query helpers
--------------------------------------------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ================================================================
   1. STICKY NAVBAR
================================================================ */
(function stickyNav() {
  const navbar = $("#navbar");
  if (!navbar) return;

  function update() {
    navbar.classList.toggle("scrolled", window.scrollY > 10);
  }

  window.addEventListener("scroll", debounce(update, 8), { passive: true });
  update();
})();

/* ================================================================
   2. MOBILE NAV TOGGLE
================================================================ */
(function mobileNav() {
  const toggle = $("#navToggle");
  const drawer = $("#mobileNav");
  if (!toggle || !drawer) return;

  let isOpen = false;

  function open() {
    isOpen = true;
    toggle.setAttribute("aria-expanded", "true");
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    isOpen = false;
    toggle.setAttribute("aria-expanded", "false");
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  toggle.addEventListener("click", () => (isOpen ? close() : open()));

  // Close on link click
  $$("[data-nav-close]", drawer).forEach((el) =>
    el.addEventListener("click", close),
  );

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (isOpen && !drawer.contains(e.target) && !toggle.contains(e.target)) {
      close();
    }
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) {
      close();
      toggle.focus();
    }
  });

  // Close on resize to desktop width
  window.addEventListener(
    "resize",
    debounce(() => {
      if (window.innerWidth > 960 && isOpen) close();
    }, 150),
  );
})();

/* ================================================================
   3. SMOOTH ANCHOR SCROLLING
================================================================ */
(function smoothScroll() {
  const NAV_H = 72; // px — matches --nav-h

  document.addEventListener("click", (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const id = anchor.getAttribute("href");
    if (id === "#" || id === "#top") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - NAV_H;
    window.scrollTo({ top, behavior: "smooth" });
  });
})();

/* ================================================================
   4. ACTIVE NAV LINK
================================================================ */
(function activeNav() {
  const sections = $$("section[id], main[id]");
  const links = $$(".nav-link");
  if (!links.length) return;

  function update() {
    let current = "";
    sections.forEach((sec) => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 90) current = sec.id;
    });
    links.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === `#${current}`);
    });
  }

  window.addEventListener("scroll", debounce(update, 60), { passive: true });
  update();
})();

/* ================================================================
   5. SCROLL-REVEAL
================================================================ */
(function scrollReveal() {
  const els = $$(".reveal");
  if (!els.length) return;

  // Respect reduced-motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  els.forEach((el) => io.observe(el));
})();

/* ================================================================
   6. COUNTER ANIMATION
================================================================ */
(function counters() {
  const items = $$(".counter");
  if (!items.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const display = el.dataset.display || target + suffix;
    const isLarge = target >= 1000; // e.g. "12K+" — show as K
    const duration = 1600; // ms
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const value = target * eased;

      if (isLarge && target >= 1000) {
        // Format large numbers as "K"
        el.textContent = Math.round(value / 1000) + "K" + suffix;
      } else {
        el.textContent = Math.round(value) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = display; // Snap to exact final value
      }
    }

    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  items.forEach((el) => io.observe(el));
})();

/* ================================================================
   7. ADOPTION LISTINGS
================================================================ */
(function adoptionListings() {
  const grid = $("#adoptGrid");
  if (!grid) return;

  /* ---- Data --------------------------------------------------- */
  const pets = [
    {
      id: 1,
      name: "Rex",
      breed: "Golden Retriever",
      age: "2 Months",
      type: "dog",
      shelter: "Mr & Ms Pet",
      emoji: "🐕",
      image: "Pets/Rex.webp",
      vaccinated: true,
      neutered: true,
    },
    {
      id: 2,
      name: "Milky",
      breed: "Domestic Shorthair",
      age: "1 year",
      type: "cat",
      shelter: "Mr & Ms Pet",
      emoji: "🐈",
      image: "Pets/Milky.jpg",
      vaccinated: true,
      neutered: true,
    },
    {
      id: 3,
      name: "Lance",
      breed: "Shit Tzu",
      age: "8 months",
      type: "dog",
      shelter: "Mr & Ms Pet",
      emoji: "🐕",
      image: "Pets/Lance.jpg",
      /* Empty string triggers emoji fallback */ vaccinated: true,
      neutered: true,
    },
    {
      id: 4,
      name: "Minne",
      breed: "Ragdoll",
      age: "2 years",
      type: "cat",
      shelter: "Adopt a Pet",
      emoji: "🐱",
      image: "Pets/Minnie.Webp",
      vaccinated: true,
      neutered: true,
    },
    {
      id: 5,
      name: "Cookie",
      breed: "Labra",
      age: "6 months",
      type: "other",
      shelter: "The Pet Nest",
      emoji: "🐰",
      image: "Pets/Cookie.jpeg",
      vaccinated: true,
      neutered: true,
    },
    {
      id: 6,
      name: "Dollar",
      breed: "Mixed Breed",
      age: "1 year",
      type: "dog",
      shelter: "Adopt a Pet",
      emoji: "🐩",
      image: "Pets/Dollar.webp",
      vaccinated: true,
      neutered: true,
    },
    {
      id: 7,
      name: "Snowflake",
      breed: "White Persian",
      age: "3 years",
      type: "cat",
      shelter: "Heads Up for Tails",
      emoji: "🐈",
      image: "Pets/Snowflake.png",
      vaccinated: true,
      neutered: true,
    },
    {
      id: 8,
      name: "Butterscotch",
      breed: "Guinea Pig",
      age: "8 months",
      type: "other",
      shelter: "Mr & Ms Pet",
      emoji: "🐹",
      image: "Pets/Butterscotch.webp",
      vaccinated: true,
      neutered: true,
    },
    {
      id: 9,
      name: "Myra",
      breed: "Mixed Breed",
      age: "2 Months",
      type: "dog",
      shelter: "Adopt a Pet",
      emoji: "🐶",
      image: "Pets/Myra.jpg",
      vaccinated: true,
      neutered: true,
    },
  ];

  let currentFilter = "all";

  /* ---- Render ------------------------------------------------- */

  function renderCard(pet) {
    const card = document.createElement("article");
    card.className = "adopt-card";
    card.dataset.type = pet.type;

    // Conditionally generate the visual content (Image vs. Emoji)
    const visualContent = pet.image
      ? `<img src="${pet.image}" alt="${pet.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit; display: block;" />`
      : pet.emoji;

    // Handle accessibility attributes cleanly
    const iconAria = pet.image
      ? 'aria-hidden="true"' // Img alt tag handles screen readers
      : `role="img" aria-label="${pet.name} icon"`;

    card.innerHTML = `
     <div className="adopt-card-body">
        <div class="adopt-card-icon" ${iconAria} style="${pet.image ? "overflow: hidden; padding: 0;" : ""}">
          ${visualContent}
        </div>
        <div class="adopt-card-meta" style="flex:1;min-width:0;">
          <h3 class="adopt-card-name">${pet.name}</h3>
          <div class="adopt-card-info">
            <span>${pet.breed}</span>
            <span style="color:var(--border-strong);user-select:none">·</span>
            <span>${pet.age}</span>
          </div>
          <div style="display:flex;gap:.4rem;flex-wrap:wrap;margin-top:.5rem;">
            ${pet.vaccinated ? '<span class="adopt-card-badge" style="color:#15803d;background:#f0fdf4;border-color:#bbf7d0;">Vaccinated</span>' : ""}
            ${pet.neutered ? '<span class="adopt-card-badge" style="color:#1d4ed8;background:#eff6ff;border-color:#bfdbfe;">Neutered</span>' : ""}
          </div>
        </div>
      </div>
      <div class="adopt-card-footer">
        <span class="adopt-card-shelter">${pet.shelter}</span>
        <button
          class="btn btn-outline"
          style="font-size:.78rem;padding:.35rem .9rem;"
          data-adopt-id="${pet.id}"
          aria-label="View details for ${pet.name}"
        >View Details</button>
      </div>
    `;
    
    return card;
  }
  

  function renderAll(filter) {
    // Clear skeletons and previous cards
    grid.innerHTML = "";
    const filtered =
      filter === "all" ? pets : pets.filter((p) => p.type === filter);

    if (filtered.length === 0) {
      grid.innerHTML = `
        <p style="grid-column:1/-1;text-align:center;color:var(--ink-4);padding:3rem 0;font-size:.9rem;">
          No pets found for this filter.
        </p>`;
      return;
    }

    filtered.forEach((pet, i) => {
      const card = renderCard(pet);
      // Stagger entry
      card.style.opacity = "0";
card.style.transform = "translateY(16px)";
card.style.transition = `opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s`;

grid.appendChild(card);

requestAnimationFrame(() => {
  card.style.opacity = "1";
  card.style.transform = "translateY(0)";
       });
      });
    };
  

  /* ---- Filters ----------------------------------------------- */
  $$(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;
      $$(".filter-btn").forEach((b) => b.classList.toggle("active", b === btn));
      renderAll(currentFilter);
    });
  });

  /* ---- "View Details" → adoption modal ----------------------- */
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-adopt-id]");
    if (!btn) return;
    const pet = pets.find((p) => p.id === Number(btn.dataset.adoptId));
    if (!pet) return;
    openAdoptModal(pet);
  });

  function openAdoptModal(pet) {
    const content = `
      <div class="modal-body">
        <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;">
          .adopt-card-icon {
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.adopt-card-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
          <div>
            <h2 class="modal-title" id="modalTitle" style="font-size:1.6rem;margin-bottom:.2rem;">${pet.name}</h2>
            <p style="font-size:.85rem;color:var(--ink-4);">${pet.breed} · ${pet.age}</p>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;margin-bottom:1.5rem;">
          <div style="background:var(--paper-2);border:1px solid var(--border);border-radius:var(--r-md);padding:.85rem 1rem;">
            <p style="font-size:.7rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-5);margin-bottom:.3rem;">Shelter</p>
            <p style="font-size:.88rem;font-weight:500;color:var(--ink);">${pet.shelter}</p>
          </div>
          <div style="background:var(--paper-2);border:1px solid var(--border);border-radius:var(--r-md);padding:.85rem 1rem;">
            <p style="font-size:.7rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-5);margin-bottom:.3rem;">Status</p>
            <p style="font-size:.88rem;font-weight:500;color:#15803d;">Available</p>
          </div>
          <div style="background:var(--paper-2);border:1px solid var(--border);border-radius:var(--r-md);padding:.85rem 1rem;">
            <p style="font-size:.7rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-5);margin-bottom:.3rem;">Vaccinated</p>
            <p style="font-size:.88rem;font-weight:500;color:var(--ink);">${pet.vaccinated ? "Yes ✓" : "Pending"}</p>
          </div>
          <div style="background:var(--paper-2);border:1px solid var(--border);border-radius:var(--r-md);padding:.85rem 1rem;">
            <p style="font-size:.7rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-5);margin-bottom:.3rem;">Neutered</p>
            <p style="font-size:.88rem;font-weight:500;color:var(--ink);">${pet.neutered ? "Yes ✓" : "No"}</p>
          </div>
        </div>

        <p style="font-size:.875rem;color:var(--ink-4);line-height:1.75;margin-bottom:1.5rem;">
          ${pet.name} is a loving ${pet.breed.toLowerCase()} currently in the care of ${pet.shelter}. 
          This pet has been health-checked and is ready for a loving forever home. 
          Adoption includes a post-placement support call at 1 week and 1 month.
        </p>

        <div class="modal-cta">
          <a href="#contact" class="btn btn-primary btn-lg" id="modalAdoptCta">
            Start Adoption
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <button class="btn btn-ghost btn-lg" id="modalAdoptClose">Close</button>
        </div>
      </div>
    `;

    const modalContent = $("#modalContent");
    if (modalContent) modalContent.innerHTML = content;
    openModal();

    // Wire up inner close
    const innerClose = $("#modalAdoptClose");
    if (innerClose) innerClose.addEventListener("click", closeModal);

    // Wire up CTA → close modal and scroll to contact
    const cta = $("#modalAdoptCta");
    if (cta) {
      cta.addEventListener("click", (e) => {
        closeModal();
        // Scroll handled by smooth anchor listener
      });
    }
  }

  // Kick off initial render
  renderAll("all");
})();

/* ================================================================
   8. SERVICE MODAL
================================================================ */
(function serviceModal() {
  const overlay = $("#modalOverlay");
  const modal = $("#modal");
  if (!overlay || !modal) return;

  /* ---- Service data ------------------------------------------- */
  const serviceData = {
    grooming: {
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
      title: "Pet Grooming",
      subtitle:
        "Professional grooming services for all breeds and sizes, delivered by certified pet stylists.",
      features: [
        "Full bath, blow-dry and breed-standard cuts",
        "Nail trimming, ear cleaning and de-shedding",
        "Coat condition treatments and flea baths",
        "Home visit or in-salon appointments",
        "Post-groom health note provided",
      ],
      price: "Starting from ₹499 · Pricing varies by breed size",
    },
    vet: {
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>`,
      title: "Vet Consultation",
      subtitle:
        "Licensed veterinarians available for video and in-clinic consultations, 7 days a week.",
      features: [
        "Video and in-clinic appointment options",
        "Routine check-ups, vaccinations and diagnostics",
        "Digital prescription and pharmacy delivery",
        "Specialist referrals when needed",
        "Full health record management",
      ],
      price: "Starting from ₹299 · Video consults available same-day",
    },
    adoption: {
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
      title: "Pet Adoption",
      subtitle:
        "A transparent, support-first adoption process connecting you with verified shelters worldwide.",
      features: [
        "Curated listings from verified, licensed shelters",
        "Health-checked and vaccinated pets where possible",
        "Guided application with shelter communication",
        "Post-adoption support at 1 week and 1 month",
        "Zero platform fee for adopters",
      ],
      price:
        "Adoption process is free · Some shelters may charge a nominal fee",
    },
    emergency: {
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
      title: "Emergency Care",
      subtitle:
        "24/7 critical care network — because emergencies don't respect business hours.",
      features: [
        "24/7 on-call emergency veterinarians",
        "Ambulance dispatch in covered metro areas",
        "ICU and surgical facilities at partner clinics",
        "Immediate triage guidance over video",
        "Instant location-based clinic finder",
      ],
      price: "Emergency consultations from ₹199 · Clinic fees vary by case",
    },
  };

  /* ---- Open / close ------------------------------------------ */
  function openModal() {
    overlay.setAttribute("aria-hidden", "false");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    // Focus the close button
    const closeBtn = $("#modalClose");
    if (closeBtn) setTimeout(() => closeBtn.focus(), 50);
  }

  function closeModal() {
    overlay.setAttribute("aria-hidden", "true");
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Expose for adoption modal too
  window._openModal = openModal;
  window._closeModal = closeModal;

  /* ---- Service card trigger ----------------------------------- */
  $$(".service-card").forEach((card) => {
    function handleActivate() {
      const key = card.dataset.service;
      const data = serviceData[key];
      if (!data) return;

      const featureHTML = data.features
        .map(
          (f) =>
            `<div class="modal-feature"><div class="modal-feature-dot"></div><span>${f}</span></div>`,
        )
        .join("");

      const content = `
        <div class="modal-body">
          <div class="modal-icon" aria-hidden="true">${data.icon}</div>
          <h2 class="modal-title" id="modalTitle">${data.title}</h2>
          <p class="modal-subtitle">${data.subtitle}</p>
          <div class="modal-features">${featureHTML}</div>
          <div class="modal-cta">
            <a href="#contact" class="btn btn-primary btn-lg" id="modalServiceCta">
              Book Now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <button class="btn btn-ghost btn-lg" id="modalServiceClose">Close</button>
          </div>
          <p class="modal-pricing">${data.price}</p>
        </div>
      `;

      const modalContent = $("#modalContent");
      if (modalContent) modalContent.innerHTML = content;
      openModal();

      // Wire inner buttons
      const closeInner = $("#modalServiceClose");
      if (closeInner) closeInner.addEventListener("click", closeModal);

      const ctaInner = $("#modalServiceCta");
      if (ctaInner) ctaInner.addEventListener("click", closeModal);
    }

    card.addEventListener("click", handleActivate);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleActivate();
      }
    });
  });

  /* ---- Close triggers ---------------------------------------- */
  $("#modalClose").addEventListener("click", closeModal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) {
      closeModal();
    }
  });
})();

// Patch open/close refs for adoption modal (set after serviceModal runs)
function openModal() {
  if (window._openModal) window._openModal();
}
function closeModal() {
  if (window._closeModal) window._closeModal();
}

/* ================================================================
   9. CONTACT FORM VALIDATION & SUBMISSION
================================================================ */
(function contactForm() {
  const form = $("#contactForm");
  const submitBtn = $("#cfSubmit");
  const successEl = $("#cfSuccess");
  if (!form || !submitBtn || !successEl) return;

  /* ---- Validators -------------------------------------------- */
  const rules = {
    "cf-name": {
      errorId: "cf-name-err",
      validate(v) {
        if (!v.trim()) return "Name is required.";
        if (v.trim().length < 2) return "Name must be at least 2 characters.";
        return "";
      },
    },
    "cf-email": {
      errorId: "cf-email-err",
      validate(v) {
        if (!v.trim()) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
          return "Enter a valid email address.";
        return "";
      },
    },
    "cf-message": {
      errorId: "cf-message-err",
      validate(v) {
        if (!v.trim()) return "Message is required.";
        if (v.trim().length < 10)
          return "Message must be at least 10 characters.";
        return "";
      },
    },
  };

  function showError(fieldId, msg) {
    const input = $(`#${fieldId}`);
    const errorEl = $(`#${rules[fieldId].errorId}`);
    if (!input || !errorEl) return;
    input.classList.toggle("invalid", !!msg);
    errorEl.textContent = msg;
  }

  function validateField(fieldId) {
    const input = $(`#${fieldId}`);
    if (!input) return true;
    const msg = rules[fieldId].validate(input.value);
    showError(fieldId, msg);
    return !msg;
  }

  function validateAll() {
    return Object.keys(rules)
      .map((id) => validateField(id))
      .every(Boolean);
  }

  // Inline validation on blur / input
  Object.keys(rules).forEach((id) => {
    const el = $(`#${id}`);
    if (!el) return;
    el.addEventListener("blur", () => validateField(id));
    el.addEventListener("input", () => {
      if (el.classList.contains("invalid")) validateField(id);
    });
  });

  /* ---- Submit ------------------------------------------------- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      // Focus first invalid field
      const firstInvalid = form.querySelector(".invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Loading state
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    try {
      // Simulate API call (replace with real endpoint)
      await new Promise((resolve) => setTimeout(resolve, 1400));

      // Success
      submitBtn.style.display = "none";
      successEl.removeAttribute("hidden");
      form.reset();

      // Reset after 6 seconds
      setTimeout(() => {
        submitBtn.style.display = "";
        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;
        successEl.setAttribute("hidden", "");
      }, 6000);
    } catch (err) {
      // Graceful error handling
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
      console.error("Form submission error:", err);
    }
  });
})();

/* ================================================================
   10. SCROLL-TO-TOP BUTTON
================================================================ */
(function scrollTop() {
  const btn = $("#scrollTop");
  if (!btn) return;

  function update() {
    btn.classList.toggle("visible", window.scrollY > 500);
  }

  window.addEventListener("scroll", debounce(update, 80), { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  update();
})();

/* ================================================================
   INIT LOG
================================================================ */
console.info(
  "%cPawfect Care v2",
  "font-size:13px;font-weight:600;color:#E8824A;",
  "— All modules loaded. No errors. 🐾",
);
document.querySelectorAll(".whatsapp-btn").forEach((button) => {
  button.addEventListener("click", (e) => {
    const intent = e.target.getAttribute("data-intent");
    const phoneNumber = "9321521258"; // Your business number
    let message = "";

    // Route the message based on the user's intent
    switch (intent) {
      case "emergency":
        message = encodeURIComponent(
          "🚨 EMERGENCY: I need immediate vet assistance!",
        );
        break;
      case "general":
      default:
        message = encodeURIComponent(
          "Hi Pawfect Care, I have a question about your services.",
        );
        break;
    }

    // Open WhatsApp in a new tab
    const waUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  });
});
