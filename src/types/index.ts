export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  category: Category;
  subcategory?: string;
  brand?: string;
  sku: string;
  stock: number;
  inStock: boolean;
  specs: SpecItem[];
  attributes: ProductAttribute[];
  rating: number;
  reviewCount: number;
  reviews: Review[];
  tags: string[];
  seller: Seller;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  trending: boolean;
}

export interface SpecItem {
  label: string;
  value: string;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  image?: string;
  parentId?: string;
  children?: Category[];
  productCount: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export interface Seller {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  location: string;
  verified: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  type: "promo" | "category" | "sale";
}

export interface Address {
  id?: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  country: string;
  addressLine1: string;
  addressLine2?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  address: Address;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export type ShippingMethod = "standard" | "express" | "pickup";
export type PaymentMethod = "momo" | "cod" | "card";

export interface SearchFilter {
  query: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy: "latest" | "price_asc" | "price_desc" | "rating" | "popular";
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  isSeller: boolean;
}

export interface TrustBadge {
  icon: string;
  title: string;
  description: string;
}

export type Currency = "RWF" | "USD";

export interface CurrencyRate {
  RWF: number;
  USD: number;
}
