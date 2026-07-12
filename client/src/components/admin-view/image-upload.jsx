import { UploadCloudIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRef } from "react";
import { Button } from "../ui/button";
import { useUploadThing } from "@/helpers/uploadthing";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageLoadingState,
  uploadedImageUrls = [],
  setUploadedImageUrls,
  setImageLoadingState,
  isEditMode,
  isCustomStyling = false,
}) {
  const inputRef = useRef(null);
  
  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      setImageLoadingState(false);
      if (res && res.length > 0) {
        const urls = res.map((r) => r.url);
        setUploadedImageUrls((prev) => [...(prev || []), ...urls].slice(0, 4));
      }
    },
    onUploadError: (error) => {
      console.error("Upload error", error);
      setImageLoadingState(false);
    },
  });

  async function handleImageFileChange(event) {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length) {
       handleUpload(selectedFiles);
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files || []);
    if (droppedFiles.length) {
       handleUpload(droppedFiles);
    }
  }

  function handleRemoveImage(index) {
    setUploadedImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleUpload(files) {
    const availableSlots = 4 - (uploadedImageUrls?.length || 0);
    const filesToUpload = files.slice(0, availableSlots);
    if (filesToUpload.length > 0) {
      setImageLoadingState(true);
      await startUpload(filesToUpload);
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className={`w-full  mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Images (Max 4)</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          multiple
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode || (uploadedImageUrls?.length || 0) >= 4}
        />
        
        {(uploadedImageUrls?.length || 0) < 4 ? (
          <Label
            htmlFor="image-upload"
            className={`${
              isEditMode ? "cursor-not-allowed" : ""
            } flex flex-col items-center justify-center h-32 cursor-pointer mb-4`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload ({4 - (uploadedImageUrls?.length || 0)} remaining)</span>
          </Label>
        ) : null}

        {imageLoadingState && (
          <Skeleton className="h-10 bg-gray-100 mb-4" />
        )}

        {uploadedImageUrls && uploadedImageUrls.length > 0 && (
          <div className="space-y-2">
            {uploadedImageUrls.map((url, index) => (
               <div key={index} className="flex items-center justify-between border border-zinc-200 p-2 rounded-md">
                 <div className="flex items-center gap-3">
                   <img src={url} className="w-10 h-10 object-cover rounded shadow-sm" alt={`Uploaded ${index}`} />
                   <p className="text-sm font-medium text-zinc-600">Image {index + 1}</p>
                 </div>
                 <Button
                   variant="ghost"
                   size="icon"
                   type="button"
                   className="text-muted-foreground hover:text-foreground hover:bg-zinc-100"
                   onClick={() => handleRemoveImage(index)}
                 >
                   <XIcon className="w-4 h-4" />
                   <span className="sr-only">Remove File</span>
                 </Button>
               </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
