  const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('navMenu');

menuBtn.addEventListener('click', () => {
  navMenu.classList.remove('hidden');
  navMenu.classList.toggle('translate-x-full');
});

// Close on link click (mobile only)
navMenu.querySelectorAll('a, button.logoutBtn').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 640) {
      navMenu.classList.add('translate-x-full');
      setTimeout(() => navMenu.classList.add('hidden'), 300);
    }
  });
});

// Optional: click outside to close
document.addEventListener('click', (e) => {
  if (window.innerWidth < 640 &&
      !navMenu.contains(e.target) &&
      e.target !== menuBtn) {
    navMenu.classList.add('translate-x-full');
    setTimeout(() => navMenu.classList.add('hidden'), 300);
  }
});

