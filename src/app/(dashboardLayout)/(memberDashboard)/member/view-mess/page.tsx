"use client";

import { useEffect, useState } from "react";
import { getMemberMess } from "@/services/mess";
import { getAllBazarDataInMess } from "@/services/bazar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  MapPin,
  DollarSign,
  UserCheck,
  Mail,
  Building,
  ShoppingCart,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  ChevronRight,
  User,
  CreditCard,
} from "lucide-react";

interface IMess {
  _id: string;
  name: string;
  address: string;
  monthlyBudget: number;
  members: { _id: string; name: string; email: string }[];
  managers: { _id: string; name: string; email: string };
}

interface BazarItem {
  name: string;
  quantity: number;
  price: number;
  category: string;
}

interface BazarData {
  _id: string;
  mess: string;
  addedBy: string;
  items: BazarItem[];
  total: number;
  note: string;
  proof: string;
  approved: boolean;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
}

interface BazarResponse {
  success: boolean;
  message: string;
  data: BazarData[];
}

export default function MemberMessList() {
  const [messes, setMesses] = useState<IMess[]>([]);
  const [selectedMessId, setSelectedMessId] = useState<string | null>(null);
  const [bazarData, setBazarData] = useState<BazarData[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await getMemberMess();
    if (res?.data) {
      setMesses(res.data);
    }
  };

  const loadBazarData = async (messId: string) => {
    setLoading(true);
    try {
      const res: BazarResponse = await getAllBazarDataInMess(messId);
      if (res.success && res.data) {
        setBazarData(res.data);
      }
    } catch (error) {
      console.error("Error loading bazar data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBazar = async (messId: string) => {
    setSelectedMessId(messId);
    await loadBazarData(messId);
    setDialogOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateTotalBazar = (bazarList: BazarData[]) => {
    return bazarList.reduce((total, bazar) => total + bazar.total, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Mess Information
          </h1>
          <p className="text-gray-600">
            Manage your mess details and expenses efficiently
          </p>
        </div>

        <div className="grid gap-6">
          {messes.map((mess) => {
            const totalMembers = mess.members.length || 1;
            const perPersonCost = mess.monthlyBudget / totalMembers;

            return (
              <Card key={mess._id} className="shadow-sm border">
                <CardHeader className="pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Building className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold">
                          {mess.name}
                        </CardTitle>
                        <CardTitle className="text-xs ">
                          Mess Id:-{mess._id}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <MapPin className="w-4 h-4" />
                          {mess.address}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
                      Active
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Budget & Cost Section */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          FINANCIAL OVERVIEW
                        </h3>
                        <div className="space-y-3">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-blue-700">
                                Monthly Budget
                              </span>
                              <DollarSign className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="text-lg font-bold text-blue-900 mt-1">
                              ৳ {mess.monthlyBudget.toLocaleString()}
                            </p>
                          </div>
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-green-700">
                                Cost Per Person
                              </span>
                              <User className="w-4 h-4 text-green-600" />
                            </div>
                            <p className="text-lg font-bold text-green-900 mt-1">
                              ৳ {perPersonCost.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Members Section */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        MEMBERS ({totalMembers})
                      </h3>
                      <div className="space-y-2">
                        <div className="flex -space-x-2 mb-3">
                          {mess.members.slice(0, 5).map((member) => (
                            <Avatar
                              key={member._id}
                              className="w-8 h-8 border-2 border-white shadow-sm"
                            >
                              <AvatarFallback className="bg-gray-100 text-gray-600 text-xs font-medium">
                                {getInitials(member.name)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {mess.members.length > 5 && (
                            <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                              <AvatarFallback className="bg-gray-100 text-gray-600 text-xs font-medium">
                                +{mess.members.length - 5}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                        {mess.members.slice(0, 3).map((member) => (
                          <div
                            key={member._id}
                            className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="bg-white text-gray-600 text-xs border">
                                {getInitials(member.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {member.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {member.email}
                              </p>
                            </div>
                          </div>
                        ))}
                        {mess.members.length > 3 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs text-gray-500"
                          >
                            View all {totalMembers} members
                            <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Manager Section */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        MANAGER
                      </h3>
                      {mess?.managers ? (
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-purple-100 text-purple-700 font-medium">
                                {getInitials(mess.managers.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {mess.managers.name}
                              </p>
                              <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                                <Mail className="w-3 h-3" />
                                <span className="truncate">
                                  {mess.managers.email}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 border border-dashed border-gray-300 rounded-lg">
                          <UserCheck className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No manager</p>
                        </div>
                      )}
                    </div>

                    {/* Actions Section */}
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 mb-2">
                        ACTIONS
                      </h3>
                      <div className="space-y-3">
                        <Button
                          onClick={() => handleViewBazar(mess._id)}
                          className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          View Bazar History
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {messes.length === 0 && (
            <Card className="text-center py-16 border-dashed">
              <CardContent>
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">
                  No Mess Found
                </h3>
                <p className="text-gray-400 mb-4">
                  You are not currently a member of any mess.
                </p>
                <Button>Join a Mess</Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Bazar History Modal */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Bazar History
                {selectedMessId && (
                  <Badge variant="secondary" className="ml-2">
                    {messes.find((m) => m._id === selectedMessId)?.name}
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription>
                Complete bazar purchase history for this mess
              </DialogDescription>
            </DialogHeader>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : bazarData.length === 0 ? (
              <Card className="text-center py-12 border-dashed">
                <CardContent>
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-500 mb-2">
                    No Bazar Data Found
                  </h3>
                  <p className="text-gray-400">
                    No bazar purchases have been recorded for this mess yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4 text-center">
                      <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-900">
                        ৳ {calculateTotalBazar(bazarData).toLocaleString()}
                      </p>
                      <p className="text-sm text-green-700">Total Bazar</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4 text-center">
                      <ShoppingCart className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-900">
                        {bazarData.length}
                      </p>
                      <p className="text-sm text-blue-700">Total Records</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-4 text-center">
                      <CheckCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-purple-900">
                        {bazarData.filter((b) => b.approved).length}
                      </p>
                      <p className="text-sm text-purple-700">Approved</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Bazar List */}
                <div className="space-y-4">
                  {bazarData.map((bazar) => (
                    <Card
                      key={bazar._id}
                      className={`border-l-4 ${
                        bazar.approved
                          ? "border-l-green-500"
                          : "border-l-yellow-500"
                      }`}
                    >
                      <CardContent className="p-0">
                        <div className="flex items-start justify-between p-4 border-b">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {formatDate(bazar.createdAt)}
                              </span>
                            </div>
                            <Badge
                              variant={bazar.approved ? "default" : "secondary"}
                              className={
                                bazar.approved
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : "bg-yellow-100 text-yellow-800 border-yellow-200"
                              }
                            >
                              {bazar.approved ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <XCircle className="w-3 h-3 mr-1" />
                              )}
                              {bazar.approved ? "Approved" : "Pending"}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">
                              ৳ {bazar.total.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {bazar.note && (
                          <div className="px-4 py-3 bg-gray-50 border-b">
                            <p className="text-sm text-gray-600">
                              {bazar.note}
                            </p>
                          </div>
                        )}

                        {/* Items Table */}
                        <div className="p-1">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="font-semibold">
                                  Item Name
                                </TableHead>
                                <TableHead className="font-semibold">
                                  Category
                                </TableHead>
                                <TableHead className="font-semibold text-center">
                                  Qty
                                </TableHead>
                                <TableHead className="font-semibold text-right">
                                  Price
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {bazar.items.map((item, index) => (
                                <TableRow
                                  key={index}
                                  className="hover:bg-gray-50/50"
                                >
                                  <TableCell className="font-medium">
                                    {item.name}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-gray-100"
                                    >
                                      {item.category}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-center">
                                    {item.quantity}
                                  </TableCell>
                                  <TableCell className="text-right font-semibold">
                                    ৳ {item.price.toLocaleString()}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        {/* Proof Image */}
                        {bazar.proof && (
                          <div className="px-4 py-3 border-t bg-gray-50">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(bazar.proof, "_blank")}
                              className="flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Purchase Proof
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
