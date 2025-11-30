"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ShoppingCart,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  createBazar,
  addItemToBazar,
  updatedBazar,
  deleteBazar,
  getAllBazarForMember,
} from "@/services/bazar";
import { toast } from "sonner";
import SingleImageUploader from "@/sheared/SIngleImageUploader";

// Types
interface BazarItem {
  name: string;
  quantity: number;
  price: number;
  _id?: string;
}

interface Bazar {
  _id: string;
  date: string;
  messId: string;
  note?: string;
  items: BazarItem[];
  approved: boolean;
  proof?: string;
  total?: number;
}

interface BazarResponse {
  success: boolean;
  data: {
    data: Bazar[];
  };
  message?: string;
}

// Schemas
const createBazarSchema = z.object({
  date: z.string().min(1, "Date is required"),
  messId: z.string().min(1, "Mess ID is required"),
  note: z.string().optional(),
  items: z
    .array(
      z.object({
        name: z.string().min(1, "Item name is required"),
        quantity: z.number().min(0.01, "Quantity must be positive"),
        price: z.number().min(0, "Price must be positive"),
      })
    )
    .min(1, "At least one item is required"),
});

const addItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z.number().min(0.01, "Quantity must be positive"),
  price: z.number().min(0, "Price must be positive"),
});

type CreateBazarFormData = z.infer<typeof createBazarSchema>;
type AddItemFormData = z.infer<typeof addItemSchema>;

