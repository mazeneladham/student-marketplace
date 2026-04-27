import { Link, useLocation } from "@tanstack/react-router";
import { Heart, Home, Plus, ShoppingBag, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useFavorites, useUser } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function Navbar() {
  const { favorites } = useFavorites();
  const { user, setUser } = useUser();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/add", label: "Sell", icon: Plus },
    { to: "/favorites", label: "Favorites", icon: Heart },
  ] as const;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all ${
        scrolled ? "glass shadow-[var(--shadow-soft)]" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary text-primary-foreground shadow-[var(--shadow-soft)]">
            <ShoppingBag className="h-4 w-4" />
          </span>
          <span className="hidden text-lg tracking-tight sm:block">
            Campus<span className="text-primary">Market</span>
          </span>
        </Link>

        <div className="flex items-center gap-1 rounded-full bg-secondary/60 p-1 backdrop-blur">
          {links.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-all sm:px-4 ${
                  active
                    ? "bg-card text-foreground shadow-[var(--shadow-card)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
                {to === "/favorites" && favorites.length > 0 && (
                  <span className="ml-0.5 rounded-full bg-primary px-1.5 text-[10px] font-semibold text-primary-foreground">
                    {favorites.length}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 rounded-full">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{user ?? "Sign in"}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>{user ? "Your account" : "Welcome"}</DialogTitle>
            </DialogHeader>
            {user ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Signed in as <span className="font-medium text-foreground">{user}</span>
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setUser(null);
                    setOpen(false);
                  }}
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Enter a username to start buying and selling.
                </p>
                <Input
                  placeholder="e.g. amina_k"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && name.trim()) {
                      setUser(name.trim());
                      setOpen(false);
                    }
                  }}
                />
                <DialogFooter>
                  <Button
                    className="w-full"
                    disabled={!name.trim()}
                    onClick={() => {
                      setUser(name.trim());
                      setOpen(false);
                    }}
                  >
                    Continue
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </nav>
    </header>
  );
}
