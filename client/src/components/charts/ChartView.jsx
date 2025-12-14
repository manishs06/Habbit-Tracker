import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import api from '../../store/api'
import toast from 'react-hot-toast'

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

const ChartView = ({ fileId, sheetName, headers }) => {
  const [chartType, setChartType] = useState('line')
  const [xColumn, setXColumn] = useState('')
  const [yColumn, setYColumn] = useState('')
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (headers.length > 0) {
      setXColumn(headers[0])
      if (headers.length > 1) {
        setYColumn(headers[1])
      }
    }
  }, [headers])

  useEffect(() => {
    if (xColumn && ((chartType !== 'pie' && yColumn) || chartType === 'pie')) {
      fetchChartData()
    }
  }, [fileId, sheetName, chartType, xColumn, yColumn])

  const fetchChartData = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/analytics/charts/${fileId}/${sheetName}`, {
        params: {
          chartType,
          xColumn,
          yColumn,
        },
      })
      setChartData(response.data.data.chartData || [])
    } catch (error) {
      toast.error('Failed to load chart data')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const renderChart = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )
    }

    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-96 text-gray-500">
          No data available for chart
        </div>
      )
    }

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        )

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ label, percent }) => `${label}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <div className="card space-y-6">
      {/* Chart Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Chart Type
          </label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="input-field"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            X-Axis / Category
          </label>
          <select
            value={xColumn}
            onChange={(e) => setXColumn(e.target.value)}
            className="input-field"
          >
            {headers.map((header) => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>

        {chartType !== 'pie' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Y-Axis / Value
            </label>
            <select
              value={yColumn}
              onChange={(e) => setYColumn(e.target.value)}
              className="input-field"
            >
              {headers.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"
      >
        {renderChart()}
      </motion.div>
    </div>
  )
}

export default ChartView

