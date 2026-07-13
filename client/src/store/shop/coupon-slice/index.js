import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../api/axiosInstance";

const initialState = {
  isLoading: false,
  couponDetails: null,
};

export const validateCoupon = createAsyncThunk(
  "/coupon/validateCoupon",
  async (code) => {
    const response = await axios.get(
      `/api/shop/coupon/validate/${code}`
    );

    return response.data;
  }
);

const shopCouponSlice = createSlice({
  name: "shopCoupon",
  initialState,
  reducers: {
    clearCoupon: (state) => {
      state.couponDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateCoupon.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.isLoading = false;
        state.couponDetails = action.payload.data;
      })
      .addCase(validateCoupon.rejected, (state) => {
        state.isLoading = false;
        state.couponDetails = null;
      });
  },
});

export const { clearCoupon } = shopCouponSlice.actions;
export default shopCouponSlice.reducer;
