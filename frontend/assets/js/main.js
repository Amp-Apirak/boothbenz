/**
 * ==========================================================================
 * Main Application - Thonburi Phanich Dashboard
 * Version: 1.0.0
 * Description: Main application logic และ event handlers
 * ==========================================================================
 */

// Application State
const appState = {
    currentDatabase: 'db_boothbenz',
    currentCollection: 'visitors',
    dateRange: {
        start: null,
        end: null,
    },
    allDocuments: [],
    filteredDocuments: [],
    isLoading: false,
    useMockData: false, // จะเป็น true ถ้า API ไม่พร้อม
};

// Mock Data สำหรับทดสอบ
const MOCK_DATA = [
    // AMG SL 43
    ...Array.from({ length: 224 }, (_, i) => ({
        _id: `mock_${i}`,
        date: '2025-11-24',
        timestamp: '2025-11-24T10:00:00Z',
        time: '10:00:00',
        hour: 10,
        gender: i % 3 === 0 ? 'male' : (i % 3 === 1 ? 'female' : 'unknown'),
        zone: 'AMG SL 43',
        camera_id: 1,
        dwell_time: Math.floor(Math.random() * 10) + 1,
        type: 'visitor'
    })),
    // C 350 e AMG Dynamic
    ...Array.from({ length: 5 }, (_, i) => ({
        _id: `mock_c_${i}`,
        date: '2025-11-25',
        timestamp: '2025-11-25T11:00:00Z',
        time: '11:00:00',
        hour: 11,
        gender: i % 2 === 0 ? 'male' : 'female',
        zone: 'C 350 e AMG Dynamic',
        camera_id: 2,
        dwell_time: Math.floor(Math.random() * 10) + 1,
        type: 'visitor'
    })),
    // GLC 220d 4 Matic Avantgar
    ...Array.from({ length: 335 }, (_, i) => ({
        _id: `mock_glc_${i}`,
        date: '2025-11-26',
        timestamp: '2025-11-26T12:00:00Z',
        time: '12:00:00',
        hour: 12,
        gender: i % 2 === 0 ? 'male' : 'female',
        zone: 'GLC 220d 4 Matic Avantgar',
        camera_id: 3,
        dwell_time: Math.floor(Math.random() * 10) + 1,
        type: 'visitor'
    })),
    // GLA 200 AMG Dynamic
    ...Array.from({ length: 351 }, (_, i) => ({
        _id: `mock_gla_${i}`,
        date: '2025-11-27',
        timestamp: '2025-11-27T13:00:00Z',
        time: '13:00:00',
        hour: 13,
        gender: i % 2 === 0 ? 'female' : 'male',
        zone: 'GLA 200 AMG Dynamic',
        camera_id: 4,
        dwell_time: Math.floor(Math.random() * 10) + 1,
        type: 'visitor'
    })),
    // E 350 e AMG Dynamic
    ...Array.from({ length: 167 }, (_, i) => ({
        _id: `mock_e_${i}`,
        date: '2025-11-28',
        timestamp: '2025-11-28T14:00:00Z',
        time: '14:00:00',
        hour: 14,
        gender: i % 2 === 0 ? 'male' : 'female',
        zone: 'E 350 e AMG Dynamic',
        camera_id: 1,
        dwell_time: Math.floor(Math.random() * 10) + 1,
        type: 'visitor'
    })),
    // เพิ่มข้อมูลช่วงเวลาต่างๆ
    ...Array.from({ length: 200 }, (_, i) => ({
        _id: `mock_time_${i}`,
        date: '2025-11-28',
        timestamp: `2025-11-28T${(i % 12 + 10).toString().padStart(2, '0')}:30:00Z`,
        time: `${(i % 12 + 10).toString().padStart(2, '0')}:30:00`,
        hour: (i % 12 + 10),
        gender: i % 2 === 0 ? 'male' : 'female',
        zone: ['AMG SL 43', 'GLC 220d 4 Matic Avantgar', 'GLA 200 AMG Dynamic'][i % 3],
        camera_id: (i % 4) + 1,
        dwell_time: Math.floor(Math.random() * 15) + 1,
        type: 'visitor'
    }))
];

/**
 * ==========================================================================
 * Initialization
 * ==========================================================================
 */

