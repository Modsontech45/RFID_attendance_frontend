
  function getCookie(name) {
    const cookieStr = `; ${document.cookie}`;
    const parts = cookieStr.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  const token = getCookie("token");
  const role = getCookie("role");

  if (!token || !role) {
    window.location.href = "/pages/users/login-required.html";
  } else if (role !== "admin") {
    window.location.href = "/pages/users/access-denied.html";
  }

