import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/store";
import { useFavorites } from "@/lib/store";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { isFav, toggle } = useFavorites();
  const fav = isFav(product.id);
  return (
    <Link
      to="/product/$id"
      params={{ id: product.id }}
      className="group relative block overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)] animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            toggle(product.id);
          }}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full glass shadow-[var(--shadow-soft)] transition-transform hover:scale-110"
        >
          <Heart
            className={`h-4 w-4 transition-all ${fav ? "fill-destructive text-destructive" : "text-foreground"}`}
          />
        </button>
        <span className="absolute left-3 top-3 rounded-full bg-card/80 px-2.5 py-1 text-[11px] font-medium text-foreground backdrop-blur">
          {product.category}
        </span>
      </div>
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-1 text-sm font-semibold text-foreground">{product.title}</h3>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">${product.price}</span>
          <span className="text-xs text-muted-foreground">by {product.seller}</span>
        </div>
      </div>
    </Link>
  );
}
