import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  console.log(orderDetails, "orderList");

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card className="bg-white/70 backdrop-blur-md rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-white/80 overflow-hidden font-sans-premium">
      <CardHeader className="border-b border-zinc-200/60 pb-4">
        <CardTitle className="text-2xl font-display font-bold text-zinc-950">All Orders</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-bold text-zinc-400 uppercase tracking-wider text-[10px] md:text-xs">Order ID</TableHead>
              <TableHead className="font-bold text-zinc-400 uppercase tracking-wider text-[10px] md:text-xs">Order Date</TableHead>
              <TableHead className="font-bold text-zinc-400 uppercase tracking-wider text-[10px] md:text-xs">Order Status</TableHead>
              <TableHead className="font-bold text-zinc-400 uppercase tracking-wider text-[10px] md:text-xs">Order Price</TableHead>
              <TableHead className="font-bold text-zinc-400 uppercase tracking-wider text-[10px] md:text-xs text-right pr-6">
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-zinc-100">
            {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                  <TableRow key={orderItem?._id} className="hover:bg-zinc-50/40 transition-colors">
                    <TableCell className="font-semibold text-zinc-900">{orderItem?._id}</TableCell>
                    <TableCell className="text-zinc-600">{orderItem?.orderDate.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm border-none text-white ${
                          orderItem?.orderStatus === "confirmed" || orderItem?.orderStatus === "delivered"
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : orderItem?.orderStatus === "rejected"
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-amber-500 hover:bg-amber-600"
                        }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-zinc-900">₹{orderItem?.totalAmount}</TableCell>
                    <TableCell className="text-right pr-6">
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <Button
                          onClick={() =>
                            handleFetchOrderDetails(orderItem?._id)
                          }
                          className="py-1.5 px-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors shadow-sm"
                        >
                          View Details
                        </Button>
                        <AdminOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
