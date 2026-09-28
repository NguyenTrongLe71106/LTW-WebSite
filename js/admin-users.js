
// VietTour ADMIN - JS riêng cho trang admin-users.html
// Tab 1: Người dùng (bảng users)  |  Tab 2: Tin nhắn liên hệ (bảng contact_messages)
// Chỉ thao tác trên giao diện - Giai đoạn 2 sẽ nối PHP + MySQL.

document.addEventListener('DOMContentLoaded', function () {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;   

  /* PHẦN 1: NGƯỜI DÙNG */
  const userBody = document.getElementById('userBody');
  const userEmptyRow = document.getElementById('userEmptyRow');
  const userSearch = document.getElementById('userSearch');
  const userRoleFilter = document.getElementById('userRoleFilter');
  const userTabCount = document.getElementById('userTabCount');

  const userModal = new bootstrap.Modal(document.getElementById('userModal'));
  const umName = document.getElementById('umName');
  const umEmail = document.getElementById('umEmail');
  const umPhone = document.getElementById('umPhone');
  const umRole = document.getElementById('umRole');
  const umPassword = document.getElementById('umPassword');
  const umPwHint = document.getElementById('umPwHint');
  const umPwRequired = document.getElementById('umPwRequired');
  const umError = document.getElementById('umError');

  const roleInfo = {
    admin:    { label: 'Quản trị viên', cls: 'adm-badge--admin' },
    customer: { label: 'Khách hàng',    cls: 'adm-badge--customer' }
  };
  const avatarColors = ['#1565c0', '#2e7d32', '#ef6c00', '#6a1b9a', '#00838f', '#ad1457', '#455a64'];

  // Các tài khoản khách đã có đơn đặt tour -> không xoá được (ràng buộc khoá ngoại bookings.user_id)
  const emailsWithBookings = new Set([
    'lan.nguyen@gmail.com', 'hung.tran@gmail.com', 'ha.pham@gmail.com', 'khoi.le@gmail.com',
    'anh.do@gmail.com', 'mai.vu@gmail.com', 'anh.hoang@gmail.com'
  ]);

  let editingUserRow = null;   // null = đang thêm mới

  function userRows() { return Array.from(userBody.querySelectorAll('.js-user-row')); }

  function refreshUserCount() { userTabCount.textContent = userRows().length; }

  function filterUsers() {
    const keyword = userSearch.value.trim().toLowerCase();
    const role = userRoleFilter.value;
    let visible = 0;
    userRows().forEach(function (row) {
      const d = row.dataset;
      const haystack = (d.name + ' ' + d.email + ' ' + d.phone).toLowerCase();
      const show = (keyword === '' || haystack.includes(keyword)) && (role === 'all' || d.role === role);
      row.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    userEmptyRow.style.display = visible === 0 ? '' : 'none';
  }
  userSearch.addEventListener('input', filterUsers);
  userRoleFilter.addEventListener('change', filterUsers);

  function firstLetter(name) { return Array.from(name.trim())[0].toUpperCase(); }

  // Ghi dữ liệu vào các ô của 1 dòng người dùng (dùng textContent để tránh chèn HTML từ ô nhập)
  function paintUserRow(row, u) {
    row.dataset.name = u.name;
    row.dataset.email = u.email;
    row.dataset.phone = u.phone;
    row.dataset.role = u.role;
    row.querySelector('.adm-initial').textContent = firstLetter(u.name);
    row.querySelector('.fw-semibold').textContent = u.name;
    row.children[1].textContent = u.email;
    row.children[2].textContent = u.phone;
    const badge = row.children[3].querySelector('.adm-badge');
    badge.className = 'adm-badge ' + roleInfo[u.role].cls;
    badge.textContent = roleInfo[u.role].label;
  }

  function showUserError(msg) {
    umError.textContent = msg;
    umError.classList.remove('d-none');
  }

  document.getElementById('btnNewUser').addEventListener('click', function () {
    editingUserRow = null;
    document.getElementById('userModalTitle').textContent = 'Thêm người dùng';
    umName.value = ''; umEmail.value = ''; umPhone.value = ''; umPassword.value = '';
    umRole.value = 'customer'; umRole.disabled = false;
    umPwRequired.classList.remove('d-none');
    umPwHint.textContent = 'Tối thiểu 6 ký tự. Hệ thống sẽ lưu dạng mã hoá (password_hash).';
    umError.classList.add('d-none');
    userModal.show();
  });

  userBody.addEventListener('click', function (e) {
    const editBtn = e.target.closest('.js-edit-user');
    const delBtn = e.target.closest('.js-delete-user');

    if (editBtn) {
      editingUserRow = editBtn.closest('.js-user-row');
      const d = editingUserRow.dataset;
      document.getElementById('userModalTitle').textContent = 'Sửa người dùng';
      umName.value = d.name; umEmail.value = d.email; umPhone.value = d.phone;
      umRole.value = d.role;
      umRole.disabled = d.protected === 'true';      // không cho hạ quyền tài khoản admin chính
      umPassword.value = '';
      umPwRequired.classList.add('d-none');
      umPwHint.textContent = 'Để trống nếu không muốn đổi mật khẩu.';
      umError.classList.add('d-none');
      userModal.show();
    }

    if (delBtn) {
      const row = delBtn.closest('.js-user-row');
      const d = row.dataset;
      if (d.protected === 'true') {
        alert('Không thể xoá tài khoản quản trị chính của hệ thống.');
        return;
      }
      if (emailsWithBookings.has(d.email.toLowerCase())) {
        alert('Không thể xoá "' + d.name + '" vì người dùng này đã có đơn đặt tour (ràng buộc khoá ngoại bookings.user_id).\n\nBạn có thể huỷ các đơn của họ trước, hoặc giữ lại tài khoản.');
        return;
      }
      if (confirm('Bạn có chắc chắn muốn xoá người dùng "' + d.name + '"? Thao tác này không thể hoàn tác.')) {
        row.remove();
        refreshUserCount();
        filterUsers();
      }
    }
  });

  document.getElementById('umSaveBtn').addEventListener('click', function () {
    const name = umName.value.trim();
    const email = umEmail.value.trim();
    const phone = umPhone.value.trim();
    const role = umRole.value;
    const password = umPassword.value;

    if (name === '') return showUserError('Vui lòng nhập họ và tên.');
    if (!emailRegex.test(email)) return showUserError('Email không hợp lệ.');
    if (phone !== '' && !phoneRegex.test(phone.replace(/\s/g, ''))) return showUserError('Số điện thoại không hợp lệ (ví dụ: 0901 234 567).');

    const duplicated = userRows().some(function (r) {
      return r !== editingUserRow && r.dataset.email.toLowerCase() === email.toLowerCase();
    });
    if (duplicated) return showUserError('Email này đã được sử dụng bởi tài khoản khác.');

    if (!editingUserRow && password.length < 6) return showUserError('Mật khẩu phải có tối thiểu 6 ký tự.');
    if (editingUserRow && password !== '' && password.length < 6) return showUserError('Mật khẩu mới phải có tối thiểu 6 ký tự.');

    umError.classList.add('d-none');
    const u = { name: name, email: email, phone: phone, role: role };

    if (editingUserRow) {
      paintUserRow(editingUserRow, u);
    } else {
      const row = document.createElement('tr');
      row.className = 'js-user-row';
      const color = avatarColors[userRows().length % avatarColors.length];
      const now = new Date();
      const created = String(now.getDate()).padStart(2, '0') + '/' + String(now.getMonth() + 1).padStart(2, '0') + '/' + now.getFullYear();
      row.innerHTML =
        '<td><div class="d-flex align-items-center gap-2"><span class="adm-initial" style="background:' + color + ';"></span><span class="fw-semibold"></span></div></td>' +
        '<td></td><td></td>' +
        '<td><span class="adm-badge"></span></td>' +
        '<td>' + created + '</td>' +
        '<td>' +
          '<button type="button" class="adm-action-btn edit js-edit-user" title="Sửa"><i class="bi bi-pencil"></i></button>' +
          '<button type="button" class="adm-action-btn delete js-delete-user" title="Xoá"><i class="bi bi-trash3"></i></button>' +
        '</td>';
      paintUserRow(row, u);
      userBody.insertBefore(row, userEmptyRow);
    }

    userModal.hide();
    refreshUserCount();
    filterUsers();
    // GHI CHÚ: Giai đoạn 2 gửi dữ liệu này lên PHP; mật khẩu sẽ được băm bằng password_hash() trước khi lưu.
  });

  /* ============================================================
     PHẦN 2: TIN NHẮN LIÊN HỆ
     ============================================================ */
  const msgBody = document.getElementById('msgBody');
  const msgEmptyRow = document.getElementById('msgEmptyRow');
  const msgSearch = document.getElementById('msgSearch');
  const msgStatusTabs = document.getElementById('msgStatusTabs');
  const msgTabCount = document.getElementById('msgTabCount');
  const sidebarMsgBadge = document.getElementById('sidebarMsgBadge');

  const msgModal = new bootstrap.Modal(document.getElementById('msgModal'));
  const mmDoneBtn = document.getElementById('mmDoneBtn');

  let currentStatus = 'all';
  let currentMsgRow = null;

  function msgRows() { return Array.from(msgBody.querySelectorAll('.js-msg-row')); }

  // Số tin "Chưa xử lý" hiển thị ở tab và badge sidebar
  function refreshMsgCounts() {
    const n = msgRows().filter(function (r) { return r.dataset.status === 'new'; }).length;
    msgTabCount.textContent = n;
    msgTabCount.style.display = n === 0 ? 'none' : '';
    sidebarMsgBadge.textContent = n;
    sidebarMsgBadge.style.display = n === 0 ? 'none' : '';
  }

  function filterMsgs() {
    const keyword = msgSearch.value.trim().toLowerCase();
    let visible = 0;
    msgRows().forEach(function (row) {
      const d = row.dataset;
      const haystack = (d.name + ' ' + d.email + ' ' + d.topic + ' ' + d.message).toLowerCase();
      const show = (currentStatus === 'all' || d.status === currentStatus) && (keyword === '' || haystack.includes(keyword));
      row.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    msgEmptyRow.style.display = visible === 0 ? '' : 'none';
  }
  msgSearch.addEventListener('input', filterMsgs);

  msgStatusTabs.addEventListener('click', function (e) {
    const btn = e.target.closest('button[data-status]');
    if (!btn) return;
    msgStatusTabs.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    currentStatus = btn.dataset.status;
    filterMsgs();
  });

  function setDoneButton(isDone) {
    mmDoneBtn.disabled = isDone;
    mmDoneBtn.innerHTML = isDone
      ? '<i class="bi bi-check2-circle me-1"></i>Đã xử lý'
      : '<i class="bi bi-check2-circle me-1"></i>Đánh dấu đã xử lý';
  }

  msgBody.addEventListener('click', function (e) {
    const viewBtn = e.target.closest('.js-view-msg');
    const delBtn = e.target.closest('.js-delete-msg');

    if (viewBtn) {
      currentMsgRow = viewBtn.closest('.js-msg-row');
      const d = currentMsgRow.dataset;
      document.getElementById('mmName').textContent = d.name;
      document.getElementById('mmPhone').textContent = d.phone;
      document.getElementById('mmEmail').textContent = d.email;
      document.getElementById('mmTime').textContent = d.time;
      document.getElementById('mmTopic').textContent = d.topic;
      document.getElementById('mmMessage').textContent = d.message;
      document.getElementById('mmReply').href =
        'mailto:' + d.email +
        '?subject=' + encodeURIComponent('Phản hồi liên hệ từ VietTour') +
        '&body=' + encodeURIComponent('Xin chào ' + d.name + ',\n\nCảm ơn bạn đã liên hệ VietTour.\n\n');
      setDoneButton(d.status === 'done');
      msgModal.show();
    }

    if (delBtn) {
      const row = delBtn.closest('.js-msg-row');
      if (confirm('Bạn có chắc chắn muốn xoá tin nhắn của "' + row.dataset.name + '"? Thao tác này không thể hoàn tác.')) {
        row.remove();
        refreshMsgCounts();
        filterMsgs();
      }
    }
  });

  mmDoneBtn.addEventListener('click', function () {
    if (!currentMsgRow) return;
    currentMsgRow.dataset.status = 'done';
    const badge = currentMsgRow.querySelector('.js-msg-badge');
    badge.className = 'adm-badge adm-badge--done js-msg-badge';
    badge.textContent = 'Đã xử lý';
    msgModal.hide();
    refreshMsgCounts();
    filterMsgs();
  });

  /* KHỞI TẠO */
  refreshUserCount();
  refreshMsgCounts();

  // Cho phép mở thẳng tab tin nhắn bằng đường dẫn admin-users.html#messages (dùng từ Dashboard)
  if (window.location.hash === '#messages') {
    const tabBtn = document.querySelector('[data-bs-target="#tab-messages"]');
    if (tabBtn) bootstrap.Tab.getOrCreateInstance(tabBtn).show();
  }
});
