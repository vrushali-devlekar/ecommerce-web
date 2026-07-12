import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "../common/page-wrapper";
import authImage from "../../assets/auth_background_fashion_1775645465669.png"; // Note: I need to make sure this path is correct if I move it, or just use the absolute path for now if I can't move it. Wait, I should probably copy the image to assets.

function AuthLayout() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen w-full font-sans">
      <div className="hidden lg:flex relative items-center justify-center bg-black w-1/2 overflow-hidden">
        <img
          src={authImage}
          alt="Luxury Fashion"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="relative z-10 max-w-lg px-12 space-y-6 text-center">
          <h1 className="text-6xl font-serif font-bold tracking-tight text-white leading-tight">
            Elevate Your Style
          </h1>
          <p className="text-lg text-gray-200 font-light tracking-wide">
            Experience the pinnacle of fashion with our curated collections.
          </p>
          <div className="pt-8">
            <div className="h-[2px] w-24 bg-white/50 mx-auto" />
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            <PageWrapper key={location.pathname}>
              <Outlet />
            </PageWrapper>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;

