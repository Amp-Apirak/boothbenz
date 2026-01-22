/**
 * ==========================================================================
 * API Handler - Thonburi Phanich Dashboard
 * Version: 1.0.0
 * Description: จัดการการเรียก API ทั้งหมด
 * ==========================================================================
 */

// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://172.16.1.31:8111',
    API_PREFIX: '/benzEvents/api',
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
                'Content-Type': 'application/json',
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

        if (error.name === 'AbortError') {
            throw new Error('Request timeout - กรุณาลองใหม่อีกครั้ง');
        }

        console.error('API Fetch Error:', error);
        throw error;
    }
}

/**
 * ==========================================================================
 * API Endpoints
 * ==========================================================================
 */

/**
 * Health Check
 * GET /benzEvents/api/health
 */
async function checkHealth() {
    try {
        const data = await apiFetch('/health');
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
 * GET /benzEvents/api/dbs
 */
async function getDatabases() {
    try {
        const data = await apiFetch('/dbs');
        return {
            success: true,
            databases: data.databases || [],
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
 * GET /benzEvents/api/collections?db={db_name}
 */
async function getCollections(dbName) {
    if (!dbName) {
        return {
            success: false,
            error: 'Database name is required',
            collections: [],
        };
    }

    try {
        const data = await apiFetch(`/collections?db=${encodeURIComponent(dbName)}`);
        return {
            success: true,
            db: data.db,
            collections: data.collections || [],
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
        sort_field = '_id',
        sort_dir = -1
    } = params;

    if (!db || !col) {
        return {
            success: false,
            error: 'Database and Collection names are required',
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
            queryParams.append('limit', limit.toString());
        }

        const data = await apiFetch(`/documents?${queryParams.toString()}`);
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
 * PATCH /benzEvents/api/doc/{doc_id}/type
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
            error: 'All parameters are required',
        };
    }

    try {
        const queryParams = new URLSearchParams({
            db: db,
            col: col,
        });

        const data = await apiFetch(
            `/doc/${encodeURIComponent(docId)}/type?${queryParams.toString()}`,
            {
                method: 'PATCH',
                body: JSON.stringify({ type: newType }),
            }
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
        sort_field: '_id',
        sort_dir: -1,
    });
}

/**
 * Calculate KPI Data (Total, Male, Female)
 */
function calculateKPIData(documents) {
    const total = documents.length;
    const male = documents.filter(doc =>
        doc.gender === 'male' || doc.gender === 'Male' || doc.gender === 'M'
    ).length;
    const female = documents.filter(doc =>
        doc.gender === 'female' || doc.gender === 'Female' || doc.gender === 'F'
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

    documents.forEach(doc => {
        const zone = doc.zone || doc.car_model || 'Unknown';
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

    documents.forEach(doc => {
        let hour = null;

        // Try different field names
        if (doc.hour !== undefined) {
            hour = doc.hour;
        } else if (doc.time) {
            // Parse time string (e.g., "14:30:00")
            hour = parseInt(doc.time.split(':')[0]);
        } else if (doc.timestamp) {
            // Parse ISO timestamp
            const date = new Date(doc.timestamp);
            hour = date.getHours();
        }

        if (hour !== null) {
            const hourRange = `${hour.toString().padStart(2, '0')}:00-${(hour + 1).toString().padStart(2, '0')}:00`;
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

    documents.forEach(doc => {
        let date = null;

        // Try different field names
        if (doc.date) {
            date = doc.date;
        } else if (doc.timestamp) {
            // Extract date from ISO timestamp
            date = doc.timestamp.split('T')[0];
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

    documents.forEach(doc => {
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

    documents.forEach(doc => {
        let date = null;
        const zone = doc.zone || doc.car_model || 'Unknown';

        // Try different field names
        if (doc.date) {
            date = doc.date;
        } else if (doc.timestamp) {
            date = doc.timestamp.split('T')[0];
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

    // Data Processing
    calculateKPIData,
    groupByZone,
    groupByHour,
    groupByDate,
    groupByDwellTime,
    groupByDateAndZone,
};

console.log('✅ API Handler loaded successfully');
