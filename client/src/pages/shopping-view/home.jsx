import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Leaf,
  Brush,
  Utensils,
  Home,
  Flower,
  TreePine,
  TreeDeciduous,
  Sparkles,
  Truck,
  ShieldCheck,
  Headphones,
} from "lucide-react";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { getFeatureImages } from "@/store/common-slice";
import hero1 from "@/assets/hero-1.png";
import hero2 from "@/assets/hero-2.png";
import hero3 from "@/assets/hero-3.png";

const dummyBanners = [
  {
    image: hero1,
    bgClass: "bg-[#d5ecd4]",
    subTitle: "Test the Quality",
    title: "Organic Premium Product",
    description: "eco-friendly Organic Products , bamboo brushes, neem combs, organic oils & more.",
    btnText: "SHOP NOW",
  },
  {
    image: hero2,
    bgClass: "bg-[#f3eae1]",
    subTitle: "Handcrafted Heritage",
    title: "Artisanal Kitchenware",
    description: "Made from premium Teak and Rosewood. Durable, natural, and food-safe spoons, bowls, and boards.",
    btnText: "DISCOVER MORE",
  },
  {
    image: hero3,
    bgClass: "bg-[#eae1df]",
    subTitle: "Sustainable Living",
    title: "Minimalist Home Decor",
    description: "Bring nature into your workspace with bamboo phone docks, pen stands, and custom wall clocks.",
    btnText: "BROWSE DECOR",
  },
];
const dummyProducts = [];

const categoriesWithIcon = [
  { id: "personal-care", label: "Personal Care", icon: Brush },
  { id: "kitchenware", label: "Kitchen & Dining", icon: Utensils },
  { id: "decor", label: "Home Decor & Desk", icon: Home },
];

