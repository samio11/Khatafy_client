"use client";

import { useEffect, useState } from "react";
import { getUsersByRole } from "@/services/auth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, UserX } from "lucide-react";
import Loading from "@/app/loading";

export default function ViewMember() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMembers = async () => {
    setLoading(true);
    const res = await getUsersByRole("member");
    setMembers(res?.data?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Members</h1>
        <Button onClick={loadMembers} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loading></Loading>
        </div>
      )}

      {/* TABLE */}
      {!loading && (
        <div className="rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="p-4 text-left">Id</th>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
              </tr>
            </thead>

            <tbody>
              {members.map((user) => (
                <tr key={user._id} className="border-t hover:bg-muted/30">
                  {/* EMAIL */}
                  <td className="p-4">{user._id}</td>
                  {/* NAME + IMAGE */}
                  <td className="p-4 flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photo} />
                      <AvatarFallback>
                        {user.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </td>

                  {/* EMAIL */}
                  <td className="p-4">{user.email}</td>

                  {/* ROLE */}
                  <td className="p-4">
                    <Badge variant="secondary">{user.role}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && members.length === 0 && (
        <p className="text-center text-muted-foreground py-10">
          No members found.
        </p>
      )}
    </div>
  );
}
