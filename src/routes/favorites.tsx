import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useFavorites, useProducts } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/favorites")({
  component: Favorites,
  head: () => ({
    meta: [
      { title: "Your favorites — CampusMarket" },
      { name: "description", content: "Items you've saved on CampusMarket." },
    ],
  }),
});

function Favorites() {
  const { products } = useProducts();
  const { favorites } = useFavorites();
  const items = products.filter((p) => favorites.includes(p.id));

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8 animate-fade-up">
        <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
          <Heart className="h-7 w-7 text-destructive" /> Your favorites
        </h1>
        <p className="mt-1 text-muted-foreground">
          {items.length} saved {items.length === 1 ? "item" : "items"}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-16 text-center">
          <p className="text-muted-foreground">No favorites yet. Tap the heart on any listing.</p>
          <Button asChild className="mt-4">
            <Link to="/">Browse listings</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
