//model/user.js

import mongoose from "mongoose";

//user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        select: false //do not return password field in queries
    },
    role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  } 
   
}

);

// Create model
const User = mongoose.model("User", userSchema);

// Export model
export default User;