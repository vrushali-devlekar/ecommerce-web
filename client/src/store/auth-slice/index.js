import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../api/axiosInstance";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/register", formData);
      if (response?.data?.success) {
        return response.data;
      }
      return rejectWithValue(response.data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/login", formData);
      if (response?.data?.success) {
        localStorage.setItem("localUser", JSON.stringify(response.data.user));
        return response.data;
      }
      return rejectWithValue(response.data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/logout", {});
      if (response?.data?.success) {
        localStorage.removeItem("localUser");
        return response.data;
      }
      return rejectWithValue(response.data);
    } catch (error) {
      localStorage.removeItem("localUser");
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/auth/check-auth", {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      });

      if (response?.data?.success) {
        localStorage.setItem("localUser", JSON.stringify(response.data.user));
        return response.data;
      }
      localStorage.removeItem("localUser");
      return rejectWithValue(response.data);
    } catch (error) {
      localStorage.removeItem("localUser");
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateProfile = createAsyncThunk(
  "/auth/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/auth/update-profile", formData);
      if (response?.data?.success) {
        localStorage.setItem("localUser", JSON.stringify(response.data.user));
        return response.data;
      }
      return rejectWithValue(response.data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updatePassword = createAsyncThunk(
  "/auth/updatePassword",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/auth/update-password", formData);
      if (response?.data?.success) {
        return response.data;
      }
      return rejectWithValue(response.data);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: () => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log(action);

        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : state.user;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updatePassword.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
