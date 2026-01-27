window.APP_CONFIG = {
  // IP Server ปัจจุบัน (แก้ไขที่นี่ที่เดียว)
  BASE_URL: "http://192.168.1.91:8111",

  // การตั้งค่าอื่นๆ
  API_PREFIX: "/benzEvents/api",
  TIMEOUT: 30000,

  // ข้อมูลเวอร์ชัน
  VERSION: "2.5.0",
  DEVELOPER: "Thonburi Phanich Dev Team",

  // Link สำหรับปุ่ม Home
  HOME_URL: "https://www.google.com",
};

console.log("⚙️ Configuration Loaded: ", window.APP_CONFIG.BASE_URL);

// Auto-apply Home Link to #btnHome on any page
document.addEventListener("DOMContentLoaded", () => {
  const btnHome = document.getElementById("btnHome");
  if (btnHome && window.APP_CONFIG && window.APP_CONFIG.HOME_URL) {
    btnHome.href = window.APP_CONFIG.HOME_URL;
    console.log("🏠 Home Link Applied:", btnHome.href);
  }
});
