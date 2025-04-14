
const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
});

// Biến phân trang
let currentPage = 1;
const itemsPerPage = 5;

// Hàm hiển thị nội dung     
function showContent(id) {
    document.querySelectorAll('.content').forEach(el => el.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// Tên key lưu trữ trong localStorage
let dataName = "listS35B5";

// Lấy dữ liệu từ localStorage
function getData() {
    return JSON.parse(localStorage.getItem(dataName)) || [];
}

// Lưu dữ liệu vào localStorage
function saveData(list) {
    localStorage.setItem(dataName, JSON.stringify(list));
}

// Hiển thị modal thêm mới
function showAddModal() {
    document.getElementById("inputName").value = "";
    document.getElementById("inputName").classList.remove("is-invalid");
    document.getElementById("statusOn").checked = true;
    document.getElementById("modalOverlay").classList.remove("hide");
    document.getElementById("addModal").classList.remove("hide");

    setTimeout(() => {
        document.getElementById("inputName").focus();
    }, 100);
}

// Ẩn modal thêm mới
function hideAddModal() {
    document.getElementById("modalOverlay").classList.add("hide");
    document.getElementById("addModal").classList.add("hide");
}

// Hiển thị modal chỉnh sửa
function showEditModal(id) {
    const list = getData();
    const item = list.find(item => item.id === id);

    if (item) {
        document.getElementById("editId").value = item.id;
        document.getElementById("editName").value = item.name;
        document.getElementById("editName").classList.remove("is-invalid");
        document.querySelector(`input[name="editStatus"][value="${item.status}"]`).checked = true;
        document.getElementById("modalOverlay").classList.remove("hide");
        document.getElementById("editModal").classList.remove("hide");

        setTimeout(() => {
            document.getElementById("editName").focus();
        }, 100);
    }
}

// Ẩn modal chỉnh sửa
function hideEditModal() {
    document.getElementById("modalOverlay").classList.add("hide");
    document.getElementById("editModal").classList.add("hide");
}

// Hiển thị modal xác nhận xóa
function showDeleteConfirmModal(id) {
    document.getElementById("deleteItemId").value = id;
    document.getElementById("modalOverlay").classList.remove("hide");
    document.getElementById("deleteConfirmModal").classList.remove("hide");
}

// Ẩn modal xác nhận xóa
function hideDeleteConfirmModal() {
    document.getElementById("modalOverlay").classList.add("hide");
    document.getElementById("deleteConfirmModal").classList.add("hide");
}

// Render dữ liệu ra bảng với phân trang
function render(data = null) {
    const list = data || getData();
    const totalPages = Math.ceil(list.length / itemsPerPage);

    // Lấy dữ liệu cho trang hiện tại
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedList = list.slice(startIndex, endIndex);

    let message = `
            <tr>
                <th class="td2 tdHeader">Tên môn học 
                    <i class="fas fa-sort sort-icon" onclick="sortItems('name')"></i>
                </th>
                <th class="td3 tdHeader">Trạng thái
                    <i class="fas fa-sort sort-icon" onclick="sortItems('status')"></i>
                </th>
                <th class="td4 tdHeader">Chức năng</th>
            </tr>
        `;

    if (paginatedList.length === 0) {
        message += `
                <tr>
                    <td colspan="3" class="text-center py-4">Không có dữ liệu</td>
                </tr>
            `;
    } else {
        for (let i = 0; i < paginatedList.length; i++) {
            const statusClass = paginatedList[i].status === "Dang hoat dong" ? "status-active" : "status-inactive";
            message += `
                <tr>
                    <td class="td2">${paginatedList[i].name}</td>
                    <td class="td3"><span class="status-badge ${statusClass}">${paginatedList[i].status}</span></td>
                    <td class="td4">
                        <button onclick="showDeleteConfirmModal('${paginatedList[i].id}')" class="trashButton">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                        <button onclick="showEditModal('${paginatedList[i].id}')" class="penButton">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `;
        }
    }
    document.getElementById("fontTable").innerHTML = message;

    // Render phân trang
    renderPagination(list.length);
}

// Render phân trang
function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    if (totalPages <= 1) return;

    // Nút Previous
    if (currentPage > 1) {
        paginationContainer.innerHTML += `
            <li onclick="changePage(${currentPage - 1})">
                <i class="fas fa-chevron-left"></i>
            </li>
        `;
    }

    // Các trang
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationContainer.innerHTML += `
                <li class="active" onclick="changePage(${i})">${i}</li>
            `;
        } else {
            paginationContainer.innerHTML += `
                <li onclick="changePage(${i})">${i}</li>
            `;
        }
    }

    // Nút Next
    if (currentPage < totalPages) {
        paginationContainer.innerHTML += `
            <li onclick="changePage(${currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </li>
        `;
    }
}

