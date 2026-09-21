/* Xử lý gallery ảnh và form đặt tour (tính tiền, validate, modal)*/

/*  1. Đổi ảnh lớn khi bấm vào thumbnail */
const mainImg = document.getElementById('mainGalleryImg');
document.querySelectorAll('.gallery-thumbs img').forEach(function (thumb) {
  thumb.addEventListener('click', function () {
    mainImg.src = thumb.dataset.full;
    document.querySelectorAll('.gallery-thumbs img').forEach(t => t.classList.remove('active-thumb'));
    thumb.classList.add('active-thumb');
  });
});

/* 2. Form đặt tour: tăng/giảm số lượng & tính tiền */
const PRICE_ADULT = 5450000;
const PRICE_CHILD = Math.round(PRICE_ADULT * 0.7); // Trẻ em thu 70% giá người lớn

const adultInput = document.getElementById('adultCount');
const childInput = document.getElementById('childCount');

// Định dạng số tiền theo chuẩn Việt Nam, ví dụ 5450000 -> "5.450.000đ"
function formatVND(number) {
  return number.toLocaleString('vi-VN') + 'đ';
}

function updateTotal() {
  const adults = parseInt(adultInput.value);
  const children = parseInt(childInput.value);

  const adultTotal = adults * PRICE_ADULT;
  const childTotal = children * PRICE_CHILD;

  document.getElementById('adultLine').textContent = 'Người lớn x ' + adults;
  document.getElementById('childLine').textContent = 'Trẻ em x ' + children;
  document.getElementById('adultSubtotal').textContent = formatVND(adultTotal);
  document.getElementById('childSubtotal').textContent = formatVND(childTotal);
  document.getElementById('totalPrice').textContent = formatVND(adultTotal + childTotal);
}

// Nút tăng/giảm người lớn (tối thiểu 1 người)
document.getElementById('adultPlus').addEventListener('click', function () {
  if (parseInt(adultInput.value) < parseInt(adultInput.max)) {
    adultInput.value = parseInt(adultInput.value) + 1;
    updateTotal();
  }
});
document.getElementById('adultMinus').addEventListener('click', function () {
  if (parseInt(adultInput.value) > parseInt(adultInput.min)) {
    adultInput.value = parseInt(adultInput.value) - 1;
    updateTotal();
  }
});

// Nút tăng/giảm trẻ em (tối thiểu 0 trẻ)
document.getElementById('childPlus').addEventListener('click', function () {
  if (parseInt(childInput.value) < parseInt(childInput.max)) {
    childInput.value = parseInt(childInput.value) + 1;
    updateTotal();
  }
});
document.getElementById('childMinus').addEventListener('click', function () {
  if (parseInt(childInput.value) > parseInt(childInput.min)) {
    childInput.value = parseInt(childInput.value) - 1;
    updateTotal();
  }
});

/* 3. Xử lý khi bấm "Đặt Tour"  */
const bookingForm = document.getElementById('bookingForm');
const departureSelect = document.getElementById('departureDate');
const successModal = new bootstrap.Modal(document.getElementById('bookingSuccessModal'));

bookingForm.addEventListener('submit', function (e) {
  e.preventDefault();

  // Kiểm tra đã chọn ngày khởi hành chưa (JS validate, chưa cần PHP)
  if (!departureSelect.value) {
    departureSelect.classList.add('is-invalid');
    departureSelect.focus();
    return;
  }
  departureSelect.classList.remove('is-invalid');

  // Gom thông tin đơn hàng để hiển thị demo trong modal
  const dateText = departureSelect.options[departureSelect.selectedIndex].text;
  const adults = adultInput.value;
  const children = childInput.value;
  const total = document.getElementById('totalPrice').textContent;

  document.getElementById('modalSummary').innerHTML =
    'Tour <strong>Đà Nẵng - Hội An - Bà Nà Hills</strong><br>' +
    'Khởi hành: <strong>' + dateText + '</strong><br>' +
    adults + ' người lớn, ' + children + ' trẻ em<br>' +
    'Tổng tiền: <strong class="text-vt-blue">' + total + '</strong>';

  successModal.show();

  // GHI CHÚ: Ở Giai đoạn 2, đoạn này sẽ được thay bằng fetch()/AJAX
  // gửi dữ liệu lên file PHP để lưu đơn hàng vào MySQL.
});

// Tính tổng tiền ngay khi tải trang (áp dụng số lượng mặc định 1 người lớn)
updateTotal();
