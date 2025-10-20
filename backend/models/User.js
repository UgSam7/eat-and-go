import { model, Schema } from 'mongoose';

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true, 
        minlength: 2, 
        maxlength: 15, 
    },
    lastName: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 15,
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        lowercase: true, 
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,
            'Please fill a valid email address',
        ], 
    },
    password: {
        type: String,
        select: false, 
    },
    profile: {
        type: {
            path: String,
            filename: String,
        },
    },
    googleId: String,
    facebookId: String,
});

const User = model('User', userSchema);

export default User;