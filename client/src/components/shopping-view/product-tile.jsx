import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "@/config";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist } from "@/store/shop/wishlist-slice";
import { useToast } from "../ui/use-toast";

function ShoppingProductTile({
  product,
  handleAddtoCart,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();

  function handleAddToWishlist(productId) {
    if (!user) {
      toast({
        title: "Please login to add to wishlist",
        variant: "destructive",
      });
      return;
    }
    dispatch(
      addToWishlist({
        userId: user?.id,
        productId,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Product added to wishlist",
        });
      } else {
        toast({
          title: data?.payload?.message || "Error occurred",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Card className="w-full max-w-sm mx-auto border-none shadow-none group bg-background flex flex-col h-full justify-between">
      <div
        onClick={() => navigate(`/shop/product/${product?._id}`)}
        className="cursor-pointer flex-1 flex flex-col"
      >
        <div className="relative overflow-hidden mb-4 rounded-md">
          <img
            src={(typeof product?.image === 'string' ? product?.image : product?.image?.url) || "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500&q=80"}
            alt={product?.title}
            className="w-full h-[400px] object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500&q=80";
            }}
          />
          {!product?.inStock ? (
            <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-700 text-white px-2 py-1 uppercase text-xs tracking-wider">
              Out Of Stock
            </Badge>
          ) : product?.stockStatus === 'low_stock' ? (
            <Badge className="absolute top-3 left-3 bg-red-600 hover:bg-red-700 text-white px-2 py-1 uppercase text-xs tracking-wider">
              {`Low Stock`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-3 left-3 bg-primary hover:bg-primary/90 text-primary-foreground px-2 py-1 uppercase text-xs tracking-wider">
              Sale
            </Badge>
          ) : null}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToWishlist(product?._id);
            }}
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-secondary/80 backdrop-blur-md border border-border/50 hover:bg-white dark:hover:bg-zinc-800 text-red-500 transition-all z-10 rounded-full"
          >
            <Heart className="w-5 h-5 fill-red-500/10" />
          </Button>
        </div>
        <CardContent className="p-0 text-center flex-1 flex flex-col justify-between mb-4">
          <div className="space-y-1">
            <h2 className="text-lg font-serif font-bold group-hover:text-muted-foreground transition-colors line-clamp-2 min-h-[56px] flex items-center justify-center px-2">
              {product?.title}
            </h2>
            <div className="flex justify-center items-center space-x-2">
              <span className="text-[12px] text-muted-foreground uppercase tracking-wider">
                {categoryOptionsMap[product?.category]}
              </span>
              <span className="text-[12px] text-muted-foreground uppercase tracking-wider">
                {brandOptionsMap[product?.brand]}
              </span>
            </div>
          </div>
          <div className="flex justify-center items-center mt-3 space-x-3">
            <span
              className={`${product?.salePrice > 0 ? "line-through text-muted-foreground" : "text-foreground"
                } text-lg font-medium`}
            >
              ₹{product?.price}
            </span>
            {product?.salePrice > 0 ? (
              <span className="text-lg font-medium text-red-600">
                ₹{product?.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter className="p-0 mt-auto">
        {!product?.inStock ? (
          <Button className="w-full uppercase tracking-wider opacity-60 cursor-not-allowed">
            Out Of Stock
          </Button>
        ) : (
          <Button
            onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
            className="w-full uppercase tracking-wide bg-primary text-primary-foreground hover:bg-zinc-900 hover:text-white transition-colors rounded-none font-bold py-6"
          >
            Add to Bag
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default ShoppingProductTile;
