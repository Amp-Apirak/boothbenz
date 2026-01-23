/**
 * ==========================================================================
 * API Handler - Thonburi Phanich Dashboard
 * Version: 1.0.0
 * Description: จัดการการเรียก API ทั้งหมด
 * ==========================================================================
 */

// API Configuration
const API_CONFIG = {
  BASE_URL: "http://172.16.1.31:8111",
  API_PREFIX: "/benzEvents/api",
  TIMEOUT: 30000, // 30 seconds
};

// สร้าง Full API URL
const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}${endpoint}`;
};

/**
 * ==========================================================================
 * API Helper Functions
 * ==========================================================================
 */

/**
 * Generic Fetch Wrapper with Error Handling
 */
async function apiFetch(endpoint, options = {}) {
  const url = getApiUrl(endpoint);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new Error("Request timeout - กรุณาลองใหม่อีกครั้ง");
    }

    console.error("API Fetch Error:", error);
    throw error;
  }
}

/**
 * ==========================================================================
 * API Endpoints
 * ==========================================================================
 */

/**
 * Health Check MongoDB
 * GET /benzEvents/api/BenzEventMongo
 */
async function checkHealth() {
  try {
    const data = await apiFetch("/BenzEventMongo");
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Get List of Databases
 * GET /benzEvents/api/BenzEventGetDB
 */
async function getDatabases() {
  try {
    const data = await apiFetch("/BenzEventGetDB");
    return {
      success: true,
      databases: data.databases || data || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      databases: [],
    };
  }
}

/**
 * Get Collections in a Database
 * GET /benzEvents/api/BenzEventGetCollections?db={db_name}
 */
async function getCollections(dbName) {
  if (!dbName) {
    return {
      success: false,
      error: "Database name is required",
      collections: [],
    };
  }

  try {
    const data = await apiFetch(
      `/BenzEventGetCollections?db=${encodeURIComponent(dbName)}`,
    );
    return {
      success: true,
      db: data.db,
      collections: data.collections || data || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      collections: [],
    };
  }
}

/**
 * Get Documents from a Collection
 * GET /benzEvents/api/documents
 *
 * @param {Object} params - Query parameters
 * @param {string} params.db - Database name (required)
 * @param {string} params.col - Collection name (required)
 * @param {number} params.skip - Number of documents to skip (default: 0)
 * @param {number} params.limit - Number of documents to return (optional)
 * @param {string} params.sort_field - Field to sort by (default: "_id")
 * @param {number} params.sort_dir - Sort direction: -1 (desc) or 1 (asc) (default: -1)
 */
async function getDocuments(params) {
  const {
    db,
    col,
    skip = 0,
    limit = null,
    sort_field = "_id",
    sort_dir = -1,
  } = params;

  if (!db || !col) {
    return {
      success: false,
      error: "Database and Collection names are required",
      docs: [],
    };
  }

  try {
    const queryParams = new URLSearchParams({
      db: db,
      col: col,
      skip: skip.toString(),
      sort_field: sort_field,
      sort_dir: sort_dir.toString(),
    });

    if (limit !== null) {
      queryParams.append("limit", limit.toString());
    }

    const data = await apiFetch(`/BenzEventGet?${queryParams.toString()}`);
    return {
      success: true,
      db: data.db,
      collection: data.collection,
      total: data.total || 0,
      count: data.count || 0,
      skip: data.skip || 0,
      limit: data.limit,
      docs: data.docs || [],
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      docs: [],
    };
  }
}

/**
 * Update Document Type
 * PATCH /benzEvents/api/BenzEventUpdate/{doc_id}/type
 *
 * @param {string} docId - Document ID
 * @param {string} newType - New type value
 * @param {string} db - Database name
 * @param {string} col - Collection name
 */
async function updateDocumentType(docId, newType, db, col) {
  if (!docId || !newType || !db || !col) {
    return {
      success: false,
      error: "All parameters are required",
    };
  }

  try {
    const queryParams = new URLSearchParams({
      db: db,
      col: col,
    });

    const data = await apiFetch(
      `/BenzEventUpdate/${encodeURIComponent(docId)}/type?${queryParams.toString()}`,
      {
        method: "PATCH",
        body: JSON.stringify({ type: newType }),
      },
    );

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * ==========================================================================
 * Data Processing Functions
 * ==========================================================================
 */

/**
 * Get All Documents from a Collection (without limit)
 */
async function getAllDocuments(db, col) {
  return await getDocuments({
    db: db,
    col: col,
    skip: 0,
    limit: null, // No limit - get all documents
    sort_field: "_id",
    sort_dir: -1,
  });
}

/**
 * Calculate KPI Data (Total, Male, Female)
 */
function calculateKPIData(documents) {
  const total = documents.length;
  const male = documents.filter(
    (doc) =>
      doc.gender === "male" || doc.gender === "Male" || doc.gender === "M",
  ).length;
  const female = documents.filter(
    (doc) =>
      doc.gender === "female" || doc.gender === "Female" || doc.gender === "F",
  ).length;

  return {
    total,
    male,
    female,
    unknown: total - male - female,
  };
}

/**
 * Group Documents by Zone (Car Model)
 */
function groupByZone(documents) {
  const zoneMap = {};

  documents.forEach((doc) => {
    const zone = doc.zone || doc.car_model || "Unknown";
    if (!zoneMap[zone]) {
      zoneMap[zone] = 0;
    }
    zoneMap[zone]++;
  });

  return zoneMap;
}

/**
 * Group Documents by Hour
 */
function groupByHour(documents) {
  const hourMap = {};

  documents.forEach((doc) => {
    let hour = null;

    // Try different field names
    if (doc.hour !== undefined) {
      hour = doc.hour;
    } else if (doc.time) {
      // Parse time string (e.g., "14:30:00")
      hour = parseInt(doc.time.split(":")[0]);
    } else if (doc.timestamp) {
      // Parse ISO timestamp
      const date = new Date(doc.timestamp);
      hour = date.getHours();
    }

    if (hour !== null) {
      const hourRange = `${hour.toString().padStart(2, "0")}:00-${(hour + 1).toString().padStart(2, "0")}:00`;
      if (!hourMap[hourRange]) {
        hourMap[hourRange] = 0;
      }
      hourMap[hourRange]++;
    }
  });

  return hourMap;
}

/**
 * Group Documents by Date
 */
function groupByDate(documents) {
  const dateMap = {};

  documents.forEach((doc) => {
    let date = null;

    // Try different field names
    if (doc.date) {
      date = doc.date;
    } else if (doc.timestamp) {
      // Extract date from ISO timestamp
      date = doc.timestamp.split("T")[0];
    }

    if (date) {
      if (!dateMap[date]) {
        dateMap[date] = 0;
      }
      dateMap[date]++;
    }
  });

  return dateMap;
}

/**
 * Group Documents by Dwell Time (minutes)
 */
function groupByDwellTime(documents) {
  const dwellMap = {};

  documents.forEach((doc) => {
    const dwellTime = doc.dwell_time || doc.dwellTime || 0;
    if (dwellTime > 0) {
      if (!dwellMap[dwellTime]) {
        dwellMap[dwellTime] = 0;
      }
      dwellMap[dwellTime]++;
    }
  });

  return dwellMap;
}

/**
 * Group Documents by Date and Zone
 */
function groupByDateAndZone(documents) {
  const dateZoneMap = {};

  documents.forEach((doc) => {
    let date = null;
    const zone = doc.zone || doc.car_model || "Unknown";

    // Try different field names
    if (doc.date) {
      date = doc.date;
    } else if (doc.timestamp) {
      date = doc.timestamp.split("T")[0];
    }

    if (date) {
      if (!dateZoneMap[date]) {
        dateZoneMap[date] = {};
      }
      if (!dateZoneMap[date][zone]) {
        dateZoneMap[date][zone] = 0;
      }
      dateZoneMap[date][zone]++;
    }
  });

  return dateZoneMap;
}

/**
 * ==========================================================================
 * Web Config API (โครงสร้างเว็บ) - Benz Info Endpoints
 * ==========================================================================
 */

/**
 * Get All Web Configs (Benz Info)
 * ดึงข้อมูล web config ทั้งหมดจาก /benzInfoGet
 *
 * @param {Object} options - ตัวเลือกสำหรับ query
 * @returns {Object} List of all web configurations
 *
 * Endpoint: GET /benzEvents/api/benzInfoGet
 */
async function getAllWebConfigs(options = {}) {
  const { skip = 0, limit = null, sort_field = "_id", sort_dir = -1 } = options;

  try {
    let url = `/benzInfoGet?skip=${skip}&sort_field=${sort_field}&sort_dir=${sort_dir}`;
    if (limit) {
      url += `&limit=${limit}`;
    }

    const data = await apiFetch(url);
    return {
      success: true,
      configs: data.docs || data || [],
      total: data.total || (data.docs ? data.docs.length : 0),
    };
  } catch (error) {
    console.warn("⚠️ Benz Info API not available:", error.message);
    return {
      success: false,
      error: error.message,
      configs: [],
    };
  }
}

/**
 * Get Web Configuration by Database Name
 * ดึงข้อมูลโครงสร้างเว็บตาม database_name ที่เลือก
 *
 * @param {string} databaseName - ชื่อฐานข้อมูลที่ต้องการดึง config
 * @returns {Object} Web configuration data
 *
 * วิธีการ: ดึงทั้งหมดจาก /benzInfoGet แล้ว filter ตาม database_name
 */
async function getWebConfig(databaseName) {
  if (!databaseName) {
    return {
      success: false,
      error: "Database name is required",
      config: null,
    };
  }

  try {
    // ดึงข้อมูลทั้งหมดจาก benzInfoGet
    const result = await getAllWebConfigs();

    if (!result.success) {
      return {
        success: false,
        error: result.error,
        config: null,
      };
    }

    // หา config ที่ตรงกับ database_name
    const config = result.configs.find((c) => c.database_name === databaseName);

    if (config) {
      console.log("✅ Found Web Config for:", databaseName);
      return {
        success: true,
        config: config,
      };
    } else {
      console.warn(`⚠️ No Web Config found for: ${databaseName}`);
      return {
        success: false,
        error: `No config found for database: ${databaseName}`,
        config: null,
      };
    }
  } catch (error) {
    console.warn("⚠️ Web Config API error:", error.message);
    return {
      success: false,
      error: error.message,
      config: null,
    };
  }
}

/**
 * Delete Web Config by ID
 * ลบ web config ตาม ID
 *
 * @param {string} id - ID ของ config ที่ต้องการลบ
 * @returns {Object} Result
 *
 * Endpoint: DELETE /benzEvents/api/benzInfoDelete/{id}
 */
async function deleteWebConfig(id) {
  if (!id) {
    return {
      success: false,
      error: "ID is required",
    };
  }

  try {
    const url = getApiUrl(`/benzInfoDelete/${id}`);
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("❌ Delete Web Config error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Upload Web Config (Benz Info)
 * อัปโหลดข้อมูล web config ใหม่ (รวมถึงไฟล์ภาพ)
 *
 * @param {FormData} formData - ข้อมูลที่ต้องการอัปโหลด
 * @returns {Object} Result
 *
 * Endpoint: POST /benzEvents/api/benzInfoUpload
 */
async function uploadWebConfig(formData) {
  try {
    const response = await fetch(getApiUrl("/benzInfoUpload"), {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("❌ Upload Web Config error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * ==========================================================================
 * Export API Functions
 * ==========================================================================
 */

// Make functions available globally
window.API = {
  // Configuration
  config: API_CONFIG,
  getApiUrl,

  // Basic Endpoints
  checkHealth,
  getDatabases,
  getCollections,
  getDocuments,
  getAllDocuments,
  updateDocumentType,

  // Web Config Endpoints (Benz Info)
  getWebConfig,
  getAllWebConfigs,
  uploadWebConfig,
  deleteWebConfig,

  // Data Processing
  calculateKPIData,
  groupByZone,
  groupByHour,
  groupByDate,
  groupByDwellTime,
  groupByDateAndZone,
};

console.log("✅ API Handler loaded successfully");
