
import React from "react";
import Layout from "@/components/Layout";
import { InventoryProvider } from "@/contexts/InventoryContext";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Inventory from "./Inventory";
import AddItem from "./AddItem";
import LowStock from "./LowStock";

const Index = () => {
  return (
    <InventoryProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/low-stock" element={<LowStock />} />
        </Routes>
      </Layout>
    </InventoryProvider>
  );
};

export default Index;
