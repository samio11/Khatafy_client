"use client";

import { useEffect, useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { createMess } from "@/services/mess";

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

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getUsersByRole } from "@/services/auth";

// =========================
//       TYPES
// =========================

interface User {
  _id: string;
  name: string;
  email?: string;
}

interface GetUsersResponse {
  data: {
    data: User[];
  };
}

interface MessFormValues {
  name: string;
  address: string;
  monthlyBudget: string;
  managers: string;
  members: string[];
}

interface CreateMessModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  refetch: () => void;
}

// =========================
//     COMPONENT
// =========================

export default function CreateMessModal({
  open,
  setOpen,
  refetch,
}: CreateMessModalProps) {
  const [managersList, setManagersList] = useState<User[]>([]);
  const [membersList, setMembersList] = useState<User[]>([]);

  const form = useForm<MessFormValues>({
    defaultValues: {
      name: "",
      address: "",
      monthlyBudget: "",
      managers: "",
      members: [],
    },
  });

  // Fetch manager + members on modal open
  useEffect(() => {
    if (open) {
      fetchAllUsers();
    }
  }, [open]);

  const fetchAllUsers = async () => {
    const managers: GetUsersResponse = await getUsersByRole("manager");
    const members: GetUsersResponse = await getUsersByRole("member");

    setManagersList(managers?.data?.data || []);
    setMembersList(members?.data?.data || []);
  };

  const onSubmit = async (data: MessFormValues) => {
    if (!data.managers) return toast.error("Please select a manager");
    if (!data.members.length)
      return toast.error("Please select at least one member");

    const payload = {
      ...data,
      monthlyBudget: Number(data.monthlyBudget),
    };

    const res = await createMess(payload);

    if (res.success) {
      toast.success("Mess Created Successfully!");
      form.reset();
      setOpen(false);
      refetch();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Mess</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Mess Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mess Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Green Leaf Mess" {...field} required />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Dhanmondi, Dhaka" {...field} required />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Monthly Budget */}
            <FormField
              control={form.control}
              name="monthlyBudget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Budget</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="15000"
                      {...field}
                      required
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Manager Select */}
            <FormField
              control={form.control}
              name="managers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Manager</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose Manager" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {managersList.map((m) => (
                        <SelectItem key={m._id} value={m._id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Members Multi Select */}
            <FormField
              control={form.control}
              name="members"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Members</FormLabel>

                  {/* Selected Badges */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {field.value.map((id) => {
                      const user = membersList.find((u) => u._id === id);
                      return (
                        <Badge
                          key={id}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() =>
                            field.onChange(field.value.filter((i) => i !== id))
                          }
                        >
                          {user?.name} ×
                        </Badge>
                      );
                    })}
                  </div>

                  {/* Select Input */}
                  <Select
                    onValueChange={(val) =>
                      !field.value.includes(val) &&
                      field.onChange([...field.value, val])
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Member(s)" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {membersList.map((m) => (
                        <SelectItem key={m._id} value={m._id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Create Mess
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
