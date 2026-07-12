import { Outlet, useLocation } from "react-router-dom";
import ShoppingHeader from "./header";
import ShoppingFooter from "./footer";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "../common/page-wrapper";

function ShoppingLayout() {
  const location = useLocation();

  return (
    <div className="flex flex-col bg-background text-foreground overflow-hidden min-h-screen">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-col w-full flex-grow">
        <AnimatePresence mode="wait">
          <PageWrapper key={location.pathname}>
            <Outlet />
          </PageWrapper>
        </AnimatePresence>
      </main>
      <ShoppingFooter />
    </div>
  );
}

export default ShoppingLayout;
