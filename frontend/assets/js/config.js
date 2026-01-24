/**
 * Application Configuration - Thonburi Phanich Dashboard
 * Version: 1.0.0
 * Description: รวมค่าคงที่และการตั้งค่าระบบ (ใช้แทน .env)
 */

window.APP_CONFIG = {
  // IP Server ปัจจุบัน (แก้ไขที่นี่ที่เดียว)
  BASE_URL: "http://192.168.1.91:8111",

  // การตั้งค่าอื่นๆ
  API_PREFIX: "/benzEvents/api",
  TIMEOUT: 30000,

  // ข้อมูลเวอร์ชัน
  VERSION: "2.5.0",
  DEVELOPER: "Thonburi Phanich Dev Team",
};

console.log("⚙️ Configuration Loaded: ", window.APP_CONFIG.BASE_URL);
