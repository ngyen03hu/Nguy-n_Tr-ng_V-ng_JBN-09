document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const rememberCheckbox = document.getElementById("remember");
    const snackbar = document.getElementById("snackbar");
    const generalError = document.getElementById("general-error");

    // Check if there's a registered email to show in the login form
    const registeredEmail = localStorage.getItem("registeredEmail");
    if (registeredEmail) {
        emailInput.value = registeredEmail;
        // Remove it so it doesn't show on subsequent visits
        localStorage.removeItem("registeredEmail");
    }

    // Check for remember me functionality
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberedPassword = localStorage.getItem("rememberedPassword");
    if (rememberedEmail && rememberedPassword) {
        emailInput.value = rememberedEmail;
        passwordInput.value = rememberedPassword;
        rememberCheckbox.checked = true;
    }

    function validateForm() {
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Ẩn thông báo lỗi trước khi kiểm tra lại
        generalError.style.display = "none";

        if (!email && !password) {
            generalError.textContent = "Vui lòng nhập email và mật khẩu";
            generalError.style.display = "block";
            return false;
        } else if (!email) {
            generalError.textContent = "Vui lòng nhập email";
            generalError.style.display = "block";
            return false;
        } else if (!password) {
            generalError.textContent = "Vui lòng nhập mật khẩu";
            generalError.style.display = "block";
            return false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            generalError.textContent = "Email không hợp lệ";
            generalError.style.display = "block";
            return false;
        } else if (password.length < 8) {
            generalError.textContent = "Mật khẩu phải có ít nhất 8 ký tự";
            generalError.style.display = "block";
            return false;
        }

        return true;
    }

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Handle remember me functionality
        if (rememberCheckbox.checked) {
            localStorage.setItem("rememberedEmail", email);
            localStorage.setItem("rememberedPassword", password);
        } else {
            localStorage.removeItem("rememberedEmail");
            localStorage.removeItem("rememberedPassword");
        }

        // Check against stored users
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Store current user session
            localStorage.setItem("currentUser", JSON.stringify({
                email: user.email,
                name: `${user.firstname} ${user.lastname}`,
                loggedIn: true
            }));

            showSnackbar("Đăng nhập thành công", true);
            setTimeout(() => {
                window.location.href = "../pages/category-manager.html";
            }, 2000);
        } else {
            showSnackbar("Sai email hoặc mật khẩu", false);
        }
    });

    function showSnackbar(message, isSuccess) {
        snackbar.textContent = message;
        snackbar.style.backgroundColor = isSuccess ? "#4CAF50" : "#F44336";
        snackbar.classList.add("show");

        setTimeout(() => {
            snackbar.classList.remove("show");
        }, 3000);
    }
});