import mongoose from 'mongoose';

const excelDataSchema = new mongoose.Schema({
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: true,
    index: true
  },
  sheetName: {
    type: String,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  headers: [{
    type: String
  }],
  columnTypes: {
    type: Map,
    of: String,
    default: {}
  },
  rowCount: {
    type: Number,
    default: 0
  },
  columnCount: {
    type: Number,
    default: 0
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  modifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
excelDataSchema.index({ fileId: 1, sheetName: 1 });

const ExcelData = mongoose.model('ExcelData', excelDataSchema);

export default ExcelData;

