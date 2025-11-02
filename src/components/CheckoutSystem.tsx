import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Scan, Trash2, CreditCard, Wallet, Smartphone } from "lucide-react";
import { toast } from "sonner";
import PaymentDialog from "./PaymentDialog";

interface Product {
  barcode: string;
  name: string;
  price: number;
}

interface CartItem extends Product {
  quantity: number;
}

const PRODUCTS: Product[] = [
  { barcode: "1", name: "Fresh Milk (1L)", price: 65 },
  { barcode: "2", name: "Whole Wheat Bread", price: 40 },
  { barcode: "3", name: "Basmati Rice (1kg)", price: 120 },
  { barcode: "4", name: "Tata Tea Gold (250g)", price: 150 },
  { barcode: "5", name: "Amul Butter (500g)", price: 250 },
  { barcode: "6", name: "Fortune Sunflower Oil (1L)", price: 180 },
  { barcode: "7", name: "Britannia Biscuits Pack", price: 85 },
  { barcode: "8", name: "Fresh Eggs (12pcs)", price: 95 },
  { barcode: "9", name: "Colgate Toothpaste", price: 110 },
  { barcode: "10", name: "Dove Soap (3pack)", price: 135 },
];

export default function CheckoutSystem() {
  const [barcodeInput, setBarcodeInput] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);

  const addToCart = (barcode: string) => {
    const product = PRODUCTS.find((p) => p.barcode === barcode);
    
    if (!product) {
      toast.error("Product not found", {
        description: `No product with barcode ${barcode}`
      });
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.barcode === barcode);
      if (existing) {
        toast.success("Quantity updated", {
          description: `${product.name} x${existing.quantity + 1}`
        });
        return prev.map((item) =>
          item.barcode === barcode
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      toast.success("Added to cart", {
        description: product.name
      });
      return [...prev, { ...product, quantity: 1 }];
    });
    setBarcodeInput("");
  };

  const removeFromCart = (barcode: string) => {
    const item = cart.find((i) => i.barcode === barcode);
    setCart((prev) => prev.filter((item) => item.barcode !== barcode));
    toast.info("Removed from cart", {
      description: item?.name
    });
  };

  const updateQuantity = (barcode: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.barcode === barcode
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcodeInput.trim()) {
      addToCart(barcodeInput.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                <ShoppingCart className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">SmartRetail POS</h1>
                <p className="text-xs text-muted-foreground">Professional Checkout System</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              <ShoppingCart className="mr-1 h-3 w-3" />
              {cart.reduce((sum, item) => sum + item.quantity, 0)} items
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Section - Products & Barcode Scanner */}
          <div className="lg:col-span-2 space-y-6">
            {/* Barcode Scanner */}
            <Card className="p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Scan className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Scan Product</h2>
              </div>
              <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter barcode number (1-10)"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
                <Button type="submit" className="bg-gradient-to-r from-primary to-accent">
                  Add
                </Button>
              </form>
            </Card>

            {/* Product Grid */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Available Products</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {PRODUCTS.map((product) => (
                  <Card
                    key={product.barcode}
                    className="p-4 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                    onClick={() => addToCart(product.barcode)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            #{product.barcode}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                        <p className="text-lg font-bold text-primary">₹{product.price}</p>
                      </div>
                      <Button size="sm" variant="ghost" className="shrink-0">
                        Add
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section - Shopping Cart */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-lg sticky top-24">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Shopping Cart
              </h2>

              {cart.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p>Cart is empty</p>
                  <p className="text-xs mt-1">Scan products to add</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.barcode}
                        className="flex items-start justify-between gap-2 p-3 rounded-lg bg-secondary/50"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                              onClick={() => updateQuantity(item.barcode, -1)}
                            >
                              -
                            </Button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0"
                              onClick={() => updateQuantity(item.barcode, 1)}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold">₹{item.price * item.quantity}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-destructive mt-1"
                            onClick={() => removeFromCart(item.barcode)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (0%)</span>
                      <span>₹0</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">₹{totalAmount}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
                    size="lg"
                    onClick={() => setShowPayment(true)}
                  >
                    Proceed to Payment
                  </Button>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>

      <PaymentDialog
        open={showPayment}
        onOpenChange={setShowPayment}
        totalAmount={totalAmount}
        onSuccess={() => {
          setCart([]);
          setShowPayment(false);
        }}
      />
    </div>
  );
}
