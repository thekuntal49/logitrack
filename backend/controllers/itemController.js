const Item = require("../models/Item");

// Add a new item
exports.addItem = async (req, res) => {
    try {
        const { name, quantity, category, threshold } = req.body;
        console.log(threshold);
        
        const newItem = new Item({ name, quantity, category, threshold });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all items
exports.getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update item quantity when dispatched
exports.updateItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const item = await Item.findByIdAndUpdate(req.params.id, { quantity }, { new: true });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an item
exports.deleteItem = async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
