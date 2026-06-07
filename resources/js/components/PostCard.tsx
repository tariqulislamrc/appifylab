import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRelativeTime } from '../hooks/useRelativeTime';
import api from '../services/api';
import CommentSection from './CommentSection';
import LikersModal from './LikersModal';
import type { Post } from '../types';

interface PostCardProps {
    post: Post;
    onDeleted: (id: number) => void;
}

export default function PostCard({ post, onDeleted }: PostCardProps) {
    const { user } = useAuth();
    const relativeTime = useRelativeTime();

    const [liked, setLiked] = useState(post.is_liked_by_me);
    const [likesCount, setLikesCount] = useState(post.likes_count);
    const [likersPreview, setLikersPreview] = useState(post.likers_preview ?? []);

    const [commentsCount, setCommentsCount] = useState(post.comments_count);
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [likersOpen, setLikersOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const isOwner = user?.id === post.user?.id;
    const avatarSrc = post.user?.avatar_url || '/assets/images/Avatar.png';

    async function handleLike() {
        const { data } = await api.post<{ data: { liked: boolean; likes_count: number } }>(`/posts/${post.id}/likes`);
        setLiked(data.data.liked);
        setLikesCount(data.data.likes_count);
        setLikersPreview((prev) => {
            if (data.data.liked && user) {
                return prev.some((u) => u.id === user.id) ? prev : [user, ...prev];
            }
            return prev.filter((u) => u.id !== user?.id);
        });
    }

    async function handleDelete() {
        if (!window.confirm('Delete this post?')) return;
        await api.delete(`/posts/${post.id}`);
        onDeleted(post.id);
    }

    return (
        <>
            {likersOpen && (
                <LikersModal endpoint={`/posts/${post.id}/likes`} onClose={() => setLikersOpen(false)} />
            )}

            <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
                {/* Post header */}
                <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
                    <div className="_feed_inner_timeline_post_top">
                        <div className="_feed_inner_timeline_post_box">
                            <div className="_feed_inner_timeline_post_box_image">
                                <img src={avatarSrc} alt="" className="_post_img" />
                            </div>
                            <div className="_feed_inner_timeline_post_box_txt">
                                <h4 className="_feed_inner_timeline_post_box_title">
                                    {post.user?.first_name} {post.user?.last_name}
                                </h4>
                                <p className="_feed_inner_timeline_post_box_para">
                                    {relativeTime(post.created_at)} &middot;{' '}
                                    <span>
                                        {post.is_private ? '🔒 Private' : 'Public'}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Three-dot menu */}
                        <div className="_feed_inner_timeline_post_box_dropdown" style={{ position: 'relative' }}>
                            <button
                                type="button"
                                className="_feed_timeline_post_dropdown_link"
                                onClick={() => setMenuOpen((o) => !o)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                                    <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                                    <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                                    <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                                </svg>
                            </button>
                            {menuOpen && (
                                <div className="_feed_timeline_dropdown _timeline_dropdown show">
                                    <ul className="_feed_timeline_dropdown_list">
                                        {isOwner && (
                                            <li className="_feed_timeline_dropdown_item">
                                                <button
                                                    type="button"
                                                    className="_feed_timeline_dropdown_link border-0 bg-transparent w-100 text-start text-danger"
                                                    onClick={() => { setMenuOpen(false); handleDelete(); }}
                                                >
                                                    Delete Post
                                                </button>
                                            </li>
                                        )}
                                        <li className="_feed_timeline_dropdown_item">
                                            <button
                                                type="button"
                                                className="_feed_timeline_dropdown_link border-0 bg-transparent w-100 text-start"
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                Save Post
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Post body */}
                    {post.body && (
                        <h4 className="_feed_inner_timeline_post_title">{post.body}</h4>
                    )}

                    {/* Post images */}
                    {(post.images?.length ?? 0) > 0 && (
                        <div className="_feed_inner_timeline_image">
                            {post.images!.map((img) => (
                                <img key={img.id} src={img.url} alt="" className="_time_img" />
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats row */}
                <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
                    <div className="_feed_inner_timeline_total_reacts_image">
                        {likesCount > 0 && (
                            <button
                                type="button"
                                className="border-0 bg-transparent p-0 d-flex align-items-center"
                                onClick={() => setLikersOpen(true)}
                            >
                                {likersPreview.map((liker, i) => (
                                    <img
                                        key={i}
                                        src={liker.avatar_url || '/assets/images/Avatar.png'}
                                        alt=""
                                        className={i === 0 ? '_react_img1' : '_react_img'}
                                    />
                                ))}
                                <p className="_feed_inner_timeline_total_reacts_para">
                                    {likesCount > 9 ? '9+' : likesCount}
                                </p>
                            </button>
                        )}
                    </div>
                    <div className="_feed_inner_timeline_total_reacts_txt">
                        <p className="_feed_inner_timeline_total_reacts_para1">
                            <button
                                type="button"
                                className="border-0 bg-transparent p-0"
                                onClick={() => setCommentsOpen((o) => !o)}
                            >
                                <span>{commentsCount}</span> Comment{commentsCount !== 1 ? 's' : ''}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="_feed_inner_timeline_reaction">
                    {/* Like button */}
                    <button
                        type="button"
                        className={`_feed_inner_timeline_reaction_emoji _feed_reaction${liked ? ' _feed_reaction_active' : ''}`}
                        style={liked ? { color: '#1877F2' } : {}}
                        onClick={handleLike}
                    >
                        <span className="_feed_inner_timeline_reaction_link">
                            <span>
                                {liked ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="#1877F2">
                                        <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                                    </svg>
                                )}
                                {liked ? ' Liked' : ' Like'}
                            </span>
                        </span>
                    </button>

                    {/* Comment button */}
                    <button
                        type="button"
                        className="_feed_inner_timeline_reaction_comment _feed_reaction"
                        onClick={() => setCommentsOpen((o) => !o)}
                    >
                        <span className="_feed_inner_timeline_reaction_link">
                            <span>
                                <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                                    <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
                                    <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
                                </svg> Comment
                            </span>
                        </span>
                    </button>

                    {/* Share button (UI only) */}
                    <button type="button" className="_feed_inner_timeline_reaction_share _feed_reaction">
                        <span className="_feed_inner_timeline_reaction_link">
                            <span>
                                <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                                    <path stroke="#000" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
                                </svg> Share
                            </span>
                        </span>
                    </button>
                </div>

                {/* Comments section */}
                <CommentSection
                    postId={post.id}
                    onCountChange={setCommentsCount}
                    open={commentsOpen}
                />
            </div>
        </>
    );
}
