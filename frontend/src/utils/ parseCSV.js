export function parseCSV(csvText) {
  const rows = csvText.trim().split("\n").map(r => r.split(","));
  const headers = rows[0].map(h => h.trim());
  const data = rows.slice(1).map(r => {
    let obj = {};
    headers.forEach((h, i) => {
      obj[h] = r[i] ? r[i].trim() : "";
    });
    return obj;
  });
  return data;
}
