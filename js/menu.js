const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('navMenu');
const menuBtn2 = document.getElementById('menuBtn2');
const navMenu2 = document.getElementById('navMenu2');

if (menuBtn && navMenu) {
  menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('mobile-active');
  });

  navMenu.querySelectorAll('a, button.logoutBtn').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-active');
    });
  });
}

if (menuBtn2 && navMenu2) {
  menuBtn2.addEventListener('click', () => {
    navMenu2.classList.toggle('mobile-active');
  });

  navMenu2.querySelectorAll('a, button.logoutBtn').forEach(link => {
    link.addEventListener('click', () => {
      navMenu2.classList.remove('mobile-active');
    });
  });
}

document.addEventListener('click', (e) => {
  if (navMenu && !navMenu.contains(e.target) && e.target !== menuBtn) {
    navMenu.classList.remove('mobile-active');
  }
  if (navMenu2 && !navMenu2.contains(e.target) && e.target !== menuBtn2) {
    navMenu2.classList.remove('mobile-active');
  }
});
