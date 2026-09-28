
// Lọc bài viết, thêm/sửa/xoá bài viết và danh mục (chỉ trên giao diện, chưa nối CSDL)

document.addEventListener('DOMContentLoaded', function () {

  const postBody = document.getElementById('postBody');
  const postEmptyRow = document.getElementById('postEmptyRow');
  const postSearch = document.getElementById('postSearch');
  const postCategoryFilter = document.getElementById('postCategoryFilter');
  const postTabCount = document.getElementById('postTabCount');

  const postModal = new bootstrap.Modal(document.getElementById('postModal'));
  const categoryModal = new bootstrap.Modal(document.getElementById('categoryModal'));

  let editingPostRow = null;   
  let editingCatRow = null;   

  /* Lọc bài viết theo từ khoá + danh mục*/
  function filterPosts() {
    const keyword = postSearch.value.trim().toLowerCase();
    const cat = postCategoryFilter.value;
    let visible = 0;

    postBody.querySelectorAll('.js-post-row').forEach(function (row) {
      const okKeyword = keyword === '' || row.dataset.title.toLowerCase().includes(keyword);
      const okCat = cat === 'all' || row.dataset.category === cat;
      const show = okKeyword && okCat;
      row.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    postEmptyRow.style.display = visible === 0 ? '' : 'none';
  }
  postSearch.addEventListener('input', filterPosts);
  postCategoryFilter.addEventListener('change', filterPosts);

  // Cập nhật số bài viết ở tab và ở bảng danh mục
  function refreshCounts() {
    const rows = postBody.querySelectorAll('.js-post-row');
    postTabCount.textContent = rows.length;
    document.querySelectorAll('.js-cat-row').forEach(function (catRow) {
      const n = postBody.querySelectorAll('.js-post-row[data-category="' + catRow.dataset.slug + '"]').length;
      catRow.querySelector('.js-cat-count').textContent = n;
    });
  }

  /* Modal bài viết: Viết mới  */
  const pmTitle = document.getElementById('pmTitle');
  const pmCategory = document.getElementById('pmCategory');
  const pmAuthor = document.getElementById('pmAuthor');
  const pmPublished = document.getElementById('pmPublished');
  const pmContent = document.getElementById('pmContent');
  const pmThumb = document.getElementById('pmThumb');
  const pmThumbPreview = document.getElementById('pmThumbPreview');

  document.getElementById('btnNewPost').addEventListener('click', function () {
    editingPostRow = null;
    document.getElementById('postModalTitle').textContent = 'Viết bài mới';
    pmTitle.value = '';
    pmCategory.selectedIndex = 0;
    pmAuthor.value = 'Admin';
    pmPublished.value = '';
    pmContent.value = '';
    pmThumb.value = '';
    pmThumbPreview.classList.add('d-none');
    postModal.show();
  });

  // Xem trước ảnh thu nhỏ vừa chọn
  pmThumb.addEventListener('change', function () {
    if (pmThumb.files && pmThumb.files[0]) {
      const reader = new FileReader();
      reader.onload = function (ev) {
        pmThumbPreview.src = ev.target.result;
        pmThumbPreview.classList.remove('d-none');
      };
      reader.readAsDataURL(pmThumb.files[0]);
    }
  });

  /*  3. Sửa / Xoá bài viết (event delegation)  */
  postBody.addEventListener('click', function (e) {
    const editBtn = e.target.closest('.js-edit-post');
    const delBtn = e.target.closest('.js-delete-post');

    if (editBtn) {
      editingPostRow = editBtn.closest('.js-post-row');
      const d = editingPostRow.dataset;
      document.getElementById('postModalTitle').textContent = 'Sửa bài viết';
      pmTitle.value = d.title;
      pmCategory.value = d.category;
      pmAuthor.value = d.author;
      pmPublished.value = d.published;
      pmContent.value = d.content;
      pmThumb.value = '';
      pmThumbPreview.src = editingPostRow.querySelector('img').src;
      pmThumbPreview.classList.remove('d-none');
      postModal.show();
    }

    if (delBtn) {
      const row = delBtn.closest('.js-post-row');
      if (confirm('Bạn có chắc chắn muốn xoá bài viết "' + row.dataset.title + '"? Thao tác này không thể hoàn tác.')) {
        row.remove();
        refreshCounts();
        filterPosts();
      }
    }
  });

  /*  4. Lưu bài viết (demo): cập nhật ngay dòng trên bảng */
  const catLabels = { 'kinh-nghiem': 'Kinh nghiệm', 'am-thuc': 'Ẩm thực', 'meo-du-lich': 'Mẹo du lịch', 'diem-den': 'Điểm đến' };

  function formatDate(iso) {
    // "2026-09-12T08:00" -> "12/09/2026"
    if (!iso) return new Date().toLocaleDateString('vi-VN');
    const [y, m, d] = iso.split('T')[0].split('-');
    return d + '/' + m + '/' + y;
  }

  document.getElementById('pmSaveBtn').addEventListener('click', function () {
    if (pmTitle.value.trim() === '' || pmContent.value.trim() === '') {
      alert('Vui lòng nhập Tiêu đề và Nội dung bài viết.');
      return;
    }

    const cat = pmCategory.value;
    const thumbSrc = pmThumbPreview.classList.contains('d-none')
      ? 'https://picsum.photos/seed/newpost' + Date.now() + '/100/100'
      : pmThumbPreview.src;

    const rowHtml =
      '<td><img src="' + thumbSrc + '" class="adm-avatar-sm" style="border-radius:8px;" alt=""></td>' +
      '<td class="fw-semibold"></td>' +
      '<td><span class="adm-cat-badge">' + catLabels[cat] + '</span></td>' +
      '<td></td>' +
      '<td>' + formatDate(pmPublished.value) + '</td>' +
      '<td>' +
        '<button type="button" class="adm-action-btn edit js-edit-post" title="Sửa"><i class="bi bi-pencil"></i></button>' +
        '<button type="button" class="adm-action-btn delete js-delete-post" title="Xoá"><i class="bi bi-trash3"></i></button>' +
      '</td>';

    let row = editingPostRow;
    if (!row) {
      row = document.createElement('tr');
      row.className = 'js-post-row';
      postBody.insertBefore(row, postBody.firstChild);   // bài mới lên đầu bảng
    }
    row.innerHTML = rowHtml;
    // Dùng textContent để tránh chèn HTML từ nội dung người dùng nhập
    row.children[1].textContent = pmTitle.value.trim();
    row.children[3].textContent = pmAuthor.value.trim() || 'Admin';

    row.dataset.title = pmTitle.value.trim();
    row.dataset.category = cat;
    row.dataset.author = pmAuthor.value.trim() || 'Admin';
    row.dataset.published = pmPublished.value;
    row.dataset.content = pmContent.value.trim();

    postModal.hide();
    refreshCounts();
    filterPosts();
  });

  /*  Danh mục: tự sinh slug từ tên (bỏ dấu tiếng Việt) */
  const cmName = document.getElementById('cmName');
  const cmSlug = document.getElementById('cmSlug');

  function toSlug(text) {
    return text
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  cmName.addEventListener('input', function () { cmSlug.value = toSlug(cmName.value); });

  document.getElementById('btnNewCategory').addEventListener('click', function () {
    editingCatRow = null;
    document.getElementById('categoryModalTitle').textContent = 'Thêm danh mục';
    cmName.value = '';
    cmSlug.value = '';
    categoryModal.show();
  });

  document.getElementById('categoryBody').addEventListener('click', function (e) {
    const editBtn = e.target.closest('.js-edit-cat');
    const delBtn = e.target.closest('.js-delete-cat');

    if (editBtn) {
      editingCatRow = editBtn.closest('.js-cat-row');
      document.getElementById('categoryModalTitle').textContent = 'Sửa danh mục';
      cmName.value = editingCatRow.dataset.name;
      cmSlug.value = editingCatRow.dataset.slug;
      categoryModal.show();
    }

    if (delBtn) {
      const row = delBtn.closest('.js-cat-row');
      const count = parseInt(row.querySelector('.js-cat-count').textContent, 10);
      if (count > 0) {
        alert('Không thể xoá danh mục "' + row.dataset.name + '" vì đang có ' + count + ' bài viết. Hãy chuyển các bài viết sang danh mục khác trước.');
        return;
      }
      if (confirm('Xoá danh mục "' + row.dataset.name + '"?')) {
        row.remove();
        document.getElementById('catTabCount').textContent = document.querySelectorAll('.js-cat-row').length;
      }
    }
  });

  document.getElementById('cmSaveBtn').addEventListener('click', function () {
    const name = cmName.value.trim();
    const slug = cmSlug.value.trim() || toSlug(name);
    if (name === '') { alert('Vui lòng nhập tên danh mục.'); return; }

    if (editingCatRow) {
      editingCatRow.dataset.name = name;
      editingCatRow.dataset.slug = slug;
      editingCatRow.children[1].textContent = name;
      editingCatRow.children[2].innerHTML = '<code></code>';
      editingCatRow.children[2].firstChild.textContent = slug;
    } else {
      const tbody = document.getElementById('categoryBody');
      const nextId = tbody.querySelectorAll('.js-cat-row').length + 1;
      const tr = document.createElement('tr');
      tr.className = 'js-cat-row';
      tr.dataset.name = name;
      tr.dataset.slug = slug;
      tr.innerHTML =
        '<td>' + nextId + '</td><td class="fw-semibold"></td><td><code></code></td><td class="js-cat-count">0</td>' +
        '<td>' +
          '<button type="button" class="adm-action-btn edit js-edit-cat" title="Sửa"><i class="bi bi-pencil"></i></button>' +
          '<button type="button" class="adm-action-btn delete js-delete-cat" title="Xoá"><i class="bi bi-trash3"></i></button>' +
        '</td>';
      tr.children[1].textContent = name;
      tr.querySelector('code').textContent = slug;
      tbody.appendChild(tr);
      document.getElementById('catTabCount').textContent = tbody.querySelectorAll('.js-cat-row').length;

      // Thêm vào các ô chọn danh mục (bộ lọc + modal bài viết)
      catLabels[slug] = name;
      [postCategoryFilter, pmCategory].forEach(function (sel) {
        const opt = document.createElement('option');
        opt.value = slug;
        opt.textContent = name;
        sel.appendChild(opt);
      });
    }
    categoryModal.hide();
  });

  // GHI CHÚ: Giai đoạn 2 sẽ gửi các thao tác này lên PHP để ghi vào bảng blog_posts / blog_categories.
});
