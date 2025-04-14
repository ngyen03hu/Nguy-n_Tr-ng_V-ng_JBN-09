
const profileContainer = document.getElementById('profileContainer');
const profileButton = document.getElementById('profileButton');
const logoutBtn = document.getElementById('logoutBtn');
const logoutModal = document.getElementById('logoutModal');
const confirmLogout = document.getElementById('confirmLogout');
const cancelLogout = document.getElementById('cancelLogout');

// Toggle dropdown khi click vào nút profile
profileButton.addEventListener('click', function (e) {
    e.stopPropagation();
    profileContainer.classList.toggle('active');
});

// Đóng dropdown khi click ra ngoài
document.addEventListener('click', function () {
    profileContainer.classList.remove('active');
});

// Ngăn dropdown đóng khi click vào chính nó
profileContainer.querySelector('.dropdown-menu').addEventListener('click', function (e) {
    e.stopPropagation();
});

// Mở modal xác nhận khi click đăng xuất
logoutBtn.addEventListener('click', function (e) {
    e.preventDefault();
    profileContainer.classList.remove('active');
    logoutModal.style.display = 'flex';
});

// Xác nhận đăng xuất
confirmLogout.addEventListener('click', function () {
    // Thực hiện chức năng đăng xuất ở đây
    alert('Đăng xuất thành công!');
    window.location.href = "../pages/login.html";
    logoutModal.style.display = 'none';
    // window.location.href = '/logout'; // Uncomment để chuyển hướng khi đăng xuất
});

// Hủy đăng xuất
cancelLogout.addEventListener('click', function () {
    logoutModal.style.display = 'none';
});

// Đóng modal khi click ra ngoài
logoutModal.addEventListener('click', function (e) {
    if (e.target === logoutModal) {
        logoutModal.style.display = 'none';
    }
});
