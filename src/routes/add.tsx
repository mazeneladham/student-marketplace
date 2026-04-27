import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES, useProducts, useUser } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/add")({
  component: AddProduct,
  head: () => ({
    meta: [
      { title: "Sell an item — CampusMarket" },
      { name: "description", content: "List a product or service on your campus marketplace." },
    ],
  }),
});

const FALLBACK = "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop";

function AddProduct() {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const { user, setUser } = useUser();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in first (top-right).");
      return;
    }
    if (!title.trim() || !price || !description.trim()) {
      toast.error("Fill in all fields.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const p = addProduct({
        title: title.trim(),
        price: Number(price),
        category,
        description: description.trim(),
        image: image || FALLBACK,
        seller: user,
      });
      toast.success("Listing published!");
      navigate({ to: "/product/$id", params: { id: p.id } });
    }, 400);
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-3xl font-bold tracking-tight">Create a listing</h1>
        <p className="mt-1 text-muted-foreground">Share what you're selling with your campus.</p>
      </div>

      {!user && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-accent/50 p-4 text-sm">
          <span>You need a username to post.</span>
          <Button
            size="sm"
            onClick={() => {
              const n = prompt("Enter a username");
              if (n) setUser(n.trim());
            }}
          >
            Quick sign in
          </Button>
        </div>
      )}

      <form
        onSubmit={submit}
        className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] animate-fade-up"
        style={{ animationDelay: "80ms" }}
      >
        <div className="grid gap-2">
          <Label htmlFor="image">Image</Label>
          <label
            htmlFor="image"
            className="group relative flex aspect-[16/9] cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/30 transition hover:border-primary hover:bg-accent/30"
          >
            {image ? (
              <img src={image} alt="preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ImagePlus className="h-8 w-8" />
                <span className="text-sm">Click to upload an image</span>
              </div>
            )}
            <input
              id="image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
            />
          </label>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Linear Algebra textbook" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="price">Price (USD)</Label>
            <Input id="price" type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="20" />
          </div>
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea
            id="desc"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Condition, pickup details, anything buyers should know…"
          />
        </div>

        <Button type="submit" disabled={submitting} className="w-full gradient-primary text-primary-foreground hover:opacity-95">
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Publish listing
        </Button>
      </form>
    </main>
  );
}
