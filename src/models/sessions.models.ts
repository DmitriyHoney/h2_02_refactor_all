import mongoose from 'mongoose';
const { Schema } = mongoose;

export const sessionsSchema = new Schema({
    ip: String,
    title: String,
    lastActiveDate: {
        type: Date,
        required: false,
    },
    deviceId: String,
    userId: String,
}, { timestamps: true });

sessionsSchema.method('toJSON', function() {
    // @ts-ignore
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    delete object._id;
    delete object.__v;
    return object;
});

sessionsSchema.pre('save', function(next) {
    this.lastActiveDate = new Date();
    next();
});

export type SessionPostT = {
    ip: string,
    userAgent: string,
    userId: string,
}

export const Session = mongoose.model('Session', sessionsSchema);
