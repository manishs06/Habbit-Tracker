import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getFiles, deleteFile } from '../store/slices/fileSlice'
import { motion } from 'framer-motion'
import { FileText, Search, Trash2, Eye, Upload } from 'lucide-react'
import FileUpload from '../components/files/FileUpload'
import toast from 'react-hot-toast'

const Files = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { files, pagination, loading } = useSelector((state) => state.files)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    dispatch(getFiles({ page: currentPage, limit: 10, search }))
  }, [dispatch, currentPage, search])

  const handleDelete = async (fileId, fileName) => {
    if (window.confirm(`Are you sure you want to delete ${fileName}?`)) {
      try {
        await dispatch(deleteFile(fileId)).unwrap()
        toast.success('File deleted successfully')
        dispatch(getFiles({ page: currentPage, limit: 10, search }))
      } catch (error) {
        toast.error(error || 'Failed to delete file')
      }
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Files
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your uploaded Excel files
          </p>
        </div>
        <FileUpload />
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search files..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setCurrentPage(1)
          }}
          className="input-field pl-10"
        />
      </motion.div>

      {/* Files Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : files.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file, index) => (
              <motion.div
                key={file._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="card cursor-pointer group"
                onClick={() => navigate(`/files/${file._id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                      <FileText className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {file.originalName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {formatFileSize(file.fileSize)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Rows:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {file.totalRows?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Columns:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {file.totalColumns || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Sheets:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {file.sheetNames?.length || 0}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/files/${file._id}`)
                      }}
                      className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(file._id, file.originalName)
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                Page {currentPage} of {pagination.pages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={currentPage === pagination.pages}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-12"
        >
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No files found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {search ? 'Try a different search term' : 'Upload your first Excel file to get started'}
          </p>
          {!search && <FileUpload />}
        </motion.div>
      )}
    </div>
  )
}

export default Files

