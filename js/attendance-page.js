let chartInstance = null;
let studentsRefreshIntervalId = null;
const downloadOptions = document.getElementById("downloadOptions");

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(";").shift() : null;
}

const role = getCookie("role");
if (role === "teacher") {
  document
    .querySelectorAll(".teacher-only")
    .forEach((el) => el.classList.remove("hidden"));
  document
    .querySelectorAll(".teacher-access-denied")
    .forEach((el) => el.classList.add("hidden"));
}

function startStudentsAutoRefresh(delay = 1000) {
  clearInterval(studentsRefreshIntervalId);
  studentsRefreshIntervalId = setInterval(fetchStudents, delay);
}

function stopStudentsAutoRefresh() {
  clearInterval(studentsRefreshIntervalId);
}

async function fetchStudents() {
  try {
    const res = await fetch(
      "https://rfid-attendancesystem-backend-project.onrender.com/api/attendance"
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    renderStudents(data);
  } catch (err) {
    document.getElementById(
      "studentsBody"
    ).innerHTML = `<tr><td colspan="7" class="text-center text-red-600">Failed to load data: ${err.message}</td></tr>`;
  }
}

// Render attendance table, summary, and chart
function renderStudents(data) {
  const tbody = document.getElementById("studentsBody");
  const form = document.getElementById("formFilter").value;
  const date = document.getElementById("dateFilter").value;
  const statusText = document.getElementById("select-student");
  const formStatsSummary = document.getElementById("formStatsSummary");

  tbody.innerHTML = "";
  formStatsSummary.innerHTML = "";
  statusText.innerHTML =
    form && date
      ? `Date and Form selected for <span class="text-blue-400">${form}</span> on <span class="text-gray-400">${date}</span>`
      : "✅ Please Select Form and Date";

  // Filter data based on form and date
  const filtered = data.filter(
    (a) =>
      (!form || a.form === form) && (!date || a.date?.slice(0, 10) === date)
  );

  let present = 0,
    partial = 0,
    absent = 0;
  const formStats = {};

  filtered.forEach((a) => {
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
        <td class="px-4 py-2">${
          a.date ? new Date(a.date).toLocaleDateString() : "N/A"
        }</td>
        <td class="px-4 py-2">${a.name || "N/A"}</td>
        <td class="px-4 py-2">${a.uid || "N/A"}</td>
        <td class="px-4 py-2 ${
          a.sign_in_time ? "" : "text-red-600 font-semibold"
        }">${
      a.sign_in_time
        ? new Date(a.sign_in_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Not signed in"
    }</td>
        <td class="px-4 py-2 ${
          a.sign_out_time ? "" : "text-red-600 font-semibold"
        }">${
      a.sign_out_time
        ? new Date(a.sign_out_time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "Not signed out"
    }</td>
        <td class="px-4 py-2 font-semibold ${
          status === "present"
            ? "text-green-600"
            : status === "partial"
            ? "text-yellow-500"
            : "text-red-600"
        }">${status}</td>
        <td class="px-4 py-2">${f}</td>
      </tr>`;
    tbody.insertAdjacentHTML("beforeend", row);
  });

  document.getElementById("totalStudents").textContent =
    present + partial + absent;
  document.getElementById("totalPresent").textContent = present;
  document.getElementById("totalPartial").textContent = partial;
  document.getElementById("totalAbsent").textContent = absent;

  Object.entries(formStats).forEach(([f, stat]) => {
    formStatsSummary.innerHTML += `<div><strong>${f}</strong> - Present: <span class="text-green-600">${stat.present}</span>, Partial: <span class="text-yellow-500">${stat.partial}</span>, Absent: <span class="text-red-600">${stat.absent}</span></div>`;
  });

  const ctx = document.getElementById("attendanceChart").getContext("2d");
  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Present", "Partial", "Absent"],
      datasets: [
        {
          data: [present, partial, absent],
          backgroundColor: ["#16a34a", "#facc15", "#dc2626"],
        },
      ],
    },
    options: {
      animation: false,
      plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            const total = ctx.chart.data.datasets[0].data.reduce(
              (a, b) => a + b,
              0
            );
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

async function downloadAsPDF() {
  const { jsPDF } = window.jspdf;

  const pdfText = document.getElementById("pdfText");
  const pdfSpinner = document.getElementById("pdfSpinner");

  pdfText.textContent = "Generating...";
  pdfSpinner.classList.remove("hidden");

  try {
    const doc = new jsPDF("p", "pt", "a4");
    const element = document.body;

    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
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

async function downloadExcel() {
  const excelText = document.getElementById("excelText");
  const excelSpinner = document.getElementById("excelSpinner");

  excelText.textContent = "Generating...";
  excelSpinner.classList.remove("hidden");

  try {
    if (typeof XLSX === "undefined") {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js";
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    const table = document.getElementById("studentTable");
    if (!table) throw new Error("Table with id 'studentTable' not found.");

    // Convert table to workbook
    const workbook = XLSX.utils.table_to_book(table, { sheet: "Attendance" });

    // Write workbook and trigger download
    XLSX.writeFile(
      workbook,
      `attendance_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  } catch (err) {
    console.error("Excel error:", err);
    alert("Failed to generate Excel: " + err.message);
  }

  excelText.textContent = "Download as Excel";
  excelSpinner.classList.add("hidden");
  downloadOptions.classList.add("hidden");
}

document.getElementById("formFilter").addEventListener("change", fetchStudents);
document.getElementById("dateFilter").addEventListener("change", fetchStudents);
document.getElementById("downloadBtn").addEventListener("click", () => {
  downloadOptions.classList.toggle("hidden");
});
document
  .querySelector("#downloadOptions button:nth-child(1)")
  .addEventListener("click", downloadAsPDF);
document
  .querySelector("#downloadOptions button:nth-child(2)")
  .addEventListener("click", downloadExcel);

window.addEventListener("load", () => {
  fetchStudents();
  startStudentsAutoRefresh(10000); // refresh every 10 seconds to reduce load
});
