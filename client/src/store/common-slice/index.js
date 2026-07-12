import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import hero1 from "@/assets/hero-1.png";
import hero2 from "@/assets/hero-2.png";
import hero3 from "@/assets/hero-3.png";

const dummyBanners = [
  {
    image: hero1,
    bgClass: "bg-[#d5ecd4]",
    subTitle: "Test the Quality",
    title: "Organic Premium Product",
    description: "eco-friendly Organic Products , bamboo brushes, neem combs, organic oils & more.",
    btnText: "SHOP NOW",
  },
  {
    image: hero2,
    bgClass: "bg-[#f3eae1]",
    subTitle: "Handcrafted Heritage",
    title: "Artisanal Kitchenware",
    description: "Made from premium Teak and Rosewood. Durable, natural, and food-safe spoons, bowls, and boards.",
    btnText: "DISCOVER MORE",
  },
  {
    image: hero3,
    bgClass: "bg-[#eae1df]",
    subTitle: "Sustainable Living",
    title: "Minimalist Home Decor",
    description: "Bring nature into your workspace with bamboo phone docks, pen stands, and custom wall clocks.",
    btnText: "BROWSE DECOR",
  },
];

const initialState = {
  isLoading: false,
  featureImageList: dummyBanners,
};

export const getFeatureImages = createAsyncThunk(
  "/order/getFeatureImages",
  async () => {
    try {
      const response = await axios.get(`/api/common/feature/get`);
      if (response?.data?.success && response.data.data && response.data.data.length > 0) {
        return response.data;
      }
      return { success: true, data: dummyBanners };
    } catch (error) {
      console.warn("API error, falling back to dummy banners:", error);
      return { success: true, data: dummyBanners };
    }
  }
);

export const addFeatureImage = createAsyncThunk(
  "/order/addFeatureImage",
  async (image) => {
    try {
      const response = await axios.post(`/api/common/feature/add`, { image });
      return response.data;
    } catch (error) {
      console.warn("API error, adding mock feature image locally:", error);
      return { success: true, data: { image, _id: "mock-" + Date.now() } };
    }
  }
);

export const deleteFeatureImage = createAsyncThunk(
  "/order/deleteFeatureImage",
  async (id) => {
    try {
      const response = await axios.delete(`/api/common/feature/delete/${id}`);
      return response.data;
    } catch (error) {
      console.warn("API error, deleting mock feature image locally:", error);
      return { success: true, data: { id } };
    }
  }
);

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = dummyBanners;
      })
      .addCase(addFeatureImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addFeatureImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = [...state.featureImageList, action.payload.data];
      })
      .addCase(addFeatureImage.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteFeatureImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteFeatureImage.fulfilled, (state, action) => {
        state.isLoading = false;
        // Optional: filter out if needed
      })
      .addCase(deleteFeatureImage.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default commonSlice.reducer;
