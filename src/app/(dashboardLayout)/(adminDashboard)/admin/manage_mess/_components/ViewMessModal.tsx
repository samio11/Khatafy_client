"use client";

import { invitedUserToMess } from "@/services/mess";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ViewMessModal({
  viewData,
  setViewData,
  refetch,
}: {
  viewData: any;
  setViewData: (v: any) => void;
  refetch: () => void;
}) {
  const { register, handleSubmit, reset } = useForm();

  if (!viewData) return null;

  const onInvite = async (data: any) => {
    const res = await invitedUserToMess(viewData._id, data);
    if (res.success) {
      toast.success("User Invited Successfully");
      reset();
      refetch();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Dialog open={!!viewData} onOpenChange={() => setViewData(null)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Mess Information</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p>
            <strong>Name:</strong> {viewData.name}
          </p>
          <p>
            <strong>Address:</strong> {viewData.address}
          </p>
          <p>
            <strong>Monthly Budget:</strong> {viewData.monthlyBudget}
          </p>
          <p>
            <strong>Members:</strong> {viewData.members.length}
          </p>

          <h3 className="font-semibold mt-4">Invite User to Mess</h3>

          <form onSubmit={handleSubmit(onInvite)} className="space-y-3">
            <Input {...register("userId")} placeholder="User ID" required />

            <Button type="submit" className="w-full">
              Invite User
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
