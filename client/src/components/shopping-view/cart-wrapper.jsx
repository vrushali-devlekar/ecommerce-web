import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { ShoppingBag, ArrowRight } from "lucide-react";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  return (
    <SheetContent className="flex flex-col h-full sm:max-w-md p-0 border-l border-border bg-background">
      <SheetHeader className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5" />
            <SheetTitle className="text-xl font-serif font-bold uppercase tracking-widest">Your Bag</SheetTitle>
            <span className="text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-bold ml-auto">
                {cartItems.length} ITEMS
            </span>
        </div>
      </SheetHeader>
      
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar">
        {cartItems && cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.productId} className="animate-in slide-in-from-right-4 duration-300">
                <UserCartItemsContent cartItem={item} />
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-50">
            <ShoppingBag className="w-12 h-12 stroke-[1]" />
            <p className="font-serif italic text-sm">Your bag is as light as air. Start exploring.</p>
          </div>
        )}
      </div>

      <div className="p-6 bg-muted/30 border-t border-border space-y-6">
        <div className="space-y-3">
            <div className="flex justify-between text-xs uppercase tracking-widest text-muted-foreground">
                <span>Subtotal</span>
                <span>₹{totalCartAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs uppercase tracking-widest text-muted-foreground">
                <span>Shipping</span>
                <span className="text-green-600 font-bold italic">FREE</span>
            </div>
            <div className="pt-3 border-t border-border/50 flex justify-between items-center">
                <span className="text-sm font-bold uppercase tracking-[0.2em]">Total Estimate</span>
                <span className="text-2xl font-bold tracking-tighter">
                    ₹{totalCartAmount.toFixed(2)}
                </span>
            </div>
        </div>
        
        <Button
          onClick={() => {
            navigate("/shop/checkout");
            setOpenCartSheet(false);
          }}
          className="w-full group bg-primary text-primary-foreground hover:bg-zinc-900 hover:text-white rounded-none py-8 text-xs font-bold uppercase tracking-[.3em] transition-all duration-300 shadow-xl"
          disabled={cartItems.length === 0}
        >
          Proceed to Checkout
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
        <p className="text-[9px] uppercase tracking-[0.2em] text-center text-muted-foreground font-bold">
            Compimentary shipping on all orders &bull; 14-day returns
        </p>
      </div>
    </SheetContent>
  );
}

export default UserCartWrapper;
