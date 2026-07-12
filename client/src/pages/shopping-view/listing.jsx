import ProductFilter from "@/components/shopping-view/filter";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ProductSkeleton from "@/components/shopping-view/product-skeleton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions, filterOptions } from "@/config";
import { addToCart, fetchCartItems, setCartDrawer } from "@/store/shop/cart-slice";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import axios from "axios";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (key === "inStock" && value === true) {
      queryParams.push(`inStock=true`);
    } else if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails, isLoading } = useSelector(
    (state) => state.shopProducts
  );

  const woodenBrands = ["bamboo", "neem", "sandalwood", "rosewood", "teak"];
  const woodenKeywords = [
    "wood",
    "wooden",
    "bamboo",
    "sandalwood",
    "teak",
    "rosewood",
    "neem",
    "mahogany",
    "oak",
    "pine",
    "maple",
    "birch",
    "cedar",
    "walnut",
    "cherry",
    "timber"
  ];

  const filteredProductList = productList?.filter((productItem) => {
    // Exclude personal-care category
    if (productItem.category === "personal-care") return false;

    const brandLower = (productItem.brand || "").toLowerCase();
    const titleLower = (productItem.title || "").toLowerCase();
    const descLower = (productItem.description || "").toLowerCase();

    // Exclude lamp
    if (titleLower.includes("lamp") || descLower.includes("lamp")) return false;

    // Exclude clock
    if (titleLower.includes("clock") || descLower.includes("clock")) return false;

    // Must be wooden-related
    if (woodenBrands.includes(brandLower)) return true;
    return woodenKeywords.some(
      (keyword) => titleLower.includes(keyword) || descLower.includes(keyword)
    );
  }) || [];

  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [dynamicFilters, setDynamicFilters] = useState({ category: [], brand: [] });
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchFilters() {
      try {
        const response = await axios.get("/api/shop/products/filter-options");
        if (response.data?.success) {
          setDynamicFilters(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch filter options", error);
      }
    }
    fetchFilters();
  }, []);

  const categorySearchParam = searchParams.get("category");

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    
    if (getSectionId === "inStock") {
      if (getCurrentOption) cpyFilters.inStock = true;
      else delete cpyFilters.inStock;
      
      setFilters(cpyFilters);
      sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
      return;
    }

    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }



  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems?.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        dispatch(setCartDrawer(true));
        toast({
          title: "Product is added to bag",
        });
      }
    });
  }

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);


  return (
    <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 p-4 md:p-8 max-w-[1600px] mx-auto w-full">
      <ProductFilter
        filters={filters}
        handleFilter={handleFilter}
        filterOptions={dynamicFilters}
      />
      <div className="bg-background w-full rounded-none">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-2xl font-serif font-bold tracking-tight">Collection</h2>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-sm uppercase tracking-wider">
              {filteredProductList?.length} Items
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 rounded-none border-border"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span className="uppercase text-xs tracking-wider font-semibold">Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] rounded-none">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                      className="cursor-pointer"
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, idx) => (
              <ProductSkeleton key={idx} />
            ))
            : filteredProductList && filteredProductList.length > 0
              ? filteredProductList.map((productItem) => (
                <ShoppingProductTile
                  key={productItem._id}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
              : <div className="col-span-full py-12 text-center text-muted-foreground font-serif italic">No products found matching your criteria.</div>}
        </div>
      </div>
    </div>
  );
}

export default ShoppingListing;
