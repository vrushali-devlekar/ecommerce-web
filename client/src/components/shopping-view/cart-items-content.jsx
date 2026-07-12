import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";

function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction == "plus") {
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId &&
            item.color === getCartItem?.color &&
            item.size === getCartItem?.size
        );

        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );
        const getTotalStock = productList[getCurrentProductIndex].totalStock;

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Maximum reached`,
              description: `Only ${getQuantity} units available for this item.`,
              variant: "destructive",
            });

            return;
          }
        }
      }
    }

    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === "plus"
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
        color: getCartItem?.color,
        size: getCartItem?.size,
      })
    );
  }

  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({
        userId: user?.id,
        productId: getCartItem?.productId,
        color: getCartItem?.color,
        size: getCartItem?.size
      })
    );
  }

  return (
    <div className="flex items-start gap-4 pb-6 border-b border-border/30 last:border-0">
      <div className="relative group shrink-0">
        <img
          src={typeof cartItem?.image === 'string' ? cartItem?.image : cartItem?.image?.url}
          alt={cartItem?.title}
          className="w-24 h-32 object-cover rounded-sm grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
        />
        <button
          onClick={() => handleCartItemDelete(cartItem)}
          className="absolute -top-2 -left-2 bg-background border border-border p-1.5 rounded-full shadow-lg transition-all hover:scale-110"
        >
          <Trash2 className="w-3 h-3 text-red-500" />
        </button>
      </div>

      <div className="flex flex-col flex-1 gap-1">
        <div className="flex justify-between items-start">
          <h3 className="text-xs font-bold uppercase tracking-widest text-foreground line-clamp-2 leading-relaxed max-w-[150px]">
            {cartItem?.title}
          </h3>
          <p className="text-sm font-bold tracking-tighter">
            ₹{((cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) * cartItem?.quantity).toFixed(2)}
          </p>
        </div>

        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
          {cartItem?.color ? `Color: ${cartItem.color}` : ""} {cartItem?.size ? ` / Size: ${cartItem.size}` : ""}
          {!cartItem?.color && !cartItem?.size ? "Standard / woodasa Original" : ""}
        </p>

        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center border border-border px-1 py-1">
            <Button
              variant="ghost"
              className="h-6 w-6 rounded-none p-0 hover:bg-transparent"
              disabled={cartItem?.quantity === 1}
              onClick={() => handleUpdateQuantity(cartItem, "minus")}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="w-8 text-center text-[11px] font-bold">{cartItem?.quantity}</span>
            <Button
              variant="ghost"
              className="h-6 w-6 rounded-none p-0 hover:bg-transparent"
              onClick={() => handleUpdateQuantity(cartItem, "plus")}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          <button
            onClick={() => handleCartItemDelete(cartItem)}
            className="text-[9px] text-red-500 uppercase tracking-wider font-bold hover:underline ml-auto"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserCartItemsContent;
