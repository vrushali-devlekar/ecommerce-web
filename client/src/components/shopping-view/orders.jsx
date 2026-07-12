import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog } from "../ui/dialog";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";
import { Package, ReceiptText, ArrowUpRight } from "lucide-react";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex items-start justify-between border-b border-zinc-200 pb-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-serif font-bold text-zinc-900 uppercase tracking-wide">
            Acquisition History
          </h3>
          <p className="text-xs text-zinc-500 font-light tracking-wide">
            Review and track your orders of premium handcrafted woodasa items.
          </p>
        </div>
        <div className="p-3 bg-[#fdfbf7] border border-zinc-200 shadow-sm rounded-none">
          <ReceiptText className="w-6 h-6 text-[#d9a014]" />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-5">
        {orderList && orderList.length > 0 ? (
          orderList.map((orderItem) => (
            <div
              key={orderItem?._id}
              className="bg-white border border-zinc-200/80 shadow-sm hover:shadow-md transition-all duration-300 rounded-none border-l-4 border-l-[#d9a014] flex flex-col md:flex-row items-stretch"
            >
              {/* Left Segment: Meta & Date */}
              <div className="p-6 flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Order ID
                  </span>
                  <span className="font-mono text-xs font-semibold text-zinc-800 bg-zinc-50 px-2 py-1 border border-zinc-100 block w-fit">
                    #{orderItem?._id.slice(-8).toUpperCase()}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Order Date
                  </span>
                  <span className="text-sm text-zinc-700 font-medium">
                    {orderItem?.orderDate.split("T")[0]}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                    Acquisition Cost
                  </span>
                  <span className="text-base font-serif font-bold text-zinc-900 block">
                    ₹{Number(orderItem?.totalAmount).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Right Segment: Status & Details Action */}
              <div className="px-6 py-4 md:py-0 bg-zinc-50/50 border-t md:border-t-0 md:border-l border-zinc-200/60 flex items-center justify-between md:justify-end gap-6 shrink-0 min-w-[240px]">
                <div className="space-y-1 md:text-right">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 block md:hidden">
                    Status
                  </span>
                  <Badge
                    className={`rounded-none text-[9px] font-black uppercase tracking-widest px-3 py-1.5 transition-colors border shadow-none ${
                      orderItem?.orderStatus === "confirmed" || orderItem?.orderStatus === "delivered"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-50"
                        : orderItem?.orderStatus === "rejected"
                        ? "bg-rose-50 text-rose-800 border-rose-200/80 hover:bg-rose-50"
                        : "bg-amber-50 text-amber-800 border-amber-200/80 hover:bg-amber-50"
                    }`}
                  >
                    {orderItem?.orderStatus}
                  </Badge>
                </div>

                <Dialog
                  open={openDetailsDialog}
                  onOpenChange={() => {
                    setOpenDetailsDialog(false);
                    dispatch(resetOrderDetails());
                  }}
                >
                  <Button
                    onClick={() => handleFetchOrderDetails(orderItem?._id)}
                    className="bg-transparent hover:bg-zinc-900 border border-zinc-300 hover:border-zinc-900 text-zinc-800 hover:text-white rounded-none text-[10px] font-bold uppercase tracking-widest py-5 px-6 transition-all duration-300 flex items-center gap-2"
                  >
                    Details
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Button>
                  <ShoppingOrderDetailsView orderDetails={orderDetails} />
                </Dialog>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center border border-dashed border-zinc-200 bg-white/40 rounded-none">
            <Package className="w-12 h-12 text-zinc-300 mx-auto mb-4" strokeWidth={1.2} />
            <h4 className="font-serif text-lg font-bold text-zinc-700 uppercase tracking-wide">
              No Acquisitions Found
            </h4>
            <p className="text-xs text-zinc-400 font-light mt-1 max-w-xs mx-auto">
              Your organic timber collections will display here once you place an order.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingOrders;
