/**
 * ==========================================================================
 * Charts Configuration - Thonburi Phanich Dashboard
 * Version: 1.0.0
 * Description: จัดการการสร้างและอัพเดท Charts ทั้งหมด
 * ==========================================================================
 */

// Chart Instances Storage
const chartInstances = {};

// Chart Colors Palette
const CHART_COLORS = {
  blue: "#0d6efd", // Bootstrap Primary Blue
  red: "#FF6384",
  cyan: "#36A2EB",
  yellow: "#FFCE56",
  green: "#4BC0C0",
  purple: "#9966FF",
  orange: "#FF9F40",
  gray: "#C9CBCF",
  pink: "#FFB6C1",
  brown: "#795548",
};

// Default Chart Configuration
const defaultChartConfig = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "top",
      labels: {
        font: {
          size: 14,
          family: "'Prompt', 'Sarabun', sans-serif",
        },
        padding: 15,
        usePointStyle: true,
      },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      titleFont: {
        size: 14,
        family: "'Prompt', 'Sarabun', sans-serif",
      },
      bodyFont: {
        size: 13,
        family: "'Prompt', 'Sarabun', sans-serif",
      },
      padding: 12,
      cornerRadius: 8,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          size: 12,
          family: "'Prompt', 'Sarabun', sans-serif",
        },
      },
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
    },
    x: {
      ticks: {
        font: {
          size: 12,
          family: "'Prompt', 'Sarabun', sans-serif",
        },
      },
      grid: {
        display: false,
      },
    },
  },
};

/**
 * ==========================================================================
 * Helper Functions
 * ==========================================================================
 */

/**
 * Destroy existing chart instance
 */
function destroyChart(chartId) {
  if (chartInstances[chartId]) {
    chartInstances[chartId].destroy();
    delete chartInstances[chartId];
  }
}

function getColorByIndex(index) {
  const colors = Object.values(CHART_COLORS);
  return colors[index % colors.length];
}

/**
 * Resolve Zone Label and Color from config
 * @param {string} zoneKey - "zone_1", "1", "Zone 1" etc.
 * @param {Object} config - Web config object
 * @param {number} defaultIndex - Fallback color index
 */
function resolveZoneInfo(zoneKey, config, defaultIndex) {
  let label = zoneKey;
  let color = getColorByIndex(defaultIndex);

  if (config) {
    // Find index i (1-8)
    let i = null;
    const match = String(zoneKey).match(/(\d+)/);
    if (match) {
      i = match[1];
    } else {
      // Try mapping by name
      for (let j = 1; j <= 8; j++) {
        if (
          config[`zone_${j}`] === zoneKey ||
          config[`detail_car${j}`] === zoneKey
        ) {
          i = j;
          break;
        }
      }
    }

    if (i && i >= 1 && i <= 8) {
      const zoneName = config[`zone_${i}`] || `Zone ${i}`;
      const carModel = config[`detail_car${i}`];

      // Format: "Zone 1: C350"
      label = carModel ? `${zoneName}: ${carModel}` : zoneName;
      color = config[`color_${i}`] || color;
    }
  }

  return { label, color };
}

/**
 * ==========================================================================
 * Chart Creation Functions
 * ==========================================================================
 */

/**
 * ROW 8: Zone Interest Bar Chart
 * แสดงกราฟแท่งแนวตั้ง จำนวนลูกค้าแต่ละโซน (รุ่นรถ)
 */
function createZoneInterestChart(zoneData, config = null) {
  const chartId = "zoneInterestChart";
  destroyChart(chartId);

  const ctx = document.getElementById(chartId);
  if (!ctx) {
    console.error(`Canvas element #${chartId} not found`);
    return null;
  }

  // Get raw labels (e.g., "zone_1", "zone_2" or actual names)
  const rawLabels = Object.keys(zoneData);

  // Map labels and colors if config is provided
  const mappedData = rawLabels.map((zoneKey, index) => {
    const info = resolveZoneInfo(zoneKey, config, index);

    return {
      label: info.label,
      value: zoneData[zoneKey],
      color: info.color,
    };
  });

  const labels = mappedData.map((d) => d.label);
  const data = mappedData.map((d) => d.value);
  const colors = mappedData.map((d) => d.color);

  chartInstances[chartId] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "จำนวนลูกค้า",
          data: data,
          backgroundColor: colors,
          borderColor: colors.map((color) => {
            if (color.startsWith("#")) {
              return color; // Hex colors are fine as is or can be lightened
            }
            return color.replace(")", ", 0.8)").replace("rgb", "rgba");
          }),
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    },
    options: {
      ...defaultChartConfig,
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          const zoneKey = rawLabels[index]; // e.g., "1", "2" or "zone_1"
          const label = labels[index]; // e.g., "Zone 1: C350"

          if (typeof window.showZoneDetails === "function") {
            window.showZoneDetails(zoneKey, label);
          }
        }
      },
      plugins: {
        ...defaultChartConfig.plugins,
        legend: {
          display: false, // Hide the legend
        },
        title: {
          display: false,
        },
        tooltip: {
          ...defaultChartConfig.plugins.tooltip,
          callbacks: {
            label: function (context) {
              return `จำนวน: ${context.parsed.y.toLocaleString()} คน`;
            },
          },
        },
      },
      scales: {
        ...defaultChartConfig.scales,
        y: {
          ...defaultChartConfig.scales.y,
          title: {
            display: true,
            text: "จำนวนลูกค้า (คน)",
            font: {
              size: 13,
              weight: "bold",
            },
          },
        },
        x: {
          ...defaultChartConfig.scales.x,
          title: {
            display: true,
            text: "รุ่นรถ",
            font: {
              size: 13,
              weight: "bold",
            },
          },
        },
      },
    },
  });

  return chartInstances[chartId];
}

