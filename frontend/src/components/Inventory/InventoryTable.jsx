import React, { useState } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Trash, Send, Package, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

const InventoryTable = () => {
  const { items, deleteItem, dispatchItem } = useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dispatchQuantity, setDispatchQuantity] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter items based on search term
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort items based on sort config
  const sortedItems = React.useMemo(() => {
    let sortableItems = [...filteredItems];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredItems, sortConfig]);

  // Request sort method
  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleDispatchConfirm = async (id, updatedData) => {
    try {
      if (selectedItem) {
        await dispatchItem(selectedItem._id, dispatchQuantity);
        toast.success(`${selectedItem.name} updated successfully! ✅`);
        setIsDialogOpen(false);
        setSelectedItem(null);
        setDispatchQuantity(1);
      }
    } catch (error) {
      toast.error("Failed to update item. Please try again.");
      console.error("Error updating item:", error);
    }
  };

  const handleDeleteConfirm = async (id, name) => {
    try {
      await deleteItem(id);
      toast.success(`${name} deleted successfully! 🗑️`);
    } catch (error) {
      toast.error("Failed to delete item. Please try again.");
      console.error("Error deleting item:", error);
    }
  };

  // Get sort direction indicator
  const getSortDirection = (key) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "ascending" ? "↑" : "↓";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search items..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">
                    <Button
                      variant="ghost"
                      onClick={() => requestSort("name")}
                      className="flex items-center gap-1"
                    >
                      Item Name
                      <ArrowUpDown className="h-3 w-3 ml-1" />
                      {getSortDirection("name")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => requestSort("quantity")}
                      className="flex items-center gap-1"
                    >
                      Quantity
                      <ArrowUpDown className="h-3 w-3 ml-1" />
                      {getSortDirection("quantity")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => requestSort("category")}
                      className="flex items-center gap-1"
                    >
                      Category
                      <ArrowUpDown className="h-3 w-3 ml-1" />
                      {getSortDirection("category")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => requestSort("dateAdded")}
                      className="flex items-center gap-1"
                    >
                      Date Added
                      <ArrowUpDown className="h-3 w-3 ml-1" />
                      {getSortDirection("dateAdded")}
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedItems.length > 0 ? (
                  sortedItems.map((item) => (
                    <TableRow
                      key={item._id}
                      className={cn(
                        item.quantity < item.threshold && "bg-warning/5"
                      )}
                    >
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(item.dateAdded), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {item.quantity < item.threshold ? (
                          <Badge
                            variant="outline"
                            className="bg-warning/10 text-warning border-warning"
                          >
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-success/10 text-success border-success"
                          >
                            In Stock
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Dialog
                            open={
                              isDialogOpen && selectedItem?._id === item._id
                            }
                            onOpenChange={setIsDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setDispatchQuantity(1);
                                }}
                                disabled={item.quantity === 0}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Dispatch Item</DialogTitle>
                                <DialogDescription>
                                  How many {item.name} would you like to
                                  dispatch?
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <div className="flex items-center gap-4">
                                  <Package className="h-10 w-10 text-primary" />
                                  <div>
                                    <h3 className="font-medium">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                      Current Stock: {item.quantity}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-4">
                                  <Label htmlFor="dispatch-quantity">
                                    Dispatch Quantity
                                  </Label>
                                  <Input
                                    id="dispatch-quantity"
                                    type="number"
                                    min="1"
                                    max={item.quantity}
                                    value={dispatchQuantity}
                                    onChange={(e) => {
                                      const value = parseInt(e.target.value);
                                      if (
                                        !isNaN(value) &&
                                        value >= 1 &&
                                        value <= item.quantity
                                      ) {
                                        setDispatchQuantity(value);
                                      }
                                    }}
                                    className="mt-1"
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setIsDialogOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button onClick={handleDispatchConfirm}>
                                  Dispatch {dispatchQuantity}{" "}
                                  {dispatchQuantity === 1 ? "Item" : "Items"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleDeleteConfirm(item._id, item.name)
                            }
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {searchTerm ? (
                        <>
                          <p className="text-muted-foreground">
                            No items found for "{searchTerm}"
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Try a different search term
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-muted-foreground">
                            No items in inventory
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Add items to see them here
                          </p>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Label component for the dialog
const Label = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium">
    {children}
  </label>
);

export default InventoryTable;
