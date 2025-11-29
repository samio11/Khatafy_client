"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  getAllMess,
  updateMessData,
  deleteMessData,
  invitedUserToMess,
  shiftManagerRole,
} from "@/services/mess";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import { Users, Settings, Trash2, UserPlus, ShieldCheck } from "lucide-react";
import Loading from "@/app/loading";

// --------------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------------
export default function ManageMess() {
  const [messList, setMessList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [shiftOpen, setShiftOpen] = useState(false);

  const [selectedMess, setSelectedMess] = useState<any>(null);

  // -------------------------------
  // FETCH ALL MESS OF MANAGER
  // -------------------------------
  const fetchMess = async () => {
    setLoading(true);
    try {
      const res = await getAllMess();
      setMessList(res?.data?.data || []);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMess();
  }, []);

  // --------------------------------------------------------
  // FORMS
  // --------------------------------------------------------

  // EDIT FORM
  const editForm = useForm({
    defaultValues: {
      name: "",
      address: "",
      monthlyBudget: "",
    },
  });

  const onSubmitEdit = async (values: any) => {
    try {
      await updateMessData(selectedMess._id, values);
      toast.success("Mess Updated");
      setEditOpen(false);
      fetchMess();
    } catch (err) {
      toast.error("Update Failed");
    }
  };

  // INVITE FORM
  const inviteForm = useForm({
    defaultValues: {
      userId: "",
    },
  });

  const onSubmitInvite = async (values: any) => {
    try {
      await invitedUserToMess(selectedMess._id, values);
      toast.success("User Invited");
      setInviteOpen(false);
      fetchMess();
    } catch (err) {
      toast.error("Invitation Failed");
    }
  };

  // SHIFT MANAGER FORM
  const shiftForm = useForm({
    defaultValues: {
      userId: "",
      managerId: "",
    },
  });

  const onSubmitShift = async (values: any) => {
    try {
      await shiftManagerRole(selectedMess._id, values);
      toast.success("Manager Role Shifted");
      setShiftOpen(false);
      fetchMess();
    } catch (err) {
      toast.error("Operation Failed");
    }
  };

  // --------------------------------------------------------
  // DELETE
  // --------------------------------------------------------
  const handleDelete = async (id: string) => {
    try {
      await deleteMessData(id);
      toast.success("Mess Deleted");
      fetchMess();
    } catch (err) {
      toast.error("Delete Failed");
    }
  };

  // --------------------------------------------------------
  // RENDER
  // --------------------------------------------------------
  if (loading) return <Loading></Loading>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Manage Your Mess</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {messList.map((mess) => (
          <Card
            key={mess._id}
            className="border rounded-xl shadow-sm hover:shadow-md transition"
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{mess.name}</span>
                <Settings className="w-5 h-5 text-gray-500" />
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <p>
                <b>Address:</b> {mess.address}
              </p>
              <p>
                <b>Monthly Budget:</b> {mess.monthlyBudget} ৳
              </p>

              {/* Manager Section */}
              <p className="mt-2">
                <b>Manager:</b>
              </p>
              <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-md">
                <img
                  src={mess.managers?.photo}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{mess.managers?.name}</p>
                  <p className="text-sm text-gray-600">
                    {mess.managers?.email}
                  </p>
                </div>
              </div>

              {/* Members Section */}
              <p className="mt-3">
                <b>Members ({mess.members?.length || 0})</b>
              </p>
              <div className="space-y-2">
                {mess.members?.map((m: any) => (
                  <div
                    key={m._id}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-md"
                  >
                    <img
                      src={m.photo}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-sm text-gray-600">{m.email}</p>
                      <p className="text-sm text-gray-600">Id:- {m._id}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelectedMess(mess);
                    editForm.reset({
                      name: mess.name,
                      address: mess.address,
                      monthlyBudget: mess.monthlyBudget,
                    });
                    setEditOpen(true);
                  }}
                >
                  Edit
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedMess(mess);
                    setInviteOpen(true);
                  }}
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  Invite
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedMess(mess);
                    shiftForm.reset({
                      managerId: mess.managers?._id,
                    });
                    setShiftOpen(true);
                  }}
                >
                  <ShieldCheck className="w-4 h-4 mr-1" />
                  Shift Manager
                </Button>

                <Button
                  variant="destructive"
                  onClick={() => handleDelete(mess._id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ----------------------------------------------------
          EDIT MESS MODAL
      ----------------------------------------------------- */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Mess</DialogTitle>
          </DialogHeader>

          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onSubmitEdit)}>
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Mess name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editForm.control}
                name="monthlyBudget"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Monthly Budget</FormLabel>
                    <FormControl>
                      <Input placeholder="5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-4">
                Save Changes
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          INVITE USER MODAL
      ----------------------------------------------------- */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite User to Mess</DialogTitle>
          </DialogHeader>

          <Form {...inviteForm}>
            <form onSubmit={inviteForm.handleSubmit(onSubmitInvite)}>
              <FormField
                control={inviteForm.control}
                name="userId"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter userId" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Invite
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          SHIFT MANAGER ROLE MODAL
      ----------------------------------------------------- */}
      <Dialog open={shiftOpen} onOpenChange={setShiftOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Shift Manager Role</DialogTitle>
          </DialogHeader>

          <Form {...shiftForm}>
            <form onSubmit={shiftForm.handleSubmit(onSubmitShift)}>
              <FormField
                control={shiftForm.control}
                name="userId"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Member User ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Member userId" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={shiftForm.control}
                name="managerId"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Current Manager ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Manager userId" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Shift Role
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
