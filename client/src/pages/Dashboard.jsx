import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Upload, BarChart3, TrendingUp, Clock, Activity } from 'lucide-react'
import api from '../store/api'
import FileUpload from '../components/files/FileUpload'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalRows: 0,
    totalSheets: 0,
  })
  const [recentFiles, setRecentFiles] = useState([])
  const [activityLogs, setActivityLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/analytics/dashboard')
      setStats(response.data.data.stats)
      setRecentFiles(response.data.data.recentFiles || [])
      setActivityLogs(response.data.data.activityLogs || [])
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Files',
      value: stats.totalFiles,
      icon: FileText,
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Rows',
      value: stats.totalRows.toLocaleString(),
      icon: BarChart3,
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: 'Total Sheets',
      value: stats.totalSheets,
      icon: TrendingUp,
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's your overview.
          </p>
        </div>
        <FileUpload onUploadSuccess={fetchDashboardData} />
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card relative overflow-hidden group"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:opacity-20 transition-opacity`}></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Files */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Files
            </h2>
            <button
              onClick={() => navigate('/files')}
              className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
            >
              View all
            </button>
          </div>
          {recentFiles.length > 0 ? (
            <div className="space-y-3">
              {recentFiles.map((file) => (
                <motion.div
                  key={file._id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate(`/files/${file._id}`)}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-primary-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {file.originalName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {file.totalRows} rows • {file.totalColumns} columns
                        </p>
                      </div>
                    </div>
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No files uploaded yet
            </p>
          )}
        </motion.div>

        {/* Activity Logs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Recent Activity</span>
            </h2>
          </div>
          {activityLogs.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activityLogs.map((log, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="mt-1">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium capitalize">{log.action}</span>{' '}
                      {log.resourceType}
                      {log.resourceId?.originalName && (
                        <span className="text-gray-600 dark:text-gray-400">
                          {' '}
                          - {log.resourceId.originalName}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No recent activity
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard

