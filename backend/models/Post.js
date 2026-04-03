import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  name:     { type: String, required: true },
  avatar:   { type: String, default: '' },
  text:     { type: String, required: true, trim: true, maxlength: [500, 'Comment too long'] },
}, { timestamps: true });

const likeSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
}, { _id: false });

const postSchema = new mongoose.Schema({
  // Denormalized author info — avoids populate on every feed load
  author: {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name:     { type: String, required: true },
    username: { type: String, required: true },
    avatar:   { type: String, default: '' },
  },
  text:     { type: String, trim: true, maxlength: [2200, 'Post text cannot exceed 2200 characters'], default: '' },
  image:    { type: String, default: '' }, // Cloudinary secure_url
  likes:    { type: [likeSchema], default: [] },
  comments: { type: [commentSchema], default: [] },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// At least text or image must be present
postSchema.pre('validate', function (next) {
  if (!this.text && !this.image) {
    this.invalidate('text', 'Post must have text or image');
  }
  next();
});

postSchema.index({ createdAt: -1 });
postSchema.index({ 'author.userId': 1, createdAt: -1 });

export default mongoose.model('Post', postSchema);
