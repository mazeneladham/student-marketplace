import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Heart, Send, Tag } from "lucide-react";
import { useFavorites, useMessages, useProducts, useUser } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/product/$id")({
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = useParams({ from: "/product/$id" });
  const { products } = useProducts();
  const { isFav, toggle } = useFavorites();
  const { user, setUser } = useUser();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Listing not found</h1>
        <Button asChild className="mt-4">
          <Link to="/">Back to home</Link>
        </Button>
      </main>
    );
  }

  const fav = isFav(product.id);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to listings
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="animate-fade-up overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
          <img src={product.image} alt={product.title} className="aspect-[4/3] w-full object-cover" />
        </div>

        <div className="animate-fade-up space-y-5" style={{ animationDelay: "80ms" }}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
            <Tag className="h-3 w-3" /> {product.category}
          </span>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{product.title}</h1>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-primary">${product.price}</span>
            <span className="text-sm text-muted-foreground">listed by {product.seller}</span>
          </div>
          <p className="leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="flex gap-3 pt-2">
            <Button
              size="lg"
              variant="outline"
              onClick={() => toggle(product.id)}
              className="gap-2 rounded-xl"
            >
              <Heart className={`h-4 w-4 ${fav ? "fill-destructive text-destructive" : ""}`} />
              {fav ? "Saved" : "Save"}
            </Button>
            <Button
              size="lg"
              className="flex-1 gap-2 rounded-xl gradient-primary text-primary-foreground hover:opacity-95"
              onClick={() => document.getElementById("chat")?.scrollIntoView({ behavior: "smooth" })}
            >
              Message seller
            </Button>
          </div>
        </div>
      </div>

      <ChatBox productId={product.id} seller={product.seller} user={user} setUser={setUser} />
    </main>
  );
}

function ChatBox({
  productId,
  seller,
  user,
  setUser,
}: {
  productId: string;
  seller: string;
  user: string | null;
  setUser: (v: string | null) => void;
}) {
  const { messages, send } = useMessages(productId);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const onSend = () => {
    if (!user) {
      const n = prompt("Choose a username to chat");
      if (n) setUser(n.trim());
      return;
    }
    if (!text.trim()) return;
    send(user, text.trim());
    setText("");
    setTimeout(() => {
      send(seller, "Thanks for your message! I'll get back to you soon 👋");
    }, 900);
  };

  return (
    <section
      id="chat"
      className="mt-12 animate-fade-up overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]"
      style={{ animationDelay: "160ms" }}
    >
      <header className="border-b border-border bg-gradient-to-r from-secondary/60 to-transparent px-6 py-4">
        <h2 className="font-semibold">Chat with {seller}</h2>
        <p className="text-xs text-muted-foreground">Messages are stored locally on your device.</p>
      </header>

      <div className="flex h-80 flex-col gap-3 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="m-auto text-sm text-muted-foreground">
            Start the conversation — say hi 👋
          </div>
        ) : (
          messages.map((m) => {
            const mine = m.user === user;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-[var(--shadow-card)] ${
                    mine
                      ? "gradient-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <div className="mb-0.5 text-[10px] opacity-70">{m.user}</div>
                  {m.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-border bg-background/50 p-3">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          placeholder={user ? `Message as ${user}…` : "Sign in to message…"}
          className="rounded-xl"
        />
        <Button onClick={onSend} className="gap-1.5 rounded-xl gradient-primary text-primary-foreground hover:opacity-95">
          <Send className="h-4 w-4" /> Send
        </Button>
      </div>
    </section>
  );
}
