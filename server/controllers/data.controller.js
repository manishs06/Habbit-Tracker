import ExcelData from '../models/ExcelData.model.js';
import File from '../models/File.model.js';
import { exportToExcel } from '../services/excel.service.js';
import AuditLog from '../models/AuditLog.model.js';

/**
 * @route   GET /api/data/file/:fileId
 * @desc    Get all sheets data for a file
 * @access  Private
 */
export const getFileData = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const userId = req.user.id;

    // Verify file ownership
    const file = await File.findOne({
      _id: fileId,
      uploadedBy: userId,
      isActive: true
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Get all sheets data
    const sheetsData = await ExcelData.find({ fileId });

    const data = sheetsData.map(sheet => ({
      sheetName: sheet.sheetName,
      headers: sheet.headers,
      rowCount: sheet.rowCount,
      columnCount: sheet.columnCount,
      columnTypes: Object.fromEntries(sheet.columnTypes)
    }));

    res.json({
      success: true,
      data: {
        fileId,
        sheets: data
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/data/file/:fileId/sheet/:sheetName
 * @desc    Get data for a specific sheet with pagination
 * @access  Private
 */
export const getSheetData = async (req, res, next) => {
  try {
    const { fileId, sheetName } = req.params;
    const { page = 1, limit = 100, search = '', sortBy = '', sortOrder = 'asc' } = req.query;
    const userId = req.user.id;

    // Verify file ownership
    const file = await File.findOne({
      _id: fileId,
      uploadedBy: userId,
      isActive: true
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Get sheet data
    const sheetData = await ExcelData.findOne({
      fileId,
      sheetName
    });

    if (!sheetData) {
      return res.status(404).json({
        success: false,
        message: 'Sheet not found'
      });
    }

    let data = [...sheetData.data];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      data = data.filter(row => {
        return Object.values(row).some(val =>
          String(val).toLowerCase().includes(searchLower)
        );
      });
    }

    // Sorting
    if (sortBy && sheetData.headers.includes(sortBy)) {
      data.sort((a, b) => {
        const aVal = a[sortBy] || '';
        const bVal = b[sortBy] || '';
        
        if (sortOrder === 'desc') {
          return String(bVal).localeCompare(String(aVal));
        }
        return String(aVal).localeCompare(String(bVal));
      });
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedData = data.slice(skip, skip + parseInt(limit));

    // Log audit
    await AuditLog.create({
      userId,
      action: 'view',
      resourceType: 'data',
      resourceId: fileId,
      details: { sheetName },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      data: {
        sheetName,
        headers: sheetData.headers,
        columnTypes: Object.fromEntries(sheetData.columnTypes),
        data: paginatedData,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: data.length,
          pages: Math.ceil(data.length / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/data/file/:fileId/sheet/:sheetName
 * @desc    Update cell data
 * @access  Private
 */
export const updateCellData = async (req, res, next) => {
  try {
    const { fileId, sheetName } = req.params;
    const { rowIndex, column, value } = req.body;
    const userId = req.user.id;

    // Verify file ownership
    const file = await File.findOne({
      _id: fileId,
      uploadedBy: userId,
      isActive: true
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Get sheet data
    const sheetData = await ExcelData.findOne({
      fileId,
      sheetName
    });

    if (!sheetData) {
      return res.status(404).json({
        success: false,
        message: 'Sheet not found'
      });
    }

    // Update cell
    if (rowIndex >= 0 && rowIndex < sheetData.data.length) {
      sheetData.data[rowIndex][column] = value;
      sheetData.lastModified = new Date();
      sheetData.modifiedBy = userId;
      await sheetData.save();

      // Log audit
      await AuditLog.create({
        userId,
        action: 'update',
        resourceType: 'data',
        resourceId: fileId,
        details: { sheetName, rowIndex, column },
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });

      res.json({
        success: true,
        message: 'Cell updated successfully',
        data: {
          rowIndex,
          column,
          value,
          updatedRow: sheetData.data[rowIndex]
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid row index'
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/data/file/:fileId/sheet/:sheetName/export
 * @desc    Export sheet data to Excel
 * @access  Private
 */
export const exportSheet = async (req, res, next) => {
  try {
    const { fileId, sheetName } = req.params;
    const userId = req.user.id;

    // Verify file ownership
    const file = await File.findOne({
      _id: fileId,
      uploadedBy: userId,
      isActive: true
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Get sheet data
    const sheetData = await ExcelData.findOne({
      fileId,
      sheetName
    });

    if (!sheetData) {
      return res.status(404).json({
        success: false,
        message: 'Sheet not found'
      });
    }

    // Export to Excel
    const buffer = exportToExcel(
      sheetData.data,
      sheetData.headers,
      sheetName
    );

    // Log audit
    await AuditLog.create({
      userId,
      action: 'export',
      resourceType: 'data',
      resourceId: fileId,
      details: { sheetName },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${sheetName}_${Date.now()}.xlsx"`
    );
    res.send(buffer);
  } catch (error) {
    next(error);
  }
};

