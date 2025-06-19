// googleTranslate.js

// Read the user's selected language from the cookie
function getSavedLanguage() {
  const match = document.cookie.match(/(?:^|; )googtrans=\/[a-z]{2}\/([a-z]{2})/);
  return match ? match[1] : null;
}

// Initialize the Google Translate widget
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: 'en',
      includedLanguages: 'en,fr,es,de,pt', // customize if needed
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    },
    'google_translate_element'
  );
}

// Load the translate script dynamically
(function () {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  document.head.appendChild(script);
})();
