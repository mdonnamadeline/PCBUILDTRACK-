const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const Menu = require("./models/menu.model");
const Report = require("./models/report.model");
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
app.put('/updatemenu/:id', upload.single("image"), async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (req.file) {
            updateData.image = req.file.filename;
        }

        // Find and update the menu item
        const result = await Menu.findByIdAndUpdate(id, updateData, { new: true });

        if (!result) {
            return res.status(404).json({ success: false, message: 'Menu item not found' });
        }

        res.json({ success: true, message: 'Menu item updated successfully', data: result });
    } catch (error) {
        console.error('Error updating menu:', error);
        res.status(500).json({ success: false, message: 'Failed to update menu item' });
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

//deduction of the product
app.post('/update-stock', async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || quantity === undefined) {
        return res.status(400).json({ error: 'Product ID and quantity are required.' });
    }

    try {
        const menuItem = await Menu.findById(productId);

        if (!menuItem) {
            return res.status(404).json({ error: 'Product not found' });
        }

        menuItem.quantity -= quantity;

        if (menuItem.quantity < 0) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }

        await menuItem.save();
        res.status(200).json({ message: 'Stock updated successfully' });
    } catch (error) {
        console.error('Error updating stock:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//MARK:REPORTS
// Save transaction route
app.post('/save-transaction', async (req, res) => {
    try {
      const { productName, quantity, price, date, bank } = req.body;
      const newTransaction = new Report({
        productName,
        quantity,
        price,
        date,
        bank
      });
  
      await newTransaction.save();
      res.status(200).json({ status: 'ok', message: 'Transaction saved successfully' });
    } catch (error) {
      console.error('Error saving transaction:', error);
      res.status(500).json({ status: 'error', message: 'Failed to save transaction' });
    }
  });
  
  // Get transactions route
  app.get('/get-transactions', async (req, res) => {
    try {
      const transactions = await Report.find();
      res.json(transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      res.status(500).json({ status: 'error', message: 'Failed to fetch transactions' });
    }
  });

  // Delete transaction route
app.delete('/delete-transaction/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Report.findByIdAndDelete(id);

        if (result) {
            res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
        } else {
            res.status(404).json({ success: false, error: 'Transaction not found' });
        }
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ success: false, error: 'Failed to delete transaction' });
    }
});

  
