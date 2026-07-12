import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import AdminCoupons from "./pages/admin-view/coupons";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingProductDetails from "./pages/shopping-view/product-details";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";
import Loader from "./components/common/loader";
import ContactUs from "./pages/shopping-view/contact";
import FAQ from "./pages/shopping-view/faq";
import ShippingAndReturns from "./pages/shopping-view/returns";
import SizeGuide from "./pages/shopping-view/size-guide";
import ScrollToTop from "./components/common/scroll-to-top";
import WishlistPage from "./pages/shopping-view/wishlist";
import AboutUs from "./pages/shopping-view/about";
import Blog from "./pages/shopping-view/blog";


function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  const location = useLocation();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Loader />;


  return (
    <div className="flex flex-col overflow-hidden bg-background text-foreground min-h-screen">
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col"
        >
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <CheckAuth
                  isAuthenticated={isAuthenticated}
                  user={user}
                ></CheckAuth>
              }
            />
            <Route
              path="/auth"
              element={
                <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                  <AuthLayout />
                </CheckAuth>
              }
            >
              <Route path="login" element={<AuthLogin />} />
              <Route path="register" element={<AuthRegister />} />
            </Route>
            <Route
              path="/admin"
              element={
                <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                  <AdminLayout />
                </CheckAuth>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="features" element={<AdminFeatures />} />
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="users" element={null} />
              <Route path="messages" element={null} />
              <Route path="blog" element={null} />
              <Route path="newsletter" element={null} />
            </Route>
            <Route
              path="/shop"
              element={
                <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                  <ShoppingLayout />
                </CheckAuth>
              }
            >
              <Route path="home" element={<ShoppingHome />} />
              <Route path="listing" element={<ShoppingListing />} />
              <Route path="product/:id" element={<ShoppingProductDetails />} />
              <Route path="checkout" element={<ShoppingCheckout />} />
              <Route path="account" element={<ShoppingAccount />} />
              <Route path="payment-success" element={<PaymentSuccessPage />} />
              <Route path="search" element={<SearchProducts />} />
              <Route path="contact" element={<ContactUs />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="returns" element={<ShippingAndReturns />} />
              <Route path="size-guide" element={<SizeGuide />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="about" element={<AboutUs />} />
              <Route path="blog" element={<Blog />} />
            </Route>
            <Route path="/unauth-page" element={<UnauthPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
