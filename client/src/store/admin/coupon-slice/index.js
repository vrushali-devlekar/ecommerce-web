import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  couponsList: [],
};

export const addNewCoupon = createAsyncThunk(
  "/coupons/addNewCoupon",
  async (formData) => {
    const response = await axios.post(
      "/api/shop/coupon/add",
      formData
    );

    return response.data;
  }
);

export const fetchAllCoupons = createAsyncThunk(
  "/coupons/fetchAllCoupons",
  async () => {
    const response = await axios.get(
      "/api/shop/coupon/get"
    );

    return response.data;
  }
);

export const deleteCoupon = createAsyncThunk(
  "/coupons/deleteCoupon",
  async (id) => {
    const response = await axios.delete(
      `/api/admin/coupon/delete/${id}`
    );

    return response.data;
  }
);

const adminCouponSlice = createSlice({
  name: "adminCoupon",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCoupons.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllCoupons.fulfilled, (state, action) => {
        state.isLoading = false;
        state.couponsList = action.payload.data;
      })
      .addCase(fetchAllCoupons.rejected, (state) => {
        state.isLoading = false;
        state.couponsList = [];
      });
  },
});

export default adminCouponSlice.reducer;
