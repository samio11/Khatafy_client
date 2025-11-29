"use client";

import React, { useEffect, useState } from "react";
import {
  getAllUser,
  kickedUser,
  unKickedUser,
  changeStatusToManager,
} from "../../../../../services/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  MoreHorizontal,
  UserRound,
  ShieldCheck,
  Ban,
  CheckCircle,
} from "lucide-react";

export default function ManageUser() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [actionType, setActionType] = useState<
    "kick" | "unkick" | "manager" | null
  >(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUser();
      setUsers(data.data?.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle actions
  const handleAction = async () => {
    if (!selectedUser || !actionType) return;

    try {
      if (actionType === "kick") {
        await kickedUser(selectedUser._id);
        toast.success("User kicked successfully!");
      }
      if (actionType === "unkick") {
        await unKickedUser(selectedUser._id);
        toast.success("User un-kicked successfully!");
      }
      if (actionType === "manager") {
        await changeStatusToManager(selectedUser._id);
        toast.success("User promoted to Manager!");
      }
      await fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setOpenModal(false);
    }
  };
  return (
    <Card className="mt-6 shadow-lg border rounded-2xl">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-2xl font-bold">User Management</CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-center py-6">Loading...</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users?.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell className="font-medium flex gap-2 items-center">
                      <UserRound size={18} />
                      {u.name}
                    </TableCell>

                    <TableCell>{u.email}</TableCell>

                    <TableCell>
                      <Badge
                        className={
                          u.role === "admin"
                            ? "bg-blue-600"
                            : u.role === "manager"
                            ? "bg-green-600"
                            : "bg-gray-600"
                        }
                      >
                        {u.role}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {u.isKicked ? (
                        <Badge className="bg-red-600">Kicked</Badge>
                      ) : (
                        <Badge className="bg-emerald-600">Active</Badge>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal size={18} />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          {!u.isKicked ? (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(u);
                                setActionType("kick");
                                setOpenModal(true);
                              }}
                              className="cursor-pointer text-red-600"
                            >
                              <Ban className="mr-2" size={16} /> Kick User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(u);
                                setActionType("unkick");
                                setOpenModal(true);
                              }}
                              className="cursor-pointer text-green-600"
                            >
                              <CheckCircle className="mr-2" size={16} /> Un-Kick
                              User
                            </DropdownMenuItem>
                          )}

                          {u.role === "member" && !u.isKicked && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(u);
                                setActionType("manager");
                                setOpenModal(true);
                              }}
                              className="cursor-pointer text-blue-600"
                            >
                              <ShieldCheck className="mr-2" size={16} /> Make
                              Manager
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Confirmation Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {actionType === "kick" && "Kick this user?"}
              {actionType === "unkick" && "Un-kick this user?"}
              {actionType === "manager" && "Promote to Manager?"}
            </DialogTitle>
          </DialogHeader>

          <p className="text-gray-600">
            Are you sure you want to continue this action for{" "}
            <span className="font-semibold">{selectedUser?.name}</span>?
          </p>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAction}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
