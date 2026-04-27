import { useEffect, useState, useCallback } from "react";

export type Product = {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  seller: string;
  createdAt: number;
};

export type Message = {
  id: string;
  productId: string;
  user: string;
  text: string;
  ts: number;
};

export const CATEGORIES = ["Books", "Electronics", "Furniture", "Clothing", "Services", "Other"];

const SEED: Product[] = [
  {
    id: "p1",
    title: "Calculus Textbook (8th Ed.)",
    price: 25,
    category: "Books",
    description: "Lightly used calculus textbook. No highlights, perfect for first-year math.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop",
    seller: "Amina",
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: "p2",
    title: "MacBook Air M1 — 256GB",
    price: 720,
    category: "Electronics",
    description: "Excellent condition, battery cycle count 120. Comes with original charger.",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop",
    seller: "Yusuf",
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: "p3",
    title: "IKEA Study Desk",
    price: 45,
    category: "Furniture",
    description: "White desk, 120x60cm. Great for dorm rooms. Pickup only.",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop",
    seller: "Lina",
    createdAt: Date.now() - 86400000 * 7,
  },
  {
    id: "p4",
    title: "Math Tutoring — 1hr session",
    price: 15,
    category: "Services",
    description: "I tutor Calc I & II. Friendly, patient, and exam-focused.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop",
    seller: "Omar",
    createdAt: Date.now() - 86400000,
  },
  {
    id: "p5",
    title: "Winter Jacket — Size M",
    price: 35,
    category: "Clothing",
    description: "Warm, waterproof. Worn one season. Black.",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop",
    seller: "Sara",
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: "p6",
    title: "Sony WH-1000XM4 Headphones",
    price: 180,
    category: "Electronics",
    description: "Best-in-class noise cancelling. Includes case and cable.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop",
    seller: "Karim",
    createdAt: Date.now() - 86400000 * 3,
  },
];

const isBrowser = () => typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, val: T) {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(val));
  window.dispatchEvent(new Event("sm:store"));
}

const PROD_KEY = "sm.products";
const FAV_KEY = "sm.favorites";
const USER_KEY = "sm.user";
const MSG_KEY = "sm.messages";

function useStore<T>(key: string, fallback: T): [T, (v: T | ((p: T) => T)) => void] {
  const [state, setState] = useState<T>(fallback);
  useEffect(() => {
    setState(read(key, fallback));
    const onChange = () => setState(read(key, fallback));
    window.addEventListener("sm:store", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("sm:store", onChange);
      window.removeEventListener("storage", onChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const set = useCallback(
    (v: T | ((p: T) => T)) => {
      setState((prev) => {
        const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        write(key, next);
        return next;
      });
    },
    [key],
  );
  return [state, set];
}

export function useProducts() {
  const [products, setProducts] = useStore<Product[]>(PROD_KEY, SEED);
  // Seed once
  useEffect(() => {
    if (isBrowser() && !localStorage.getItem(PROD_KEY)) {
      write(PROD_KEY, SEED);
    }
  }, []);
  const addProduct = (p: Omit<Product, "id" | "createdAt">) => {
    const np: Product = { ...p, id: `p${Date.now()}`, createdAt: Date.now() };
    setProducts((prev) => [np, ...prev]);
    return np;
  };
  return { products, addProduct };
}

export function useFavorites() {
  const [favorites, setFavorites] = useStore<string[]>(FAV_KEY, []);
  const toggle = (id: string) =>
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const isFav = (id: string) => favorites.includes(id);
  return { favorites, toggle, isFav };
}

export function useUser() {
  const [user, setUser] = useStore<string | null>(USER_KEY, null);
  return { user, setUser };
}

export function useMessages(productId: string) {
  const [all, setAll] = useStore<Message[]>(MSG_KEY, []);
  const messages = all.filter((m) => m.productId === productId).sort((a, b) => a.ts - b.ts);
  const send = (user: string, text: string) => {
    const m: Message = { id: `m${Date.now()}`, productId, user, text, ts: Date.now() };
    setAll((prev) => [...prev, m]);
  };
  return { messages, send };
}