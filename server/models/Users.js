import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        min: 6,
        max: 8,
        required: true,
        select: false
    }
},
    {
        timestamps: true
    });

export default User = mongoose.model("User", userSchema);