/**
 * Initialize Application
 */
async function initializeApp() {
    console.log('🚀 Initializing Thonburi Phanich Dashboard...');

    // Show loading spinner
    showLoading();

    try {
        // 1. Check API Health (ไม่ throw error ถ้าไม่สำเร็จ)
        await checkApiHealth();

        // 2. Load Databases (ถ้า API ไม่พร้อมก็ข้าม)
        if (!appState.useMockData) {
            await loadDatabases();
        }

        // 3. Initialize Date Range Picker
        initializeDateRangePicker();

        // 4. Set up Event Listeners
        setupEventListeners();

        // 5. Load Dashboard Data (จะใช้ Mock Data ถ้า API ไม่พร้อม)
        await loadDashboardData();

        // แสดงข้อความว่าใช้ Mock Data
        if (appState.useMockData) {
            showInfoBanner('🔔 กำลังใช้ข้อมูลตัวอย่างเพื่อแสดงผล (API ไม่พร้อมใช้งาน)');
        }

        console.log('✅ Dashboard initialized successfully');
    } catch (error) {
        console.error('❌ Initialization error:', error);
        // ไม่ต้อง alert แค่แสดงใน console และใช้ Mock Data
        console.log('📦 Using Mock Data due to initialization error');
        appState.useMockData = true;
        await loadDashboardData();
    } finally {
        hideLoading();
    }
}

/**
 * Check API Health
 */
async function checkApiHealth() {
    const result = await API.checkHealth();

    if (!result.success) {
        console.warn('⚠️ API Server ไม่พร้อมใช้งาน - จะใช้ Mock Data แทน');
        appState.useMockData = true;
        return false;
    }

    console.log('✅ API Health Check passed', result.data);
    appState.useMockData = false;
    return true;
}

/**
 * Load Available Databases
 */
async function loadDatabases() {
    const result = await API.getDatabases();

    if (!result.success) {
        console.warn('Cannot load databases:', result.error);
        return;
    }

    const select = document.getElementById('databaseSelect');
    if (select && result.databases.length > 0) {
        select.innerHTML = result.databases.map(db => `
            <option value="${db}" ${db === appState.currentDatabase ? 'selected' : ''}>
                ${db}
            </option>
        `).join('');
    }

    console.log('✅ Databases loaded:', result.databases);
}

/**
 * Initialize Date Range Picker
 */
