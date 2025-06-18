const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('navMenu');

menuBtn.addEventListener('click', () => {
  navMenu.classList.toggle('mobile-active');
});


navMenu.querySelectorAll('a, button.logoutBtn').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('mobile-active');
  });
});


document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && e.target !== menuBtn) {
    navMenu.classList.remove('mobile-active');
  }
});



//student