// Thay đổi trang
function changePage(page) {
    currentPage = page;
    render();
    window.scrollTo(0, 0);
}

// Thêm môn học mới
function addItem() {
    const nameInput = document.getElementById("inputName");
    const name = nameInput.value.trim();

    if (!name) {
        nameInput.classList.add("is-invalid");
        return;
    }

    const list = getData();

    // Kiểm tra tên môn học đã tồn tại hay chưa
    const isDuplicate = list.some(item => item.name.toLowerCase() === name.toLowerCase());
    if (isDuplicate) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Tên môn học đã tồn tại. Vui lòng nhập tên khác.',
            showConfirmButton: true
        });
        return;
    }

    const newItem = {
        id: Date.now().toString(),
        name: name,
        status: document.querySelector('input[name="status"]:checked').value
    };

    list.push(newItem);
    saveData(list);
    currentPage = 1; // Reset về trang 1 sau khi thêm mới
    render();
    hideAddModal();

    Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Môn học đã được thêm mới.',
        showConfirmButton: false,
        timer: 1500
    });
}

// Xác nhận xóa môn học
function confirmDelete() {
    const id = document.getElementById("deleteItemId").value;
    hideDeleteConfirmModal();

    swalWithBootstrapButtons.fire({
        title: 'Bạn có chắc chắn?',
        text: "Bạn sẽ không thể hoàn tác hành động này!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có, xóa nó!',
        cancelButtonText: 'Không, hủy bỏ!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            deleteItem(id);
        }
    });
}

// Xóa môn học
function deleteItem(id) {
    const list = getData().filter(item => item.id !== id);
    saveData(list);
    currentPage = 1; // Reset về trang 1 sau khi xóa
    render();

    Swal.fire({
        icon: 'success',
        title: 'Đã xóa!',
        text: 'Môn học đã được xóa.',
        showConfirmButton: false,
        timer: 1500
    });
}

// Cập nhật môn học
function updateItem() {
    const id = document.getElementById("editId").value;
    const nameInput = document.getElementById("editName");
    const name = nameInput.value.trim();
    const status = document.querySelector('input[name="editStatus"]:checked').value;

    if (!name) {
        nameInput.classList.add("is-invalid");
        return;
    }

    const list = getData();
    const index = list.findIndex(item => item.id === id);

    if (index !== -1) {
        list[index] = { id, name, status };
        saveData(list);
        render();
        hideEditModal();

        Swal.fire({
            icon: 'success',
            title: 'Cập nhật thành công!',
            text: 'Thông tin môn học đã được cập nhật.',
            showConfirmButton: false,
            timer: 1500
        });
    }
}

// Tìm kiếm môn học
function searchItems() {
    currentPage = 1; // Reset về trang 1 khi tìm kiếm
    const keyword = document.getElementById("searchInput").value.toLowerCase();
    const list = getData();

    if (!keyword) {
        render(list);
        return;
    }

    const filteredList = list.filter(item =>
        item.name.toLowerCase().includes(keyword)
    );
    render(filteredList);
}

