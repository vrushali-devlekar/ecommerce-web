import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { Navigate, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircleIcon, Tag } from "lucide-react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Input } from "@/components/ui/input";
import { validateCoupon, clearCoupon } from "@/store/shop/coupon-slice";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const { couponDetails } = useSelector((state) => state.shopCoupon);
  
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const subTotal =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  let discountAmount = 0;
  if (isCouponApplied && couponDetails) {
    if (couponDetails.discountType === "percentage") {
      discountAmount = (subTotal * couponDetails.discountAmount) / 100;
    } else {
      discountAmount = couponDetails.discountAmount;
    }
  }

  const finalTotal = subTotal - discountAmount;

  function handleApplyCoupon() {
    if (!promoCode.trim()) return;

    dispatch(validateCoupon(promoCode)).then((data) => {
      if (data?.payload?.success) {
        setIsCouponApplied(true);
        toast({
          title: "Coupon applied successfully!",
          description: `You saved ₹${discountAmount.toFixed(2)}`,
        });
      } else {
        setIsCouponApplied(false);
        toast({
          title: data?.payload?.message || "Invalid coupon code",
          variant: "destructive",
        });
      }
    });
  }

  function handleRemoveCoupon() {
    setIsCouponApplied(false);
    setPromoCode("");
    dispatch(clearCoupon());
  }

  function handleInitiatePayment() {
    if (Object.keys(cartItems).length === 0 || (cartItems.items && cartItems.items.length === 0)) {
      toast({
        title: "Your bag is empty. Please add items to proceed",
        variant: "destructive",
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: "Please select one address to proceed.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
        color: singleCartItem?.color,
        size: singleCartItem?.size,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: paymentMethod === "cod" ? "confirmed" : "pending",
      paymentMethod: paymentMethod,
      paymentStatus: "pending",
      totalAmount: finalTotal,
      discountAmount: discountAmount,
      couponCode: isCouponApplied ? promoCode : "",
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        if (paymentMethod === "cod") {
          dispatch(fetchCartItems(user?.id));
          setIsOrderPlaced(true);
          setTimeout(() => {
            navigate("/shop/payment-success");
          }, 2500);
        } else {
          setIsPaymemntStart(true);
        }
      } else {
        setIsPaymemntStart(false);
      }
    });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="relative h-[300px] w-full overflow-hidden bg-muted flex items-center justify-center">
        <img src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80" className="h-full w-full object-cover object-center absolute inset-0 mix-blend-multiply opacity-40" />
        <div className="relative z-10 text-center space-y-2">
            <h1 className="text-5xl font-serif text-foreground uppercase tracking-widest font-bold">Secure Checkout</h1>
            <p className="text-[10px] uppercase tracking-[0.5em] text-muted-foreground font-bold italic">woodasa &copy; 2024</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12 mb-24">
          {/* LEFT SECTION - SHIPPING */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="bg-background border border-border/50 p-8 shadow-sm rounded-sm">
                <h2 className="text-xl font-serif font-bold uppercase tracking-widest border-b border-border pb-4 mb-6 flex items-center gap-3">
                   <div className="w-1 h-6 bg-primary" />
                   1. Shipping Information
                </h2>
                <Address
                selectedId={currentSelectedAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
                />
            </div>

            <div className="bg-background border border-border/50 p-8 shadow-sm rounded-sm">
                <h2 className="text-xl font-serif font-bold uppercase tracking-widest border-b border-border pb-4 mb-6 flex items-center gap-3">
                   <div className="w-1 h-6 bg-primary" />
                   2. Payment Selection
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* TODO: Razorpay frontend integration pending — see paymentController.js for expected flow */}
                    <label className="flex items-center justify-between p-6 border border-zinc-200 bg-zinc-50 opacity-50 cursor-not-allowed">
                        <span className="font-bold uppercase tracking-widest text-xs text-zinc-400">Razorpay / Card / UPI (Coming Soon)</span>
                        <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="razorpay" 
                            disabled
                            className="sr-only"
                        />
                        <div className="w-4 h-4 rounded-full border-2 border-muted flex items-center justify-center">
                        </div>
                    </label>
                    <label className={`flex items-center justify-between p-6 border transition-all cursor-pointer ${paymentMethod === 'cod' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-zinc-500'}`}>
                        <div className="flex flex-col gap-1">
                            <span className="font-bold uppercase tracking-widest text-xs">Cash on Delivery</span>
                            <span className="text-[10px] text-muted-foreground italic font-serif">Pay at your door</span>
                        </div>
                        <input 
                            type="radio" 
                            name="paymentMethod" 
                            value="cod" 
                            checked={paymentMethod === "cod"} 
                            onChange={() => setPaymentMethod("cod")} 
                            className="hidden"
                        />
                         <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-primary' : 'border-muted'}`}>
                             {paymentMethod === 'cod' && <div className="w-2 h-2 bg-primary rounded-full transition-all" />}
                        </div>
                    </label>
                </div>
            </div>
          </div>

          {/* RIGHT SECTION - SUMMARY */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-muted/30 p-8 border border-border shadow-md rounded-sm sticky top-24">
                <h2 className="text-xl font-serif font-bold uppercase tracking-widest border-b border-border/50 pb-4 mb-8">Summary of Bag</h2>
                <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems && cartItems.items && cartItems.items.length > 0
                    ? cartItems.items.map((item) => (
                        <UserCartItemsContent key={item.productId} cartItem={item} />
                    ))
                    : <p className="text-muted-foreground text-center py-4 font-serif italic">Your journey starts here. Add items.</p>}
                </div>
                
                {/* PROMO CODE SECTION */}
                <div className="mt-10 pt-8 border-t border-border/50">
                    {!isCouponApplied ? (
                        <div className="space-y-4">
                             <div className="flex items-center gap-2 mb-2">
                                <Tag className="w-4 h-4 text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Gift / Promotion Code</span>
                            </div>
                            <div className="flex gap-2">
                                <Input 
                                    placeholder="Enter Code (e.g. WELCOME10)" 
                                    value={promoCode}
                                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                    className="rounded-none border-border bg-background uppercase text-xs tracking-widest h-12"
                                />
                                <Button 
                                    onClick={handleApplyCoupon}
                                    variant="outline"
                                    className="rounded-none border-primary text-primary hover:bg-primary hover:text-white px-6 h-12 text-[10px] font-bold uppercase tracking-widest transition-all"
                                >
                                    Apply
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-green-500/10 border border-green-500/20 p-4 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Coupon Applied</span>
                                <span className="text-xs font-bold font-serif italic">{promoCode}</span>
                            </div>
                            <Button onClick={handleRemoveCoupon} variant="ghost" className="text-xs hover:bg-transparent text-red-500 p-0 h-auto font-bold uppercase tracking-widest">Remove</Button>
                        </div>
                    )}
                </div>

                <div className="mt-8 space-y-4 border-t border-border/50 pt-8">
                    <div className="flex justify-between items-center">
                        <span className="uppercase tracking-widest text-[10px] font-bold text-muted-foreground">Original Total</span>
                        <span className="font-bold text-sm text-foreground">₹{subTotal.toFixed(2)}</span>
                    </div>
                    {isCouponApplied && (
                        <div className="flex justify-between items-center animate-in slide-in-from-right-2">
                            <span className="uppercase tracking-widest text-[10px] font-bold text-green-600">Promotion Applied</span>
                            <span className="font-bold text-sm text-green-600">-₹{discountAmount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-center text-lg pt-4 border-t border-border/10">
                        <span className="font-bold uppercase tracking-[.2em] text-xs">Final Payable</span>
                        <span className="font-bold text-2xl tracking-tighter text-foreground">₹{finalTotal.toFixed(2)}</span>
                    </div>
                </div>
                
                <div className="mt-10">
                    <Button 
                        onClick={handleInitiatePayment} 
                        className="w-full bg-primary text-primary-foreground hover:bg-zinc-900 hover:text-white rounded-none uppercase tracking-[.3em] py-8 text-[10px] font-bold shadow-2xl transition-all duration-500"
                    >
                        {isPaymentStart
                        ? "Connecting to Security Gate..."
                        : `Confirm & Checkout`}
                    </Button>
                    <p className="text-[9px] uppercase tracking-widest text-muted-foreground text-center mt-4 font-bold">Encrypted & Secure Payment Processing</p>
                </div>
            </div>
          </div>
        </div>
      </div>

      {isOrderPlaced && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md animate-in fade-in duration-500">
          <div className="flex flex-col items-center gap-6 animate-in zoom-in-50 duration-700 delay-200">
            <div className="p-6 bg-green-500/10 rounded-full">
                <CheckCircleIcon className="w-20 h-20 text-green-500" strokeWidth={1} />
            </div>
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-serif font-bold text-foreground tracking-tight uppercase">Gratitude.</h2>
                <p className="text-muted-foreground text-sm uppercase tracking-[.4em] font-bold">Order Place Successfully</p>
            </div>
            <div className="w-12 h-1 bg-primary/20 animate-pulse mt-4" />
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingCheckout;
