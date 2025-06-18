document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  // Optional: Close menu if clicking outside (desktop usability)
  document.addEventListener("click", (e) => {
    if (
      !mobileMenu.contains(e.target) &&
      !menuBtn.contains(e.target) &&
      !mobileMenu.classList.contains("hidden")
    ) {
      mobileMenu.classList.add("hidden");
    }
  });
});
