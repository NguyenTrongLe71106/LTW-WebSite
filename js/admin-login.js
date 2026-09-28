
// VietTour ADMIN - JS riêng cho trang admin-login.html
// Validate form + đăng nhập DEMO (kiểm tra ngay trên trình duyệt).
// Giai đoạn 2 sẽ thay bằng xác thực phía server (PHP + MySQL + password_verify + session).


document.addEventListener('DOMContentLoaded', function () {

  const DEMO_EMAIL = 'admin@viettour.vn';
  const DEMO_PASSWORD = 'admin123';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const emailFeedback = document.getElementById('loginEmailFeedback');
  const errorBox = document.getElementById('loginError');
  const loginBtn = document.getElementById('loginBtn');

  // Hiện / ẩn mật khẩu 
  const toggleBtn = document.getElementById('togglePassword');
  const toggleIcon = document.getElementById('togglePasswordIcon');
  toggleBtn.addEventListener('click', function () {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    toggleIcon.className = isHidden ? 'bi bi-eye-slash' : 'bi bi-eye';
  });

  // Quên mật khẩu (demo) 
  document.getElementById('forgotLink').addEventListener('click', function (e) {
    e.preventDefault();
    alert('Chức năng khôi phục mật khẩu sẽ được xây dựng ở Giai đoạn 2 (gửi email đặt lại mật khẩu qua PHP).\n\nHiện tại vui lòng dùng tài khoản demo hiển thị bên dưới form.');
  });

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.classList.remove('d-none');
  }

  // Xoá trạng thái lỗi khi người dùng gõ lại
  [emailInput, passwordInput].forEach(function (input) {
    input.addEventListener('input', function () {
      input.classList.remove('is-invalid');
      errorBox.classList.add('d-none');
    });
  });

  // Submit 
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errorBox.classList.add('d-none');

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    let valid = true;

    if (email === '') {
      emailFeedback.textContent = 'Vui lòng nhập email.';
      emailInput.classList.add('is-invalid');
      valid = false;
    } else if (!emailRegex.test(email)) {
      emailFeedback.textContent = 'Email không đúng định dạng.';
      emailInput.classList.add('is-invalid');
      valid = false;
    }

    if (password === '') {
      passwordInput.classList.add('is-invalid');
      valid = false;
    }

    if (!valid) return;

    if (email.toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      loginBtn.disabled = true;
      loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang đăng nhập...';
      setTimeout(function () { window.location.href = 'admin-dashboard.html'; }, 600);
    } else {
      showError('Email hoặc mật khẩu không chính xác. Vui lòng thử lại.');
      passwordInput.value = '';
      passwordInput.focus();
    }
  });
});
