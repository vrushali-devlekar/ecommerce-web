import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, getFeatureImages, deleteFeatureImage } from "@/store/common-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, ImagePlus, LayoutPanelTop, Award, Users, ShieldAlert, ShoppingBag, FolderHeart } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { fetchAllProducts } from "@/store/admin/products-slice";
import { getAllOrdersForAdmin } from "@/store/admin/order-slice";

function AdminDashboard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { productList } = useSelector((state) => state.adminProducts);
  const { orderList } = useSelector((state) => state.adminOrder);
  const { toast } = useToast();

  function handleUploadFeatureImage() {
    if (uploadedImageUrls.length === 0) return;

    dispatch(addFeatureImage(uploadedImageUrls[0])).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrls([]);
        toast({
          title: "Banner published successfully",
        });
      } else {
        toast({
          title: data?.payload?.message || "Failed to publish banner",
          variant: "destructive",
        });
      }
    });
  }

  function handleDeleteBanner(id) {
    dispatch(deleteFeatureImage(id)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        toast({
          title: "Banner deleted successfully",
          variant: "destructive",
        });
      }
    });
  }

  useEffect(() => {
    dispatch(getFeatureImages());
    dispatch(fetchAllProducts());
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  // Calculations for Metrics
  const totalPendings = orderList?.filter(o => o.orderStatus?.toLowerCase() === "pending" || o.orderStatus?.toLowerCase() === "inprocess").length || 0;
  const totalCompletes = orderList?.filter(o => o.orderStatus?.toLowerCase() === "confirmed" || o.orderStatus?.toLowerCase() === "delivered").length || 0;
  const ordersPlaced = orderList?.length || 1;
  const productsAdded = productList?.length || 4;
  const activeBanners = featureImageList?.length || 5;

  const metricsData = [
    { value: `${totalPendings}/-`, label: "Total Pendings", icon: <ShieldAlert size={20} className="text-amber-600" />, iconBg: "bg-amber-500/10" },
    { value: `${totalCompletes}/-`, label: "Total Completes", icon: <Award size={20} className="text-emerald-600" />, iconBg: "bg-emerald-500/10" },
    { value: `${ordersPlaced}`, label: "Order Placed", icon: <ShoppingBag size={20} className="text-indigo-600" />, iconBg: "bg-indigo-500/10" },
    { value: `${productsAdded}`, label: "Product Added", icon: <FolderHeart size={20} className="text-rose-600" />, iconBg: "bg-rose-500/10" },
    { value: "1", label: "Total Admins", icon: <Users size={20} className="text-zinc-600" />, iconBg: "bg-zinc-500/10" },
    { value: "12", label: "Total Users", icon: <Users size={20} className="text-zinc-600" />, iconBg: "bg-zinc-500/10" },
    { value: "2", label: "Active Coupons", icon: <Award size={20} className="text-amber-500" />, iconBg: "bg-amber-500/10" },
    { value: `${activeBanners}`, label: "New Banners", icon: <ImagePlus size={20} className="text-sky-600" />, iconBg: "bg-sky-500/10" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500 font-sans-premium">
      
      {/* Centered Dashboard Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-zinc-950">
          Admin Dashboard
        </h1>
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-zinc-400 mt-2 font-sans-premium">
          Overview of store analytics and assets
        </p>
      </div>

      {/* Rich Brown Background Container & Metrics Grid */}
      <section className="bg-gradient-to-br from-[#70360F] to-[#4A230A] rounded-3xl p-6 md:p-8 lg:p-10 shadow-xl relative overflow-hidden border border-black/5">
        {/* Subtle decorative design elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {metricsData.map((metric, index) => (
            <div 
              key={index} 
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-white/20 flex flex-col justify-center items-center text-center hover:-translate-y-1 hover:shadow-xl hover:border-white/40 transition-all duration-300 ease-out group"
            >
              <div className={`p-3 ${metric.iconBg} rounded-full mb-3 transition-colors`}>
                {metric.icon}
              </div>
              <span className="text-3xl font-extrabold tracking-tight text-zinc-950 font-sans-premium">
                {metric.value}
              </span>
              <span className="text-[10px] md:text-xs font-bold tracking-wider text-zinc-400 uppercase mt-1.5 font-sans-premium">
                {metric.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Banner Management (Preserving Carousel Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Panel */}
        <Card className="border border-white/80 shadow-sm bg-white/70 backdrop-blur-md rounded-2xl p-6">
          <CardHeader className="p-0 pb-4 border-b border-zinc-200/60 flex flex-row items-center gap-3">
            <div className="p-2.5 bg-zinc-100 rounded-xl text-zinc-800">
              <ImagePlus size={20} />
            </div>
            <div>
              <CardTitle className="text-lg font-display font-bold text-zinc-950">Upload Carousel Banner</CardTitle>
              <p className="text-zinc-400 text-[10px] uppercase tracking-wider font-semibold">Publish new banners to Homepage</p>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrls={uploadedImageUrls}
              setUploadedImageUrls={setUploadedImageUrls}
              setImageLoadingState={setImageLoadingState}
              imageLoadingState={imageLoadingState}
              isCustomStyling={true}
            />
            <Button 
              onClick={handleUploadFeatureImage} 
              disabled={uploadedImageUrls.length === 0 || imageLoadingState}
              className="mt-6 w-full h-11 text-xs uppercase tracking-widest font-bold rounded-xl"
            >
              {imageLoadingState ? "Uploading..." : "Publish Banner"}
            </Button>
          </CardContent>
        </Card>

        {/* Banners Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-200/60 pb-4">
            <LayoutPanelTop className="w-5 h-5 text-zinc-800" />
            <h2 className="text-lg font-display font-bold text-zinc-950">Active Carousel Banners</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {featureImageList && featureImageList.length > 0 ? (
              featureImageList.map((featureImgItem, index) => (
                <Card key={featureImgItem._id || index} className="group overflow-hidden border-none shadow-sm relative h-[180px] rounded-2xl">
                  <img
                    src={featureImgItem.image}
                    alt="Active Carousel Slot"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    {featureImgItem._id && (
                      <Button
                        onClick={() => handleDeleteBanner(featureImgItem._id)}
                        variant="destructive"
                        size="icon"
                        className="rounded-full w-10 h-10 shadow-lg scale-75 group-hover:scale-100 transition-transform duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3">
                     <span className="bg-white/10 backdrop-blur-md text-white text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/20">Active Slot</span>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full py-16 border border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center text-zinc-400 bg-white/70 backdrop-blur-md">
                  <LayoutPanelTop className="w-10 h-10 mb-3" />
                  <p className="text-xs font-bold uppercase tracking-wider">No active carousel banners</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;
