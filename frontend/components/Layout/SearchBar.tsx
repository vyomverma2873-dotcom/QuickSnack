import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Search, X } from 'lucide-react';
import { searchProducts, Product } from '@/lib/products';
import { addToCart } from '@/lib/cart';
import toast from 'react-hot-toast';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  className = '', 
  placeholder = 'Search for products...' 
}) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle search input changes
  useEffect(() => {
    if (query.trim().length > 0) {
      const results = searchProducts(query, 8);
      setSuggestions(results);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  }, [query]);

  // Handle clicks outside search component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleProductSelect(suggestions[selectedIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle form submission
  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  // Handle product selection from suggestions
  const handleProductSelect = (product: Product) => {
    router.push(`/categories/${product.categoryId}?highlight=${product.id}`);
    setQuery('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  // Handle add to cart from suggestions
  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    }, 1);
    toast.success(`${product.name} added to cart!`);
  };

  // Clear search
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-white/30 font-semibold rounded px-1">
          {part}
        </span>
      ) : part
    );
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 text-white placeholder-white/60 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 font-medium"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Search Results Header */}
          <div className="px-4 py-2 border-b border-white/20 bg-white/5">
            <p className="text-sm text-white/80">
              {suggestions.length} result{suggestions.length !== 1 ? 's' : ''} for "{query}"
            </p>
          </div>

          {/* Product Suggestions */}
          <div className="py-2">
            {suggestions.map((product, index) => (
              <div
                key={product.id}
                onClick={() => handleProductSelect(product)}
                className={`px-4 py-3 cursor-pointer transition-colors ${
                  index === selectedIndex 
                    ? 'bg-white/20' 
                    : 'hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {/* Product Image */}
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-lg">
                    {product.image}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">
                      {highlightMatch(product.name, query)}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm font-semibold text-white">
                        ₹{product.price}
                      </span>
                      <span className="text-xs text-white/60">
                        in {product.category}
                      </span>
                      <div className="flex items-center">
                        <span className="text-yellow-400 text-xs">★</span>
                        <span className="text-xs text-white/60 ml-1">
                          {product.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="px-3 py-1 bg-white text-black text-xs font-medium rounded-md hover:bg-white/90 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View All Results */}
          <div className="border-t border-white/20 px-4 py-2">
            <button
              onClick={handleSearch}
              className="w-full text-left text-sm text-white hover:text-white/80 font-medium"
            >
              View all results for "{query}" →
            </button>
          </div>
        </div>
      )}

      {/* No Results */}
      {showSuggestions && query.trim() && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-lg z-50">
          <div className="px-4 py-6 text-center">
            <Search className="w-8 h-8 text-white/40 mx-auto mb-2" />
            <p className="text-sm text-white/80 mb-1">No products found for "{query}"</p>
            <p className="text-xs text-white/60">Try searching for fruits, vegetables, dairy, or snacks</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
