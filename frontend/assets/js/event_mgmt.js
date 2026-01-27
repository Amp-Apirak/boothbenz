/**
 * Event Management Logic - Thonburi Phanich
 * Version: 1.1.0
 * Description: จัดการข้อมูลผู้เข้างาน (Users) พร้อมระบบกรองช่วงวันที่
 */

let currentUsers = [];
let selectedDb = "";
let startDate = moment().startOf("day");
let endDate = moment().endOf("day");

$(document).ready(function () {
  console.log("👥 Event Management v1.1.0 (Date Filter) Initialized");

  // 1. โหลดรายชื่อฐานข้อมูล
  initDatabaseSelector();

  // 2. เริ่มต้น Date Range Picker
  initDateRangePicker();

  // 3. ดักจับการเปลี่ยนฐานข้อมูล
  $("#dbSelect").on("change", function () {
    selectedDb = $(this).val();
    if (selectedDb) {
      loadUsersData(selectedDb);
    } else {
      resetTable();
    }
  });

  // 4. ปุ่ม Refresh
  $("#btnRefresh").on("click", function () {
    if (selectedDb) {
      loadUsersData(selectedDb);
    } else {
      Swal.fire("แจ้งเตือน", "กรุณาเลือกฐานข้อมูลก่อนครับ", "info");
    }
  });

  // 5. จัดการการอัปเดตข้อมูล (Update Data)
  $("#btnUpdateType").on("click", function () {
    updateUserType();
  });

  // 6. ระบบค้นหาในตาราง
  $("#tableSearch").on("keyup", function () {
    const value = $(this).val().toLowerCase();
    $("#usersTableBody tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});

/**
 * Initialize Date Range Picker
 */
function initDateRangePicker() {
  const start = moment().startOf("day");
  const end = moment().endOf("day");

  function cb(start, end) {
    $("#reportrange span").html(
      start.format("MMMM D, YYYY") + " - " + end.format("MMMM D, YYYY"),
    );
    startDate = start;
    endDate = end;

    // ถ้ามีการเลือก DB อยู่แล้ว ให้โหลดข้อมูลใหม่ตามช่วงวันที่เลือก
    if (selectedDb) {
      loadUsersData(selectedDb);
    }
  }

  $("#reportrange").daterangepicker(
    {
      startDate: start,
      endDate: end,
      ranges: {
        Today: [moment().startOf("day"), moment().endOf("day")],
        Yesterday: [
          moment().subtract(1, "days").startOf("day"),
          moment().subtract(1, "days").endOf("day"),
        ],
        "Last 7 Days": [moment().subtract(6, "days"), moment()],
        "Last 30 Days": [moment().subtract(29, "days"), moment()],
        "This Month": [moment().startOf("month"), moment().endOf("month")],
        "Last Month": [
          moment().subtract(1, "month").startOf("month"),
          moment().subtract(1, "month").endOf("month"),
        ],
      },
      locale: {
        format: "YYYY-MM-DD",
      },
    },
    cb,
  );

  cb(start, end);
}

/**
 * Initialize Database Selector from API
 */
async function initDatabaseSelector() {
  const dbSelect = $("#dbSelect");

  try {
    const result = await API.getDatabases();

    if (result.success && result.databases) {
      let options = '<option value="">-- เลือกฐานข้อมูล --</option>';
      result.databases.forEach((db) => {
        const dbName = typeof db === "object" ? db.database_name : db;
        const dbLabel =
          typeof db === "object" ? db.database_label || db.database_name : db;

        if (dbName.startsWith("db_")) {
          options += `<option value="${dbName}">${dbLabel}</option>`;
        }
      });
      dbSelect.html(options);
    } else {
      dbSelect.html('<option value="">ไม่สามารถโหลด DB ได้</option>');
    }
  } catch (error) {
    console.error("❌ Init DB Error:", error);
    dbSelect.html('<option value="">เกิดข้อผิดพลาด</option>');
  }
}

/**
 * Load Users Data (Combined Search & Recent)
 */
async function loadUsersData(dbName) {
  const tableBody = $("#usersTableBody");
  const userCount = $("#userCount");

  tableBody.html(`
        <tr>
            <td colspan="7" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 mb-0">กำลังโหลดข้อมูลผู้เข้างานจาก ${dbName}...</p>
            </td>
        </tr>
    `);

  try {
    let result;

    // ถ้ามีช่วงวันที่ ให้ใช้ searchEvents (BenzEventSearch)
    if (startDate && endDate) {
      console.log(
        `🔍 Searching users between ${startDate.format()} and ${endDate.format()}`,
      );
      result = await API.searchEvents({
        db: dbName,
        collection: "users",
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        limit: 500,
        sort: -1,
      });
    } else {
      // ถ้าไม่มีช่วงวันที่ (ซึ่งปกติจะมีจาก init) ให้โหลด 100 รายการล่าสุด
      result = await API.getDocuments({
        db: dbName,
        col: "users",
        limit: 100,
        sort_field: "_id",
        sort_dir: -1,
      });
    }

    if (result.success && result.docs) {
      currentUsers = result.docs;
      userCount.text(currentUsers.length);
      renderUsersTable(currentUsers);
    } else {
      tableBody.html(
        `<tr><td colspan="7" class="text-center py-5 text-warning">ไม่พบข้อมูลผู้เข้างานในช่วงเวลาที่เลือก</td></tr>`,
      );
      userCount.text(0);
    }
  } catch (error) {
    console.error("❌ Load Users Error:", error);
    tableBody.html(
      `<tr><td colspan="7" class="text-center py-5 text-danger">เกิดข้อผิดพลาดในการเรียก API</td></tr>`,
    );
  }
}

/**
 * Render Users Table
 */
function renderUsersTable(users) {
  const tableBody = $("#usersTableBody");

  if (!users || users.length === 0) {
    tableBody.html(
      '<tr><td colspan="7" class="text-center py-5 text-muted">ไม่พบข้อมูลผู้เข้างานในช่วงเวลานี้</td></tr>',
    );
    return;
  }

  const rows = users
    .map((user) => {
      const faceImg =
        user.images && user.images.face
          ? `${API.config.BASE_URL}/images/${user.images.face}`
          : "https://via.placeholder.com/45/f0f0f0/999?text=?";

      const typeClass = `type-${(user.type || "visitor").toLowerCase()}`;

      return `
            <tr>
                <td>
                    <img src="${faceImg}" class="user-face" onerror="this.src='https://via.placeholder.com/45/f0f0f0/999?text=Error'">
                </td>
                <td class="small">
                    <div>${new Date(user.timestamp).toLocaleDateString()}</div>
                    <div class="text-muted">${new Date(user.timestamp).toLocaleTimeString()}</div>
                </td>
                <td class="small">
                    <div class="fw-bold text-primary">${user.uuid || "-"}</div>
                    <div class="text-muted" style="font-size: 0.7rem;">ID: ${user._id}</div>
                </td>
                <td>
                    <span class="badge-type ${typeClass}">${user.type || "visitor"}</span>
                </td>
                <td class="small">
                    <span class="text-muted"><i class="bi bi-gender-ambiguous"></i> ${user.gender || "-"}</span> | 
                    <span class="text-muted"><i class="bi bi-emoji-smile"></i> ${user.emotion || "-"}</span> | 
                    <span class="text-muted"><i class="bi bi-person-vcard"></i> ${user.age || "-"}</span>
                </td>
                <td><span class="badge bg-light text-dark border">Zone ${user.zone || "-"}</span></td>
                <td class="text-center">
                    <button class="btn btn-sm btn-outline-dark" onclick="openEditTypeModal('${user._id}')">
                        <i class="bi bi-pencil-square"></i> แก้ไข Data
                    </button>
                </td>
            </tr>
        `;
    })
    .join("");

  tableBody.html(rows);
}

/**
 * Open Modal to edit data (Type & Gender)
 */
window.openEditTypeModal = function (id) {
  const user = currentUsers.find((u) => u._id === id);
  if (!user) return;

  $("#edit-doc-id").val(id);
  $("#edit-uuid-text").text(`UUID: ${user.uuid || "N/A"}`);
  $("#edit-current-type").text(
    `Current: ${user.type || "visitor"} | Gender: ${user.gender || "none"}`,
  );

  const faceImg =
    user.images && user.images.face
      ? `${API.config.BASE_URL}/images/${user.images.face}`
      : "https://via.placeholder.com/45/f0f0f0/999?text=?";
  $("#edit-face-img").attr("src", faceImg);

  $("#newTypeSelect").val((user.type || "visitor").toLowerCase());
  $("#newGenderSelect").val((user.gender || "none").toLowerCase());

  const modal = new bootstrap.Modal(document.getElementById("editTypeModal"));
  modal.show();
};

/**
 * Update User Data via API PATCH
 */
async function updateUserType() {
  const id = $("#edit-doc-id").val();
  const newType = $("#newTypeSelect").val();
  const newGender = $("#newGenderSelect").val();
  const btnUpdate = $("#btnUpdateType");
  const spinner = $("#updateSpinner");

  if (!id || !selectedDb) {
    Swal.fire("Error", "ไม่พบข้อมูล ID หรือ ฐานข้อมูล", "error");
    return;
  }

  btnUpdate.prop("disabled", true);
  spinner.removeClass("d-none");

  try {
    const result = await API.updateEventUser(
      id,
      {
        type: newType,
        gender: newGender,
      },
      selectedDb,
      "users",
    );

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "อัปเดตสำเร็จ",
        text: `ข้อมูลถูกบันทึกเรียบร้อยแล้ว`,
        timer: 1500,
        showConfirmButton: false,
      });

      const modalElement = document.getElementById("editTypeModal");
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();

      loadUsersData(selectedDb);
    } else {
      Swal.fire("ผิดพลาด", result.error || "ไม่สามารถอัปเดตข้อมูลได้", "error");
    }
  } catch (error) {
    console.error("❌ Update Data Exception:", error);
    Swal.fire("Error", "เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย", "error");
  } finally {
    btnUpdate.prop("disabled", false);
    spinner.addClass("d-none");
  }
}

function resetTable() {
  $("#usersTableBody").html(
    '<tr><td colspan="7" class="text-center py-5 text-muted">กรุณาเลือกฐานข้อมูลเพื่อโหลดข้อมูล</td></tr>',
  );
  $("#userCount").text(0);
}
