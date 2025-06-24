const langSelect = document.getElementById('langSelect') || createLanguageSelector();

function createLanguageSelector() {
  const select = document.createElement('select');
  select.id = 'langSelect';
  select.className = 'hidden';
  select.innerHTML = `
    <option value="en">English</option>
    <option value="fr">Français</option>
  `;
  document.body.appendChild(select);
  return select;
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

async function setLanguage(lang) {
  try {
    const res = await fetch(`/locales/${lang}.json`);
    const translations = await res.json();

    const elements = document.querySelectorAll('[data-i18n], [data-i18n-placeholder]');

    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const placeholderKey = el.getAttribute('data-i18n-placeholder');

      if (key) {
        const text = getNestedValue(translations, key);
        if (text) el.textContent = text;
      }

      if (placeholderKey) {
        const placeholderText = getNestedValue(translations, placeholderKey);
        if (placeholderText) el.setAttribute('placeholder', placeholderText);
      }
    });

    localStorage.setItem('lang', lang);
    langSelect.value = lang;
  } catch (err) {
    console.error('Error loading language file:', err);
  }
}

langSelect.addEventListener('change', () => {
  setLanguage(langSelect.value);
});

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('lang') || 'en';
  langSelect.value = savedLang;
  setLanguage(savedLang);
});
