const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('navMenu');

menuBtn.addEventListener('click', () => {
  navMenu.classList.toggle('mobile-active');
});

// Optional: close menu when clicking outside or on a link
navMenu.querySelectorAll('a, button.logoutBtn').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('mobile-active');
  });
});

// Optional: close menu if clicked outside navMenu
document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && e.target !== menuBtn) {
    navMenu.classList.remove('mobile-active');
  }
});
