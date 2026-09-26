import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  MessageSquare,
  Heart,
  Send,
  Sparkles,
  Award,
  TrendingUp
} from 'lucide-react';

export const CommunityView: React.FC = () => {
  const {
    posts,
    submitNewPost,
    likePost,
    commentOnPost,
    user,
    showToast,
  } = useApp();

  const [postContent, setPostContent] = useState<string>('');
  const [postCategory, setPostCategory] = useState<
    'Workouts' | 'Nutrition' | 'Motivation' | 'Milestone' | 'Questions'
  >('Workouts');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});
  const [expandedComments, setExpandedComments] = useState<{ [postId: string]: boolean }>({});

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) {
      showToast('Please enter some text before posting.');
      return;
    }
    setIsSubmitting(true);
    const success = await submitNewPost(postCategory, postContent);
    if (success) {
      setPostContent('');
    }
    setIsSubmitting(false);
  };

  const handleCommentSubmit = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    await commentOnPost(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setExpandedComments((prev) => ({ ...prev, [postId]: true }));
  };

  const toggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const filteredPosts =
    selectedFilter === 'All'
      ? posts
      : posts.filter((p) => p.category === selectedFilter);

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4 sm:py-6 pb-12">
      {/* Icon Header (Fig 4.2.4 Bottom) */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-xl bg-[#f5ebe1] text-[#965732] flex items-center justify-center border border-[#e4d3c3]">
            <Users className="w-5 h-5 text-[#965732]" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#8d522e] tracking-tight font-['Outfit',sans-serif]">
          FitTrack Pro Community
        </h1>
        <p className="text-xs sm:text-sm text-[#7d6c60] max-w-xl mx-auto">
          Connect, share your journey, and find motivation with fellow fitness enthusiasts.
        </p>
      </div>

      {/* "Create a New Post" Card (Fig 4.2.4) */}
      <div className="bg-[#fdfbf7] rounded-2xl shadow-xs border border-[#e2d8c9] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#eee4d6] bg-[#f8f4ec]">
          <h2 className="text-base font-bold text-[#8d522e] font-['Outfit',sans-serif]">
            Create a New Post
          </h2>
          <p className="text-xs text-[#7d6c60] mt-0.5">
            Share your thoughts, progress, or questions with the community.
          </p>
        </div>

        <form onSubmit={handlePostSubmit} className="p-6 space-y-4">
          <div>
            <textarea
              rows={3}
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder={`What's on your mind, ${user.name}?`}
              className="w-full px-3.5 py-2.5 bg-[#f6f2ea] border border-[#dcd1c2] rounded-xl text-xs sm:text-sm text-[#3e342d] focus:bg-white focus:ring-1 focus:ring-[#cf784d] focus:outline-none transition"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-medium text-[#7d6c60] mr-1">Category:</span>
              {(['Workouts', 'Nutrition', 'Motivation', 'Milestone', 'Questions'] as const).map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setPostCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition border ${
                      postCategory === cat
                        ? 'bg-[#cf784d] text-white border-[#cf784d] shadow-xs'
                        : 'bg-white text-[#7d6c60] border-[#dcd1c2] hover:bg-[#f6f2ea]'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !postContent.trim()}
              className="px-5 py-2 bg-[#d48c66] hover:bg-[#c67e58] text-white text-xs font-semibold rounded-xl shadow-xs transition disabled:opacity-50 flex items-center justify-center space-x-1.5 self-end sm:self-auto"
            >
              <span>{isSubmitting ? 'Posting...' : 'Post'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-[#e2d8c9] pb-3">
        <h2 className="text-lg font-bold text-[#8d522e] font-['Outfit',sans-serif]">
          Recent Activity
        </h2>

        <div className="flex items-center space-x-1 overflow-x-auto text-xs">
          {['All', 'Workouts', 'Nutrition', 'Motivation', 'Milestone', 'Questions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedFilter(tab)}
              className={`px-2.5 py-1 rounded-lg font-medium transition ${
                selectedFilter === tab
                  ? 'bg-[#ab7a52] text-white'
                  : 'text-[#7d6c60] hover:bg-[#f6f2ea]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const hasLiked = post.likedBy?.includes(user.id);
          const isCommentsOpen = expandedComments[post.id] ?? false;

          return (
            <div
              key={post.id}
              className="bg-[#fdfbf7] rounded-2xl p-5 sm:p-6 border border-[#e2d8c9] space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-[#c98059] text-white font-bold text-xs flex items-center justify-center">
                    {post.authorName.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-[#4e3e34] text-xs sm:text-sm block">
                      {post.authorName}
                    </span>
                    <span className="text-[11px] text-[#8d7c70]">
                      {post.timestamp}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-semibold bg-[#f6f2ea] text-[#7d6c60] px-2.5 py-0.5 rounded-full border border-[#e5dcce]">
                  {post.category}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#635348] leading-relaxed">
                {post.content}
              </p>

              <div className="flex items-center space-x-4 pt-2 border-t border-[#eee5d8] text-xs">
                <button
                  onClick={() => likePost(post.id)}
                  className={`flex items-center space-x-1.5 py-1 px-2 rounded-lg transition ${
                    hasLiked ? 'text-[#b8533e] font-semibold' : 'text-[#7d6c60] hover:text-[#4e3e34]'
                  }`}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${hasLiked ? 'fill-[#b8533e]' : ''}`}
                  />
                  <span>{post.likes}</span>
                </button>

                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center space-x-1.5 py-1 px-2 rounded-lg text-[#7d6c60] hover:text-[#4e3e34] transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{post.comments.length}</span>
                </button>
              </div>

              {isCommentsOpen && (
                <div className="pt-2 border-t border-[#eee5d8] space-y-2.5 text-xs animate-in fade-in">
                  {post.comments.map((comm) => (
                    <div key={comm.id} className="bg-[#f8f4ec] p-2.5 rounded-xl space-y-0.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#4e3e34]">{comm.author}</span>
                        <span className="text-[#8d7c70]">{comm.timestamp}</span>
                      </div>
                      <p className="text-[#635348]">{comm.text}</p>
                    </div>
                  ))}

                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCommentSubmit(post.id);
                        }
                      }}
                      placeholder="Write a supportive reply..."
                      className="flex-1 px-3 py-1.5 bg-[#f6f2ea] border border-[#dcd1c2] rounded-lg text-xs focus:outline-none focus:bg-white"
                    />
                    <button
                      onClick={() => handleCommentSubmit(post.id)}
                      className="px-3 py-1.5 bg-[#cf784d] hover:bg-[#c26d43] text-white rounded-lg text-xs font-semibold"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
