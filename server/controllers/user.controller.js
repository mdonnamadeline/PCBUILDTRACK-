const User = require("../models/user.model");

exports.signup = async (req, res) => {
    const { firstname, lastname, middlename, email, password } = req.body;

    try {
        if (!firstname || !lastname || !email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "Missing required fields" });
        }

        const newUser = new User({
            firstname,
            lastname,
            middlename,
            email,
            password,
        });
        await newUser.save();
        res.json({ success: true, message: "Signed up successfully!" });
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.password !== password) {
            return res.json({ success: false, message: "Invalid password" });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error("Error during sign-in:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.addUser = async (req, res) => {
    const incomingData = req.body;

    try {
        const dataObject = new User(incomingData);
        await dataObject.save();
        res.json({ success: true, message: "User added successfully!" });
    } catch (error) {
        console.error("Error adding User:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.viewUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error,
        });
    }
};

exports.updateUser = async (req, res) => {
    const incomingData = req.body;

    try {
        const dataObject = await User.findById(req.params.id);
        if (!dataObject) {
            return res.status(404).json({ message: "User not found" });
        }

        Object.assign(dataObject, incomingData);
        await dataObject.save();
        res.json({ success: true, message: "User updated successfully!" });
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(400).json({
            success: false,
            message: "Failed to update user",
            error: error.message,
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to delete user",
            error,
        });
    }
};

//app.post("/signup", async (req, res) => {
//app.post("/signin", async (req, res) => {
//app.post("/adduser", async (req, res) => {
//app.get("/viewusers", async (req, res) => {
//app.put("/updateuser/:id", async (req, res) => {
//app.delete("/deleteuser/:id", async (req, res) => {