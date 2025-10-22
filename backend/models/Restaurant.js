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
  image: {
    path: String,
    filename: String,
  },
  approved: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default model('Restaurant', restaurantSchema);