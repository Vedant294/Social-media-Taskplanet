import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from './Avatar.jsx';
import { formatDate } from '../utils/formatDate.js';
import { parseHashtags } from '../utils/parseHashtags.jsx';

export default function PostCard({ post, onLike, onComment, onDelete }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount ?? post.likes?.length ?? 0);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount ?? post.comments?.length ?? 0);
  const [likeAnimating, setLikeAnimating] = useState(false);

  const isAuthor = user?._id === post.author?.userId?.toString() ||
                   user?._id === post.author?.userId;

  const handleLike = async () => {
    // Optimistic update
    const prevLiked = liked;
    const prevCount = likesCount;
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    setLikeAnimating(true);
    setTimeout(() => setLikeAnimating(false), 400);

    try {
      await onLike(post._id);
    } catch (_) {
      // Revert on failure
      setLiked(prevLiked);
      setLikesCount(prevCount);
    }
  };

  const handleCommentCountUpdate = (postId, newCount) => {
    setCommentsCount(newCount);
  };

  return (
    <div className="post-card">
      {/* Header */}
      <div className="post-card-header">
        <div className="post-author-info">
          <Avatar src={post.author?.avatar} name={post.author?.name || ''} size={44} />
          <div className="post-author-text">
            <span className="post-author-name">{post.author?.name}</span>
            <span className="post-author-meta">
              @{post.author?.username} · {formatDate(post.createdAt)}
            </span>
          </div>
        </div>
        <div className="post-header-right">
          <button className="follow-btn">Follow</button>
          {isAuthor && (
            <Dropdown align="end">
              <Dropdown.Toggle as="button" className="post-menu-btn" bsPrefix="post-menu-btn">
                ···
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  className="text-danger"
                  onClick={() => onDelete(post._id)}
                >
                  🗑 Delete
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </div>

      {/* Body */}
      {post.text && (
        <p className="post-text">{parseHashtags(post.text)}</p>
      )}
      {post.image && (
        <img src={post.image} alt="post" className="post-image" loading="lazy" />
      )}

      {/* Actions */}
      <div className="post-actions">
        <button
          className={`action-btn like-btn ${liked ? 'liked' : ''} ${likeAnimating ? 'pop' : ''}`}
          onClick={handleLike}
        >
          {liked ? '❤️' : '🤍'} {likesCount}
        </button>
        <button
          className="action-btn comment-btn"
          onClick={() => onComment(post, handleCommentCountUpdate)}
        >
          💬 {commentsCount}
        </button>
      </div>
    </div>
  );
}
