let pollingInterval = null;
const statusEl = document.getElementById("status");
const formEl = document.getElementById("registerForm");

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return decodeURIComponent(match[2]);
  return null;
}


function generateRandomID(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

async function pollScanQueue() {
  try {
    const res = await fetch(
      "https://rfid-attendancesystem-backend-project.onrender.com/api/scan/queue"
    );
    let data = await res.json();
    console.log("Polled scan data:", data);

    if (!Array.isArray(data)) {
      data = [data];
    }

    statusEl.innerHTML = ""; // Clear previous messages

    if (data.length > 0) {
      data.forEach((item) => {
        let message = "";
        let className = "text-green-400 font-semibold mb-2 block text-center";

        if (item.uid) {
          if (item.exists) {
            message = `{   ${data[0].name} }  ${data[0].message}`;
            clearInterval(pollingInterval); // Stop polling

            setTimeout(() => {
              pollingInterval = setInterval(pollScanQueue, 2000); // Restart polling after 5 seconds
            }, 2000);
            className = "text-green-400 font-semibold mb-2 block text-center";
          } else {
            message = `New UID detected: ${item.uid}. Please register.`;
            clearInterval(pollingInterval);
            className = "text-yellow-400 font-semibold mb-2 block text-center";
            document.getElementById("uid").value = item.uid;
            formEl.classList.remove("hidden");
          }
        } else if (item.message) {
          message = item.message;
          className = "text-gray-400 mb-2 block text-center";
        }

        const p = document.createElement("p");
        p.textContent = message;
        p.className = className;
        statusEl.appendChild(p);
      });
    } else {
      statusEl.textContent = "No scan messages.";
      statusEl.className = "text-center text-gray-400 font-semibold mb-4";
      formEl.classList.add("hidden");
    }
  } catch (err) {
    console.error("Polling failed:", err.message);
    statusEl.textContent = "Error connecting to server.";
    statusEl.className = "text-center text-red-500 font-semibold mb-4";
  }
}
formEl.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    student_id: generateRandomID(),
    uid: document.getElementById("uid").value,
    email: document.getElementById("email").value,
    telephone: document.getElementById("telephone").value,
    form: document.getElementById("form").value,
    gender: document.getElementById("gender").value,
  };

  try {
    const res = await fetch(
      "https://rfid-attendancesystem-backend-project.onrender.com/api/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const result = await res.json();

    if (!res.ok) {
      statusEl.textContent = result.message || "Registration failed.";
      statusEl.className = "text-center text-yellow-400 font-semibold mb-4";
      return;
    }

    statusEl.textContent = result.message;
    statusEl.className = "text-center text-green-400 font-semibold mb-4";
    formEl.reset();
    formEl.classList.add("hidden");
    pollingInterval = setInterval(pollScanQueue, 2000);
  } catch (err) {
    console.error("Registration failed:", err.message);
    statusEl.textContent = "Server error. Please try again.";
    statusEl.className = "text-center text-red-500 font-semibold mb-4";
  }
});



window.onload = () => {
  pollingInterval = setInterval(pollScanQueue, 2000);
};
