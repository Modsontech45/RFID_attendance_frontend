const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
  navMenu.classList.remove("max-sm:hidden");
  navMenu.classList.toggle("max-sm:translate-x-full");
});

// Close on link click (mobile only)
navMenu.querySelectorAll("a, button.logoutBtn").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 640) {
      navMenu.classList.add("max-sm:translate-x-full");
      setTimeout(() => navMenu.classList.add("max-sm:hidden"), 300);
    }
  });
});

// Optional: click outside to close
document.addEventListener("click", (e) => {
  if (
    window.innerWidth < 640 &&
    !navMenu.contains(e.target) &&
    e.target !== menuBtn
  ) {
    navMenu.classList.add("max-sm:translate-x-full");
    setTimeout(() => navMenu.classList.add("max-sm:hidden"), 300);
  }
});
