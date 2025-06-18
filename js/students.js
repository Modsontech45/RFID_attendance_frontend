function getCookie(name) {
  const cookieStr = `; ${document.cookie}`;
  const parts = cookieStr.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

const role = getCookie("role");
if (role === "teacher") {
  const teacherElements = document.querySelectorAll(".teacher-only");
  teacherElements.forEach((el) => {
    el.classList.remove("hidden");
  });

  const teacherAccess = document.querySelectorAll(".teacher-access-denied");
  teacherAccess.forEach((el) => {
    el.classList.add("hidden");
  });
}
let studentsData = [];

async function fetchStudents() {
  const errorMessage = document.getElementById("errormessage");
  try {
    const res = await fetch(
      "https://rfid-attendancesystem-backend-project.onrender.com/api/students"
    );
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
      errorMessage.textContent =
        "Failed to fetch students. Server might be down.";
      errorMessage.classList.remove("hidden");
      errorMessage.classList.add(
        "text-red-600",
        "bg-red-100",
        "p-2",
        "rounded"
      );
    }
  }
}

function renderStudents(students) {
  const tbody = document.getElementById("studentsBody");
  const formFilter = document.getElementById("formFilter").value.toLowerCase();
  const searchQuery = document
    .getElementById("searchInput")
    .value.toLowerCase();
  tbody.innerHTML = "";

  const filtered = students.filter(
    (student) =>
      (!formFilter || student.form?.toLowerCase() === formFilter) &&
      (!searchQuery || student.name?.toLowerCase().includes(searchQuery))
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
  const males = filtered.filter(
    (s) => s.gender?.toLowerCase() === "male"
  ).length;
  const females = filtered.filter(
    (s) => s.gender?.toLowerCase() === "female"
  ).length;
  document.getElementById("totalStudents").textContent = total;
  document.getElementById("maleCount").textContent = males;
  document.getElementById("femaleCount").textContent = females;
  document.getElementById("malePercent").textContent = total
    ? ((males / total) * 100).toFixed(1)
    : 0;
  document.getElementById("femalePercent").textContent = total
    ? ((females / total) * 100).toFixed(1)
    : 0;
}

function openModal(uid) {
  document.getElementById("oldUid").value = uid;
  document.getElementById("newUid").value = "";
  const msg = document.getElementById("uidUpdateMessage");
  msg.classList.add("hidden");
  msg.textContent = "";
  document.getElementById("modalOverlay").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modalOverlay").classList.add("hidden");
}

document.getElementById("close").addEventListener("click", closeModal);

async function updateStudentUid(oldUid, newUid) {
  const role = getCookie("role");
  if (role !== "admin") {
    window.location.href = "/pages/users/access-denied.html";
    return;
  }

  const messageDiv = document.getElementById("uidUpdateMessage");
  const updateBtn = document.getElementById("updateUidBtn");
  const spinner = document.getElementById("spinner");

  messageDiv.classList.add("hidden");
  messageDiv.textContent = "";
  messageDiv.classList.remove(
    "bg-green-100",
    "text-green-800",
    "bg-red-100",
    "text-red-800"
  );

  spinner.classList.remove("hidden");
  updateBtn.disabled = true;

  try {
    const response = await fetch(
      `https://rfid-attendancesystem-backend-project.onrender.com/api/students/${oldUid}/update-uid`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newUid }),
      }
    );

    const data = await response.json();
    if (response.ok) {
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

document
  .getElementById("formFilter")
  .addEventListener("change", () => renderStudents(studentsData));
document
  .getElementById("searchInput")
  .addEventListener("input", () => renderStudents(studentsData));

document
  .getElementById("updateUidForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const oldUid = document.getElementById("oldUid").value.trim();
    const newUid = document.getElementById("newUid").value.trim();
    if (!oldUid || !newUid)
      return alert("Please enter both current and new UIDs.");
    const confirmed = confirm(`Change UID from "${oldUid}" to "${newUid}"?`);
    if (confirmed) await updateStudentUid(oldUid, newUid);
  });

window.addEventListener("DOMContentLoaded", fetchStudents);
