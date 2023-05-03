import mongoose from 'mongoose';
const { Schema } = mongoose;

export const postsSchema = new Schema({
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: { type: String, require: false },
    extendedLikesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        myStatus: String,
        newestLikes: [],
    }
}, { timestamps: true });

postsSchema.method('toJSON', function() {
    // @ts-ignore
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    delete object._id;
    delete object.__v;
    return object;
});

export type PostInputT = {
    name: string,
    description: string,
    websiteUrl: string,
    isMembership?: boolean
    blogName?: string,
    extendedLikesInfo?: {
        likesCount?: number,
        dislikesCount?: number,
        myStatus?: string,
        newestLikes?: Array<any>,
    }
}
export const Post = mongoose.model('Post', postsSchema);
