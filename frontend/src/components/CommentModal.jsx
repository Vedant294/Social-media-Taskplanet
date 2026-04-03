import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from './Avatar.jsx';
import api from '../api/axios.js';
import { formatDate } from '../utils/formatDate.js';

export default function CommentModal({ show, onHide, post, onCommentAdded }) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localComments, setLocalComments] = useState(post?.comments || []);

  // Sync when post changes
  React.useEffect(() => {
    setLocalComments(post?.comments || []);
  }, [post?._id]);

  const handleSubmit = async () => {
    if (!commentText.trim()) return;
    setIsSubmitting(true);

    // Optimistic update
    const optimistic = {
      _id: Date.now().toString(),
      userId: user._id,
      username: user.username,
      name: user.name,
      avatar: user.avatar || '',
      text: commentText.trim(),
      createdAt: new Date().toISOString(),
    };
    setLocalComments(prev => [...prev, optimistic]);
    const prevText = commentText;
    setCommentText('');

    try {
      const { data } = await api.post(`/posts/${post._id}/comment`, { text: prevText.trim() });
      // Replace optimistic with real comment
      setLocalComments(prev =>
        prev.map(c => c._id === optimistic._id ? data.comment : c)
      );
      onCommentAdded(post._id, data.commentsCount);
      toast.success('Comment added!');
    } catch (err) {
      // Revert optimistic
      setLocalComments(prev => prev.filter(c => c._id !== optimistic._id));
      setCommentText(prevText);
      toast.error(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable className="comment-modal">
      <Modal.Header closeButton>
        <Modal.Title className="comment-modal-title">
          💬 Comments ({localComments.length})
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="comment-modal-body">
        {localComments.length === 0 ? (
          <div className="empty-comments">
            <div className="empty-icon">💭</div>
            <p>No comments yet. Be the first!</p>
          </div>
        ) : (
          <div className="comments-list">
            {localComments.map(comment => (
              <div key={comment._id} className="comment-item">
                <Avatar src={comment.avatar} name={comment.name} size={36} />
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-name">{comment.name}</span>
                    <span className="comment-username">@{comment.username}</span>
                    <span className="comment-time">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="comment-modal-footer">
        <Avatar src={user?.avatar} name={user?.name || ''} size={36} />
        <input
          type="text"
          className="comment-input"
          placeholder="Write a comment..."
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={500}
        />
        <button
          className="btn-send-comment"
          onClick={handleSubmit}
          disabled={isSubmitting || !commentText.trim()}
        >
          {isSubmitting
            ? <span className="spinner-border spinner-border-sm" />
            : '➤'}
        </button>
      </Modal.Footer>
    </Modal>
  );
}
