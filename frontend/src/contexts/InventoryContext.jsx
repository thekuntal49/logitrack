import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  // Fetch items from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/items")
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  // Add new item
  const addItem = async (newItem) => {
    try {
      const res = await axios.post("http://localhost:5000/api/items", newItem);
      setItems([...items, res.data]); // Update state with new item
    } catch (err) {
      console.error("Error adding item:", err);
    }
  };

  // Update item quantity when dispatching
  const dispatchItem = async (id, newQuantity) => {
    try {
      await axios.put(`http://localhost:5000/api/items/${id}`, {
        quantity: newQuantity,
      });
      setItems(
        items.map((item) =>
          item._id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (err) {
      console.error("Error updating item:", err);
    }
  };

  // Delete item
  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/items/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const getLowStockItems = () => {
    return items.filter((item) => item.quantity < item.threshold);
  };

  const getTotalItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getCategoryCount = () => {
    return items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + item.quantity;
      return acc;
    }, {});
  };

  useEffect(() => {
    items.forEach((item) => {
      if (item.quantity < item.threshold) {
        toast.warning(
          `Low stock alert: ${item.name} has only ${item.quantity} left!`
        );
      }
    });
  }, [items]);

  return (
    <InventoryContext.Provider
      value={{
        items,
        addItem,
        dispatchItem,
        deleteItem,
        getLowStockItems,
        getTotalItemCount,
        getCategoryCount,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};
