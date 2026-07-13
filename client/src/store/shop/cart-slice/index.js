import axios from "../../../api/axiosInstance";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { dummyProducts } from "../products-slice";

function getLocalCart() {
  const cart = localStorage.getItem("localCart");
  return cart ? JSON.parse(cart) : { items: [] };
}

function saveLocalCart(cart) {
  localStorage.setItem("localCart", JSON.stringify(cart));
  return cart;
}

function addToLocalCartHelper(productId, quantity, color, size) {
  const cart = getLocalCart();
  const product = dummyProducts.find((p) => p._id === productId);
  if (!product) return cart;

  const existingItemIndex = cart.items.findIndex(
    (item) =>
      item.productId === productId &&
      item.color === color &&
      item.size === size
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({
      productId,
      image: product.image,
      title: product.title,
      price: product.price,
      salePrice: product.salePrice,
      quantity,
      color,
      size,
    });
  }

  return saveLocalCart(cart);
}

function deleteLocalCartItemHelper(productId, color, size) {
  const cart = getLocalCart();
  cart.items = cart.items.filter(
    (item) =>
      !(
        item.productId === productId &&
        item.color === color &&
        item.size === size
      )
  );
  return saveLocalCart(cart);
}

function updateLocalCartQuantityHelper(productId, quantity, color, size) {
  const cart = getLocalCart();
  const itemIndex = cart.items.findIndex(
    (item) =>
      item.productId === productId &&
      item.color === color &&
      item.size === size
  );
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
  }
  return saveLocalCart(cart);
}

const initialState = {
  cartItems: getLocalCart(),
  isLoading: false,
  isOpen: false,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity, color, size }) => {
    try {
      const response = await axios.post("/api/shop/cart/add", {
        userId,
        productId,
        quantity,
        color,
        size,
      });

      if (response?.data?.success) {
        return response.data;
      }
      return { success: true, data: addToLocalCartHelper(productId, quantity, color, size) };
    } catch (error) {
      console.warn("API error, falling back to local storage cart:", error);
      return { success: true, data: addToLocalCartHelper(productId, quantity, color, size) };
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId) => {
    try {
      const response = await axios.get(`/api/shop/cart/get/${userId}`);

      if (response?.data?.success) {
        return response.data;
      }
      return { success: true, data: getLocalCart() };
    } catch (error) {
      console.warn("API error, falling back to local storage cart:", error);
      return { success: true, data: getLocalCart() };
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId, color, size }) => {
    try {
      const response = await axios.delete(
        `/api/shop/cart/${userId}/${productId}`,
        {
          data: { color, size },
        }
      );

      if (response?.data?.success) {
        return response.data;
      }
      return { success: true, data: deleteLocalCartItemHelper(productId, color, size) };
    } catch (error) {
      console.warn("API error, falling back to local storage cart:", error);
      return { success: true, data: deleteLocalCartItemHelper(productId, color, size) };
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity, color, size }) => {
    try {
      const response = await axios.put("/api/shop/cart/update-cart", {
        userId,
        productId,
        quantity,
        color,
        size,
      });

      if (response?.data?.success) {
        return response.data;
      }
      return { success: true, data: updateLocalCartQuantityHelper(productId, quantity, color, size) };
    } catch (error) {
      console.warn("API error, falling back to local storage cart:", error);
      return { success: true, data: updateLocalCartQuantityHelper(productId, quantity, color, size) };
    }
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {
    setCartDrawer: (state, action) => {
      state.isOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = getLocalCart();
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = getLocalCart();
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = getLocalCart();
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false;
        state.cartItems = getLocalCart();
      });
  },
});

export const { setCartDrawer } = shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;
