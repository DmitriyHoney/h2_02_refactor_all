import mongoose from 'mongoose';
import {hashPassword} from "../helpers";
const { Schema } = mongoose;

export const userSchema = new Schema({
    login: {
        type: String,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
    },
    password: String,
    confirmedInfo: {
        isConfirmedEmail: { type: Boolean, default: true },
        code: { type: String, default: '' },
    }
}, { timestamps: true });

userSchema.method('toJSON', function() {
    // @ts-ignore
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    delete object._id;
    delete object.__v;
    return object;
});

userSchema.pre('save', async function(next) {
    if (!this.isNew && !this.isModified('password')) return next();
    try {
        if (!this.password) return next();
        this.password = await hashPassword(this.password);
        return next();
    } catch {
        return next();
    }
});

export type UserPostT = {
    login: string,
    password: string,
    email: string,
    confirmedInfo?: {
        isConfirmedEmail: boolean,
        code: string,
    }
}

export type UserUpdateT = {
    login?: string,
    email?: string,
    confirmedInfo?: {
        isConfirmedEmail?: boolean,
        code?: string,
    }
}

export const User = mongoose.model('User', userSchema);
