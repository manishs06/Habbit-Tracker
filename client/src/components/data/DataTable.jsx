import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

const DataTable = ({ data, headers, onCellUpdate, loading }) => {
  const [search, setSearch] = useState('')
  const [sortColumn, setSortColumn] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [editingCell, setEditingCell] = useState(null)
  const [editValue, setEditValue] = useState('')
  const itemsPerPage = 50

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = [...data]

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter((row) =>
        Object.values(row).some((val) =>
          String(val).toLowerCase().includes(searchLower)
        )
      )
    }

    // Sort
    if (sortColumn) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn] || ''
        const bVal = b[sortColumn] || ''
        const comparison = String(aVal).localeCompare(String(bVal))
        return sortOrder === 'asc' ? comparison : -comparison
      })
    }

    return filtered
  }, [data, search, sortColumn, sortOrder])

  // Pagination
  const totalPages = Math.ceil(processedData.length / itemsPerPage)
  const paginatedData = processedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortOrder('asc')
    }
  }

  const handleCellClick = (rowIndex, column, value) => {
    const actualIndex = (currentPage - 1) * itemsPerPage + rowIndex
    setEditingCell({ rowIndex: actualIndex, column })
    setEditValue(value)
  }

  const handleCellSave = () => {
    if (editingCell) {
      onCellUpdate(editingCell.rowIndex, editingCell.column, editValue)
      setEditingCell(null)
      setEditValue('')
    }
  }

  const handleCellCancel = () => {
    setEditingCell(null)
    setEditValue('')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="card">
      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search in data..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setCurrentPage(1)
            }}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700"
                >
                  <button
                    onClick={() => handleSort(header)}
                    className="flex items-center space-x-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    <span>{header}</span>
                    {sortColumn === header ? (
                      sortOrder === 'asc' ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )
                    ) : (
                      <ArrowUpDown className="w-4 h-4 opacity-50" />
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <motion.tr
                  key={rowIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: rowIndex * 0.01 }}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {headers.map((header) => {
                    const cellKey = `${rowIndex}-${header}`
                    const isEditing =
                      editingCell?.rowIndex === (currentPage - 1) * itemsPerPage + rowIndex &&
                      editingCell?.column === header

                    return (
                      <td
                        key={cellKey}
                        className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300"
                        onClick={() => handleCellClick(rowIndex, header, row[header] || '')}
                      >
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleCellSave}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleCellSave()
                              } else if (e.key === 'Escape') {
                                handleCellCancel()
                              }
                            }}
                            className="w-full px-2 py-1 border border-primary-500 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            autoFocus
                          />
                        ) : (
                          <span className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 px-2 py-1 rounded">
                            {row[header] || ''}
                          </span>
                        )}
                      </td>
                    )
                  })}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="px-4 py-8 text-center text-gray-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, processedData.length)} of{' '}
            {processedData.length} entries
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable

