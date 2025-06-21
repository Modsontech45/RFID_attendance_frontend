
function getCookie(name) {
  const parts = `; ${document.cookie}`.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(";").shift() : null;
}


const role = getCookie("role");
if (role === "teacher") {
  document.querySelectorAll(".teacher-only").forEach(el => el.classList.remove("hidden"));
  document.querySelectorAll(".teacher-access-denied").forEach(el => el.classList.add("hidden"));
}

let studentsData = [];




async function fetchStudents() {
  const errorMessage = document.getElementById("errormessage");
  try {
    const res = await fetch("https://rfid-attendancesystem-backend-project.onrender.com/api/students");
    if (!res.ok) throw new Error(`Server responded with status ${res.status}`);

    studentsData = await res.json();
    renderStudents(studentsData);

    if (errorMessage) {
      errorMessage.textContent = "";
      errorMessage.classList.add("hidden");
    }
  } catch (err) {
    console.error("Error fetching students:", err);
    if (errorMessage) {
      errorMessage.textContent = "Failed to fetch students. Server might be down.";
      errorMessage.classList.remove("hidden");
      errorMessage.classList.add("text-red-600", "bg-red-100", "p-2", "rounded");
    }
  }
}


function renderStudents(students) {
  const tbody = document.getElementById("studentsBody");
  const formFilter = document.getElementById("formFilter").value.toLowerCase();
  const searchQuery = document.getElementById("searchInput").value.toLowerCase();
  tbody.innerHTML = "";

  const filtered = students.filter(
    (s) =>
      (!formFilter || s.form?.toLowerCase() === formFilter) &&
      (!searchQuery || s.name?.toLowerCase().includes(searchQuery))
  );

  filtered.forEach((student) => {
    const row = document.createElement("tr");
    row.className = "hover:bg-gray-100 cursor-pointer";
    row.innerHTML = `
      <td class="px-4 py-2">${student.name}</td>
      <td class="px-4 py-2">${student.uid}</td>
      <td class="px-4 py-2">${student.email}</td>
      <td class="px-4 py-2">${student.telephone}</td>
      <td class="px-4 py-2">${student.form}</td>
      <td class="px-4 py-2">${student.gender || "-"}</td>
    `;
    row.addEventListener("click", () => openModal(student.uid));
    tbody.appendChild(row);
  });

  const total = filtered.length;
  const males = filtered.filter(s => s.gender?.toLowerCase() === "male").length;
  const females = filtered.filter(s => s.gender?.toLowerCase() === "female").length;

  document.getElementById("totalStudents").textContent = total;
  document.getElementById("maleCount").textContent = males;
  document.getElementById("femaleCount").textContent = females;
  document.getElementById("malePercent").textContent = total ? ((males / total) * 100).toFixed(1) : 0;
  document.getElementById("femalePercent").textContent = total ? ((females / total) * 100).toFixed(1) : 0;
}


function openModal(uid) {
  document.getElementById("oldUid").value = uid;
  document.getElementById("newUid").value = "";

  const msg = document.getElementById("uidUpdateMessage");
  if (msg) {
    msg.className = "mt-4 p-3 rounded-md text-center hidden";
    msg.textContent = "";
  }

  document.getElementById("modalOverlay").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modalOverlay").classList.add("hidden");
}

document.getElementById("close").addEventListener("click", closeModal);


async function updateStudentUid(oldUid, newUid) {
  if (getCookie("role") !== "admin") {
    window.location.href = "/pages/users/access-denied.html";
    return;
  }

  const messageDiv = document.getElementById("uidUpdateMessage");
  const updateBtn = document.getElementById("updateUidBtn");
  const spinner = document.getElementById("spinner");

  // Reset message
  messageDiv.className = "mt-4 p-3 rounded-md text-center hidden";
  messageDiv.textContent = "";
  spinner.classList.remove("hidden");
  updateBtn.disabled = true;

  try {
    const res = await fetch(
      `https://rfid-attendancesystem-backend-project.onrender.com/api/students/${oldUid}/update-uid`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newUid }),
      }
    );
    const data = await res.json();

    if (res.ok) {
      messageDiv.textContent = data.message || "UID updated successfully!";
      messageDiv.classList.add("bg-green-100", "text-green-800");
      fetchStudents();
    } else {
      messageDiv.textContent = data.error || "An unknown error occurred.";
      messageDiv.classList.add("bg-red-100", "text-red-800");
    }
  } catch (error) {
    messageDiv.textContent = "Network error. Please try again.";
    messageDiv.classList.add("bg-red-100", "text-red-800");
  } finally {
    spinner.classList.add("hidden");
    updateBtn.disabled = false;
    messageDiv.classList.remove("hidden");
  }
}

// Event bindings
document.getElementById("formFilter").addEventListener("change", () => renderStudents(studentsData));
document.getElementById("searchInput").addEventListener("input", () => renderStudents(studentsData));

document.getElementById("updateUidForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const oldUid = document.getElementById("oldUid").value.trim();
  const newUid = document.getElementById("newUid").value.trim();

  if (!oldUid || !newUid) {
    alert("Please enter both current and new UIDs.");
    return;
  }

  const confirmed = confirm(`Change UID from "${oldUid}" to "${newUid}"?`);
  if (confirmed) await updateStudentUid(oldUid, newUid);
});

// Load students on page ready
window.addEventListener("DOMContentLoaded", fetchStudents);


const langSelect = document.getElementById('langSelect');

function getNestedValue(obj, path) {
  console.log(`Getting nested value for path: "${path}"`);
  const parts = path.split('.');
  return parts.reduce((acc, part) => {
    console.log(`  - Checking part "${part}" on`, acc);
    return acc && acc[part];
  }, obj);
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
