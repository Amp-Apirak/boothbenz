/**
 * Admin Management Logic - Thonburi Phanich
 * Version: 1.2.0 (Complete Edition + Edit Support)
 * Description: จัดการข้อมูล Benz-info ครบถ้วน (รองรับทั้ง เพิ่ม และ แก้ไข)
 */

let allConfigs = []; // เก็บข้อมูลทั้งหมดไว้ใช้ค้นหา

$(document).ready(function () {
  console.log("🛡️ Admin Console (v1.2.0) Initialized");

  // โหลดข้อมูลทั้งหมดเมื่อเปิดหน้า
  loadAllConfigs();

  // จัดการการส่งฟอร์ม (Submit Form) - รองรับทั้ง Add และ Edit
  $("#uploadForm").on("submit", async function (e) {
    e.preventDefault();
    await handleFormSubmit(this);
  });

  // เมื่อปิด Modal ให้ล้างข้อมูล (Reset Form to Add Mode)
  $("#uploadModal").on("hidden.bs.modal", function () {
    resetFormToAddMode();
  });
});

/**
 * Load all web configs from API
 */
async function loadAllConfigs() {
  const tableBody = $("#configTableBody");

  try {
    const result = await API.getAllWebConfigs();

    if (result.success && result.configs) {
      allConfigs = result.configs;
      renderConfigTable(result.configs);
    } else {
      console.warn("⚠️ No configs found or API error:", result.error);
      tableBody.html(
        `<tr><td colspan="6" class="text-center py-4 text-warning"><i class="bi bi-exclamation-triangle me-2"></i> ${result.error || "ไม่พบข้อมูลในระบบ"}</td></tr>`,
      );
    }
  } catch (error) {
    console.error("❌ Error loading configs:", error);
    tableBody.html(
      `<tr><td colspan="6" class="text-center py-4 text-danger"><i class="bi bi-x-circle me-2"></i> เกิดข้อผิดพลาดในการดึงข้อมูลจาก Server</td></tr>`,
    );
  }
}

/**
 * Render configs to table
 */
