import mongoose from 'mongoose';
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const adminSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String
    },
    password: {
        type: String,
        required: true
    }
});


adminSchema.methods.isValidPassword = async function (password) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      throw new Error(error);
    }
  };

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
