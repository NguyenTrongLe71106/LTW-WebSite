/* ==========================================================
   VietTour - contact.js
   JavaScript riêng cho trang contact.html (Liên hệ)
   Validate form kiểm tra rỗng + đúng định dạng SĐT/Email
   ========================================================== */

const contactForm  = document.getElementById('contactForm');
const successAlert = document.getElementById('contactSuccessAlert');

const fullName = document.getElementById('fullName');
const phone    = document.getElementById('phone');
const email    = document.getElementById('email');
const topic    = document.getElementById('topic');
const message  = document.getElementById('message');

// Regex kiểm tra định dạng
const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;                 // Số điện thoại Việt Nam
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;             // Email cơ bản

// Hàm dùng chung: đánh dấu 1 ô là hợp lệ hay không hợp lệ
function setFieldValid(field, isValid) {
  field.classList.toggle('is-invalid', !isValid);
  field.classList.toggle('is-valid', isValid);
}

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();
  successAlert.style.display = 'none';

  let isFormValid = true;

  // 1. Họ và tên: không được rỗng
  if (fullName.value.trim() === '') {
    setFieldValid(fullName, false);
    isFormValid = false;
  } else {
    setFieldValid(fullName, true);
  }

  // 2. Số điện thoại: không rỗng + đúng định dạng VN
  if (phone.value.trim() === '' || !phoneRegex.test(phone.value.trim())) {
    setFieldValid(phone, false);
    isFormValid = false;
  } else {
    setFieldValid(phone, true);
  }

  // 3. Email: không rỗng + đúng định dạng
  if (email.value.trim() === '' || !emailRegex.test(email.value.trim())) {
    setFieldValid(email, false);
    isFormValid = false;
  } else {
    setFieldValid(email, true);
  }

  // 4. Chủ đề: phải chọn 1 giá trị khác rỗng
  if (topic.value === '') {
    setFieldValid(topic, false);
    isFormValid = false;
  } else {
    setFieldValid(topic, true);
  }

  // 5. Nội dung tin nhắn: không rỗng, tối thiểu 10 ký tự
  if (message.value.trim().length < 10) {
    setFieldValid(message, false);
    isFormValid = false;
  } else {
    setFieldValid(message, true);
  }

  // Nếu tất cả các ô đều hợp lệ: hiện thông báo thành công & reset form
  if (isFormValid) {
    successAlert.style.display = 'block';
    contactForm.reset();
    // Xoá trạng thái viền xanh/đỏ sau khi reset
    [fullName, phone, email, topic, message].forEach(f => {
      f.classList.remove('is-valid', 'is-invalid');
    });
    successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // GHI CHÚ: Giai đoạn 2 sẽ thay đoạn này bằng fetch()/AJAX gửi dữ liệu
    // lên file PHP để lưu vào bảng "contact_messages" trong MySQL.
  }
});
