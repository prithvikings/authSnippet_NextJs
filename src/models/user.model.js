import mongoose from 'mongoose';
import { isAbsolute } from 'path';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  forgotPasswordToken: { type: String, default: null },
  forgotPasswordExpiry: { type: Date, default: null },
  verifyToken: { type: String, default: null },
  verifyTokenExpiry: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.users ||mongoose.model('users', userSchema);

export default User;