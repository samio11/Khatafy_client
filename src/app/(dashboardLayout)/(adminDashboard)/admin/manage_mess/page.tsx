"use client";

import { useEffect, useState } from "react";
import {
  getAllMess,
  createMess,
  getAMess,
  invitedUserToMess,
} from "@/services/mess";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Eye, Users } from "lucide-react";
import CreateMessModal from "./_components/CreateMessModal";
import ViewMessModal from "./_components/ViewMessModal";

export default function ManageMess() {
  const [messList, setMessList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [viewData, setViewData] = useState<any | null>(null);

  const fetchMess = async () => {
    setIsLoading(true);
    const res = await getAllMess();
    setMessList(res?.data?.data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMess();
  }, []);

  return (
    <div className="p-6 space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mess Management</h1>
        <Button onClick={() => setOpenCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" /> Create Mess
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Mess List</CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <p className="text-center py-4">Loading...</p>
          ) : messList.length === 0 ? (
            <p className="text-center py-4 text-gray-500">No Mess Found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border">Name</th>
                    <th className="p-3 border">Address</th>
                    <th className="p-3 border">Manager</th>
                    <th className="p-3 border">Members</th>
                    <th className="p-3 border">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {messList.map((mess) => (
                    <tr key={mess._id} className="border">
                      <td className="p-3 border">{mess.name}</td>
                      <td className="p-3 border">{mess.address}</td>
                      <td className="p-3 border">
                        {mess?.managers?.name || "N/A"}
                      </td>
                      <td className="p-3 border">
                        {mess?.members?.length || 0}
                      </td>

                      <td className="p-3 border">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              const d = await getAMess(mess._id);
                              setViewData(d?.data);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" /> View
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Modals */}
      <CreateMessModal
        open={openCreateModal}
        setOpen={setOpenCreateModal}
        refetch={fetchMess}
      />

      <ViewMessModal
        viewData={viewData}
        setViewData={setViewData}
        refetch={fetchMess}
      />
    </div>
  );
}
