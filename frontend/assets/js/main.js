/**
 * ==========================================================================
 * Main Application - Thonburi Phanich Dashboard
 * Version: 2.0.0
 * Description: Main application logic - API Only (No Mock Data)
 * ==========================================================================
 */

// Application State
const appState = {
  currentDatabase: "",
  currentCollection: "users",
  dateRange: {
    start: null,
    end: null,
  },
  allDocuments: [],
  filteredDocuments: [],
  isLoading: false,
  webConfig: null,
  availableDatabases: [],
  filters: {
    type: "customer",
    gender: "all",
    emotion: "all",
    zone: "all",
  },
};

/**
 * ==========================================================================
 * Initialization
 * ==========================================================================
 */

/**
 * Initialize Application
 */
async function initializeApp() {
  // Clear Browser Data on Entry (Cookies & Cache/Storage)
  clearBrowserData();

  console.log("🚀 Initializing Thonburi Phanich Dashboard...");
  console.log("📡 Mode: API Only (No Mock Data)");

  showLoading();

  try {
    // 1. Check API Health
    const apiHealthy = await checkApiHealth();
    if (!apiHealthy) {
      showInfoBanner(
        "❌ ไม่สามารถเชื่อมต่อ API Server ได้ กรุณาตรวจสอบการเชื่อมต่อ",
      );
      hideLoading();
      return;
    }

    // 2. Load Databases from API
    await loadDatabases();

    // 3. Load Web Config from API
    await loadWebConfig();

    // 4. Initialize Date Range Picker
    initializeDateRangePicker();

    // 5. Set up Event Listeners
    setupEventListeners();

    // 6. Load Dashboard Data from API
    await loadDashboardData();

    console.log("✅ Dashboard initialized successfully");
  } catch (error) {
    console.error("❌ Initialization error:", error);
    showInfoBanner("❌ เกิดข้อผิดพลาดในการเริ่มต้นระบบ: " + error.message);
  } finally {
    hideLoading();
  }
}

/**
 * Check API Health
 */
async function checkApiHealth() {
  console.log("🔍 Checking API health...");
  const result = await API.checkHealth();

  if (!result.success) {
    console.error("❌ API Server ไม่พร้อมใช้งาน");
    return false;
  }

  console.log("✅ API Health Check passed", result.data);
  return true;
}

/**
 * Load Available Databases from API
 * GET /benzEvents/api/BenzEventGetDB
 */
async function loadDatabases() {
  console.log("📂 Loading databases from API...");

  const select = document.getElementById("databaseSelect");
  if (!select) {
    console.warn("Database select element not found");
    return;
  }

  try {
    const result = await API.getDatabases();

    if (result.success && result.databases && result.databases.length > 0) {
      appState.availableDatabases = result.databases;
      console.log("✅ Databases loaded from API:", result.databases);

      // Always set default database to first one in the list
      if (result.databases.length > 0) {
        appState.currentDatabase = result.databases[0].database_name;
        console.log("📌 Default database set to:", appState.currentDatabase);
      }
    } else {
      console.warn("⚠️ No databases found from API");
      appState.availableDatabases = [];
      showInfoBanner("⚠️ ไม่พบฐานข้อมูลจาก API");
    }
  } catch (error) {
    console.error("❌ Error loading databases:", error.message);
    appState.availableDatabases = [];
    showInfoBanner("❌ ไม่สามารถโหลดรายการฐานข้อมูลได้");
  }

  updateDatabaseSelect();
}

/**
 * Update Database Select Dropdown
 */
