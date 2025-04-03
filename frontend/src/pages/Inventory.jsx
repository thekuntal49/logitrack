
import React from "react";
import InventoryTable from "@/components/Inventory/InventoryTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Inventory = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button asChild>
          <Link to="/add-item" className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add New Item
          </Link>
        </Button>
      </div>
      <InventoryTable />
    </div>
  );
};

export default Inventory;
