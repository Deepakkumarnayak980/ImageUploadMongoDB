const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const PORT = process.env.PORT || 8080;
const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MongoDB schema and model
const schema = new mongoose.Schema({
    image: String,
});
const ImageModel = mongoose.model("Image", schema);

// Routes

// Fetch all images
app.get('/', async (req, res) => {
    try {
        const data = await ImageModel.find({});
        res.json({ message: "All images", data });
    } catch (err) {
        console.error("Fetch error:", err);
        res.status(500).json({ message: "Error fetching images", error: err.message });
    }
});

// Upload new image
app.post('/upload', async (req, res) => {
    try {
        const { image } = req.body;
        if (!image) {
            return res.status(400).json({ message: "Image is required" });
        }

        const result = await ImageModel.create({ image });
        res.status(201).json({ message: "Image saved", id: result._id });
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ message: "Upload failed", error: err.message });
    }
});

// Delete image by ID
app.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await ImageModel.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Image not found" });
        }

        res.status(200).json({ message: "Image deleted" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ message: "Delete failed", error: err.message });
    }
});

// Connect to MongoDB and start server
mongoose.connect("mongodb://localhost:27017/imagebase64", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => console.log('Server running on port ' + PORT));
    })
    .catch((err) => {
        console.log("DB connection error:", err);
    });
