
import React from "react";
import { useInventory } from "@/contexts/InventoryContext";
import StatsCard from "@/components/Dashboard/StatsCard";
import CategoryChart from "@/components/Dashboard/CategoryChart";
import LowStockPreview from "@/components/Dashboard/LowStockPreview";
import { Package, BarChart, AlertTriangle, Tag } from "lucide-react";

const Dashboard = () => {
  const { getTotalItemCount, getCategoryCount, getLowStockItems, items } = useInventory();
  
  const totalItems = getTotalItemCount();
  const categoryCount = getCategoryCount();
  const lowStockItems = getLowStockItems();
  const totalCategories = Object.values(categoryCount).filter(count => count > 0).length;
  
  // Prepare chart data
  const chartData = [
    { name: "Electronics", value: categoryCount.Electronics, color: "#0EA5E9" },
    { name: "Furniture", value: categoryCount.Furniture, color: "#8B5CF6" },
    { name: "Clothing", value: categoryCount.Clothing, color: "#F97316" },
    { name: "Food", value: categoryCount.Food, color: "#10B981" },
    { name: "Tools", value: categoryCount.Tools, color: "#F43F5E" },
    { name: "Other", value: categoryCount.Other, color: "#6B7280" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Items"
          value={totalItems}
          icon={<Package className="h-6 w-6" />}
          description={`${items.length} unique product${items.length !== 1 ? 's' : ''}`}
        />
        <StatsCard
          title="Categories"
          value={totalCategories}
          icon={<Tag className="h-6 w-6" />}
          description={`${totalCategories} active categories`}
        />
        <StatsCard
          title="Low Stock Items"
          value={lowStockItems.length}
          icon={<AlertTriangle className="h-6 w-6" />}
          description={`${lowStockItems.length} item${lowStockItems.length !== 1 ? 's' : ''} below threshold`}
          className={lowStockItems.length > 0 ? "border-warning/50" : ""}
        />
        <StatsCard
          title="Average per Category"
          value={totalCategories > 0 ? Math.round(totalItems / totalCategories) : 0}
          icon={<BarChart className="h-6 w-6" />}
          description="Items per active category"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <CategoryChart data={chartData} />
        <LowStockPreview />
      </div>
    </div>
  );
};

export default Dashboard;
