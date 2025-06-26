
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}


async function fetchTeachers() {
  const container = document.getElementById("teachersContainer");
  const token = getCookie("token");
  const apiKey = getCookie("api_key");

  if (!token || !apiKey) {
    container.innerHTML =
      '<p class="text-red-500">You must be logged in as an admin.</p>';
    return;
  }

  container.innerHTML = ''; // clear previous content

  try {
    const res = await fetch(
      "https://rfid-attendancesystem-backend-project.onrender.com/api/teachers/all",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": apiKey
        },
      }
    );

    const data = await res.json();

    if (!res.ok) {
      container.innerHTML = `<p class="text-red-500">${
        data.message || "Error loading teachers"
      }</p>`;
      return;
    }

    if (data.teachers.length === 0) {
      container.innerHTML = '<p class="text-gray-600">No teachers found.</p>';
      return;
    }

    data.teachers.forEach((t) => {
      const card = document.createElement("div");
      card.className = `cursor-pointer p-4 rounded-lg border border-primary shadow hover:bg-secondary hover:text-white transition duration-200 flex items-center space-x-4`;

      card.addEventListener("click", () => {
        window.location.href = `https://rfid-attendance-synctuario-theta.vercel.app/pages/users/admin/teacher.html?id=${t.id}`;
      });

      const fullBio = t.bio || "No bio available";
      const shortBio =
        fullBio.length > 100
          ? fullBio.slice(0, 100) + "... Read more"
          : fullBio;

      card.innerHTML = `
        <img src="${t.picture || "https://via.placeholder.com/80"}" alt="${t.full_name}" class="w-16 h-16 rounded-full object-cover border-2 border-secondary" />
        <div>
          <h2 class="text-lg font-semibold">${t.full_name || "Unnamed Teacher"}</h2>
          <p class="text-sm">${t.email}</p>
          <p class="text-xs italic">${shortBio}</p>
        </div>
      `;

      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = '<p class="text-red-500">Something went wrong.</p>';
  }
}



