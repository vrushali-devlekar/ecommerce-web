import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchWishlistItems, deleteWishlistItem } from "@/store/shop/wishlist-slice";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingBag, Trash2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

function WishlistPage() {
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
      <div className="flex items-center justify-center min-h-[60vh] bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8 py-20">
        <header className="flex flex-col items-center mb-24 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="relative mb-6">
            <Heart className="w-12 h-12 text-red-500 fill-red-500/10 animate-pulse" strokeWidth={1} />
            <div className="absolute inset-0 blur-2xl bg-red-500/20 rounded-full -z-10" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter mb-4 text-center">Your Favorites</h1>
          <p className="text-muted-foreground text-center max-w-sm mx-auto font-medium tracking-wide border-t border-border pt-4 mt-2">
            THE CURATED EDIT
          </p>
        </header>
        
        {!wishlistItems?.items?.length ? (
          <div className="flex flex-col items-center justify-center py-32 rounded-3xl bg-secondary/5 border border-border/50 animate-in zoom-in-95 duration-700">
            <ShoppingBag className="w-12 h-12 mb-6 text-muted-foreground opacity-30" strokeWidth={1} />
            <p className="text-xl font-serif italic text-muted-foreground mb-10 text-center px-4">Your collection is waiting to be started.</p>
            <Button asChild className="rounded-none px-12 py-7 bg-primary text-primary-foreground hover:bg-primary/90 transition-all uppercase tracking-[0.2em] text-[10px] font-bold shadow-xl">
              <Link to="/shop/listing">Begin Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-16">
            {wishlistItems.items.map((item, index) => (
              <Card 
                key={item.productId} 
                className="border-none shadow-none bg-transparent group animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative overflow-hidden mb-6 aspect-[4/5] bg-muted/20">
                  <img
                    src={typeof item.image === 'string' ? item.image : item.image?.url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-110 filter brightness-[0.95] dark:brightness-[0.85] group-hover:brightness-100"
                  />
                  {item.salePrice > 0 && (
                    <Badge className="absolute top-0 left-0 bg-red-600 text-white rounded-none uppercase text-[9px] tracking-[0.2em] px-4 py-2 font-bold shadow-lg">
                      OFFER
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <Button
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 bg-background/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-border/50 hover:bg-destructive hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-2xl rounded-full"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <CardContent className="p-0 text-left">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-bold mb-2 block">Premium Selection</span>
                  <h3 className="font-serif font-bold text-lg md:text-xl mb-2 tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-4 mb-8">
                    <span className={`${item.salePrice > 0 ? "line-through text-muted-foreground/60" : "text-foreground"} font-semibold text-lg`}>
                      ₹{item.price}
                    </span>
                    {item.salePrice > 0 && (
                      <span className="text-red-500 dark:text-red-400 font-bold tracking-tighter text-xl">₹{item.salePrice}</span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-0">
                  <Button 
                    onClick={() => handleAddToCart(item.productId)}
                    className="w-full rounded-none bg-primary text-primary-foreground hover:bg-primary/80 dark:hover:bg-zinc-100 transition-all duration-500 py-7 uppercase tracking-[0.3em] text-[10px] font-bold border border-primary/5 shadow-inner"
                  >
                    Add to Bag
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default WishlistPage;
