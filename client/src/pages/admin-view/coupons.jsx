import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { addNewCoupon, deleteCoupon, fetchAllCoupons } from "@/store/admin/coupon-slice";
import { Trash2, Gift, Calendar, IndianRupee, Percent } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialCouponFormData = {
  code: "",
  discountType: "percentage",
  discountAmount: "",
  expiryDate: "",
};

function AdminCoupons() {
  const [formData, setFormData] = useState(initialCouponFormData);
  const { couponsList, isLoading } = useSelector((state) => state.adminCoupon);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleAddCoupon(event) {
    event.preventDefault();
    dispatch(addNewCoupon(formData)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllCoupons());
        setFormData(initialCouponFormData);
        toast({
          title: "Coupon code added successfully",
        });
      } else {
        toast({
          title: data?.payload?.message || "Error adding coupon",
          variant: "destructive",
        });
      }
    });
  }

  function handleDeleteCoupon(getCouponId) {
    dispatch(deleteCoupon(getCouponId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllCoupons());
        toast({
          title: "Coupon code deleted successfully",
        });
      }
    });
  }

  useEffect(() => {
    dispatch(fetchAllCoupons());
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-serif font-bold tracking-tight uppercase">Promotions Manager</h1>
        <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold italic">woodasa Exclusive Rewards</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <Card className="lg:col-span-4 rounded-none border-border/50 shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm">
          <CardHeader className="bg-primary/5 border-b border-border/10 pb-8">
            <div className="flex items-center gap-3 mb-2">
                <Gift className="w-5 h-5 text-primary" />
                <CardTitle className="text-xl font-serif font-bold uppercase tracking-widest">Create Reward</CardTitle>
            </div>
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest opacity-70">Define new coupon parameters</CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleAddCoupon} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-[.2em]">Code</Label>
                <Input
                  className="rounded-none h-12 border-border/60 focus-visible:ring-primary uppercase tracking-widest font-bold"
                  type="text"
                  placeholder="E.G. SUMMER25"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-[.2em]">Discount Type</Label>
                <div className="grid grid-cols-2 gap-2">
                    <button 
                         type="button"
                         onClick={() => setFormData({...formData, discountType: 'percentage'})}
                         className={`flex items-center justify-center gap-2 h-12 border transition-all text-[10px] font-bold uppercase tracking-widest ${formData.discountType === 'percentage' ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent border-border hover:border-foreground'}`}
                    >
                        <Percent className="w-3 h-3" /> Percentage
                    </button>
                    <button 
                         type="button"
                         onClick={() => setFormData({...formData, discountType: 'fixed'})}
                         className={`flex items-center justify-center gap-2 h-12 border transition-all text-[10px] font-bold uppercase tracking-widest ${formData.discountType === 'fixed' ? 'bg-primary text-primary-foreground border-primary' : 'bg-transparent border-border hover:border-foreground'}`}
                    >
                        <IndianRupee className="w-3 h-3" /> Fixed
                    </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-[.2em]">Discount Value</Label>
                <div className="relative">
                    <Input
                       className="rounded-none h-12 border-border/60 focus-visible:ring-primary pl-10 font-bold"
                       type="number"
                       placeholder="0.00"
                       value={formData.discountAmount}
                       onChange={(e) =>
                         setFormData({ ...formData, discountAmount: e.target.value })
                       }
                       required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50">
                        {formData.discountType === 'percentage' ? <Percent className="w-3 h-3" /> : <IndianRupee className="w-3 h-3" />}
                    </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-[.2em]">Expiry Date</Label>
                <div className="relative">
                    <Input
                        className="rounded-none h-12 border-border/60 focus-visible:ring-primary pl-10"
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) =>
                            setFormData({ ...formData, expiryDate: e.target.value })
                        }
                        required
                    />
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 opacity-50" />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full rounded-none h-14 bg-primary text-primary-foreground hover:bg-zinc-900 hover:text-white uppercase tracking-[.3em] font-bold text-[10px] transition-all duration-500 shadow-lg"
                disabled={isLoading}
              >
                Issue Coupon
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-8 rounded-none border-border/50 shadow-sm bg-card/30 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/10">
            <CardTitle className="text-xl font-serif font-bold uppercase tracking-widest">Active Inventory</CardTitle>
            <CardDescription className="text-[10px] uppercase font-bold tracking-widest opacity-50 underline decoration-primary underline-offset-4 decoration-2">Manage currently circulating codes</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[500px] overflow-y-auto custom-scrollbar">
                <Table>
                <TableHeader className="bg-muted/50 sticky top-0 z-10">
                    <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[9px] uppercase font-bold tracking-widest">Code</TableHead>
                    <TableHead className="text-[9px] uppercase font-bold tracking-widest">Details</TableHead>
                    <TableHead className="text-[9px] uppercase font-bold tracking-widest">Expiry</TableHead>
                    <TableHead className="text-right text-[9px] uppercase font-bold tracking-widest">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {couponsList && couponsList.length > 0 ? (
                    couponsList.map((couponItem) => (
                        <TableRow key={couponItem._id} className="border-border/30 hover:bg-primary/5 transition-colors group">
                        <TableCell className="font-bold tracking-widest py-6">
                            <span className="bg-primary/10 text-primary px-3 py-1 text-xs">{couponItem.code}</span>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-xs font-bold font-serif italic">
                                    {couponItem.discountAmount}
                                    {couponItem.discountType === "percentage" ? "% OFF" : "₹ OFF"}
                                </span>
                                <span className="text-[9px] uppercase tracking-tighter opacity-50 font-bold">{couponItem.discountType} Discount</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                            {new Date(couponItem.expiryDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                            <Button
                                onClick={() => handleDeleteCoupon(couponItem._id)}
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                            >
                            <Trash2 className="w-3 h-3" />
                            </Button>
                        </TableCell>
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="h-40 text-center text-sm font-serif italic text-muted-foreground opacity-50">
                            No coupons currently in circulation.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminCoupons;
