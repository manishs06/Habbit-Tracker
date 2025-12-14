import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import ExcelData from '../models/ExcelData.model.js';
import File from '../models/File.model.js';

/**
 * Parse Excel file and extract data
 * @param {String} filePath - Path to the Excel file
 * @returns {Object} Parsed data with sheets and metadata
 */
export const parseExcelFile = (filePath) => {
  try {
    // Read the workbook
    const workbook = XLSX.readFile(filePath, { cellDates: true });
    
    const sheets = {};
    const sheetNames = workbook.SheetNames;
    
    // Process each sheet
    sheetNames.forEach(sheetName => {
      const worksheet = workbook.Sheets[sheetName];
      
      // Convert to JSON with header row
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
        raw: false
      });
      
      if (jsonData.length === 0) {
        sheets[sheetName] = {
          headers: [],
          rows: [],
          data: []
        };
        return;
      }
      
      // First row as headers
      const headers = jsonData[0].map(h => h || '');
      const rows = jsonData.slice(1);
      
      // Convert rows to objects
      const data = rows.map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });
      
      // Detect column types
      const columnTypes = detectColumnTypes(headers, rows);
      
      sheets[sheetName] = {
        headers,
        rows,
        data,
        columnTypes,
        rowCount: rows.length,
        columnCount: headers.length
      };
    });
    
    return {
      sheetNames,
      sheets,
      totalSheets: sheetNames.length
    };
  } catch (error) {
    throw new Error(`Failed to parse Excel file: ${error.message}`);
  }
};

/**
 * Detect data types for each column
 * @param {Array} headers - Column headers
 * @param {Array} rows - Data rows
 * @returns {Object} Column type mapping
 */
const detectColumnTypes = (headers, rows) => {
  const types = {};
  
  headers.forEach((header, colIndex) => {
    const columnValues = rows
      .map(row => row[colIndex])
      .filter(val => val !== '' && val !== null && val !== undefined);
    
    if (columnValues.length === 0) {
      types[header] = 'string';
      return;
    }
    
    // Check for numbers
    const allNumbers = columnValues.every(val => {
      const num = Number(val);
      return !isNaN(num) && isFinite(num);
    });
    
    if (allNumbers) {
      types[header] = 'number';
      return;
    }
    
    // Check for dates
    const allDates = columnValues.every(val => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    });
    
    if (allDates) {
      types[header] = 'date';
      return;
    }
    
    // Default to string
    types[header] = 'string';
  });
  
  return types;
};

/**
 * Save parsed Excel data to database
 * @param {String} fileId - File document ID
 * @param {Object} parsedData - Parsed Excel data
 * @param {String} userId - User ID who uploaded
 * @returns {Promise} Saved ExcelData documents
 */
export const saveExcelData = async (fileId, parsedData, userId) => {
  const savedData = [];
  
  for (const [sheetName, sheetData] of Object.entries(parsedData.sheets)) {
    const excelData = new ExcelData({
      fileId,
      sheetName,
      data: sheetData.data,
      headers: sheetData.headers,
      columnTypes: sheetData.columnTypes,
      rowCount: sheetData.rowCount,
      columnCount: sheetData.columnCount,
      modifiedBy: userId
    });
    
    await excelData.save();
    savedData.push(excelData);
  }
  
  // Update file metadata
  const totalRows = Object.values(parsedData.sheets).reduce(
    (sum, sheet) => sum + sheet.rowCount, 0
  );
  const totalColumns = Math.max(
    ...Object.values(parsedData.sheets).map(sheet => sheet.columnCount)
  );
  
  await File.findByIdAndUpdate(fileId, {
    sheetNames: parsedData.sheetNames,
    totalRows,
    totalColumns
  });
  
  return savedData;
};

/**
 * Export data back to Excel format
 * @param {Array} data - Array of objects
 * @param {Array} headers - Column headers
 * @param {String} sheetName - Sheet name
 * @returns {Buffer} Excel file buffer
 */
export const exportToExcel = (data, headers, sheetName = 'Sheet1') => {
  try {
    // Create workbook
    const workbook = XLSX.utils.book_new();
    
    // Prepare data array with headers
    const worksheetData = [headers];
    data.forEach(row => {
      const rowData = headers.map(header => row[header] || '');
      worksheetData.push(rowData);
    });
    
    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    return buffer;
  } catch (error) {
    throw new Error(`Failed to export Excel: ${error.message}`);
  }
};