function updateDatabaseSelect() {
  const select = document.getElementById("databaseSelect");
  if (!select) return;

  const databases = appState.availableDatabases;

  if (databases.length === 0) {
    select.innerHTML = '<option value="">ไม่พบฐานข้อมูล</option>';
    return;
  }

  // สร้าง options - แสดง label (ถ้ามี) แต่ส่ง value เป็น name
  select.innerHTML = databases
    .map((db) => {
      const dbName = typeof db === "object" ? db.database_name : db;
      const dbLabel =
        typeof db === "object" ? db.database_label || db.database_name : db;

      return `
        <option value="${dbName}" ${dbName === appState.currentDatabase ? "selected" : ""}>
            ${dbLabel}
        </option>
    `;
    })
    .join("");

  // ถ้า currentDatabase ไม่อยู่ในรายการ ให้เลือกตัวแรก
  const currentExists = databases.find((db) => {
    const dbName = typeof db === "object" ? db.database_name : db;
    return dbName === appState.currentDatabase;
  });

  if (!currentExists && databases.length > 0) {
    const firstDbName =
      typeof databases[0] === "object"
        ? databases[0].database_name
        : databases[0];
    appState.currentDatabase = firstDbName;
    select.value = firstDbName;
  }

  console.log(`📋 Database dropdown updated with ${databases.length} options`);
}

/**
 * ==========================================================================
 * Web Config Loading (Benz-info API)
 * ==========================================================================
 */

/**
 * Load Web Configuration from API
 * GET /benzEvents/api/benzInfoGet
 * Filter by database_name
 */
async function loadWebConfig() {
  const selectedDB = appState.currentDatabase;

  if (!selectedDB) {
    console.warn("⚠️ No database selected");
    return;
  }

  console.log("🎨 Loading Web Config for:", selectedDB);
  console.log("📡 Fetching from API: /benzEvents/api/benzInfoGet");

  try {
    const result = await API.getWebConfig(selectedDB);

    if (result.success && result.config) {
      appState.webConfig = result.config;

      console.log("✅ Web Config loaded from API");
      console.log("📋 Config data:", {
        database_name: result.config.database_name,
        database_label: result.config.database_label,
        txt_header: result.config.txt_header,
        txt_header2: result.config.txt_header2,
      });

      showInfoBanner(
        `✅ โหลดข้อมูล "${result.config.database_label || selectedDB}" สำเร็จ`,
      );
    } else {
      console.warn(`⚠️ No Web Config found in API for: ${selectedDB}`);
      appState.webConfig = null;
      showInfoBanner(`⚠️ ไม่พบข้อมูล Benz-info สำหรับ "${selectedDB}"`);
    }
  } catch (error) {
    console.error("❌ Error loading Web Config:", error.message);
    appState.webConfig = null;
  }

  updateWebConfigUI();
}

/**
 * Update UI with Web Config Data
 * Mapping ตาม docs/table.csv:
 * - ROW 1: txt_header, txt_header_detail, img_header
 * - ROW 2: txt_header2, txt_header2_detail, img_header2
 * - ROW 3-4: img_link1-8, detail_link1-8
 * - ROW 7: car_img1-8
 * - ROW 10: txt_body, txt_body_detail, img_body
 */
function updateWebConfigUI() {
  const config = appState.webConfig;

  if (!config) {
    console.warn("⚠️ No Web Config available - using defaults");
    // Reset to defaults or hide dynamic sections
    resetWebConfigUI();
    return;
  }

  console.log("🔄 Updating Web Config UI with data:", config.database_name);

  // ROW 1: Header Section
  updateHeaderSection(config);

  // ROW 2: Hero Image Section
  updateHeroSection(config);

  // ROW 3-4: CCTV Camera Cards
  renderCameraCards(config);

  // ROW 7: Car Models Gallery
  renderCarGallery(config);

  // ROW 10: CCTV Layout Visualization
  updateLayoutSection(config);

  console.log("✅ Web Config UI updated");
  console.log("📊 Summary:", {
    header: config.txt_header || "(not set)",
    hero: config.txt_header2 || "(not set)",
    cameras: countCameras(config),
    cars: countCars(config),
    layout: config.txt_body || "(not set)",
  });
}

/**
 * Reset Web Config UI to defaults
 */
function resetWebConfigUI() {
  // Hide camera section if no config
  const cameraSection = document.getElementById("cameras");
  if (cameraSection) {
    cameraSection.style.display = "none";
  }

  // Hide car gallery section if no config
  const carGallerySection = document.getElementById("car-gallery");
  if (carGallerySection) {
    carGallerySection.style.display = "none";
  }
}

