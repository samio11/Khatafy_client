"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { changeVerifyOfBazar, getBazarsByManager } from "@/services/bazar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Eye, CheckCircle } from "lucide-react";

export default function ManageBazar() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [proofImg, setProofImg] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const res = await getBazarsByManager();
    setData(res?.data?.bazars || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: string) => {
    const res = await changeVerifyOfBazar(id, {});
    if (res?.success) {
      toast.success("Bazar Approved Successfully!");
      fetchData();
    } else {
      toast.error(res?.message || "Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Bazar</h1>

      <div className="rounded-xl border shadow-sm bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead>Mess</TableHead>
              <TableHead>Added By</TableHead>
              <TableHead>Total (৳)</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Proof</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((bazar: any) => (
              <TableRow key={bazar._id}>
                <TableCell className="font-semibold">
                  {bazar?.mess?.name}
                </TableCell>

                <TableCell>
                  {bazar?.addedBy?.name}
                  <div className="text-xs text-gray-500">
                    {bazar?.addedBy?.email}
                  </div>
                </TableCell>

                <TableCell className="font-bold">{bazar.total}</TableCell>

                <TableCell>
                  <ul className="text-sm text-gray-600 list-disc ml-4">
                    {bazar.items.map((item: any, i: number) => (
                      <li key={i}>
                        {item.name} — {item.quantity} × {item.price}
                      </li>
                    ))}
                  </ul>
                </TableCell>

                <TableCell>
                  {bazar.approved ? (
                    <Badge className="bg-green-600 text-white">Approved</Badge>
                  ) : (
                    <Badge variant="destructive">Pending</Badge>
                  )}
                </TableCell>

                <TableCell>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setProofImg(bazar.proof)}
                  >
                    <Eye size={16} />
                  </Button>
                </TableCell>

                <TableCell className="text-right">
                  {!bazar.approved && (
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleApprove(bazar._id)}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Image Preview Modal */}
      <Dialog open={!!proofImg} onOpenChange={() => setProofImg(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Proof Image</DialogTitle>
          </DialogHeader>

          {proofImg && (
            <Image
              src={proofImg}
              alt="Proof"
              width={500}
              height={300}
              className="rounded-md w-full object-cover"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