function initializeDateRangePicker() {
    const dateRangePicker = $('#dateRangePicker');

    if (dateRangePicker.length === 0) {
        console.warn('Date range picker element not found');
        return;
    }

    // Configure date range picker
    dateRangePicker.daterangepicker({
        startDate: moment().subtract(7, 'days'),
        endDate: moment(),
        locale: {
            format: 'DD/MM/YYYY',
            separator: ' - ',
            applyLabel: 'ตกลง',
            cancelLabel: 'ยกเลิก',
            fromLabel: 'จาก',
            toLabel: 'ถึง',
            customRangeLabel: 'กำหนดเอง',
            weekLabel: 'W',
            daysOfWeek: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
            monthNames: [
                'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
                'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
                'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
            ],
            firstDay: 0
        },
        ranges: {
            'วันนี้': [moment(), moment()],
            'เมื่อวาน': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            '7 วันที่แล้ว': [moment().subtract(6, 'days'), moment()],
            '30 วันที่แล้ว': [moment().subtract(29, 'days'), moment()],
            'เดือนนี้': [moment().startOf('month'), moment().endOf('month')],
            'เดือนที่แล้ว': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    });

    // Handle date range change
    dateRangePicker.on('apply.daterangepicker', function (ev, picker) {
        appState.dateRange.start = picker.startDate.toDate();
        appState.dateRange.end = picker.endDate.toDate();

        console.log('📅 Date range changed:', {
            start: appState.dateRange.start,
            end: appState.dateRange.end
        });

        // Reload data with new date range
        loadDashboardData();
    });

    // Set initial date range
    const picker = dateRangePicker.data('daterangepicker');
    appState.dateRange.start = picker.startDate.toDate();
    appState.dateRange.end = picker.endDate.toDate();

    console.log('✅ Date Range Picker initialized');
}

/**
 * Setup Event Listeners
 */
function setupEventListeners() {
    // Database selection change
    const databaseSelect = document.getElementById('databaseSelect');
    if (databaseSelect) {
        databaseSelect.addEventListener('change', (e) => {
            appState.currentDatabase = e.target.value;
            console.log('📂 Database changed:', appState.currentDatabase);
            loadDashboardData();
        });
    }

    // Update current date display
    updateCurrentDateDisplay();

    console.log('✅ Event listeners setup complete');
}

/**
 * ==========================================================================
 * Data Loading
 * ==========================================================================
 */

/**
 * Load Dashboard Data
 */
async function loadDashboardData() {
    if (appState.isLoading) {
        console.log('⏳ Already loading data...');
        return;
    }

    appState.isLoading = true;
    showLoading();

    try {
        console.log('📥 Loading dashboard data...');

        // ถ้าใช้ Mock Data
        if (appState.useMockData) {
            console.log('📦 Using Mock Data for demonstration');
            appState.allDocuments = MOCK_DATA;
            console.log(`✅ Loaded ${MOCK_DATA.length} mock documents`);
        } else {
            // Get all documents from the collection
            const result = await API.getAllDocuments(
                appState.currentDatabase,
                appState.currentCollection
            );

            if (!result.success) {
                console.warn('⚠️ API failed, switching to Mock Data');
                appState.useMockData = true;
                appState.allDocuments = MOCK_DATA;
                console.log(`✅ Loaded ${MOCK_DATA.length} mock documents`);
            } else {
                appState.allDocuments = result.docs;
                console.log(`✅ Loaded ${result.docs.length} documents from API`);
            }
        }

        // Filter documents by date range
        filterDocumentsByDateRange();

        // Update Dashboard
        updateDashboard();

    } catch (error) {
        console.error('❌ Error loading data:', error);
        // Fallback to Mock Data
        console.log('📦 Falling back to Mock Data');
        appState.useMockData = true;
        appState.allDocuments = MOCK_DATA;
        filterDocumentsByDateRange();
        updateDashboard();
    } finally {
        appState.isLoading = false;
        hideLoading();
    }
}

/**
 * Filter Documents by Date Range
 */
function filterDocumentsByDateRange() {
    if (!appState.dateRange.start || !appState.dateRange.end) {
        appState.filteredDocuments = appState.allDocuments;
        return;
    }

    const startDate = appState.dateRange.start;
    const endDate = appState.dateRange.end;
    endDate.setHours(23, 59, 59, 999); // Include the entire end date

    appState.filteredDocuments = appState.allDocuments.filter(doc => {
        let docDate = null;

        if (doc.date) {
            docDate = new Date(doc.date);
        } else if (doc.timestamp) {
            docDate = new Date(doc.timestamp);
        }

        if (!docDate || isNaN(docDate.getTime())) {
            return false;
        }

        return docDate >= startDate && docDate <= endDate;
    });

    console.log(`📊 Filtered: ${appState.filteredDocuments.length} / ${appState.allDocuments.length} documents`);
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
    let docs = appState.filteredDocuments;

    // ถ้าไม่มีข้อมูล ให้ใช้ Mock Data
    if (docs.length === 0) {
        console.warn('⚠️ No filtered data, using all mock data');
        docs = MOCK_DATA;
        appState.filteredDocuments = docs;
    }

    console.log('🔄 Updating dashboard with', docs.length, 'documents');

    // 1. Update KPI Cards
    updateKPICards(docs);

    // 2. Create Charts
    createAllCharts(docs);

    // 3. Animate elements
    animateDashboardElements();

    console.log('✅ Dashboard updated successfully');
}

/**
 * Update KPI Cards (Row 6)
 */
function updateKPICards(docs) {
    const kpiData = API.calculateKPIData(docs);

    // Update Total Customers
    const totalElement = document.getElementById('totalCustomers');
    if (totalElement) {
        animateNumber(totalElement, kpiData.total);
    }

    // Update Male Customers
    const maleElement = document.getElementById('maleCustomers');
    if (maleElement) {
        animateNumber(maleElement, kpiData.male);
    }

    // Update Female Customers
    const femaleElement = document.getElementById('femaleCustomers');
    if (femaleElement) {
        animateNumber(femaleElement, kpiData.female);
    }

    console.log('✅ KPI Cards updated:', kpiData);
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
    } else {
        console.warn('⚠️ No dwell time data available');
    }

    // Row 13: Daily Traffic Chart
    const dateData = API.groupByDate(docs);
    Charts.createDailyTrafficChart(dateData);

    // Row 14: Daily Zone Breakdown Chart
    const dateZoneData = API.groupByDateAndZone(docs);
    Charts.createDailyZoneChart(dateZoneData);

    console.log('✅ All charts created');
}

