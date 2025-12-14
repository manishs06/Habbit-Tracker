import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sheetNames: [{
    type: String
  }],
  totalRows: {
    type: Number,
    default: 0
  },
  totalColumns: {
    type: Number,
    default: 0
  },
  version: {
    type: Number,
    default: 1
  },
  parentFile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for faster queries
fileSchema.index({ uploadedBy: 1, createdAt: -1 });
fileSchema.index({ isActive: 1 });

const File = mongoose.model('File', fileSchema);

export default File;

