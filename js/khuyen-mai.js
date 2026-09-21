/* Đồng hồ đếm ngược đến hạn kết thúc ưu đãi */

/* Đếm ngược đến thời điểm kết thúc chương trình khuyến mãi (dữ liệu mẫu) */
const saleEndDate = new Date('2026-09-30T23:59:59').getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = saleEndDate - now;

  const cdDays    = document.getElementById('cdDays');
  const cdHours   = document.getElementById('cdHours');
  const cdMinutes = document.getElementById('cdMinutes');
  const cdSeconds = document.getElementById('cdSeconds');

  if (distance < 0) {
    // Hết hạn khuyến mãi: hiển thị 00 cho tất cả
    cdDays.textContent = cdHours.textContent = cdMinutes.textContent = cdSeconds.textContent = '00';
    clearInterval(countdownTimer);
    return;
  }

  const days    = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Thêm số 0 phía trước nếu nhỏ hơn 10 (ví dụ: 5 -> "05")
  cdDays.textContent    = String(days).padStart(2, '0');
  cdHours.textContent   = String(hours).padStart(2, '0');
  cdMinutes.textContent = String(minutes).padStart(2, '0');
  cdSeconds.textContent = String(seconds).padStart(2, '0');
}

updateCountdown(); // Gọi ngay lần đầu để không bị chậm 1 giây
const countdownTimer = setInterval(updateCountdown, 1000);
