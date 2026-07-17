import mongoose from 'mongoose';
import { hashPassword, comparePassword } from '../utils/password.util.js';

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        password: { type: String, required: true },
        profilePicture: { type: String },
        verified: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await hashPassword(this.password);
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return comparePassword(candidatePassword, this.password);
};

const userModel = mongoose.model('User', userSchema);
export default userModel;
