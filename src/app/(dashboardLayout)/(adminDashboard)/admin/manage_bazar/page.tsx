"use client";

import React, { useEffect, useState } from "react";
import { getAllBazar } from "@/services/bazar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ViewBazarModal from "./_components/ViewBazarModal";
import Loading from "@/app/loading";

interface IItem {
  name: string;
  quantity: number;
  price: number;
  category: string;
}

interface IBazar {
  _id: string;
  mess: { name: string };
  total: number;
  note?: string;
  items: IItem[];
  approved: boolean;
  proof?: string;
  createdAt: string;
}

export default function ManageBazar() {
  const [bazarList, setBazarList] = useState<IBazar[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBazar, setSelectedBazar] = useState<IBazar | null>(null);

  const fetchBazar = async () => {
    try {
      setLoading(true);
      const res = await getAllBazar();
      if (res?.success !== false) {
        setBazarList(res?.data?.data || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBazar();
  }, []);

  return (
    <div className="p-6">
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            All Bazar Records
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-10">
              <Loading></Loading>
            </div>
          ) : bazarList.length === 0 ? (
            <p className="text-center text-gray-400 py-10">
              No bazar records found.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mess</TableHead>
                  <TableHead>Total Cost</TableHead>
                  <TableHead>Items Count</TableHead>
                  <TableHead>Approved</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {bazarList.map((bazar) => (
                  <TableRow key={bazar._id}>
                    <TableCell>{bazar?.mess?.name || "N/A"}</TableCell>

                    <TableCell>৳ {bazar.total}</TableCell>

                    <TableCell>{bazar.items.length}</TableCell>

                    <TableCell>
                      {bazar.approved ? (
                        <Badge className="bg-green-600">Approved</Badge>
                      ) : (
                        <Badge variant="destructive">Pending</Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      {new Date(bazar.createdAt).toLocaleDateString()}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        onClick={() => setSelectedBazar(bazar)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* VIEW MODAL */}
      <ViewBazarModal
        open={!!selectedBazar}
        onClose={() => setSelectedBazar(null)}
        bazar={selectedBazar}
      />
    </div>
  );
}
