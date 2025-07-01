let chartInstance = null;
let studentsRefreshIntervalId = null;
let allStudentData = [];

const downloadOptions = document.getElementById("downloadOptions");

function getCookie(name) {
  const cookieStr = `; ${document.cookie}`;
  const parts = cookieStr.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}
// Role-based UI control
function handleRoleVisibility() {
  const role = getCookie("role");
  if (role === "teacher") {
    document.querySelectorAll(".teacher-only").forEach(el => el.classList.remove("hidden"));
    document.querySelectorAll(".teacher-access-denied").forEach(el => el.classList.add("hidden"));
  }
}


async function fetchStudents() {
  const apiKey = getCookie("api_key");  // Get API key from cookie

  try {
    const res = await fetch("https://rfid-attendancesystem-backend-project.onrender.com/api/attendance", {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,  // <-- Send API key in header
      },
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    allStudentData = await res.json();
    applyFilters();
  } catch (err) {
 document.getElementById("studentsBody").innerHTML = `
  <tr><td colspan="7" class="text-center text-gray-600">Failed to load data, You have no attendance record</td></tr>
`;

  }
}


// Apply filters to student data
function applyFilters() {
  const form = document.getElementById("formFilter").value;
  const date = document.getElementById("dateFilter").value;
  const name = document.getElementById("nameFilter").value.toLowerCase();
  const startDate = document.getElementById("startDateFilter").value;
  const endDate = document.getElementById("endDateFilter").value;

  const filtered = allStudentData.filter(a => {
    const matchForm = !form || a.form === form;
    const matchDate = !date || a.date?.slice(0, 10) === date;
    const matchName = !name || a.name?.toLowerCase().includes(name);
    const matchStart = !startDate || new Date(a.date) >= new Date(startDate);
    const matchEnd = !endDate || new Date(a.date) <= new Date(endDate);
    return matchForm && matchDate && matchName && matchStart && matchEnd;
  });

  renderStudents(filtered);
}

// Render students in the table and update stats
function renderStudents(data) {
  const tbody = document.getElementById("studentsBody");
  const formStatsSummary = document.getElementById("formStatsSummary");
  tbody.innerHTML = "";
  formStatsSummary.innerHTML = "";

  let present = 0, partial = 0, absent = 0;
  const formStats = {};

  data.forEach(a => {
    const f = a.form || "Unknown";
    formStats[f] = formStats[f] || { present: 0, partial: 0, absent: 0 };

    const status = a.status;
    if (status === "present") {
      formStats[f].present++;
      present++;
    } else if (status === "partial") {
      formStats[f].partial++;
      partial++;
    } else {
      formStats[f].absent++;
      absent++;
    }

    const row = `
      <tr class="hover:bg-gray-100 whitespace-nowrap">
        <td class="px-4 py-2">${a.date ? new Date(a.date).toLocaleDateString() : "N/A"}</td>
        <td class="px-4 py-2">${a.name || "N/A"}</td>
        <td class="px-4 py-2">${a.uid || "N/A"}</td>
        <td class="px-4 py-2 ${a.sign_in_time ? "" : "text-red-600 font-semibold"}">
          ${a.sign_in_time ? new Date(a.sign_in_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Not signed in"}
        </td>
        <td class="px-4 py-2 ${a.sign_out_time ? "" : "text-red-600 font-semibold"}">
          ${a.sign_out_time ? new Date(a.sign_out_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Not signed out"}
        </td>
        <td class="px-4 py-2 font-semibold ${status === "present" ? "text-green-600" : status === "partial" ? "text-yellow-500" : "text-red-600"}">
          ${status}
        </td>
        <td class="px-4 py-2">${f}</td>
      </tr>
    `;
    tbody.insertAdjacentHTML("beforeend", row);
  });

  document.getElementById("totalStudents").textContent = present + partial + absent;
  document.getElementById("totalPresent").textContent = present;
  document.getElementById("totalPartial").textContent = partial;
  document.getElementById("totalAbsent").textContent = absent;

  Object.entries(formStats).forEach(([f, stat]) => {
    formStatsSummary.innerHTML += `
      <div>
        <strong>${f}</strong> - Present: <span class="text-green-600">${stat.present}</span>,
        Partial: <span class="text-yellow-500">${stat.partial}</span>,
        Absent: <span class="text-red-600">${stat.absent}</span>
      </div>
    `;
  });

  updateChart(present, partial, absent);
}

// Chart rendering
function updateChart(present, partial, absent) {
  const ctx = document.getElementById("attendanceChart").getContext("2d");
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Present", "Partial", "Absent"],
      datasets: [{
        data: [present, partial, absent],
        backgroundColor: ["#16a34a", "#facc15", "#dc2626"],
      }],
    },
    options: {
      animation: false,
      plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            const total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            return total ? `${((value / total) * 100).toFixed(1)}%` : "0%";
          },
          color: "#fff",
          font: { weight: "bold" },
        },
        legend: { display: true, position: "bottom" },
      },
    },
    plugins: [ChartDataLabels],
  });
}

