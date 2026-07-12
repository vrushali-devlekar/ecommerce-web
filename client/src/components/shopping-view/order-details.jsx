import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Badge } from "../ui/badge";
import { DialogContent, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { FileDown, Check, Circle, ShoppingBag, Truck } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  function handleDownloadInvoice() {
    const doc = new jsPDF();
    
    // Add branding
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("WOODASA", 14, 25);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Premium Handcrafted Wooden Products", 14, 32);
    doc.text("www.woodasa.com", 14, 37);

    // Date and Invoice Number
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 140, 25);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Invoice No: #${orderDetails?._id.slice(-6).toUpperCase()}`, 140, 32);
    doc.text(`Date: ${orderDetails?.orderDate.split("T")[0]}`, 140, 37);

    doc.setDrawColor(230);
    doc.line(14, 45, 196, 45);

    // Bill To & Ship To
    doc.setFont("helvetica", "bold");
    doc.text("BILL TO:", 14, 55);
    doc.setFont("helvetica", "normal");
    doc.text(user?.userName || "", 14, 62);
    doc.text(user?.email || "", 14, 67);

    doc.setFont("helvetica", "bold");
    doc.text("SHIP TO:", 140, 55);
    doc.setFont("helvetica", "normal");
    doc.text(orderDetails?.addressInfo?.address || "", 140, 62);
    doc.text(`${orderDetails?.addressInfo?.city || ""}, ${orderDetails?.addressInfo?.pincode || ""}`, 140, 67);
    doc.text(`Phone: ${orderDetails?.addressInfo?.phone || ""}`, 140, 72);

    // Table
    const tableData = orderDetails?.cartItems?.map(item => [
      item.title,
      item.quantity,
      `INR ${Number(item.price).toFixed(2)}`,
      `INR ${(Number(item.price) * item.quantity).toFixed(2)}`
    ]) || [];

    doc.autoTable({
      startY: 85,
      head: [['PRODUCT', 'QTY', 'PRICE', 'AMOUNT']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [217, 160, 20], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 5 },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { halign: 'center' },
        2: { halign: 'right' },
        3: { halign: 'right' }
      }
    });

    // Summary
    const finalY = doc.lastAutoTable.finalY + 15;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Payment Method:", 14, finalY);
    doc.text((orderDetails?.paymentMethod || "").toUpperCase(), 14, finalY + 7);
    
    doc.setTextColor(0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`GRAND TOTAL: INR ${Number(orderDetails?.totalAmount).toFixed(2)}`, 140, finalY + 5);

    // Footer
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150);
    doc.text("Thank you for choosing woodasa. If you have any questions about this invoice,", 14, 280);
    doc.text("please contact our support team at support@woodasa.com", 14, 285);

    doc.save(`woodasa_Invoice_${orderDetails?._id.slice(-6)}.pdf`);
  }

  return (
    <DialogContent aria-describedby={undefined} className="sm:max-w-[700px] p-0 overflow-hidden border border-zinc-200/80 bg-[#fdfbf7] shadow-2xl rounded-none">
      <div className="max-h-[85vh] overflow-y-auto custom-scrollbar">
        
        {/* Dynamic Title for Accessibility */}
        <DialogTitle className="sr-only">Order Details Summary</DialogTitle>

        {/* HEADER SECTION - ORGANIC Sandalwood */}
        <div className="relative h-44 bg-[#f5efe6] flex items-end p-8 overflow-hidden border-b border-zinc-200">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <ShoppingBag size={200} className="text-zinc-900" />
          </div>
          <div className="flex justify-between items-end w-full relative z-10">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#d9a014]">Official Receipt</span>
              <h2 className="text-3xl font-serif font-bold text-[#3b2f2f] italic tracking-tight">Acquisition Details</h2>
              <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 font-semibold">Ref: #{orderDetails?._id.slice(-12).toUpperCase()}</p>
            </div>
            <Button 
              onClick={handleDownloadInvoice} 
              className="bg-[#d9a014] hover:bg-zinc-950 text-white rounded-none px-6 h-12 text-[10px] uppercase tracking-widest font-bold shadow-md transition-all duration-300 flex items-center gap-2 border border-transparent"
            >
              <FileDown className="h-4 w-4" />
              Invoice PDF
            </Button>
          </div>
        </div>

        <div className="p-8 space-y-12">
          
          {/* QUICK INFO GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Acquired On', value: orderDetails?.orderDate.split("T")[0] },
              { label: 'Amount Paid', value: `₹${Number(orderDetails?.totalAmount).toLocaleString()}` },
              { label: 'Method', value: orderDetails?.paymentMethod },
              { label: 'Status', value: orderDetails?.orderStatus, isBadge: true },
            ].map((info, idx) => (
              <div key={idx} className="space-y-1.5 p-4 bg-white border border-zinc-200/60 shadow-sm flex flex-col justify-between">
                <span className="text-[9px] uppercase tracking-widest font-bold text-zinc-400 block">{info.label}</span>
                {info.isBadge ? (
                  <div className="pt-1">
                    <Badge className={`rounded-none text-[9px] uppercase tracking-widest font-black px-2.5 py-1.5 shadow-none border ${
                      orderDetails?.orderStatus === 'delivered' || orderDetails?.orderStatus === 'confirmed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80 hover:bg-emerald-50'
                        : orderDetails?.orderStatus === 'rejected'
                        ? 'bg-rose-50 text-rose-800 border-rose-200/80 hover:bg-rose-50'
                        : 'bg-amber-50 text-amber-800 border-amber-200/80 hover:bg-amber-50'
                    }`}>
                      {info.value}
                    </Badge>
                  </div>
                ) : (
                  <span className="text-xs font-bold text-zinc-800 uppercase tracking-tight font-sans">{info.value}</span>
                )}
              </div>
            ))}
          </div>

          {/* LIVE JOURNEY */}
          <div className="space-y-6 bg-white border border-zinc-200/60 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="h-[1px] flex-1 bg-zinc-200" />
              <div className="flex items-center gap-2 text-zinc-500">
                <Truck className="w-4 h-4 text-[#d9a014]" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em]">Transit Timeline</h3>
              </div>
              <span className="h-[1px] flex-1 bg-zinc-200" />
            </div>
            
            <div className="relative flex justify-between items-center w-full px-2 pt-2 pb-6">
              <div className="absolute top-[21px] left-0 w-full h-[2px] bg-zinc-100 z-0" />
              {[
                { id: "pending", label: "Processing" },
                { id: "shipped", label: "Dispatched" },
                { id: "outForDelivery", label: "In Transit" },
                { id: "delivered", label: "Arrived" }
              ].map((step) => {
                const statusOrder = ["pending", "confirmed", "shipped", "outForDelivery", "delivered"];
                const currentStatus = orderDetails?.orderStatus;
                let currentIndex = statusOrder.indexOf(currentStatus);
                if(currentStatus === 'confirmed') currentIndex = 0; 
                
                const isCompleted = currentIndex >= statusOrder.indexOf(step.id === 'pending' ? 'pending' : step.id);
                const isCurrent = currentStatus === step.id || (currentStatus === 'confirmed' && step.id === 'pending');

                return (
                  <div key={step.id} className="relative z-10 flex flex-col items-center group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-700 ${
                      isCompleted ? "bg-[#d9a014] border-[#d9a014] text-white shadow-md scale-105" : "bg-white border-zinc-200 text-zinc-300"
                    }`}>
                      {isCompleted ? <Check size={14} strokeWidth={3} /> : <Circle size={6} className="fill-current" />}
                    </div>
                    <span className={`absolute -bottom-6 whitespace-nowrap text-[9px] font-bold uppercase tracking-widest transition-all duration-500 ${
                      isCompleted ? "text-[#d9a014] font-bold opacity-100" : "text-zinc-400 opacity-50"
                    }`}>
                      {step.label}
                    </span>
                    {isCurrent && (
                      <div className="absolute -top-6">
                        <div className="w-1.5 h-1.5 bg-[#d9a014] rounded-full animate-ping" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ITEM LIST */}
          <div className="space-y-6 pt-4">
            <h3 className="text-lg font-serif font-bold text-[#3b2f2f] uppercase tracking-wide border-b border-zinc-200 pb-3">Acquired Items</h3>
            <div className="space-y-4">
              {orderDetails?.cartItems?.map((item) => (
                <div key={item.productId} className="flex items-center gap-6 group bg-white border border-zinc-200/50 p-4 shadow-sm">
                  <div className="w-16 h-20 shrink-0 bg-zinc-50 border border-zinc-100 overflow-hidden rounded-none">
                    <img src={typeof item.image === 'string' ? item.image : item.image?.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-widest leading-tight">{item.title}</h4>
                    <div className="flex gap-2">
                      {item.size && <span className="text-[9px] text-zinc-400 font-bold uppercase">Size: {item.size}</span>}
                      {item.color && <span className="text-[9px] text-zinc-400 font-bold uppercase">Color: {item.color}</span>}
                    </div>
                    <div className="pt-2 flex items-center gap-4">
                      <span className="text-[9px] font-bold py-0.5 px-1.5 bg-zinc-100 text-zinc-500 border border-zinc-200/50 rounded-none">QTY: {item.quantity}</span>
                      <span className="text-xs font-bold text-zinc-800 tracking-tight">₹{Number(item.price).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SHIPPING & MEMO */}
          <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-zinc-200">
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#d9a014]">Shipping Destination</h4>
              <div className="space-y-1 bg-white border border-zinc-200/50 p-4 shadow-sm text-xs text-zinc-600 leading-relaxed">
                <p className="font-bold text-zinc-800">{user?.userName || ""}</p>
                <p>{orderDetails?.addressInfo?.address}</p>
                <p>{orderDetails?.addressInfo?.city}, {orderDetails?.addressInfo?.pincode}</p>
                <p>Phone: {orderDetails?.addressInfo?.phone}</p>
              </div>
            </div>
            {orderDetails?.addressInfo?.notes && (
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#d9a014]">Order Memo</h4>
                <div className="p-4 bg-amber-50/50 border border-amber-100 italic text-xs text-amber-900 leading-relaxed rounded-none">
                  &quot;{orderDetails?.addressInfo?.notes}&quot;
                </div>
              </div>
            )}
          </div>

          {/* FINAL TOTAL */}
          <div className="pt-6 border-t border-zinc-200 flex flex-col items-end gap-1">
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Total Commitment</span>
            <div className="text-3xl font-serif font-bold text-[#3b2f2f] italic tracking-tight">
              ₹{Number(orderDetails?.totalAmount).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

ShoppingOrderDetailsView.propTypes = {
  orderDetails: PropTypes.shape({
    _id: PropTypes.string,
    orderDate: PropTypes.string,
    orderUpdateDate: PropTypes.string,
    totalAmount: PropTypes.number,
    paymentMethod: PropTypes.string,
    paymentStatus: PropTypes.string,
    orderStatus: PropTypes.string,
    trackingId: PropTypes.string,
    addressInfo: PropTypes.shape({
      address: PropTypes.string,
      city: PropTypes.string,
      pincode: PropTypes.string,
      phone: PropTypes.string,
      notes: PropTypes.string
    }),
    cartItems: PropTypes.arrayOf(PropTypes.shape({
      productId: PropTypes.string,
      title: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      quantity: PropTypes.number,
      color: PropTypes.string,
      size: PropTypes.string
    }))
  })
};

export default ShoppingOrderDetailsView;
