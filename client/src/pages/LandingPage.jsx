import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ChefHat, Flame, Award, HeartHandshake } from 'lucide-react';
import { HeroSlider } from '../components/site/HeroSlider';
import { FoodCard } from '../components/site/FoodCard';
import { CategoryTile } from '../components/site/CategoryTile';
import { DishModal } from '../components/site/DishModal';
import { SpecialBadge } from '../components/ui/Badge';
import { api } from '../lib/api';

export const LandingPage = ({ settings }) => {
  const [specials, setSpecials] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [previewItems, setPreviewItems] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [specialsData, popularData, categoriesData, allItems] = await Promise.all([
          api.getFoodItems({ special: 'true' }),
          api.getFoodItems({ popular: 'true' }),
          api.getCategories(),
          api.getFoodItems(),
        ]);

        setSpecials(specialsData);
        setPopularItems(popularData);
        setCategories(categoriesData);
        // Preview items: pick items that are not in specials to avoid duplicate repetition
        const previewList = allItems
          .filter((item) => !item.isTodaysSpecial)
          .slice(0, 6);
        setPreviewItems(previewList);
      } catch (err) {
        console.error('Failed to load landing data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* 1. Hero Section Slider */}
      <HeroSlider
        images={settings?.heroImages}
        tagline={settings?.tagline}
        subheadline={settings?.subheadline}
      />

      {/* 2. Today's Special Section (Distinct Gold Accent & Editorial Spread) */}
      <section id="specials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-soft-border">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 text-[#927415] border border-gold/30 text-xs font-semibold tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Epicurean Selection</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-charcoal tracking-tight">
              Today's Chef's Specials
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-warm-gray max-w-md mt-2 md:mt-0 font-light">
            Handpicked seasonal delicacies prepared in limited daily quantities by our head culinary team.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-80 rounded-2xl bg-stone-100 skeleton-shimmer" />
            <div className="h-80 rounded-2xl bg-stone-100 skeleton-shimmer" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {specials.map((dish) => (
              <div
                key={dish._id}
                onClick={() => setSelectedDish(dish)}
                className="group relative bg-surface rounded-2xl border border-gold/30 hover:border-gold/60 shadow-subtle hover:shadow-lifted overflow-hidden transition-all duration-300 flex flex-col sm:flex-row cursor-pointer"
              >
                {/* Visual */}
                <div className="sm:w-1/2 aspect-[4/3] sm:aspect-auto overflow-hidden bg-stone-100 relative">
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <SpecialBadge />
                  </div>
                </div>

                {/* Content */}
                <div className="sm:w-1/2 p-6 sm:p-7 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-gold font-bold block mb-1">
                      {dish.category?.name || "Specialty"}
                    </span>
                    <h3 className="font-serif text-2xl font-medium text-charcoal group-hover:text-terracotta transition-colors mb-2">
                      {dish.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-warm-gray line-clamp-3 leading-relaxed font-light mb-4">
                      {dish.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-soft-border/70 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-warm-gray block font-light">Chef's Offering</span>
                      <span className="font-serif text-xl font-bold text-terracotta">
                        ${dish.price.toFixed(2)}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-charcoal group-hover:text-terracotta transition-colors">
                      <span>View Dish</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Most Popular Dishes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-soft-border">
          <div>
            <span className="text-xs uppercase tracking-widest text-terracotta font-semibold block mb-1">
              Guest Favorites
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal tracking-tight">
              Most Celebrated Creations
            </h2>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-terracotta hover:underline mt-3 sm:mt-0"
          >
            <span>Explore All Dishes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-xl bg-stone-100 skeleton-shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularItems.slice(0, 6).map((item) => (
              <FoodCard key={item._id} item={item} onSelect={setSelectedDish} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Browse by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs uppercase tracking-widest text-terracotta font-semibold block mb-1">
            Curated Courses
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal tracking-tight">
            Browse by Culinary Section
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-64 rounded-xl bg-stone-100 skeleton-shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryTile key={category._id} category={category} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Editorial Restaurant Philosophy & Story (Michelin/Boutique Feel) */}
      <section id="about" className="bg-surface border-y border-soft-border py-16 sm:py-24 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Photo Montage */}
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-lifted border border-soft-border">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop"
                  alt="Chefs finishing artisanal handmade pasta"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Culinary Stat Card */}
              <div className="absolute -bottom-6 -right-6 bg-charcoal text-base p-6 rounded-xl shadow-elevated border border-gold/30 hidden sm:block max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <Flame className="w-5 h-5 text-gold" />
                  <span className="text-xs uppercase tracking-wider text-gold font-semibold">
                    Hearth & Iron
                  </span>
                </div>
                <p className="text-xs text-stone-300 font-light leading-relaxed">
                  Every dish is kissed by white oak flame and finished with hand-harvested flaked sea salt.
                </p>
              </div>
            </div>

            {/* Right Story Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-semibold tracking-wider uppercase">
                <ChefHat className="w-4 h-4" />
                <span>Our Epicurean Heritage</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-light text-charcoal leading-[1.15] tracking-tight">
                Crafted with intention. Grounded in tradition.
              </h2>

              <p className="text-sm sm:text-base text-warm-gray font-light leading-relaxed">
                At Food Court, dining is elevated beyond simple nourishment into a sensory pilgrimage.
                We partner with biodynamic foragers, heritage grain millers, and coastal fishermen who
                share our reverence for purity and seasonality.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="p-4 rounded-xl bg-base border border-soft-border space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-terracotta/15 flex items-center justify-center text-terracotta">
                    <Award className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-base font-medium text-charcoal">Zero Artificiality</h4>
                  <p className="text-xs text-warm-gray font-light leading-relaxed">
                    Uncompromised pantry standards. Never frozen, completely free from artificial additives.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-base border border-soft-border space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center text-gold">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <h4 className="font-serif text-base font-medium text-charcoal">Warmth of Service</h4>
                  <p className="text-xs text-warm-gray font-light leading-relaxed">
                    Hospitality that honors the ancient tradition of welcoming travelers to the hearth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. A Little Bit of Everything Else Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-soft-border">
          <div>
            <span className="text-xs uppercase tracking-widest text-terracotta font-semibold block mb-1">
              The Tasting Catalog
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-charcoal tracking-tight">
              A Taste of Everything Else
            </h2>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-terracotta hover:underline mt-3 sm:mt-0"
          >
            <span>View Full Menu & Pricing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {previewItems.map((item) => (
            <FoodCard key={item._id} item={item} onSelect={setSelectedDish} />
          ))}
        </div>

        {/* Big End CTA */}
        <div className="bg-charcoal rounded-2xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-elevated">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <span className="text-xs uppercase tracking-widest text-gold font-medium">
              Join Us Tableside or Order Direct
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-light">
              Ready to experience true culinary devotion?
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed">
              Explore our full seasonal repertoire, custom dietary preparations, and order with instant confirmation.
            </p>
            <div className="pt-2">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-terracotta hover:bg-terracotta-hover text-white text-sm font-semibold tracking-wide transition-all duration-200 hover:scale-105 shadow-lifted"
              >
                <span>Browse The Complete Menu</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dish Modal */}
      {selectedDish && (
        <DishModal item={selectedDish} onClose={() => setSelectedDish(null)} />
      )}
    </div>
  );
};
