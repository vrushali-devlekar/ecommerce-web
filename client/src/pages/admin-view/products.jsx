import ProductImageUpload from "@/components/admin-view/image-upload";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  image: null,
  images: [],
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
  colors: "",
  sizes: "",
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData: {
              ...formData,
              image: uploadedImageUrls[0] || "",
              images: uploadedImageUrls,
              colors: typeof formData.colors === 'string' ? formData.colors.split(",").map(item => item.trim()).filter(item => item !== "") : formData.colors,
              sizes: typeof formData.sizes === 'string' ? formData.sizes.split(",").map(item => item.trim()).filter(item => item !== "") : formData.sizes,
            },
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
            toast({
              title: "Product updated successfully",
            });
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrls[0] || "",
            images: uploadedImageUrls,
            colors: typeof formData.colors === 'string' ? formData.colors.split(",").map(item => item.trim()).filter(item => item !== "") : formData.colors,
            sizes: typeof formData.sizes === 'string' ? formData.sizes.split(",").map(item => item.trim()).filter(item => item !== "") : formData.sizes,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setUploadedImageUrls([]);
            setFormData(initialFormData);
            toast({
              title: "Product added successfully",
            });
          }
        });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({
          title: "Product deleted successfully",
          variant: "destructive",
        });
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview" && currentKey !== "colors" && currentKey !== "sizes")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="space-y-6 animate-in fade-in duration-500">
        
        {/* Centered Products Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-zinc-950">
            All Products
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-zinc-400 mt-2 font-sans-premium">
            Catalog inventory and visibility manager
          </p>
        </div>

        {/* Action Button: Full-width green button right above the table */}
        <button
          onClick={() => {
            setOpenCreateProductsDialog(true);
            setCurrentEditedId(null);
            setFormData(initialFormData);
            setUploadedImageUrls([]);
          }}
          className="w-full bg-[#28a745] hover:bg-[#218838] text-white font-bold py-3.5 px-4 rounded-xl uppercase tracking-widest text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 mb-6 font-sans-premium"
        >
          <Plus size={16} /> Add Product
        </button>

        {/* Clean, Bordered Data Table */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-white/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] md:text-xs uppercase tracking-widest font-bold text-zinc-400">
                  <th className="p-4 pl-6 text-center w-[100px]">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Show</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-sm text-zinc-700">
                {productList && productList.length > 0 ? (
                  productList.map((product) => {
                    const productImgUrl = (typeof product?.image === 'string' ? product?.image : product?.image?.url) || "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=100&q=80";
                    return (
                      <tr key={product._id} className="hover:bg-zinc-50/40 transition-colors">
                        
                        {/* 1. Image Thumbnail */}
                        <td className="p-4 pl-6 flex justify-center">
                          <div className="w-12 h-12 rounded-lg border border-zinc-200 overflow-hidden bg-zinc-50 flex items-center justify-center">
                            <img
                              src={productImgUrl}
                              alt={product?.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=100&q=80";
                              }}
                            />
                          </div>
                        </td>

                        {/* 2. Title */}
                        <td className="p-4 font-semibold text-zinc-900">
                          {product?.title}
                        </td>

                        {/* 3. Price */}
                        <td className="p-4 font-medium text-zinc-900">
                          ₹{product?.salePrice > 0 ? product?.salePrice : product?.price}
                        </td>

                        {/* 4. Stock */}
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${product?.totalStock > 0 ? "text-zinc-600 bg-zinc-100" : "text-red-700 bg-red-50 border border-red-200"}`}>
                            {product?.totalStock}
                          </span>
                        </td>

                        {/* 5. Show */}
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            Yes
                          </span>
                        </td>

                        {/* 6. Actions */}
                        <td className="p-4 text-right pr-6">
                          <div className="inline-flex gap-2.5">
                            <button
                              onClick={() => {
                                setOpenCreateProductsDialog(true);
                                setCurrentEditedId(product._id);
                                setFormData({
                                  ...product,
                                  colors: product?.colors ? product.colors.join(", ") : "",
                                  sizes: product?.sizes ? product.sizes.join(", ") : "",
                                });
                                setUploadedImageUrls(product?.images?.length ? product.images : (product?.image ? [product.image] : []));
                              }}
                              className="py-1.5 px-3.5 bg-[#007bff] hover:bg-[#0069d9] text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                              <Edit2 size={10} /> Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="py-1.5 px-3.5 bg-[#dc3545] hover:bg-[#c82333] text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                              <Trash2 size={10} /> Delete
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-zinc-400">
                      No products found. Click "+ Add Product" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Sheet panel for Create/Edit */}
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setUploadedImageUrls([]);
        }}
      >
        <SheetContent side="right" className="overflow-auto max-w-md w-full bg-white/95 backdrop-blur-md border-l border-white/20 p-6 font-sans-premium">
          <SheetHeader className="border-b border-zinc-200/60 pb-4 mb-6">
            <SheetTitle className="text-xl font-display font-bold text-zinc-950">
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          
          <ProductImageUpload
            uploadedImageUrls={uploadedImageUrls}
            setUploadedImageUrls={setUploadedImageUrls}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Save Changes" : "Create Product"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid() || imageLoadingState}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
