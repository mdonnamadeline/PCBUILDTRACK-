const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

exports.addUser = async (req, res) => {
    const incomingData = req.body;

    try {
        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(incomingData.password, salt);
        incomingData.password = hashedPassword;

        const dataObject = new User(incomingData);
        await dataObject.save();
        res.json({ success: true, message: "User added successfully!" });
    } catch (error) {
        console.error("Error adding User:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

exports.signup = async (req, res) => {
    const { firstname, lastname, middlename, email, password } = req.body;

    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({
                success: false,
                message: "Email already registered",
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstname,
            lastname,
            middlename,
            email,
            password: hashedPassword, // Save the hashed password
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

        // Compare password with bcrypt
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.json({ success: false, message: "Invalid password" });
        }

        // Remove password from response
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
        console.error("Error during sign-in:", error);
        res.status(500).json({ success: false, message: "Server error" });
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
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // If password is being updated, hash it
        if (incomingData.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(
                incomingData.password,
                salt
            );
            incomingData.password = hashedPassword;
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
