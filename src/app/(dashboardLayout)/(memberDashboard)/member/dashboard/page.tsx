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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit2, User, Mail, Shield, Home, Activity } from "lucide-react";
import Loading from "@/app/loading";

interface IUser {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  photo?: string;
  messId?: string;
  isKicked?: boolean;
}

export default function MemberDashBoard() {
  const [user, setUser] = useState<IUser | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<IUser>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const res = await getAUser();
      if (res?.data) {
        setUser(res.data);
        setForm(res.data);
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitUpdate = async () => {
    setIsLoading(true);
    try {
      const res = await changeUserData(form);
      if (res?.data) {
        setUser(res.data);
        setOpen(false);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading && !user) {
    return <Loading></Loading>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Member Profile
          </h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        {/* PROFILE CARD */}
        <Card className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            {/* Profile Header with Photo */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              <div className="relative">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white/80 shadow-2xl">
                    <AvatarImage
                      src={user?.photo}
                      alt={user?.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-semibold">
                      {user?.name ? (
                        getInitials(user.name)
                      ) : (
                        <User className="w-8 h-8" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2">
                    <Badge
                      variant={user?.isKicked ? "destructive" : "default"}
                      className="shadow-lg"
                    >
                      {user?.isKicked ? "Kicked" : "Active"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {user?.name}
                </h2>
                <p className="text-lg text-gray-600 mb-3">{user?.email}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 border-blue-200"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    {user?.role
                      ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                      : "Member"}
                  </Badge>
                  <Badge variant="outline" className="border-gray-300">
                    <Home className="w-3 h-3 mr-1" />
                    {user?.messId ? "Mess Member" : "No Mess"}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Profile Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/50 rounded-2xl p-6 border border-white/50 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Full Name
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 rounded-2xl p-6 border border-white/50 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Email Address
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 rounded-2xl p-6 border border-white/50 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Role</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-black text-white rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-100">
                      Account Status
                    </p>
                    <p className="text-xl font-bold">
                      {user?.isKicked
                        ? "Temporarily Suspended"
                        : "Active & Verified"}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-4 py-2 rounded-full ${
                    user?.isKicked
                      ? "bg-red-500/20 text-red-100"
                      : "bg-green-500/20 text-green-100"
                  }`}
                >
                  {user?.isKicked ? "Kicked" : "Active"}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => setOpen(true)}
                disabled={isLoading}
                className="bg-black text-white px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                {isLoading ? "Updating..." : "Edit Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* EDIT MODAL */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bg-white/80 backdrop-blur-xl border border-white/50 text-gray-900 rounded-3xl shadow-2xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-black text-white bg-clip-text text-transparent">
                Edit Profile
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Full Name
                </Label>
                <Input
                  className="bg-white/70 border-gray-300 text-gray-900 rounded-xl py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={form.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Email Address
                </Label>
                <Input
                  className="bg-white/70 border-gray-300 text-gray-900 rounded-xl py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={form.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter your email"
                  type="email"
                />
              </div>
              {/* 
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Photo URL
                </Label>
                <Input
                  className="bg-white/70 border-gray-300 text-gray-900 rounded-xl py-2 px-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  value={form.photo || ""}
                  onChange={(e) => handleChange("photo", e.target.value)}
                  placeholder="Paste your photo URL"
                />
              </div> */}

              {form.photo && (
                <div className="flex items-center gap-4 p-4 bg-white/50 rounded-xl border border-white/50">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={form.photo} alt="Preview" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {form.name ? getInitials(form.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">Photo preview</span>
                </div>
              )}

              <Button
                onClick={submitUpdate}
                disabled={isLoading}
                className="w-full bg-black text-white py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving Changes...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
