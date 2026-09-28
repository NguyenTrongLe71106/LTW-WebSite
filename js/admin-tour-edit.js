
// VietTour ADMIN - JS riêng cho trang admin-tour-edit.html
// Xử lý thêm/xoá dòng động cho: Lịch trình, Dịch vụ, Đợt khởi hành, Hình ảnh
// (Chỉ thao tác trên giao diện - Giai đoạn 1 chưa lưu vào CSDL thật)


document.addEventListener('DOMContentLoaded', function () {

  // Xoá dòng: dùng chung event delegation cho toàn bộ nút .adm-remove-row / .adm-img-remove
  document.addEventListener('click', function (e) {
    const removeRowBtn = e.target.closest('.adm-remove-row');
    if (removeRowBtn) {
      const row = removeRowBtn.closest('.adm-repeat-row, .input-group, tr');
      if (row) row.remove();
      return;
    }
    const removeImgBtn = e.target.closest('.adm-img-remove');
    if (removeImgBtn) {
      const col = removeImgBtn.closest('.col-6, .col-md-3');
      if (col) col.remove();
      return;
    }
  });

  // TAB 2: Thêm ngày lịch trình
  const itineraryList = document.getElementById('itineraryList');
  const btnAddItinerary = document.getElementById('btnAddItinerary');
  if (btnAddItinerary) {
    btnAddItinerary.addEventListener('click', function () {
      const dayNumber = itineraryList.querySelectorAll('.adm-repeat-row').length + 1;
      const row = document.createElement('div');
      row.className = 'adm-repeat-row';
      row.innerHTML = `
        <button type="button" class="btn btn-sm adm-action-btn delete adm-remove-row" title="Xoá ngày này"><i class="bi bi-trash3"></i></button>
        <div class="d-flex align-items-center gap-2 mb-2">
          <span class="adm-day-badge">${dayNumber}</span>
          <input type="text" class="form-control" style="max-width:420px;" placeholder="Tiêu đề ngày ${dayNumber}">
        </div>
        <textarea class="form-control" rows="2" placeholder="Chi tiết các điểm tham quan trong ngày..."></textarea>`;
      itineraryList.appendChild(row);
    });
  }

  // TAB 3: Thêm dòng dịch vụ (bao gồm / không bao gồm)
  function addServiceLine(containerId, placeholder) {
    const container = document.getElementById(containerId);
    const row = document.createElement('div');
    row.className = 'input-group mb-2';
    row.innerHTML = `
      <input type="text" class="form-control" placeholder="${placeholder}">
      <button type="button" class="btn btn-outline-adm adm-remove-row"><i class="bi bi-x-lg"></i></button>`;
    container.appendChild(row);
  }
  const btnAddIncluded = document.getElementById('btnAddIncluded');
  const btnAddExcluded = document.getElementById('btnAddExcluded');
  if (btnAddIncluded) btnAddIncluded.addEventListener('click', () => addServiceLine('includedList', 'Nhập dịch vụ bao gồm...'));
  if (btnAddExcluded) btnAddExcluded.addEventListener('click', () => addServiceLine('excludedList', 'Nhập dịch vụ không bao gồm...'));

  // TAB 4: Thêm đợt khởi hành 
  const departuresTable = document.getElementById('departuresTable');
  const btnAddDeparture = document.getElementById('btnAddDeparture');
  if (btnAddDeparture) {
    btnAddDeparture.addEventListener('click', function () {
      const tbody = departuresTable.querySelector('tbody');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><input type="date" class="form-control"></td>
        <td><input type="number" class="form-control" value="0" style="max-width:120px;"></td>
        <td><button type="button" class="adm-action-btn delete adm-remove-row"><i class="bi bi-trash3"></i></button></td>`;
      tbody.appendChild(tr);
    });
  }

  // TAB 5: Xem trước ảnh vừa chọn (chỉ hiển thị, chưa upload thật) 
  const imageGrid = document.getElementById('imageGrid');
  if (imageGrid) {
    imageGrid.addEventListener('change', function (e) {
      if (e.target.type === 'file' && e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function (ev) {
          const uploadBox = e.target.closest('.col-6, .col-md-3');
          const newCol = document.createElement('div');
          newCol.className = 'col-6 col-md-3';
          newCol.innerHTML = `
            <div class="adm-img-thumb">
              <img src="${ev.target.result}" alt="">
              <button type="button" class="adm-img-remove"><i class="bi bi-x-lg"></i></button>
            </div>`;
          imageGrid.insertBefore(newCol, uploadBox);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Submit form: demo, chưa nối PHP/CSDL
  const tourForm = document.getElementById('tourForm');
  if (tourForm) {
    tourForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Đã lưu (demo). Giai đoạn 2 sẽ gửi dữ liệu này lên PHP để lưu vào các bảng: tours, itineraries, tour_services, departures, tour_images.');
    });
  }
});
