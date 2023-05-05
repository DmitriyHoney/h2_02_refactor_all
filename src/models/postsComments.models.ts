import mongoose from 'mongoose';
const { Schema } = mongoose;

export const postsCommentsSchema = new Schema({
    content: String,
    postId: String,
    commentatorInfo: {
        userId: {
            type: String,
        },
        userLogin: {
            type: String,
        }
    },
    likesInfo: {
        likesCount: {
            type: Number,
            default: 0,
            required: false
        },
        dislikesCount: {
            type: Number,
            default: 0,
            required: false
        },
        usersStatistics: {
            type: Object,
            default: {},
            required: false
        },
    }
}, { timestamps: true });

postsCommentsSchema.method('toJSON', function() {
    // @ts-ignore
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    delete object._id;
    delete object.__v;
    return object;
});

export type PostCommentBodyT = {
    content: string,
}
export const PostComment = mongoose.model('PostComment', postsCommentsSchema);
