// Centralized products database for search functionality
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  categoryId: string;
  rating: number;
  reviews?: number;
  deliveryTime?: string;
  inStock: boolean;
  discount?: number;
  description: string;
}

// All products from all categories - cleared for real products
export const allProducts: Product[] = [
  // No dummy products - ready for real products to be added
];

// Search functionality
export const searchProducts = (query: string, limit: number = 10): Product[] => {
  if (!query.trim()) return [];
  
  const searchTerm = query.toLowerCase().trim();
  
  return allProducts
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    )
    .slice(0, limit);
};

// Get products by category
export const getProductsByCategory = (categoryId: string, limit?: number): Product[] => {
  const filtered = allProducts.filter(product => product.categoryId === categoryId);
  return limit ? filtered.slice(0, limit) : filtered;
};

// Get featured products (highest rated)
export const getFeaturedProducts = (limit: number = 8): Product[] => {
  return allProducts
    .filter(product => product.inStock)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};