// Sắp xếp môn học
let sortDirection = {};

function sortItems(field) {
    currentPage = 1; // Reset về trang 1 khi sắp xếp
    const list = getData();

    // Khởi tạo hướng sắp xếp nếu chưa có
    if (sortDirection[field] === undefined) {
        sortDirection[field] = 1; // 1 là tăng dần, -1 là giảm dần
    } else {
        sortDirection[field] *= -1; // Đảo hướng sắp xếp
    }

    list.sort((a, b) => {
        if (a[field] < b[field]) return -1 * sortDirection[field];
        if (a[field] > b[field]) return 1 * sortDirection[field];
        return 0;
    });

    saveData(list);
    render(list);
}

// Khởi tạo dữ liệu mẫu
function initSubjectData() {
    const defaultSubjects = [
        {
            id: "1",
            name: "HTML, CSS",
            status: "Dang hoat dong",
            createdAt: "2022-03-01"
        },
        {
            id: "2",
            name: "Javascript",
            status: "Dang hoat dong",
            createdAt: "2022-03-01"
        },
        {
            id: "3",
            name: "ReactJS",
            status: "Dang hoat dong",
            createdAt: "2022-03-01"
        },
        {
            id: "4",
            name: "NodeJS",
            status: "Dang hoat dong",
            createdAt: "2022-03-01"
        },
        {
            id: "5",
            name: "Database",
            status: "Dang hoat dong",
            createdAt: "2022-03-01"
        },
        {
            id: "6",
            name: "Python",
            status: "Ngung hoat dong",
            createdAt: "2022-03-01"
        }
    ];

    if (!localStorage.getItem(dataName)) {
        saveData(defaultSubjects);
    }
}

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function () {
    initSubjectData();
    render();

    // Xử lý khi chọn trạng thái filter
    document.getElementById("Status").addEventListener("change", function () {
        currentPage = 1; // Reset về trang 1 khi filter
        const status = this.value;
        const list = getData();

        if (status === "Tat ca") {
            render(list);
        } else {
            const filteredList = list.filter(item => item.status === status);
            render(filteredList);
        }
    });

    // Xử lý khi nhấn phím Enter trong ô tìm kiếm
    document.getElementById("searchInput").addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            searchItems();
        }
    });
});
// Giữ lại các hàm cũ để tương thích
function showAddGui() {
    showAddModal();
}

function showEditGui(id) {
    showEditModal(id);
}

function createPagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (currentPage > 1) {
        pagination.innerHTML += `<li onclick="createPagination(${totalPages}, ${currentPage - 1})">&larr;</li>`;
    }

    pagination.innerHTML += `<li onclick="createPagination(${totalPages}, 1)">1</li>`;
    if (currentPage > 3) pagination.innerHTML += `<li>...</li>`;

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (i === currentPage) {
            pagination.innerHTML += `<li class="active">${i}</li>`;
        } else {
            pagination.innerHTML += `<li onclick="createPagination(${totalPages}, ${i})">${i}</li>`;
        }
    }

    if (currentPage < totalPages - 2) pagination.innerHTML += `<li>...</li>`;
    pagination.innerHTML += `<li onclick="createPagination(${totalPages}, ${totalPages})">${totalPages}</li>`;

    if (currentPage < totalPages) {
        pagination.innerHTML += `<li onclick="createPagination(${totalPages}, ${currentPage + 1})">&rarr;</li>`;
    }
}

createPagination(20, 4);


// Hàm đăng xuất dùng chung
function confirmLogout(redirectURL) {
    Swal.fire({
        title: 'Bạn có chắc muốn đăng xuất?',
        text: "Phiên đăng nhập sẽ kết thúc!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Đăng xuất',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Đã đăng xuất!',
                text: 'Hẹn gặp lại bạn sau.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                window.location.href = "../pages/login.html";


            });
        }
    });
}

