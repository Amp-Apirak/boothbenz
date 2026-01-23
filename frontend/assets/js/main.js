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

      // Set default database to first one if not set
      if (!appState.currentDatabase) {
        appState.currentDatabase = result.databases[0];
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

  // สร้าง options - แสดงชื่อ database โดยตรง
  select.innerHTML = databases
    .map(
      (db) => `
        <option value="${db}" ${db === appState.currentDatabase ? "selected" : ""}>
            ${db}
        </option>
    `,
    )
    .join("");

  // ถ้า currentDatabase ไม่อยู่ในรายการ ให้เลือกตัวแรก
  if (!databases.includes(appState.currentDatabase) && databases.length > 0) {
    appState.currentDatabase = databases[0];
    select.value = databases[0];
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

  let colClass = "col-lg-4 col-md-6";
  if (cars.length <= 2) {
    colClass = "col-lg-6 col-md-6";
  } else if (cars.length <= 4) {
    colClass = "col-lg-3 col-md-6";
  }

  container.innerHTML = cars
    .map(
      (car) => `
        <div class="${colClass}">
            <div class="car-card">
                <img src="${car.image}" alt="Car ${car.index}" class="car-image"
                     onerror="this.src='https://via.placeholder.com/400x250/343A40/FFFFFF?text=Mercedes-Benz'">
                <div class="car-info">
                    <h4 class="car-name">รถคันที่ ${car.index}</h4>
                </div>
            </div>
        </div>
    `,
    )
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
    startDate: moment().subtract(7, "days"),
    endDate: moment(),
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

    loadDashboardData();
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

        // 2. Load Dashboard Data from API (BenzEventGet)
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

  // Advanced Filters Event Listeners
  ["filterType", "filterGender", "filterEmotion"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", (e) => {
        const filterKey =
          id === "filterType"
            ? "type"
            : id === "filterGender"
              ? "gender"
              : "emotion";
        appState.filters[filterKey] = e.target.value;
        console.log(`🔍 Filter changed: ${filterKey} = ${e.target.value}`);
        applyFilters();
        updateDashboard();
      });
    }
  });

  console.log("✅ Event listeners setup complete");
}

/**
 * ==========================================================================
 * Data Loading (Benz-event API)
 * ==========================================================================
 */

/**
 * Load Dashboard Data from API
 * GET /benzEvents/api/BenzEventGet
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
    console.log("📥 Loading dashboard data from API...");
    console.log("📡 Database:", appState.currentDatabase);
    console.log("📡 Collection:", appState.currentCollection);

    const result = await API.getAllDocuments(
      appState.currentDatabase,
      appState.currentCollection,
    );

    if (result.success) {
      appState.allDocuments = result.docs;
      console.log(`✅ Loaded ${result.docs.length} documents from API`);

      if (result.docs.length === 0) {
        showInfoBanner("ℹ️ ไม่พบข้อมูลในฐานข้อมูลนี้");
      }
    } else {
      console.warn("⚠️ API returned error:", result.error);
      appState.allDocuments = [];
      showInfoBanner("⚠️ ไม่สามารถโหลดข้อมูลได้: " + result.error);
    }

    applyFilters();
    updateDashboard();
  } catch (error) {
    console.error("❌ Error loading data:", error);
    appState.allDocuments = [];
    showInfoBanner("❌ เกิดข้อผิดพลาดในการโหลดข้อมูล");
  } finally {
    appState.isLoading = false;
    hideLoading();
  }
}

/**
 * Apply All Filters (Date, Type, Gender, Emotion)
 */
function applyFilters() {
  const { start, end } = appState.dateRange;
  const { type, gender, emotion } = appState.filters;

  let filtered = appState.allDocuments;

  // 1. Filter by Date Range
  if (start && end) {
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    filtered = filtered.filter((doc) => {
      const docDate = new Date(doc.timestamp || doc.date);
      if (!docDate || isNaN(docDate.getTime())) return false;
      return docDate >= start && docDate <= endDate;
    });
  }

  // 2. Filter by Type
  if (type !== "all") {
    filtered = filtered.filter(
      (doc) => (doc.type || "").toLowerCase() === type.toLowerCase(),
    );
  }

  // 3. Filter by Gender
  if (gender !== "all") {
    filtered = filtered.filter(
      (doc) => (doc.gender || "").toLowerCase() === gender.toLowerCase(),
    );
  }

  // 4. Filter by Emotion
  if (emotion !== "all") {
    filtered = filtered.filter(
      (doc) => (doc.emotion || "").toLowerCase() === emotion.toLowerCase(),
    );
  }

  appState.filteredDocuments = filtered;
  console.log(
    `📊 Filtered: ${appState.filteredDocuments.length} / ${appState.allDocuments.length} documents`,
  );

  if (filtered.length === 0) {
    showInfoBanner("ℹ️ ไม่พบข้อมูลที่ตรงตามเงื่อนไขการกรอง");
  }
}

/**
 * ==========================================================================
 * Dashboard Update
 * ==========================================================================
 */

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
  Charts.createZoneInterestChart(zoneData);

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
  Charts.createDailyZoneChart(dateZoneData);

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
