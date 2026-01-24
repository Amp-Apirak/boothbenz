# Thonburi Phanich Auto Showcase - Dashboard

![Version](https://img.shields.io/badge/version-2.5.0-blue.svg)
![Status](https://img.shields.io/badge/status-ready-green.svg)

Dashboard สำหรับแสดงข้อมูลลูกค้าและการวิเคราะห์พฤติกรรมในงานออกบูธรถยนต์ Mercedes-Benz (API Integration)

---

## 📋 สารบัญ

- [ภาพรวมโปรเจค](#ภาพรวมโปรเจค)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [โครงสร้างโปรเจค](#โครงสร้างโปรเจค)
- [การติดตั้งและการตั้งค่า](#การติดตั้งและการตั้งค่า)
- [API Documentation](#api-documentation)

---

## 🎯 ภาพรวมโปรเจค

โปรเจคนี้เป็น Dashboard แบบ Real-time สำหรับแสดงข้อมูลและวิเคราะห์พฤติกรรมลูกค้าในงานออกบูธรถยนต์ โดยดึงข้อมูลจาก MongoDB ผ่าน FastAPI Backend และแสดงผลด้วย Frontend ที่ออกแบบสวยงามและ Responsive

---

## ⚙️ การตั้งค่าระบบ (Config)

คุณสามารถเปลี่ยน IP ของ Backend Server ได้อย่างง่ายดายที่ไฟล์:
`frontend/assets/js/config.js`

```javascript
window.APP_CONFIG = {
  BASE_URL: "http://192.168.1.91:8111", // แก้ไขที่นี่
  // ...
};
```

---

## 🔌 API Documentation

### Base URL (ปัจจุบัน)

`http://192.168.1.91:8111/benzEvents/api`

### MongoDB Server

`192.168.1.91:27017`

---

## 👥 Credits

- **Developer:** AI Developer Assistant (Antigravity)
- **Client:** Thonburi Phanich Dev Team
