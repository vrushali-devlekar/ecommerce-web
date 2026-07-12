import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { LogOut, Menu, X, Sun, Moon, Heart, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { useToast } from "@/components/ui/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useTheme } from "../common/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// Import view components
import AdminDashboard from "../../pages/admin-view/dashboard";
import AdminProducts from "../../pages/admin-view/products";
import AdminOrders from "../../pages/admin-view/orders";
import { AdminUsers, AdminMessages, AdminBlog, AdminNewsletter } from "./mock-pages";

function AdminLayout() {
  const [currentView, setCurrentView] = useState("HOME");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { wishlistItems } = useSelector((state) => state.shopWishlist);
  const { theme, setTheme } = useTheme();

  // Sync state navigation with routing in case they refresh or navigate directly
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/admin/products")) setCurrentView("PRODUCTS");
    else if (path.includes("/admin/orders")) setCurrentView("ORDERS");
    else if (path.includes("/admin/users")) setCurrentView("USERS");
    else if (path.includes("/admin/messages")) setCurrentView("MESSAGES");
    else if (path.includes("/admin/blog")) setCurrentView("BLOG");
    else if (path.includes("/admin/newsletter")) setCurrentView("NEWSLETTER");
    else setCurrentView("HOME");
  }, [location.pathname]);

  const navLinks = [
    { label: "HOME", value: "HOME", path: "/admin/dashboard" },
    { label: "PRODUCTS", value: "PRODUCTS", path: "/admin/products" },
    { label: "ORDERS", value: "ORDERS", path: "/admin/orders" },
    { label: "USERS", value: "USERS", path: "/admin/users" },
    { label: "MESSAGES", value: "MESSAGES", path: "/admin/messages" },
    { label: "BLOG", value: "BLOG", path: "/admin/blog" },
    { label: "NEWSLETTER", value: "NEWSLETTER", path: "/admin/newsletter" },
  ];

  const handleNavClick = (link) => {
    setCurrentView(link.value);
    setIsMobileMenuOpen(false);
    navigate(link.path);
  };

  const handleLogout = () => {
    dispatch(logoutUser()).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Logged out successfully",
        });
        navigate("/auth/login");
      }
    });
  };

  const renderActiveView = () => {
    switch (currentView) {
      case "HOME":
        return <AdminDashboard />;
      case "PRODUCTS":
        return <AdminProducts />;
      case "ORDERS":
        return <AdminOrders />;
      case "USERS":
        return <AdminUsers />;
      case "MESSAGES":
        return <AdminMessages />;
      case "BLOG":
        return <AdminBlog />;
      case "NEWSLETTER":
        return <AdminNewsletter />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#FCFBFA] to-[#F4F2EE] text-zinc-900 font-sans-premium">
      
      {/* 1. Global Navigation Bar Architecture */}
      <header className="bg-white/70 backdrop-blur-md border-b border-black/5 sticky top-0 z-50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
        <div className="flex h-20 items-center justify-between px-4 md:px-8">
          
          {/* Logo (Left) */}
          <div className="flex items-center lg:w-1/4">
            <span 
              className="font-sans font-bold text-2xl tracking-[-0.065em] leading-none text-zinc-950 select-none cursor-pointer"
              onClick={() => handleNavClick(navLinks[0])}
            >
              woodasa
            </span>
          </div>

          {/* Nav Links (Center) - Desktop */}
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-8">
            {navLinks.map((link) => {
              const isActive = currentView === link.value;
              return (
                <button
                  key={link.value}
                  onClick={() => handleNavClick(link)}
                  className={`text-xs font-semibold uppercase tracking-widest cursor-pointer transition-colors ${
                    isActive
                      ? "text-[#d9a014]"
                      : "text-zinc-500 hover:text-zinc-950"
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Profile & Actions (Right) - Desktop */}
          <div className="hidden lg:flex justify-end items-center gap-4 lg:w-1/4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 hover:bg-transparent hover:opacity-75 transition-opacity text-zinc-800"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="bg-transparent border border-zinc-200 cursor-pointer hover:bg-zinc-100 transition-colors w-9 h-9">
                  <AvatarImage src={user?.image} className="object-cover" />
                  <AvatarFallback className="bg-transparent text-zinc-800 font-semibold text-xs">
                    {user?.userName ? user.userName[0].toUpperCase() : "A"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="bottom" align="end" className="w-56 font-sans">
                <DropdownMenuLabel>Logged in as {user?.userName || "Admin"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/shop/home")} className="cursor-pointer">
                  Go to Storefront
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-zinc-600 hover:text-zinc-950"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-600 hover:bg-zinc-100 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-zinc-200 bg-white overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-2">
                {navLinks.map((link) => {
                  const isActive = currentView === link.value;
                  return (
                    <button
                      key={link.value}
                      onClick={() => handleNavClick(link)}
                      className={`block w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all font-sans-premium ${
                        isActive
                          ? "bg-[#d9a014]/10 text-[#d9a014]"
                          : "text-zinc-600 hover:bg-zinc-50/50 hover:text-zinc-950"
                      }`}
                    >
                      {link.label}
                    </button>
                  );
                })}
                <div className="border-t border-zinc-100 pt-4 flex gap-3 items-center">
                  <Avatar className="bg-transparent border border-zinc-200 w-9 h-9">
                    <AvatarImage src={user?.image} className="object-cover" />
                    <AvatarFallback className="bg-transparent text-zinc-800 font-semibold text-xs">
                      {user?.userName ? user.userName[0].toUpperCase() : "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-zinc-900 leading-tight">{user?.userName || "Admin"}</p>
                    <p className="text-[10px] text-zinc-400">Store Administrator</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-zinc-500 hover:text-red-600 rounded-lg hover:bg-red-50"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default AdminLayout;
