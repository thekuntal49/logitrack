const express = require("express");
const router = express.Router();
const { addItem, getItems, updateItem, deleteItem } = require("../controllers/itemController");

router.post("/items", addItem);
router.get("/items", getItems);
router.put("/items/:id", updateItem);
router.delete("/items/:id", deleteItem);

module.exports = router;
