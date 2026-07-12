import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import UserProfile from "@/components/shopping-view/profile";
import UserWishlist from "@/components/shopping-view/wishlist";
import { useSelector } from "react-redux";
import { MapPin, Package, ShieldCheck, Heart } from "lucide-react";

function ShoppingAccount() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="relative h-[250px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <div className="text-center space-y-2 animate-in fade-in zoom-in duration-700">
               <h1 className="text-4xl md:text-5xl font-serif text-white italic font-bold tracking-tighter">Your Sanctuary</h1>
               <p className="text-white/70 text-[10px] md:text-sm uppercase tracking-[0.4em] font-bold">Refining your woodasa experience</p>
            </div>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4 md:px-8">
        <div className="flex flex-col gap-8">
          {/* USER GREETING */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border pb-8 gap-4">
             <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary">Official Member</span>
                <h2 className="text-3xl font-serif font-bold tracking-tight">Bonjour, {user?.userName}</h2>
             </div>
             <div className="flex gap-4">
                <div className="flex flex-col items-center px-6 py-2 bg-muted rounded-xl">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Verified Account</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">Standard Tier</span>
                </div>
             </div>
          </div>

          <div className="flex flex-col">
            <Tabs defaultValue="orders" className="w-full">
              <TabsList className="bg-transparent border-b border-border rounded-none h-auto p-0 flex justify-start gap-8 mb-8 overflow-x-auto scrollbar-hide">
                {[
                    { id: 'orders', label: 'Order History', icon: Package },
                    { id: 'profile', label: 'Identity & Security', icon: ShieldCheck },
                    { id: 'address', label: 'Shipping Addresses', icon: MapPin },
                    { id: 'wishlist', label: 'The Wishlist', icon: Heart },
                ].map(tab => (
                    <TabsTrigger 
                        key={tab.id}
                        value={tab.id} 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-4 text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-2 transition-all"
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="orders" className="mt-0 focus-visible:outline-none">
                <div className="bg-muted/30 p-4 md:p-8 rounded-2xl">
                    <ShoppingOrders />
                </div>
              </TabsContent>
              
              <TabsContent value="profile" className="mt-0 focus-visible:outline-none">
                 <UserProfile />
              </TabsContent>
              
              <TabsContent value="address" className="mt-0 focus-visible:outline-none">
                <div className="bg-muted/30 p-4 md:p-8 rounded-2xl">
                    <Address />
                </div>
              </TabsContent>
              
              <TabsContent value="wishlist" className="mt-0 focus-visible:outline-none">
                 <UserWishlist />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
