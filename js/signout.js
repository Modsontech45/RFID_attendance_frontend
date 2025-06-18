document.addEventListener("DOMContentLoaded", () => {
  const logoutButtons = document.querySelectorAll(".logoutBtn");
  logoutButtons.forEach(btn => {
    btn.onclick = logout;
  });
});

function getCookie(name) {
  const cookieStr = `; ${document.cookie}`;
  const parts = cookieStr.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function setCookie(name, value, days = 1) {
  const expires = new Date(Date.now() + days * 86400 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function deleteCookie(name) {
 
  setCookie(name, "", -1);
}

function logout() {
  deleteCookie("token");
  deleteCookie("role");
  window.location.href = "/index.html";
}
