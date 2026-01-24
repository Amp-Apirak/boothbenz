# 📘 คู่มือโครงการ Thonburi Phanich Dashboard

**Version:** 1.0.0
**Last Updated:** 2026-01-22
**เอกสารฉบับนี้:** คู่มือสำหรับ Developer เพื่อเข้าใจและแก้ไขโครงการได้ทันที

---

## 📋 สารบัญ

1. [ภาพรวมโครงการ](#1-ภาพรวมโครงการ)
2. [โครงสร้างโปรเจค](#2-โครงสร้างโปรเจค)
3. [ส่วนประกอบหลัก 14 Rows](#3-ส่วนประกอบหลัก-14-rows)
4. [ระบบ API](#4-ระบบ-api)
5. [เงื่อนไขการแสดงผล](#5-เงื่อนไขการแสดงผล)
6. [Data Flow](#6-data-flow)
7. [ฟังก์ชันสำคัญ](#7-ฟังก์ชันสำคัญ)
8. [การปรับแต่ง](#8-การปรับแต่ง)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. ภาพรวมโครงการ

### 🎯 วัตถุประสงค์

Dashboard สำหรับแสดงข้อมูลลูกค้าและวิเคราะห์พฤติกรรมในงานออกบูธรถยนต์ Mercedes-Benz ที่ Central Park II

### 🏗️ สถาปัตยกรรม

````
┌─────────────────────────────────────────────────────────┐
│                    Frontend (HTML/JS)                    │
│  ┌───────────┐  ┌──────────┐  ┌────────────────────┐  │
│  │ index.html│→ │ style.css│  │  JavaScript Files  │  │
│  └───────────┘  └──────────┘  └────────────────────┘  │
│                                  │                       │
│                                  ↓                       │
│                    ┌──────────────────────────┐         │
│                    │   API Handler (api.js)   │         │
│                    └──────────────────────────┘         │
│                                  │                       │
└──────────────────────────────────┼───────────────────────┘
                                   ↓
                     ┌──────────────────────────┐
                     │   Backend API Server     │
                     │ http://192.168.1.91:8111 │
                     └──────────────────────────┘

                     1. เปลี่ยน IP ของ Server ในไฟล์ `frontend/assets/js/config.js`:
   ```javascript
   BASE_URL: "http://192.168.1.91:8111"
````

                                   ↓
                    ┌──────────────────────────┐
                    │   MongoDB Database       │
                    │   172.16.1.31:27017      │
                    └──────────────────────────┘

```

### 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Bootstrap 5.3.2 |
| **JavaScript** | Vanilla JS (ES6+), jQuery 3.7.1 |
| **Charts** | Chart.js 4.4.0 |
| **Date Picker** | Date Range Picker + Moment.js |
| **Backend API** | FastAPI (Python) |
| **Database** | MongoDB |

---

## 2. โครงสร้างโปรเจค

```

boothbenz/
│
├── 📁 frontend/ # Frontend Application
│ │
│ ├── 📄 index.html # ไฟล์หลัก (มี 14 Rows)
│ │
│ └── 📁 assets/
│ │
│ ├── 📁 css/
│ │ └── style.css # ไฟล์ CSS หลัก (17KB)
│ │
│ ├── 📁 js/
│ │ ├── api.js # API Handler (11KB)
│ │ ├── charts.js # Charts Configuration (18KB)
│ │ └── main.js # Main Application Logic (20KB)
│ │
│ └── 📁 images/ # รูปภาพ
│ ├── hero-showroom.jpg # รูปหลัก
│ ├── cctv-layout.jpg # รูป CCTV Layout
│ ├── 📁 cameras/ # รูปกล้อง
│ └── 📁 cars/ # รูปรถแต่ละรุ่น
│
├── 📁 docs/ # เอกสาร
│ ├── systems-image.pdf # Design Reference
│ └── data_swagger.md # API Documentation
│
├── 📄 ex_backend.py # Backend Reference
├── 📄 notes.md # โน้ตความต้องการ
├── 📄 Installation.md # คู่มือนี้
├── 📄 README.md # README หลัก
└── 📄 .gitignore # Git ignore rules

````

---

## 3. ส่วนประกอบหลัก 14 Rows

Dashboard แบ่งออกเป็น **14 Rows** ตามที่กำหนดใน `notes.md`

### 📊 รายละเอียด 14 Rows

| Row | Component | Description | Type | Data Source |
|-----|-----------|-------------|------|-------------|
| **1** | Header Section | ชื่อ "Thonburi Phanich" + แถบสี | Static | HTML |
| **2** | Hero Section | รูปโชว์รูม + Overlay | Static | HTML |
| **3-4** | CCTV Cards | การ์ด 4 กล้อง | Static | HTML |
| **5** | Filters | Date Picker + DB Selector | Dynamic | JS |
| **6** | KPI Cards | จำนวนลูกค้า (ทั้งหมด/ชาย/หญิง) | Dynamic | API/Mock |
| **7** | Car Gallery 1 | รถ 3 รุ่น | Static | HTML |
| **8** | Zone Chart | กราฟลูกค้าแต่ละโซน | Dynamic | API/Mock |
| **9** | Hourly Chart | กราฟ+ตารางตามเวลา | Dynamic | API/Mock |
| **10** | CCTV Layout | รูป Layout กล้อง | Static | HTML |
| **11** | Dwell Time Chart | กราฟระยะเวลาพัก | Dynamic | API/Mock |
| **12** | Car Gallery 2 | รถ 2 รุ่น | Static | HTML |
| **13** | Daily Chart | กราฟลูกค้าแต่ละวัน | Dynamic | API/Mock |
| **14** | Daily Zone Chart | กราฟแบบ Stacked | Dynamic | API/Mock |

### 🎯 Component Types

#### Static Components (7 Rows)
- ไม่เปลี่ยนแปลง ข้อมูลอยู่ใน HTML
- Rows: 1, 2, 3-4, 7, 10, 12

#### Dynamic Components (7 Rows)
- เปลี่ยนแปลงตามข้อมูล
- Rows: 5, 6, 8, 9, 11, 13, 14

---

## 4. ระบบ API

### 📡 API Configuration

**ตำแหน่ง:** `frontend/assets/js/api.js` (บรรทัด 12-16)

```javascript
    BASE_URL: 'http://192.168.1.91:8111',
    API_PREFIX: '/benzEvents/api',
    TIMEOUT: 30000, // 30 seconds
};
````

**Full URL:** `http://192.168.1.91:8111/benzEvents/api`

### 🔌 API Endpoints (5 Endpoints)

#### 1. Health Check

```http
GET /health
```

- **ฟังก์ชัน:** `API.checkHealth()`
- **ใช้งาน:** ตรวจสอบ API Server พร้อมหรือไม่
- **Response:** `{"status": "ok", "mongo": "connected"}`

#### 2. List Databases

```http
GET /dbs
```

- **ฟังก์ชัน:** `API.getDatabases()`
- **ใช้งาน:** ดึงรายชื่อ Database (db\_\*)
- **Response:** `{"databases": ["db_boothbenz"]}`

#### 3. List Collections

```http
GET /collections?db={db_name}
```

- **ฟังก์ชัน:** `API.getCollections(dbName)`
- **ใช้งาน:** ดึงรายชื่อ Collections
- **Response:** `{"collections": ["visitors"]}`

#### 4. Get Documents (หลัก)

```http
GET /documents?db={db}&col={col}&skip={skip}&limit={limit}
```

- **ฟังก์ชัน:** `API.getDocuments(params)` / `API.getAllDocuments(db, col)`
- **ใช้งาน:** ดึงข้อมูลลูกค้าทั้งหมด

**Parameters:**

- `db` (required): ชื่อ Database
- `col` (required): ชื่อ Collection
- `skip`: จำนวน documents ที่จะข้าม (default: 0)
- `limit`: จำนวนที่จะดึง (default: null = ทั้งหมด)
- `sort_field`: ฟิลด์ที่เรียง (default: "\_id")
- `sort_dir`: -1=desc, 1=asc (default: -1)

**Response:**

```json
{
  "db": "db_boothbenz",
  "collection": "visitors",
  "total": 1089,
  "docs": [
    {
      "_id": "...",
      "date": "2025-11-25",
      "timestamp": "2025-11-25T14:30:00Z",
      "time": "14:30:00",
      "hour": 14,
      "gender": "male",
      "zone": "AMG SL 43",
      "camera_id": 1,
      "dwell_time": 5,
      "type": "visitor"
    }
  ]
}
```

#### 5. Update Document Type

```http
PATCH /doc/{doc_id}/type?db={db}&col={col}
Body: { "type": "new_type" }
```

- **ฟังก์ชัน:** `API.updateDocumentType(docId, newType, db, col)`
- **ใช้งาน:** อัพเดตฟิลด์ type

### 📦 Mock Data System

**ตำแหน่ง:** `frontend/assets/js/main.js` (บรรทัด 23-103)

#### เมื่อใช้ Mock Data?

1. ✅ API Server ไม่พร้อม (Health Check ล้มเหลว)
2. ✅ เกิด Error ตอน Fetch ข้อมูล
3. ✅ ไม่มีข้อมูลใน Database

#### ข้อมูล Mock Data (1,282 records)

- 224 records - AMG SL 43
- 5 records - C 350 e AMG Dynamic
- 335 records - GLC 220d 4 Matic Avantgar
- 351 records - GLA 200 AMG Dynamic
- 167 records - E 350 e AMG Dynamic
- 200 records - ข้อมูลช่วงเวลาต่างๆ

### 🔄 Data Processing Functions

**ตำแหน่ง:** `frontend/assets/js/api.js` (บรรทัด 246-378)

| Function               | Input     | Output                  | ใช้ที่ |
| ---------------------- | --------- | ----------------------- | ------ |
| `calculateKPIData()`   | documents | `{total, male, female}` | Row 6  |
| `groupByZone()`        | documents | `{zone: count}`         | Row 8  |
| `groupByHour()`        | documents | `{hour: count}`         | Row 9  |
| `groupByDate()`        | documents | `{date: count}`         | Row 13 |
| `groupByDwellTime()`   | documents | `{minutes: count}`      | Row 11 |
| `groupByDateAndZone()` | documents | `{date: {zone: count}}` | Row 14 |

---

## 5. เงื่อนไขการแสดงผล

### 🔀 Logic Flow

```
1. เริ่มต้น → initializeApp()
   ↓
2. checkApiHealth()
   ├─ API Ready? → Load from API
   └─ API Fail? → Use Mock Data
   ↓
3. loadDashboardData()
   ├─ useMockData = true → MOCK_DATA
   └─ useMockData = false → API.getAllDocuments()
   ↓
4. filterDocumentsByDateRange()
   └─ กรองตาม dateRange
   ↓
5. updateDashboard()
   ├─ updateKPICards()
   ├─ createAllCharts()
   └─ animateDashboardElements()
```

### 📋 Conditional Rendering

#### Row 6: KPI Cards

```javascript
// main.js - updateKPICards()
const kpiData = API.calculateKPIData(documents);
animateNumber(totalElement, kpiData.total);
animateNumber(maleElement, kpiData.male);
animateNumber(femaleElement, kpiData.female);
```

#### Rows 8, 9, 11, 13, 14: Charts

```javascript
// main.js - createAllCharts()
// กราฟจะสร้างเสมอ ถ้าไม่มีข้อมูลจะใช้ Mock Data

// Row 8
const zoneData = API.groupByZone(documents);
Charts.createZoneInterestChart(zoneData);

// Row 9
const hourData = API.groupByHour(documents);
Charts.createHourlyTrafficChart(hourData);
Charts.updateHourlyTrafficTable(hourData);

// Row 11
const dwellData = API.groupByDwellTime(documents);
if (Object.keys(dwellData).length > 0) {
  Charts.createDwellTimeChart(dwellData);
}

// Row 13
const dateData = API.groupByDate(documents);
Charts.createDailyTrafficChart(dateData);

// Row 14
const dateZoneData = API.groupByDateAndZone(documents);
Charts.createDailyZoneChart(dateZoneData);
```

#### Row 5: Date Filter

```javascript
// main.js - filterDocumentsByDateRange()
if (dateRange.start && dateRange.end) {
  // กรองข้อมูลตามวันที่
  filteredDocuments = allDocuments.filter((doc) => {
    const docDate = new Date(doc.date || doc.timestamp);
    return docDate >= startDate && docDate <= endDate;
  });
} else {
  filteredDocuments = allDocuments;
}
```

---

## 6. Data Flow

### 🔄 Complete Data Flow

```
Page Load
   ↓
initializeApp()
├─ showLoading()
├─ checkApiHealth()
│  └─ ถ้าล้มเหลว: appState.useMockData = true
├─ loadDatabases() (ถ้า API พร้อม)
├─ initializeDateRangePicker()
├─ setupEventListeners()
└─ loadDashboardData()
   ├─ ถ้า useMockData: ใช้ MOCK_DATA
   └─ ถ้าไม่: API.getAllDocuments()
   ↓
filterDocumentsByDateRange()
   ↓
updateDashboard()
├─ updateKPICards()
│  └─ API.calculateKPIData()
├─ createAllCharts()
│  ├─ API.groupByZone() → Chart 1
│  ├─ API.groupByHour() → Chart 2
│  ├─ API.groupByDwellTime() → Chart 3
│  ├─ API.groupByDate() → Chart 4
│  └─ API.groupByDateAndZone() → Chart 5
└─ animateDashboardElements()
   ↓
hideLoading()
```

### 🎯 State Management

**ตำแหน่ง:** `frontend/assets/js/main.js` (บรรทัด 9-21)

```javascript
const appState = {
  currentDatabase: "db_boothbenz", // Database ที่ใช้
  currentCollection: "visitors", // Collection ที่ใช้
  dateRange: {
    start: null, // วันเริ่มต้น
    end: null, // วันสิ้นสุด
  },
  allDocuments: [], // ข้อมูลทั้งหมด
  filteredDocuments: [], // ข้อมูลที่กรองแล้ว
  isLoading: false, // สถานะโหลด
  useMockData: false, // ใช้ Mock Data?
};
```

---

## 7. ฟังก์ชันสำคัญ

### 📍 ไฟล์: `main.js` (20KB)

#### Initialization Functions

| Function                      | Line    | Description          |
| ----------------------------- | ------- | -------------------- |
| `initializeApp()`             | 114-153 | เริ่มต้น Application |
| `checkApiHealth()`            | 158-170 | ตรวจสอบ API          |
| `loadDatabases()`             | 175-189 | โหลด Database        |
| `initializeDateRangePicker()` | 194-240 | ตั้งค่า Date Picker  |
| `setupEventListeners()`       | 245-262 | ตั้งค่า Events       |

#### Data Loading Functions

| Function                       | Line    | Description    |
| ------------------------------ | ------- | -------------- |
| `loadDashboardData()`          | 272-313 | โหลดข้อมูลหลัก |
| `filterDocumentsByDateRange()` | 318-341 | กรองตามวันที่  |

#### UI Update Functions

| Function            | Line    | Description      |
| ------------------- | ------- | ---------------- |
| `updateDashboard()` | 350-367 | อัพเดท Dashboard |
| `updateKPICards()`  | 372-391 | อัพเดท KPI       |
| `createAllCharts()` | 396-424 | สร้างกราฟทั้งหมด |

### 📍 ไฟล์: `charts.js` (18KB)

#### Chart Creation Functions

| Function                     | Line    | Description         | Row |
| ---------------------------- | ------- | ------------------- | --- |
| `createZoneInterestChart()`  | 58-127  | กราฟ Zone Interest  | 8   |
| `createHourlyTrafficChart()` | 132-201 | กราฟ Hourly Traffic | 9   |
| `createDwellTimeChart()`     | 206-275 | กราฟ Dwell Time     | 11  |
| `createDailyTrafficChart()`  | 280-349 | กราฟ Daily Traffic  | 13  |
| `createDailyZoneChart()`     | 354-434 | กราฟ Daily Zone     | 14  |
| `updateHourlyTrafficTable()` | 443-467 | อัพเดทตาราง         | 9   |

### 📍 ไฟล์: `api.js` (11KB)

#### API Functions

| Function            | Line    | Description     |
| ------------------- | ------- | --------------- |
| `checkHealth()`     | 68-79   | Health Check    |
| `getDatabases()`    | 84-96   | ดึง Databases   |
| `getCollections()`  | 101-120 | ดึง Collections |
| `getDocuments()`    | 125-180 | ดึง Documents   |
| `getAllDocuments()` | 232-241 | ดึงทั้งหมด      |

#### Data Processing Functions

| Function               | Line    | Description     |
| ---------------------- | ------- | --------------- |
| `calculateKPIData()`   | 246-260 | คำนวณ KPI       |
| `groupByZone()`        | 265-277 | จัดกลุ่มโซน     |
| `groupByHour()`        | 282-308 | จัดกลุ่มชั่วโมง |
| `groupByDate()`        | 313-331 | จัดกลุ่มวัน     |
| `groupByDwellTime()`   | 336-349 | จัดกลุ่มเวลาพัก |
| `groupByDateAndZone()` | 354-378 | จัดกลุ่มวัน+โซน |

---

## 8. การปรับแต่ง

### 🎨 1. เปลี่ยนสีธีม

**ตำแหน่ง:** `frontend/assets/css/style.css` (บรรทัด 9-40)

```css
:root {
  --primary-blue: #0066cc; /* สีหลัก */
  --primary-dark-blue: #004a99;
  --kpi-total-bg: #0d6efd; /* สี KPI */
  --kpi-male-bg: #0dcaf0;
  --kpi-female-bg: #ffc0cb;
}
```

### 🔌 2. เปลี่ยน API URL

**ตำแหน่ง:** `frontend/assets/js/api.js` (บรรทัด 12-16)

```javascript
const API_CONFIG = {
  BASE_URL: "http://172.16.1.31:8111", // เปลี่ยนที่นี่
  API_PREFIX: "/benzEvents/api",
  TIMEOUT: 30000,
};
```

### 📊 3. เปลี่ยน Database/Collection

**ตำแหน่ง:** `frontend/assets/js/main.js` (บรรทัด 10-11)

```javascript
const appState = {
  currentDatabase: "db_boothbenz", // เปลี่ยนที่นี่
  currentCollection: "visitors", // เปลี่ยนที่นี่
};
```

### 🎯 4. แก้ไข Mock Data

**ตำแหน่ง:** `frontend/assets/js/main.js` (บรรทัด 24-103)

```javascript
const MOCK_DATA = [
  // เพิ่ม/ลด/แก้ไขได้ที่นี่
  {
    _id: "mock_1",
    date: "2025-11-24",
    gender: "male",
    zone: "AMG SL 43",
    dwell_time: 5,
  },
];
```

### 📈 5. เปลี่ยนประเภทกราฟ

**ตำแหน่ง:** `frontend/assets/js/charts.js`

```javascript
// เปลี่ยนจาก Bar เป็น Line
new Chart(ctx, {
  type: "line", // 'bar', 'line', 'pie', 'doughnut'
  data: {
    /* ... */
  },
});
```

---

## 9. Troubleshooting

### ❌ ปัญหา: กราฟไม่แสดง

**สาเหตุ:**

1. Chart.js ไม่โหลด
2. ข้อมูลไม่ถูกต้อง
3. Canvas element ไม่มี

**วิธีแก้:**

```javascript
// เปิด Browser Console (F12)
console.log(typeof Chart); // ควรได้ "function"
console.log("Data:", zoneData);
```

### ❌ ปัญหา: API ไม่ตอบสนอง

**สาเหตุ:**

- Backend Server ไม่รัน
- Network Issue

**วิธีแก้:**

```bash
# ทดสอบ API
curl http://192.168.1.91:8111/benzEvents/api/health

# ระบบจะใช้ Mock Data อัตโนมัติ
```

### ❌ ปัญหา: Date Picker ไม่ทำงาน

**สาเหตุ:**

- jQuery/Moment.js ไม่โหลด

**วิธีแก้:**

```javascript
// Console
console.log(typeof $); // "function"
console.log(typeof moment); // "function"
```

### ❌ ปัญหา: รูปไม่แสดง

**วิธีแก้:**

- ระบบใช้ Placeholder อัตโนมัติ
- ตรวจสอบไฟล์ใน `frontend/assets/images/`

---

## 📝 Quick Reference

### 🔗 ไฟล์ที่แก้บ่อย

| ไฟล์         | สำหรับ                   | บรรทัดสำคัญ     |
| ------------ | ------------------------ | --------------- |
| `api.js`     | API URL, Data Processing | 12-16, 246-378  |
| `main.js`    | Mock Data, Logic         | 24-103, 272-424 |
| `charts.js`  | กราฟ                     | 58-434          |
| `style.css`  | สี, Theme                | 9-40            |
| `index.html` | Layout                   | ทุกส่วน         |

### 🚀 คำสั่งที่ใช้บ่อย

```bash
# เปิด Dashboard
cd frontend
# double-click index.html

# ดู Console (สำคัญมาก!)
F12 → Console tab

# Refresh (ไม่ใช้ cache)
Ctrl + F5
```

### 🎯 จุดเริ่มต้นการแก้ไข

**ถ้าต้องการแก้:**

1. **API** → `api.js` บรรทัด 12-16
2. **Mock Data** → `main.js` บรรทัด 24-103
3. **สี** → `style.css` บรรทัด 9-40
4. **กราฟ** → `charts.js` ฟังก์ชันที่ต้องการ
5. **ข้อความ** → `index.html`
6. **Logic** → `main.js` ฟังก์ชันที่ต้องการ

---

## 🎓 สรุปสำหรับ Developer

### ✅ สิ่งที่ควรรู้

1. **14 Rows** - Static (7) + Dynamic (7)
2. **Mock Data** - 1,282 records อัตโนมัติ
3. **ไม่มี Alert** - ใช้ Info Banner
4. **Charts** - Chart.js (5 กราฟ)
5. **Data Flow** - One-way: API → Filter → Display
6. **Responsive** - ทุกขนาดหน้าจอ

### 🔧 ไฟล์สำคัญ 3 ไฟล์

1. **api.js** (11KB) - API + Data Processing
2. **charts.js** (18KB) - กราฟทั้งหมด
3. **main.js** (20KB) - Logic + Mock Data

### 📊 กราฟทั้ง 5 กราฟ

1. Zone Interest (Row 8) - Bar Chart
2. Hourly Traffic (Row 9) - Bar Chart + Table
3. Dwell Time (Row 11) - Bar Chart
4. Daily Traffic (Row 13) - Bar Chart
5. Daily Zone (Row 14) - Stacked Bar Chart

### 🎯 Fallback Logic

```
API Ready?
  → Yes: ใช้ข้อมูลจริง
  → No: ใช้ Mock Data (1,282 records)

มีข้อมูล?
  → Yes: แสดงตามปกติ
  → No: ใช้ Mock Data ทั้งหมด
```

---

## 📞 Support

**ขั้นตอนแก้ปัญหา:**

1. **ดู Console (F12)** - มี Log ทุกขั้นตอน
2. **ดู Network Tab** - เช็ค API Calls
3. **อ่านเอกสารนี้** - มีคำตอบส่วนใหญ่
4. **ดูโค้ด** - มี Comment เยอะ

---

**🎉 เอกสารนี้ครอบคลุม:**

- ✅ โครงสร้างโปรเจค
- ✅ ส่วนประกอบ 14 Rows
- ✅ ระบบ API + Mock Data
- ✅ เงื่อนไขการแสดงผล
- ✅ Data Flow
- ✅ ฟังก์ชันทั้งหมด + Location
- ✅ การปรับแต่ง
- ✅ Troubleshooting

**หากต้องการข้อมูลเพิ่มเติม:**

- [README.md](README.md) - ภาพรวม
- [data_swagger.md](data_swagger.md) - API Doc
- [notes.md](notes.md) - ความต้องการ

---

**Version:** 1.0.0
**Last Updated:** 2026-01-22
**สำหรับ:** Thonburi Phanich Dashboard
