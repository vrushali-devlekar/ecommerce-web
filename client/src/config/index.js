export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "personal-care", label: "Personal Care" },
      { id: "kitchenware", label: "Kitchen & Dining" },
      { id: "decor", label: "Home Decor & Desk" },
    ],
  },
  {
    label: "Material (Brand)",
    name: "brand",
    componentType: "select",
    options: [
      { id: "bamboo", label: "Bamboo" },
      { id: "neem", label: "Neem Wood" },
      { id: "sandalwood", label: "Sandalwood" },
      { id: "rosewood", label: "Rosewood" },
      { id: "teak", label: "Teak Wood" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
  {
    label: "Colors",
    name: "colors",
    componentType: "input",
    type: "text",
    placeholder: "Enter colors separated by comma (e.g. Natural, Dark Brown)",
  },
  {
    label: "Sizes",
    name: "sizes",
    componentType: "input",
    type: "text",
    placeholder: "Enter sizes separated by comma (e.g. Standard, Travel Size)",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "about",
    label: "About Us",
    path: "/shop/about",
  },
  {
    id: "shop",
    label: "Shop",
    path: "/shop/listing",
  },
  {
    id: "orders",
    label: "Order",
    path: "/shop/account",
  },
  {
    id: "contact",
    label: "Contact",
    path: "/shop/contact",
  },
  {
    id: "blog",
    label: "Blog",
    path: "/shop/blog",
  },
];

export const categoryOptionsMap = {
  "personal-care": "Personal Care",
  kitchenware: "Kitchen & Dining",
  decor: "Home Decor & Desk",
};

export const brandOptionsMap = {
  bamboo: "Bamboo",
  neem: "Neem Wood",
  sandalwood: "Sandalwood",
  rosewood: "Rosewood",
  teak: "Teak Wood",
};

export const filterOptions = {
  category: [
    { id: "personal-care", label: "Personal Care" },
    { id: "kitchenware", label: "Kitchen & Dining" },
    { id: "decor", label: "Home Decor & Desk" },
  ],
  brand: [
    { id: "bamboo", label: "Bamboo" },
    { id: "neem", label: "Neem Wood" },
    { id: "sandalwood", label: "Sandalwood" },
    { id: "rosewood", label: "Rosewood" },
    { id: "teak", label: "Teak Wood" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
