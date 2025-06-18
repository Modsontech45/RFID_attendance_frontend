const API_BASE = "https://rfid-attendancesystem-backend-project.onrender.com/api";


function setCookie(name, value, days = 7) {
  const expires = new Date(Date.now() + days * 86400 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
  const cookieStr = `; ${document.cookie}`;
  const parts = cookieStr.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function deleteCookie(name) {
  setCookie(name, "", -1);
}

async function postData(url = "", data = {}) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    return { message: "Network error" };
  }
}

const passwordInput = document.getElementById("password");
const toggle = document.getElementById("togglePassword");
if (toggle && passwordInput) {
  toggle.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    toggle.textContent = isPassword ? "🚫" : "👁️";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const adminBtn = document.getElementById("adminBtn");
  const teacherBtn = document.getElementById("teacherBtn");
  const teacherModal = document.getElementById("teacherModal");
  const closeTeacherModal = document.getElementById("closeTeacherModal");

  if (adminBtn)
    adminBtn.onclick = () =>
      (window.location.href = "/pages/users/admin/adminlogin.html");
  if (teacherBtn)
    teacherBtn.onclick = () => teacherModal.classList.remove("hidden");
  if (closeTeacherModal)
    closeTeacherModal.onclick = () => teacherModal.classList.add("hidden");

  const teacherLoginForm = document.getElementById("teacherLoginForm");
  if (teacherLoginForm) {
    console.log("Teacher login form found and JS is working ✅");

    const Msg = document.getElementById("Msg");
    const spinner = document.getElementById("spinner");
    const btnText = document.getElementById("btnText");
    const loginBtn = document.getElementById("loginBtn");

    teacherLoginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      Msg.classList.add("hidden");
      spinner.classList.remove("hidden");
      btnText.textContent = "Logging in...";
      loginBtn.disabled = true;

      const data = Object.fromEntries(new FormData(e.target));
      console.log("Login form data submitted:", data);

      try {
        const res = await postData(`${API_BASE}/teachers/login`, data);
        console.log("Login response:", res);

        if (res.token) {
          console.log("Setting token and role cookies...");
          setCookie("token", res.token, 7);
          setCookie("role", "teacher", 7);

          console.log("Cookies after setting:");
          console.log(document.cookie);

          setTimeout(() => {
            console.log("Redirecting to registerstudent.html...");
            window.location.href = "/pages/students.html";
          }, 1000);
        } else {
          Msg.textContent = res.message || "Login failed.";
          Msg.classList.remove("hidden");
        }
      } catch (error) {
        console.error("Login error:", error);
        Msg.textContent = "Server error. Please try again.";
        Msg.classList.remove("hidden");
      } finally {
        spinner.classList.add("hidden");
        btnText.textContent = "Login";
        loginBtn.disabled = false;
      }
    });
  }

  const adminLoginForm = document.getElementById("adminLoginForm");
  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(e.target));

      try {
        const res = await postData(`${API_BASE}/admin/login`, data);

        if (res.token) {
          setCookie("token", res.token, 7); // set token cookie
          setCookie("role", "admin", 7); // set role cookie

          console.log("Cookies after admin login:", document.cookie);

          window.location.href = "/pages/users/admin/adminlandingpage.html";
        } else {
          alert(res.message || "Login failed.");
        }
      } catch (error) {
        console.error("Admin login error:", error);
        alert("Server error. Please try again.");
      }
    });
  }

  const adminSignupForm = document.getElementById("adminSignupForm");
  if (adminSignupForm) {
    const errorMsg = document.getElementById("errorMsg");
    const signupSpinner = document.getElementById("signupSpinner");

    adminSignupForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (password !== confirmPassword) {
        errorMsg.textContent = "Passwords do not match";
        errorMsg.classList.remove("hidden");
        return;
      }

      errorMsg.classList.add("hidden");
      signupSpinner.classList.remove("hidden");

      const data = Object.fromEntries(new FormData(e.target));
      const res = await postData(`${API_BASE}/admin/signup`, data);

      signupSpinner.classList.add("hidden");

      if (res.redirect) {
        errorMsg.textContent =
          res.message || "Signup successful! Redirecting...";
        errorMsg.classList.remove("hidden");
        setTimeout(() => (window.location.href = res.redirect), 1500);
      } else {
        errorMsg.textContent = res.message || "Signup failed.";
        errorMsg.classList.remove("hidden");
      }
    });
  }

  const addTeacherForm = document.getElementById("addTeacherForm");
  if (addTeacherForm) {
    addTeacherForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(e.target));
      const spinner = document.getElementById("spinner");
      const btnText = document.getElementById("btnText");
      const errorMessage = document.getElementById("errorMessage");

      spinner.classList.remove("hidden");
      btnText.textContent = "Adding...";
      errorMessage.classList.add("hidden");

      const token = getCookie("token");

      try {
        const res = await fetch(`${API_BASE}/teachers/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Use token cookie here
          },
          body: JSON.stringify(data),
        });

        const json = await res.json();

        if (!res.ok) {
          errorMessage.textContent = json.message || "Failed to add teacher.";
          errorMessage.classList.remove("hidden");
        } else {
          alert(json.message);
          addTeacherForm.reset();
        }
      } catch (err) {
        console.error(err);
        errorMessage.textContent = "Server error. Please try again.";
        errorMessage.classList.remove("hidden");
      } finally {
        spinner.classList.add("hidden");
        btnText.textContent = "Add Teacher";
      }
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      deleteCookie("token");
      deleteCookie("role");
      window.location.href = "/index.html";
    };
  }
});
