import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../../api/axiosInstance";

const dummyOrders = [
  {
    _id: "order-1001",
    orderDate: "2026-07-12T10:15:30.000Z",
    orderStatus: "confirmed",
    totalAmount: 1200,
  },
  {
    _id: "order-1002",
    orderDate: "2026-07-11T14:30:00.000Z",
    orderStatus: "pending",
    totalAmount: 450,
  },
  {
    _id: "order-1003",
    orderDate: "2026-07-09T09:12:00.000Z",
    orderStatus: "delivered",
    totalAmount: 890,
  },
  {
    _id: "order-1004",
    orderDate: "2026-07-08T18:22:00.000Z",
    orderStatus: "rejected",
    totalAmount: 300,
  }
];

export function getLocalOrders() {
  const orders = localStorage.getItem("woodasaOrders");
  if (orders) return JSON.parse(orders);
  localStorage.setItem("woodasaOrders", JSON.stringify(dummyOrders));
  return dummyOrders;
}

export function saveLocalOrders(orders) {
  localStorage.setItem("woodasaOrders", JSON.stringify(orders));
  return orders;
}

const initialState = {
  orderList: [],
  orderDetails: null,
  isLoading: false,
};

export const getAllOrdersForAdmin = createAsyncThunk(
  "/order/getAllOrdersForAdmin",
  async () => {
    try {
      const response = await axios.get(`/api/admin/orders/get`);
      if (response?.data?.success) {
        return response.data;
      }
      return { success: true, data: getLocalOrders() };
    } catch (error) {
      console.warn("API error, fetching orders locally:", error);
      return { success: true, data: getLocalOrders() };
    }
  }
);

export const getOrderDetailsForAdmin = createAsyncThunk(
  "/order/getOrderDetailsForAdmin",
  async (id) => {
    try {
      const response = await axios.get(`/api/admin/orders/details/${id}`);
      if (response?.data?.success) {
        return response.data;
      }
      const localOrders = getLocalOrders();
      const order = localOrders.find(o => o._id === id);
      return { success: true, data: order || null };
    } catch (error) {
      console.warn("API error, fetching order details locally:", error);
      const localOrders = getLocalOrders();
      const order = localOrders.find(o => o._id === id);
      return { success: true, data: order || null };
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "/order/updateOrderStatus",
  async ({ id, orderStatus }) => {
    try {
      const response = await axios.put(
        `/api/admin/orders/update/${id}`,
        { orderStatus }
      );
      if (response?.data?.success) {
        return response.data;
      }
      const localOrders = getLocalOrders();
      const updated = localOrders.map(o => o._id === id ? { ...o, orderStatus } : o);
      saveLocalOrders(updated);
      return { success: true };
    } catch (error) {
      console.warn("API error, updating order status locally:", error);
      const localOrders = getLocalOrders();
      const updated = localOrders.map(o => o._id === id ? { ...o, orderStatus } : o);
      saveLocalOrders(updated);
      return { success: true };
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      console.log("resetOrderDetails");
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderList = getLocalOrders();
      })
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;

export default adminOrderSlice.reducer;
