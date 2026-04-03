import express from 'express';
import Post from '../models/Post.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

/**
 * @route  GET /api/posts
 * @desc   Get paginated posts with optional filter and search
 * @access Public (token optional — used to compute isLiked)
 */
router.get('/', async (req, res, next) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page)  || 1);
    const limit  = Math.min(20, Math.max(5, parseInt(req.query.limit) || 10));
    const filter = req.query.filter || 'all';
    const search = req.query.search?.trim() || '';

    // Get current user id from token if provided (optional auth)
    let currentUserId = null;
    try {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        const jwt = await import('jsonwebtoken');
        const decoded = jwt.default.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
        currentUserId = decoded._id;
      }
    } catch (_) { /* token invalid or missing — that's fine */ }

    // Build match query
    let matchQuery = {};
    if (search) {
      matchQuery = {
        $or: [
          { text: { $regex: search, $options: 'i' } },
          { 'author.username': { $regex: search, $options: 'i' } },
          { 'author.name': { $regex: search, $options: 'i' } },
        ],
      };
    }

    // Sort logic
    let sortObj = { createdAt: -1 };
    if (filter === 'mostLiked')     sortObj = { likesCount: -1, createdAt: -1 };
    if (filter === 'mostCommented') sortObj = { commentsCount: -1, createdAt: -1 };

    const aggregationPipeline = [
      { $match: matchQuery },
      {
        $addFields: {
          likesCount:    { $size: '$likes' },
          commentsCount: { $size: '$comments' },
          // Compute isLiked server-side if user is authenticated
          isLiked: currentUserId
            ? {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: '$likes',
                        as: 'like',
                        cond: { $eq: [{ $toString: '$$like.userId' }, currentUserId.toString()] },
                      },
                    },
                  },
                  0,
                ],
              }
            : false,
        },
      },
      { $sort: sortObj },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const [posts, totalPosts] = await Promise.all([
      Post.aggregate(aggregationPipeline),
      Post.countDocuments(matchQuery),
    ]);

    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      success: true,
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (err) { next(err); }
});

/**
 * @route  POST /api/posts
 * @desc   Create a new post (text, image, or both)
 * @access Protected
 */
router.post('/', protect, upload.single('image'), async (req, res, next) => {
  try {
    const { text } = req.body;
    const image = req.file?.path || '';

    if (!text?.trim() && !image) {
      return res.status(400).json({ success: false, message: 'Post must have text or image' });
    }

    const post = await Post.create({
      author: {
        userId:   req.user._id,
        name:     req.user.name,
        username: req.user.username,
        avatar:   req.user.avatar || '',
      },
      text:  text?.trim() || '',
      image,
    });

    res.status(201).json({ success: true, post });
  } catch (err) { next(err); }
});

/**
 * @route  PUT /api/posts/:id/like
 * @desc   Toggle like on a post
 * @access Protected
 */
router.put('/:id/like', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const alreadyLiked = post.likes.some(
      l => l.userId.toString() === req.user._id.toString()
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(l => l.userId.toString() !== req.user._id.toString());
    } else {
      post.likes.push({ userId: req.user._id, username: req.user.username });
    }

    await post.save();

    res.json({
      success: true,
      liked: !alreadyLiked,
      likesCount: post.likes.length,
      likes: post.likes,
    });
  } catch (err) { next(err); }
});

/**
 * @route  POST /api/posts/:id/comment
 * @desc   Add a comment to a post
 * @access Protected
 */
router.post('/:id/comment', protect, async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    post.comments.push({
      userId:   req.user._id,
      username: req.user.username,
      name:     req.user.name,
      avatar:   req.user.avatar || '',
      text:     text.trim(),
    });

    await post.save();

    const savedComment = post.comments[post.comments.length - 1];
    res.status(201).json({
      success: true,
      comment: savedComment,
      commentsCount: post.comments.length,
    });
  } catch (err) { next(err); }
});

/**
 * @route  DELETE /api/posts/:id
 * @desc   Delete a post (author only)
 * @access Protected
 */
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    if (post.author.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (err) { next(err); }
});

export default router;
