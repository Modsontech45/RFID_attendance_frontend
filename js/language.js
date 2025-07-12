const langSelect = document.getElementById('langSelect');

function getNestedValue(obj, path) {
  console.log(`Getting nested value for path: "${path}"`);
  const parts = path.split('.');
  return parts.reduce((acc, part) => {
    console.log(`  - Checking part "${part}" on`, acc);
    return acc && acc[part];
  }, obj);
}
function getSelectedLanguage() {
  return localStorage.getItem('lang') || 'en';
}

async function setLanguage(lang) {
  console.log(`Setting language to: ${lang}`);

  try {
    const res = await fetch(`/locales/${lang}.json`);
    const translations = await res.json();

    console.log("Loaded translations:", translations);

    const elements = document.querySelectorAll('[data-i18n], [data-i18n-placeholder]');
    console.log(`Found ${elements.length} elements with i18n attributes`);

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

    // Handle floating comments if present
    if (translations.home && translations.home.floating_comments) {
      window.floatingComments = translations.home.floating_comments;
    } else {
      window.floatingComments = null;
      if (typeof floatingCommentsContainer !== 'undefined') {
        floatingCommentsContainer.innerHTML = '';
      }
    }

    localStorage.setItem('lang', lang);
    langSelect.value = lang;
    console.log(`Language "${lang}" saved to localStorage and applied.`);
  } catch (err) {
    console.error('Error loading language:', err);
  }
}

// Listen for language changes
langSelect.addEventListener('change', (e) => {
  const selectedLang = e.target.value;
  console.log(`Language selected: ${selectedLang}`);
  setLanguage(selectedLang);
});

// On page load, set language from localStorage or default to English
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('lang') || 'en';
  console.log(`Saved language on load: ${savedLang}`);
  setLanguage(savedLang);
  langSelect.value = savedLang;
  console.log(`Select element value on load set to: ${savedLang}`);
});


if (!langSelect) {
  const select = document.createElement('select');
  select.id = 'langSelect';
  select.innerHTML = `
    <option value="en">English</option>
    <option value="fr">Français</option>
  `;
  document.body.appendChild(select);
}
