import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInventory } from "@/contexts/InventoryContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  quantity: z.coerce
    .number()
    .min(1, { message: "Quantity must be at least 1" }),
  category: z.enum([
    "Electronics",
    "Furniture",
    "Clothing",
    "Food",
    "Tools",
    "Other",
  ]),
  threshold: z.coerce
    .number()
    .min(1, { message: "Threshold must be at least 1" }),
});

const categories = [
  "Electronics",
  "Furniture",
  "Clothing",
  "Food",
  "Tools",
  "Other",
];

const AddItemForm = () => {
  const { addItem } = useInventory();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      quantity: 1,
      category: "Electronics",
      threshold: 5,
    },
  });

  const onSubmit = async (data) => {
    try {
      await addItem({
        ...data,
        dateAdded: new Date().toISOString(),
      });
      toast.success("Item added successfully! 🎉");
      reset();
      navigate("/inventory");
    } catch (error) {
      toast.error("Failed to add item. Please try again."); 
      console.error("Error adding item:", error);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add New Inventory Item</CardTitle>
        <CardDescription>
          Enter the details of the new item to add it to your warehouse
          inventory.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              placeholder="e.g. Dell Laptop XPS 15"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              {...register("quantity")}
            />
            {errors.quantity && (
              <p className="text-sm text-destructive">
                {errors.quantity.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              defaultValue="Electronics"
              onValueChange={(value) => setValue("category", value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">
                {errors.category.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="threshold">
              Low Stock Threshold
              <span className="ml-1 text-sm text-muted-foreground">
                (Alert when stock falls below)
              </span>
            </Label>
            <Input
              id="threshold"
              type="number"
              min="1"
              {...register("threshold")}
            />
            {errors.threshold && (
              <p className="text-sm text-destructive">
                {errors.threshold.message}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/inventory")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Add Item
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AddItemForm;
