import { model, Schema } from 'mongoose';

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    trim: true,
  },
  description: {
    type: String,
    maxlength: 500,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 30,
  },
  region: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 30,
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,
      'Please fill a valid email address',
    ],
  },
  website: {
    type: String,
    trim: true,
  },
  image: {
    type: {
      path: String,
      filename: String,
    },
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Restaurant = model('Restaurant', restaurantSchema);

export default Restaurant;
