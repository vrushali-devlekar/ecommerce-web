import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const dummyProducts = [
  {
    _id: "dummy-product-1",
    image: "https://images.unsplash.com/photo-1590156546746-c208c2b41985?w=500&q=80",
    title: "Organic Neem Wood Comb",
    description: "Handcrafted fine-toothed neem wood comb. Helps control hair fall and promotes scalp health.",
    category: "personal-care",
    brand: "neem",
    price: 15,
    salePrice: 12,
    totalStock: 100,
    averageReview: 4.5,
  },
  {
    _id: "dummy-product-2",
    image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500&q=80",
    title: "Eco-Friendly Bamboo Toothbrush (Pack of 4)",
    description: "Biodegradable natural bamboo toothbrushes with soft charcoal-infused bristles.",
    category: "personal-care",
    brand: "bamboo",
    price: 12,
    salePrice: 9,
    totalStock: 250,
    averageReview: 4.8,
  },
  {
    _id: "dummy-product-3",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80",
    title: "Natural Boar Bristle Hair Brush",
    description: "Sandalwood paddle hair brush with natural bristles to stimulate hair growth and distribute oils.",
    category: "personal-care",
    brand: "sandalwood",
    price: 28,
    salePrice: 22,
    totalStock: 150,
    averageReview: 4.2,
  },
  {
    _id: "dummy-product-4",
    image: "https://images.unsplash.com/photo-1607006342411-17f132e63939?w=500&q=80",
    title: "Handcrafted Wooden Soap Dish",
    description: "Self-draining teak wood soap saver to keep your organic soaps dry and lasting longer.",
    category: "personal-care",
    brand: "teak",
    price: 10,
    salePrice: 8,
    totalStock: 200,
    averageReview: 4.6,
  },
  {
    _id: "dummy-product-5",
    image: "https://images.unsplash.com/photo-1594794312433-05a69a1356a0?w=500&q=80",
    title: "Premium Teak Chopping Board",
    description: "Heavy-duty organic teak wood cutting board with juice groove and side handles.",
    category: "kitchenware",
    brand: "teak",
    price: 45,
    salePrice: 38,
    totalStock: 80,
    averageReview: 4.7,
  },
  {
    _id: "dummy-product-6",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500&q=80",
    title: "Hand-Turned Wooden Salad Bowl",
    description: "Elegant rosewood salad serving bowl. Every piece displays a unique rich wood grain.",
    category: "kitchenware",
    brand: "rosewood",
    price: 35,
    salePrice: 0,
    totalStock: 120,
    averageReview: 4.9,
  },
  {
    _id: "dummy-product-7",
    image: "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=500&q=80",
    title: "Wooden Cooking Utensils Set (5 Pieces)",
    description: "Non-scratch bamboo cooking spoons, spatulas, and servers for non-stick cookware.",
    category: "kitchenware",
    brand: "bamboo",
    price: 24,
    salePrice: 18,
    totalStock: 90,
    averageReview: 4.3,
  },
  {
    _id: "dummy-product-8",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&q=80",
    title: "Rustic Wooden Beverage Coasters (Set of 6)",
    description: "Aromatic sandalwood drink coasters with non-slip backing and vintage wooden holder.",
    category: "kitchenware",
    brand: "sandalwood",
    price: 18,
    salePrice: 14,
    totalStock: 150,
    averageReview: 4.8,
  },
  {
    _id: "dummy-product-9",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&q=80",
    title: "Wooden Desk Organizer & Pen Stand",
    description: "Rosewood desk organizer. Perfect for pens, phone, memo pads, and workspace essentials.",
    category: "decor",
    brand: "rosewood",
    price: 30,
    salePrice: 25,
    totalStock: 45,
    averageReview: 4.2,
  },
  {
    _id: "dummy-product-10",
    image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=500&q=80",
    title: "Acoustic Wooden Phone Amplifier",
    description: "Natural bamboo acoustic amplifier stand for mobile phones. Eco-friendly sound dock.",
    category: "decor",
    brand: "bamboo",
    price: 22,
    salePrice: 16,
    totalStock: 30,
    averageReview: 4.9,
  },
  {
    _id: "dummy-product-11",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80",
    title: "Minimalist Wooden Desk Lamp",
    description: "Adjustable teak wood desk lamp with textile cord and warm LED bulb.",
    category: "decor",
    brand: "teak",
    price: 75,
    salePrice: 60,
    totalStock: 75,
    averageReview: 4.6,
  },
  {
    _id: "dummy-product-12",
    image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=500&q=80",
    title: "Handcrafted Wooden Wall Clock",
    description: "12-inch silent wall clock crafted from solid rosewood. Minimalist laser-cut dial.",
    category: "decor",
    brand: "rosewood",
    price: 55,
    salePrice: 45,
    totalStock: 25,
    averageReview: 4.7,
  },
];

