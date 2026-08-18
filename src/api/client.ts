import { Product, SearchFilter } from "@/types";
import { products as mockProducts } from "@/data/products";
import { categoryTree } from "@/data/categories";
import { Category } from "@/types";

// Simulate network delay
const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ─── Products ──────────────────────────────────────────────
export async function fetchProducts(
  page: number = 1,
  limit: number = 20
): Promise<{ products: Product[]; total: number; hasMore: boolean }> {
  await delay(300);
  const start = (page - 1) * limit;
  const paginated = mockProducts.slice(start, start + limit);
  return {
    products: paginated,
    total: mockProducts.length,
    hasMore: start + limit < mockProducts.length,
  };
}

export async function fetchProductById(id: string): Promise<Product | null> {
  await delay(200);
  return mockProducts.find((p) => p.id === id) ?? null;
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  await delay(250);
  return mockProducts.filter((p) => p.featured);
}

export async function fetchTrendingProducts(): Promise<Product[]> {
  await delay(250);
  return mockProducts.filter((p) => p.trending);
}

export async function fetchProductsByCategory(
  categoryId: string,
  page: number = 1,
  limit: number = 20
): Promise<{ products: Product[]; total: number; hasMore: boolean }> {
  await delay(300);
  const filtered = mockProducts.filter(
    (p) => p.category.id === categoryId || p.category.parentId === categoryId
  );
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);
  return {
    products: paginated,
    total: filtered.length,
    hasMore: start + limit < filtered.length,
  };
}

export async function searchProducts(
  filter: SearchFilter,
  page: number = 1,
  limit: number = 20
): Promise<{ products: Product[]; total: number; hasMore: boolean }> {
  await delay(300);

  let results = [...mockProducts];

  // Text search
  if (filter.query) {
    const q = filter.query.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.brand?.toLowerCase().includes(q)
    );
  }

  // Category filter
  if (filter.category) {
    results = results.filter(
      (p) =>
        p.category.id === filter.category ||
        p.category.parentId === filter.category
    );
  }

  // Price filter
  if (filter.minPrice !== undefined) {
    results = results.filter((p) => p.price >= filter.minPrice!);
  }
  if (filter.maxPrice !== undefined) {
    results = results.filter((p) => p.price <= filter.maxPrice!);
  }

  // Sort
  switch (filter.sortBy) {
    case "price_asc":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      results.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      results.sort((a, b) => b.rating - a.rating);
      break;
    case "popular":
      results.sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case "latest":
    default:
      results.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
  }

  const start = (page - 1) * limit;
  const paginated = results.slice(start, start + limit);
  return {
    products: paginated,
    total: results.length,
    hasMore: start + limit < results.length,
  };
}

export async function fetchRelatedProducts(
  product: Product,
  limit: number = 6
): Promise<Product[]> {
  await delay(200);
  return mockProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category.id === product.category.id ||
          p.tags.some((t) => product.tags.includes(t)))
    )
    .slice(0, limit);
}

// ─── Categories ────────────────────────────────────────────
export async function fetchCategories(): Promise<Category[]> {
  await delay(200);
  return categoryTree;
}

export async function fetchCategoryById(
  id: string
): Promise<Category | null> {
  await delay(150);
  const all = categoryTree.flatMap((c) => [c, ...(c.children ?? [])]);
  return all.find((c) => c.id === id) ?? null;
}