/**
 * Count available cameras in config
 */
function countCameras(config) {
  let count = 0;
  for (let i = 1; i <= 8; i++) {
    if (config[`img_link${i}`] && config[`detail_link${i}`]) {
      count++;
    }
  }
  return count;
}

/**
 * Count available cars in config
 */
function countCars(config) {
  let count = 0;
  for (let i = 1; i <= 8; i++) {
    if (config[`car_img${i}`]) {
      count++;
    }
  }
  return count;
}

/**
 * ROW 1: Update Header Section
 */
function updateHeaderSection(config) {
  const txtHeader = document.getElementById("txtHeader");
  if (txtHeader && config.txt_header) {
    txtHeader.textContent = config.txt_header;
  }

  const txtHeaderDetail = document.getElementById("txtHeaderDetail");
  if (txtHeaderDetail) {
    if (config.txt_header_detail) {
      txtHeaderDetail.textContent = config.txt_header_detail;
      txtHeaderDetail.style.display = "block";
    } else {
      txtHeaderDetail.style.display = "none";
    }
  }
}

/**
 * ROW 2: Update Hero Image Section
 */
function updateHeroSection(config) {
  const imgHeader2 = document.getElementById("imgHeader2");
  if (imgHeader2 && config.img_header2) {
    imgHeader2.src = config.img_header2;
  }

  const txtHeader2 = document.getElementById("txtHeader2");
  if (txtHeader2 && config.txt_header2) {
    txtHeader2.textContent = config.txt_header2;
  }

  const txtHeader2Detail = document.getElementById("txtHeader2Detail");
  if (txtHeader2Detail && config.txt_header2_detail) {
    txtHeader2Detail.textContent = config.txt_header2_detail;
  }
}

/**
 * ROW 3-4: Render Camera Cards (Dynamic)
 */
function renderCameraCards(config) {
  const container = document.getElementById("cameraCardsContainer");
  if (!container) {
    console.warn("Camera cards container not found");
    return;
  }

  const cameras = [];
  for (let i = 1; i <= 8; i++) {
    const imgLink = config[`img_link${i}`];
    const detailLink = config[`detail_link${i}`];

    if (imgLink && detailLink) {
      cameras.push({
        index: i,
        image: imgLink,
        link: detailLink,
      });
    }
  }

  if (cameras.length === 0) {
    container.closest("section").style.display = "none";
    console.log("📷 No camera data - section hidden");
    return;
  }

  container.closest("section").style.display = "block";

  container.innerHTML = cameras
    .map(
      (cam) => `
        <div class="col-md-6 col-lg-${cameras.length <= 4 ? "6" : "4"}">
            <div class="camera-card">
                <div class="camera-header">
                    <span class="camera-label">CAMERA ${cam.index}</span>
                </div>
                <div class="camera-body">
                    <img src="${cam.image}" alt="Camera ${cam.index}" class="camera-image"
                         onerror="this.src='https://via.placeholder.com/600x250/6C757D/FFFFFF?text=CCTV+Camera+${cam.index}'">
                    <div class="camera-overlay">
                        <a href="${cam.link}" target="_blank" class="btn btn-warning btn-check-camera">
                            <i class="bi bi-camera-video"></i> Check
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `,
    )
    .join("");

  console.log(`📷 Rendered ${cameras.length} camera cards`);
}

/**
 * ROW 7: Render Car Gallery (Dynamic)
 */
