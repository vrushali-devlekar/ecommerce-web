import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getLocalProducts, saveLocalProducts } from "../../shop/products-slice";

const initialState = {
  isLoading: false,
  productList: [],
};

function addLocalProduct(formData) {
  const products = getLocalProducts();
  const newProduct = {
    ...formData,
    _id: "local-product-" + Date.now(),
    averageReview: 5,
  };
  products.push(newProduct);
  saveLocalProducts(products);
  return newProduct;
}

function editLocalProduct(id, formData) {
  const products = getLocalProducts();
  const index = products.findIndex((p) => p._id === id);
  if (index > -1) {
    products[index] = { ...products[index], ...formData };
  }
  saveLocalProducts(products);
  return products[index];
}

function deleteLocalProduct(id) {
  const products = getLocalProducts();
  const updatedProducts = products.filter((p) => p._id !== id);
  saveLocalProducts(updatedProducts);
  return id;
}

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    try {
      const result = await axios.post(
        "/api/admin/products/add",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (result?.data?.success) {
        return result.data;
      }
      return { success: true, data: addLocalProduct(formData) };
    } catch (error) {
      console.warn("API error, adding product locally:", error);
      return { success: true, data: addLocalProduct(formData) };
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async () => {
    try {
      const result = await axios.get("/api/admin/products/get");

      if (result?.data?.success) {
        return result.data;
      }
      return { success: true, data: getLocalProducts() };
    } catch (error) {
      console.warn("API error, fetching products locally:", error);
      return { success: true, data: getLocalProducts() };
    }
  }
);

export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ id, formData }) => {
    try {
      const result = await axios.put(
        `/api/admin/products/edit/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (result?.data?.success) {
        return result.data;
      }
      return { success: true, data: editLocalProduct(id, formData) };
    } catch (error) {
      console.warn("API error, editing product locally:", error);
      return { success: true, data: editLocalProduct(id, formData) };
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id) => {
    try {
      const result = await axios.delete(
        `/api/admin/products/delete/${id}`
      );

      if (result?.data?.success) {
        return result.data;
      }
      return { success: true, data: { id: deleteLocalProduct(id) } };
    } catch (error) {
      console.warn("API error, deleting product locally:", error);
      return { success: true, data: { id: deleteLocalProduct(id) } };
    }
  }
);

const adminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = getLocalProducts();
      });
  },
});

export default adminProductsSlice.reducer;
