import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreditCard, Wallet, Smartphone, Check } from "lucide-react";
import { toast } from "sonner";
import SuccessPopup from "./SuccessPopup";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalAmount: number;
  onSuccess: () => void;
}

type PaymentMethod = "cash" | "card" | "upi";

export default function PaymentDialog({
  open,
  onOpenChange,
  totalAmount,
  onSuccess,
}: PaymentDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  const paymentMethods = [
    {
      id: "cash" as PaymentMethod,
      name: "Cash",
      icon: Wallet,
      description: "Pay with cash",
    },
    {
      id: "card" as PaymentMethod,
      name: "Card",
      icon: CreditCard,
      description: "Credit/Debit card",
    },
    {
      id: "upi" as PaymentMethod,
      name: "UPI",
      icon: Smartphone,
      description: "UPI/PhonePe/GPay",
    },
  ];

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onOpenChange(false);
      setShowSuccess(true);
      
      // Reset after success popup
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess();
        setSelectedMethod(null);
      }, 3000);
    }, 1500);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
            <DialogDescription>
              Choose how you'd like to pay for your purchase
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Amount</span>
                <span className="text-2xl font-bold text-primary">₹{totalAmount}</span>
              </div>
            </div>

            <div className="space-y-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = selectedMethod === method.id;
                
                return (
                  <Card
                    key={method.id}
                    className={`p-4 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-md"
                        : "hover:border-primary/50 hover:shadow-sm"
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            isSelected ? "bg-primary text-primary-foreground" : "bg-secondary"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{method.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {method.description}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>

            <Button
              className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground"
              size="lg"
              onClick={handlePayment}
              disabled={!selectedMethod || processing}
            >
              {processing ? "Processing..." : `Pay ₹${totalAmount}`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <SuccessPopup open={showSuccess} amount={totalAmount} />
    </>
  );
}