function renderCarGallery(config) {
  const container = document.getElementById("carGalleryContainer");
  if (!container) {
    console.warn("Car gallery container not found");
    return;
  }

  const cars = [];
  for (let i = 1; i <= 8; i++) {
    const carImg = config[`car_img${i}`];

    if (carImg) {
      cars.push({
        index: i,
        image: carImg,
      });
    }
  }

  if (cars.length === 0) {
    container.closest("section").style.display = "none";
    console.log("🚗 No car data - section hidden");
    return;
  }

  container.closest("section").style.display = "block";

  container.classList.add("justify-content-center");

  let colClass = "col-lg-3 col-md-6";
  if (cars.length === 1) {
    colClass = "col-lg-4 col-md-8";
  } else if (cars.length === 2) {
    colClass = "col-lg-4 col-md-6";
  }

  container.innerHTML = cars
    .map((car) => {
      // Get car name, zone name and color from config
      const carName =
        config[`detail_car${car.index}`] || `รถคันที่ ${car.index}`;
      const zoneName = config[`zone_${car.index}`] || `Zone ${car.index}`;
      const color =
        config[`color_${car.index}`] || Charts.getColorByIndex(car.index - 1);

      return `
        <div class="${colClass}">
            <div class="car-card" id="car-card-${car.index}" style="border-top: 5px solid ${color}; transition: all 0.3s ease;">
                <div class="car-image-frame" style="height: 220px; display: flex; align-items: center; justify-content: center; padding: 10px; background: #fff;">
                    <img src="${car.image}" alt="${carName}" class="car-image" style="object-fit: contain; width: 100%; height: 100%;"
                         onerror="this.src='https://via.placeholder.com/400x250/343A40/FFFFFF?text=Mercedes-Benz'">
                </div>
                <div class="car-info" style="padding: 1rem 1.2rem; border-top: 1px solid #eee;">
                    <div class="mb-2">
                        <span class="badge" style="background-color: ${color}; font-size: 0.75rem; padding: 0.35rem 0.75rem; border-radius: 50px;">${zoneName}</span>
                    </div>
                    <h4 class="car-name" style="font-size: 1.15rem; margin-bottom: 0; font-weight: 700; color: #333;">${carName}</h4>
                </div>
            </div>
        </div>
    `;
    })
    .join("");

  console.log(`🚗 Rendered ${cars.length} car cards`);
}

/**
 * ROW 10: Update Layout Section
 */
function updateLayoutSection(config) {
  const txtBody = document.getElementById("txtBody");
  if (txtBody && config.txt_body) {
    txtBody.textContent = config.txt_body;
  }

  const txtBodyDetail = document.getElementById("txtBodyDetail");
  if (txtBodyDetail) {
    if (config.txt_body_detail) {
      txtBodyDetail.textContent = config.txt_body_detail;
      txtBodyDetail.style.display = "block";
    } else {
      txtBodyDetail.style.display = "none";
    }
  }

  const imgBody = document.getElementById("imgBody");
  if (imgBody && config.img_body) {
    imgBody.src = config.img_body;
  }
}

/**
 * Initialize Date Range Picker
 */
