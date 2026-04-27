import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { CATEGORIES, useProducts } from "@/lib/store";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "CampusMarket — Buy, sell & swap on your campus" },
      {
        name: "description",
        content:
          "The student-only marketplace. Find textbooks, gear, furniture and services from people on your campus.",
      },
    ],
  }),
});

function Home() {
  const { products } = useProducts();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchQ = q.trim() === "" || p.title.toLowerCase().includes(q.toLowerCase());
      const matchC = cat === "All" || p.category === cat;
      return matchQ && matchC;
    });
  }, [products, q, cat]);

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-primary-glow/20 blur-3xl" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center animate-fade-up">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3 w-3 text-primary" /> Built for students, by students
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              The marketplace
              <br />
              made for <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">campus life</span>.
            </h1>
            <p className="mt-5 max-w-lg text-base text-muted-foreground sm:text-lg">
              Buy textbooks, sell your old laptop, find a tutor — all within your university
              community. Safe, simple, and zero fees.
            </p>
            <div className="mt-8 flex flex-wrap gap-6 text-sm">
              <Feature icon={ShieldCheck} label="Verified students" />
              <Feature icon={Zap} label="Instant chat" />
              <Feature icon={Sparkles} label="No fees" />
            </div>
          </div>
          <div className="relative animate-fade-up" style={{ animationDelay: "120ms" }}>
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-primary-glow/10 blur-2xl" />
            <img
              src={heroImg}
              alt="Student marketplace illustration"
              width={1536}
              height={1024}
              className="relative animate-float rounded-3xl"
            />
          </div>
        </div>
      </section>

      {/* SEARCH + FILTERS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="-mt-8 rounded-2xl glass p-4 shadow-[var(--shadow-elegant)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search textbooks, electronics, services…"
                className="h-11 rounded-xl border-border bg-card pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["All", ...CATEGORIES].map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                    cat === c
                      ? "gradient-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Browse listings</h2>
            <p className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "item" : "items"} available
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card/50 p-16 text-center">
            <p className="text-muted-foreground">No items match your search.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-border py-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CampusMarket — A student startup project.
      </footer>
    </main>
  );
}

function Feature({ icon: Icon, label }: { icon: typeof Sparkles; label: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-card shadow-[var(--shadow-card)]">
        <Icon className="h-4 w-4 text-primary" />
      </span>
      <span className="font-medium text-foreground">{label}</span>
    </div>
  );
}
