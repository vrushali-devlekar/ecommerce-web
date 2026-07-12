import { Skeleton } from "../ui/skeleton";

function ProductSkeleton() {
  return (
    <div className="w-full max-w-sm mx-auto animate-in fade-in duration-1000">
      <div className="relative overflow-hidden mb-4 rounded-sm bg-muted/20 border border-muted/10">
        <Skeleton className="h-[400px] w-full" />
        <div className="absolute top-3 left-3">
          <Skeleton className="h-6 w-12" />
        </div>
      </div>
      <div className="space-y-4 flex flex-col items-center">
        <Skeleton className="h-7 w-3/4 bg-muted/40" />
        <div className="flex gap-2 w-full justify-center">
            <Skeleton className="h-4 w-1/4 bg-muted/20" />
            <Skeleton className="h-4 w-1/4 bg-muted/20" />
        </div>
        <div className="flex gap-3 mt-4">
            <Skeleton className="h-6 w-16 bg-muted/60" />
            <Skeleton className="h-6 w-16 bg-muted/30" />
        </div>
      </div>
      <div className="mt-8">
        <Skeleton className="h-14 w-full bg-muted/10 rounded-none border border-muted/5" />
      </div>
    </div>
  );
}

export default ProductSkeleton;
