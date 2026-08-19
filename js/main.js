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

  // ---------- Explore My Work — gallery lightbox ----------
  var galleries = {
    "diagnostic-audit-work": { title: "Diagnostic & Audit Work", count: 3 },
    "classroom-observation": { title: "Classroom Observation", count: 4 },
    "educator-voices": { title: "Educator Voices", count: 2 },
    "professional-learning": { title: "Professional Learning", count: 1 }
  };

  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var lbImage = lightbox.querySelector(".lightbox-image");
    var lbTitle = lightbox.querySelector(".lightbox-title");
    var lbCounter = lightbox.querySelector(".lightbox-counter");
    var lbDialog = lightbox.querySelector(".lightbox-dialog");
    var lbStage = lightbox.querySelector("[data-lightbox-stage]");
    var lbPrev = lightbox.querySelector("[data-lightbox-prev]");
    var lbNext = lightbox.querySelector("[data-lightbox-next]");
    var lbZoomIn = lightbox.querySelector("[data-lightbox-zoom-in]");
    var lbZoomOut = lightbox.querySelector("[data-lightbox-zoom-out]");
    var lbZoomReset = lightbox.querySelector("[data-lightbox-zoom-reset]");
    var lbDownload = lightbox.querySelector("[data-lightbox-download]");
    var closeEls = lightbox.querySelectorAll("[data-lightbox-close]");

    var currentKey = null;
    var currentIndex = 0;
    var lastFocused = null;
    var zoom = 1;
    var baseWidth = 0;
    var ZOOM_MIN = 1;
    var ZOOM_MAX = 3;
    var ZOOM_STEP = 0.5;

    function imagePath(key, n) {
      return "assets/gallery/" + key + "/" + n + ".jpg";
    }

    // transform:scale() doesn't grow an element's layout box, so it can't be
    // panned via overflow:auto. Zooming instead sets a real pixel width off
    // the image's natural "fit" size, which does grow the scrollable area.
    function setZoom(level) {
      zoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, level));
      if (zoom === 1 || !baseWidth) {
        lbImage.style.width = "";
        lbImage.style.maxWidth = "100%";
        lbImage.style.maxHeight = "76vh";
      } else {
        lbImage.style.maxWidth = "none";
        lbImage.style.maxHeight = "none";
        lbImage.style.width = Math.round(baseWidth * zoom) + "px";
      }
      lbStage.classList.toggle("is-zoomed", zoom > 1);
      lbZoomReset.textContent = Math.round(zoom * 100) + "%";
      lbZoomOut.disabled = zoom <= ZOOM_MIN;
      lbZoomIn.disabled = zoom >= ZOOM_MAX;
      lbStage.scrollLeft = (lbStage.scrollWidth - lbStage.clientWidth) / 2;
      lbStage.scrollTop = (lbStage.scrollHeight - lbStage.clientHeight) / 2;
    }

    function showImage() {
      var gallery = galleries[currentKey];
      baseWidth = 0;
      lbImage.src = imagePath(currentKey, currentIndex + 1);
      lbImage.alt = gallery.title + " — image " + (currentIndex + 1) + " of " + gallery.count;
      lbTitle.textContent = gallery.title;
      lbCounter.textContent = (currentIndex + 1) + " / " + gallery.count;
      lbPrev.disabled = gallery.count <= 1;
      lbNext.disabled = gallery.count <= 1;
      setZoom(1);
    }

    function openGallery(key, triggerEl) {
      if (!galleries[key]) { return; }
      currentKey = key;
      currentIndex = 0;
      lastFocused = triggerEl || document.activeElement;
      showImage();
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      lbDialog.focus();
    }

    function closeGallery() {
      lightbox.hidden = true;
      document.body.classList.remove("lightbox-open");
      lbImage.src = "";
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    }

    function step(delta) {
      var gallery = galleries[currentKey];
      if (!gallery || gallery.count <= 1) { return; }
      currentIndex = (currentIndex + delta + gallery.count) % gallery.count;
      showImage();
    }

    function downloadCurrentImage() {
      var gallery = galleries[currentKey];
      if (!gallery) { return; }
      var link = document.createElement("a");
      link.href = imagePath(currentKey, currentIndex + 1);
      link.download = currentKey + "-" + (currentIndex + 1) + ".jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // Capture the image's "fit" width once it loads — this is the 100% zoom baseline
    lbImage.addEventListener("load", function () {
      if (zoom === 1) {
        baseWidth = lbImage.getBoundingClientRect().width;
      }
    });

    document.querySelectorAll("[data-gallery]").forEach(function (card) {
      card.addEventListener("click", function () {
        openGallery(card.getAttribute("data-gallery"), card);
      });
    });

    closeEls.forEach(function (el) {
      el.addEventListener("click", closeGallery);
    });
    lbPrev.addEventListener("click", function () { step(-1); });
    lbNext.addEventListener("click", function () { step(1); });
    lbZoomIn.addEventListener("click", function () { setZoom(zoom + ZOOM_STEP); });
    lbZoomOut.addEventListener("click", function () { setZoom(zoom - ZOOM_STEP); });
    lbZoomReset.addEventListener("click", function () { setZoom(1); });
    lbDownload.addEventListener("click", downloadCurrentImage);

    // Double-click / double-tap the image to toggle zoom
    lbImage.addEventListener("dblclick", function () {
      setZoom(zoom > 1 ? 1 : 2);
    });

    // Drag-to-pan with the mouse while zoomed in
    var isPanning = false;
    var panStartX = 0;
    var panStartY = 0;
    var panScrollX = 0;
    var panScrollY = 0;
    lbStage.addEventListener("mousedown", function (e) {
      if (zoom <= 1) { return; }
      isPanning = true;
      panStartX = e.clientX;
      panStartY = e.clientY;
      panScrollX = lbStage.scrollLeft;
      panScrollY = lbStage.scrollTop;
      e.preventDefault();
    });
    window.addEventListener("mousemove", function (e) {
      if (!isPanning) { return; }
      lbStage.scrollLeft = panScrollX - (e.clientX - panStartX);
      lbStage.scrollTop = panScrollY - (e.clientY - panStartY);
    });
    window.addEventListener("mouseup", function () { isPanning = false; });

    // Swipe to move between images on touch devices (only while not zoomed —
    // when zoomed, the touch gesture is left free for panning/scrolling instead)
    var touchStartX = 0;
    var touchStartY = 0;
    var touchActive = false;
    lbStage.addEventListener("touchstart", function (e) {
      if (zoom > 1 || e.touches.length !== 1) { touchActive = false; return; }
      touchActive = true;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    lbStage.addEventListener("touchend", function (e) {
      if (!touchActive) { return; }
      touchActive = false;
      var dx = e.changedTouches[0].clientX - touchStartX;
      var dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        step(dx < 0 ? 1 : -1);
      }
    }, { passive: true });

    document.addEventListener("keydown", function (e) {
      if (lightbox.hidden) { return; }
      if (e.key === "Escape") { closeGallery(); }
      if (e.key === "ArrowLeft") { step(-1); }
      if (e.key === "ArrowRight") { step(1); }
      if (e.key === "+" || e.key === "=") { setZoom(zoom + ZOOM_STEP); }
      if (e.key === "-" || e.key === "_") { setZoom(zoom - ZOOM_STEP); }
    });
  }

  // ---------- TEDx — click-to-play YouTube facade ----------
  document.querySelectorAll("[data-tedx-play]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var wrap = btn.closest(".explore-tedx");
      var videoId = btn.getAttribute("data-video-id");
      if (!wrap || !videoId) { return; }

      var iframe = document.createElement("iframe");
      iframe.className = "explore-tedx-frame";
      iframe.src = "https://www.youtube-nocookie.com/embed/" + videoId + "?autoplay=1&rel=0";
      iframe.title = "TEDx talk by Vaishnavi Singh";
      iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
      iframe.setAttribute("allowfullscreen", "");
      iframe.loading = "lazy";

      wrap.innerHTML = "";
      wrap.appendChild(iframe);
    });
  });

  // ---------- Case studies carousel ----------
  var caseTrack = document.querySelector("[data-case-track]");
  if (caseTrack) {
    var caseCards = Array.prototype.slice.call(caseTrack.children);
    var casePrev = document.querySelector("[data-case-prev]");
    var caseNext = document.querySelector("[data-case-next]");
    var caseDots = Array.prototype.slice.call(document.querySelectorAll("[data-case-dot]"));

    function caseGoTo(index) {
      index = Math.max(0, Math.min(index, caseCards.length - 1));
      caseCards[index].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    }

    function updateCaseState() {
      // Find the card whose left edge is closest to the track's own left edge
      var trackLeft = caseTrack.getBoundingClientRect().left;
      var closest = 0;
      var closestDist = Infinity;
      caseCards.forEach(function (card, i) {
        var dist = Math.abs(card.getBoundingClientRect().left - trackLeft);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      caseDots.forEach(function (dot, i) { dot.classList.toggle("is-active", i === closest); });
      if (casePrev) { casePrev.disabled = closest === 0; }
      if (caseNext) { caseNext.disabled = closest === caseCards.length - 1; }
    }

    if (casePrev) {
      casePrev.addEventListener("click", function () {
        var current = caseDots.findIndex(function (d) { return d.classList.contains("is-active"); });
        caseGoTo(current - 1);
      });
    }
    if (caseNext) {
      caseNext.addEventListener("click", function () {
        var current = caseDots.findIndex(function (d) { return d.classList.contains("is-active"); });
        caseGoTo(current + 1);
      });
    }
    caseDots.forEach(function (dot, i) {
      dot.addEventListener("click", function () { caseGoTo(i); });
    });

    var caseScrollTimer;
    caseTrack.addEventListener("scroll", function () {
      clearTimeout(caseScrollTimer);
      caseScrollTimer = setTimeout(updateCaseState, 100);
    }, { passive: true });
    window.addEventListener("resize", updateCaseState);
    updateCaseState();
  }
});
