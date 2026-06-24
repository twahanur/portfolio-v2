"use client";

/* eslint-disable react/no-unknown-property */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { MessageCircle, UserCircle2, Loader2, AlertCircle, Send, ImagePlus, X, User, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Comment = memo(({ comment, formatDate, index }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="px-4 py-4 rounded-xl bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200/50 dark:hover:bg-white/10 transition-all group hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden"
    >
        {/* Hover Border Accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#6366f1] to-[#a855f7] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="flex items-start gap-3">
            {comment.profileImage ? (
                <img
                    src={comment.profileImage}
                    alt={`${comment.userName}'s profile`}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#6366f1]/30 group-hover:border-[#6366f1] transition-all duration-300"
                    loading="lazy"
                />
            ) : (
                <div className="p-2 rounded-full bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20 group-hover:bg-[#6366f1]/20 transition-colors">
                    <UserCircle2 className="w-5 h-5" />
                </div>
            )}
            <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-4 mb-1.5">
                    <h4 className="font-semibold text-slate-800 dark:text-white truncate text-sm">
                        {comment.userName}
                    </h4>
                    <span className="text-[11px] text-slate-500 dark:text-gray-400 whitespace-nowrap">
                        {formatDate(comment.createdAt)}
                    </span>
                </div>
                <p className="text-slate-600 dark:text-gray-300 text-sm break-words leading-relaxed">
                    {comment.content}
                </p>
            </div>
        </div>
    </motion.div>
));

const CommentForm = memo(({ onSubmit, isSubmitting, error }) => {
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) return;
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    }, []);

    const handleTextareaChange = useCallback((e) => {
        setNewComment(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, []);

    const handleRemoveImage = useCallback((e) => {
        e.stopPropagation();
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!newComment.trim() || !userName.trim()) return;
        
        onSubmit({ newComment, userName, imageFile });
        setNewComment('');
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }, [newComment, userName, imageFile, onSubmit]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1000">
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
                    Name <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                    <User className="absolute left-4 top-4 w-5 h-5 text-slate-400 dark:text-gray-400 group-focus-within:text-[#6366f1] group-focus-within:scale-110 transition-all duration-300" />
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Enter your name"
                        className="w-full p-4 pl-12 bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 focus:border-[#6366f1]/50 focus:bg-white/10 dark:focus:bg-white/10 transition-all duration-300"
                        required
                    />
                </div>
            </div>

            {/* Comment Message Input */}
            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1200">
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
                    Message <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-400 dark:text-gray-400 group-focus-within:text-[#6366f1] group-focus-within:scale-110 transition-all duration-300" />
                    <textarea
                        ref={textareaRef}
                        value={newComment}
                        onChange={handleTextareaChange}
                        placeholder="Write your message here..."
                        className="w-full p-4 pl-12 bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 focus:border-[#6366f1]/50 focus:bg-white/10 dark:focus:bg-white/10 transition-all duration-300 resize-none min-h-[120px]"
                        required
                    />
                </div>
            </div>

            {/* Profile Avatar Uploader */}
            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1400">
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
                    Profile Photo <span className="text-slate-400 dark:text-gray-500">(Optional)</span>
                </label>
                <div className="flex flex-col items-center justify-center gap-3 p-5 bg-slate-100/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                    />
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="relative group/avatar cursor-pointer transition-all duration-300"
                    >
                        {imagePreview ? (
                            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#6366f1] hover:border-red-400 transition-all duration-300 shadow-md">
                                <img
                                    src={imagePreview}
                                    alt="Profile preview"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                                    <X className="w-6 h-6 text-white hover:scale-115 transition-transform" onClick={handleRemoveImage} />
                                </div>
                            </div>
                        ) : (
                            <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 dark:border-white/20 flex flex-col items-center justify-center bg-slate-200/50 dark:bg-white/5 hover:border-[#6366f1]/50 hover:bg-[#6366f1]/5 transition-all duration-300 text-slate-400 dark:text-gray-400 hover:text-[#6366f1]">
                                <ImagePlus className="w-6 h-6 mb-1" />
                                <span className="text-[10px] font-medium text-center">Add Photo</span>
                            </div>
                        )}
                    </div>
                    <span className="text-[11px] text-slate-400 dark:text-gray-500">
                        {imagePreview ? "Click avatar to change" : "JPG, PNG (Max 5MB)"}
                    </span>
                </div>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                data-aos="fade-up"
                data-aos-duration="1000"
                className="relative w-full h-12 bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl font-medium text-white overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Posting...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            <span>Post Comment</span>
                        </>
                    )}
                </div>
            </button>
        </form>
    );
});

