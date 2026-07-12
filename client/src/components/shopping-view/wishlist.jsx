import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchWishlistItems, deleteWishlistItem } from "@/store/shop/wishlist-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

function UserWishlist() {
  const { user } = useSelector((state) => state.auth);
  const { wishlistItems, isLoading } = useSelector((state) => state.shopWishlist);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchWishlistItems(user?.id));
    }
  }, [dispatch, user]);

  function handleRemoveFromWishlist(productId) {
    dispatch(deleteWishlistItem({ userId: user?.id, productId })).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Removed from favorites",
          variant: "default",
        });
      }
    });
  }

  function handleAddToCart(productId) {
    // Note: This matches the basic addToCart. Future enhancement: add size selection here too.
    dispatch(
      addToCart({
        userId: user?.id,
        productId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Added to your bag",
          variant: "default",
        });
      }
    });
  }

  if (isLoading && !wishlistItems?.items?.length) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        {!wishlistItems?.items?.length ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-3xl bg-muted/20 border border-border/50">
            <ShoppingBag className="w-12 h-12 mb-6 text-muted-foreground opacity-30" strokeWidth={1} />
            <p className="text-xl font-serif italic text-muted-foreground mb-8 text-center px-4">Your collection is empty.</p>
            <Button asChild variant="outline" className="rounded-none px-12 uppercase tracking-[0.2em] text-[10px] font-bold">
              <Link to="/shop/listing">Explore Products</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.items.map((item, index) => (
              <Card 
                key={item.productId} 
                className="border-none shadow-none bg-transparent group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link to={`/shop/product/${item.productId}`}>
                    <div className="relative overflow-hidden mb-4 aspect-[4/5] bg-muted/20">
                    <img
                        src={typeof item.image === 'string' ? item.image : item.image?.url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                    />
                    {item.salePrice > 0 && (
                        <Badge className="absolute top-0 left-0 bg-red-600 text-white rounded-none uppercase text-[8px] tracking-[0.2em] px-3 py-1.5 font-bold shadow-lg">
                        OFFER
                        </Badge>
                    )}
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveFromWishlist(item.productId);
                        }}
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-background/80 backdrop-blur-md border border-border/50 hover:bg-destructive hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 rounded-full z-10"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                    </div>
                </Link>
                <CardContent className="p-0 text-left">
                  <Link to={`/shop/product/${item.productId}`}>
                    <h3 className="font-serif font-bold text-base mb-1 tracking-tight text-foreground line-clamp-1 hover:text-primary transition-colors cursor-pointer">
                        {item.title}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`${item.salePrice > 0 ? "line-through text-muted-foreground/60 text-xs" : "text-foreground text-sm"} font-semibold`}>
                      ₹{item.price}
                    </span>
                    {item.salePrice > 0 && (
                      <span className="text-red-500 dark:text-red-400 font-bold tracking-tighter text-base">₹{item.salePrice}</span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-0">
                  <Button 
                    onClick={() => handleAddToCart(item.productId)}
                    className="w-full rounded-none h-12 bg-primary text-primary-foreground hover:bg-zinc-900 transition-all duration-500 uppercase tracking-[0.2em] text-[9px] font-bold shadow-lg"
                  >
                    Acquire Item
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
    </div>
  );
}

export default UserWishlist;
