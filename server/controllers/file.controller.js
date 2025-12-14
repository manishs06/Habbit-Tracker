import File from '../models/File.model.js';
import { parseExcelFile, saveExcelData } from '../services/excel.service.js';
import AuditLog from '../models/AuditLog.model.js';
import fs from 'fs';
import path from 'path';

/**
 * @route   POST /api/files/upload
 * @desc    Upload Excel file
 * @access  Private
 */
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const userId = req.user.id;
    const file = req.file;

    // Parse Excel file
    const parsedData = parseExcelFile(file.path);

    // Create file record
    const fileRecord = new File({
      filename: file.filename,
      originalName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedBy: userId,
      sheetNames: parsedData.sheetNames,
      totalRows: Object.values(parsedData.sheets).reduce(
        (sum, sheet) => sum + sheet.rowCount, 0
      ),
      totalColumns: Math.max(
        ...Object.values(parsedData.sheets).map(sheet => sheet.columnCount)
      )
    });

    await fileRecord.save();

    // Save Excel data to database
    await saveExcelData(fileRecord._id, parsedData, userId);

    // Log audit
    await AuditLog.create({
      userId,
      action: 'upload',
      resourceType: 'file',
      resourceId: fileRecord._id,
      details: {
        filename: file.originalname,
        size: file.size,
        sheets: parsedData.sheetNames.length
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(201).json({
      success: true,
      message: 'File uploaded and processed successfully',
      data: {
        file: fileRecord,
        parsedData: {
          totalSheets: parsedData.totalSheets,
          sheetNames: parsedData.sheetNames
        }
      }
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

/**
 * @route   GET /api/files
 * @desc    Get all files for current user
 * @access  Private
 */
export const getFiles = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, search = '' } = req.query;

    const query = {
      uploadedBy: userId,
      isActive: true
    };

    if (search) {
      query.originalName = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const files = await File.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('uploadedBy', 'name email');

    const total = await File.countDocuments(query);

    res.json({
      success: true,
      data: {
        files,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/files/:id
 * @desc    Get single file details
 * @access  Private
 */
export const getFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const file = await File.findOne({
      _id: id,
      uploadedBy: userId,
      isActive: true
    }).populate('uploadedBy', 'name email');

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.json({
      success: true,
      data: { file }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/files/:id
 * @desc    Delete file
 * @access  Private
 */
export const deleteFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const file = await File.findOne({
      _id: id,
      uploadedBy: userId
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Soft delete
    file.isActive = false;
    await file.save();

    // Delete physical file
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    // Log audit
    await AuditLog.create({
      userId,
      action: 'delete',
      resourceType: 'file',
      resourceId: file._id,
      details: { filename: file.originalName },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

