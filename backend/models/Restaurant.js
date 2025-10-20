import mongoose from 'mongoose';
const { model, models, Schema } = mongoose;

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
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
  },
  region: {
    type: String,
    required: true,
    trim: true,
  },
  cuisine: {
    type: String,
    required: false,
    trim: true,
  },
  phone: {
    type: String,
    required: false,
    trim: true,
  },
  website: {
    type: String,
    required: false,
    trim: true,
  },
  userAdded: {  // chi ha segnalato il ristorante (riferimento User)
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Restaurant = models.Restaurant || model('Restaurant', restaurantSchema);

export default Restaurant;
