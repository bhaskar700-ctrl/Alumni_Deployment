import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for the API
const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api/preusers`;

// Async thunks for fetching data
export const fetchAdmins = createAsyncThunk('preUser/fetchAdmins', async () => {
  const response = await axios.get(`${BASE_URL}/admins`);
  return response.data;
});

export const fetchAlumni = createAsyncThunk('preUser/fetchAlumni', async () => {
  const response = await axios.get(`${BASE_URL}/alumni`);
  return response.data;
});

export const fetchFaculty = createAsyncThunk('preUser/fetchFaculty', async () => {
  const response = await axios.get(`${BASE_URL}/faculty`);
  return response.data;
});

export const fetchStudents = createAsyncThunk('preUser/fetchStudents', async () => {
  const response = await axios.get(`${BASE_URL}/students`);
  return response.data;
});

// Async thunks for creating data
export const createAdmin = createAsyncThunk('preUser/createAdmin', async (admin) => {
  const response = await axios.post(`${BASE_URL}/admins`, admin);
  return response.data;
});

export const createAlumni = createAsyncThunk('preUser/createAlumni', async (alumni) => {
  const response = await axios.post(`${BASE_URL}/alumni`, alumni);
  return response.data;
});

export const createFaculty = createAsyncThunk('preUser/createFaculty', async (faculty) => {
  const response = await axios.post(`${BASE_URL}/faculty`, faculty);
  return response.data;
});

export const createStudent = createAsyncThunk('preUser/createStudent', async (student) => {
  const response = await axios.post(`${BASE_URL}/students`, student);
  return response.data;
});

// Async thunks for updating data
export const updateAdmin = createAsyncThunk('preUser/updateAdmin', async ({ id, admin }) => {
  const response = await axios.put(`${BASE_URL}/admins/${id}`, admin);
  return response.data;
});

export const updateAlumni = createAsyncThunk('preUser/updateAlumni', async ({ id, alumni }) => {
  const response = await axios.put(`${BASE_URL}/alumni/${id}`, alumni);
  return response.data;
});

export const updateFaculty = createAsyncThunk('preUser/updateFaculty', async ({ id, faculty }) => {
  const response = await axios.put(`${BASE_URL}/faculty/${id}`, faculty);
  return response.data;
});

export const updateStudent = createAsyncThunk('preUser/updateStudent', async ({ id, student }) => {
  const response = await axios.put(`${BASE_URL}/students/${id}`, student);
  return response.data;
});

// Async thunks for deleting data
export const deleteAdmin = createAsyncThunk('preUser/deleteAdmin', async (id) => {
  await axios.delete(`${BASE_URL}/admins/${id}`);
  return id;
});

export const deleteAlumni = createAsyncThunk('preUser/deleteAlumni', async (id) => {
  await axios.delete(`${BASE_URL}/alumni/${id}`);
  return id;
});

export const deleteFaculty = createAsyncThunk('preUser/deleteFaculty', async (id) => {
  await axios.delete(`${BASE_URL}/faculty/${id}`);
  return id;
});

export const deleteStudent = createAsyncThunk('preUser/deleteStudent', async (id) => {
  await axios.delete(`${BASE_URL}/students/${id}`);
  return id;
});

// Async thunks for fetching distinct departments and years based on user type
export const fetchDistinctDepartments = createAsyncThunk('preUser/fetchDistinctDepartments', async (userType) => {
  const response = await axios.get(`${BASE_URL}/distinct-departments/${userType}`);
  return response.data;
});

export const fetchDistinctYears = createAsyncThunk('preUser/fetchDistinctYears', async (userType) => {
  const response = await axios.get(`${BASE_URL}/distinct-years/${userType}`);
  return response.data;
});

// Initial state
const initialState = {
  admins: [],
  alumni: [],
  faculty: [],
  students: [],
  departments: [],
  years: [],
  status: 'idle',
  error: null
};

// Slice
const preUserSlice = createSlice({
  name: 'preUser',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAdmins.fulfilled, (state, action) => {
        state.admins = action.payload;
      })
      .addCase(fetchAlumni.fulfilled, (state, action) => {
        state.alumni = action.payload;
      })
      .addCase(fetchFaculty.fulfilled, (state, action) => {
        state.faculty = action.payload;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.students = action.payload;
      })
      // Create
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.admins.push(action.payload);
      })
      .addCase(createAlumni.fulfilled, (state, action) => {
        state.alumni.push(action.payload);
      })
      .addCase(createFaculty.fulfilled, (state, action) => {
        state.faculty.push(action.payload);
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.students.push(action.payload);
      })
      // Update
      .addCase(updateAdmin.fulfilled, (state, action) => {
        const index = state.admins.findIndex((admin) => admin._id === action.payload._id);
        if (index !== -1) {
          state.admins[index] = action.payload;
        }
      })
      .addCase(updateAlumni.fulfilled, (state, action) => {
        const index = state.alumni.findIndex((alumni) => alumni._id === action.payload._id);
        if (index !== -1) {
          state.alumni[index] = action.payload;
        }
      })
      .addCase(updateFaculty.fulfilled, (state, action) => {
        const index = state.faculty.findIndex((faculty) => faculty._id === action.payload._id);
        if (index !== -1) {
          state.faculty[index] = action.payload;
        }
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.students.findIndex((student) => student._id === action.payload._id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.admins = state.admins.filter((admin) => admin._id !== action.payload);
      })
      .addCase(deleteAlumni.fulfilled, (state, action) => {
        state.alumni = state.alumni.filter((alumni) => alumni._id !== action.payload);
      })
      .addCase(deleteFaculty.fulfilled, (state, action) => {
        state.faculty = state.faculty.filter((faculty) => faculty._id !== action.payload);
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter((student) => student._id !== action.payload);
      })
      .addCase(fetchDistinctDepartments.fulfilled, (state, action) => {
        state.departments = action.payload;
      })
      .addCase(fetchDistinctYears.fulfilled, (state, action) => {
        state.years = action.payload;
      })
      // Handle pending and rejected states
      .addMatcher(
        (action) => action.type.startsWith('preUser') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading';
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('preUser') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('preUser') && action.type.endsWith('/fulfilled'),
        (state) => {
          state.status = 'idle';
        }
      );
  }
});

export default preUserSlice.reducer;