// Gắn sự kiện cho từng ảnh
document.getElementById("avatarLogout1").addEventListener("click", function (e) {
    e.preventDefault();
    confirmLogout("login1.html");
});

document.getElementById("avatarLogout2").addEventListener("click", function (e) {
    e.preventDefault();
    confirmLogout("login2.html");
});

document.getElementById("avatarLogout3").addEventListener("click", function (e) {
    e.preventDefault();
    confirmLogout("login3.html");
});


////////////////////

// Lấy dữ liệu bài học từ localStorage
function getLessonData() {
    return JSON.parse(localStorage.getItem(lessonDataName)) || [];
}

// Lưu dữ liệu bài học vào localStorage
function saveLessonData(list) {
    localStorage.setItem(lessonDataName, JSON.stringify(list));
}

// Hiển thị modal thêm mới bài học
// ==================== PHẦN BÀI HỌC ====================

// Biến phân trang bài học
let currentLessonPage = 1;
const lessonsPerPage = 5;

// Tên key lưu trữ bài học trong localStorage
let lessonDataName = "listLessons";

// Lấy dữ liệu bài học từ localStorage
function getLessonData() {
    return JSON.parse(localStorage.getItem(lessonDataName)) || [];
}

// Lưu dữ liệu bài học vào localStorage
function saveLessonData(list) {
    localStorage.setItem(lessonDataName, JSON.stringify(list));
}

// Hiển thị modal thêm mới bài học
function showAddLessonModal() {
    document.getElementById("inputLessonName").value = "";
    document.getElementById("inputLessonTime").value = "";
    document.getElementById("inputLessonName").classList.remove("is-invalid");
    document.getElementById("inputLessonTime").classList.remove("is-invalid");
    document.getElementById("lessonStatusIncomplete").checked = true;
    document.getElementById("lessonModalOverlay").classList.remove("hide");
    document.getElementById("addLessonModal").classList.remove("hide");

    setTimeout(() => {
        document.getElementById("inputLessonName").focus();
    }, 100);
}

// Ẩn modal thêm mới bài học
function hideAddLessonModal() {
    document.getElementById("lessonModalOverlay").classList.add("hide");
    document.getElementById("addLessonModal").classList.add("hide");
}

// Hiển thị modal chỉnh sửa bài học
function showEditLessonModal(id) {
    const list = getLessonData();
    const item = list.find(item => item.id === id);

    if (item) {
        document.getElementById("editLessonId").value = item.id;
        document.getElementById("editLessonName").value = item.name;
        document.getElementById("editLessonTime").value = item.time;
        document.getElementById("editLessonName").classList.remove("is-invalid");
        document.getElementById("editLessonTime").classList.remove("is-invalid");
        document.querySelector(`input[name="editLessonStatus"][value="${item.status}"]`).checked = true;
        document.getElementById("lessonModalOverlay").classList.remove("hide");
        document.getElementById("editLessonModal").classList.remove("hide");

        setTimeout(() => {
            document.getElementById("editLessonName").focus();
        }, 100);
    }
}

// Ẩn modal chỉnh sửa bài học
function hideEditLessonModal() {
    document.getElementById("lessonModalOverlay").classList.add("hide");
    document.getElementById("editLessonModal").classList.add("hide");
}

// Hiển thị modal xác nhận xóa bài học
function showDeleteLessonConfirmModal(id) {
    document.getElementById("deleteLessonItemId").value = id;
    document.getElementById("lessonModalOverlay").classList.remove("hide");
    document.getElementById("deleteLessonConfirmModal").classList.remove("hide");
}

// Ẩn modal xác nhận xóa bài học
function hideDeleteLessonConfirmModal() {
    document.getElementById("lessonModalOverlay").classList.add("hide");
    document.getElementById("deleteLessonConfirmModal").classList.add("hide");
}

