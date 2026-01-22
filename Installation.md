# Installation Guide - Thonburi Phanich Dashboard Project

## 📋 สรุปโปรเจค

**ชื่อโปรเจค:** Thonburi Phanich Auto Showcase Dashboard
**วัตถุประสงค์:** สร้าง Dashboard แสดงข้อมูลลูกค้าและการวิเคราะห์พฤติกรรมในงานออกบูธรถยนต์ Mercedes-Benz ที่ Central Park II

---

## 🔍 การวิเคราะห์ไฟล์ที่มีอยู่

### 1. **ex_backend.py** - FastAPI Backend Service
**สถานะ:** ✅ พร้อมใช้งาน

**ฟังก์ชันหลัก:**
- เชื่อมต่อ MongoDB Server: `172.16.1.31:27017`
- Credentials: `root/example` (Auth DB: admin)
- Base URL: `/benzEvents/api`
- Swagger Documentation: `http://0.0.0.0:8111/benzEvents/api/docs`

**API Endpoints ที่มี:**
| Method | Endpoint | คำอธิบาย |
|--------|----------|---------|
| GET | `/health` | ตรวจสอบสถานะการเชื่อมต่อ MongoDB |
| GET | `/dbs` | ดึงรายชื่อ Database ทั้งหมด (ที่ขึ้นต้นด้วย `db_`) |
| GET | `/collections` | ดึงรายชื่อ Collections ในแต่ละ Database |
| GET | `/documents` | ดึงข้อมูล Documents (รองรับ pagination, sorting) |
| PATCH | `/doc/{doc_id}/type` | อัพเดตฟิลด์ type ของ Document |

**Features:**
- รองรับ CORS (allow all origins)
- Convert ObjectId เป็น String อัตโนมัติ
- Error handling ที่ดี
- Support pagination (skip, limit)
- Support sorting (sort_field, sort_dir)

### 2. **systems-image.pdf** - UI/UX Design Reference
**สถานะ:** ✅ ได้รับแบบ Design

**โครงสร้าง Dashboard ที่ต้องการ (14 Rows):**

