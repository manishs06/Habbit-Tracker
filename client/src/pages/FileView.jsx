import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getFile } from '../store/slices/fileSlice'
import { getFileData, getSheetData, updateCellData, exportSheet } from '../store/slices/dataSlice'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, FileText, BarChart3 } from 'lucide-react'
import DataTable from '../components/data/DataTable'
import ChartView from '../components/charts/ChartView'
import toast from 'react-hot-toast'

const FileView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentFile } = useSelector((state) => state.files)
  const { fileSheets, currentSheet, sheetData, headers, loading } = useSelector((state) => state.data)
  const [selectedSheet, setSelectedSheet] = useState('')
  const [viewMode, setViewMode] = useState('table') // 'table' or 'chart'

  useEffect(() => {
    dispatch(getFile(id))
    dispatch(getFileData(id))
  }, [dispatch, id])

  useEffect(() => {
    if (fileSheets.length > 0 && !selectedSheet) {
      setSelectedSheet(fileSheets[0].sheetName)
    }
  }, [fileSheets, selectedSheet])

  useEffect(() => {
    if (selectedSheet) {
      dispatch(getSheetData({ fileId: id, sheetName: selectedSheet }))
    }
  }, [dispatch, id, selectedSheet])

  const handleCellUpdate = async (rowIndex, column, value) => {
    try {
      await dispatch(
        updateCellData({
          fileId: id,
          sheetName: selectedSheet,
          rowIndex,
          column,
          value,
        })
      ).unwrap()
      toast.success('Cell updated successfully')
    } catch (error) {
      toast.error(error || 'Failed to update cell')
    }
  }

  const handleExport = async () => {
    try {
      await dispatch(
        exportSheet({
          fileId: id,
          sheetName: selectedSheet,
        })
      ).unwrap()
      toast.success('File exported successfully')
    } catch (error) {
      toast.error(error || 'Export failed')
    }
  }

  if (loading && !currentFile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/files')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentFile?.originalName}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {currentFile?.totalRows?.toLocaleString()} rows • {currentFile?.totalColumns} columns
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            className="btn-secondary flex items-center space-x-2"
            disabled={!selectedSheet}
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </motion.div>

      {/* Sheet Selector */}
      {fileSheets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Select Sheet
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'table'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <FileText className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  viewMode === 'chart'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {fileSheets.map((sheet) => (
              <button
                key={sheet.sheetName}
                onClick={() => setSelectedSheet(sheet.sheetName)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedSheet === sheet.sheetName
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {sheet.sheetName} ({sheet.rowCount} rows)
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Data View */}
      {selectedSheet && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {viewMode === 'table' ? (
            <DataTable
              data={sheetData}
              headers={headers}
              onCellUpdate={handleCellUpdate}
              loading={loading}
            />
          ) : (
            <ChartView
              fileId={id}
              sheetName={selectedSheet}
              headers={headers}
            />
          )}
        </motion.div>
      )}
    </div>
  )
}

export default FileView

