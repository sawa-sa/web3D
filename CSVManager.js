import * as THREE from "three";

async function loadCSVData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load CSV file: ${response.statusText}`);
    const text = await response.text();
    const rows = text.split("\n").slice(1);

    const data = rows.map((row) => {
      const cols = row.split(",");
      return cols.length >= 3
        ? { x: parseFloat(cols[0]), y: parseFloat(cols[1]), z: parseFloat(cols[2]) }
        : null;
    }).filter(Boolean);

    return data;
  } catch (error) {
    console.error("Error loading CSV data:", error);
    throw error;
  }
}

function normalizeData(data) {
  const { min, max } = calculateMinMax(data);
  return data.map((point) => ({
    x: (point.x - min.x) / (max.x - min.x),
    y: (point.y - min.y) / (max.y - min.y),
    z: (point.z - min.z) / (max.z - min.z)
  }));
}

function calculateMinMax(data) {
  const min = { x: Infinity, y: Infinity, z: Infinity };
  const max = { x: -Infinity, y: -Infinity, z: -Infinity };

  data.forEach((point) => {
    min.x = Math.min(min.x, point.x);
    min.y = Math.min(min.y, point.y);
    min.z = Math.min(min.z, point.z);
    max.x = Math.max(max.x, point.x);
    max.y = Math.max(max.y, point.y);
    max.z = Math.max(max.z, point.z);
  });

  return { min, max };
}

export { loadCSVData, normalizeData, calculateMinMax };