export default function ManageBazar() {
  const [bazars, setBazars] = useState<Bazar[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [selectedBazar, setSelectedBazar] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [mounted, setMounted] = useState(false);

  // Create Bazar Form
  const createForm = useForm<CreateBazarFormData>({
    resolver: zodResolver(createBazarSchema),
    defaultValues: {
      date: "",
      note: "",
      messId: "",
      items: [{ name: "", quantity: 0, price: 0 }],
    },
  });

  // Fix hydration issue - only set date after component mounts
  useEffect(() => {
    setMounted(true);
    // Use setTimeout to ensure this runs after hydration
    const timer = setTimeout(() => {
      createForm.setValue("date", new Date().toISOString().split("T")[0]);
    }, 0);

    return () => clearTimeout(timer);
  }, [createForm]);

  // Add Item Form
  const addItemForm = useForm<AddItemFormData>({
    resolver: zodResolver(addItemSchema),
    defaultValues: {
      name: "",
      quantity: 0,
      price: 0,
    },
  });

  // Fetch all bazars
  const fetchBazars = async () => {
    try {
      setLoading(true);
      const response: BazarResponse = await getAllBazarForMember();
      if (response.success) {
        setBazars(response.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to fetch bazars");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBazars();
  }, []);

  // Handle create bazar
  const onCreateBazar = async (data: CreateBazarFormData) => {
    try {
      const formData = new FormData();
      formData.append(
        "data",
        JSON.stringify({
          date: data.date,
          note: data.note,
          items: data.items,
          total: data.items.reduce((sum, item) => {
            return sum + Number(item?.quantity || 0) * Number(item?.price || 0);
          }, 0),
        })
      );
      if (uploadedFile) {
        formData.append("file", uploadedFile);
      }

      const response = await createBazar(data.messId, formData);

      if (response.success) {
        toast.success("Bazar created successfully");
        setCreateDialogOpen(false);
        createForm.reset();
        setUploadedFile(null);
        fetchBazars();
      } else {
        toast.error(response.message || "Failed to create bazar");
      }
    } catch (error) {
      toast.error("Failed to create bazar");
    }
  };

  // Handle add item to bazar
  const onAddItem = async (data: AddItemFormData) => {
    if (!selectedBazar) {
      toast.error("No bazar selected");
      return;
    }

    try {
      const response = await addItemToBazar(selectedBazar, data);

      if (response.success) {
        toast.success("Item added successfully");
        setAddItemDialogOpen(false);
        addItemForm.reset();
        setSelectedBazar(null);
        fetchBazars();
      } else {
        toast.error(response.message || "Failed to add item");
      }
    } catch (error) {
      toast.error("Failed to add item");
    }
  };

  // Handle delete bazar
  const handleDeleteBazar = async (bazarId: string) => {
    if (!confirm("Are you sure you want to delete this bazar?")) return;

    try {
      const response = await deleteBazar(bazarId);

      if (response.success) {
        toast.success("Bazar deleted successfully");
        fetchBazars();
      } else {
        toast.error(response.message || "Failed to delete bazar");
      }
    } catch (error) {
      toast.error("Failed to delete bazar");
    }
  };

  // Calculate total for a bazar
  const calculateTotal = (items: BazarItem[]) => {
    return items.reduce(
      (sum, item) => sum + (item?.quantity || 0) * (item?.price || 0),
      0
    );
  };

  // Don't render date-dependent content until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-center items-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }
  console.log(bazars);
  console.log(selectedBazar);
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">Bazar Management</h1>
          <p className="text-muted-foreground">
            Manage your shopping and expenses
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Bazar
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Bazar</DialogTitle>
              <DialogDescription>
                Add a new bazar entry with items and proof of purchase
              </DialogDescription>
            </DialogHeader>
            <Form {...createForm}>
              <form
                onSubmit={createForm.handleSubmit(onCreateBazar)}
                className="space-y-4"
              >
                <FormField
                  control={createForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="messId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mess ID</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Mess ID"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any notes about this bazar..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Items</FormLabel>
                  {createForm.watch("items").map((_, index) => (
                    <div key={index} className="flex gap-2">
                      <FormField
                        control={createForm.control}
                        name={`items.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Item name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem className="w-24">
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="Qty"
                                value={field.value}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name={`items.${index}.price`}
                        render={({ field }) => (
                          <FormItem className="w-24">
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="Price"
                                value={field.value}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            const items = createForm.getValues("items");
                            createForm.setValue(
                              "items",
                              items.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const items = createForm.getValues("items");
                      createForm.setValue("items", [
                        ...items,
                        { name: "", quantity: 0, price: 0 },
                      ]);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                <div>
                  <FormLabel>Proof of Purchase</FormLabel>
                  <SingleImageUploader onChange={setUploadedFile} />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create Bazar</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bazars List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : bazars.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-semibold text-lg">No bazars yet</h3>
            <p className="mb-4 text-muted-foreground text-sm">
              Create your first bazar to get started
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {bazars.map((bazar) => (
            <Card key={bazar._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Bazar - {new Date(bazar.date).toLocaleDateString()}
                      {bazar.approved ? (
                        <Badge variant="default">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Approved
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="mr-1 h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </CardTitle>
                    {bazar.note && (
                      <CardDescription>{bazar.note}</CardDescription>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Dialog
                      open={addItemDialogOpen && selectedBazar === bazar._id}
                      onOpenChange={(open) => {
                        setAddItemDialogOpen(open);
                        if (!open) {
                          setSelectedBazar(null);
                          addItemForm.reset();
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            setSelectedBazar(bazar._id);
                            setAddItemDialogOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Item</DialogTitle>
                          <DialogDescription>
                            Add a new item to this bazar
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...addItemForm}>
                          <form
                            onSubmit={addItemForm.handleSubmit(onAddItem)}
                            className="space-y-4"
                          >
                            <FormField
                              control={addItemForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Item Name</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="e.g., Rice"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={addItemForm.control}
                              name="quantity"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Quantity</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={field.value}
                                      onChange={(e) =>
                                        field.onChange(
                                          parseFloat(e.target.value) || 0
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={addItemForm.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Price</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      value={field.value}
                                      onChange={(e) =>
                                        field.onChange(
                                          parseFloat(e.target.value) || 0
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setAddItemDialogOpen(false);
                                  setSelectedBazar(null);
                                  addItemForm.reset();
                                }}
                              >
                                Cancel
                              </Button>
                              <Button type="submit">Add Item</Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDeleteBazar(bazar._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bazar.items?.map((item: BazarItem, idx: number) => (
                      <TableRow key={item?._id || idx}>
                        <TableCell className="font-medium">
                          {item?.name}
                        </TableCell>
                        <TableCell className="text-right">
                          {item?.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          ৳{item?.price?.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ৳{(item?.quantity * item?.price).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="font-bold text-right">
                        Total:
                      </TableCell>
                      <TableCell className="font-bold text-right">
                        ৳{calculateTotal(bazar.items || []).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                {bazar.proof && (
                  <div className="mt-4">
                    <img
                      src={bazar.proof}
                      alt="Proof of purchase"
                      className="h-48 rounded-lg object-cover"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
