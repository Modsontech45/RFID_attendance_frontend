let chartInstance = null;
let studentsRefreshIntervalId = null;
let allStudentData = [];

const downloadOptions = document.getElementById("downloadOptions");

function getCookie(name) {
  const cookieStr = `; ${document.cookie}`;
  const parts = cookieStr.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(";").shift() : null;
}

function handleRoleVisibility() {
  const role = getCookie("role");
  if (role === "teacher") {
    document.querySelectorAll(".teacher-only").forEach(el => el.classList.remove("hidden"));
    document.querySelectorAll(".teacher-access-denied").forEach(el => el.classList.add("hidden"));
  }
}

async function fetchStudents() {
  const apiKey = getCookie("api_key");

  try {
    const res = await fetch("https://rfid-attendancesystem-backend-project.onrender.com/api/attendance", {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    allStudentData = await res.json();
    applyFilters();
  } catch (err) {
    const tbody = document.getElementById("studentsBody");
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center text-gray-600">Failed to load data. You have no attendance record.</td>
        </tr>
      `;
    }
  }
}

function applyFilters() {
  const form = document.getElementById("formFilter")?.value?.toLowerCase() || "";
  const date = document.getElementById("dateFilter")?.value;
  const name = document.getElementById("nameFilter")?.value.toLowerCase() || "";
  const startDate = document.getElementById("startDateFilter")?.value;
  const endDate = document.getElementById("endDateFilter")?.value;

  const filtered = allStudentData.filter(a => {
    const matchForm = !form || a.form?.toLowerCase() === form;
    const matchDate = !date || a.date?.slice(0, 10) === date;
    const matchName = !name || a.name?.toLowerCase().includes(name);
    const matchStart = !startDate || new Date(a.date) >= new Date(startDate);
    const matchEnd = !endDate || new Date(a.date) <= new Date(endDate);
    return matchForm && matchDate && matchName && matchStart && matchEnd;
  });

  renderStudents(filtered);
}

function renderStudents(data) {
  const tbody = document.getElementById("studentsBody");
  const formStatsSummary = document.getElementById("formStatsSummary");
  if (!tbody || !formStatsSummary) return;

  tbody.innerHTML = "";
  formStatsSummary.innerHTML = "";

  let present = 0, partial = 0, absent = 0;
  const formStats = {};

  data.forEach(a => {
    const f = a.form || "Unknown";
    formStats[f] = formStats[f] || { present: 0, partial: 0, absent: 0 };

    if (a.status === "present") {
      formStats[f].present++;
      present++;
    } else if (a.status === "partial") {
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
        <td class="px-4 py-2 font-semibold ${a.status === "present" ? "text-green-600" : a.status === "partial" ? "text-yellow-500" : "text-red-600"}">
          ${a.status}
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

  for (const [f, stat] of Object.entries(formStats)) {
    formStatsSummary.innerHTML += `
      <div>
        <strong>${f}</strong> - Present: <span class="text-green-600">${stat.present}</span>,
        Partial: <span class="text-yellow-500">${stat.partial}</span>,
        Absent: <span class="text-red-600">${stat.absent}</span>
      </div>
    `;
  }

  updateChart(present, partial, absent);
}

function updateChart(present, partial, absent) {
  const ctx = document.getElementById("attendanceChart")?.getContext("2d");
  if (!ctx) return;

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

function startStudentsAutoRefresh(delay = 10000) {
  clearInterval(studentsRefreshIntervalId);
  studentsRefreshIntervalId = setInterval(fetchStudents, delay);
}

function stopStudentsAutoRefresh() {
  clearInterval(studentsRefreshIntervalId);
}

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
      formSelect?.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading categories:", error);
  }
}

// PDF download
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

    let position = 0;
    if (imgHeight > pageHeight) {
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

    doc.save(`attendance_${new Date().toISOString().slice(0, 10)}.pdf`);
  } catch (err) {
    console.error("PDF error:", err);
    alert("Failed to generate PDF.");
  }

  pdfText.textContent = "Download as PDF";
  pdfSpinner.classList.add("hidden");
  downloadOptions?.classList.add("hidden");
}

// Excel download
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
  downloadOptions?.classList.add("hidden");
}

function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

// Page init
async function pageInit() {
  handleRoleVisibility();
  await populateFormOptions();
  await fetchStudents();
  startStudentsAutoRefresh();

  document.getElementById("formFilter")?.addEventListener("change", applyFilters);
  document.getElementById("dateFilter")?.addEventListener("change", applyFilters);
  document.getElementById("startDateFilter")?.addEventListener("change", applyFilters);
  document.getElementById("endDateFilter")?.addEventListener("change", applyFilters);
  document.getElementById("nameFilter")?.addEventListener("input", debounce(applyFilters, 300));

  document.getElementById("downloadBtn")?.addEventListener("click", () => {
    downloadOptions?.classList.toggle("hidden");
  });

  document.getElementById("applyAdvancedFilterBtn")?.addEventListener("click", () => {
    applyFilters();
    document.getElementById("advancedFilterModal")?.classList.add("hidden");
  });

  document.getElementById("advancedFilterBtn")?.addEventListener("click", () => {
    document.getElementById("advancedFilterModal")?.classList.remove("hidden");
  });

  document.getElementById("closeAdvancedFilterModal")?.addEventListener("click", () => {
    document.getElementById("advancedFilterModal")?.classList.add("hidden");
  });
}

window.addEventListener("DOMContentLoaded", pageInit);
