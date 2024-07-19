const Menu = require("../models/menu.model");
const { deleteImage } = require("../middlewares/imageDelete");

exports.addMenu = async (req, res) => {
    const incomingData = req.body;

    if (req.file) {
        incomingData.image = req.file.filename;
    } else {
        return res
            .status(400)
            .json({ success: false, message: "No file uploaded!" });
    }

    try {
        const dataObject = new Menu(incomingData);
        await dataObject.save();
        res.json({ success: true, message: "Data added successfully!" });
    } catch (error) {
        console.error("Error adding data:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.viewMenu = async (req, res) => {
    try {
        const gotDataList = await Menu.find();
        res.json({ data: gotDataList });
    } catch (error) {
        console.error("Error getting data:", error);
        res.status(500).send({ status: "error", message: error.message });
    }
};

exports.updateMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (req.file) {
            updateData.image = req.file.filename;
        }

        // Find and update the menu item
        const result = await Menu.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        if (!result) {
            return res
                .status(404)
                .json({ success: false, message: "Menu item not found" });
        }

        res.json({
            success: true,
            message: "Menu item updated successfully",
            data: result,
        });
    } catch (error) {
        console.error("Error updating menu:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update menu item",
        });
    }
};

exports.deleteMenu = async (req, res) => {
    try {
        const dataObject = await Menu.findById(req.params.id);
        if (!dataObject) {
            return res.status(404).json({ message: "Data not found" });
        }

        if (dataObject.image && typeof dataObject.image === "string") {
            try {
                await deleteImage(dataObject.image);
            } catch (err) {
                console.error("Error deleting image:", err);
            }
        }

        await Menu.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Data deleted successfully!" });
    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.updateStock = async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
        return res
            .status(400)
            .json({ error: "Product ID and quantity are required." });
    }

    try {
        const menuItem = await Menu.findById(productId);

        if (!menuItem) {
            return res.status(404).json({ error: "Product not found" });
        }

        menuItem.quantity -= quantity;

        if (menuItem.quantity < 0) {
            return res.status(400).json({ error: "Insufficient stock" });
        }

        await menuItem.save();
        res.status(200).json({ message: "Stock updated successfully" });
    } catch (error) {
        console.error("Error updating stock:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// app.post("/addmenu", upload.single("image"), async (req, res) => {
// app.get("/viewmenu", async (req, res) => {
// app.put("/updatemenu/:id", upload.single("image"), async (req, res) => {
// app.delete("/deletemenu/:id", async (req, res) => {
// app.post("/update-stock", async (req, res) => {