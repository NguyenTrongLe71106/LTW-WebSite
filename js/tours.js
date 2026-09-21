/* ==========================================================
   VietTour - tours.js
   JavaScript riêng cho trang tours.html (Danh sách tour)
   Xử lý lọc & sắp xếp (dữ liệu mẫu, chưa cần PHP)
   ========================================================== */

const tourGrid    = document.getElementById('tourGrid');
const tourItems   = Array.from(document.querySelectorAll('.tour-item'));
const resultCount = document.getElementById('resultCount');
const noResult    = document.getElementById('noResult');
const sortSelect  = document.getElementById('sortSelect');

// Lưu thứ tự ban đầu để dùng cho lựa chọn "Mặc định"
const originalOrder = tourItems.slice();

/* ---------- 1. Đọc điều kiện lọc từ sidebar hoặc offcanvas ---------- */
function getFilterValues(isMobile) {
  const kwEl = document.getElementById(isMobile ? 'filterKeywordM' : 'filterKeyword');
  const regionEls = document.querySelectorAll(isMobile ? '.filter-region-m:checked' : '.filter-region:checked');
  const priceEl = document.querySelector(isMobile ? '.filter-price-m:checked' : '.filter-price:checked');
  const daysEls = document.querySelectorAll(isMobile ? '.filter-days-m:checked' : '.filter-days:checked');

  return {
    keyword: kwEl.value.trim().toLowerCase(),
    regions: Array.from(regionEls).map(el => el.value),
    price:   priceEl ? priceEl.value : 'all',
    days:    Array.from(daysEls).map(el => parseInt(el.value))
  };
}

/* ---------- 2. Lọc danh sách tour ---------- */
function applyFilter(isMobile) {
  const f = getFilterValues(isMobile);
  let count = 0;

  tourItems.forEach(item => {
    const name   = item.dataset.name.toLowerCase();
    const region = item.dataset.region;
    const price  = parseInt(item.dataset.price);
    const days   = parseInt(item.dataset.days);

    // Điều kiện 1: từ khoá
    const okKeyword = f.keyword === '' || name.includes(f.keyword);

    // Điều kiện 2: địa điểm (không chọn = lấy tất cả)
    const okRegion = f.regions.length === 0 || f.regions.includes(region);

    // Điều kiện 3: khoảng giá
    let okPrice = true;
    if (f.price !== 'all') {
      const [min, max] = f.price.split('-').map(Number);
      okPrice = price >= min && price <= max;
    }

    // Điều kiện 4: số ngày (giá trị 5 nghĩa là "5 ngày trở lên")
    let okDays = f.days.length === 0;
    if (!okDays) {
      okDays = f.days.some(d => (d === 5 ? days >= 5 : days === d));
    }

    // Hiển thị hoặc ẩn card
    if (okKeyword && okRegion && okPrice && okDays) {
      item.style.display = '';
      count++;
    } else {
      item.style.display = 'none';
    }
  });

  resultCount.textContent = count;
  noResult.style.display = count === 0 ? 'block' : 'none';
}

/* ---------- 3. Sắp xếp danh sách tour ---------- */
function applySort() {
  const value = sortSelect.value;
  let sorted;

  if (value === 'price-asc') {
    sorted = tourItems.slice().sort((a, b) => a.dataset.price - b.dataset.price);
  } else if (value === 'price-desc') {
    sorted = tourItems.slice().sort((a, b) => b.dataset.price - a.dataset.price);
  } else if (value === 'rating') {
    sorted = tourItems.slice().sort((a, b) => b.dataset.rating - a.dataset.rating);
  } else if (value === 'popular') {
    sorted = tourItems.slice().sort((a, b) => b.dataset.sold - a.dataset.sold);
  } else {
    sorted = originalOrder;
  }

  // Đưa các card vào lại lưới theo thứ tự mới
  sorted.forEach(item => tourGrid.appendChild(item));
}

/* ---------- 4. Gắn sự kiện ---------- */
document.getElementById('filterForm').addEventListener('submit', function (e) {
  e.preventDefault();
  applyFilter(false);
});

document.getElementById('filterFormMobile').addEventListener('submit', function (e) {
  e.preventDefault();
  applyFilter(true);
});

// Nhấn "Xoá bộ lọc" thì hiện lại toàn bộ tour
document.querySelectorAll('#filterForm, #filterFormMobile').forEach(form => {
  form.addEventListener('reset', function () {
    setTimeout(function () {
      tourItems.forEach(item => item.style.display = '');
      resultCount.textContent = tourItems.length;
      noResult.style.display = 'none';
    }, 0); // chờ trình duyệt reset xong giá trị input
  });
});

sortSelect.addEventListener('change', applySort);

/* ---------- 5. Nhận từ khoá do trang chủ gửi sang qua URL ---------- */
window.addEventListener('DOMContentLoaded', function () {
  const params = new URLSearchParams(window.location.search);
  const keyword = params.get('keyword');
  if (keyword) {
    document.getElementById('filterKeyword').value = keyword;
    document.getElementById('filterKeywordM').value = keyword;
    applyFilter(false);
  }
});
