
import React from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Package } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const LowStockTable = () => {
  const { getLowStockItems } = useInventory();
  const lowStockItems = getLowStockItems();

  // Calculate stock percentage
  const calculateStockPercentage = (current, threshold) => {
    return Math.min(Math.round((current / threshold) * 100), 100);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Low Stock Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        {lowStockItems.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Threshold</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.threshold}</TableCell>
                    <TableCell>
                      <div className="w-full max-w-xs">
                        <Progress
                          value={calculateStockPercentage(item.quantity, item.threshold)}
                          className="h-2"
                          indicatorClassName="bg-warning"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {calculateStockPercentage(item.quantity, item.threshold)}% of threshold
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="outline" size="sm">
                        <Link to="/add-item">Restock</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-3">
              <Package className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-lg font-medium mb-1">All Stocked Up!</h3>
            <p className="text-muted-foreground">
              You don't have any items below their threshold levels.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LowStockTable;
