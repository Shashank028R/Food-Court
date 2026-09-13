import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Utensils, RotateCcw } from 'lucide-react';
import { FoodCard } from '../components/site/FoodCard';
import { DishModal } from '../components/site/DishModal';
import { api } from '../lib/api';

export const MenuPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [categories, setCategories] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDish, setSelectedDish] = useState(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState('ALL'); // 'ALL' | 'VEG' | 'NON_VEG'
  const [spiceFilter, setSpiceFilter] = useState('ALL'); // 'ALL' | 'MILD' | 'MEDIUM' | 'HOT'

  // Debounce search query input (350ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch categories once
  useEffect(() => {
    api.getCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error('Error loading categories:', err));
  }, []);

  // Fetch food items whenever filters or URL params change
  useEffect(() => {
    const fetchFilteredDishes = async () => {
      try {
        setLoading(true);
        const params = {};

        if (categoryParam && categoryParam !== 'all') {
          params.category = categoryParam;
        }

        if (debouncedSearch.trim()) {
          params.search = debouncedSearch.trim();
        }

        if (dietaryFilter === 'VEG') params.veg = 'true';
        if (dietaryFilter === 'NON_VEG') params.veg = 'false';

        if (spiceFilter !== 'ALL') params.spiceLevel = spiceFilter;

        const items = await api.getFoodItems(params);
        setFoodItems(items);
      } catch (err) {
        console.error('Failed to fetch filtered dishes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredDishes();
  }, [categoryParam, debouncedSearch, dietaryFilter, spiceFilter]);

  const handleCategoryChange = (slug) => {
    if (slug === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: slug });
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setDietaryFilter('ALL');
    setSpiceFilter('ALL');
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  const hasActiveFilters =
    categoryParam !== 'all' ||
    debouncedSearch.trim() !== '' ||
    dietaryFilter !== 'ALL' ||
    spiceFilter !== 'ALL';

  return (
    <div className="min-h-screen pb-20 sm:pb-24 text-left overflow-x-hidden">
      {/* Page Title & Intro Banner */}
      <div className="bg-surface border-b border-soft-border py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-terracotta font-semibold block mb-1.5 sm:mb-2">
            The Complete Tasting Repertoire
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-charcoal tracking-tight mb-2.5 sm:mb-4">
            Artisanal Dining Menu
          </h1>
          <p className="font-sans text-xs sm:text-base text-warm-gray max-w-2xl font-light leading-relaxed">
            Every dish is prepared to order using slow-fermented grains, hearth fire, and pristine seasonal produce.
          </p>
        </div>
      </div>

      {/* Sticky Filter & Search Toolbar - Matches mobile header offset */}
      <div className="sticky top-[56px] sm:top-[69px] z-30 bg-base/95 backdrop-blur-md border-b border-soft-border shadow-subtle py-3 sm:py-4 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-4">
          {/* Top Row: Categories Tabs & Search Input */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4">
            {/* Category Navigation Pills - Touch scrollable */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              <button
                onClick={() => handleCategoryChange('all')}
                className={`flex-shrink-0 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                  categoryParam === 'all'
                    ? 'bg-charcoal text-white shadow-sm'
                    : 'bg-surface text-charcoal border border-soft-border hover:border-terracotta/40'
                }`}
              >
                All Courses
              </button>
              {categories.map((cat) => {
                const isActive = categoryParam === cat.slug;
                return (
                  <button
                    key={cat._id}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`flex-shrink-0 px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                      isActive
                        ? 'bg-charcoal text-white shadow-sm'
                        : 'bg-surface text-charcoal border border-soft-border hover:border-terracotta/40'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Search Input - font-size 16px to prevent iOS auto-zoom */}
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes..."
                className="w-full pl-9 pr-8 py-2.5 sm:py-2 rounded-lg bg-surface border border-soft-border text-sm text-charcoal placeholder-warm-gray/60 focus:border-terracotta transition-colors shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-xs text-warm-gray hover:text-charcoal"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Secondary Filter Row: Dietary & Spice Level */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-soft-border/50 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-warm-gray font-medium flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Filters:</span>
              </span>

              {/* Veg / Non-veg */}
              <div className="inline-flex rounded-lg border border-soft-border bg-surface p-0.5">
                <button
                  onClick={() => setDietaryFilter('ALL')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    dietaryFilter === 'ALL' ? 'bg-base text-charcoal font-semibold' : 'text-warm-gray'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setDietaryFilter('VEG')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    dietaryFilter === 'VEG' ? 'bg-olive/15 text-olive font-semibold' : 'text-warm-gray'
                  }`}
                >
                  Veg
                </button>
                <button
                  onClick={() => setDietaryFilter('NON_VEG')}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                    dietaryFilter === 'NON_VEG' ? 'bg-red-50 text-red-700 font-semibold' : 'text-warm-gray'
                  }`}
                >
                  Non-Veg
                </button>
              </div>

              {/* Spice Level */}
              <div className="inline-flex rounded-lg border border-soft-border bg-surface p-0.5 overflow-x-auto no-scrollbar">
                {['ALL', 'MILD', 'MEDIUM', 'HOT'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setSpiceFilter(lvl)}
                    className={`px-2 py-1 rounded text-[10px] sm:text-[11px] font-medium transition-colors whitespace-nowrap ${
                      spiceFilter === lvl
                        ? 'bg-terracotta/10 text-terracotta font-semibold'
                        : 'text-warm-gray'
                    }`}
                  >
                    {lvl === 'ALL' ? 'Any' : lvl.charAt(0) + lvl.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs text-terracotta hover:text-terracotta-hover font-medium underline-offset-4 hover:underline self-end sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Dishes Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
        <div className="flex items-center justify-between mb-4 sm:mb-6 text-xs text-warm-gray">
          <span>
            Showing <strong className="text-charcoal">{foodItems.length}</strong> dish{foodItems.length === 1 ? '' : 'es'}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-xl bg-stone-100 skeleton-shimmer" />
            ))}
          </div>
        ) : foodItems.length === 0 ? (
          <div className="py-16 sm:py-20 text-center bg-surface rounded-2xl border border-soft-border max-w-lg mx-auto p-6 sm:p-8 shadow-subtle space-y-4">
            <div className="w-14 h-14 rounded-full bg-base border border-soft-border flex items-center justify-center mx-auto text-warm-gray">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-medium text-charcoal">No Dishes Found</h3>
            <p className="text-xs sm:text-sm text-warm-gray font-light max-w-sm mx-auto leading-relaxed">
              We couldn't find any dishes matching your filters. Try adjusting your selections or clearing filters.
            </p>
            <div className="pt-2">
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-terracotta hover:bg-terracotta-hover text-white text-xs font-semibold tracking-wider uppercase transition-all shadow-sm active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {foodItems.map((dish) => (
              <FoodCard key={dish._id} item={dish} onSelect={setSelectedDish} />
            ))}
          </div>
        )}
      </main>

      {/* Dish Modal */}
      {selectedDish && (
        <DishModal item={selectedDish} onClose={() => setSelectedDish(null)} />
      )}
    </div>
  );
};
