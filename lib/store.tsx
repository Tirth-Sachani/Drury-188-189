"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { db } from "./firebase";
import { doc, getDoc, setDoc, onSnapshot, collection, addDoc, updateDoc, deleteDoc, query, orderBy, QuerySnapshot, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

// Types
export interface Post {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
  status: "Published" | "Pending" | "Draft";
  isFeatured?: boolean;
}

export interface Napkin {
  id: string;
  artist: string;
  image: string;
  type: string;
  desc: string;
  status: "Published" | "Pending" | "Draft";
  offset?: string;
  rotate?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: "Brunch" | "Extras" | "Light Bites" | "Eggs" | "Sweets" | "Sandwiches" | "Lunch" | "Coffee" | "Tea" | "Soft Drinks" | "Juices" | "Smoothies" | "Cocktails" | "Alcohol" | "Bakery";
  image: string;
  status: "Published" | "Draft";
}

export interface Artisan {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Barista" | "Member";
  status: "Active" | "Inactive" | "Pending";
  joinDate: string;
  lastVisit: string;
  avatar: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface Settings {
  studioName: string;
  tagline: string;
  description: string;
  address: string;
  email: string;
  weekdayHours: string;
  weekendHours: string;
}

interface StoreContextType {
  posts: Post[];
  napkins: Napkin[];
  menuItems: MenuItem[];
  artisans: Artisan[];
  cart: CartItem[];
  settings: Settings;
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (data: Omit<User, "id"> & { password?: string }) => boolean;
  addPost: (post: Omit<Post, "id">) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  deletePost: (id: string) => void;
  addNapkin: (napkin: Omit<Napkin, "id">) => void;
  deleteNapkin: (id: string) => void;
  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  addArtisan: (artisan: Omit<Artisan, "id">) => void;
  updateArtisan: (id: string, updates: Partial<Artisan>) => void;
  deleteArtisan: (id: string) => void;
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  updateSettings: (updates: Partial<Settings>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Initial Data
const INITIAL_SETTINGS: Settings = {
  studioName: "Drury 188-189",
  tagline: "Artisan Coffee & Editorial Design",
  description: "A premium cafe experience at Drury 188-189. Editorial design, artisan coffee, and curated menu.",
  address: "188-189 Drury Lane, London WC2B 5QD",
  email: "hello@drury188.com",
  weekdayHours: "08:00 - 18:00",
  weekendHours: "09:00 - 17:00",
};

const INITIAL_POSTS: Post[] = [
  {
    id: "post-1",
    title: "The Napkin Art Coffee Table Book",
    date: "Oct 12, 2024",
    category: "Community",
    excerpt: "Years of guest-created art, sketches, and stories captured in a premium hardback volume. A tribute to the community that built Drury.",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80",
    status: "Published",
    isFeatured: true,
  },
  {
    id: "post-2",
    title: "Rated #1 Cafe in London",
    date: "Aug 24, 2024",
    category: "News",
    excerpt: "TripAdvisor has officially ranked Drury 188-189 as the top-rated cafe in the city. We celebrate with our lovely staff and regular guests.",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80",
    status: "Published",
    isFeatured: true,
  },
  {
    id: "post-3",
    title: "The Allpress Ritual: Our Roast Story",
    date: "Jun 15, 2024",
    category: "Coffee",
    excerpt: "A deep dive into why we've partnered with Allpress Espresso for nearly a decade. Exploring the science and soul of the perfect shot.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80",
    status: "Published",
    isFeatured: true,
  },
  {
    id: "post-4",
    title: "A Study in Sourdough: The Bake Process",
    date: "May 10, 2024",
    category: "Culinary",
    excerpt: "We sat down with our head baker to understand what makes a perfect loaf of sourdough, from starter to slice.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80",
    status: "Published",
  },
];

const INITIAL_NAPKINS: Napkin[] = [
  {
    id: "042",
    artist: "Maya J.",
    image: "data:image/jpeg;base64,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",
    type: "Abstract",
    desc: "A fleeting impression captured over an early morning flat white. Deep shadows built up with ballpoint pen.",
    status: "Published",
    offset: "mt-0",
    rotate: -4,
  },
  {
    id: "108",
    artist: "Elena V.",
    image: "data:image/jpeg;base64,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",
    type: "Geometric",
    desc: "A study of movement inspired by the cafe's bustling afternoon rush.",
    status: "Published",
    offset: "mt-32",
    rotate: 6,
  },
  {
    id: "109",
    artist: "Liam S.",
    image: "https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?auto=format&fit=crop&q=80",
    type: "Portrait",
    desc: "Detailed sketch of a regular guest reading the morning paper. Ink on parchment.",
    status: "Published",
    offset: "mt-12",
    rotate: -2,
  },
  {
    id: "110",
    artist: "Alex R.",
    image: "https://images.unsplash.com/photo-1515405290399-ed342cd5fcae?auto=format&fit=crop&q=80",
    type: "Sketch",
    desc: "Expressive brushstrokes mimicking the steam from a fresh double espresso.",
    status: "Published",
    offset: "mt-44",
    rotate: 8,
  },
];

const INITIAL_MENU: MenuItem[] = [
  // Brunch Favourites
  { id: "m-1", name: "Smashed Avocado", price: "£9.50", description: "With mint & lemon dressing on sourdough toasts. (VG)", category: "Brunch", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80", status: "Published" },
  { id: "m-2", name: "Any Style Organic Eggs", price: "£8.50", description: "Poached, scrambled or fried on sourdough toasts. (V)", category: "Brunch", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80", status: "Published" },
  { id: "m-3", name: "Scrambled Turmeric Tofu", price: "£8.50", description: "On sourdough toasts. (VG)", category: "Brunch", image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&q=80", status: "Published" },

  // Extras
  { id: "e-1", name: "Organic Farm Eggs", price: "£3.50", description: "Poached, scrambled or fried. (V)", category: "Extras", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", status: "Published" },
  { id: "e-2", name: "Grilled Cypriot Organic Halloumi", price: "£3.50", description: "(V)", category: "Extras", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", status: "Published" },
  { id: "e-3", name: "Streaky British Bacon", price: "£4.00", description: "", category: "Extras", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", status: "Published" },
  { id: "e-4", name: "Scottish Smoked Salmon", price: "£4.70", description: "", category: "Extras", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", status: "Published" },
  { id: "e-5", name: "Baked Beans", price: "£3.50", description: "In rich tomato sauce. (V/VG)", category: "Extras", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", status: "Published" },
  { id: "e-6", name: "Roasted Chestnut Mushrooms", price: "£3.50", description: "(V/VG)", category: "Extras", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", status: "Published" },
  { id: "e-7", name: "Mixed Leaf Salad", price: "£3.50", description: "With pomegranate molasses. (V/VG)", category: "Extras", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", status: "Published" },
  { id: "e-8", name: "Sautéd Spinach", price: "£3.50", description: "(V/VG)", category: "Extras", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", status: "Published" },
  { id: "e-9", name: "Crushed Feta Cheese", price: "£3.50", description: "(V)", category: "Extras", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", status: "Published" },
  { id: "e-10", name: "Gluten Free Bread", price: "£1.00", description: "Available upgrade", category: "Extras", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80", status: "Published" },

  // Light Bites
  { id: "lb-1", name: "Sourdough Toast", price: "£5.50", description: "With butter and jam or marmalade. (V)", category: "Light Bites", image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80", status: "Published" },
  { id: "lb-2", name: "Creamy Coconut Milk Porridge", price: "£9.50", description: "Berries, bananas, coconut flakes, pecans. (V/VG)", category: "Light Bites", image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80", status: "Published" },
  { id: "lb-3", name: "Homemade Granola", price: "£8.50", description: "Rich Greek yoghurt, berries, pistachios. (V/GF)", category: "Light Bites", image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800&q=80", status: "Published" },

  // Drury Style Eggs
  { id: "eg-1", name: "Eggs Florentine", price: "£12.90", description: "Spinach, poached eggs, hollandaise on muffins. (V)", category: "Eggs", image: "https://images.unsplash.com/photo-1608039829572-fa01011135e8?w=800&q=80", status: "Published" },
  { id: "eg-2", name: "Eggs Benedict", price: "£13.90", description: "Ham, poached eggs, hollandaise on muffins.", category: "Eggs", image: "https://images.unsplash.com/photo-1608039829572-fa01011135e8?w=800&q=80", status: "Published" },
  { id: "eg-3", name: "Eggs Pastrami", price: "£13.90", description: "Pastrami, poached eggs, hollandaise on muffins.", category: "Eggs", image: "https://images.unsplash.com/photo-1608039829572-fa01011135e8?w=800&q=80", status: "Published" },
  { id: "eg-4", name: "Eggs Drury", price: "£13.90", description: "Streaky bacon, poached eggs, hollandaise on muffins.", category: "Eggs", image: "https://images.unsplash.com/photo-1608039829572-fa01011135e8?w=800&q=80", status: "Published" },
  { id: "eg-5", name: "Eggs Royale", price: "£14.90", description: "Smoked salmon, poached eggs, hollandaise on muffins.", category: "Eggs", image: "https://images.unsplash.com/photo-1608039829572-fa01011135e8?w=800&q=80", status: "Published" },

  // Sweet & Savoury Favourites
  { id: "sw-1", name: "French Toast", price: "£14.90", description: "Brioche, cinnamon sugar, fresh fruits, Greek yoghurt. (V)", category: "Sweets", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80", status: "Published" },
  { id: "sw-2", name: "Drury Sweet Pancake", price: "£14.90", description: "Vanilla mascarpone, berry compote, crumble. (V)", category: "Sweets", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80", status: "Published" },
  { id: "sw-3", name: "Drury Savoury Pancake", price: "£14.90", description: "Streaky bacon, fried organic egg, grated parmesan.", category: "Sweets", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80", status: "Published" },

  // Sandwiches
  { id: "sn-1", name: "Egg & Bacon Brioche Bun", price: "£7.00", description: "", category: "Sandwiches", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80", status: "Published" },
  { id: "sn-2", name: "Chicken & Cheese Panini", price: "£7.00", description: "Spinach, tomato & pesto.", category: "Sandwiches", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80", status: "Published" },
  { id: "sn-3", name: "Ham & Cheese Toastie", price: "£6.00", description: "Classic grilled.", category: "Sandwiches", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80", status: "Published" },
  { id: "sn-4", name: "Vegan Focaccia", price: "£7.00", description: "Grilled mushrooms, vegan cheese, rocket & hummus. (VG)", category: "Sandwiches", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80", status: "Published" },

  // Lunch
  { id: "ln-1", name: "Any 1 Salad", price: "£7.00", description: "V/VG/GF options available.", category: "Lunch", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80", status: "Published" },
  { id: "ln-2", name: "Mix of 2 Salads", price: "£10.00", description: "", category: "Lunch", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80", status: "Published" },
  { id: "ln-3", name: "Salad & Roast Chicken", price: "£12.00", description: "", category: "Lunch", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80", status: "Published" },

  // Coffee & Tea
  { id: "c-1", name: "Espresso", price: "£3.00", description: "Short Black", category: "Coffee", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80", status: "Published" },
  { id: "c-2", name: "Americano", price: "£3.40", description: "", category: "Coffee", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80", status: "Published" },
  { id: "c-3", name: "Flat White", price: "£3.50", description: "Artisan Allpress Espresso.", category: "Coffee", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80", status: "Published" },
  { id: "c-4", name: "Latte", price: "£3.60", description: "", category: "Coffee", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80", status: "Published" },
  { id: "c-5", name: "Cappuccino", price: "£3.60", description: "", category: "Coffee", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80", status: "Published" },
  { id: "c-6", name: "Pot of Tea", price: "£3.50", description: "Tea Pigs - English Breakfast, Earl Grey, Green, Mint, etc.", category: "Tea", image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80", status: "Published" },

  // Soft Drinks
  { id: "sd-1", name: "Spring Water", price: "£2.20", description: "Still or Sparkling", category: "Soft Drinks", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80", status: "Published" },
  { id: "sd-2", name: "Vita Coconut Water", price: "£3.50", description: "", category: "Soft Drinks", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80", status: "Published" },
  { id: "sd-3", name: "Lemonaid", price: "£4.00", description: "Passion Fruit / Blood Orange / Lime", category: "Soft Drinks", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80", status: "Published" },

  // Juices & Smoothies
  { id: "j-1", name: "Yellow Boost", price: "£6.70", description: "Lemon, orange, ginger & carrot.", category: "Juices", image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80", status: "Published" },
  { id: "j-2", name: "Green Goodness", price: "£6.70", description: "Kiwi, broccoli, cucumber & spinach.", category: "Juices", image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80", status: "Published" },
  { id: "sm-1", name: "Berry Go-Round", price: "£6.70", description: "Strawberry, blackberry & raspberry.", category: "Smoothies", image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&q=80", status: "Published" },

  // Cocktails & Alcohol
  { id: "ck-1", name: "Mimosa", price: "£9.00", description: "Prosecco and fresh orange juice.", category: "Cocktails", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80", status: "Published" },
  { id: "ck-2", name: "Espresso Martini", price: "£10.00", description: "Allpress espresso, vodka and kahlua.", category: "Cocktails", image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80", status: "Published" },
  { id: "al-1", name: "Beers", price: "£6.00", description: "Asahi, Corona, Moretti, Camden Hells/Pale.", category: "Alcohol", image: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&q=80", status: "Published" },
];

const INITIAL_ARTISANS: Artisan[] = [
  {
    id: "artisan-1",
    name: "Elena Rosier",
    email: "elena@drury188.com",
    role: "Admin",
    status: "Active",
    joinDate: "Oct 12, 2021",
    lastVisit: "4 mins ago",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: "artisan-2",
    name: "Marcus Thorne",
    email: "m.thorne@drury188.com",
    role: "Barista",
    status: "Active",
    joinDate: "Jan 05, 2023",
    lastVisit: "Yesterday, 18:45",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
  {
    id: "artisan-3",
    name: "Clara Beaumont",
    email: "clara.b@gmail.com",
    role: "Member",
    status: "Active",
    joinDate: "Mar 19, 2024",
    lastVisit: "Today, 08:12",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  },
  {
    id: "artisan-4",
    name: "Sofia Larentis",
    email: "sofia.l@outlook.com",
    role: "Member",
    status: "Inactive",
    joinDate: "Feb 28, 2024",
    lastVisit: "3 days ago",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
  },
  {
    id: "artisan-5",
    name: "Julian Vance",
    email: "julian.v@drury188.com",
    role: "Admin",
    status: "Active",
    joinDate: "Jun 15, 2020",
    lastVisit: "2h ago",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  },
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [napkins, setNapkins] = useState<Napkin[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [artisans, setArtisans] = useState<Artisan[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [settings, setSettings] = useState<Settings>(INITIAL_SETTINGS);
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Load local from localStorage first for instant UI
    const savedPosts = localStorage.getItem("drury_posts");
    const savedNapkins = localStorage.getItem("drury_napkins");
    const savedMenu = localStorage.getItem("drury_menu");
    const savedArtisans = localStorage.getItem("drury_artisans");
    const savedCart = localStorage.getItem("drury_cart");
    const savedUser = localStorage.getItem("drury_user");
    const savedSettings = localStorage.getItem("drury_settings");

    // Initial load from localStorage (will be overwritten by Firestore if successful)
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    else setPosts(INITIAL_POSTS);

    if (savedNapkins) setNapkins(JSON.parse(savedNapkins));
    else setNapkins(INITIAL_NAPKINS);

    if (savedMenu) setMenuItems(JSON.parse(savedMenu));
    else setMenuItems(INITIAL_MENU);

    if (savedArtisans) setArtisans(JSON.parse(savedArtisans));
    else setArtisans(INITIAL_ARTISANS);

    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      const sanitizedCart = parsedCart.map((i: any, index: number) => ({
        ...i,
        id: i.id || `legacy-cart-item-${index}-${i.name}`
      }));
      setCart(sanitizedCart);
    }

    if (savedSettings) setSettings(JSON.parse(savedSettings));
    else setSettings(INITIAL_SETTINGS);

    if (savedUser) setUser(JSON.parse(savedUser));

    setIsInitialized(true);

    // Sync with Firestore (Real-time)
    const unsubscribers: (() => void)[] = [];

    try {
      // 1. Settings Sync
      const settingsDoc = doc(db, "config", "settings");
      unsubscribers.push(onSnapshot(settingsDoc, (docSnap) => {
        if (docSnap.exists()) {
          const remoteSettings = docSnap.data() as Settings;
          setSettings(remoteSettings);
          localStorage.setItem("drury_settings", JSON.stringify(remoteSettings));
        }
      }));

      // 2. Menu Sync
      const menuQuery = query(collection(db, "menu"));
      unsubscribers.push(onSnapshot(menuQuery, (snapshot: QuerySnapshot<DocumentData>) => {
        const remoteMenu = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ ...doc.data(), id: doc.id } as MenuItem));
        setMenuItems(remoteMenu);
        localStorage.setItem("drury_menu", JSON.stringify(remoteMenu));
      }));

      // 3. Posts Sync
      const postsQuery = query(collection(db, "posts"), orderBy("date", "desc"));
      unsubscribers.push(onSnapshot(postsQuery, (snapshot: QuerySnapshot<DocumentData>) => {
        const remotePosts = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ ...doc.data(), id: doc.id } as Post));
        setPosts(remotePosts);
        localStorage.setItem("drury_posts", JSON.stringify(remotePosts));
      }));

      // 4. Napkins Sync
      const napkinsQuery = query(collection(db, "napkins"));
      unsubscribers.push(onSnapshot(napkinsQuery, (snapshot: QuerySnapshot<DocumentData>) => {
        const remoteNapkins = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ ...doc.data(), id: doc.id } as Napkin));
        setNapkins(remoteNapkins);
        localStorage.setItem("drury_napkins", JSON.stringify(remoteNapkins));
      }));

      // 5. Artisans Sync
      const artisansQuery = query(collection(db, "artisans"));
      unsubscribers.push(onSnapshot(artisansQuery, (snapshot: QuerySnapshot<DocumentData>) => {
        const remoteArtisans = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ ...doc.data(), id: doc.id } as Artisan));
        setArtisans(remoteArtisans);
        localStorage.setItem("drury_artisans", JSON.stringify(remoteArtisans));
      }));

    } catch (error) {
      console.warn("Firestore sync failed, using localStorage fallback:", error);
    }

    return () => unsubscribers.forEach(unsub => unsub());
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("drury_posts", JSON.stringify(posts));
      localStorage.setItem("drury_napkins", JSON.stringify(napkins));
      localStorage.setItem("drury_menu", JSON.stringify(menuItems));
      localStorage.setItem("drury_artisans", JSON.stringify(artisans));
      localStorage.setItem("drury_cart", JSON.stringify(cart));
      localStorage.setItem("drury_settings", JSON.stringify(settings));
      if (user) {
        localStorage.setItem("drury_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("drury_user");
      }
    }
  }, [posts, napkins, menuItems, artisans, cart, settings, user, isInitialized]);

  // Auth Actions
  const login = (email: string, password: string): boolean => {
    if (email === "curator@drury.com" && password === "drury2026") {
      setUser({
        id: "admin-1",
        name: "Artisan Curator",
        email: email,
        role: "Administrator"
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const register = (data: Omit<User, "id"> & { password?: string }) => {
    console.log("Access request submitted:", data);
    return true;
  };

  // State Mutators with Firestore Persistence
  const addPost = async (post: Omit<Post, "id">) => {
    try {
      await addDoc(collection(db, "posts"), post);
    } catch (error) {
      console.error("Error adding post:", error);
      // Fallback to local state if offline/error
      const newPost = { ...post, id: `post-${Date.now()}` };
      setPosts((prev: Post[]) => [newPost, ...prev]);
    }
  };

  const updatePost = async (id: string, updates: Partial<Post>) => {
    try {
      await updateDoc(doc(db, "posts", id), updates);
    } catch (error) {
      console.error("Error updating post:", error);
      setPosts((prev: Post[]) => prev.map((p: Post) => (p.id === id ? { ...p, ...updates } : p)));
    }
  };

  const deletePost = async (id: string) => {
    try {
      await deleteDoc(doc(db, "posts", id));
    } catch (error) {
      console.error("Error deleting post:", error);
      setPosts((prev: Post[]) => prev.filter((p: Post) => p.id !== id));
    }
  };

  const addNapkin = async (napkin: Omit<Napkin, "id">) => {
    try {
      await addDoc(collection(db, "napkins"), napkin);
    } catch (error) {
      console.error("Error adding napkin:", error);
      const newNapkin = { ...napkin, id: `${Math.floor(Math.random() * 999).toString().padStart(3, "0")}` };
      setNapkins((prev: Napkin[]) => [newNapkin, ...prev]);
    }
  };

  const deleteNapkin = async (id: string) => {
    try {
      await deleteDoc(doc(db, "napkins", id));
    } catch (error) {
      console.error("Error deleting napkin:", error);
      setNapkins((prev: Napkin[]) => prev.filter((n: Napkin) => n.id !== id));
    }
  };

  const addMenuItem = async (item: Omit<MenuItem, "id">) => {
    try {
      await addDoc(collection(db, "menu"), item);
    } catch (error) {
      console.error("Error adding menu item:", error);
      const newItem = { ...item, id: `menu-${Date.now()}` };
      setMenuItems((prev: MenuItem[]) => [newItem, ...prev]);
    }
  };

  const updateMenuItem = async (id: string, updates: Partial<MenuItem>) => {
    try {
      await updateDoc(doc(db, "menu", id), updates);
    } catch (error) {
      console.error("Error updating menu item:", error);
      setMenuItems((prev: MenuItem[]) => prev.map((m: MenuItem) => (m.id === id ? { ...m, ...updates } : m)));
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, "menu", id));
    } catch (error) {
      console.error("Error deleting menu item:", error);
      setMenuItems((prev: MenuItem[]) => prev.filter((m: MenuItem) => m.id !== id));
    }
  };

  const addArtisan = async (artisan: Omit<Artisan, "id">) => {
    try {
      await addDoc(collection(db, "artisans"), artisan);
    } catch (error) {
      console.error("Error adding artisan:", error);
      const newArtisan = { ...artisan, id: `art-${Date.now()}` };
      setArtisans((prev: Artisan[]) => [newArtisan, ...prev]);
    }
  };

  const updateArtisan = async (id: string, updates: Partial<Artisan>) => {
    try {
      await updateDoc(doc(db, "artisans", id), updates);
    } catch (error) {
      console.error("Error updating artisan:", error);
      setArtisans((prev: Artisan[]) => prev.map((a: Artisan) => (a.id === id ? { ...a, ...updates } : a)));
    }
  };

  const deleteArtisan = async (id: string) => {
    try {
      await deleteDoc(doc(db, "artisans", id));
    } catch (error) {
      console.error("Error deleting artisan:", error);
      setArtisans((prev: Artisan[]) => prev.filter((a: Artisan) => a.id !== id));
    }
  };

  // Cart Actions
  const addToCart = (item: MenuItem) => {
    const itemId = item.id || item.name; // Fallback to name if id is somehow missing
    setCart((prev: CartItem[]) => {
      const existingItem = prev.find((i: CartItem) => i.id === itemId);
      if (existingItem) {
        return prev.map((i: CartItem) =>
          i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { id: itemId, name: item.name, price: item.price, quantity: 1, image: item.image }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev: CartItem[]) => prev.filter((i: CartItem) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev: CartItem[]) =>
      prev.map((i: CartItem) => {
        if (i.id === id) {
          const newQty = Math.max(1, i.quantity + delta);
          return { ...i, quantity: newQty };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    try {
      await setDoc(doc(db, "config", "settings"), newSettings);
    } catch (error) {
      console.error("Failed to save settings to Firestore:", error);
    }
  };

  const value = {
    posts,
    napkins,
    menuItems,
    artisans,
    settings,
    user,
    isAuthenticated: !!user,
    isInitialized,
    login,
    logout,
    register,
    addPost,
    updatePost,
    deletePost,
    addNapkin,
    deleteNapkin,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addArtisan,
    updateArtisan,
    deleteArtisan,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    updateSettings,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
