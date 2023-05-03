import mongoose from 'mongoose';
const { Schema } = mongoose;

export const blogSchema = new Schema({
    name: String,
    description: String,
    websiteUrl: String,
    isMembership: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

blogSchema.method('toJSON', function() {
    // @ts-ignore
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    delete object._id;
    delete object.__v;
    return object;
});

export type BlogInputT = {
    name: string,
    description: string,
    websiteUrl: string,
    isMembership?: boolean
}
export const Blog = mongoose.model('Blog', blogSchema);