/**
 * ROW 9: Hourly Traffic Bar Chart
 * แสดงกราฟแท่งแนวตั้ง จำนวนลูกค้าแต่ละช่วงเวลา
 */
function createHourlyTrafficChart(hourData) {
  const chartId = "hourlyTrafficChart";
  destroyChart(chartId);

  const ctx = document.getElementById(chartId);
  if (!ctx) {
    console.error(`Canvas element #${chartId} not found`);
    return null;
  }

  const labels = Object.keys(hourData).sort(
    (a, b) => parseInt(a) - parseInt(b),
  );
  const data = labels.map((label) => hourData[label]);

  chartInstances[chartId] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "จำนวนลูกค้า",
          data: data,
          backgroundColor: CHART_COLORS.blue,
          borderColor: CHART_COLORS.blue,
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    },
    options: {
      ...defaultChartConfig,
      plugins: {
        ...defaultChartConfig.plugins,
        title: {
          display: false,
        },
        tooltip: {
          ...defaultChartConfig.plugins.tooltip,
          callbacks: {
            label: function (context) {
              return `จำนวน: ${context.parsed.y.toLocaleString()} คน`;
            },
          },
        },
      },
      scales: {
        ...defaultChartConfig.scales,
        y: {
          ...defaultChartConfig.scales.y,
          title: {
            display: true,
            text: "จำนวนลูกค้า (คน)",
            font: {
              size: 13,
              weight: "bold",
            },
          },
        },
        x: {
          ...defaultChartConfig.scales.x,
          title: {
            display: true,
            text: "ช่วงเวลา",
            font: {
              size: 13,
              weight: "bold",
            },
          },
        },
      },
    },
  });

  return chartInstances[chartId];
}

/**
 * ROW 11: Dwell Time Bar Chart
 * แสดงกราฟแท่งแนวตั้ง จำนวนลูกค้าแยกตามระยะเวลา (นาที)
 */
function createDwellTimeChart(dwellData) {
  const chartId = "dwellTimeChart";
  destroyChart(chartId);

  const ctx = document.getElementById(chartId);
  if (!ctx) {
    console.error(`Canvas element #${chartId} not found`);
    return null;
  }

  // Sort labels numerically (extract number from "X นาที")
  const labels = Object.keys(dwellData).sort((a, b) => {
    const numA = parseInt(a) || 0;
    const numB = parseInt(b) || 0;
    return numA - numB;
  });
  const data = labels.map((label) => dwellData[label]);

  chartInstances[chartId] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels, // Labels already include "นาที" from groupByDwellTime
      datasets: [
        {
          label: "จำนวนลูกค้า",
          data: data,
          backgroundColor: CHART_COLORS.blue,
          borderColor: CHART_COLORS.blue,
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    },
    options: {
      ...defaultChartConfig,
      plugins: {
        ...defaultChartConfig.plugins,
        title: {
          display: false,
        },
        tooltip: {
          ...defaultChartConfig.plugins.tooltip,
          callbacks: {
            label: function (context) {
              return `จำนวน: ${context.parsed.y.toLocaleString()} คน`;
            },
          },
        },
      },
      scales: {
        ...defaultChartConfig.scales,
        y: {
          ...defaultChartConfig.scales.y,
          title: {
            display: true,
            text: "จำนวนลูกค้า (คน)",
            font: {
              size: 13,
              weight: "bold",
            },
          },
        },
        x: {
          ...defaultChartConfig.scales.x,
          title: {
            display: true,
            text: "ระยะเวลาในพื้นที่ (นาที)",
            font: {
              size: 13,
              weight: "bold",
            },
          },
        },
      },
    },
  });

  return chartInstances[chartId];
}

/**
 * ROW 13: Daily Traffic Bar Chart
 * แสดงกราฟแท่งแนวตั้ง จำนวนลูกค้าแต่ละวัน
 */
