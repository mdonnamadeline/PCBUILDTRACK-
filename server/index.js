const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const Menu = require("./models/menu.model");
// const DataModel = require("./models/data.model"); 
const multer = require('multer');
const path = require('path');

app.use(cors());
app.use(bodyParser.json());

const port = 1337;
const host = "0.0.0.0";
const dbName = "KFC-data";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.listen(port, host, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

mongoose
    .connect("mongodb://localhost:27017/" + dbName)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection error", err));

    //MARK:SIGNUP ADMIN
// Sign-Up Endpoint
app.post("/signup", async (req, res) => {
    const { firstname, lastname, middlename, email, password } = req.body;

    try {
        if (!firstname || !lastname || !email || !password) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const newUser = new User({ firstname, lastname, middlename, email, password });
        await newUser.save();
        res.json({ success: true, message: "Signed up successfully!" });
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
});

// Sign-In Endpoint
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.password !== password) {
            return res.json({ success: false, message: 'Invalid password' });
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

//MARK:ADMIN CRUD
//MARK:ADMIN CRUD
// Create user
app.post('/adduser', async (req, res) => {
    const incomingData = req.body;

    try {
        const dataObject = new User(incomingData);
        await dataObject.save();
        res.json({ success: true, message: "User added successfully!" });
    } catch (error) {
        console.error("Error adding User:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Read all users
app.get('/viewusers', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching users', error });
  }
});

// Update user
app.put('/updateuser/:id', async (req, res) => {
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
        res.status(400).json({ success: false, message: 'Failed to update user', error: error.message });
    }
});

// Delete user
app.delete('/deleteuser/:id', async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Failed to delete user', error });
    }
  });
  

//signin 
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });

      if (!user) {
          return res.json({ success: false, message: 'User not found' });
      }

      if (user.password !== password) {
          return res.json({ success: false, message: 'Invalid password' });
      }

      res.json({ success: true, user });
  } catch (error) {
      console.error('Error during sign-in:', error);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});

//MARK:MENU CRUD 
//Upload Menu
app.post('/upload-menu', upload.single('file'), async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const image = req.file.buffer.toString('base64');

        const newDish = new Menu({ name, price, description, image });
        await newDish.save();

        res.send({ status: 'ok', message: 'Menu item added successfully', data: newDish });
    } catch (error) {
        console.error('Error uploading dish:', error);
        res.status(500).send({ status: 'error', message: error.message });
    }
});

//Display Menu
app.get("/get-menu", async (req, res) => {
    try {
        const data = await Menu.find({});
        res.send({ status: "ok", data: data });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    }
});

// Delete endpoint
app.delete("/delete-menu/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Menu.findByIdAndDelete(id);
        if (result) {
            res.send({ status: "ok", message: "Menu deleted successfully" });
        } else {
            res.status(404).send({ status: "error", message: "Menu not found" });
        }
    } catch (error) {
        console.error("Error deleting menu:", error);
        res.status(500).send({ status: "error", message: error.message });
    }
});

// Update endpoint
app.put("/update-menu/:id", async (req, res) => {
    const { id } = req.params;
    const { name, price, description } = req.body;

    try {
        const menu = await Menu.findById(id);
        if (menu) {
            menu.name = name;
            menu.price = price;
            menu.description = description;

            const updatedMenu = await menu.save();
            res.send({ status: "ok", message: "Menu updated successfully", data: updatedMenu });
        } else {
            res.status(404).send({ status: "error", message: "Menu not found" });
        }
    } catch (error) {
        console.error("Error updating menu:", error);
        res.status(500).send({ status: "error", message: error.message });
    }
});
