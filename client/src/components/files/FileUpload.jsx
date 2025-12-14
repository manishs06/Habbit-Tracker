import { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { uploadFile } from '../../store/slices/fileSlice'
import { motion } from 'framer-motion'
import { Upload, X, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

const FileUpload = ({ onUploadSuccess }) => {
  const dispatch = useDispatch()
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    handleFiles(files)
  }

  const handleFiles = async (files) => {
    const excelFiles = files.filter(
      (file) =>
        file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel' ||
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.xls') ||
        file.name.endsWith('.csv')
    )

    if (excelFiles.length === 0) {
      toast.error('Please select Excel files (.xlsx, .xls, .csv)')
      return
    }

    for (const file of excelFiles) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 10MB.`)
        continue
      }

      setUploading(true)
      try {
        await dispatch(uploadFile(file)).unwrap()
        toast.success(`${file.name} uploaded successfully!`)
        if (onUploadSuccess) {
          onUploadSuccess()
        }
      } catch (error) {
        toast.error(error || `Failed to upload ${file.name}`)
      } finally {
        setUploading(false)
      }
    }
  }

  return (
    <div className="w-full">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${
            isDragging
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 bg-gray-50 dark:bg-gray-800'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
          className="hidden"
          multiple
          disabled={uploading}
        />

        {uploading ? (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400">Uploading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {isDragging ? 'Drop files here' : 'Upload Excel Files'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Drag and drop files here, or click to select
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Supports .xlsx, .xls, .csv (Max 10MB)
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default FileUpload

