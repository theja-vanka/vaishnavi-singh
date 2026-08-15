// Vaishnavi Singh — profile site
// Plain vanilla JS, no dependencies.

document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close mobile menu after a link is tapped
    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Highlight the current section in the nav while scrolling
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll(".nav-links a");

  function setActiveLink() {
    var scrollPos = window.scrollY + 120;
    var current = null;

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  }

  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  // Gentle reveal-on-scroll for sections
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) { yearEl.textContent = new Date().getFullYear(); }
});
