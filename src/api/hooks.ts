import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchProductById,
  fetchFeaturedProducts,
  fetchTrendingProducts,
  fetchProductsByCategory,
  searchProducts,
  fetchRelatedProducts,
  fetchCategories,
  fetchCategoryById,
} from "./client";
import { SearchFilter } from "@/types";

export function useProducts(page: number = 1) {
  return useQuery({
    queryKey: ["products", page],
    queryFn: () => fetchProducts(page),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductsInfinite() {
  return useInfiniteQuery({
    queryKey: ["products", "infinite"],
    queryFn: ({ pageParam = 1 }) => fetchProducts(pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: fetchFeaturedProducts,
    staleTime: 10 * 60 * 1000,
  });
}

export function useTrendingProducts() {
  return useQuery({
    queryKey: ["products", "trending"],
    queryFn: fetchTrendingProducts,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCategoryProducts(categoryId: string, page: number = 1) {
  return useQuery({
    queryKey: ["products", "category", categoryId, page],
    queryFn: () => fetchProductsByCategory(categoryId, page),
    staleTime: 5 * 60 * 1000,
    enabled: !!categoryId,
  });
}

export function useCategoryProductsInfinite(categoryId: string) {
  return useInfiniteQuery({
    queryKey: ["products", "category", categoryId, "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      fetchProductsByCategory(categoryId, pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    enabled: !!categoryId,
  });
}

export function useSearchProducts(filter: SearchFilter) {
  return useInfiniteQuery({
    queryKey: ["products", "search", filter],
    queryFn: ({ pageParam = 1 }) => searchProducts(filter, pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
  });
}

export function useRelatedProducts(
  product: { id: string; tags: string[]; category: { id: string } } | null
) {
  return useQuery({
    queryKey: ["products", "related", product?.id],
    queryFn: () =>
      fetchRelatedProducts(product as any),
    staleTime: 5 * 60 * 1000,
    enabled: !!product,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 30 * 60 * 1000,
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => fetchCategoryById(id),
    staleTime: 30 * 60 * 1000,
    enabled: !!id,
  });
}
