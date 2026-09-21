/* ==========================================================
   VietTour - blog.js
   JavaScript riêng cho trang blog.html (Cẩm nang du lịch)
   Lọc bài viết theo chủ đề/từ khoá + validate form đăng ký nhận tin
   ========================================================== */

const articleItems  = Array.from(document.querySelectorAll('.article-item'));
const articleCount  = document.getElementById('articleCount');
const noResult      = document.getElementById('noArticleResult');
const searchInput   = document.getElementById('blogSearch');
const filterButtons = document.querySelectorAll('.category-filter .btn');

let currentCategory = 'all';

/* ---------- 1. Lọc bài viết theo chủ đề + từ khoá tìm kiếm ---------- */
function filterArticles() {
  const keyword = searchInput.value.trim().toLowerCase();
  let count = 0;

  articleItems.forEach(function (item) {
    const matchCategory = currentCategory === 'all' || item.dataset.category === currentCategory;
    const matchKeyword  = keyword === '' || item.dataset.title.includes(keyword);

    if (matchCategory && matchKeyword) {
      item.style.display = '';
      count++;
    } else {
      item.style.display = 'none';
    }
  });

  articleCount.textContent = count;
  noResult.style.display = count === 0 ? 'block' : 'none';
}

// Bấm nút chủ đề: đổi trạng thái active rồi lọc lại
filterButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    filterButtons.forEach(b => b.classList.remove('active-filter'));
    btn.classList.add('active-filter');
    currentCategory = btn.dataset.cat;
    filterArticles();
  });
});

// Gõ từ khoá: lọc theo thời gian thực
searchInput.addEventListener('input', filterArticles);

/* ---------- 2. Form đăng ký nhận tin: JS validate email rỗng/không hợp lệ ---------- */
const newsletterForm    = document.getElementById('newsletterForm');
const newsletterEmail   = document.getElementById('newsletterEmail');
const newsletterSuccess = document.getElementById('newsletterSuccess');

newsletterForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const value = newsletterEmail.value.trim();
  // Regex kiểm tra định dạng email cơ bản
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  if (value === '' || !isValidEmail) {
    newsletterEmail.classList.add('is-invalid');
    newsletterSuccess.classList.add('d-none');
    return;
  }

  newsletterEmail.classList.remove('is-invalid');
  newsletterSuccess.classList.remove('d-none');
  newsletterForm.reset();

  // GHI CHÚ: Giai đoạn 2 sẽ gửi email này lên PHP để lưu vào bảng "subscribers".
});
