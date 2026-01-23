/**
 * Admin Management Logic - Thonburi Phanich
 * Version: 1.1.0 (Complete Edition)
 * Description: จัดการข้อมูล Benz-info ครบถ้วนตาม API Schema (35 ฟิลด์)
 */

let allConfigs = []; // เก็บข้อมูลทั้งหมดไว้ใช้ค้นหา

$(document).ready(function () {
  console.log("🛡️ Perfect Admin Console Initialized");

  // โหลดข้อมูลทั้งหมดเมื่อเปิดหน้า
  loadAllConfigs();

  // จัดการการส่งฟอร์ม (Submit Form)
  $("#uploadForm").on("submit", async function (e) {
    e.preventDefault();
    await handleUpload(this);
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
      allConfigs = result.configs; // เก็บไว้ใช้ใน viewDetail
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
      // Preview Header 2 หรือ Header เป็นหลัก
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
                    <div class="btn-group shadow-sm">
                        <button class="btn btn-primary btn-sm px-3" onclick="viewDetail('${cfg._id}')">
                            <i class="bi bi-eye-fill"></i> ดูข้อมูล
                        </button>
                        <button class="btn btn-outline-danger btn-sm px-3" onclick="confirmDelete('${cfg._id}', '${cfg.database_name}')">
                            <i class="bi bi-trash-fill"></i> ลบ
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
 * Handle File Upload
 */
async function handleUpload(form) {
  const formData = new FormData(form);
  const btnSubmit = $("#btnSubmit");
  const spinner = $("#submitSpinner");

  btnSubmit.prop("disabled", true);
  spinner.removeClass("d-none");

  try {
    const result = await API.uploadWebConfig(formData);

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "สำเร็จ!",
        text: "บันทึกข้อมูลและอัปโหลดไฟล์เรียบร้อยแล้ว",
        confirmButtonColor: "#0d6efd",
      });

      form.reset();
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("uploadModal"),
      );
      modal.hide();
      loadAllConfigs();
    } else {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: result.error || "ไม่สามารถบันทึกข้อมูลได้",
      });
    }
  } catch (error) {
    Swal.fire("Error", "เกิดข้อผิดพลาดในการเชื่อมต่อ", "error");
  } finally {
    btnSubmit.prop("disabled", false);
    spinner.addClass("d-none");
  }
}

/**
 * View Detail in Modal
 */
function viewDetail(id) {
  const cfg = allConfigs.find((c) => c._id === id);
  if (!cfg) return;

  const content = $("#detailContent");

  // สร้างรายการข้อมูลที่จะแสดง
  let html = `
    <div class="p-4 bg-light border-bottom mb-3">
        <h5 class="fw-bold text-dark mb-1">${cfg.database_label || "-"}</h5>
        <code class="text-primary">${cfg.database_name}</code>
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

  // CCTV Links
  for (let i = 1; i <= 8; i++) {
    if (cfg[`detail_link${i}`] || cfg[`img_link${i}`]) {
      html += `
            <div class="col-md-6 border rounded p-2 bg-white">
                <div class="small fw-bold text-muted">กล้องจุดพิกัดที่ ${i}</div>
                <div class="small">Label: <b>${cfg[`detail_link${i}`] || "-"}</b></div>
                ${cfg[`img_link${i}`] ? `<img src="${cfg[`img_link${i}`]}" class="mt-2 rounded" style="width: 100%; height: 80px; object-fit: cover;">` : '<div class="small text-muted">(ไม่มีรูปภาพ)</div>'}
            </div>
        `;
    }
  }

  html += `
        </div>
        <h6 class="fw-bold border-start border-primary border-4 ps-2 mt-4 mb-3">3. รถยนต์และแผนผังงาน (Row 7, 10)</h6>
        <div class="row g-2 mb-3">
  `;

  // Car Images
  for (let i = 1; i <= 8; i++) {
    if (cfg[`car_img${i}`]) {
      html += `
            <div class="col-md-3">
                <div class="small text-muted">คันที่ ${i}</div>
                <img src="${cfg[`car_img${i}`]}" class="rounded border" style="width: 100%; height: 60px; object-fit: cover;">
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

/** Helper to render label+value row */
function renderDetailRow(label, value, img = null) {
  let content = `<div class="detail-item">
    <span class="detail-label">${label}</span>
    <span class="detail-value">${value || '<span class="text-muted">ไม่ระบุ</span>'}</span>`;

  if (img) {
    content += `<div class="mt-2"><img src="${img}" class="rounded shadow-sm" style="max-width: 200px; max-height: 120px;"></div>`;
  }

  content += `</div>`;
  return content;
}

/**
 * Confirm and Delete
 */
async function confirmDelete(id, name) {
  const result = await Swal.fire({
    title: "ยืนยันการลบ?",
    text: `ต้องการลบการตั้งค่าของ "${name}" หรือไม่?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    confirmButtonText: "ลบข้อมูล",
  });

  if (result.isConfirmed) {
    const res = await API.deleteWebConfig(id);
    if (res.success) {
      Swal.fire("ลบสำเร็จ", "", "success");
      loadAllConfigs();
    } else {
      Swal.fire("ผิดพลาด", res.error, "error");
    }
  }
}
