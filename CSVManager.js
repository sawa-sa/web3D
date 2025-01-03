import * as THREE from "three";

async function loadCSVData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load CSV file: ${response.statusText}`);
    const text = await response.text();
    const rows = text.split("\n").slice(1);

    const data = rows.map((row) => {
      const cols = row.split(",");
      if (cols.length >= 3) {
        const point = {
          x: parseFloat(cols[0]),
          y: parseFloat(cols[1]),
          z: parseFloat(cols[2])
        };
        if (cols.length >= 4) {
          point.size = parseFloat(cols[3]);
        }
        if (cols.length >= 5) {
          const colorCode = cols[4].trim();
          point.color = /^0x[0-9A-Fa-f]{6}$/i.test(colorCode) ? parseInt(colorCode, 16) : 0xffff00;
        } else {
          point.color = 0xffff00;
        }
        return point;
      }
      return null;
    }).filter(Boolean);

    return data;
  } catch (error) {
    console.error("Error loading CSV data:", error);
    throw error;
  }
}

function normalizeData(data) {
  const minMax = calculateMinMax(data);
  return data.map(point => ({
    x: (minMax.max.x - minMax.min.x === 0) 
      ? 0.5 
      : (point.x - minMax.min.x) / (minMax.max.x - minMax.min.x),
    y: (minMax.max.y - minMax.min.y === 0) 
      ? 0.5 
      : (point.y - minMax.min.y) / (minMax.max.y - minMax.min.y),
    z: (minMax.max.z - minMax.min.z === 0) 
      ? 0.5 
      : (point.z - minMax.min.z) / (minMax.max.z - minMax.min.z),
    size: (point.size !== undefined )
      ? point.size
      : undefined,
    color: point.color
  }));
}

function calculateMinMax(data) {
  let min = { x: Infinity, y: Infinity, z: Infinity, size: Infinity };
  let max = { x: -Infinity, y: -Infinity, z: -Infinity, size: -Infinity };

  data.forEach((point) => {
    min.x = Math.min(min.x, point.x);
    min.y = Math.min(min.y, point.y);
    min.z = Math.min(min.z, point.z);
    if (point.size !== undefined) {
      min.size = Math.min(min.size, point.size);
      max.size = Math.max(max.size, point.size);
    }

    max.x = Math.max(max.x, point.x);
    max.y = Math.max(max.y, point.y);
    max.z = Math.max(max.z, point.z);
  });

  return { min, max };
}

export { loadCSVData, normalizeData, calculateMinMax };
