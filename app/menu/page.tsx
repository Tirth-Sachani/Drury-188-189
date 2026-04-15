"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore, MenuItem as StoreMenuItem } from "@/lib/store";

/* ─── dietary tag helpers ─── */
type DietaryTag = "V" | "VG" | "GF";

interface MenuItem {
  id: string;
  name: string;
  price: string;
  description: string;
  image: string;
  tags?: DietaryTag[];
}

interface MenuCategory {
  id: string;
  title: string;
  subtitle?: string;
  filterGroup: "Food" | "Drinks";
  image: string;
  items: MenuItem[];
}

/* ─── complete menu data from PDF ─── */
// We'll define the category metadata (images, titles) here and pull items from the store.
const CATEGORY_META: { 
  id: string; 
  title: string; 
  subtitle: string; 
  filterGroup: "Food" | "Drinks"; 
  image: string; 
  storeCategory: string | string[];
}[] = [
  { id: "brunch", title: "Brunch Favourites", subtitle: "Served all day", filterGroup: "Food", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80", storeCategory: "Brunch" },
  { id: "bakery", title: "Bakery & Toast", subtitle: "House-baked daily", filterGroup: "Food", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80", storeCategory: "Bakery" },
  { id: "extras", title: "Extras", subtitle: "Add to any dish", filterGroup: "Food", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", storeCategory: "Extras" },
  { id: "light-bites", title: "Light Bites", subtitle: "Something lighter", filterGroup: "Food", image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80", storeCategory: "Light Bites" },
  { id: "eggs", title: "Drury Style Eggs", subtitle: "Our signature egg dishes", filterGroup: "Food", image: "https://images.unsplash.com/photo-1608039829572-fa01011135e8?w=800&q=80", storeCategory: "Eggs" },
  { id: "sweets", title: "Sweet & Savoury Favourites", subtitle: "Indulgent plates", filterGroup: "Food", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80", storeCategory: "Sweets" },
  { id: "sandwiches", title: "Sandwiches", subtitle: "See serving counter", filterGroup: "Food", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80", storeCategory: "Sandwiches" },
  { id: "lunch", title: "Lunch", subtitle: "Weekdays only from 12PM", filterGroup: "Food", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80", storeCategory: "Lunch" },
  { id: "coffee", title: "Coffee & Tea", subtitle: "Allpress Espresso · Roasted in Hackney E8", filterGroup: "Drinks", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80", storeCategory: ["Coffee", "Tea"] },
  { id: "soft-drinks", title: "Soft Drinks", subtitle: "Spoiled for choice", filterGroup: "Drinks", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80", storeCategory: "Soft Drinks" },
  { id: "juices", title: "Fresh Juices", subtitle: "Simply fresh", filterGroup: "Drinks", image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80", storeCategory: "Juices" },
  { id: "smoothies", title: "Smoothies", subtitle: "Fruit and veg blended", filterGroup: "Drinks", image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&q=80", storeCategory: "Smoothies" },
  { id: "cocktails", title: "Cocktails", subtitle: "Why not?", filterGroup: "Drinks", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80", storeCategory: "Cocktails" },
  { id: "alcohol", title: "Alcohol", subtitle: "The good stuff", filterGroup: "Drinks", image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80", storeCategory: "Alcohol" },
];

/* ─── filter config ─── */
const filterCategories = [
  { label: "All", value: "all" },
  { label: "Brunch", value: "brunch" },
  { label: "Extras", value: "extras" },
  { label: "Light Bites", value: "light-bites" },
  { label: "Eggs", value: "eggs" },
  { label: "Sweets", value: "sweets" },
  { label: "Sandwiches", value: "sandwiches" },
  { label: "Lunch", value: "lunch" },
  { label: "Coffee & Tea", value: "coffee" },
  { label: "Soft Drinks", value: "soft-drinks" },
  { label: "Juices", value: "juices" },
  { label: "Smoothies", value: "smoothies" },
  { label: "Cocktails", value: "cocktails" },
  { label: "Alcohol", value: "alcohol" },
];

/* ─── dietary tag badge ─── */
const TagBadge = ({ tag }: { tag: DietaryTag }) => {
  const colors: Record<DietaryTag, string> = {
    V: "bg-green-800/20 text-green-800 border-green-800/20",
    VG: "bg-emerald-800/20 text-emerald-800 border-emerald-800/20",
    GF: "bg-amber-800/20 text-amber-800 border-amber-800/20",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-semibold tracking-wider border ${colors[tag]}`}>
      {tag}
    </span>
  );
};

/* ─── menu section component ─── */
const MenuSection = ({
  category,
  onImageClick,
  addToCart,
  cart,
}: {
  category: MenuCategory;
  onImageClick: (src: string, title: string) => void;
  addToCart: (item: StoreMenuItem) => void;
  cart: any[];
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    className="mb-20"
  >
    {/* Category image */}
    <div className="mb-10 flex flex-col md:flex-row gap-8 items-start">
      <motion.div
        className="relative w-full md:w-64 h-48 md:h-40 rounded-xl overflow-hidden cursor-pointer group flex-shrink-0"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onImageClick(category.image, category.title)}
      >
        <img
          src={category.image}
          alt={category.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <span className="monolith text-[9px] text-white/80 tracking-widest">Click to expand</span>
        </div>
      </motion.div>

      <div className="flex-1">
        <h3 className="monolith text-xs mb-2 tracking-[0.4em] opacity-40">{category.title}</h3>
        {category.subtitle && (
          <p className="monolith text-[9px] tracking-[0.2em] opacity-30 mb-6">{category.subtitle}</p>
        )}
      </div>
    </div>

    {/* Items */}
    <div className="space-y-8">
      {category.items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.04, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-baseline justify-between gap-3 border-b border-roast/8 pb-6 group hover:border-crema/40 transition-colors duration-500"
        >
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-1.5">
              <h4 className="serif text-xl md:text-2xl group-hover:text-crema transition-colors duration-300">{item.name}</h4>
              {item.tags?.map((tag) => <TagBadge key={tag} tag={tag} />)}
            </div>
            <p className="monolith text-[10px] opacity-40 leading-relaxed">{item.description}</p>
          </div>
          <div className="flex items-center gap-6">
            <span className="serif text-lg md:text-xl italic text-crema whitespace-nowrap">{item.price}</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                // Find the original item from the store to match the addToCart signature
                // Actually, we can just pass the item if it matches the structure
                addToCart(item as unknown as StoreMenuItem);
              }}
              className="w-8 h-8 rounded-full border border-crema/20 flex items-center justify-center text-crema hover:bg-crema hover:text-napkin transition-colors duration-300"
              title="Add to cart"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

/* ─── image lightbox ─── */
const ImageLightbox = ({
  src,
  title,
  onClose,
}: {
  src: string;
  title: string;
  onClose: () => void;
}) => (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
    onClick={onClose}
  >
    {/* Backdrop */}
    <motion.div
      className="absolute inset-0 bg-void/80 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />

    {/* Image container */}
    <motion.div
      className="relative z-10 max-w-4xl w-full"
      initial={{ scale: 0.5, opacity: 0, y: 60 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: 40 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="rounded-2xl overflow-hidden shadow-2xl">
        <img
          src={src}
          alt={title}
          className="w-full h-auto max-h-[70vh] object-cover"
        />
        <div className="bg-napkin px-8 py-5 flex items-center justify-between">
          <div>
            <h3 className="serif text-2xl italic">{title}</h3>
            <p className="monolith text-[9px] tracking-[0.2em] opacity-40 mt-1">Drury 188-189 · Covent Garden</p>
          </div>
          <button
            onClick={onClose}
            className="monolith text-[10px] tracking-[0.3em] text-crema hover:text-roast transition-colors duration-300 border border-crema/30 hover:border-roast/30 rounded-full px-5 py-2"
          >
            Close
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

/* ─── main page ─── */
export default function MenuPage() {
  const { menuItems, cart, addToCart } = useStore();
  const [activeFilter, setActiveFilter] = useState("all");
  const [lightbox, setLightbox] = useState<{ src: string; title: string } | null>(null);

  const openLightbox = useCallback((src: string, title: string) => {
    setLightbox({ src, title });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  // Handle ESC key for lightbox
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, closeLightbox]);

  const menuData = useMemo(() => {
    return CATEGORY_META.map(({ storeCategory, ...cat }) => ({
      ...cat,
      items: menuItems
        .filter(item => {
          if (Array.isArray(storeCategory)) {
            return storeCategory.includes(item.category as any) && item.status === "Published";
          }
          return item.category === storeCategory && item.status === "Published";
        })
        .map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description,
          image: item.image,
          tags: (item as any).tags || [],
        }))
    })).filter(cat => cat.items.length > 0) as MenuCategory[]; // Explicit cast to help TS
  }, [menuItems]);

  const filteredCategories =
    activeFilter === "all"
      ? menuData
      : menuData.filter((c) => c.id === activeFilter);

  return (
    <main className="min-h-screen bg-napkin">

      {/* Hero header */}
      <header className="pt-48 pb-16 text-center">
        <div className="container mx-auto px-6">
          <motion.h1
            className="serif text-6xl md:text-8xl italic mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            The Menu
          </motion.h1>
          <motion.p
            className="monolith text-[10px] tracking-[0.3em] opacity-40 uppercase mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          >
            Curated Daily · Sourced Locally
          </motion.p>
          <motion.p
            className="monolith text-[9px] tracking-[0.15em] opacity-30 max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Breakfast & Brunch Mon–Fri 7:30 AM – 3 PM · Sat–Sun & Holidays 8 AM – 3:30 PM · Lunch served weekdays from 12PM
          </motion.p>
        </div>
      </header>

      {/* Dietary legend */}
      <div className="container mx-auto px-6 max-w-5xl mb-6">
        <motion.div
          className="flex flex-wrap gap-4 justify-center opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.4 }}
        >
          <span className="monolith text-[9px] tracking-wider flex items-center gap-1.5"><TagBadge tag="V" /> Vegetarian</span>
          <span className="monolith text-[9px] tracking-wider flex items-center gap-1.5"><TagBadge tag="VG" /> Vegan</span>
          <span className="monolith text-[9px] tracking-wider flex items-center gap-1.5"><TagBadge tag="GF" /> Gluten Free</span>
        </motion.div>
      </div>

      {/* Filter bar */}
      <motion.div
        className="sticky top-0 z-30 bg-napkin/90 backdrop-blur-lg border-b border-roast/5 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {filterCategories.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`
                  monolith text-[10px] tracking-[0.2em] whitespace-nowrap px-5 py-2.5 rounded-full
                  transition-all duration-400 border flex-shrink-0
                  ${
                    activeFilter === filter.value
                      ? "bg-crema text-white border-crema shadow-lg shadow-crema/20"
                      : "bg-transparent text-roast/60 border-roast/10 hover:border-crema/40 hover:text-crema"
                  }
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Menu sections */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {filteredCategories.map((category) => (
                <MenuSection
                  key={category.id}
                  category={category}
                  onImageClick={openLightbox}
                  addToCart={addToCart}
                  cart={cart}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <ImageLightbox
            src={lightbox.src}
            title={lightbox.title}
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>

      {/* Floating Checkout Button */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-8 right-8 z-[100]"
          >
            <a href="/checkout" className="no-underline">
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="bg-crema text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-4 group"
                style={{ boxShadow: "0 20px 40px -10px rgba(200, 146, 74, 0.4)" }}
              >
                <div className="flex flex-col items-start leading-none">
                  <span className="monolith text-[9px] tracking-[0.2em] opacity-80 uppercase mb-1">Items in Basket</span>
                  <span className="serif text-xl italic">{cart.reduce((sum, item) => sum + item.quantity, 0)} Items</span>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <span className="monolith text-[10px] tracking-[0.3em] uppercase group-hover:translate-x-1 transition-transform duration-300">Checkout →</span>
              </motion.button>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
