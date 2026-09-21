/* JavaScript riêng cho trang index.html (Trang chủ)*/

/* Xử lý form tìm kiếm nhanh: chuyển sang trang tours.html kèm từ khoá */
document.getElementById('quickSearchForm').addEventListener('submit', function (e) {
  e.preventDefault(); // Chặn reload trang

  const keyword = document.getElementById('keyword').value.trim();
  const location = document.getElementById('location').value;
  const startDate = document.getElementById('startDate').value;

  // Giai đoạn 1 chưa có PHP nên chỉ truyền tham số lên URL của trang danh sách tour
  const params = new URLSearchParams();
  if (keyword)   params.append('keyword', keyword);
  if (location)  params.append('location', location);
  if (startDate) params.append('date', startDate);

  window.location.href = 'tours.html?' + params.toString();
});
