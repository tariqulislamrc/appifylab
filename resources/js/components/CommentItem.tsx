import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRelativeTime } from '../hooks/useRelativeTime';
import api from '../services/api';
import LikersModal from './LikersModal';
import ReplyItem from './ReplyItem';
import type { Comment } from '../types';

interface CommentItemProps {
    comment: Comment;
    onDeleted: (id: number) => void;
}

export default function CommentItem({ comment, onDeleted }: CommentItemProps) {
    const { user } = useAuth();
    const relativeTime = useRelativeTime();

    const [liked, setLiked] = useState(comment.is_liked_by_me);
    const [likesCount, setLikesCount] = useState(comment.likes_count);
    const [likersOpen, setLikersOpen] = useState(false);
    const [repliesOpen, setRepliesOpen] = useState(false);
    const [replies, setReplies] = useState<Comment[]>(comment.replies ?? []);
    const [replyBody, setReplyBody] = useState('');
    const [submitting, setSubmitting] = useState(false);

    async function handleLike() {
        const { data } = await api.post<{ data: { liked: boolean; likes_count: number } }>(`/comments/${comment.id}/likes`);
        setLiked(data.data.liked);
        setLikesCount(data.data.likes_count);
    }

    async function handleDelete() {
        if (!window.confirm('Delete this comment?')) return;
        await api.delete(`/comments/${comment.id}`);
        onDeleted(comment.id);
    }

    async function submitReply() {
        if (!replyBody.trim()) return;
        setSubmitting(true);
        try {
            const { data } = await api.post<{ data: Comment }>(`/comments/${comment.id}/replies`, { body: replyBody });
            setReplies((prev) => [data.data, ...prev]);
            setReplyBody('');
        } finally {
            setSubmitting(false);
        }
    }

    function handleReply(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        submitReply();
    }

    function handleReplyDeleted(id: number) {
        setReplies((prev) => prev.filter((r) => r.id !== id));
    }

    const avatarSrc = comment.user?.avatar_url || '/assets/images/Avatar.png';
    const authAvatarSrc = user?.avatar_url || '/assets/images/Avatar.png';
    const isOwner = user?.id === comment.user?.id;

    return (
        <>
            {likersOpen && (
                <LikersModal endpoint={`/comments/${comment.id}/likes`} onClose={() => setLikersOpen(false)} />
            )}

            <div className="_comment_main">
                <div className="_comment_image">
                    <img src={avatarSrc} alt="" className="_comment_img1" />
                </div>
                <div className="_comment_area">
                    <div className="_comment_details">
                        <div className="_comment_details_top">
                            <div className="_comment_name">
                                <h4 className="_comment_name_title">
                                    {comment.user?.first_name} {comment.user?.last_name}
                                </h4>
                            </div>
                        </div>
                        <div className="_comment_status">
                            <p className="_comment_status_text">{comment.body}</p>
                        </div>

                        {likesCount > 0 && (
                            <div className="_total_reactions" onClick={() => setLikersOpen(true)}>
                                <div className="_total_react">
                                    <span className="_reaction_like">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                                        </svg>
                                    </span>
                                </div>
                                <span className="_total">{likesCount}</span>
                            </div>
                        )}

                        <div className="_comment_reply">
                            <div className="_comment_reply_num">
                                <ul className="_comment_reply_list" style={{ flexWrap: 'nowrap' }}>
                                    <li style={{ whiteSpace: 'nowrap' }}>
                                        <button
                                            type="button"
                                            className={`border-0 bg-transparent p-0${liked ? ' fw-semibold' : ''}`}
                                            onClick={handleLike}
                                        >
                                            <span style={liked ? { color: '#1877F2' } : {}}>
                                                {liked ? 'Liked' : 'Like'}
                                            </span>
                                        </button>
                                    </li>
                                    <li style={{ whiteSpace: 'nowrap' }}>
                                        <button
                                            type="button"
                                            className="border-0 bg-transparent p-0"
                                            onClick={() => setRepliesOpen((o) => !o)}
                                        >
                                            <span>Reply{replies.length > 0 ? ` (${replies.length})` : ''}</span>
                                        </button>
                                    </li>
                                    {isOwner && (
                                        <li style={{ whiteSpace: 'nowrap' }}>
                                            <button
                                                type="button"
                                                className="border-0 bg-transparent p-0 text-danger"
                                                onClick={handleDelete}
                                            >
                                                <span>Delete</span>
                                            </button>
                                        </li>
                                    )}
                                    <li style={{ whiteSpace: 'nowrap' }}>
                                        <span className="_time_link">{relativeTime(comment.created_at)}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Reply section */}
                    {repliesOpen && (
                        <>
                            {/* Reply input */}
                            <div className="_feed_inner_comment_box mt-2">
                                <form className="_feed_inner_comment_box_form" onSubmit={handleReply}>
                                    <div className="_feed_inner_comment_box_content">
                                        <div className="_feed_inner_comment_box_content_image">
                                            <img src={authAvatarSrc} alt="" className="_comment_img" />
                                        </div>
                                        <div className="_feed_inner_comment_box_content_txt">
                                            <textarea
                                                className="form-control _comment_textarea"
                                                placeholder="Write a reply…"
                                                value={replyBody}
                                                rows={1}
                                                onChange={(e) => setReplyBody(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        submitReply();
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {replyBody.trim() ? (
                                        <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                                            {submitting ? 'Sending…' : 'Reply'}
                                        </button>
                                    ) : (
                                        <div className="_feed_inner_comment_box_icon">
                                            <button type="button" className="_feed_inner_comment_box_icon_btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                                                    <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <button type="button" className="_feed_inner_comment_box_icon_btn">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
                                                    <path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>

                            {/* Reply list */}
                            <div className="mt-2">
                                {replies.map((reply) => (
                                    <ReplyItem
                                        key={reply.id}
                                        reply={reply}
                                        commentId={comment.id}
                                        onDeleted={handleReplyDeleted}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