function createDailyTrafficChart(dateData) {
  const chartId = "dailyTrafficChart";
  destroyChart(chartId);

  const ctx = document.getElementById(chartId);
  if (!ctx) {
    console.error(`Canvas element #${chartId} not found`);
    return null;
  }

  const labels = Object.keys(dateData).sort();
  const data = labels.map((label) => dateData[label]);

  // Format dates for display (e.g., "2025-11-24" -> "24 พ.ย. 2025")
  const formattedLabels = labels.map((dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  });

  chartInstances[chartId] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: formattedLabels,
      datasets: [
        {
          label: "จำนวนลูกค้า",
          data: data,
          backgroundColor: CHART_COLORS.blue,
          borderColor: CHART_COLORS.blue,
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    },
    options: {
      ...defaultChartConfig,
      plugins: {
        ...defaultChartConfig.plugins,
        title: {
          display: false,
        },
        tooltip: {
          ...defaultChartConfig.plugins.tooltip,
          callbacks: {
            label: function (context) {
              return `จำนวน: ${context.parsed.y.toLocaleString()} คน`;
            },
          },
        },
      },
      scales: {
        ...defaultChartConfig.scales,
        y: {
          ...defaultChartConfig.scales.y,
          title: {
            display: true,
            text: "จำนวนลูกค้า (คน)",
            font: {
              size: 13,
              weight: "bold",
            },
          },
        },
        x: {
          ...defaultChartConfig.scales.x,
          title: {
            display: true,
            text: "วันที่",
            font: {
              size: 13,
              weight: "bold",
            },
          },
        },
      },
    },
  });

  return chartInstances[chartId];
}

/**
 * ROW 14: Daily Zone Breakdown Chart
 * แสดงกราฟแท่งแนวตั้ง จำนวนลูกค้าแยกตามวันและโซน (Stacked)
 */
function createDailyZoneChart(dateZoneData, config = null) {
  const chartId = "dailyZoneChart";
  destroyChart(chartId);

  const ctx = document.getElementById(chartId);
  if (!ctx) {
    console.error(`Canvas element #${chartId} not found`);
    return null;
  }

  // Get all dates and zones
  const dates = Object.keys(dateZoneData).sort();
  const allZones = new Set();
  dates.forEach((date) => {
    Object.keys(dateZoneData[date]).forEach((zone) => allZones.add(zone));
  });
  const zones = Array.from(allZones);

  // Format dates for display
  const formattedLabels = dates.map((dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
    });
  });

  // Create datasets for each zone
  const datasets = zones.map((zoneKey, index) => {
    const info = resolveZoneInfo(zoneKey, config, index);

    return {
      label: info.label,
      data: dates.map((date) => dateZoneData[date][zoneKey] || 0),
      backgroundColor: info.color,
      borderColor: info.color,
      borderWidth: 2,
    };
  });

  chartInstances[chartId] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: formattedLabels,
      datasets: datasets,
    },
    options: {
      ...defaultChartConfig,
      plugins: {
        ...defaultChartConfig.plugins,
        title: {
          display: false,
        },
        tooltip: {
          ...defaultChartConfig.plugins.tooltip,
          mode: "index",
          intersect: false,
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.parsed.y.toLocaleString()} คน`;
            },
          },
        },
      },
      scales: {
        ...defaultChartConfig.scales,
        y: {
          ...defaultChartConfig.scales.y,
          stacked: true,
          title: {
            display: true,
            text: "จำนวนลูกค้า (คน)",
            font: {
              size: 13,
              weight: "bold",
            },
          },
        },
        x: {
          ...defaultChartConfig.scales.x,
          stacked: true,
          title: {
            display: true,
            text: "วันที่",
            font: {
              size: 13,
              weight: "bold",
            },
          },
        },
      },
    },
  });

  return chartInstances[chartId];
}

/**
 * ==========================================================================
 * Table Helper Functions
 * ==========================================================================
 */

/**
 * Update Hourly Traffic Table (Row 9)
 */
function updateHourlyTrafficTable(hourData) {
  const tableBody = document.getElementById("hourlyTrafficTable");
  if (!tableBody) {
    console.error("Table element #hourlyTrafficTable not found");
    return;
  }

  // Sort by hour numerically
  const sortedHours = Object.keys(hourData).sort(
    (a, b) => parseInt(a) - parseInt(b),
  );

  // Create table rows
  const rows = sortedHours
    .map((hour, index) => {
      // Format hour as "10:00 น."
      const formattedHour = `${hour.padStart(2, "0")}:00 น.`;
      const count = hourData[hour];
      // Add blue color if count > 0
      const countStyle = count > 0 ? 'style="color: #0d6efd;"' : "";
      return `
        <tr>
            <td>${index + 1}</td>
            <td>${formattedHour}</td>
            <td><strong ${countStyle}>${count.toLocaleString()}</strong></td>
        </tr>
    `;
    })
    .join("");

  tableBody.innerHTML = rows;
}

/**
 * ==========================================================================
 * Export Chart Functions
 * ==========================================================================
 */

// Make functions available globally
window.Charts = {
  // Chart Creation
  createZoneInterestChart,
  createHourlyTrafficChart,
  createDwellTimeChart,
  createDailyTrafficChart,
  createDailyZoneChart,

  // Table Updates
  updateHourlyTrafficTable,

  // Helper Functions
  destroyChart,
  getColorByIndex,

  // Chart Instances (for debugging)
  instances: chartInstances,
  colors: CHART_COLORS,
};

console.log("✅ Charts Handler loaded successfully");
