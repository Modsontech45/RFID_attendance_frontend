const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('navMenu');

menuBtn.addEventListener('click', () => {
  navMenu.classList.toggle('hidden');
});

// Optional: Close menu on link click (only on small screens)
navMenu.querySelectorAll('a, button.logoutBtn').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      navMenu.classList.add('hidden');
    }
  });
});

// Optional: Close menu if clicking outside (on mobile)
document.addEventListener('click', (e) => {
  if (
    window.innerWidth < 768 &&
    !navMenu.contains(e.target) &&
    e.target !== menuBtn
  ) {
    navMenu.classList.add('hidden');
  }
});


//   <header
//     class="w-full bg-black text-white shadow-md py-4 px-6 flex items-center justify-between border-b border-green-600">
//     <div class="flex items-center space-x-3">
//       <img src="/assets/logo.jpg" alt="Logo" class="w-10 h-10 rounded-full border-2 border-white" />
//       <span class="text-xl font-bold">Synctuario</span>
//     </div>
//     <nav class="space-x-6 ">
//       <a href="/pages/users/admin/adminlandingpage.html" class="hover:text-green-400 font-medium">Office</a>
//       <a href="/registerstudent.html" class="text-green-400 font-medium">Home</a>
//       <a href="/pages/students.html" class="hover:text-green-400 font-medium">Students</a>
//       <a href="/pages/dashboard.html" class="hover:underline">Dashboard</a>
//       <a href="/pages/attendance.html" class="hover:text-green-400 font-medium">Attendance</a>
//     <button class="logoutBtn bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded focus:outline-none">
//   Logout
// </button>




//   </header>
