"use client";

import { useForm } from "react-hook-form";
import { createMess } from "@/services/mess";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function CreateMessModal({
  open,
  setOpen,
  refetch,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  refetch: () => void;
}) {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    const res = await createMess(data);
    if (res.success) {
      toast.success("Mess Created Successfully!");
      reset();
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <Input {...register("name")} placeholder="Mess Name" required />
          <Input {...register("address")} placeholder="Mess Address" required />
          <Input
            {...register("monthlyBudget")}
            placeholder="Monthly Budget"
            type="number"
            required
          />

          <Button type="submit" className="w-full">
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