// Auto refresh functions
function startStudentsAutoRefresh(delay = 10000) {
  clearInterval(studentsRefreshIntervalId);
  studentsRefreshIntervalId = setInterval(fetchStudents, delay);
}
function stopStudentsAutoRefresh() {
  clearInterval(studentsRefreshIntervalId);
}

// Download as PDF
async function downloadAsPDF() {
  const { jsPDF } = window.jspdf;
  const pdfText = document.getElementById("pdfText");
  const pdfSpinner = document.getElementById("pdfSpinner");
  pdfText.textContent = "Generating...";
  pdfSpinner.classList.remove("hidden");

  try {
    const doc = new jsPDF("p", "pt", "a4");
    const canvas = await html2canvas(document.body, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const imgProps = doc.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

    if (imgHeight > pageHeight) {
      let position = 0;
      let heightLeft = imgHeight;
      while (heightLeft > 0) {
        doc.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
        heightLeft -= pageHeight;
        position -= pageHeight;
        if (heightLeft > 0) doc.addPage();
      }
    } else {
      doc.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    }

    doc.save(`webpage_${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (err) {
    console.error("PDF error:", err);
    alert("Failed to generate PDF.");
  }

  pdfText.textContent = "Download as PDF";
  pdfSpinner.classList.add("hidden");
  downloadOptions.classList.add("hidden");
}

// Download as Excel
async function downloadExcel() {
  const excelText = document.getElementById("excelText");
  const excelSpinner = document.getElementById("excelSpinner");
  excelText.textContent = "Generating...";
  excelSpinner.classList.remove("hidden");

  try {
    if (typeof XLSX === "undefined") {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    const table = document.getElementById("studentTable");
    if (!table) throw new Error("Table with id 'studentTable' not found.");
    const workbook = XLSX.utils.table_to_book(table, { sheet: "Attendance" });
    XLSX.writeFile(workbook, `attendance_${new Date().toISOString().slice(0, 10)}.xlsx`);
  } catch (err) {
    console.error("Excel error:", err);
    alert("Failed to generate Excel: " + err.message);
  }

  excelText.textContent = "Download as Excel";
  excelSpinner.classList.add("hidden");
  downloadOptions.classList.add("hidden");
}

// Debounce helper to limit rapid calls
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Modal and advanced filter controls
const advancedFilterBtn = document.getElementById("advancedFilterBtn");
const advancedFilterModal = document.getElementById("advancedFilterModal");
const closeAdvancedFilterModal = document.getElementById("closeAdvancedFilterModal");
const applyAdvancedFilterBtn = document.getElementById("applyAdvancedFilterBtn");

advancedFilterBtn.addEventListener("click", () => {
  advancedFilterModal.classList.remove("hidden");
});

closeAdvancedFilterModal.addEventListener("click", () => {
  advancedFilterModal.classList.add("hidden");
});

applyAdvancedFilterBtn.addEventListener("click", () => {
  applyFilters();
  advancedFilterModal.classList.add("hidden");
});


  async function populateFormOptions() {
    const formSelect = document.getElementById("formFilter");
    const apiKey = getCookie("api_key");

    try {
      const res = await fetch("https://rfid-attendancesystem-backend-project.onrender.com/api/categories", {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        }
      });

      if (!res.ok) throw new Error("Failed to fetch categories");

      const categories = await res.json();

      categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.name;
        option.textContent = cat.name;
        formSelect.appendChild(option);
      });
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }
// Initialize page and event listeners
async function pageInit() {
  handleRoleVisibility();
   await populateFormOptions();  // <- Add this
  fetchStudents();
  startStudentsAutoRefresh();

  // Filters on basic controls (formFilter, dateFilter, startDateFilter, endDateFilter)
  document.getElementById("formFilter").addEventListener("change", applyFilters);
  document.getElementById("dateFilter").addEventListener("change", applyFilters);
  document.getElementById("startDateFilter").addEventListener("change", applyFilters);
  document.getElementById("endDateFilter").addEventListener("change", applyFilters);

  // Debounced name filter for better UX
  document.getElementById("nameFilter").addEventListener("input", debounce(applyFilters, 300));

  // Download button toggle
  document.getElementById("downloadBtn").addEventListener("click", () => {
    downloadOptions.classList.toggle("hidden");
  });
}

window.addEventListener("DOMContentLoaded", pageInit);