function initializeDateRangePicker() {
  const dateRangePicker = $("#dateRangePicker");

  if (dateRangePicker.length === 0) {
    console.warn("Date range picker element not found");
    return;
  }

  dateRangePicker.daterangepicker({
    startDate: moment().startOf("day"),
    endDate: moment().endOf("day"),
    locale: {
      format: "DD/MM/YYYY",
      separator: " - ",
      applyLabel: "ตกลง",
      cancelLabel: "ยกเลิก",
      fromLabel: "จาก",
      toLabel: "ถึง",
      customRangeLabel: "กำหนดเอง",
      weekLabel: "W",
      daysOfWeek: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
      monthNames: [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
      ],
      firstDay: 0,
    },
    ranges: {
      วันนี้: [moment(), moment()],
      เมื่อวาน: [moment().subtract(1, "days"), moment().subtract(1, "days")],
      "7 วันที่แล้ว": [moment().subtract(6, "days"), moment()],
      "30 วันที่แล้ว": [moment().subtract(29, "days"), moment()],
      เดือนนี้: [moment().startOf("month"), moment().endOf("month")],
      เดือนที่แล้ว: [
        moment().subtract(1, "month").startOf("month"),
        moment().subtract(1, "month").endOf("month"),
      ],
    },
  });

  dateRangePicker.on("apply.daterangepicker", function (ev, picker) {
    appState.dateRange.start = picker.startDate.toDate();
    appState.dateRange.end = picker.endDate.toDate();

    console.log("📅 Date range changed:", {
      start: appState.dateRange.start,
      end: appState.dateRange.end,
    });
  });

  const picker = dateRangePicker.data("daterangepicker");
  appState.dateRange.start = picker.startDate.toDate();
  appState.dateRange.end = picker.endDate.toDate();

  console.log("✅ Date Range Picker initialized");
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
  const databaseSelect = document.getElementById("databaseSelect");
  if (databaseSelect) {
    databaseSelect.addEventListener("change", async (e) => {
      const selectedDB = e.target.value;

      if (!selectedDB) {
        console.warn("No database selected");
        return;
      }

      appState.currentDatabase = selectedDB;
      console.log("📂 Database changed:", selectedDB);

      showLoading();

      try {
        // 1. Load Web Config from API (benzInfoGet)
        await loadWebConfig();

        // 2. Load Dashboard Data from API (BenzEventSearch)
        await loadDashboardData();

        console.log("✅ Data loaded for:", selectedDB);
      } catch (error) {
        console.error("❌ Error loading data:", error);
        showInfoBanner("❌ เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        hideLoading();
      }
    });
  }

  updateCurrentDateDisplay();

  // Advanced Filters Event Listeners (Update state only, reload on Search)
  ["filterType", "filterGender", "filterEmotion", "filterZone"].forEach(
    (id) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("change", (e) => {
          const filterKey =
            id === "filterType"
              ? "type"
              : id === "filterGender"
                ? "gender"
                : id === "filterEmotion"
                  ? "emotion"
                  : "zone";
          appState.filters[filterKey] = e.target.value;
          console.log(`🔍 State updated: ${filterKey} = ${e.target.value}`);
        });
      }
    },
  );

  // Search Button
  const btnSearch = document.getElementById("btnSearch");
  if (btnSearch) {
    btnSearch.addEventListener("click", () => {
      loadDashboardData();
    });
  }

  // Clear Button
  const btnClear = document.getElementById("btnClear");
  if (btnClear) {
    btnClear.addEventListener("click", () => {
      clearFilters();
    });
  }

  // Pinit IT Toggle Button - Show/Hide Admin Menu
  const btnPinitToggle = document.getElementById("btnPinitToggle");
  const btnAdmin = document.getElementById("btnAdmin");
  const btnEvent = document.getElementById("btnEvent");

  if (btnPinitToggle && btnAdmin && btnEvent) {
    // Check if admin menu should be visible from localStorage
    const isAdminVisible = localStorage.getItem("adminMenuVisible") === "true";
    if (isAdminVisible) {
      btnAdmin.classList.remove("d-none");
      btnEvent.classList.remove("d-none");
      btnPinitToggle.classList.add("bg-primary", "text-white");
      btnPinitToggle.classList.remove("bg-light", "text-dark");
    }

    btnPinitToggle.addEventListener("click", () => {
      const isHidden = btnAdmin.classList.contains("d-none");

      if (isHidden) {
        // Show admin menus
        btnAdmin.classList.remove("d-none");
        btnEvent.classList.remove("d-none");
        btnPinitToggle.classList.add("bg-primary", "text-white");
        btnPinitToggle.classList.remove("bg-light", "text-dark");
        localStorage.setItem("adminMenuVisible", "true");
        console.log("🔓 Admin menu shown");
      } else {
        // Hide admin menus
        btnAdmin.classList.add("d-none");
        btnEvent.classList.add("d-none");
        btnPinitToggle.classList.remove("bg-primary", "text-white");
        btnPinitToggle.classList.add("bg-light", "text-dark");
        localStorage.setItem("adminMenuVisible", "false");
        console.log("🔒 Admin menu hidden");
      }
    });
  }

  console.log("✅ Event listeners setup complete");
}

/**
 * Clear All Filters
 */
function clearFilters() {
  console.log("🧹 Clearing all filters...");

  // 1. Reset State (type is always customer)
  appState.filters = {
    type: "customer",
    gender: "all",
    emotion: "all",
    zone: "all",
  };

  const todayStart = moment().startOf("day");
  const todayEnd = moment().endOf("day");
  appState.dateRange.start = todayStart.toDate();
  appState.dateRange.end = todayEnd.toDate();

  // 2. Reset UI (filterType removed - type is fixed to customer)
  $("#filterGender").val("all");
  $("#filterEmotion").val("all");
  $("#filterZone").val("all");

  const drp = $("#dateRangePicker").data("daterangepicker");
  drp.setStartDate(todayStart);
  drp.setEndDate(todayEnd);

  // 3. Reload Data
  loadDashboardData();
}

