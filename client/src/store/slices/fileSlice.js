import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../api'

// Async thunks
export const uploadFile = createAsyncThunk(
  'files/upload',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'File upload failed'
      )
    }
  }
)

export const getFiles = createAsyncThunk(
  'files/getFiles',
  async ({ page = 1, limit = 10, search = '' }, { rejectWithValue }) => {
    try {
      const response = await api.get('/files', {
        params: { page, limit, search },
      })
      return response.data.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch files'
      )
    }
  }
)

export const getFile = createAsyncThunk(
  'files/getFile',
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/files/${fileId}`)
      return response.data.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch file'
      )
    }
  }
)

export const deleteFile = createAsyncThunk(
  'files/delete',
  async (fileId, { rejectWithValue }) => {
    try {
      await api.delete(`/files/${fileId}`)
      return fileId
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete file'
      )
    }
  }
)

const fileSlice = createSlice({
  name: 'files',
  initialState: {
    files: [],
    currentFile: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pages: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentFile: (state) => {
      state.currentFile = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload File
      .addCase(uploadFile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false
        state.files.unshift(action.payload.file)
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get Files
      .addCase(getFiles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getFiles.fulfilled, (state, action) => {
        state.loading = false
        state.files = action.payload.files
        state.pagination = action.payload.pagination
      })
      .addCase(getFiles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get File
      .addCase(getFile.pending, (state) => {
        state.loading = true
      })
      .addCase(getFile.fulfilled, (state, action) => {
        state.loading = false
        state.currentFile = action.payload.file
      })
      .addCase(getFile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete File
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.files = state.files.filter(
          (file) => file._id !== action.payload
        )
      })
  },
})

export const { clearCurrentFile, clearError } = fileSlice.actions
export default fileSlice.reducer

