const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Furniture = require('../models/Furniture');
const connectDB = require('../db');

const seedDB = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB...');

    // Read data from JSON file
    const filePath = path.join(__dirname, '..//furnitureData.json');
    const jsonData = fs.readFileSync(filePath);
    const seedData = JSON.parse(jsonData);

    // Clear existing data
    await Furniture.deleteMany();
    console.log('Old data cleared...');

    // Insert new data
    await Furniture.insertMany(seedData);
    console.log('Data inserted...');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