/**
 * ==========================================================================
 * Data Loading (Benz-event API)
 * ==========================================================================
 */

/**
 * Load Dashboard Data from API
 * GET /benzEvents/api/BenzEventSearch
 */
async function loadDashboardData() {
  if (appState.isLoading) {
    console.log("⏳ Already loading data...");
    return;
  }

  if (!appState.currentDatabase) {
    console.warn("⚠️ No database selected");
    return;
  }

  appState.isLoading = true;
  showLoading();

  try {
    const { start, end } = appState.dateRange;
    const { type, gender, emotion, zone } = appState.filters;

    // Convert dates to YYYY-MM-DDTHH:mm:ss for API (Removed .SS to avoid 422 error)
    const startStr = start ? moment(start).format("YYYY-MM-DD[T]HH:mm:ss") : "";
    const endStr = end ? moment(end).format("YYYY-MM-DD[T]HH:mm:ss") : "";

    console.log("📥 Searching dashboard data from API...");
    console.log("📡 Parameters:", {
      db: appState.currentDatabase,
      collection: appState.currentCollection,
      startStr,
      endStr,
      filters: appState.filters,
    });

    const result = await API.searchEvents({
      db: appState.currentDatabase,
      collection: appState.currentCollection,
      start: startStr,
      end: endStr,
      type,
      gender,
      emotion,
      zone,
    });

    if (result.success) {
      appState.allDocuments = result.docs;
      appState.filteredDocuments = result.docs; // In server-side filtering, these are the same
      console.log(`✅ Loaded ${result.docs.length} documents from API`);

      if (result.docs.length === 0) {
        showInfoBanner("ℹ️ ไม่พบข้อมูลที่ตรงตามเงื่อนไขการกรอง");
      }
    } else {
      console.warn("⚠️ API returned error:", result.error);
      appState.allDocuments = [];
      appState.filteredDocuments = [];
      showInfoBanner("⚠️ ไม่สามารถโหลดข้อมูลได้: " + result.error);
    }

    updateDashboard();
  } catch (error) {
    console.error("❌ Error loading data:", error);
    appState.allDocuments = [];
    appState.filteredDocuments = [];
    showInfoBanner("❌ เกิดข้อผิดพลาดในการโหลดข้อมูล");
  } finally {
    appState.isLoading = false;
    hideLoading();
  }
}

/**
 * ==========================================================================
 * Dashboard Update
 * ==========================================================================
 */

/**
 * Show Zone Details (Called from Chart Click)
 * Scrolls to the car card and highlights it
 */
