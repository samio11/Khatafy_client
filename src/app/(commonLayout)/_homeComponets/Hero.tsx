"use client";
import { ChevronRight, Users, Receipt, TrendingDown } from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import { toast } from "sonner";
import { logoutUser } from "@/services/auth";
import { useEffect } from "react";

export default function Hero() {
  const { user, refetchUser } = useUser();

  const handleLogout = async () => {
    const toastId = toast.loading("User is Logging out");
    try {
      await logoutUser();
      await refetchUser();
      toast.success("user is Logged Out", { id: toastId });
    } catch (err) {
      toast.error("user is Logged Out failed", { id: toastId });
    }
  };
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              Khatafy
            </span>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-3 px-4 py-2 bg-white/70 backdrop-blur-md border border-emerald-100 rounded-xl shadow-sm hover:shadow-md transition-all">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-medium shadow-md">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>

                  {/* Name + Role */}
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-medium leading-tight">
                      {user?.name}
                    </span>
                    <span
                      className={`
                text-xs px-2 py-0.5 rounded-full font-medium mt-1
                ${
                  user.role === "admin"
                    ? "bg-red-100 text-red-700"
                    : user.role === "manager"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-emerald-100 text-emerald-700"
                }
              `}
                    >
                      {user.role.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Dashboard Button */}
                <Link
                  href={
                    user.role === "admin"
                      ? "/admin/dashboard"
                      : user.role === "manager"
                      ? "/manager/dashboard"
                      : "/member/dashboard"
                  }
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all"
                >
                  Dashboard
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-lg bg-white text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 hover:shadow transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href={"/login"}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/30"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-emerald-100">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-700">
                Trusted by 500+ mess groups across Bangladesh
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl text-gray-900 leading-tight">
              Manage Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Bachelor Mess
              </span>{" "}
              Effortlessly
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              Say goodbye to messy calculations and arguments. Track bazar
              expenses, manage members, and split costs fairly with MessMate -
              the complete solution for bachelor mess management in Bangladesh.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-xl shadow-emerald-500/30 flex items-center gap-2">
                Start Your Mess Free
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-lg border border-gray-200">
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  <div className="text-2xl text-gray-900">500+</div>
                </div>
                <div className="text-sm text-gray-600">Active Mess</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-teal-600" />
                  <div className="text-2xl text-gray-900">10k+</div>
                </div>
                <div className="text-sm text-gray-600">Transactions</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-cyan-600" />
                  <div className="text-2xl text-gray-900">30%</div>
                </div>
                <div className="text-sm text-gray-600">Cost Saved</div>
              </div>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              {/* Mock Dashboard Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <div className="text-lg text-gray-900">Monthly Overview</div>
                  <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm">
                    March 2025
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
                    <div className="text-sm text-emerald-700 mb-1">
                      Total Bazar
                    </div>
                    <div className="text-2xl text-emerald-900">৳15,420</div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl">
                    <div className="text-sm text-teal-700 mb-1">Per Member</div>
                    <div className="text-2xl text-teal-900">৳3,855</div>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="text-sm text-gray-700">Recent Bazar</div>
                  {[
                    {
                      name: "Rahim",
                      amount: "৳850",
                      items: "Rice, Oil, Vegetables",
                      verified: true,
                    },
                    {
                      name: "Karim",
                      amount: "৳620",
                      items: "Fish, Chicken, Spices",
                      verified: true,
                    },
                    {
                      name: "Jabbar",
                      amount: "৳450",
                      items: "Eggs, Milk, Bread",
                      verified: false,
                    },
                  ].map((bazar, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center text-gray-700">
                        {bazar.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="text-sm text-gray-900">
                            {bazar.name}
                          </div>
                          {bazar.verified && (
                            <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {bazar.items}
                        </div>
                      </div>
                      <div className="text-sm text-gray-900">
                        {bazar.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-2xl rotate-12 shadow-xl flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-2xl">100%</div>
                <div className="text-xs">Transparent</div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl -rotate-12 shadow-xl flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-xl">৳0</div>
                <div className="text-xs">Setup Fee</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
