/**
 * ==========================================================================
 * API Handler - Thonburi Phanich Dashboard
 * Version: 1.2.0 (Performance Optimized)
 * Description: จัดการการเรียก API ทั้งหมด (รองรับ Config, PATCH และ Caching)
 * ==========================================================================
 */

// Cache Storage for Web Config (5-minute TTL)
const webConfigCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// API Configuration (โหลดมาจาก assets/js/config.js)
const API_CONFIG = {
  BASE_URL: window.APP_CONFIG
    ? window.APP_CONFIG.BASE_URL
    : "http://localhost:8111",
  API_PREFIX: window.APP_CONFIG
    ? window.APP_CONFIG.API_PREFIX
    : "/benzEvents/api",
  TIMEOUT: window.APP_CONFIG ? window.APP_CONFIG.TIMEOUT : 30000,
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
 * Get List of Collections
 * GET /benzEvents/api/BenzEventGetCollections?db={db}
 */
async function getCollections(dbName) {
  if (!dbName) return { success: false, error: "Database name is required" };

  try {
    const data = await apiFetch(`/BenzEventGetCollections?db=${dbName}`);
    return {
      success: true,
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
 * Get Documents with Pagination
 * GET /benzEvents/api/BenzEventGet
 */
async function getDocuments(params) {
  const {
    db,
    col,
    skip = 0,
    limit = 500,
    sort_field = "_id",
    sort_dir = -1,
  } = params;
  if (!db || !col) return { success: false, error: "DB and Col are required" };

  try {
    let url = `/BenzEventGet?db=${db}&col=${col}&skip=${skip}&sort_field=${sort_field}&sort_dir=${sort_dir}`;
    if (limit) url += `&limit=${limit}`;

    const data = await apiFetch(url);
    return {
      success: true,
      docs: data.docs || [],
      total: data.total || 0,
      db: data.db,
      collection: data.collection,
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
 * Get All Documents (Helper)
 */
async function getAllDocuments(db, col) {
  return await getDocuments({ db, col, limit: null });
}

/**
 * Update Event User Data (Multi-field)
 * รองรับการอัปเดตทั้ง Type, Gender และอื่นๆ
 * PATCH /benzEvents/api/BenzEventUpdate/{doc_id}/type?db={db}&col={col}
 * หมายเหตุ: ใช้ endpoint เดิมแต่ส่ง body ไปหลายฟิลด์
 */
async function updateEventUser(docId, updateData, db, col) {
  try {
    const url = `/BenzEventUpdate/${docId}/type?db=${db}&col=${col}`;
    const data = await apiFetch(url, {
      method: "PATCH",
      body: JSON.stringify(updateData),
    });
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
 * Update Document Type (Legacy/Simple support)
 */
async function updateDocumentType(docId, newType, db, col) {
  return await updateEventUser(docId, { type: newType }, db, col);
}

/**
 * Search Events by Time Range
 * GET /benzEvents/api/BenzEventSearch
 */
async function searchEvents(params) {
  const {
    db,
    collection,
    start,
    end,
    type,
    gender,
    emotion,
    zone,
    limit = 500,
    skip = 0,
    sort = -1,
  } = params;

  if (!db || !collection || !start || !end) {
    return {
      success: false,
      error: "Missing required search parameters (db, collection, start, end)",
    };
  }

  try {
    const queryParams = new URLSearchParams({
      db,
      collection,
      start,
      end,
      limit,
      skip,
      sort,
    });

    if (type && type !== "all") queryParams.append("type", type);
    if (gender && gender !== "all") queryParams.append("gender", gender);
    if (emotion && emotion !== "all") queryParams.append("emotion", emotion);
    if (zone && zone !== "all") queryParams.append("zone", parseInt(zone));

    const url = `/BenzEventSearch?${queryParams.toString()}`;
    const data = await apiFetch(url);
    return {
      success: true,
      docs: data.docs || [],
      total: data.total || 0,
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
 * ==========================================================================
 * Web Config Endpoints (Benz Info)
 * ==========================================================================
 */

/**
 * Get List of All Web Configs
 * GET /benzEvents/api/benzInfoGet
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
async function getWebConfig(databaseName, forceRefresh = false) {
  if (!databaseName) {
    return {
      success: false,
      error: "Database name is required",
      config: null,
    };
  }

  // Check cache first (unless force refresh)
  if (!forceRefresh) {
    const cached = webConfigCache.get(databaseName);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log("⚡ Using cached Web Config for:", databaseName);
      return {
        success: true,
        config: cached.data,
      };
    }
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
      // Store in cache
      webConfigCache.set(databaseName, {
        data: config,
        timestamp: Date.now(),
      });
      console.log("✅ Found Web Config for:", databaseName, "(cached)");
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
 * Update Web Config (Benz Info) - New from Swagger
 * แก้ไขข้อมูลเดิม (PATCH)
 */
async function patchWebConfig(id, formData) {
  if (!id) return { success: false, error: "ID is required" };

  try {
    const response = await fetch(getApiUrl(`/benzInfoUpdate/${id}`), {
      method: "PATCH",
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
    console.error("❌ Patch Web Config error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Create New Database Entry
 * POST /benzEvents/api/benzCreateDB
 * Content-Type: application/x-www-form-urlencoded
 */
async function createBenzDB(dbData) {
  try {
    const params = new URLSearchParams();
    for (const key in dbData) {
      params.append(key, dbData[key]);
    }

    const response = await fetch(getApiUrl("/benzCreateDB"), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
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
    console.error("❌ Create Benz DB error:", error);
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

function calculateKPIData(docs) {
  const total = docs.length;
  const male = docs.filter(
    (d) => (d.gender || "").toLowerCase() === "man",
  ).length;
  const female = docs.filter(
    (d) => (d.gender || "").toLowerCase() === "woman",
  ).length;

  return { total, male, female };
}

function groupByZone(docs) {
  const groups = {};
  docs.forEach((doc) => {
    const zone = doc.zone || "Unassigned";
    groups[zone] = (groups[zone] || 0) + 1;
  });
  return groups;
}

function groupByHour(docs) {
  const groups = {};
  for (let i = 0; i < 24; i++) groups[i] = 0;

  docs.forEach((doc) => {
    const hour = new Date(doc.timestamp || doc.date).getHours();
    if (!isNaN(hour)) groups[hour]++;
  });
  return groups;
}

function groupByDate(docs) {
  const groups = {};
  docs.forEach((doc) => {
    const date = new Date(doc.timestamp || doc.date).toLocaleDateString();
    groups[date] = (groups[date] || 0) + 1;
  });
  return groups;
}

function groupByDwellTime(docs) {
  const groups = {};

  docs.forEach((doc) => {
    let dwellMinutes = 0;

    // Primary: use time_obj (seconds) if available
    if (doc.time_obj) {
      dwellMinutes = Math.round(doc.time_obj / 60);
    } else if (doc.time && doc.time.start && doc.time.end) {
      // Fallback: calculate dwell time from time.start and time.end
      const startTime = new Date(doc.time.start);
      const endTime = new Date(doc.time.end);

      // Calculate difference in minutes
      const diffMs = endTime - startTime;
      dwellMinutes = Math.round(diffMs / 60000); // Convert ms to minutes
    }

    // Minimum 1 minute, maximum reasonable limit (cap at 60 min for display)
    dwellMinutes = Math.max(1, Math.min(dwellMinutes, 60));

    const key = `${dwellMinutes} นาที`;
    groups[key] = (groups[key] || 0) + 1;
  });

  return groups;
}

function groupByDateAndZone(docs) {
  const groups = {};
  docs.forEach((doc) => {
    const date = new Date(doc.timestamp || doc.date).toLocaleDateString();
    const zone = doc.zone || "Unassigned";
    if (!groups[date]) groups[date] = {};
    groups[date][zone] = (groups[date][zone] || 0) + 1;
  });
  return groups;
}

/**
 * Clear specific field in Benz Info
 * DELETE /benzEvents/api/benzInfoClearField/{id}/{field_name}
 */
async function clearBenzInfoField(id, fieldName) {
  if (!id || !fieldName) {
    return {
      success: false,
      error: "ID and field name are required",
    };
  }

  try {
    const url = getApiUrl(`/benzInfoClearField/${id}/${fieldName}`);
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
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
    console.error("❌ Clear Benz Info Field error:", error);
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

/**
 * Clear cache for specific database or all
 */
function clearWebConfigCache(databaseName = null) {
  if (databaseName) {
    webConfigCache.delete(databaseName);
    console.log("🗑️ Cleared cache for:", databaseName);
  } else {
    webConfigCache.clear();
    console.log("🗑️ Cleared all cache");
  }
}

window.API = {
  config: API_CONFIG,
  getApiUrl,
  checkHealth,
  getDatabases,
  getCollections,
  getDocuments,
  getAllDocuments,
  updateDocumentType,
  updateEventUser,
  searchEvents,
  getWebConfig,
  getAllWebConfigs,
  uploadWebConfig,
  patchWebConfig,
  deleteWebConfig,
  createBenzDB,
  clearBenzInfoField,
  clearWebConfigCache,
  calculateKPIData,
  groupByZone,
  groupByHour,
  groupByDate,
  groupByDwellTime,
  groupByDateAndZone,
};

console.log("✅ API Handler loaded successfully (Config & Patch Support)");
