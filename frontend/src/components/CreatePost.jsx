import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from './Avatar.jsx';
import api from '../api/axios.js';

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef();

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!text.trim() && !imageFile) {
      toast.error('Add some text or an image to post.');
      return;
    }
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (text.trim()) formData.append('text', text.trim());
      if (imageFile)   formData.append('image', imageFile);

      const { data } = await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onPostCreated(data.post);
      setText('');
      removeImage();
      toast.success('Post shared! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-card">
      <div className="create-post-top">
        <Avatar src={user?.avatar} name={user?.name || ''} size={42} />
        <textarea
          className="create-post-input"
          placeholder="What's on your mind?"
          value={text}
          onChange={e => setText(e.target.value)}
          maxLength={2200}
          rows={text.length > 80 ? 4 : 2}
        />
      </div>

      {/* Character count */}
      {text.length > 0 && (
        <div className="char-count">{text.length}/2200</div>
      )}

      {/* Image preview */}
      {imagePreview && (
        <div className="image-preview-wrapper">
          <img src={imagePreview} alt="preview" className="image-preview" />
          <button className="remove-image-btn" onClick={removeImage}>✕</button>
        </div>
      )}

      {/* Actions row */}
      <div className="create-post-actions">
        <div className="create-post-tools">
          <button
            className="tool-btn"
            onClick={() => fileInputRef.current.click()}
            title="Add photo"
          >
            📷 Photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageSelect}
          />
        </div>
        <button
          className="btn-post"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="spinner-border spinner-border-sm me-1" />
          ) : null}
          Post →
        </button>
      </div>
    </div>
  );
}
