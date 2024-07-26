const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const Furniture = require('./models/Furniture');

const app = express();

app.use(cors());

const port = 3000;

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    await connectDB();
    app.use(bodyParser.json());

    // Get all furniture items
    app.get('/furniture', async (req, res) => {
      try {
        const furnitureItems = await Furniture.find();
        res.json(furnitureItems);
      } catch (err) {
        console.error('Error retrieving furniture items:', err.message);
        res.status(500).send('Server Error');
      }
    });

    // Get a furniture item by ID
    app.get('/furniture/:id', async (req, res) => {
      try {
        const furnitureItem = await Furniture.findById(req.params.id);
        if (!furnitureItem) {
          return res.status(404).json({ msg: 'Furniture item not found' });
        }
        res.json(furnitureItem);
      } catch (err) {
        console.error('Error retrieving furniture item:', err.message);
        res.status(500).send('Server Error');
      }
    });

    // Add a new furniture item
    app.post('/furniture', async (req, res) => {
      try {
        const newFurniture = new Furniture(req.body);
        const furnitureItem = await newFurniture.save();
        res.json(furnitureItem);
      } catch (err) {
        console.error('Error adding furniture item:', err.message);
        res.status(500).send('Server Error');
      }
    });

    // Update a furniture item by ID
    app.put('/furniture/:id', async (req, res) => {
      try {
        const furnitureItem = await Furniture.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!furnitureItem) {
          return res.status(404).json({ msg: 'Furniture item not found' });
        }
        res.json(furnitureItem);
      } catch (err) {
        console.error('Error updating furniture item:', err.message);
        res.status(500).send('Server Error');
      }
    });

    // Delete a furniture item by ID
    app.delete('/furniture/:id', async (req, res) => {
      try {
        const furnitureItem = await Furniture.findByIdAndRemove(req.params.id);
        if (!furnitureItem) {
          return res.status(404).json({ msg: 'Furniture item not found' });
        }
        res.json({ msg: 'Furniture item removed' });
      } catch (err) {
        console.error('Error deleting furniture item:', err.message);
        res.status(500).send('Server Error');
      }
    });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Error starting server:', err.message);
    process.exit(1);
  }
};

startServer();