// Render danh sách bài học với phân trang
function renderLessons(data = null) {
    const list = data || getLessonData();
    const totalPages = Math.ceil(list.length / lessonsPerPage);

    // Lấy dữ liệu cho trang hiện tại
    const startIndex = (currentLessonPage - 1) * lessonsPerPage;
    const endIndex = startIndex + lessonsPerPage;
    const paginatedList = list.slice(startIndex, endIndex);

    let message = `
        <tr>
            <th class="td2 tdHeader"><input type="checkbox" id="selectAllLessons"> Tên bài học</th>
            <th class="td3 tdHeader">Thời gian học (phút)</th>
            <th class="td3 tdHeader">Trạng thái
                <i class="fas fa-sort sort-icon" onclick="sortLessons('status')"></i>
            </th>
            <th class="td4 tdHeader">Chức năng</th>
        </tr>
    `;

    if (paginatedList.length === 0) {
        message += `
            <tr>
                <td colspan="4" class="text-center py-4">Không có dữ liệu</td>
            </tr>
        `;
    } else {
        for (let i = 0; i < paginatedList.length; i++) {
            const statusClass = paginatedList[i].status === "Da hoan thanh" ? "status-active" : "status-inactive";
            message += `
    <tr>
        <td class="td2"><input type="checkbox" class="lesson-checkbox" data-id="${paginatedList[i].id}" ${paginatedList[i].status === "Da hoan thanh" ? "checked" : ""}>${paginatedList[i].name}</td>
        <td class="td3">${paginatedList[i].time}</td>
        <td class="td3"><span class="status-badge ${statusClass}">${paginatedList[i].status}</span></td>
        <td class="td4">
            <button onclick="showDeleteLessonConfirmModal('${paginatedList[i].id}')" class="trashButton">
                <i class="fas fa-trash-alt"></i>
            </button>
            <button onclick="showEditLessonModal('${paginatedList[i].id}')" class="penButton">
                <i class="fas fa-edit"></i>
            </button>
        </td>
    </tr>
`;
        }
    }
    document.getElementById("lessonTable").innerHTML = message;

    // Render phân trang bài học
    renderLessonPagination(list.length);

    // Xử lý sự kiện chọn tất cả
    document.getElementById("selectAllLessons")?.addEventListener("change", function () {
        const checkboxes = document.querySelectorAll(".lesson-checkbox");
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });
    renderLessonPagination(list.length);
}

// Render phân trang bài học
function renderLessonPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / lessonsPerPage);
    const paginationContainer = document.querySelector('.lesson-pagination-wrapper ul');

    if (!paginationContainer) return;

    paginationContainer.innerHTML = '';

    // Tạo nút Previous
    if (currentLessonPage > 1) {
        const prevLi = document.createElement('li');
        prevLi.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevLi.addEventListener('click', () => {
            changeLessonPage(currentLessonPage - 1);
        });
        paginationContainer.appendChild(prevLi);
    }

    // Tạo các nút trang
    for (let i = 1; i <= totalPages; i++) {
        const pageLi = document.createElement('li');
        pageLi.textContent = i;
        if (i === currentLessonPage) {
            pageLi.classList.add('active');
        }
        pageLi.addEventListener('click', () => {
            changeLessonPage(i);
        });
        paginationContainer.appendChild(pageLi);
    }

    // Tạo nút Next
    if (currentLessonPage < totalPages) {
        const nextLi = document.createElement('li');
        nextLi.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextLi.addEventListener('click', () => {
            changeLessonPage(currentLessonPage + 1);
        });
        paginationContainer.appendChild(nextLi);
    }
}

// Thay đổi trang bài học
function changeLessonPage(page) {
    currentLessonPage = page;
    renderLessons();
    window.scrollTo(0, 0);
}

