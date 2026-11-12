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
    // "20+" resta per i documenti già salvati
    enum: ["10-15", "15-20", "20-30", "30+", "20+"],
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
    // normalizza input; vuoto/non stringa -> "Altro"
    set: v =>
      typeof v === "string" && v.trim()
        ? v.trim().charAt(0).toUpperCase() + v.trim().slice(1).toLowerCase()
        : "Altro",
    default: "Altro"
  },
  image: {
    url: String,
    filename: String,
  },
  approved: { type: Boolean, default: false },
}, { timestamps: true });

export default model('Restaurant', restaurantSchema);