#### **Row 1: Header Section**
- พื้นหลังสีน้ำเงิน (#0066CC หรือใกล้เคียง)
- ข้อความ "Thonburi Phanich"
- แถบสีตกแต่ง

#### **Row 2: Hero Image**
- รูปโชว์รูมรถ Mercedes-Benz ขนาดเต็มจอ
- Overlay ข้อความ: "THONBURI PHANICH AUTO SHOWCASE @ CENTRAL PARK II"
- Logo Pinit IT ด้านล่างขวา

#### **Row 3-4: CCTV Camera Cards** (2 Rows x 2 Cards)
- **Row 3:** CAMERA 1, CAMERA 2
- **Row 4:** CAMERA 3, CAMERA 4
- แต่ละ Card มีปุ่ม ">> Check <<" สีเหลือง
- รูปกล้อง CCTV พร้อมพื้นหลังสีเทา

#### **Row 5: Filter Controls**
- Date Range Picker (แสดงวันที่ 30)
- Dropdown: "Select date range"
- ไอคอนกรอง/ตั้งค่า

#### **Row 6: Summary Cards** (KPI Cards)
- **Card 1:** จำนวนลูกค้าทั้งหมด (Record Count: 1,089) - สีน้ำเงิน
- **Card 2:** เพศชาย (Record Count: 724) - สีฟ้า
- **Card 3:** เพศหญิง (365) - สีชมพู พร้อมข้อความ "ผมสนใจ"

#### **Row 7: Car Models Gallery** (ภาพรถในงาน - รอบ 1)
ภาพรถ Mercedes-Benz 5 รุ่น:
1. AMG SL 43
2. C 350 e AMG Dynamic
3. GLC 220d 4 Matic Avantgar
4. GLA 200 AMG Dynamic (บางส่วน)
5. E 350 e AMG Dynamic (บางส่วน)

#### **Row 8: Zone Interest Chart**
- **ชื่อกราฟ:** "Zone ที่ลูกค้าให้ความสนใจ"
- กราฟแท่งแนวตั้ง แสดงจำนวนลูกค้าในแต่ละโซน (รถแต่ละรุ่น)
- ข้อมูล:
  - AMG SL 43: 224
  - C 350 e AMG Dynamic: ~5
  - GLC 220d 4 Matic Ava.: 335
  - GLA 200 AMG Dynamic: 351
  - E 350 e AMG Dynamic: 167

#### **Row 9: Hourly Traffic Chart + Table**
- **ชื่อกราฟ:** "แสดงจำนวนลูกค้า แยกตามช่วงเวลา"
- กราฟแท่งแนวตั้ง แสดงช่วงเวลา (10:00-20:00)
- ตารางด้านขวาแสดงข้อมูลตัวเลข:
  - 10:00-11:00: 27
  - 11:00-12:00: 106
  - 12:00-13:00: 174
  - 13:00-14:00: 123
  - 14:00-15:00: 170
  - 15:00-16:00: 135
  - 16:00-17:00: 90
  - 17:00-18:00: 98
  - 18:00-19:00: 111
  - 19:00-20:00: 50

#### **Row 10: CCTV Layout Visualization**
- **ชื่อ:** "ภาพจากกล้อง CCTV"
- แสดงภาพ 3D Layout ของงาน
- ตำแหน่งกล้องทั้ง 4 ตัว
- จำลองพื้นที่จัดแสดงรถและลูกค้า

#### **Row 11: Dwell Time Chart**
- **ชื่อกราฟ:** "แสดงจำนวนลูกค้า แยกตามช่วงเวลา (นาที) ของการพบบุคคลในพื้นที่"
- กราฟแท่งแนวตั้ง
- แกน X: ระยะเวลา (นาที) - 1, 2, 3, 4, 5, 6, 8, 9, 12, 14
- แกน Y: จำนวนลูกค้า (0-1.2k)
- ข้อมูลโดดเด่น: นาทีที่ 1 มีลูกค้า 1,026 คน

#### **Row 12: Car Models Gallery** (ภาพรถในงาน - รอบ 2)
ภาพรถ Mercedes-Benz รุ่นอื่นๆ:
- GLA 200 AMG Dynamic
- E 350 e AMG Dynamic

#### **Row 13: Daily Traffic Chart**
- **ชื่อกราฟ:** "แสดงจำนวนลูกค้า แยกตามวัน"
- กราฟแท่งแนวตั้ง
- แสดงข้อมูล 5 วัน (24-28 พฤศจิกายน 2025):
  - Nov 24, 2025: 77
  - Nov 25, 2025: 229
  - Nov 26, 2025: 186
  - Nov 27, 2025: 197
  - Nov 28, 2025: 433

#### **Row 14: Daily Zone Breakdown Chart**
- **ชื่อกราฟ:** "แสดงจำนวนลูกค้า แยกตามวันและแยกโซน"
- กราฟแท่งแนวตั้ง แบบ Stacked/Grouped
- แสดงข้อมูลแต่ละวันแยกตามโซนรถต่างๆ
- ใช้สีแตกต่างกันสำหรับแต่ละโซน
- วันที่ 28 พ.ย. มีลูกค้ามากที่สุด (ประมาณ 400+)

---

## 💻 Tech Stack

### Frontend
- **HTML5** - โครงสร้างหน้าเว็บ
- **CSS3** - การตกแต่ง
- **Bootstrap 5** - Framework สำหรับ Responsive Design
- **JavaScript (Vanilla/jQuery)** - การโต้ตอบและเรียก API
- **Chart.js / ApexCharts** - สร้างกราฟและแผนภูมิ

### Backend
- **Python 3.x**
- **FastAPI** - REST API Framework
- **Uvicorn** - ASGI Server
- **PyMongo** - MongoDB Driver
- **Pydantic** - Data Validation

### Database
- **MongoDB** - NoSQL Database
- **Server:** 172.16.1.31:27017

### Development Tools
- **OS:** Windows 11
- **Editor:** Visual Studio Code
- **Version Control:** Git + GitHub Desktop
- **Project Path:** C:\xampp\htdocs\boothbenz

---

## 📦 Dependencies ที่ต้องติดตั้ง

### Python Packages

สร้างไฟล์ `requirements.txt`:

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
pymongo==4.6.0
pydantic==2.5.0
python-multipart==0.0.6
```

### Frontend Libraries (CDN)

```html
<!-- Bootstrap 5 -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

<!-- Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>

<!-- jQuery (Optional) -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<!-- Date Range Picker (Optional) -->
<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />
<script src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
```

---

## 🚀 ขั้นตอนการติดตั้ง

### Step 1: ตรวจสอบ Python
```bash
# ตรวจสอบเวอร์ชัน Python
python --version

# ควรเป็น Python 3.8 ขึ้นไป
```

### Step 2: สร้าง Virtual Environment (แนะนำ)
```bash
# ไปที่โฟลเดอร์โปรเจค
cd C:\xampp\htdocs\boothbenz

# สร้าง virtual environment
python -m venv venv

# เปิดใช้งาน virtual environment
# บน Windows
venv\Scripts\activate

# หากเจอ error ให้รัน PowerShell as Administrator แล้วรัน
Set-ExecutionPolicy RemoteSigned
```

### Step 3: ติดตั้ง Python Dependencies
```bash
# สร้างไฟล์ requirements.txt (ถ้ายังไม่มี)
# จากนั้นติดตั้ง packages

pip install fastapi uvicorn[standard] pymongo pydantic python-multipart
```

### Step 4: ตรวจสอบการเชื่อมต่อ MongoDB
```bash
# ทดสอบ Backend
python ex_backend.py

# หรือระบุ host/port
python ex_backend.py --host 0.0.0.0 --port 8111 --reload
```

เปิดเบราว์เซอร์ไปที่:
- Swagger UI: http://localhost:8111/benzEvents/api/docs
- Health Check: http://localhost:8111/benzEvents/api/health

### Step 5: โครงสร้างโปรเจคที่แนะนำ

```
C:\xampp\htdocs\boothbenz\
│
├── backend/
│   ├── ex_backend.py           # FastAPI Application (ย้ายเข้ามาที่นี่)
│   ├── requirements.txt        # Python Dependencies
│   └── .env                    # Environment Variables (ควรสร้าง)
│
├── frontend/
│   ├── index.html              # หน้า Dashboard หลัก
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css       # Custom CSS
│   │   ├── js/
│   │   │   ├── main.js         # Main JavaScript
│   │   │   ├── api.js          # API Calls
│   │   │   └── charts.js       # Chart Configurations
│   │   └── images/
│   │       ├── hero-image.jpg  # รูปโชว์รูม
│   │       ├── camera-*.jpg    # รูปกล้อง
│   │       └── cars/           # รูปรถแต่ละรุ่น
│   │           ├── amg-sl43.jpg
│   │           ├── c350e.jpg
│   │           ├── glc220d.jpg
│   │           ├── gla200.jpg
│   │           └── e350e.jpg
│
├── docs/
│   ├── systems-image.pdf       # Design Reference
│   ├── data_swagger.md         # API Documentation
│   └── notes.md                # Project Notes
│
├── .gitignore
├── README.md
└── Installation.md             # ไฟล์นี้
```

---

## 🎨 แผนการพัฒนา Dashboard (Frontend)

### Phase 1: HTML Structure Setup
**Timeline:** 1 วัน

**Tasks:**
1. สร้างไฟล์ `frontend/index.html`
2. เซ็ตอัพ Bootstrap Grid System สำหรับ 14 Rows
3. เพิ่ม Placeholder Content ทุก Section
4. ทดสอบ Responsive Design

**Deliverable:** โครงสร้าง HTML พื้นฐานครบทั้ง 14 Rows

---

### Phase 2: Styling & Branding
**Timeline:** 1-2 วัน

**Tasks:**
1. สร้างไฟล์ `frontend/assets/css/style.css`
2. กำหนด Color Scheme ตามแบรนด์ Thonburi Phanich:
   - Primary Blue: #0066CC
   - Secondary Colors จากไฟล์ PDF
3. ออกแบบ Cards, Buttons, Headers
4. เพิ่มฟอนต์ภาษาไทย (เช่น Prompt, Sarabun)
5. ปรับแต่ง Responsive Breakpoints

**Deliverable:** Dashboard ที่มีหน้าตาสวยงามตาม Design Reference

---

### Phase 3: Static Content Integration
**Timeline:** 1 วัน

**Tasks:**
1. เพิ่มรูปภาพ:
   - Hero Image (Row 2)
   - รูปกล้อง CCTV (Row 3-4)
   - รูปรถ Mercedes-Benz แต่ละรุ่น (Row 7, 11)
   - CCTV Layout Diagram (Row 10)
2. เซ็ตอัพ Camera Link Cards
3. เพิ่ม Logo และข้อความต่างๆ

**Deliverable:** Dashboard พร้อมเนื้อหา Static ครบถ้วน

---

### Phase 4: JavaScript & Chart Integration
**Timeline:** 2-3 วัน

**Tasks:**
1. สร้างไฟล์ `frontend/assets/js/`:
   - `api.js` - Functions สำหรับเรียก Backend API
   - `charts.js` - Chart.js Configurations
   - `main.js` - Main Application Logic

2. เชื่อมต่อ Backend API:
   - ดึงรายชื่อ Database
   - ดึงข้อมูล Collections
   - ดึงข้อมูล Documents

3. สร้าง Charts ทั้งหมด:
   - **Row 8:** Zone Interest Bar Chart
   - **Row 9:** Hourly Traffic Chart + Table
   - **Row 11:** Dwell Time Chart
   - **Row 13:** Daily Traffic Chart
   - **Row 14:** Daily Zone Breakdown Chart

4. เพิ่ม Date Range Picker (Row 5)

**Deliverable:** Dashboard แบบ Dynamic ที่ดึงข้อมูลจาก API ได้

---

### Phase 5: Filters & Interactivity
**Timeline:** 1-2 วัน

**Tasks:**
1. Implement Date Range Filter
2. Implement Database Selection Dropdown
3. เชื่อมต่อ Filters กับ Charts
4. Add Loading States
5. Add Error Handling
6. Implement Auto-refresh (Optional)

**Deliverable:** Dashboard ที่มีการโต้ตอบครบถ้วน

---

### Phase 6: Data Processing & Calculations
**Timeline:** 1-2 วัน

**Tasks:**
1. คำนวณ KPI Cards (Row 6):
   - จำนวนลูกค้าทั้งหมด
   - แยกเพศชาย/หญิง
2. จัดกลุ่มข้อมูลตาม:
   - Zone (รุ่นรถ)
   - ช่วงเวลา (Hourly)
   - วัน (Daily)
   - Dwell Time (นาที)
3. Format ข้อมูลให้พร้อมแสดงผล

**Deliverable:** Logic การประมวลผลข้อมูลที่ถูกต้อง

---

### Phase 7: Testing & Optimization
**Timeline:** 1-2 วัน

**Tasks:**
1. ทดสอบบนหน้าจอขนาดต่างๆ:
   - Mobile (320px-768px)
   - Tablet (768px-1024px)
   - Desktop (1024px+)
2. ทดสอบ Cross-browser (Chrome, Firefox, Edge)
3. Optimize Performance:
   - Lazy Loading Images
   - Minimize API Calls
   - Caching
4. ทดสอบ Error Cases

**Deliverable:** Dashboard ที่ทำงานได้ดีและเสถียร

---

### Phase 8: Documentation & Deployment
**Timeline:** 1 วัน

**Tasks:**
1. เขียน README.md
2. เขียน API Documentation
3. สร้าง User Manual (ถ้าต้องการ)
4. Deploy to Production Server (ถ้ามี)

**Deliverable:** โปรเจคพร้อม Deploy และมีเอกสารครบถ้วน

---

## 📊 ตัวอย่างโครงสร้างข้อมูลที่คาดหวัง

### Database Structure (สมมติ)

```javascript
// Database: db_boothbenz
// Collection: visitors

{
  "_id": ObjectId("..."),
  "timestamp": ISODate("2025-11-25T14:30:00Z"),
  "date": "2025-11-25",
  "time": "14:30:00",
  "hour": 14,
  "gender": "male",  // male, female, unknown
  "zone": "AMG SL 43",  // ชื่อรุ่นรถ
  "camera_id": 1,
  "dwell_time": 5,  // นาที
  "type": "visitor",
  "age_group": "30-40",  // (optional)
}
```

### API Response Example

```json
// GET /benzEvents/api/documents?db=db_boothbenz&col=visitors&limit=10

{
  "db": "db_boothbenz",
  "collection": "visitors",
  "count": 10,
  "docs": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "timestamp": "2025-11-25T14:30:00Z",
      "gender": "male",
      "zone": "AMG SL 43",
      "dwell_time": 5
    },
    // ... more documents
  ]
}
```

---

## 🔧 ปัญหาที่อาจพบและวิธีแก้

### 1. MongoDB Connection Failed
**สาเหตุ:**
- MongoDB Server ไม่เปิด
- Network ไม่สามารถเชื่อมต่อไปยัง 172.16.1.31

**วิธีแก้:**
```bash
# ทดสอบการเชื่อมต่อ
ping 172.16.1.31

