"use client";

import { useEffect, useState } from "react";
import { getAUser, changeUserData } from "@/services/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { User, Mail, ShieldCheck, Pencil, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Loading from "@/app/loading";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  photo?: string;
}

export default function ManagerDashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const res = await getAUser();
      if (res?.data) {
        setUser(res.data);
      }
    } catch (error) {
      toast.error("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = async (values: { name: string; email: string }) => {
    try {
      setIsSubmitting(true);
      const res = await changeUserData(values);
      if (res?.success) {
        toast.success("Profile updated successfully!");
        setOpen(false);
        fetchUser();
      } else {
        toast.error(res?.message || "Update failed");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = () => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
      });
      setOpen(true);
    }
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-2">
          <User className="w-12 h-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Failed to load user data</p>
          <Button onClick={fetchUser} variant="outline" size="sm">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Manager Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        <Button
          onClick={handleEditClick}
          className="gap-2 transition-all duration-200 hover:scale-105"
        >
          <Pencil className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div>
                {user.photo ? (
                  <Image
                    src={user.photo}
                    alt={user.name}
                    width={60}
                    height={60}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-primary" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-background rounded-full" />
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  {user.name}
                </h2>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium",
                    "bg-primary/10 text-primary border border-primary/20"
                  )}
                >
                  <ShieldCheck className="w-3 h-3" />
                  {user.role}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="w-5 h-5" />
              Edit Profile
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="Enter your full name"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="Enter your email address"
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
