/* ============================================================
   343ride — main.js
   1. Mobile drawer toggle
   2. Global scroll-reveal via IntersectionObserver
   No dependencies. No build step.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 1. Mobile drawer ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var drawer = document.getElementById("mobile-drawer");
  var backdrop = document.querySelector(".drawer-backdrop");

  // Localized menu labels, keyed off <html lang>
  var isDE = (document.documentElement.lang || "en").toLowerCase().indexOf("de") === 0;
  var LABELS = isDE
    ? { open: "Menü öffnen", close: "Menü schließen" }
    : { open: "Open menu", close: "Close menu" };

  function openDrawer() {
    drawer.hidden = false;
    backdrop.hidden = false;
    // next frame so the transition runs from the hidden state
    requestAnimationFrame(function () {
      drawer.classList.add("open");
      backdrop.classList.add("open");
    });
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", LABELS.close);
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    backdrop.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", LABELS.open);
    document.body.style.overflow = "";
    // hide after the transition completes
    window.setTimeout(function () {
      if (toggle.getAttribute("aria-expanded") === "false") {
        drawer.hidden = true;
        backdrop.hidden = true;
      }
    }, 320);
  }

  if (toggle && drawer && backdrop) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      open ? closeDrawer() : openDrawer();
    });

    backdrop.addEventListener("click", closeDrawer);

    // close when a drawer link is tapped
    drawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeDrawer);
    });

    // close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeDrawer();
      }
    });
  }

  /* ---------- 2. Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!("IntersectionObserver" in window) || reduceMotion) {
    revealEls.forEach(function (el) {
      el.classList.add("in");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
})();