function showZoneDetails(zoneKey, label) {
  console.log(`🔍 Interacting with ${label} (Key: ${zoneKey})`);

  // Extract zone number for matching
  const zoneNumMatch = String(zoneKey).match(/(\d+)/);
  const zoneNum = zoneNumMatch ? zoneNumMatch[1] : zoneKey;

  // 1. Try to scroll to the Car Card in the gallery
  const carCard = document.getElementById(`car-card-${zoneNum}`);
  if (carCard) {
    // Smooth scroll to the card
    carCard.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    // Add highlight effect
    const originalShadow = carCard.style.boxShadow;
    const originalTransform = carCard.style.transform;

    carCard.style.boxShadow = "0 0 25px rgba(0, 102, 204, 0.6)";
    carCard.style.transform = "scale(1.05)";
    carCard.style.zIndex = "10";

    setTimeout(() => {
      carCard.style.boxShadow = originalShadow;
      carCard.style.transform = originalTransform;
      carCard.style.zIndex = "1";
    }, 2000);

    return; // Stop here if we found the car card
  }

  // 2. Fallback: If no car card exists, show the Image Gallery Modal (original behavior)
  const docs = appState.filteredDocuments.filter((doc) => {
    return (
      String(doc.zone) === String(zoneNum) ||
      String(doc.zone) === String(zoneKey)
    );
  });

  if (docs.length === 0) {
    Swal.fire({
      title: `<span style="font-family: 'Prompt', sans-serif;">${label}</span>`,
      text: "ไม่พบข้อมูลภาพในช่วงเวลาที่เลือก",
      icon: "info",
      confirmButtonText: "ตกลง",
    });
    return;
  }

  // Limit to 24 items for performance
  const displayDocs = docs.slice(0, 24);

  const galleryHtml = `
    <div class="container-fluid py-3">
      <div class="row g-3">
        ${displayDocs
          .map((doc) => {
            const time = moment(doc.timestamp).format("HH:mm:ss");
            const imgUrl = doc.images?.full || doc.images?.face;
            const type = doc.type || "unknown";
            const emotion = doc.emotion || "";

            return `
            <div class="col-md-3 col-sm-4 col-6">
              <div class="gallery-card border rounded shadow-sm overflow-hidden h-100" style="transition: transform 0.2s;">
                <div class="ratio ratio-1x1 bg-dark">
                  <img src="${imgUrl}" 
                       class="object-fit-cover" 
                       style="cursor: zoom-in;" 
                       onclick="window.open('${imgUrl}', '_blank')"
                       onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
                </div>
                <div class="p-2 bg-light text-start shadow-sm" style="font-size: 0.75rem;">
                   <div class="d-flex justify-content-between">
                     <span class="text-muted"><i class="bi bi-clock"></i> ${time}</span>
                     <span class="badge ${type === "customer" ? "bg-primary" : "bg-secondary"}">${type}</span>
                   </div>
                   ${emotion ? `<div class="mt-1 text-capitalize text-muted small"><i class="bi bi-emoji-smile"></i> ${emotion}</div>` : ""}
                </div>
              </div>
            </div>
          `;
          })
          .join("")}
      </div>
    </div>
  `;

  Swal.fire({
    title: `<div style="font-family: 'Prompt', sans-serif; border-bottom: 2px solid #0066CC; padding-bottom: 10px; margin-bottom: 10px;">${label}</div>`,
    html: galleryHtml,
    width: "1000px",
    showCloseButton: true,
    showConfirmButton: false,
    background: "#ffffff",
    customClass: {
      popup: "premium-swal-popup",
      htmlContainer: "p-0",
    },
  });
}

// Expose to window for Chart.js access
window.showZoneDetails = showZoneDetails;

/**
 * Update Dashboard with Data
 */
function updateDashboard() {
  const docs = appState.filteredDocuments;

  console.log("🔄 Updating dashboard with", docs.length, "documents");

  // Update KPI Cards
  updateKPICards(docs);

  // Create Charts
  createAllCharts(docs);

  // Animate elements
  animateDashboardElements();

  console.log("✅ Dashboard updated successfully");
}

/**
 * Update KPI Cards (Row 6)
 */
function updateKPICards(docs) {
  const kpiData = API.calculateKPIData(docs);

  const totalElement = document.getElementById("totalCustomers");
  if (totalElement) {
    animateNumber(totalElement, kpiData.total);
  }

  const maleElement = document.getElementById("maleCustomers");
  if (maleElement) {
    animateNumber(maleElement, kpiData.male);
  }

  const femaleElement = document.getElementById("femaleCustomers");
  if (femaleElement) {
    animateNumber(femaleElement, kpiData.female);
  }

  console.log("✅ KPI Cards updated:", kpiData);
}

/**
 * Create All Charts
 */
