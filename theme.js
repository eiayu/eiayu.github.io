(function () {
  var root = document.documentElement;
  var savedTheme = null;
  try {
    savedTheme = localStorage.getItem("theme");
  } catch (error) {
  }
  root.setAttribute("data-theme", savedTheme === "dark" ? "dark" : "light");
  function initializePageControls() {
    var themeBtn = document.getElementById("themeToggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", function () {
        var nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", nextTheme);
        try {
          localStorage.setItem("theme", nextTheme);
        } catch (error) {
        }
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
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializePageControls);
  } else {
    initializePageControls();
  }
})();
