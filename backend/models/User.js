// backend/models/User.js
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
  type: String,
  select: false,
  required: function() {
    if (this.googleId) {
      return false; 
    }
    return true; 
  }
},
    role: {
      type: String,
      enum: ['user', 'admin', 'superadmin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

export default model('User', userSchema);