/* ==========================================================
   VietTour - main.js
   Chứa các đoạn JavaScript DÙNG CHUNG cho cả 6 trang.
   File này phải được nhúng ở MỌI trang, sau bootstrap.bundle.min.js
   ========================================================== */

/* ---------- Nút "Lên đầu trang" ---------- */
// Chỉ chạy nếu trang có nút #btnTop (để file này dùng được cho cả
// những trang sau này lỡ không có nút, sẽ không báo lỗi ngoài console)
const btnTop = document.getElementById('btnTop');

if (btnTop) {
  window.addEventListener('scroll', function () {
    btnTop.style.display = window.scrollY > 400 ? 'block' : 'none';
  });

  btnTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
