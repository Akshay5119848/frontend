import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/axios';
import { 
  MessageCircle, 
  Edit3, 
  Trash2, 
  User, 
  Send,
  X,
  Check
} from 'lucide-react';

const Comments = ({ videoId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Use ref to prevent multiple simultaneous requests
  const isRequesting = useRef(false);

  // Debug user authentication state
  useEffect(() => {
    console.log('Comments component - User state:', user);
    console.log('Comments component - Video ID:', videoId);
    console.log('Comments component - Token:', localStorage.getItem('token'));
  }, [user, videoId]);

  const fetchComments = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (isRequesting.current) return;
    
    try {
      isRequesting.current = true;
      console.log('Fetching comments for video:', videoId);
      
      const response = await api.get(`/comments/video/${videoId}`);
      console.log('Comments fetched:', response.data);
      setComments(response.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
      console.error('Error details:', err.response?.data);
    } finally {
      isRequesting.current = false;
    }
  }, [videoId]);

  useEffect(() => {
    fetchComments();
  }, [videoId, fetchComments]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
  
    try {
      setLoading(true);
  
      const tempComment = {
        _id: `temp-${Date.now()}`,
        videoId,
        userId: user._id,
        username: user.username || 'You',
        avatar: user.avatar || '',
        text: newComment.trim(),
        createdAt: new Date().toISOString()
      };
  
      // Optimistically add to UI
      setComments(prev => [tempComment, ...prev]);
      setNewComment('');
  
      const response = await api.post('/comments', {
        videoId,
        text: tempComment.text,
        username: tempComment.username,
        avatar: tempComment.avatar
      });
  
      // Replace temp comment with real one from backend
      setComments(prev =>
        prev.map(c => c._id === tempComment._id ? response.data : c)
      );
  
      // Optional: fetch full updated list
      fetchComments();
  
    } catch (err) {
      console.error('Error posting comment:', err);
      alert(`Failed to post comment: ${err.response?.data?.message || err.message}`);
      // Rollback optimistic UI
      setComments(prev => prev.filter(c => !c._id.startsWith('temp-')));
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      await api.put(`/comments/${commentId}`, { text: editText.trim() });

      setComments(comments.map(comment => 
        comment._id === commentId 
          ? { ...comment, text: editText.trim() }
          : comment
      ));
      setEditingComment(null);
      setEditText('');
    } catch (err) {
      console.error('Error editing comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await api.delete(`/comments/${commentId}`);

      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const startEditing = (comment) => {
    setEditingComment(comment._id);
    setEditText(comment.text);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditText('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-youtube-gray rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="w-6 h-6 text-gray-400" />
        <h3 className="text-lg font-medium text-white">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      {user && (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex space-x-3">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-400" />
              </div>
            )}
            
            <div className="flex-1">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full input-field"
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={!newComment.trim() || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex space-x-3">
              {comment.avatar ? (
                <img
                  src={comment.avatar}
                  alt={comment.username}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1">
                {editingComment === comment._id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full input-field"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditComment(comment._id)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-white">{comment.username}</span>
                      <span className="text-sm text-gray-400">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    
                    <p className="text-gray-300 mb-2">{comment.text}</p>
                    
                    {/* Comment Actions */}
                    {user && user._id === comment.userId && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditing(comment)}
                          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-sm text-gray-400 hover:text-red-400 transition-colors flex items-center space-x-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;
