const Loader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-[9999]">
      <div className="relative flex flex-col items-center gap-6">
        {/* Abstract Logo Animation */}
        <div className="relative w-24 h-24">
            {/* Pulsing Outer Ring */}
            <div className="absolute inset-0 border-2 border-primary rounded-full animate-ping opacity-20"></div>
            {/* Rotating Inner Ring */}
            <div className="absolute inset-2 border-[1px] border-primary/30 rounded-full animate-spin duration-[3000ms]"></div>
            {/* Center B Letter */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-serif font-bold text-primary italic select-none">W</span>
            </div>
        </div>

        {/* Text Animation */}
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-2xl md:text-4xl font-serif font-bold tracking-[0.3em] text-primary animate-title-fade">
            WOODASA
          </h1>
          <p className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground opacity-60 animate-in fade-in slide-in-from-top-1 duration-1000 delay-500">
            Premium Fashion Destination
          </p>
        </div>

        {/* Shimmering Progress Loader */}
        <div className="w-40 h-[2px] bg-gray-100 relative overflow-hidden mt-4 rounded-full">
          <div className="absolute inset-0 bg-primary w-full animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
