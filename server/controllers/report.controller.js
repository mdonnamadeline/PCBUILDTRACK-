const Report = require("../models/report.model");

exports.createTransaction = async (req, res) => {
    try {
        const { productName, quantity, price, date, bank } = req.body;
        const newTransaction = new Report({
            productName,
            quantity,
            price,
            date,
            bank,
        });

        await newTransaction.save();
        res.status(200).json({
            status: "ok",
            message: "Transaction saved successfully",
        });
    } catch (error) {
        console.error("Error saving transaction:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to save transaction",
        });
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Report.find();
        res.json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({
            status: "error",
            message: "Failed to fetch transactions",
        });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Report.findByIdAndDelete(id);

        if (result) {
            res.status(200).json({
                success: true,
                message: "Transaction deleted successfully",
            });
        } else {
            res.status(404).json({
                success: false,
                error: "Transaction not found",
            });
        }
    } catch (error) {
        console.error("Error deleting transaction:", error);
        res.status(500).json({
            success: false,
            error: "Failed to delete transaction",
        });
    }
};


// app.post("/save-transaction", async (req, res) => {
// app.get("/get-transactions", async (req, res) => {
// app.delete("/delete-transaction/:id", async (req, res) => {
