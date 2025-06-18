function loadPageLoader() {
  fetch('/partials/loader.html') // fetch the loader partial
    .then(res => res.text())
    .then(html => {
      document.body.insertAdjacentHTML('beforeend', html); // insert into page
    });
}

function showLoader() {
  const loader = document.getElementById('pageLoader');
  if (loader) loader.style.display = 'flex';
}

function hideLoader() {
  const loader = document.getElementById('pageLoader');
  if (loader) loader.style.display = 'none';
}

document.addEventListener("DOMContentLoaded", loadPageLoader);
