// backend/models/Restaurant.js
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const restaurantSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true },
  region: { type: String, required: true },
  website: String,
  priceRange: {
    type: String,
    enum: ["10-15", "15-20", "20+"],
    default: "15-20"
  },
  cuisineType: {
    type: String,
    enum: [
      "Italiana",
      "Giapponese",
      "Cinese",
      "Messicana",
      "Indiana",
      "Vegetariana",
      "Internazionale",
      "Altro"
    ],
    set: v => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(), // normalizza input
    default: "Altro"
  },
  image: {
    url: String,
    filename: String,
  },
  approved: { type: Boolean, default: false },
}, { timestamps: true });

export default model('Restaurant', restaurantSchema);