/* Light/dark theme + collapsible sidebar, shared by every page */
(function () {
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  root.setAttribute("data-theme", saved === "dark" ? "dark" : "light");

  document.addEventListener("DOMContentLoaded", function () {
    var themeBtn = document.getElementById("themeToggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try { localStorage.setItem("theme", next); } catch (e) {}
      });
    }

    var page = document.getElementById("homePage");
    var sideBtn = document.getElementById("sidebarToggle");
    if (page && sideBtn) {
      sideBtn.addEventListener("click", function () {
        var closed = page.classList.toggle("sidebar-closed");
        sideBtn.innerHTML = closed ? "&gt;" : "&lt;";
        sideBtn.setAttribute("aria-expanded", String(!closed));
        sideBtn.setAttribute("aria-label", closed ? "Open menu" : "Close menu");
      });
    }
  });
})();

/* Draggable background: drag any empty part of the page to move the picture.
   Double-click an empty spot to put it back. */
(function () {
  var IMG = "bg.jpg";
  var ZOOM = 1.5;                 // how much bigger than the screen the picture is
  var root = document.documentElement;
  var nat = null;                 // natural size of the picture
  var pos = { fx: 0.5, fy: 0.5 }; // position as a 0..1 fraction of the movable range
  var size = { w: 0, h: 0 };

  try {
    var saved = JSON.parse(localStorage.getItem("bgPos"));
    if (saved && typeof saved.fx === "number" && typeof saved.fy === "number") { pos = saved; }
  } catch (e) {}

  function clamp(v) { return Math.min(1, Math.max(0, v)); }

  function apply() {
    if (!nat) { return; }
    var vw = window.innerWidth, vh = window.innerHeight;
    var scale = Math.max(vw * ZOOM / nat.w, vh * ZOOM / nat.h);
    size.w = nat.w * scale;
    size.h = nat.h * scale;
    root.style.setProperty("--bg-w", size.w + "px");
    root.style.setProperty("--bg-h", size.h + "px");
    root.style.setProperty("--bg-x", -(size.w - vw) * pos.fx + "px");
    root.style.setProperty("--bg-y", -(size.h - vh) * pos.fy + "px");
  }

  function savePos() {
    try { localStorage.setItem("bgPos", JSON.stringify(pos)); } catch (e) {}
  }

  var img = new Image();
  img.onload = function () {
    nat = { w: img.naturalWidth, h: img.naturalHeight };
    apply();
  };
  img.src = IMG;
  window.addEventListener("resize", apply);

  // Things that should keep working normally instead of starting a drag
  var BLOCK = "button, input, select, textarea, a, label, table, .Card, .Intro, .Positions, .Menu-Bar, .Sidebar-Toggle, .Theme-Toggle";

  var drag = null;

  document.addEventListener("pointerdown", function (e) {
    if (!nat || e.button !== 0 || e.target.closest(BLOCK)) { return; }
    drag = { x: e.clientX, y: e.clientY, fx: pos.fx, fy: pos.fy };
    document.body.classList.add("dragging-bg");
  });

  document.addEventListener("pointermove", function (e) {
    if (!drag) { return; }
    var rangeX = size.w - window.innerWidth;
    var rangeY = size.h - window.innerHeight;
    // Dragging right moves the picture right, so the offset fraction goes down
    pos.fx = clamp(drag.fx - (e.clientX - drag.x) / (rangeX || 1));
    pos.fy = clamp(drag.fy - (e.clientY - drag.y) / (rangeY || 1));
    apply();
  });

  function stop() {
    if (!drag) { return; }
    drag = null;
    document.body.classList.remove("dragging-bg");
    savePos();
  }
  document.addEventListener("pointerup", stop);
  document.addEventListener("pointercancel", stop);

  document.addEventListener("dblclick", function (e) {
    if (e.target.closest(BLOCK)) { return; }
    pos = { fx: 0.5, fy: 0.5 };
    apply();
    savePos();
  });
})();