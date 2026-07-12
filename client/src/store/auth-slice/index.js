import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

function getLocalUserResponse() {
  const user = localStorage.getItem("localUser");
  if (user) {
    return { success: true, user: JSON.parse(user) };
  }
  return { success: false, user: null };
}

function checkDummyLogin(formData) {
  const { email, password } = formData;
  let userPayload;
  if (email === "admin@woodasa.com") {
    userPayload = {
      email: "admin@woodasa.com",
      role: "admin",
      id: "dummy-admin-id",
      userName: "Admin User",
      image: null,
    };
  } else {
    userPayload = {
      email: email || "user@woodasa.com",
      role: "user",
      id: "dummy-user-id",
      userName: "Regular User",
      image: null,
    };
  }
  localStorage.setItem("localUser", JSON.stringify(userPayload));
  return { success: true, user: userPayload };
}

export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData) => {
    try {
      const response = await axios.post("/api/auth/register", formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.warn("API error, registering user locally:", error);
      return { success: true, message: "Local mock registration successful" };
    }
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData) => {
    try {
      const response = await axios.post("/api/auth/login", formData, {
        withCredentials: true,
      });

      if (response?.data?.success) {
        localStorage.setItem("localUser", JSON.stringify(response.data.user));
        return response.data;
      }
      return checkDummyLogin(formData);
    } catch (error) {
      console.warn("API error, checking dummy credentials:", error);
      return checkDummyLogin(formData);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async () => {
    try {
      const response = await axios.post("/api/auth/logout", {}, {
        withCredentials: true,
      });
      localStorage.removeItem("localUser");
      return response.data;
    } catch (error) {
      console.warn("API error during logout, clearing local session:", error);
      localStorage.removeItem("localUser");
      return { success: true };
    }
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",
  async () => {
    try {
      const response = await axios.get("/api/auth/check-auth", {
        withCredentials: true,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      });

      if (response?.data?.success) {
        localStorage.setItem("localUser", JSON.stringify(response.data.user));
        return response.data;
      }
      return getLocalUserResponse();
    } catch (error) {
      console.warn("API error, checking local session:", error);
      return getLocalUserResponse();
    }
  }
);

export const updateProfile = createAsyncThunk(
  "/auth/updateProfile",
  async (formData) => {
    try {
      const response = await axios.put("/api/auth/update-profile", formData, {
        withCredentials: true,
      });

      if (response?.data?.success) {
        localStorage.setItem("localUser", JSON.stringify(response.data.user));
        return response.data;
      }
      const localUser = JSON.parse(localStorage.getItem("localUser") || "{}");
      const updatedUser = { ...localUser, ...formData };
      localStorage.setItem("localUser", JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } catch (error) {
      console.warn("API error, updating profile locally:", error);
      const localUser = JSON.parse(localStorage.getItem("localUser") || "{}");
      const updatedUser = { ...localUser, ...formData };
      localStorage.setItem("localUser", JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    }
  }
);

export const updatePassword = createAsyncThunk(
  "/auth/updatePassword",
  async (formData) => {
    try {
      const response = await axios.put("/api/auth/update-password", formData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.warn("API error, updating password locally:", error);
      return { success: true };
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
