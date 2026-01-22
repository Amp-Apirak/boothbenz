# Thonburi Phanich Auto Showcase - Dashboard

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-ready-green.svg)

Dashboard สำหรับแสดงข้อมูลลูกค้าและการวิเคราะห์พฤติกรรมในงานออกบูธรถยนต์ Mercedes-Benz ที่ Central Park II

---

## 📋 สารบัญ

- [ภาพรวมโปรเจค](#ภาพรวมโปรเจค)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [โครงสร้างโปรเจค](#โครงสร้างโปรเจค)
- [การติดตั้ง](#การติดตั้ง)
- [การใช้งาน](#การใช้งาน)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Troubleshooting](#troubleshooting)

---

## 🎯 ภาพรวมโปรเจค

โปรเจคนี้เป็น Dashboard แบบ Real-time สำหรับแสดงข้อมูลและวิเคราะห์พฤติกรรมลูกค้าในงานออกบูธรถยนต์ โดยดึงข้อมูลจาก MongoDB ผ่าน FastAPI Backend และแสดงผลด้วย Frontend ที่ออกแบบสวยงามและ Responsive

### วัตถุประสงค์

- แสดงข้อมูลลูกค้าทั้งหมดแบบ Real-time
- วิเคราะห์พฤติกรรมลูกค้าตามโซนต่างๆ (รุ่นรถ)
- แสดงสถิติการเข้าชมตามช่วงเวลา
- รองรับการกรองข้อมูลตามช่วงวันที่
- ระบบ CCTV Monitoring

---

## ✨ Features

### 📊 Dashboard Features

1. **Header Section** - แสดงโลโก้และแบรนด์ Thonburi Phanich
2. **Hero Section** - รูปโชว์รูมขนาดใหญ่พร้อม Overlay
3. **CCTV Camera Cards** - แสดง 4 กล้อง CCTV พร้อมลิงค์
4. **Filter Controls** - เลือกช่วงวันที่และฐานข้อมูล
5. **KPI Cards** - แสดงจำนวนลูกค้าทั้งหมด, เพศชาย, เพศหญิง
6. **Car Gallery** - แสดงรถยนต์แต่ละรุ่นในงาน
7. **Zone Interest Chart** - กราฟแท่งแสดงความสนใจในแต่ละโซน
8. **Hourly Traffic** - กราฟและตารางแสดงจำนวนลูกค้าตามช่วงเวลา
9. **CCTV Layout** - แสดงภาพ Layout ของกล้อง
10. **Dwell Time Chart** - กราฟแสดงระยะเวลาที่ลูกค้าอยู่ในพื้นที่
11. **Daily Traffic** - กราฟแสดงจำนวนลูกค้าแต่ละวัน
12. **Daily Zone Breakdown** - กราฟแสดงจำนวนลูกค้าแยกตามวันและโซน

### 🎨 UI/UX Features

- ✅ Responsive Design (Mobile, Tablet, Desktop)
- ✅ Smooth Animations
- ✅ Interactive Charts (Chart.js)
- ✅ Date Range Picker
- ✅ Loading States
- ✅ Error Handling
- ✅ Thai Language Support

---

## 💻 Tech Stack

### Frontend

- **HTML5** - โครงสร้างหน้าเว็บ
- **CSS3** - การตกแต่งและ Animations
- **Bootstrap 5.3.2** - Responsive Framework
- **JavaScript (ES6+)** - Application Logic
- **jQuery 3.7.1** - DOM Manipulation
- **Chart.js 4.4.0** - Data Visualization
- **Date Range Picker** - Date Selection
- **Moment.js** - Date Formatting

### Backend

- **Python 3.8+**
- **FastAPI 0.104.1** - REST API Framework
- **Uvicorn** - ASGI Server
- **PyMongo 4.6.0** - MongoDB Driver
- **Pydantic** - Data Validation

### Database

- **MongoDB** - NoSQL Database
- **Server:** 172.16.1.31:27017

### Tools

- **VS Code** - Code Editor
- **GitHub Desktop** - Version Control
- **Git** - Source Control

---

## 📁 โครงสร้างโปรเจค

```
boothbenz/
│
├── frontend/                      # Frontend Application
│   ├── index.html                # Main HTML file
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css         # Main CSS file
│   │   ├── js/
│   │   │   ├── api.js            # API Handler
│   │   │   ├── charts.js         # Charts Configuration
│   │   │   └── main.js           # Main Application Logic
│   │   └── images/               # Images folder
│   │       ├── hero-showroom.jpg
│   │       ├── cctv-layout.jpg
│   │       ├── cameras/
│   │       └── cars/
│   │           ├── amg-sl43.jpg
│   │           ├── c350e.jpg
│   │           ├── glc220d.jpg
│   │           ├── gla200.jpg
│   │           └── e350e.jpg
│
├── backend/                       # Backend Application
│   ├── main.py                   # FastAPI Application
│   ├── requirements.txt          # Python Dependencies
│   ├── .env                      # Environment Variables
│   └── .env.example              # Environment Variables Template
│
├── docs/                          # Documentation
│   ├── systems-image.pdf         # Design Reference
│   ├── data_swagger.md           # API Documentation
│   └── Installation.md           # Installation Guide
│
├── ex_backend.py                  # Original Backend (for reference)
├── notes.md                       # Project Notes
├── .gitignore                     # Git ignore rules
└── README.md                      # This file
```

---

## 🚀 การติดตั้ง

### ข้อกำหนดเบื้องต้น

- Windows 11
- Python 3.8+
- MongoDB Server (172.16.1.31:27017)
- Web Browser (Chrome, Firefox, Edge)

### ขั้นตอนการติดตั้ง Backend (ถ้าต้องการรัน Local)

```bash
# 1. เข้าไปที่โฟลเดอร์ backend
cd backend

# 2. สร้าง Virtual Environment (แนะนำ)
python -m venv venv

# 3. เปิดใช้งาน Virtual Environment
# Windows
venv\Scripts\activate

# 4. ติดตั้ง Dependencies
pip install -r requirements.txt

# 5. แก้ไขไฟล์ .env (ถ้าจำเป็น)
# คัดลอกจาก .env.example แล้วปรับค่าต่างๆ

# 6. รัน Backend Server
python main.py

# หรือรันด้วย auto-reload
python main.py --reload
```

Backend จะรันที่: **http://localhost:8111**
- Swagger UI: **http://localhost:8111/benzEvents/api/docs**

### การใช้งาน Frontend

```bash
# 1. เข้าไปที่โฟลเดอร์ frontend
cd frontend

# 2. เปิดไฟล์ index.html ด้วย Web Browser
# หรือใช้ Live Server ใน VS Code
```

**หมายเหตุ:** ถ้า Backend อยู่ที่ Server อื่น (172.16.1.31:8111) ไม่ต้องรัน Backend Local เพียงเปิด `index.html` ในเบราว์เซอร์ได้เลย

---

## 📖 การใช้งาน

### 1. เปิด Dashboard

เปิดไฟล์ `frontend/index.html` ในเบราว์เซอร์

### 2. เลือกช่วงวันที่

คลิกที่ Date Range Picker เพื่อเลือกช่วงวันที่ที่ต้องการดูข้อมูล

### 3. เลือกฐานข้อมูล

ใช้ Dropdown เพื่อเลือกฐานข้อมูลที่ต้องการ (ถ้ามีมากกว่า 1 database)

### 4. ดูข้อมูลและกราฟ

- **KPI Cards** แสดงจำนวนลูกค้าทั้งหมด แยกเพศ
- **Charts** แสดงสถิติต่างๆ แบบ Interactive
- **Tables** แสดงข้อมูลแบบตาราง

### 5. เข้าสู่ระบบกล้อง CCTV

คลิกปุ่ม "Check" ที่ Camera Cards เพื่อเข้าสู่ระบบกล้อง

---

## 🔌 API Documentation

### Base URL

```
http://172.16.1.31:8111/benzEvents/api
```

### Endpoints

#### 1. Health Check

```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "mongo": "connected",
  "server": "172.16.1.31:27017"
}
```

#### 2. List Databases

```
GET /dbs
```

**Response:**
```json
{
  "count": 1,
  "databases": ["db_boothbenz"]
}
```

#### 3. List Collections

```
GET /collections?db=db_boothbenz
```

**Response:**
```json
{
  "db": "db_boothbenz",
  "count": 1,
  "collections": ["visitors"]
}
```

#### 4. Get Documents

```
GET /documents?db=db_boothbenz&col=visitors&skip=0&limit=100
```

**Parameters:**
- `db` (required): Database name
- `col` (required): Collection name
- `skip` (optional): Number of documents to skip (default: 0)
- `limit` (optional): Number of documents to return
- `sort_field` (optional): Field to sort by (default: "_id")
- `sort_dir` (optional): Sort direction: -1 (desc) or 1 (asc) (default: -1)

**Response:**
```json
{
  "db": "db_boothbenz",
  "collection": "visitors",
  "total": 1089,
  "count": 100,
  "skip": 0,
  "limit": 100,
  "docs": [...]
}
```

#### 5. Update Document Type

```
PATCH /doc/{doc_id}/type?db=db_boothbenz&col=visitors
```

**Body:**
```json
{
  "type": "new_type_value"
}
```

---

## 📷 Screenshots

*(เพิ่มรูป screenshots ของ Dashboard ที่นี่)*

---

## 🐛 Troubleshooting

### ปัญหา: ไม่สามารถเชื่อมต่อ API ได้

**วิธีแก้:**
1. ตรวจสอบว่า Backend Server รันอยู่หรือไม่
2. ตรวจสอบ URL ใน `frontend/assets/js/api.js`
3. ตรวจสอบ Network Connection
4. ตรวจสอบ CORS Settings

### ปัญหา: Charts ไม่แสดงผล

**วิธีแก้:**
1. เปิด Browser Console (F12) ดู Error
2. ตรวจสอบว่า Chart.js โหลดสำเร็จหรือไม่
3. ตรวจสอบข้อมูลจาก API
4. Refresh หน้าเว็บ (Ctrl + F5)

### ปัญหา: รูปภาพไม่แสดงผล

**วิธีแก้:**
1. ตรวจสอบว่าไฟล์รูปอยู่ใน `frontend/assets/images/` หรือไม่
2. ตรวจสอบชื่อไฟล์ให้ตรงกับที่ระบุใน HTML
3. ระบบจะใช้ Placeholder Image อัตโนมัติถ้าไม่พบรูป

### ปัญหา: Date Range Picker ไม่ทำงาน

**วิธีแก้:**
1. ตรวจสอบว่า jQuery โหลดสำเร็จหรือไม่
2. ตรวจสอบว่า Moment.js โหลดสำเร็จหรือไม่
3. ตรวจสอบว่า Date Range Picker library โหลดสำเร็จหรือไม่

---

## 📝 License

© 2025 Thonburi Phanich. All rights reserved.

Powered by **Pinit IT**

---

## 👥 Credits

- **Developer:** AI Developer Assistant
- **Design Reference:** systems-image.pdf
- **Backend:** FastAPI + MongoDB
- **Frontend:** Bootstrap + Chart.js
- **Client:** Thonburi Phanich

---

## 📞 Support

หากมีปัญหาหรือข้อสงสัย กรุณาติดต่อทีมพัฒนา

---

**Version:** 1.0.0
**Last Updated:** 2026-01-22
