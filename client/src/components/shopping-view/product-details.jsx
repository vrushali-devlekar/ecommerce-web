import { StarIcon, Heart } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems, setCartDrawer } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState, useRef } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { addToWishlist } from "@/store/shop/wishlist-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [activeImage, setActiveImage] = useState("");
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const containerRef = useRef(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  const { toast } = useToast();

  useEffect(() => {
    if (productDetails) {
      setActiveImage(typeof productDetails?.image === 'string' ? productDetails?.image : productDetails?.image?.url);
    }
  }, [productDetails]);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }
    if (productDetails?.colors?.length > 0 && !selectedColor) {
      toast({
        title: "Please select a color",
        variant: "destructive",
      });
      return;
    }

    if (productDetails?.sizes?.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
        color: selectedColor,
        size: selectedSize,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        setOpen(false); // Close the dialog
        dispatch(setCartDrawer(true)); // Open the cart drawer
        toast({
          title: "Product is added to cart",
        });
        setSelectedColor("");
        setSelectedSize("");
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      }
    });
  }

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

  function handleMouseMove(e) {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${activeImage})`,
      backgroundSize: `${width * 2}px ${height * 2}px`
    });
  }

  function handleMouseLeave() {
    setZoomStyle({ display: 'none' });
  }

  useEffect(() => {
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  const otherImages = productDetails?.images || [];
  const allImageUrls = [productDetails?.image, ...otherImages].map(img => typeof img === 'string' ? img : img?.url).filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-0 max-w-[95vw] sm:max-w-[90vw] lg:max-w-[1100px] overflow-hidden rounded-none border-none">
        <div className="flex flex-col md:flex-row gap-4 h-full bg-muted/10 p-4">
           {/* THUMBNAILS */}
           <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-x-visible">
              {allImageUrls.map((img, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-16 h-16 border cursor-pointer overflow-hidden transition-all ${activeImage === img ? 'border-primary ring-1 ring-primary' : 'border-border/50 opacity-50 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="thumb" />
                </div>
              ))}
           </div>

           {/* MAIN IMAGE WITH ZOOM */}
           <div 
             ref={containerRef}
             onMouseMove={handleMouseMove}
             onMouseLeave={handleMouseLeave}
             className="relative flex-1 aspect-square md:aspect-auto overflow-hidden bg-background cursor-crosshair group order-1 md:order-2"
           >
              <img
                src={activeImage}
                alt={productDetails?.title}
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
              />
              <div 
                className="absolute inset-0 pointer-events-none hidden group-hover:block transition-opacity duration-300"
                style={zoomStyle}
              />
           </div>
        </div>
        
        <div className="flex flex-col p-6 md:p-10 overflow-y-auto max-h-[90vh]">
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">{productDetails?.title}</h1>
            <div className="flex items-center gap-3">
              <StarRatingComponent rating={averageReview} />
                <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                  ({reviews.length} Reviews)
                </span>
                <Button
                  onClick={() => handleAddToWishlist(productDetails?._id)}
                  variant="ghost"
                  size="icon"
                  className="ml-auto bg-secondary/80 backdrop-blur-md border border-border/50 hover:bg-white dark:hover:bg-zinc-800 text-red-500 transition-all z-10 rounded-full"
                >
                  <Heart className="w-5 h-5 fill-red-500/10" />
                </Button>
              </div>
            </div>

          <div className="mb-6 p-4 bg-muted/50 border-l-2 border-primary italic font-serif text-sm leading-relaxed text-foreground">
            {productDetails?.description}
          </div>

          <div className="flex items-baseline gap-4 mb-8">
            <span className={`text-2xl font-bold tracking-tighter ${productDetails?.salePrice > 0 ? "text-muted-foreground line-through" : "text-foreground"}`}>
              ${productDetails?.price}
            </span>
            {productDetails?.salePrice > 0 && (
              <span className="text-3xl font-bold tracking-tighter text-red-600">
                ${productDetails?.salePrice}
              </span>
            )}
          </div>

          <div className="mb-10">
            {productDetails?.stockStatus === 'low_stock' && (
              <p className="text-red-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-4 animate-pulse">
                🔥 Only {productDetails?.totalStock} left! Grab yours now
              </p>
            )}
            {!productDetails?.inStock ? (
              <Button className="w-full h-14 bg-muted text-muted-foreground cursor-not-allowed rounded-none uppercase tracking-widest font-bold text-xs">
                Sold Out
              </Button>
            ) : (
              <Button
                className="w-full h-14 bg-primary text-primary-foreground hover:bg-zinc-900 hover:text-white rounded-none uppercase tracking-[0.2em] font-bold text-[10px] transition-all duration-300"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Bag
              </Button>
            )}
          </div>
          
          {/* COLOR SWATCHES */}
          {productDetails?.colors && productDetails?.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Color: <span className="text-muted-foreground">{selectedColor || "Select Color"}</span></h3>
              <div className="flex flex-wrap gap-2">
                {productDetails.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border text-[10px] font-bold uppercase tracking-widest transition-all ${selectedColor === color ? 'border-primary bg-primary text-primary-foreground' : 'border-border/50 hover:border-primary opacity-80'}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SIZE SWATCHES */}
          {productDetails?.sizes && productDetails?.sizes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Size: <span className="text-muted-foreground">{selectedSize || "Select Size"}</span></h3>
              <div className="flex flex-wrap gap-2">
                {productDetails.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 border flex items-center justify-center text-[10px] font-bold uppercase tracking-widest transition-all ${selectedSize === size ? 'border-primary bg-primary text-primary-foreground' : 'border-border/50 hover:border-primary opacity-80'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Separator className="bg-border/50 mb-10" />

          <div className="mt-4">
            <h2 className="text-xl font-serif font-bold mb-6 tracking-tight flex items-center gap-2">
               CUSTOMER FEEDBACK
               <div className="h-px bg-border flex-1" />
            </h2>
            <div className="space-y-6 mb-10">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div key={reviewItem._id} className="flex gap-4 items-start border-b border-border/10 pb-6">
                    <Avatar className="w-10 h-10 border border-zinc-200">
                      <AvatarFallback className="bg-muted text-foreground font-bold text-xs">
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-[10px] uppercase tracking-widest">{reviewItem?.userName}</h3>
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed font-serif italic">
                        "{reviewItem.reviewMessage}"
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-muted-foreground font-serif text-sm italic">
                  No reviews yet.
                </div>
              )}
            </div>

            <div className="bg-muted/30 p-6 border border-border/50 flex flex-col gap-6 rounded-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest">Write a review</h3>
              <div className="flex flex-col gap-4">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <div className="flex flex-col gap-4">
                <textarea
                  className="min-h-[100px] p-4 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary/20 text-xs transition-all resize-none"
                  value={reviewMsg}
                  onChange={(event) => setReviewMsg(event.target.value)}
                  placeholder="Your experience..."
                />
              </div>
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === "" || rating === 0}
                className="bg-primary text-primary-foreground hover:bg-zinc-900 hover:text-white rounded-none uppercase tracking-widest py-6 text-[10px] font-bold"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
