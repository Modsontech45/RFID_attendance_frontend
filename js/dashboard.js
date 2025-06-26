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
let chartInstance = null;
let refreshIntervalId = null; // Declare a variable to store the interval ID

async function loadDashboardData(dateFilter = null) {
      const apiKey = getCookie("api_key"); // get api key from cookie or wherever you store it
    if (!apiKey) {
      throw new Error("API key not found");
    }
  try {
    const res = await fetch(
      "https://rfid-attendancesystem-backend-project.onrender.com/api/attendance",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,  // Send API key here for backend validation
        },
      }
    );
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();

    const filtered = dateFilter
      ? data.filter((a) => a.date && a.date.slice(0, 10) === dateFilter)
      : data;

    const present = filtered.filter((a) => a.status === "present").length;
    const partial = filtered.filter((a) => a.status === "partial").length;
    const absent = filtered.filter((a) => a.status === "absent").length;
    const total = filtered.length;

    document.getElementById("total").textContent = total;
    document.getElementById("present").textContent = present;
    document.getElementById("partial").textContent = partial;
    document.getElementById("absent").textContent = absent;

    const ctx = document.getElementById("dashboardChart").getContext("2d");

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Present", "Partial", "Absent"],
        datasets: [
          {
            label: "Attendance Count",
            data: [present, partial, absent],
            backgroundColor: ["#2563eb", "#facc15", "#dc2626"],
          },
        ],
      },
      options: {
        animation: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    console.log("Dashboard data loaded and chart updated.");
  } catch (error) {
    console.error("Error loading dashboard data:", error);

    document.getElementById("total").textContent = "Error";
    document.getElementById("present").textContent = "Error";
    document.getElementById("partial").textContent = "Error";
    document.getElementById("absent").textContent = "Error";
  }
}

function startAutoRefresh(delay = 1000) {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
  }
  const selectedDate = document.getElementById("filterDate").value;
  refreshIntervalId = setInterval(() => loadDashboardData(selectedDate), delay);
  console.log(`Auto-refresh started for every ${delay / 1000} seconds.`);
}

function stopAutoRefresh() {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
    console.log("Auto-refresh stopped.");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("filterDate").value = today;
  loadDashboardData(today);

  startAutoRefresh(1000);
});

document.getElementById("filterDate").addEventListener("change", (e) => {
  const newDate = e.target.value;
  loadDashboardData(newDate);
  startAutoRefresh(1000);
});

window.addEventListener("beforeunload", stopAutoRefresh);
