import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { fetchProductDetails, setProductDetails, fetchRecommendedProducts } from "@/store/shop/products-slice";
import { Label } from "@/components/ui/label";
import StarRatingComponent from "@/components/common/star-rating";
import { useEffect, useState, useRef } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { useParams, useNavigate } from "react-router-dom";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { motion } from "framer-motion";
import { ChevronLeft, ShoppingBag, Star, Share2, ShieldCheck, Truck, RefreshCw, Palette } from "lucide-react";

function ShoppingProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [activeImage, setActiveImage] = useState("");
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });
  const containerRef = useRef(null);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { productDetails, isLoading, recommendedProducts } = useSelector((state) => state.shopProducts);

  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchProductDetails(id));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      dispatch(setProductDetails());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (productDetails) {
      dispatch(getReviews(productDetails?._id));
      dispatch(fetchRecommendedProducts(productDetails?.category));
      setActiveImage(typeof productDetails?.image === 'string' ? productDetails?.image : productDetails?.image?.url);
    }
  }, [productDetails, dispatch]);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    if (!user) {
        toast({
            title: "Please login to add to bag",
            variant: "destructive"
        });
        return;
    }
    
    let getCartItems = cartItems?.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Maximum quantity reached`,
            description: `Only ${getQuantity} available in stock.`,
            variant: "destructive",
          });
          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Added to Bag",
          description: `${productDetails?.title} added to your collection.`,
        });
      }
    });
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
          title: "Thank you for the journal entry",
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

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background">
        <div className="relative w-20 h-20 mb-4">
             <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
             <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin" />
        </div>
        <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-muted-foreground animate-pulse">Refining Excellence...</p>
      </div>
    );
  }

  if (!productDetails) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
        <h2 className="text-4xl font-serif font-bold mb-4 italic">Piece Missing</h2>
        <p className="text-muted-foreground mb-8">The requested item could not be retrieved from our archives.</p>
        <Button onClick={() => navigate('/shop/listing')} variant="outline" className="rounded-none uppercase tracking-widest text-[10px] px-12 py-6">Return to Shop</Button>
      </div>
    );
  }

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      reviews.length
      : 0;

  const otherImages = productDetails?.images || [];
  const allImageUrls = [productDetails?.image, ...otherImages].map(img => typeof img === 'string' ? img : img?.url).filter(Boolean);

  return (
    <div className="min-h-screen bg-background text-foreground pt-10 pb-32">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* NAV BAR */}
        <div className="flex items-center justify-between mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
           <Button
             variant="ghost"
             onClick={() => navigate(-1)}
             className="text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-transparent hover:opacity-100 group flex items-center p-0"
           >
             <ChevronLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
             Back to Collection
           </Button>
           <div className="flex items-center gap-6">
              <button className="text-muted-foreground hover:text-foreground transition-colors"><Share2 className="w-4 h-4" /></button>
              <button className="text-muted-foreground hover:text-foreground transition-colors"><Palette className="w-4 h-4" /></button>
           </div>
        </div>

        {/* MAIN PRODUCT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 mb-40">
          
          {/* LEFT: IMAGE GALLERY (PINNED ON DESKTOP) */}
          <div className="lg:col-span-7 space-y-8">
             <div className="flex flex-col-reverse lg:flex-row gap-6">
                {/* Thumbnails */}
                <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-hide">
                    {allImageUrls.map((img, idx) => (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={idx}
                        onClick={() => setActiveImage(img)}
                        className={`relative w-24 h-32 flex-shrink-0 cursor-pointer overflow-hidden transition-all duration-500 border-2 ${activeImage === img ? 'border-primary' : 'border-transparent opacity-50 hover:opacity-100'}`}
                    >
                        <img src={img} className="w-full h-full object-cover" alt={`view-${idx}`} />
                    </motion.div>
                    ))}
                </div>

                {/* Main Image View */}
                <div className="flex-1 relative group">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        ref={containerRef}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setZoomStyle({ ...zoomStyle, display: 'none' })}
                        className="relative aspect-[4/5] bg-muted overflow-hidden rounded-none cursor-crosshair shadow-2xl"
                    >
                        <img
                            src={activeImage}
                            alt={productDetails?.title}
                            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                        />
                        <div
                            className="absolute inset-0 pointer-events-none hidden group-hover:block transition-all duration-300"
                            style={zoomStyle}
                        />
                         {productDetails?.totalStock < 10 && (
                            <div className="absolute top-6 left-6 bg-red-600 text-white text-[9px] font-bold uppercase tracking-[0.3em] px-4 py-2 shadow-xl">
                                Limited Stock
                            </div>
                        )}
                    </motion.div>
                </div>
             </div>
          </div>

          {/* RIGHT: PRODUCT INFO (SCROLLS ON DESKTOP) */}
          <div className="lg:col-span-5 flex flex-col pt-4">
             <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-10"
             >
                {/* Branding & Title */}
                <div className="space-y-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary block leading-none">
                        High-End Atelier
                    </span>
                    <h1 className="text-5xl xl:text-6xl font-serif font-bold tracking-tighter text-foreground leading-[1.05]">
                        {productDetails?.title}
                    </h1>
                    <div className="flex items-center gap-6 pt-2">
                        <div className="flex items-center gap-1.5">
                            {[1,2,3,4,5].map((s) => (
                                <Star key={s} className={`w-3.5 h-3.5 ${s <= averageReview ? "fill-primary text-primary" : "text-muted-foreground/30"}`} />
                            ))}
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground border-l border-border pl-6">
                            {reviews.length} Client Journals
                        </span>
                    </div>
                </div>

                {/* Pricing */}
                <div className="flex items-center gap-8">
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-1">MSRP</span>
                        <span className={`text-2xl font-bold tracking-tight ${productDetails?.salePrice > 0 ? "text-muted-foreground/40 line-through" : "text-foreground"}`}>
                            ₹{productDetails?.price}
                        </span>
                    </div>
                    {productDetails?.salePrice > 0 && (
                        <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-widest text-red-600 font-bold mb-1">Season Offer</span>
                            <span className="text-4xl font-bold tracking-tighter text-red-600 dark:text-red-400">
                                ₹{productDetails?.salePrice}
                             </span>
                        </div>
                    )}
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-lg leading-relaxed font-serif italic border-l-2 border-primary/45 pl-8 py-1">
                    {productDetails?.description}
                </p>

                {/* Actions */}
                <div className="space-y-6 pt-6 font-sans">
                    <Button
                        disabled={productDetails?.totalStock === 0}
                        onClick={() => {
                            handleAddToCart(productDetails?._id, productDetails?.totalStock)
                        }}
                        className="w-full h-24 bg-primary text-primary-foreground hover:bg-[#2c2323] transition-all duration-700 rounded-none uppercase tracking-[0.5em] text-[11px] font-black shadow-2xl relative group overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-4">
                            <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                            {productDetails?.totalStock === 0 ? "Sold Out Globally" : "Acquire Piece"}
                        </span>
                        <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </Button>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-6 pt-10">
                        <div className="flex flex-col items-center gap-3 text-center">
                            <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                                <Truck className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                            </div>
                            <span className="text-[8px] uppercase tracking-widest font-bold text-muted-foreground">Global Expedited</span>
                        </div>
                        <div className="flex flex-col items-center gap-3 text-center">
                            <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                                <ShieldCheck className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                            </div>
                            <span className="text-[8px] uppercase tracking-widest font-bold text-muted-foreground">Authentic Source</span>
                        </div>
                        <div className="flex flex-col items-center gap-3 text-center">
                            <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                                <RefreshCw className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                            </div>
                            <span className="text-[8px] uppercase tracking-widest font-bold text-muted-foreground">Seamless Return</span>
                        </div>
                    </div>
                </div>
             </motion.div>
          </div>
        </div>

        <Separator className="bg-border/30 mb-40" />

        {/* REVIEWS SECTION: THE JOURNAL */}
        <section className="mb-40">
           <div className="max-w-4xl mx-auto space-y-24">
                <header className="text-center space-y-6">
                    <span className="text-[10px] uppercase tracking-[0.5em] text-primary font-bold">The Archives</span>
                    <h2 className="text-5xl font-serif font-bold tracking-tighter">Verified Client Journals</h2>
                    <div className="w-16 h-px bg-primary mx-auto" />
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {reviews && reviews.length > 0 ? (
                        reviews.map((reviewItem, idx) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            key={reviewItem._id} 
                            className="bg-muted/10 border border-border/30 p-10 space-y-8 group hover:bg-muted/20 transition-all duration-500"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-12 h-12 border border-border">
                                        <AvatarFallback className="bg-background text-foreground font-bold text-xs">
                                            {reviewItem?.userName[0].toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{reviewItem?.userName}</span>
                                        <span className="text-[9px] text-muted-foreground">Certified Collector</span>
                                    </div>
                                </div>
                                <div className="flex gap-0.5 font-sans">
                                    {[1,2,3,4,5].map(s => <Star key={s} className="w-2.5 h-2.5 fill-primary text-primary" />)}
                                </div>
                            </div>
                            <p className="font-serif italic text-lg leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
                                &quot;{reviewItem.reviewMessage}&quot;
                            </p>
                        </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-border/40 rounded-sm">
                            <p className="text-muted-foreground font-serif italic uppercase tracking-widest text-xs">Awaiting the first narrative</p>
                        </div>
                    )}
                </div>

                {/* Add Journal Entry */}
                {user && (
                    <div className="bg-muted/20 p-16 border border-primary/10 space-y-12">
                        <div className="text-center font-sans">
                            <h3 className="text-2xl font-serif font-bold uppercase tracking-tight mb-2">Pen your Experience</h3>
                            <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Contribution to the Collective</p>
                        </div>
                        <div className="space-y-10">
                            <div className="flex flex-col items-center gap-4 font-sans">
                                <Label className="text-[9px] font-bold uppercase tracking-[0.4em] text-primary">Impression Rating</Label>
                                <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange} />
                            </div>
                            <div className="space-y-4 font-sans">
                                <Label className="text-[9px] font-bold uppercase tracking-[0.4em] text-primary">Your Narrative</Label>
                                <textarea
                                    className="w-full min-h-[120px] bg-background border-none p-8 text-sm focus:ring-1 focus:ring-primary/20 transition-all font-serif resize-none shadow-inner text-foreground placeholder:text-muted-foreground/60"
                                    value={reviewMsg}
                                    onChange={(event) => setReviewMsg(event.target.value)}
                                    placeholder="Describe your journey with this piece..."
                                />
                            </div>
                            <Button
                                onClick={handleAddReview}
                                disabled={reviewMsg.trim() === "" || rating === 0}
                                className="w-full h-20 bg-primary text-white hover:bg-black transition-all duration-500 rounded-none uppercase tracking-[0.4em] text-[10px] font-bold disabled:opacity-30 font-sans"
                            >
                                Publish to Archives
                            </Button>
                        </div>
                    </div>
                )}
           </div>
        </section>

        {/* RECOMMENDED PRODUCTS */}
        {recommendedProducts && recommendedProducts.length > 0 && (
          <section className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <header className="flex flex-col items-center mb-20 text-center">
              <span className="text-[10px] uppercase tracking-[0.6em] text-primary font-bold mb-4">Complementary Pieces</span>
              <h2 className="text-5xl font-serif font-bold tracking-tighter">Curated Selections</h2>
              <div className="w-12 h-px bg-primary/30 mt-8" />
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {recommendedProducts.filter(item => item._id !== id).slice(0, 4).map((item) => (
                <ShoppingProductTile
                  key={item._id}
                  product={item}
                  handleAddtoCart={handleAddToCart}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default ShoppingProductDetails;
