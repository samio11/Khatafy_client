"use client";

import { useEffect, useState } from "react";
import { getAUser, changeUserData } from "@/services/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  User,
  Mail,
  ShieldCheck,
  Pencil,
  Loader2,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Building,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Loading from "@/app/loading";
import { getMessBudgetStats } from "@/services/mess";

// charts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  photo?: string;
}

interface MessStats {
  messId: string;
  messName: string;
  monthlyBudget: number;
  totalBazarCost: number;
}

interface BudgetStatsResponse {
  success: boolean;
  message: string;
  data: MessStats[];
}

export default function ManagerDashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [stats, setStats] = useState<MessStats[]>([]);
  const [selectedMess, setSelectedMess] = useState<MessStats | null>(null);
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

  const fetchStats = async () => {
    try {
      const res: BudgetStatsResponse = await getMessBudgetStats();
      if (res?.success && res.data && res.data.length > 0) {
        setStats(res.data);
        setSelectedMess(res.data[0]); // Select first mess by default
      }
    } catch (err) {
      toast.error("Failed to load manager stats");
    }
  };

  useEffect(() => {
    fetchUser();
    fetchStats();
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
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <User className="w-16 h-16 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Failed to load user data</p>
          <Button onClick={fetchUser} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Prepare chart data for selected mess
  const chartData = selectedMess
    ? [
        {
          name: "Monthly Budget",
          value: selectedMess.monthlyBudget,
          color: "#3b82f6",
        },
        {
          name: "Total Bazar Cost",
          value: selectedMess.totalBazarCost,
          color:
            selectedMess.totalBazarCost > selectedMess.monthlyBudget
              ? "#ef4444"
              : "#10b981",
        },
      ]
    : [];

  const remainingBudget = selectedMess
    ? selectedMess.monthlyBudget - selectedMess.totalBazarCost
    : 0;

  const budgetUsagePercentage = selectedMess
    ? (selectedMess.totalBazarCost / selectedMess.monthlyBudget) * 100
    : 0;

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Manager Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your account and monitor mess statistics
          </p>
        </div>
        <Button onClick={handleEditClick} className="gap-2">
          <Pencil className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Your personal details and account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                {user.photo ? (
                  <Image
                    src={user.photo}
                    alt={user.name}
                    width={80}
                    height={80}
                    className="rounded-full object-cover border-2 border-border"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-border">
                    <User className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
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

        {/* Stats Overview */}
        {selectedMess && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                Budget Overview
              </CardTitle>
              <CardDescription>
                {stats.length > 1 ? (
                  <select
                    value={selectedMess.messId}
                    onChange={(e) => {
                      const mess = stats.find(
                        (m) => m.messId === e.target.value
                      );
                      if (mess) setSelectedMess(mess);
                    }}
                    className="w-full bg-background border border-border rounded-md px-2 py-1 text-sm"
                  >
                    {stats.map((mess) => (
                      <option key={mess.messId} value={mess.messId}>
                        {mess.messName}
                      </option>
                    ))}
                  </select>
                ) : (
                  selectedMess.messName
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Monthly Budget</span>
                  </div>
                  <span className="font-semibold">
                    ${selectedMess.monthlyBudget.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Bazar Cost</span>
                  </div>
                  <span className="font-semibold">
                    ${selectedMess.totalBazarCost.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <TrendingUp
                      className={cn(
                        "w-4 h-4",
                        remainingBudget >= 0 ? "text-green-500" : "text-red-500"
                      )}
                    />
                    <span className="text-sm font-medium">Remaining</span>
                  </div>
                  <span
                    className={cn(
                      "font-semibold",
                      remainingBudget >= 0 ? "text-green-600" : "text-red-600"
                    )}
                  >
                    ${Math.abs(remainingBudget).toLocaleString()}
                    {remainingBudget < 0 && " Over"}
                  </span>
                </div>
              </div>

              {/* Budget Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Budget Usage</span>
                  <span>{budgetUsagePercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      budgetUsagePercentage > 100
                        ? "bg-red-500"
                        : budgetUsagePercentage > 80
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    )}
                    style={{
                      width: `${Math.min(budgetUsagePercentage, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Chart Section */}
      {selectedMess && (
        <Card>
          <CardHeader>
            <CardTitle>Budget vs Expenses</CardTitle>
            <CardDescription>
              Comparison between monthly budget and actual bazar costs for{" "}
              {selectedMess.messName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                    formatter={(value) => [
                      `$${Number(value).toLocaleString()}`,
                      "Amount",
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Multiple Mess Cards */}
      {stats.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>All Mess Statistics</CardTitle>
            <CardDescription>Overview of all messes you manage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {stats.map((mess) => {
                const messRemaining = mess.monthlyBudget - mess.totalBazarCost;
                const messUsage =
                  (mess.totalBazarCost / mess.monthlyBudget) * 100;

                return (
                  <Card
                    key={mess.messId}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      selectedMess?.messId === mess.messId &&
                        "ring-2 ring-primary"
                    )}
                    onClick={() => setSelectedMess(mess)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold">{mess.messName}</h3>
                        <div
                          className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            messUsage > 100
                              ? "bg-red-100 text-red-800"
                              : messUsage > 80
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          )}
                        >
                          {messUsage.toFixed(1)}%
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Budget:</span>
                          <span>${mess.monthlyBudget.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Spent:</span>
                          <span>${mess.totalBazarCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-medium pt-2 border-t">
                          <span>Remaining:</span>
                          <span
                            className={cn(
                              messRemaining >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            )}
                          >
                            ${Math.abs(messRemaining).toLocaleString()}
                            {messRemaining < 0 && " Over"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Profile Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="w-5 h-5" />
              Edit Profile
            </DialogTitle>
            <DialogDescription>
              Update your profile information here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="Enter your email address"
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