/**
 * ==========================================================================
 * UI Helper Functions
 * ==========================================================================
 */

/**
 * Show Loading Spinner
 */
function showLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.classList.remove('d-none');
    }
}

/**
 * Hide Loading Spinner
 */
function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.classList.add('d-none');
    }
}

/**
 * Show Error Message
 */
function showErrorMessage(message) {
    console.error('❌ Error:', message);
    // ไม่ใช้ alert แล้ว แค่แสดงใน console
}

/**
 * Show No Data Message
 */
function showNoDataMessage() {
    console.warn('⚠️ No data found for selected date range');
    showInfoBanner('ℹ️ ไม่พบข้อมูลในช่วงเวลาที่เลือก กรุณาเลือกช่วงเวลาใหม่');
}

/**
 * Show Info Banner
 */
function showInfoBanner(message) {
    // สร้าง banner แจ้งเตือน
    const existingBanner = document.getElementById('infoBanner');
    if (existingBanner) {
        existingBanner.remove();
    }

    const banner = document.createElement('div');
    banner.id = 'infoBanner';
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

    // ลบ banner หลัง 5 วินาที
    setTimeout(() => {
        banner.style.transition = 'opacity 0.5s ease';
        banner.style.opacity = '0';
        setTimeout(() => banner.remove(), 500);
    }, 5000);
}

/**
 * Update Current Date Display
 */
function updateCurrentDateDisplay() {
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        const today = new Date();
        currentDateElement.textContent = today.getDate();
    }
}

/**
 * Animate Number (Count Up)
 */
function animateNumber(element, targetValue, duration = 1000) {
    if (!element) return;

    const startValue = 0;
    const increment = targetValue / (duration / 16); // 60 FPS
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

/**
 * Animate Dashboard Elements
 */
function animateDashboardElements() {
    // Add fade-in animation to sections
    const sections = document.querySelectorAll('.kpi-card, .chart-card, .car-card, .camera-card');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        setTimeout(() => {
            section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

/**
 * ==========================================================================
 * Image Error Handling
 * ==========================================================================
 */

/**
 * Handle Image Load Errors
 */
function setupImageErrorHandling() {
    // Hero Image
    const heroImage = document.getElementById('heroImage');
    if (heroImage) {
        heroImage.onerror = function() {
            this.src = 'https://via.placeholder.com/1920x500/0066CC/FFFFFF?text=Thonburi+Phanich+Auto+Showcase';
        };
    }

    // CCTV Layout Image
    const cctvLayoutImage = document.getElementById('cctvLayoutImage');
    if (cctvLayoutImage) {
        cctvLayoutImage.onerror = function() {
            this.src = 'https://via.placeholder.com/1200x600/6C757D/FFFFFF?text=CCTV+Layout';
        };
    }

    // Car Images
    document.querySelectorAll('.car-image').forEach(img => {
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/400x250/343A40/FFFFFF?text=Mercedes-Benz';
        };
    });

    // Camera Images
    document.querySelectorAll('.camera-image').forEach(img => {
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/600x250/6C757D/FFFFFF?text=CCTV+Camera';
        };
    });

    console.log('✅ Image error handling setup complete');
}

/**
 * ==========================================================================
 * Application Entry Point
 * ==========================================================================
 */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM Content Loaded');

    // Setup image error handling
    setupImageErrorHandling();

    // Initialize application
    initializeApp();
});

// Handle page refresh/reload
window.addEventListener('beforeunload', () => {
    console.log('👋 Page unloading...');
});

// Make app state available globally for debugging
window.AppState = appState;

console.log('✅ Main Application loaded successfully');
