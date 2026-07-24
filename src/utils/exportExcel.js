// src/utils/exportExcel.js
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { formatDisplayDate } from './dateUtils';

/**
 * Export entries array to an Excel file
 * @param {Array} entries
 */
export function exportToExcel(entries) {
  if (!entries || entries.length === 0) {
    throw new Error('No data to export');
  }

  const rows = entries.map((e) => ({
    Date: formatDisplayDate(e.date),
    Day: e.day || '',
    Meal: e.meal || '',
    'Main Course': e.mainCourse || '',
    'Raw Material (KG)': parseFloat(e.rawMaterial) || 0,
    'Cook Name': e.cookName || '',
    Strength: parseInt(e.strength) || 0,
    'Wastage (KG)': parseFloat(e.wastage) || 0,
    Remarks: e.remarks || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Auto column widths
  const colWidths = [
    { wch: 14 }, // Date
    { wch: 12 }, // Day
    { wch: 12 }, // Meal
    { wch: 28 }, // Main Course
    { wch: 18 }, // Raw Material
    { wch: 20 }, // Cook Name
    { wch: 10 }, // Strength
    { wch: 14 }, // Wastage
    { wch: 30 }, // Remarks
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Food Records');

  // Generate buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  saveAs(blob, 'Hostel_Food_Maintenance.xlsx');
}
