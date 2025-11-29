"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface IItem {
  name: string;
  quantity: number;
  price: number;
  category: string;
}

interface IBazar {
  _id: string;
  items: IItem[];
  total: number;
  note?: string;
  proof?: string;
  approved: boolean;
}

export default function ViewBazarModal({
  open,
  onClose,
  bazar,
}: {
  open: boolean;
  onClose: () => void;
  bazar: IBazar | null;
}) {
  if (!bazar) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Bazar Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <p className="font-medium">Total: </p>
            <p className="font-semibold">৳ {bazar.total}</p>
          </div>

          <div className="flex justify-between items-center">
            <p className="font-medium">Status:</p>
            {bazar.approved ? (
              <Badge className="bg-green-600">Approved</Badge>
            ) : (
              <Badge variant="destructive">Pending</Badge>
            )}
          </div>

          {bazar.note && (
            <div>
              <p className="font-medium">Note:</p>
              <p className="text-sm text-gray-600">{bazar.note}</p>
            </div>
          )}

          <div>
            <p className="font-medium mb-2">Items:</p>
            <div className="space-y-2">
              {bazar.items.map((item, idx) => (
                <div key={idx} className="border p-2 rounded-lg bg-gray-50">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Qty: {item.quantity} | Price: ৳{item.price}
                  </p>
                  <Badge>{item.category}</Badge>
                </div>
              ))}
            </div>
          </div>

          {bazar.proof && (
            <div>
              <p className="font-medium mb-1">Proof:</p>
              <img
                src={bazar.proof}
                alt="Proof"
                className="rounded-lg border"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
