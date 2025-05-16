const Contact = require('../models/contact.model');

exports.addContact = async (req, res) => {
    const incomingData = req.body;
    try {
        const dataObject = new Contact(incomingData);
        await dataObject.save();
        res.json({ success: true, message: "Contact message added successfully!" });
    } catch (error) {
        console.error("Error adding contact:", error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

exports.viewContact = async (req, res) => {
    try {
        const gotDataList = await Contact.find();
        res.json({ data: gotDataList });
    } catch (error) {
        console.error("Error getting contacts:", error);
        res.status(500).send({ status: "error", message: error.message });
    }
};