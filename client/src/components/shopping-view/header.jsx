import { LogOut, Menu, ShoppingBag, UserCog, Sun, Moon, Heart } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems, setCartDrawer } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { useTheme } from "../common/theme-provider";
import { fetchWishlistItems } from "@/store/shop/wishlist-slice";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    navigate(getCurrentMenuItem.path);
    window.scrollTo(0, 0);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-8 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-xs font-semibold uppercase tracking-widest cursor-pointer hover:text-muted-foreground transition-colors"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems, isOpen } = useSelector((state) => state.shopCart);
  const { wishlistItems } = useSelector((state) => state.shopWishlist);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchCartItems(user?.id));
      dispatch(fetchWishlistItems(user?.id));
    }
  }, [dispatch, isAuthenticated, user]);

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="hover:bg-transparent hover:opacity-75"
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        <span className="sr-only">Toggle theme</span>
      </Button>

      <Button
        onClick={() => navigate("/shop/wishlist")}
        variant="ghost"
        size="icon"
        className="relative hover:bg-transparent hover:opacity-75"
      >
        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
        <span className="absolute top-0 right-0 font-bold text-[10px] bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center">
          {wishlistItems?.items?.length || 0}
        </span>
        <span className="sr-only">Favorites</span>
      </Button>

      <Sheet open={isOpen} onOpenChange={() => dispatch(setCartDrawer(false))}>
        <Button
          onClick={() => dispatch(setCartDrawer(true))}
          variant="ghost"
          size="icon"
          className="relative hover:bg-transparent hover:opacity-75"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute top-0 right-0 font-bold text-[10px] bg-black text-white rounded-full w-4 h-4 flex items-center justify-center">
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={(val) => dispatch(setCartDrawer(val))}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>

      {isAuthenticated ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="bg-transparent border border-border cursor-pointer hover:bg-muted transition-colors w-9 h-9">
              <AvatarImage src={user?.image} className="object-cover" />
              <AvatarFallback className="bg-transparent text-foreground font-semibold text-xs">
                {user?.userName ? user.userName[0].toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" className="w-56 font-sans">
            <DropdownMenuLabel>Logged in as {user?.userName || "User"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/shop/account")} className="cursor-pointer">
              <UserCog className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button 
          onClick={() => navigate("/auth/login")} 
          variant="ghost" 
          className="text-xs font-semibold uppercase tracking-widest cursor-pointer hover:bg-transparent hover:text-muted-foreground transition-colors px-2"
        >
          Login
        </Button>
      )}
    </div>
  );
}

function ShoppingHeader() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
      <div className="flex h-20 items-center justify-between px-4 md:px-8">
        <div className="flex items-center lg:w-1/4">
          <Link to="/shop/home" className="flex flex-col group">
            <span className="font-sans font-bold text-2xl tracking-[-0.065em] leading-none text-foreground select-none">woodasa</span>
          </Link>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        
        <div className="hidden lg:flex flex-1 justify-center items-center">
          <MenuItems />
        </div>

        <div className="hidden lg:flex justify-end items-center lg:w-1/4">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