// Thêm bài học mới
function addLesson() {
    const nameInput = document.getElementById("inputLessonName");
    const timeInput = document.getElementById("inputLessonTime");
    const name = nameInput.value.trim();
    const time = timeInput.value.trim();

    let isValid = true;

    if (!name) {
        nameInput.classList.add("is-invalid");
        isValid = false;
    } else {
        nameInput.classList.remove("is-invalid");
    }

    if (!time || isNaN(time) || parseInt(time) <= 0) {
        timeInput.classList.add("is-invalid");
        isValid = false;
    } else {
        timeInput.classList.remove("is-invalid");
    }

    if (!isValid) return;

    const list = getLessonData();
    const newItem = {
        id: Date.now().toString(),
        name: name,
        time: parseInt(time),
        status: document.querySelector('input[name="lessonStatus"]:checked').value
    };

    list.push(newItem);
    saveLessonData(list);
    currentLessonPage = 1; // Reset về trang 1 sau khi thêm mới
    renderLessons();
    hideAddLessonModal();

    Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Bài học đã được thêm mới.',
        showConfirmButton: false,
        timer: 1500
    });
}

// Xác nhận xóa bài học
function confirmDeleteLesson() {
    const id = document.getElementById("deleteLessonItemId").value;
    hideDeleteLessonConfirmModal();

    swalWithBootstrapButtons.fire({
        title: 'Bạn có chắc chắn?',
        text: "Bạn sẽ không thể hoàn tác hành động này!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có, xóa nó!',
        cancelButtonText: 'Không, hủy bỏ!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            deleteLesson(id);
        }
    });
}

// Xóa bài học
function deleteLesson(id) {
    const list = getLessonData().filter(item => item.id !== id);
    saveLessonData(list);
    currentLessonPage = 1; // Reset về trang 1 sau khi xóa
    renderLessons();

    Swal.fire({
        icon: 'success',
        title: 'Đã xóa!',
        text: 'Bài học đã được xóa.',
        showConfirmButton: false,
        timer: 1500
    });
}

// Cập nhật bài học
function updateLesson() {
    const id = document.getElementById("editLessonId").value;
    const nameInput = document.getElementById("editLessonName");
    const timeInput = document.getElementById("editLessonTime");
    const name = nameInput.value.trim();
    const time = timeInput.value.trim();
    const status = document.querySelector('input[name="editLessonStatus"]:checked').value;

    let isValid = true;

    if (!name) {
        nameInput.classList.add("is-invalid");
        isValid = false;
    } else {
        nameInput.classList.remove("is-invalid");
    }

    if (!time || isNaN(time) || parseInt(time) <= 0) {
        timeInput.classList.add("is-invalid");
        isValid = false;
    } else {
        timeInput.classList.remove("is-invalid");
    }

    if (!isValid) return;

    const list = getLessonData();
    const index = list.findIndex(item => item.id === id);

    if (index !== -1) {
        list[index] = {
            id,
            name,
            time: parseInt(time),
            status
        };
        saveLessonData(list);
        renderLessons();
        hideEditLessonModal();

        Swal.fire({
            icon: 'success',
            title: 'Cập nhật thành công!',
            text: 'Thông tin bài học đã được cập nhật.',
            showConfirmButton: false,
            timer: 1500
        });
    }
}

// Tìm kiếm bài học
function searchLessons() {
    currentLessonPage = 1; // Reset về trang 1 khi tìm kiếm
    const keyword = document.getElementById("searchLessonInput").value.toLowerCase();
    const list = getLessonData();

    if (!keyword) {
        renderLessons(list);
        return;
    }

    const filteredList = list.filter(item =>
        item.name.toLowerCase().includes(keyword) ||
        item.time.toString().includes(keyword)
    );
    renderLessons(filteredList);
}

// Sắp xếp bài học
let lessonSortDirection = {};

