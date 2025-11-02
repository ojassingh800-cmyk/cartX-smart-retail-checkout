import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

interface SuccessPopupProps {
  open: boolean;
  amount: number;
}

export default function SuccessPopup({ open, amount }: SuccessPopupProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-success/20 rounded-full animate-ping"></div>
            <div className="relative bg-success/10 p-4 rounded-full">
              <CheckCircle2 className="h-20 w-20 text-success" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for shopping with us
          </p>
          
          <div className="bg-secondary/50 rounded-lg p-4 w-full">
            <p className="text-sm text-muted-foreground mb-1">Amount Paid</p>
            <p className="text-3xl font-bold text-success">₹{amount}</p>
          </div>
          
          <p className="text-xs text-muted-foreground mt-6">
            Your receipt has been generated
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
