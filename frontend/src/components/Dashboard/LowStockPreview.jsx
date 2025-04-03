
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useInventory } from "@/contexts/InventoryContext";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LowStockPreview = () => {
  const { getLowStockItems } = useInventory();
  const lowStockItems = getLowStockItems();

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Low Stock Alerts</CardTitle>
        <Button variant="link" size="sm" asChild>
          <Link to="/low-stock">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {lowStockItems.length > 0 ? (
          <div className="space-y-4">
            {lowStockItems.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-warning/10 rounded-md border border-warning/20"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{item.quantity} left</p>
                  <p className="text-xs text-muted-foreground">
                    Threshold: {item.threshold}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground">
            <p className="mb-2">No low stock items</p>
            <p className="text-sm">All inventory items are above their threshold levels</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LowStockPreview;
