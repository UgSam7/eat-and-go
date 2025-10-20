import { model, Schema } from 'mongoose';

const restaurantSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    address: {
        street: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        zipCode: { type: String, trim: true },
        },
    cuisineType: {
        type: String,
        trim: true,
        enum: ['Italian', 'Chinese', 'Japanese', 'Indian', 'Fusion', 'Other'],
        default: 'Other',
    },
    hasLunchMenu: {
        type: Boolean,
        default: false,
    },
    lunchMenu: {
        availableDays: [{ 
            type: String, 
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] 
        }],
        price: { type: Number, min: 0 },
        description: { type: String, trim: true },
    },
    openingHours: {
        monday: { open: String, close: String },
        tuesday: { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday: { open: String, close: String },
        friday: { open: String, close: String },
        saturday: { open: String, close: String },
        sunday: { open: String, close: String },
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    image: {
    url: {
        type: String,
        default: 'https://res.cloudinary.com/ddjz4orm4/image/upload/v1760621985/immagine-non-disponibile_nkji05.jpg',
    },
    public_id: {
        type: String,
        default: null, // sarà null se si usa l'immagine di default
    },
},

});

const Restaurant = model('Restaurant', restaurantSchema);

export default Restaurant;