# ตรวจสอบว่า MongoDB ทำงานหรือไม่
# หรือติดต่อ IT Admin
```

### 2. CORS Error ในเบราว์เซอร์
**สาเหตุ:** Frontend และ Backend อยู่คนละ Origin

**วิธีแก้:**
- Backend มี CORS Middleware แล้ว (`allow_origins=["*"]`)
- ตรวจสอบว่า Backend รันอยู่หรือไม่

### 3. Charts ไม่แสดงผล
**สาเหตุ:**
- Chart.js ไม่ได้ load
- ข้อมูลไม่ถูก format

**วิธีแก้:**
```javascript
// ตรวจสอบว่า Chart.js โหลดแล้ว
console.log(typeof Chart);  // ควรได้ "function"

// ตรวจสอบข้อมูล
console.log(chartData);
```

### 4. Environment Variable Issues
**วิธีแก้:**
สร้างไฟล์ `.env`:
```env
MONGO_HOST=172.16.1.31
MONGO_PORT=27017
MONGO_USER=root
MONGO_PASS=example
MONGO_AUTH_DB=admin
API_PORT=8111
```

แก้ไข `ex_backend.py`:
```python
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_HOST = os.getenv("MONGO_HOST", "172.16.1.31")
# ... etc
```

---

## 📱 Responsive Design Guidelines

### Mobile (< 768px)
- Stack ทุก Element เป็นแนวตั้ง
- Camera Cards: 1 column
- Charts: ย่อเล็กลงแต่ยังอ่านได้
- Hide บางข้อมูลที่ไม่สำคัญ

### Tablet (768px - 1024px)
- Camera Cards: 2 columns
- KPI Cards: 3 columns
- Car Gallery: 2-3 columns

### Desktop (> 1024px)
- แสดงผลเต็มรูปแบบตาม Design
- 4 Camera Cards ในแถวเดียว (ถ้าจอกว้างพอ)

---

## 🎯 Performance Optimization Tips

1. **Image Optimization:**
   - ใช้ WebP format
   - Compress images (TinyPNG, ImageOptim)
   - ใช้ `loading="lazy"` attribute

2. **API Optimization:**
   - ใช้ pagination (`skip`, `limit`)
   - Cache ข้อมูลที่ไม่เปลี่ยนบ่อย
   - ใช้ IndexedDB/LocalStorage

3. **Code Optimization:**
   - Minify CSS/JS
   - Use CDN สำหรับ Libraries
   - Debounce filter changes

4. **Chart Optimization:**
   - จำกัดจำนวนข้อมูลที่แสดง
   - ใช้ Aggregation ฝั่ง Backend
   - Destroy charts ก่อนสร้างใหม่

---

## 🔐 Security Considerations

### Backend
```python
# ควร implement ใน Production:
# 1. Environment Variables สำหรับ sensitive data
# 2. Rate Limiting
# 3. Authentication/Authorization
# 4. Input Validation
# 5. HTTPS
```

### Frontend
```javascript
// 1. Sanitize User Input
// 2. ใช้ HTTPS
// 3. ไม่ส่ง sensitive data ใน URL
// 4. Implement CSRF Protection
```

---

## 📞 Support & Resources

### Documentation
- FastAPI: https://fastapi.tiangolo.com/
- Chart.js: https://www.chartjs.org/docs/
- Bootstrap 5: https://getbootstrap.com/docs/5.3/
- MongoDB: https://www.mongodb.com/docs/

### API Endpoints
- Swagger UI: http://172.16.1.31:8111/benzEvents/api/docs
- OpenAPI JSON: http://172.16.1.31:8111/benzEvents/api/openapi.json

---

## ✅ Checklist ก่อนเริ่มพัฒนา

- [ ] Python 3.8+ ติดตั้งแล้ว
- [ ] Virtual Environment สร้างแล้ว
- [ ] Dependencies ติดตั้งครบ (`requirements.txt`)
- [ ] MongoDB เชื่อมต่อได้
- [ ] Backend API ทำงานได้ (ทดสอบด้วย `/health`)
- [ ] VS Code เปิดโฟลเดอร์โปรเจค
- [ ] GitHub Desktop พร้อมใช้งาน
- [ ] มีรูปภาพที่จำเป็นครบถ้วน (รถ, กล้อง, ฯลฯ)
- [ ] เข้าใจโครงสร้าง Dashboard 14 Rows
- [ ] ศึกษา API Endpoints แล้ว

---

## 📈 Timeline สรุป (Estimated)

| Phase | Tasks | Duration |
|-------|-------|----------|
| 1 | HTML Structure | 1 วัน |
| 2 | Styling & Branding | 1-2 วัน |
| 3 | Static Content | 1 วัน |
| 4 | JavaScript & Charts | 2-3 วัน |
| 5 | Filters & Interactivity | 1-2 วัน |
| 6 | Data Processing | 1-2 วัน |
| 7 | Testing | 1-2 วัน |
| 8 | Documentation | 1 วัน |
| **Total** | **Full Stack Dashboard** | **9-14 วัน** |

---

## 🚦 Next Steps

### สิ่งที่ควรทำต่อไป:

1. **ยืนยันโครงสร้างข้อมูล:**
   - ตรวจสอบว่า MongoDB มี Database/Collections อะไรบ้าง
   - ตรวจสอบโครงสร้าง Document จริง
   - ทดสอบ API ด้วย Swagger UI

2. **เตรียม Assets:**
   - รูปโชว์รูม (Hero Image)
   - รูปกล้อง CCTV 4 รูป
   - รูปรถ Mercedes-Benz ทุกรุ่น
   - Logo Thonburi Phanich / Pinit IT

3. **สร้างโครงสร้างโฟลเดอร์:**
   ```bash
   mkdir -p frontend/assets/css
   mkdir -p frontend/assets/js
   mkdir -p frontend/assets/images/cars
   mkdir -p backend
   ```

4. **เริ่มพัฒนา Phase 1:**
   - สร้าง `frontend/index.html`
   - เซ็ตอัพ Bootstrap Grid
   - สร้างโครงสร้าง 14 Rows

---

## 📝 Notes สำคัญ

1. **ข้อมูลที่ต้องชี้แจงเพิ่มเติม:**
   - โครงสร้างข้อมูลจริงใน MongoDB คืออะไร?
   - มี Database/Collection ชื่ออะไรบ้าง?
   - Field names ในแต่ละ Collection?
   - ต้องการ Real-time Update หรือไม่?
   - ต้องการ Export ข้อมูล (PDF, Excel) หรือไม่?

2. **Features เพิ่มเติมที่อาจต้องการ:**
   - [ ] User Authentication
   - [ ] Export to PDF/Excel
   - [ ] Print Dashboard
   - [ ] Email Reports
   - [ ] Real-time Updates (WebSocket)
   - [ ] Admin Panel สำหรับจัดการรูปรถ

3. **Browser Support:**
   - Chrome (แนะนำ)
   - Firefox
   - Edge
   - Safari (ทดสอบเบื้องต้น)

---

**สรุป:** โปรเจคนี้เป็น Dashboard แสดงผลข้อมูลการวิเคราะห์พฤติกรรมลูกค้าในงานออกบูธรถยนต์ ใช้ FastAPI Backend เชื่อมต่อ MongoDB และแสดงผลด้วย Bootstrap + Chart.js Frontend พร้อม Responsive Design

หากมีคำถามหรือต้องการความช่วยเหลือเพิ่มเติม กรุณาแจ้งได้เลยครับ! 🚀

---

**Last Updated:** 2026-01-22
**Version:** 1.0
**Author:** AI Developer Assistant
