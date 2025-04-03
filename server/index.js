const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const mongoose = require("mongoose");
const path = require("path");

const port = 1337;
const host = "0.0.0.0";
const dbName = "PBT-data";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Routes
app.use("/uploads", express.static(uploadsDir));

const reportRoutes = require("./routes/report.routes");
app.use("/api/reports", reportRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/api/users", userRoutes);

const menuRoutes = require("./routes/menu.routes");
app.use("/api/menu", menuRoutes);


app.listen(port, host, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

// MongoDB connection
mongoose
    .connect("mongodb://localhost:27017/" + dbName)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection error", err));