function createAllCharts(docs) {
  // Row 8: Zone Interest Chart
  const zoneData = API.groupByZone(docs);
  Charts.createZoneInterestChart(zoneData, appState.webConfig);

  // Row 9: Hourly Traffic Chart + Table
  const hourData = API.groupByHour(docs);
  Charts.createHourlyTrafficChart(hourData);
  Charts.updateHourlyTrafficTable(hourData);

  // Row 11: Dwell Time Chart
  const dwellData = API.groupByDwellTime(docs);
  if (Object.keys(dwellData).length > 0) {
    Charts.createDwellTimeChart(dwellData);
  }

  // Row 13: Daily Traffic Chart
  const dateData = API.groupByDate(docs);
  Charts.createDailyTrafficChart(dateData);

  // Row 14: Daily Zone Breakdown Chart
  const dateZoneData = API.groupByDateAndZone(docs);
  Charts.createDailyZoneChart(dateZoneData, appState.webConfig);

  console.log("✅ All charts created");
}

/**
 * ==========================================================================
 * UI Helper Functions
 * ==========================================================================
 */

function showLoading() {
  const spinner = document.getElementById("loadingSpinner");
  if (spinner) {
    spinner.classList.remove("d-none");
  }
}

function hideLoading() {
  const spinner = document.getElementById("loadingSpinner");
  if (spinner) {
    spinner.classList.add("d-none");
  }
}

function showInfoBanner(message) {
  const existingBanner = document.getElementById("infoBanner");
  if (existingBanner) {
    existingBanner.remove();
  }

  const banner = document.createElement("div");
  banner.id = "infoBanner";
  banner.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #0066CC 0%, #004A99 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        font-family: 'Prompt', sans-serif;
        font-size: 0.95rem;
        max-width: 90%;
        text-align: center;
    `;
  banner.textContent = message;

  document.body.appendChild(banner);

  setTimeout(() => {
    banner.style.transition = "opacity 0.5s ease";
    banner.style.opacity = "0";
    setTimeout(() => banner.remove(), 500);
  }, 5000);
}

function updateCurrentDateDisplay() {
  const currentDateElement = document.getElementById("currentDate");
  if (currentDateElement) {
    const today = new Date();
    currentDateElement.textContent = today.getDate();
  }
}

function animateNumber(element, targetValue, duration = 1000) {
  if (!element) return;

  const startValue = 0;
  const increment = targetValue / (duration / 16);
  let currentValue = startValue;

  const animate = () => {
    currentValue += increment;
    if (currentValue >= targetValue) {
      element.textContent = targetValue.toLocaleString();
      return;
    }
    element.textContent = Math.floor(currentValue).toLocaleString();
    requestAnimationFrame(animate);
  };

  animate();
}

function animateDashboardElements() {
  const sections = document.querySelectorAll(
    ".kpi-card, .chart-card, .car-card, .camera-card",
  );
  sections.forEach((section, index) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(20px)";
    setTimeout(() => {
      section.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      section.style.opacity = "1";
      section.style.transform = "translateY(0)";
    }, index * 50);
  });
}

function setupImageErrorHandling() {
  const heroImage = document.getElementById("heroImage");
  if (heroImage) {
    heroImage.onerror = function () {
      this.src =
        "https://via.placeholder.com/1920x500/0066CC/FFFFFF?text=Thonburi+Phanich+Auto+Showcase";
    };
  }

  const cctvLayoutImage = document.getElementById("cctvLayoutImage");
  if (cctvLayoutImage) {
    cctvLayoutImage.onerror = function () {
      this.src =
        "https://via.placeholder.com/1200x600/6C757D/FFFFFF?text=CCTV+Layout";
    };
  }
}

/**
 * Clear All Browser Data (Cookies, LocalStorage, SessionStorage, Cache)
 */
function clearBrowserData() {
  console.log("🧹 Clearing browser data (Cookies & Cache)...");

  try {
    // 1. Clear LocalStorage & SessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // 2. Clear All Cookies
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }

    // 3. Clear Cache API (if supported)
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }

    console.log("✅ Browser data cleared successfully");
  } catch (error) {
    console.warn("⚠️ Could not clear some browser data:", error);
  }
}

/**
 * ==========================================================================
 * Application Entry Point
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  console.log("📄 DOM Content Loaded");
  setupImageErrorHandling();
  initializeApp();
});

window.addEventListener("beforeunload", () => {
  console.log("👋 Page unloading...");
});

window.AppState = appState;

console.log("✅ Main Application loaded (API Only Mode)");
