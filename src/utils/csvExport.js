// src/utils/csvExport.js

/**
 * Exports data to a CSV file and triggers a browser download.
 * @param {Array<Object>} data The array of objects to export
 * @param {Array<string>} headers The columns to export (corresponds to object keys)
 * @param {Array<string>} headerLabels The column labels to show in the first row
 * @param {string} filename The name of the downloaded file (e.g., 'applicants.csv')
 */
export function exportToCSV(data, headers, headerLabels, filename = "export.csv") {
  if (!data || !data.length) return;

  const escapeCell = (val) => {
    if (val === null || val === undefined) return "";
    let str = String(val);
    // Replace double quotes with two double quotes
    str = str.replace(/"/g, '""');
    // If the cell contains commas, newlines or quotes, wrap it in double quotes
    if (str.includes(",") || str.includes("\n") || str.includes('"')) {
      str = `"${str}"`;
    }
    return str;
  };

  const csvRows = [];
  
  // Add header row
  csvRows.push(headerLabels.map(escapeCell).join(","));

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      // Handle nested values if header contains '.' (e.g., 'skills.technical')
      if (header.includes(".")) {
        const parts = header.split(".");
        let current = row;
        for (const part of parts) {
          current = current ? current[part] : "";
        }
        return current;
      }
      return row[header];
    });
    csvRows.push(values.map(escapeCell).join(","));
  }

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