function sortLessons(field) {
    currentLessonPage = 1; // Reset về trang 1 khi sắp xếp
    const list = getLessonData();

    if (lessonSortDirection[field] === undefined) {
        lessonSortDirection[field] = 1;
    } else {
        lessonSortDirection[field] *= -1;
    }

    list.sort((a, b) => {
        if (a[field] < b[field]) return -1 * lessonSortDirection[field];
        if (a[field] > b[field]) return 1 * lessonSortDirection[field];
        return 0;
    });

    saveLessonData(list);
    renderLessons(list);
}

// Xóa nhiều bài học cùng lúc
function deleteSelectedLessons() {
    const checkboxes = document.querySelectorAll(".lesson-checkbox:checked");
    if (checkboxes.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Cảnh báo',
            text: 'Vui lòng chọn ít nhất một bài học để xóa',
            showConfirmButton: true
        });
        return;
    }

    swalWithBootstrapButtons.fire({
        title: 'Bạn có chắc chắn?',
        text: `Bạn sẽ xóa ${checkboxes.length} bài học đã chọn!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Có, xóa chúng!',
        cancelButtonText: 'Không, hủy bỏ!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            const idsToDelete = Array.from(checkboxes).map(checkbox => checkbox.getAttribute("data-id"));
            const list = getLessonData().filter(item => !idsToDelete.includes(item.id));
            saveLessonData(list);
            currentLessonPage = 1; // Reset về trang 1 sau khi xóa
            renderLessons();

            Swal.fire({
                icon: 'success',
                title: 'Đã xóa!',
                text: `Đã xóa ${checkboxes.length} bài học.`,
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}

// Khởi tạo dữ liệu bài học mẫu
function initLessonData() {
    const defaultLessons = [
        {
            id: "1",
            name: "Giới thiệu HTML",
            time: 45,
            status: "Da hoan thanh",
            createdAt: "2022-03-01"
        },
        {
            id: "2",
            name: "CSS cơ bản",
            time: 60,
            status: "Da hoan thanh",
            createdAt: "2022-03-02"
        },
        {
            id: "3",
            name: "JavaScript cơ bản",
            time: 90,
            status: "Chua hoan thanh",
            createdAt: "2022-03-03"
        },
        {
            id: "4",
            name: "DOM Manipulation",
            time: 75,
            status: "Chua hoan thanh",
            createdAt: "2022-03-04"
        },
        {
            id: "5",
            name: "ES6 Features",
            time: 120,
            status: "Chua hoan thanh",
            createdAt: "2022-03-05"
        },
        {
            id: "6",
            name: "ReactJS Fundamentals",
            time: 150,
            status: "Chua hoan thanh",
            createdAt: "2022-03-06"
        }
    ];

    if (!localStorage.getItem(lessonDataName)) {
        saveLessonData(defaultLessons);
    }
}

// Khởi tạo trang bài học
function initLessonPage() {
    initLessonData();
    renderLessons();

    // Xử lý khi chọn trạng thái filter
    document.getElementById("lessonStatus")?.addEventListener("change", function () {
        currentLessonPage = 1; // Reset về trang 1 khi filter
        const status = this.value;
        const list = getLessonData();

        if (status === "Tat ca") {
            renderLessons(list);
        } else {
            const filteredList = list.filter(item => item.status === status);
            renderLessons(filteredList);
        }
    });

    // Xử lý khi nhấn phím Enter trong ô tìm kiếm
    document.getElementById("searchLessonInput")?.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            searchLessons();
        }
    });

    // Xử lý khi click nút xóa nhiều
    document.getElementById("deleteSelectedLessonsBtn")?.addEventListener("click", deleteSelectedLessons);
}

// Xử lý khi chuyển tab
function showContent(id) {
    document.querySelectorAll('.content').forEach(el => el.style.display = 'none');
    document.getElementById(id).style.display = 'block';

    // Nếu là tab bài học thì khởi tạo
    if (id === 'lessons') {
        initLessonPage();
    }
}

// Khởi tạo khi trang được tải
document.addEventListener('DOMContentLoaded', function () {
    if (window.location.hash === '#lessons') {
        initLessonPage();
    }
});