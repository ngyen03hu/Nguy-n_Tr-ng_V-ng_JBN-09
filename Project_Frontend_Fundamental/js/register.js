document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("register-form");
    const errorMessages = {
        lastname: document.getElementById("lastname-error"),
        firstname: document.getElementById("firstname-error"),
        email: document.getElementById("email-error"),
        password: document.getElementById("password-error"),
        confirmPassword: document.getElementById("confirmPassword-error"),
        terms: document.getElementById("terms-error")
    };

    // Real-time validation
    document.getElementById("lastname").addEventListener("input", function () {
        validateField(this.value, "lastname", "Họ và tên đệm không được để trống");
    });

    document.getElementById("firstname").addEventListener("input", function () {
        validateField(this.value, "firstname", "Tên không được để trống");
    });

    document.getElementById("email").addEventListener("input", function () {
        const email = this.value.trim();
        if (!email) {
            showError("email", "Email không được để trống");
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            showError("email", "Email không hợp lệ");
        } else {
            hideError("email");
        }
    });

    document.getElementById("password").addEventListener("input", function () {
        const password = this.value;
        if (!password) {
            showError("password", "Mật khẩu không được để trống");
        } else if (password.length < 8) {
            showError("password", "Mật khẩu phải có ít nhất 8 ký tự");
        } else {
            hideError("password");
            // Validate confirm password if it has value
            if (document.getElementById("confirmPassword").value) {
                validateConfirmPassword();
            }
        }
    });

    document.getElementById("confirmPassword").addEventListener("input", validateConfirmPassword);

    document.getElementById("terms").addEventListener("change", function () {
        if (this.checked) {
            hideError("terms");
        } else {
            showError("terms", "Bạn cần đồng ý với điều khoản để tiếp tục");
        }
    });

    function validateConfirmPassword() {
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (!confirmPassword) {
            showError("confirmPassword", "Xác nhận mật khẩu không được để trống");
        } else if (password !== confirmPassword) {
            showError("confirmPassword", "Mật khẩu không trùng khớp");
        } else {
            hideError("confirmPassword");
        }
    }

    function validateField(value, fieldId, errorMessage) {
        if (!value.trim()) {
            showError(fieldId, errorMessage);
        } else {
            hideError(fieldId);
        }
    }

    function showError(fieldId, message) {
        const inputField = document.getElementById(fieldId);
        inputField.classList.add('error');
        errorMessages[fieldId].textContent = message;
        errorMessages[fieldId].style.display = "block";
    }

    function hideError(fieldId) {
        const inputField = document.getElementById(fieldId);
        inputField.classList.remove('error');
        errorMessages[fieldId].style.display = "none";
    }

    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        // Get form values
        const lastname = document.getElementById("lastname").value.trim();
        const firstname = document.getElementById("firstname").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const terms = document.getElementById("terms").checked;

        // Validate all fields
        let isValid = true;

        if (!lastname) {
            showError("lastname", "Họ và tên đệm không được để trống");
            isValid = false;
        }

        if (!firstname) {
            showError("firstname", "Tên không được để trống");
            isValid = false;
        }

        if (!email) {
            showError("email", "Email không được để trống");
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            showError("email", "Email không hợp lệ");
            isValid = false;
        }

        if (!password) {
            showError("password", "Mật khẩu không được để trống");
            isValid = false;
        } else if (password.length < 8) {
            showError("password", "Mật khẩu phải có ít nhất 8 ký tự");
            isValid = false;
        }

        if (!confirmPassword) {
            showError("confirmPassword", "Xác nhận mật khẩu không được để trống");
            isValid = false;
        } else if (password !== confirmPassword) {
            showError("confirmPassword", "Mật khẩu không trùng khớp");
            isValid = false;
        }

        if (!terms) {
            showError("terms", "Bạn cần đồng ý với điều khoản để tiếp tục");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        // Check if email already exists
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const emailExists = users.some(user => user.email === email);

        if (emailExists) {
            showError("email", "Email này đã được đăng ký");
            return;
        }

        // Create user object
        const user = {
            lastname,
            firstname,
            email,
            password, // Note: In a real app, you should hash the password
            createdAt: new Date().toISOString()
        };

        // Save to localStorage
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("registeredEmail", email); // For login page to show success message

        // Show success message and redirect
        showSnackbar();
    });

    function showSnackbar() {
        const snackbar = document.getElementById("snackbar");
        snackbar.classList.add("show");

        setTimeout(function () {
            snackbar.classList.remove("show");
            window.location.href = "../pages/login.html";
        }, 3000);
    }
});