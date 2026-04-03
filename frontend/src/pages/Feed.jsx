import React, { useState, useEffect, useCallback, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar.jsx';
import CreatePost from '../components/CreatePost.jsx';
import PostCard from '../components/PostCard.jsx';
import FeedFilter from '../components/FeedFilter.jsx';
import SearchBar from '../components/SearchBar.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import CommentModal from '../components/CommentModal.jsx';
import HeroBanner from '../components/HeroBanner.jsx';
import TrendingPanel from '../components/TrendingPanel.jsx';
import api from '../api/axios.js';

// Lightweight confetti burst
function spawnConfetti() {
  const colors = ['#1D6AFF','#10B981','#F59E0B','#EF4444','#8B5CF6','#EC4899'];
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden';
  document.body.appendChild(container);
  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    const size = 6 + Math.random() * 8;
    el.style.cssText = `
      position:absolute;
      width:${size}px;height:${size}px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      border-radius:${Math.random()>0.5?'50%':'2px'};
      left:${20+Math.random()*60}%;
      top:-10px;
      opacity:1;
      transition:transform ${1+Math.random()}s ease-out, opacity ${1+Math.random()}s ease-out;
    `;
    container.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translateY(${300+Math.random()*400}px) rotate(${Math.random()*720}deg) translateX(${(Math.random()-0.5)*200}px)`;
      el.style.opacity = '0';
    });
  }
  setTimeout(() => document.body.removeChild(container), 2500);
}

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [totalPosts, setTotalPosts] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchPosts = useCallback(async (pageNum, currentFilter, currentSearch, reset = false) => {
    try {
      const { data } = await api.get('/posts', {
        params: { page: pageNum, limit: 10, filter: currentFilter, search: currentSearch },
      });
      if (reset) {
        setPosts(data.posts);
      } else {
        setPosts(prev => [...prev, ...data.posts]);
      }
      setHasMore(data.pagination.hasNextPage);
      setTotalPosts(data.pagination.totalPosts);
    } catch (err) {
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    fetchPosts(1, filter, search, true);
  }, [filter, search]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage, filter, search, false);
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    setTotalPosts(prev => prev + 1);
    spawnConfetti();
  };

  const handleLike = async (postId) => {
    await api.put(`/posts/${postId}/like`);
  };

  const handleOpenComment = (post, onCountUpdate) => {
    setSelectedPost({ ...post, _onCountUpdate: onCountUpdate });
    setShowModal(true);
  };

  const handleCommentAdded = (postId, newCount) => {
    setPosts(prev =>
      prev.map(p => p._id === postId ? { ...p, commentsCount: newCount } : p)
    );
    if (selectedPost?._onCountUpdate) {
      selectedPost._onCountUpdate(postId, newCount);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/posts/${postId}`);
      setPosts(prev => prev.filter(p => p._id !== postId));
      setTotalPosts(prev => prev - 1);
      toast.success('Post deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleTagClick = (tag) => {
    setSearch(tag.replace('#', ''));
  };

  return (
    <>
      <Navbar />
      <div className="feed-page">
        <HeroBanner postCount={totalPosts} />

        <div className="feed-layout">
          {/* Main feed column */}
          <div className="feed-main">
            <SearchBar onSearch={setSearch} />
            <CreatePost onPostCreated={handlePostCreated} />
            <FeedFilter activeFilter={filter} onFilterChange={setFilter} />

            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <InfiniteScroll
                dataLength={posts.length}
                next={loadMore}
                hasMore={hasMore}
                loader={<SkeletonCard />}
                endMessage={
                  <p className="feed-end-message">🎉 You've seen all posts!</p>
                }
              >
                {posts.length === 0 ? (
                  <div className="empty-feed">
                    <div className="empty-feed-icon">✨</div>
                    <h5 className="empty-feed-title">Nothing here yet</h5>
                    <p className="empty-feed-sub">Be the first to share something with the world!</p>
                    <button
                      className="empty-feed-cta"
                      onClick={() => document.querySelector('.create-post-input')?.focus()}
                    >
                      Create your first post →
                    </button>
                  </div>
                ) : (
                  posts.map((post, index) => (
                    <div key={post._id} style={{ animationDelay: `${Math.min(index, 7) * 0.05}s` }}>
                      <PostCard
                        post={post}
                        onLike={handleLike}
                        onComment={handleOpenComment}
                        onDelete={handleDelete}
                      />
                    </div>
                  ))
                )}
              </InfiniteScroll>
            )}
          </div>

          {/* Sidebar */}
          <div className="feed-sidebar">
            <TrendingPanel onTagClick={handleTagClick} />
          </div>
        </div>
      </div>

      {selectedPost && (
        <CommentModal
          show={showModal}
          onHide={() => setShowModal(false)}
          post={selectedPost}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </>
  );
}
