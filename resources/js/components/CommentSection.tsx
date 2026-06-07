import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import CommentItem from './CommentItem';
import type { Comment } from '../types';

interface CommentSectionProps {
    postId: number;
    onCountChange?: (updater: (n: number) => number) => void;
    open: boolean;
}

interface PaginationMeta {
    currentPage: number;
    lastPage: number;
    total: number;
}

interface CommentsResponse {
    data: Comment[];
    meta: {
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function CommentSection({ postId, onCountChange, open }: CommentSectionProps) {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [meta, setMeta] = useState<PaginationMeta | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [body, setBody] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const avatarSrc = user?.avatar_url || '/assets/images/Avatar.png';

    useEffect(() => {
        if (open && !loaded) {
            setLoading(true);
            api.get<CommentsResponse>(`/posts/${postId}/comments?page=1`)
                .then(({ data }) => {
                    setComments(data.data ?? []);
                    setMeta({
                        currentPage: data.meta.current_page,
                        lastPage: data.meta.last_page,
                        total: data.meta.total,
                    });
                    setLoaded(true);
                })
                .finally(() => setLoading(false));
        }
    }, [open, loaded, postId]);

    async function loadPreviousComments() {
        if (!meta || meta.currentPage >= meta.lastPage || loadingMore) return;
        setLoadingMore(true);
        try {
            const { data } = await api.get<CommentsResponse>(
                `/posts/${postId}/comments?page=${meta.currentPage + 1}`,
            );
            setComments((prev) => [...prev, ...data.data]);
            setMeta({
                currentPage: data.meta.current_page,
                lastPage: data.meta.last_page,
                total: data.meta.total,
            });
        } finally {
            setLoadingMore(false);
        }
    }

    async function submitComment() {
        if (!body.trim()) return;
        setSubmitting(true);
        try {
            const { data } = await api.post<{ data: Comment }>(`/posts/${postId}/comments`, { body });
            setComments((prev) => [data.data, ...prev]);
            onCountChange?.((n) => n + 1);
            setBody('');
        } finally {
            setSubmitting(false);
        }
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        submitComment();
    }

    function handleDeleted(id: number) {
        setComments((prev) => prev.filter((c) => c.id !== id));
        onCountChange?.((n) => Math.max(0, n - 1));
    }

    const remainingCount = meta ? meta.total - comments.length : 0;
    const hasMore = meta !== null && meta.currentPage < meta.lastPage;

    return (
        <div className="_feed_inner_timeline_cooment_area">
            <div className="_feed_inner_comment_box">
                <form className="_feed_inner_comment_box_form" onSubmit={handleSubmit}>
                    <div className="_feed_inner_comment_box_content">
                        <div className="_feed_inner_comment_box_content_image">
                            <img src={avatarSrc} alt="" className="_comment_img" />
                        </div>
                        <div className="_feed_inner_comment_box_content_txt">
                            <textarea
                                className="form-control _comment_textarea"
                                placeholder="Write a comment…"
                                value={body}
                                rows={1}
                                onChange={(e) => setBody(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        submitComment();
                                    }
                                }}
                            />
                        </div>
                    </div>
                    {body.trim() ? (
                        <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                            {submitting ? 'Sending…' : 'Comment'}
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

            {open && (
                <div className="_timline_comment_main">
                    {loading && <p className="text-center text-muted py-2 small">Loading comments…</p>}

                    {!loading && loaded && comments.length === 0 && (
                        <p className="text-center text-muted py-2 small">No comments yet. Be the first to comment!</p>
                    )}

                    {hasMore && (
                        <div className="_previous_comment">
                            <button
                                type="button"
                                className="_previous_comment_txt"
                                onClick={loadPreviousComments}
                                disabled={loadingMore}
                            >
                                {loadingMore ? 'Loading…' : `View ${remainingCount} previous comment${remainingCount !== 1 ? 's' : ''}`}
                            </button>
                        </div>
                    )}

                    {comments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} onDeleted={handleDeleted} />
                    ))}
                </div>
            )}
        </div>
    );
}
