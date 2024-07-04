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
app.use('/uploads', express.static('uploads'));

const port = 1337;
const host = "0.0.0.0";
const dbName = "KFC-data";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads')); 
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

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
// Add Menu
app.post("/addmenu", upload.single("image"), async (req, res) => {
    const incomingData = req.body;

    if (req.file) {
        incomingData.image = req.file.filename;
    } else {
        return res.status(400).json({ success: false, message: "No file uploaded!" });
    }

    try {
        const dataObject = new Menu(incomingData);
        await dataObject.save();
        res.json({ success: true, message: "Data added successfully!" });
    } catch (error) {
        console.error("Error adding data:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

// View Menu
app.get("/viewmenu", async (req, res) => {
    try {
        const gotDataList = await Menu.find();
        res.json({ data: gotDataList });
    } catch (error) {
        console.error("Error getting data:", error);
        res.status(500).send({ status: "error", message: error.message });
    }
});

// Update Menu
app.put("/updatemenu/:id", upload.single("image"), async (req, res) => {
    const incomingData = req.body;

    if (req.file) {
        incomingData.image = req.file.filename;
    }

    try {
        const dataObject = await Menu.findById(req.params.id);
        if (!dataObject) {
            return res.status(404).json({ message: "Data not found" });
        }

        if (req.file && dataObject.image && typeof dataObject.image === "string") {
            const imageUrl = `${window.location.origin}/uploads/${menuItem.image}`;            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        Object.assign(dataObject, incomingData);
        await dataObject.save();
        res.json({ success: true, message: "Data updated successfully!" });
    } catch (error) {
        console.error("Error updating data:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

// Delete Menu
app.delete("/deletemenu/:id", async (req, res) => {
    try {
        const dataObject = await Menu.findById(req.params.id);
        if (!dataObject) {
            return res.status(404).json({ message: "Data not found" });
        }

        if (dataObject.image && typeof dataObject.image === "string") {
            const imagePath = path.join(__dirname, 'uploads', dataObject.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Menu.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Data deleted successfully!" });
    } catch (error) {
        console.error("Error deleting data:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
});