function renderConfigTable(configs) {
  const tableBody = $("#configTableBody");

  if (!configs || configs.length === 0) {
    tableBody.html(
      '<tr><td colspan="6" class="text-center py-5 text-muted"><i class="bi bi-inbox me-2"></i> ยังไม่มีข้อมูลฐานข้อมูลในระบบ เริ่มต้นสร้างได้โดยกดปุ่ม "เพิ่มข้อมูลใหม่"</td></tr>',
    );
    return;
  }

  const rows = configs
    .map((cfg, index) => {
      const previewImg =
        cfg.img_header2 ||
        cfg.img_header ||
        "https://via.placeholder.com/80x50/343A40/FFFFFF?text=No+Img";

      return `
            <tr>
                <td class="fw-bold">${index + 1}</td>
                <td><code class="text-primary fw-bold" style="background: #f0f4ff; padding: 3px 8px; border-radius: 4px;">${cfg.database_name}</code></td>
                <td><span class="badge bg-dark text-white p-2" style="font-weight: 500;">${cfg.database_label || "-"}</span></td>
                <td>
                    <div class="small fw-bold">${cfg.txt_header || "-"}</div>
                    <div class="small text-muted text-truncate" style="max-width: 150px;">${cfg.txt_header2 || "-"}</div>
                </td>
                <td>
                    <img src="${previewImg}" class="config-preview" 
                         onerror="this.src='https://via.placeholder.com/80x50/343A40/FFFFFF?text=Error'">
                </td>
                <td class="text-center">
                    <div class="btn-group btn-group-sm shadow-sm">
                        <button class="btn btn-primary" onclick="viewDetail('${cfg._id}')" title="ดูรายละเอียด">
                            <i class="bi bi-eye-fill"></i>
                        </button>
                        <button class="btn btn-warning" onclick="openEditMode('${cfg._id}')" title="แก้ไขข้อมูล">
                            <i class="bi bi-pencil-square"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="confirmDelete('${cfg._id}', '${cfg.database_name}')" title="ลบข้อมูล">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    })
    .join("");

  tableBody.html(rows);
}

/**
 * Open Form in Edit Mode
 * ดึงข้อมูลเดิมมาใส่ในฟอร์ม
 */
function openEditMode(id) {
  const cfg = allConfigs.find((c) => c._id === id);
  if (!cfg) return;

  // 1. เปลี่ยน UI ของ Modal เป็นโหมดแก้ไข
  $("#modalTitle").html(
    `<i class="bi bi-pencil-square me-2 text-warning"></i> แก้ไขข้อมูล: ${cfg.database_name}`,
  );
  $("#btnSubmitText").text("ยืนยันการแก้ไขข้อมูล");
  $("#config_id").val(id);

  // 2. เติมข้อมูลเดิมใส่ฟอร์ม (เฉพาะข้อความ)
  const form = document.getElementById("uploadForm");

  // Basic Info
  form.database_name.value = cfg.database_name || "";
  form.database_label.value = cfg.database_label || "";
  form.txt_header.value = cfg.txt_header || "";
  form.txt_header_detail.value = cfg.txt_header_detail || "";
  form.txt_header2.value = cfg.txt_header2 || "";
  form.txt_header2_detail.value = cfg.txt_header2_detail || "";

  // CCTV Links
  for (let i = 1; i <= 8; i++) {
    form[`detail_link${i}`].value = cfg[`detail_link${i}`] || "";
  }

  // Layout Row 10
  form.txt_body.value = cfg.txt_body || "";
  form.txt_body_detail.value = cfg.txt_body_detail || "";

  // 3. เปิด Modal
  const modal = new bootstrap.Modal(document.getElementById("uploadModal"));
  modal.show();
}

/**
 * Reset Form to Add Mode
 */
function resetFormToAddMode() {
  $("#modalTitle").html(
    `<i class="bi bi-plus-square-fill me-2 text-primary"></i> เพิ่มข้อมูลฐานข้อมูลใหม่`,
  );
  $("#btnSubmitText").text("เพิ่มรายการใหม่");
  $("#config_id").val("");
  document.getElementById("uploadForm").reset();
}

/**
 * Handle Form Submission (Add vs Edit)
 */
async function handleFormSubmit(form) {
  const configId = $("#config_id").val();
  const formData = new FormData(form);
  const btnSubmit = $("#btnSubmit");
  const spinner = $("#submitSpinner");

  btnSubmit.prop("disabled", true);
  spinner.removeClass("d-none");

  try {
    let result;
    if (configId) {
      // MODE: EDIT (PATCH)
      console.log(`🔄 Patching config ID: ${configId}`);
      result = await API.patchWebConfig(configId, formData);
    } else {
      // MODE: ADD (POST)
      console.log(`📤 Uploading new config`);
      result = await API.uploadWebConfig(formData);
    }

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: configId ? "แก้ไขสำเร็จ!" : "เพิ่มสำเร็จ!",
        text: "ข้อมูลถูกบันทึกลงฐานข้อมูลเรียบร้อยแล้ว",
        timer: 2000,
        confirmButtonColor: "#0d6efd",
      });

      const modalElement = document.getElementById("uploadModal");
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) modal.hide();

      loadAllConfigs();
    } else {
      Swal.fire(
        "เกิดข้อผิดพลาด",
        result.error || "ไม่สามารถบันทึกข้อมูลได้",
        "error",
      );
    }
  } catch (error) {
    Swal.fire("Error", "เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย", "error");
  } finally {
    btnSubmit.prop("disabled", false);
    spinner.addClass("d-none");
  }
}

/**
 * View Detail Logic
 */
function viewDetail(id) {
  const cfg = allConfigs.find((c) => c._id === id);
  if (!cfg) return;

  const content = $("#detailContent");

  let html = `
    <div class="p-4 bg-light border-bottom mb-3 d-flex justify-content-between align-items-center">
        <div>
            <h5 class="fw-bold text-dark mb-1">${cfg.database_label || "-"}</h5>
            <code class="text-primary">${cfg.database_name}</code>
        </div>
        <button class="btn btn-warning btn-sm" onclick="openEditMode('${cfg._id}')">
            <i class="bi bi-pencil-square"></i> แก้ไขข้อมูลนี้
        </button>
    </div>
    <div class="px-4 pb-4">
        <h6 class="fw-bold border-start border-primary border-4 ps-2 mb-3">1. ข้อมูลหัวข้อและรูปภาพหลัก</h6>
        ${renderDetailRow("Header (Row 1)", cfg.txt_header, cfg.img_header)}
        ${renderDetailRow("Detail (Row 1)", cfg.txt_header_detail)}
        ${renderDetailRow("Hero Title (Row 2)", cfg.txt_header2, cfg.img_header2)}
        ${renderDetailRow("Hero Detail (Row 2)", cfg.txt_header2_detail)}
        
        <h6 class="fw-bold border-start border-primary border-4 ps-2 mt-4 mb-3">2. ระบบกล้อง CCTV (Row 3-4)</h6>
        <div class="row g-2 mb-4">
  `;

  for (let i = 1; i <= 8; i++) {
    if (cfg[`detail_link${i}`] || cfg[`img_link${i}`]) {
      html += `
            <div class="col-md-6 border rounded p-2 bg-white">
                <div class="small fw-bold text-muted">จุดที่ ${i}</div>
                <div class="small">ชื่อเรียก: <b>${cfg[`detail_link${i}`] || "-"}</b></div>
                ${cfg[`img_link${i}`] ? `<img src="${cfg[`img_link${i}`]}" class="mt-2 rounded shadow-sm" style="width: 100%; height: 80px; object-fit: cover;">` : ""}
            </div>
        `;
    }
  }

  html += `
        </div>
        <h6 class="fw-bold border-start border-primary border-4 ps-2 mt-4 mb-3">3. รถยนต์และแผนผังพื้น (Row 7, 10)</h6>
        <div class="row g-2 mb-3">
  `;

  for (let i = 1; i <= 8; i++) {
    if (cfg[`car_img${i}`]) {
      html += `
            <div class="col-md-3">
                <img src="${cfg[`car_img${i}`]}" class="rounded border shadow-sm" style="width: 100%; height: 60px; object-fit: cover;" title="รูปรถคันที่ ${i}">
            </div>
        `;
    }
  }

  html += `
        </div>
        ${renderDetailRow("หัวข้อผังงาน (Row 10)", cfg.txt_body, cfg.img_body)}
        ${renderDetailRow("รายละเอียดผังงาน", cfg.txt_body_detail)}
    </div>
  `;

  content.html(html);
  const modal = new bootstrap.Modal(document.getElementById("detailModal"));
  modal.show();
}

function renderDetailRow(label, value, img = null) {
  let content = `<div class="detail-item">
    <span class="detail-label">${label}</span>
    <span class="detail-value">${value || '<span class="text-muted">ไม่ระบุ</span>'}</span>`;

  if (img)
    content += `<div class="mt-2"><img src="${img}" class="rounded shadow-sm border" style="max-width: 250px; max-height: 150px;"></div>`;

  content += `</div>`;
  return content;
}

/**
 * Delete Logic
 */
async function confirmDelete(id, name) {
  const result = await Swal.fire({
    title: "ยืนยันการลบ?",
    text: `ต้องการลบการตั้งค่าของ "${name}" ออกจากระบบหรือไม่?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "ยืนยันการลบ",
    cancelButtonText: "ยกเลิก",
  });

  if (result.isConfirmed) {
    const res = await API.deleteWebConfig(id);
    if (res.success) {
      Swal.fire("ลบสำเร็จ!", "ข้อมูลถูกลบเรียบร้อยแล้ว", "success");
      loadAllConfigs();
    } else {
      Swal.fire("ผิดพลาด", res.error, "error");
    }
  }
}
