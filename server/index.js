const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const multer = require('multer');
const path = require('path');
app.use(cors());
app.use(bodyParser.json());

const port = 1337;
const dbName = "final-data";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

mongoose
    .connect("mongodb://localhost:27017/" + dbName)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.error("Database connection error", err));

//add
app.post("/AddEntry", async (req, res) => {
    const incomingData = req.body;

    try {
        const dataObject = new DataModel(incomingData);
        await dataObject.save();
        res.json({ success: true, message: "Data added successfully!" });
    } catch (error) {
        console.error("Error adding data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//read or view
app.get("/ViewEntries", async (req, res) => {
    try {
        const gotDataList = await DataModel.find();
        res.json(gotDataList);
    } catch (error) {
        console.error("Error getting data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//update
app.post("/EditEntry", async (req, res) => {
    const incomingData = req.body;

    try {
        const dataObject = await DataModel.findOne({ email: incomingData.email });
        if (!dataObject) {
            res.json({ success: false, message: "Data not found" });
        } else {
            Object.assign(dataObject, incomingData);
            await dataObject.save();
            res.json({ success: true, message: "Data updated successfully!" });
        }
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//delete
app.delete("/delete", async (req, res) => {
    const incomingData = req.body;

    try {
        const dataObject = await DataModel.findOne({ email: incomingData.email });
        if (!dataObject) {
            res.json({ success: false, message: "Data not found" });
        } else {
            await dataObject.remove();
            res.json({ success: true, message: "Data deleted successfully!" });
        }
    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//sign-in
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const dataObject = await DataModel.findOne({ username });

        if (!dataObject) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        if (dataObject.password !== password) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        // User is authenticated
        res.json({ success: true, message: 'Logged in successfully!' });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//sign-up
app.post("/signup", async (req, res) => {
    const incomingData = req.body;

    try {
        const dataObject = new DataModel(incomingData);
        await dataObject.save();
        res.json({ success: true, message: "Signed up successfully!" });
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


//MARK# NEW
 
//MARK:ADMIN CRUD
// Create user
app.post('/adduser', async (req, res) => {
    const { firstname, lastname, middlename, email, password } = req.body;
    try {
      const newUser = new User({ firstname, lastname, middlename, email, password });
      await newUser.save();
      res.status(201).json({ success: true, message: 'User added successfully' });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Failed to add user', error });
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
  app.post('/updateuser', async (req, res) => {
    const { _id, firstname, lastname, middlename, email, password } = req.body;
    try {
      const updatedUser = await User.findByIdAndUpdate(_id, { firstname, lastname, middlename, email, password }, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(200).json({ success: true, message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      res.status(400).json({ success: false, message: 'Failed to update user', error });
    }
  });
  
  // Delete user
  app.post('/deleteuser', async (req, res) => {
    const { _id } = req.body;
    try {
      const deletedUser = await User.findByIdAndDelete(_id);
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