const brandsWithIcon = [
  { id: "bamboo", label: "Bamboo", icon: Leaf },
  { id: "neem", label: "Neem Wood", icon: Flower },
  { id: "sandalwood", label: "Sandalwood", icon: TreePine },
  { id: "rosewood", label: "Rosewood", icon: TreeDeciduous },
  { id: "teak", label: "Teak Wood", icon: Sparkles },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList } = useSelector((state) => state.shopProducts);
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
    window.scrollTo(0, 0);
  }

  function handleAddtoCart(getCurrentProductId) {
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
          title: "Product added to bag",
        });
      }
    });
  }

  useEffect(() => {
    const banners = featureImageList && featureImageList.length > 0 ? featureImageList : dummyBanners;
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  const bannersToShow = featureImageList && featureImageList.length > 0 ? featureImageList : dummyBanners;

  // Add defensive check for currentSlide bounds
  const activeSlide = currentSlide % (bannersToShow.length || 1);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[70vh] md:h-[80vh] min-h-[500px] overflow-hidden">
        {bannersToShow.map((slide, index) => (
          <div
            key={index}
            className={`${
              index === activeSlide ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0"
            } absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out`}
          >
            {slide?.image ? (
              <>
                <img
                  src={slide.image}
                  className="w-full h-full object-cover object-center absolute inset-0"
                  alt={`Banner ${index + 1}`}
                />
                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute inset-0 flex items-center justify-start px-8 md:px-20">
                  <div className="max-w-2xl space-y-4 md:space-y-6 text-white">
                    <span className="text-xs md:text-sm font-semibold tracking-[0.25em] text-[#d9a014] uppercase animate-in fade-in slide-in-from-bottom-2 duration-700 block">
                      {slide?.subTitle || "Test the Quality"}
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold text-white leading-tight uppercase animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                      {slide?.title || "Organic Premium Product"}
                    </h1>
                    <p className="text-xs md:text-sm text-zinc-300 max-w-xl leading-relaxed tracking-wide animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                      {slide?.description || "eco-friendly Organic Products , bamboo brushes, neem combs, organic oils & more."}
                    </p>
                    <div className="pt-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                      <button
                        onClick={() => navigate("/shop/listing")}
                        className="bg-[#d9a014] hover:bg-[#c49012] text-white font-bold text-xs tracking-widest px-8 py-3.5 rounded-md uppercase hover:shadow-md transition-all font-sans"
                      >
                        {slide?.btnText || "SHOP NOW"}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div
                className={`w-full h-full flex flex-col justify-center items-start text-left px-8 md:px-20 relative overflow-hidden ${
                  slide?.bgClass || "bg-[#d5ecd4]"
                }`}
              >
                {/* Fallback pattern/overlay if no image */}
                <div className="absolute inset-0 bg-black/5" />
                <div className="max-w-2xl space-y-4 md:space-y-6 relative z-10 text-zinc-900">
                  <span className="text-xs md:text-sm font-semibold tracking-[0.25em] text-[#d9a014] uppercase animate-in fade-in slide-in-from-bottom-2 duration-700 block">
                    {slide?.subTitle || "Test the Quality"}
                  </span>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-extrabold text-zinc-900 leading-tight uppercase animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                    {slide?.title || "Organic Premium Product"}
                  </h1>
                  <p className="text-xs md:text-sm text-zinc-700 max-w-xl leading-relaxed tracking-wide animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                    {slide?.description ||
                      "eco-friendly Organic Products , bamboo brushes, neem combs, organic oils & more."}
                  </p>
                  <div className="pt-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <button
                      onClick={() => navigate("/shop/listing")}
                      className="bg-[#d9a014] hover:bg-[#c49012] text-white font-bold text-xs tracking-widest px-8 py-3.5 rounded-md uppercase hover:shadow-md transition-all font-sans"
                    >
                      {slide?.btnText || "SHOP NOW"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
 
        {/* Banner Navigation Bullets */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {bannersToShow.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                index === activeSlide ? "w-8 bg-[#d9a014]" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + bannersToShow.length) % bannersToShow.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-background/50 border-none hover:bg-background transition-colors z-20"
        >
          <ChevronLeftIcon className="w-5 h-5 text-foreground" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % bannersToShow.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-background/50 border-none hover:bg-background transition-colors z-20"
        >
          <ChevronRightIcon className="w-5 h-5 text-foreground" />
        </Button>
      </div>

      {/* CREATIVE OUR STORY SECTION */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-background border-b border-border/40"
      >
        <div className="container mx-auto px-4 md:px-8 max-w-[1200px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* LEFT SIDE: CREATIVE OVERLAPPING IMAGES */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              {/* Back Image (Large) */}
              <div className="w-[80%] aspect-[4/5] overflow-hidden bg-muted rounded-xl shadow-lg relative">
                <img
                  src="https://i.pinimg.com/736x/6c/4b/af/6c4baf2d72dd69b4554f9c33cf7f6640.jpg"
                  alt="Crafting woodasa products"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Front Overlapping Image (Small Offset Card) */}
              <div className="absolute bottom-[-30px] right-[5%] w-[45%] aspect-square overflow-hidden bg-white p-3 rounded-xl shadow-2xl border border-border/50 animate-in fade-in duration-1000 delay-300">
                <img
                  src="https://i.pinimg.com/736x/36/8a/18/368a18553cf7a275ed2bdd947314fb26.jpg"
                  alt="Bamboo Brushes details"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

            {/* RIGHT SIDE: EDITORIAL CONTENT */}
            <div className="lg:col-span-6 space-y-6 lg:pl-8">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#d9a014]">
                  our story
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900 tracking-tight leading-tight uppercase">
                  Production of natural daily essentials
                </h2>
              </div>
              
              <div className="w-12 h-0.5 bg-[#d9a014]" />

              <p className="text-sm text-zinc-600 leading-relaxed font-light">
                Woodasa was born from a simple observation: the everyday objects we hold should connect us to the earth, not clutter it. We hand-select sustainable organic materials—from deep Neem wood to flexible Bamboo—shaping them into minimalist daily essentials that perform beautifully and decompose naturally.
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border/50">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#d9a014]">100% Organic</span>
                  <p className="text-xs text-zinc-500 font-light">Pure, pesticide-free bamboo and neem timbers.</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#d9a014]">Artisan Made</span>
                  <p className="text-xs text-zinc-500 font-light">Each comb and brush features unique natural grains.</p>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => navigate("/shop/about")}
                  className="bg-[#d9a014] hover:bg-[#c49012] text-white font-bold text-xs tracking-widest px-8 py-4 rounded transition-all font-sans shadow-md hover:shadow-lg hover:-translate-y-0.5 transform duration-300"
                >
                  DISCOVER OUR JOURNEY
                </button>
              </div>
            </div>

          </div>
        </div>
      </motion.section>

      {/* FEATURES BANNER SECTION */}
      <section className="py-16 bg-muted/20 border-b border-border/40">
        <div className="container mx-auto px-4 md:px-8 max-w-[1200px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            
            {/* Feature 1 */}
            <div className="flex flex-col items-center space-y-3 group">
              <Truck className="w-12 h-12 text-[#d9a014] transition-transform duration-500 group-hover:-translate-y-1" strokeWidth={1.2} />
              <h3 className="font-serif font-bold text-xs uppercase tracking-[0.2em] text-zinc-900 pt-2">
                Free Shipping Fast
              </h3>
              <p className="text-[11px] text-zinc-500 max-w-[220px] leading-relaxed font-light">
                Enjoy complimentary fast delivery on all domestic orders.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center space-y-3 group">
              <ShieldCheck className="w-12 h-12 text-[#d9a014] transition-transform duration-500 group-hover:-translate-y-1" strokeWidth={1.2} />
              <h3 className="font-serif font-bold text-xs uppercase tracking-[0.2em] text-zinc-900 pt-2">
                Money Back & Guarantee
              </h3>
              <p className="text-[11px] text-zinc-500 max-w-[220px] leading-relaxed font-light">
                100% satisfaction guarantee with 30-day hassle-free returns.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center space-y-3 group">
              <Headphones className="w-12 h-12 text-[#d9a014] transition-transform duration-500 group-hover:-translate-y-1" strokeWidth={1.2} />
              <h3 className="font-serif font-bold text-xs uppercase tracking-[0.2em] text-zinc-900 pt-2">
                Online Support 24/7
              </h3>
              <p className="text-[11px] text-zinc-500 max-w-[220px] leading-relaxed font-light">
                Our dedicated support desk is ready to assist you day and night.
              </p>
            </div>

          </div>
        </div>
      </section>



      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-24 bg-background"
      >
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-center tracking-tighter uppercase mb-2">
              POPULAR PRODUCT
            </h2>
            <div className="w-20 h-0.5 bg-primary/30" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {productList && productList.length > 0
              ? productList
                  .slice(0, 4)
                  .map((productItem) => (
                    <ShoppingProductTile
                      key={productItem?._id}
                      product={productItem}
                      handleGetProductDetails={() => navigate(`/shop/product/${productItem?._id}`)}
                      handleAddtoCart={handleAddtoCart}
                    />
                  ))
              : null}
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default ShoppingHome;
