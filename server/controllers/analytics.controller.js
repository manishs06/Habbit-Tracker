import File from '../models/File.model.js';
import ExcelData from '../models/ExcelData.model.js';
import AuditLog from '../models/AuditLog.model.js';

/**
 * @route   GET /api/analytics/dashboard
 * @desc    Get dashboard statistics
 * @access  Private
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Total files
    const totalFiles = await File.countDocuments({
      uploadedBy: userId,
      isActive: true
    });

    // Total rows across all files
    const files = await File.find({
      uploadedBy: userId,
      isActive: true
    });
    const totalRows = files.reduce((sum, file) => sum + (file.totalRows || 0), 0);

    // Total sheets
    const allData = await ExcelData.find({
      fileId: { $in: files.map(f => f._id) }
    });
    const totalSheets = allData.length;

    // Recent files (last 5)
    const recentFiles = await File.find({
      uploadedBy: userId,
      isActive: true
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('originalName createdAt totalRows totalColumns sheetNames');

    // Most used files (by view count)
    const viewLogs = await AuditLog.aggregate([
      {
        $match: {
          userId: userId,
          action: 'view',
          resourceType: 'file'
        }
      },
      {
        $group: {
          _id: '$resourceId',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    const mostUsedFiles = await File.find({
      _id: { $in: viewLogs.map(log => log._id) },
      isActive: true
    }).select('originalName totalRows totalColumns');

    // Activity timeline (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activityLogs = await AuditLog.find({
      userId: userId,
      createdAt: { $gte: sevenDaysAgo }
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('resourceId', 'originalName')
      .select('action resourceType createdAt details');

    res.json({
      success: true,
      data: {
        stats: {
          totalFiles,
          totalRows,
          totalSheets
        },
        recentFiles,
        mostUsedFiles,
        activityLogs
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/analytics/charts/:fileId/:sheetName
 * @desc    Get chart data for a sheet
 * @access  Private
 */
export const getChartData = async (req, res, next) => {
  try {
    const { fileId, sheetName } = req.params;
    const { chartType, xColumn, yColumn } = req.query;
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

    // Prepare chart data based on type
    let chartData = [];

    if (chartType === 'line' || chartType === 'bar') {
      // For line/bar charts, group by xColumn and aggregate yColumn
      if (xColumn && yColumn && sheetData.headers.includes(xColumn) && sheetData.headers.includes(yColumn)) {
        const grouped = {};
        
        sheetData.data.forEach(row => {
          const xValue = String(row[xColumn] || '');
          const yValue = parseFloat(row[yColumn]) || 0;
          
          if (grouped[xValue]) {
            grouped[xValue] += yValue;
          } else {
            grouped[xValue] = yValue;
          }
        });

        chartData = Object.entries(grouped).map(([label, value]) => ({
          label,
          value
        }));
      }
    } else if (chartType === 'pie') {
      // For pie charts, count occurrences
      if (xColumn && sheetData.headers.includes(xColumn)) {
        const counts = {};
        
        sheetData.data.forEach(row => {
          const value = String(row[xColumn] || '');
          counts[value] = (counts[value] || 0) + 1;
        });

        chartData = Object.entries(counts).map(([label, value]) => ({
          label,
          value
        }));
      }
    }

    res.json({
      success: true,
      data: {
        chartType,
        chartData,
        columns: sheetData.headers,
        columnTypes: Object.fromEntries(sheetData.columnTypes)
      }
    });
  } catch (error) {
    next(error);
  }
};

