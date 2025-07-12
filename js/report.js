async function generateReport() {
  const date = document.getElementById("reportDate").value;
  const form = document.getElementById("reportForm").value;

  if (!date) {
    alert("Please select a date.");
    return;
  }

  // Get language from localStorage or default to "en"
  const lang = localStorage.getItem("lang") || "en";

  try {
    const res = await fetch(
      "https://rfid-attendancesystem-backend-project.onrender.com/api/attendance",
      {
        headers: {
          "Accept-Language": lang,
        },
      }
    );
    if (!res.ok) throw new Error("Network response was not ok");

    const data = await res.json();

    // Filter by date first
    let filtered = data.filter((a) => a.date?.slice(0, 10) === date);

    // Filter by form if selected
    if (form) {
      filtered = filtered.filter((a) => a.form === form);
    }

    const present = filtered.filter((a) => a.status === "present").length;
    const partial = filtered.filter((a) => a.status === "partial").length;
    const absent = filtered.filter((a) => a.status === "absent").length;

    // AI-style summary: simple insights based on attendance rates
    const total = filtered.length;
    const presentRate = total ? (present / total) * 100 : 0;

    let attendanceSummary = "";
    if (total === 0) {
      attendanceSummary =
        "No attendance records found for the selected date and form.";
    } else if (presentRate > 90) {
      attendanceSummary =
        "Excellent attendance rate! Almost everyone was present.";
    } else if (presentRate > 70) {
      attendanceSummary = "Good attendance, but there is room for improvement.";
    } else if (presentRate > 40) {
      attendanceSummary =
        "Moderate attendance; consider follow-ups with absent students.";
    } else {
      attendanceSummary =
        "Low attendance rate. Immediate action is recommended!";
    }

    // Output the report as an article with semantic HTML and Tailwind styling
    document.getElementById("reportResult").innerHTML = `
      <article class="bg-green-50 border border-green-200 p-6 rounded-lg shadow-md space-y-4">
        <h3 class="text-2xl font-semibold text-green-700">Attendance Report for ${date}${
      form ? ` - ${form}` : ""
    }</h3>
        <p><strong>Total Records:</strong> ${total}</p>
        <p><strong>Present:</strong> ${present}</p>
        <p><strong>Partial:</strong> ${partial}</p>
        <p><strong>Absent:</strong> ${absent}</p>
        <hr class="border-green-300" />
        <p class="italic text-green-900 font-medium">Summary: ${attendanceSummary}</p>
      </article>
    `;
  } catch (error) {
    console.error("Error fetching data:", error);
    document.getElementById("reportResult").innerHTML = `
      <p class="text-red-600">Failed to load data. Please try again later.</p>
    `;
  }
}
