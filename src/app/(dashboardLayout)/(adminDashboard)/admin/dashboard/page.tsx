"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, User, Users, Utensils, ShoppingCart } from "lucide-react";
import { changeUserData, getAdminState, getAUser } from "@/services/auth";
import Loading from "@/app/loading";

// Form validation schema
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.email({
    message: "Please enter a valid email address.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface UserData {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: string;
  isKicked: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminStats {
  totalUser: number;
  totalBazar: number;
  totalMess: number;
}

export default function AdminDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [userResponse, statsResponse] = await Promise.all([
        getAUser(),
        getAdminState(),
      ]);

      if (userResponse.success) {
        setUserData(userResponse.data);
        form.reset({
          name: userResponse.data.name,
          email: userResponse.data.email,
        });
      }

      if (statsResponse.success) {
        setAdminStats(statsResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsUpdating(true);
      setUpdateMessage("");

      const response = await changeUserData(data);

      if (response.success) {
        setUserData(response.data);
        setUpdateMessage("Profile updated successfully!");
        setTimeout(() => setUpdateMessage(""), 3000);
      } else {
        setUpdateMessage("Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setUpdateMessage("An error occurred while updating profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading></Loading>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your profile and view system statistics
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger className="flex-1" value="overview">
            Overview
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="profile">
            Profile
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {adminStats?.totalUser || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Registered users in the system
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Bazar
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {adminStats?.totalBazar || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Bazar records in the system
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Mess
                </CardTitle>
                <Utensils className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {adminStats?.totalMess || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Mess management records
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {userData?.name}!</CardTitle>
              <CardDescription>
                You have administrator privileges to manage the system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={userData?.photo} alt={userData?.name} />
                  <AvatarFallback>
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {userData?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {userData?.email}
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    {userData?.role}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and manage your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture Section */}
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userData?.photo} alt={userData?.name} />
                  <AvatarFallback className="text-lg">
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Profile Picture</p>
                  <p className="text-sm text-muted-foreground">
                    Your profile picture is displayed across the platform.
                  </p>
                </div>
              </div>

              {/* Profile Form */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your full name"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            This is your display name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your email address for communication.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Read-only Fields */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormItem>
                      <FormLabel>User ID</FormLabel>
                      <FormControl>
                        <Input
                          value={userData?._id || ""}
                          readOnly
                          className="bg-muted"
                        />
                      </FormControl>
                      <FormDescription>
                        Your unique user identifier.
                      </FormDescription>
                    </FormItem>

                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input
                          value={userData?.role || ""}
                          readOnly
                          className="bg-muted"
                        />
                      </FormControl>
                      <FormDescription>
                        Your system role and permissions.
                      </FormDescription>
                    </FormItem>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <FormItem>
                      <FormLabel>Account Created</FormLabel>
                      <FormControl>
                        <Input
                          value={
                            userData
                              ? new Date(
                                  userData.createdAt
                                ).toLocaleDateString()
                              : ""
                          }
                          readOnly
                          className="bg-muted"
                        />
                      </FormControl>
                      <FormDescription>
                        When your account was created.
                      </FormDescription>
                    </FormItem>

                    <FormItem>
                      <FormLabel>Last Updated</FormLabel>
                      <FormControl>
                        <Input
                          value={
                            userData
                              ? new Date(
                                  userData.updatedAt
                                ).toLocaleDateString()
                              : ""
                          }
                          readOnly
                          className="bg-muted"
                        />
                      </FormControl>
                      <FormDescription>
                        When your profile was last updated.
                      </FormDescription>
                    </FormItem>
                  </div>

                  {/* Update Message */}
                  {updateMessage && (
                    <div
                      className={`p-3 rounded-md ${
                        updateMessage.includes("successfully")
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {updateMessage}
                    </div>
                  )}

                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Update Profile
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