export function getLocalProducts() {
  const products = localStorage.getItem("woodasaProducts");
  if (products) return JSON.parse(products);
  localStorage.setItem("woodasaProducts", JSON.stringify(dummyProducts));
  return dummyProducts;
}

export function saveLocalProducts(products) {
  localStorage.setItem("woodasaProducts", JSON.stringify(products));
  return products;
}

function getFilteredSortedDummyProducts(filterParams, sortParams) {
  let products = getLocalProducts();

  // Filter
  if (filterParams) {
    if (filterParams.category && filterParams.category.length > 0) {
      products = products.filter((p) => filterParams.category.includes(p.category));
    }
    if (filterParams.brand && filterParams.brand.length > 0) {
      products = products.filter((p) => filterParams.brand.includes(p.brand));
    }
  }

  // Sort
  if (sortParams) {
    if (sortParams === "price-lowtohigh") {
      products.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    } else if (sortParams === "price-hightolow") {
      products.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    } else if (sortParams === "title-atoz") {
      products.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortParams === "title-ztoa") {
      products.sort((a, b) => b.title.localeCompare(a.title));
    }
  }

  return products;
}

const initialState = {
  isLoading: false,
  productList: getLocalProducts(),
  productDetails: null,
  recommendedProducts: [],
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams } = {}) => {
    try {
      const query = new URLSearchParams({
        ...filterParams,
        sortBy: sortParams,
      });

      const result = await axios.get(`/api/shop/products/get?${query}`);

      if (result?.data?.success && result.data.data && result.data.data.length > 0) {
        return result.data;
      }
      return { success: true, data: getFilteredSortedDummyProducts(filterParams, sortParams) };
    } catch (error) {
      console.warn("API error, falling back to dummy products:", error);
      return { success: true, data: getFilteredSortedDummyProducts(filterParams, sortParams) };
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    try {
      const result = await axios.get(`/api/shop/products/get/${id}`);
      if (result?.data?.success) {
        return result.data;
      }
      const products = getLocalProducts();
      return { success: true, data: products.find((p) => p._id === id) || null };
    } catch (error) {
      console.warn("API error, falling back to dummy product details:", error);
      const products = getLocalProducts();
      return { success: true, data: products.find((p) => p._id === id) || null };
    }
  }
);

export const fetchRecommendedProducts = createAsyncThunk(
  "/products/fetchRecommendedProducts",
  async (category) => {
    try {
      const result = await axios.get(`/api/shop/products/get?category=${category}`);
      if (result?.data?.success && result.data.data && result.data.data.length > 0) {
        return result.data;
      }
      const products = getLocalProducts();
      return { success: true, data: products.filter((p) => p.category === category) };
    } catch (error) {
      console.warn("API error, falling back to recommended dummy products:", error);
      const products = getLocalProducts();
      return { success: true, data: products.filter((p) => p.category === category) };
    }
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = getLocalProducts();
      })
      .addCase(fetchProductDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
      })
      .addCase(fetchRecommendedProducts.fulfilled, (state, action) => {
        state.recommendedProducts = action.payload.data;
      });
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
