const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('navMenu');
const menuBtn2 = document.getElementById('menuBtn2');
const navMenu2 = document.getElementById('navMenu2');

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
menuBtn2.addEventListener('click', () => {
  navMenu2.classList.toggle('mobile-active');
});

// Close menu when clicking links or logout button inside nav
navMenu2.querySelectorAll('a, button.logoutBtn').forEach(link => {
  link.addEventListener('click', () => {
    navMenu2.classList.remove('mobile-active');
  });
});

// Optional: Close nav if clicked outside nav and not on menu button
document.addEventListener('click', (e) => {
  if (!navMenu2.contains(e.target) && e.target !== menuBtn2) {
    navMenu2.classList.remove('mobile-active');
  }
});