const Komentar = ({ isTabbed = false }) => {
    const [comments, setComments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const fetchComments = useCallback(async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
            const res = await fetch(`${apiUrl}/api/comments`);
            if (res.ok) {
                const payload = await res.json();
                if (payload.success) {
                    setComments(payload.data);
                }
            }
        } catch (err) {
            console.error("Failed to fetch comments:", err);
        }
    }, []);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const uploadImage = useCallback(async (imageFile) => {
        if (!imageFile) return null;
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
            const formData = new FormData();
            formData.append("image", imageFile);
            
            const res = await fetch(`${apiUrl}/api/upload/public`, {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                const payload = await res.json();
                if (payload.success && payload.data) {
                    return payload.data.url;
                }
            }
        } catch (err) {
            console.error("Failed to upload avatar:", err);
        }
        return null;
    }, []);

    const handleCommentSubmit = useCallback(async ({ newComment, userName, imageFile }) => {
        setError('');
        setIsSubmitting(true);
        
        try {
            const profileImageUrl = await uploadImage(imageFile);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
            const res = await fetch(`${apiUrl}/api/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: newComment,
                    userName,
                    profileImage: profileImageUrl,
                }),
            });
            if (res.ok) {
                const payload = await res.json();
                if (payload.success) {
                    await fetchComments();
                } else {
                    setError(payload.message || 'Failed to post comment.');
                }
            } else {
                setError('Failed to post comment. Server error.');
            }
        } catch (error) {
            setError('Failed to post comment. Please try again.');
            console.error('Error adding comment: ', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [uploadImage, fetchComments]);

    const formatDate = useCallback((timestamp) => {
        if (!timestamp) return '';
        let date;
        if (typeof timestamp.toDate === 'function') {
            date = timestamp.toDate();
        } else {
            date = new Date(timestamp);
        }
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    }, []);

    return (
        <div className={isTabbed ? "w-full flex flex-col" : "w-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl backdrop-blur-xl shadow-xl dark:shadow-2xl p-5 py-10 sm:p-10 transform transition-all duration-300 hover:shadow-[#6366f1]/10 flex flex-col h-full"} data-aos={isTabbed ? undefined : "fade-up"} data-aos-duration={isTabbed ? undefined : "1000"}>
            {!isTabbed && (
                <div className="p-0 pb-6 border-b border-slate-200 dark:border-white/10" data-aos="fade-down" data-aos-duration="800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-[#6366f1]/10 border border-[#6366f1]/20">
                            <MessageCircle className="w-6 h-6 text-[#6366f1]" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Comments <span className="text-[#6366f1]">({comments.length})</span>
                        </h3>
                    </div>
                </div>
            )}
            <div className={isTabbed ? "p-0 space-y-6 flex-grow flex flex-col justify-between" : "p-0 pt-6 space-y-6 flex-grow flex flex-col justify-between"}>
                {error && (
                    <div className="flex items-center gap-2 p-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl" data-aos="fade-in">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                
                <div>
                    <CommentForm onSubmit={handleCommentSubmit} isSubmitting={isSubmitting} error={error} />
                </div>

                <div className="mt-8 border-t border-slate-200 dark:border-white/10 pt-6">
                    <h4 className="text-sm font-semibold text-slate-400 dark:text-gray-400 mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
                        Latest Conversations
                    </h4>
                    <div className="space-y-4 max-h-[290px] overflow-y-auto pr-2 custom-scrollbar">
                        {comments.length === 0 ? (
                            <div className="text-center py-8">
                                <UserCircle2 className="w-12 h-12 text-[#6366f1] mx-auto mb-3 opacity-30" />
                                <p className="text-slate-500 dark:text-gray-400 text-sm">
                                    No comments yet. Start the conversation!
                                </p>
                            </div>
                        ) : (
                            <AnimatePresence initial={false}>
                                {comments.map((comment, index) => (
                                    <Comment 
                                        key={comment.id || index} 
                                        comment={comment} 
                                        formatDate={formatDate}
                                        index={index}
                                    />
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Komentar;