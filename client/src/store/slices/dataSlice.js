import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api'

// Async thunks
export const getFileData = createAsyncThunk(
  'data/getFileData',
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/data/file/${fileId}`)
      return response.data.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch file data'
      )
    }
  }
)

export const getSheetData = createAsyncThunk(
  'data/getSheetData',
  async ({ fileId, sheetName, page = 1, limit = 100, search = '', sortBy = '', sortOrder = 'asc' }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/data/file/${fileId}/sheet/${sheetName}`,
        {
          params: { page, limit, search, sortBy, sortOrder },
        }
      )
      return response.data.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch sheet data'
      )
    }
  }
)

export const updateCellData = createAsyncThunk(
  'data/updateCell',
  async ({ fileId, sheetName, rowIndex, column, value }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/data/file/${fileId}/sheet/${sheetName}`,
        { rowIndex, column, value }
      )
      return response.data.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update cell'
      )
    }
  }
)

export const exportSheet = createAsyncThunk(
  'data/exportSheet',
  async ({ fileId, sheetName }, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/data/file/${fileId}/sheet/${sheetName}/export`,
        {},
        { responseType: 'blob' }
      )
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${sheetName}_${Date.now()}.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      
      return { success: true }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Export failed'
      )
    }
  }
)

const dataSlice = createSlice({
  name: 'data',
  initialState: {
    fileSheets: [],
    currentSheet: null,
    sheetData: [],
    headers: [],
    columnTypes: {},
    pagination: {
      page: 1,
      limit: 100,
      total: 0,
      pages: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearSheetData: (state) => {
      state.currentSheet = null
      state.sheetData = []
      state.headers = []
      state.columnTypes = {}
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get File Data
      .addCase(getFileData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getFileData.fulfilled, (state, action) => {
        state.loading = false
        state.fileSheets = action.payload.sheets
      })
      .addCase(getFileData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get Sheet Data
      .addCase(getSheetData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getSheetData.fulfilled, (state, action) => {
        state.loading = false
        state.currentSheet = action.payload.sheetName
        state.sheetData = action.payload.data
        state.headers = action.payload.headers
        state.columnTypes = action.payload.columnTypes
        state.pagination = action.payload.pagination
      })
      .addCase(getSheetData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update Cell
      .addCase(updateCellData.fulfilled, (state, action) => {
        const { rowIndex, updatedRow } = action.payload
        if (state.sheetData[rowIndex]) {
          state.sheetData[rowIndex] = updatedRow
        }
      })
  },
})

export const { clearSheetData, clearError } = dataSlice.actions
export default dataSlice.reducer

