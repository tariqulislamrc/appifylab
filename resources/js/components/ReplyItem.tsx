import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRelativeTime } from '../hooks/useRelativeTime';
import api from '../services/api';
import LikersModal from './LikersModal';
import type { Comment } from '../types';

interface ReplyItemProps {
    reply: Comment;
    commentId: number;
    onDeleted: (id: number) => void;
}

export default function ReplyItem({ reply, commentId: _commentId, onDeleted }: ReplyItemProps) {
    const { user } = useAuth();
    const relativeTime = useRelativeTime();

    const [liked, setLiked] = useState(reply.is_liked_by_me);
    const [likesCount, setLikesCount] = useState(reply.likes_count);
    const [likersOpen, setLikersOpen] = useState(false);

    async function handleLike() {
        const { data } = await api.post<{ data: { liked: boolean; likes_count: number } }>(`/comments/${reply.id}/likes`);
        setLiked(data.data.liked);
        setLikesCount(data.data.likes_count);
    }

    async function handleDelete() {
        await api.delete(`/comments/${reply.id}`);
        onDeleted(reply.id);
    }

    const avatarSrc = reply.user?.avatar_url || '/assets/images/Avatar.png';
    const isOwner = user?.id === reply.user?.id;

    return (
        <>
            {likersOpen && (
                <LikersModal endpoint={`/comments/${reply.id}/likes`} onClose={() => setLikersOpen(false)} />
            )}
            <div className="_comment_main" style={{ paddingLeft: 40, marginTop: 8 }}>
                <div className="_comment_image">
                    <img src={avatarSrc} alt="" className="_comment_img1" />
                </div>
                <div className="_comment_area">
                    <div className="_comment_details">
                        <div className="_comment_details_top">
                            <div className="_comment_name">
                                <h4 className="_comment_name_title">
                                    {reply.user?.first_name} {reply.user?.last_name}
                                </h4>
                            </div>
                        </div>
                        <div className="_comment_status">
                            <p className="_comment_status_text">{reply.body}</p>
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
                                            className={`border-0 bg-transparent p-0 _time_link${liked ? ' fw-semibold' : ''}`}
                                            style={liked ? { color: '#1877F2' } : {}}
                                            onClick={handleLike}
                                        >
                                            {liked ? 'Liked' : 'Like'}
                                        </button>
                                    </li>
                                    {isOwner && (
                                        <li style={{ whiteSpace: 'nowrap' }}>
                                            <button
                                                type="button"
                                                className="border-0 bg-transparent p-0 _time_link text-danger"
                                                onClick={handleDelete}
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    )}
                                    <li style={{ whiteSpace: 'nowrap' }}>
                                        <span className="_time_link">{relativeTime(reply.created_at)}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
