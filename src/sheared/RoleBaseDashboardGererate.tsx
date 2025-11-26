"use client";
import { AdminAppSideBar } from "@/app/(dashboardLayout)/(adminDashboard)/admin/_AdminAppSideBar";
import { ManagerAppSideBar } from "@/app/(dashboardLayout)/(managerDashboard)/manager/_ManagerAppSideBar";
import { MemberAppSideBar } from "@/app/(dashboardLayout)/(memberDashboard)/member/_MemberAppSideBar";
import { useUser } from "@/contexts/UserContext";
import { ERole } from "@/types/user";
import React from "react";

export default function RoleBaseDashboardGererate() {
  const { user } = useUser();
  return (
    <div>
      {user && user.role === ERole.admin && <AdminAppSideBar></AdminAppSideBar>}
      {user && user.role === ERole.manager && (
        <ManagerAppSideBar></ManagerAppSideBar>
      )}
      {user && user.role === ERole.member && (
        <MemberAppSideBar></MemberAppSideBar>
      )}
    </div>
  );
}
