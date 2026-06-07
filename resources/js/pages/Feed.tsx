import { useEffect, useState, useCallback, useRef } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import PostComposer from '../components/PostComposer';
import PostCard from '../components/PostCard';
import { usePageTitle } from '../hooks/usePageTitle';
import type { Post } from '../types';
import DarkModeToggle from "../components/DarkModeToggle";

interface PaginationMeta {
    current_page: number;
    last_page: number;
}

interface PostsResponse {
    data: Post[];
    meta: PaginationMeta;
}

export default function Feed() {
    usePageTitle('Feed');
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const fetchPosts = useCallback(async (page = 1) => {
        try {
            const { data } = await api.get<PostsResponse>(`/posts?page=${page}`);
            const newPosts = data.data ?? [];
            const meta = data.meta ?? {};
            if (page === 1) {
                setPosts(newPosts);
            } else {
                setPosts((prev) => [...prev, ...newPosts]);
            }
            setCurrentPage(meta.current_page ?? page);
            setLastPage(meta.last_page ?? 1);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts(1);
    }, [fetchPosts]);

    function handlePostCreated(newPost: Post) {
        setPosts((prev) => [newPost, ...prev]);
    }

    function handlePostDeleted(id: number) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
    }

    const loadMore = useCallback(async () => {
        if (loadingMore || currentPage >= lastPage) return;
        setLoadingMore(true);
        await fetchPosts(currentPage + 1);
    }, [loadingMore, currentPage, lastPage, fetchPosts]);

    useEffect(() => {
        if (loading || currentPage >= lastPage) return;
        const sentinel = sentinelRef.current;
        const scrollContainer = scrollContainerRef.current;
        if (!sentinel || !scrollContainer) return;

        const observer = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting) loadMore(); },
            { root: scrollContainer, rootMargin: '0px 0px 200px 0px', threshold: 0 },
        );
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [loadMore, loading, currentPage, lastPage]);

    return (
        <div className="_layout _layout_main_wrapper">
            <DarkModeToggle />
            <div className="_main_layout">
                <Navbar />

                <div className="container _custom_container">
                    <div className="_layout_inner_wrap">
                        <div className="row">
                            {/* Left Sidebar */}
                            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                                <LeftSidebar />
                            </div>

                            {/* Middle Feed */}
                            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                                <div className="_layout_middle_wrap" ref={scrollContainerRef}>
                                    <div className="_layout_middle_inner">
                                        {/* Story cards — desktop */}
                                        <div className="_feed_inner_ppl_card _mar_b16">
                                            <div className="_feed_inner_story_arrow">
                                                <button type="button" className="_feed_inner_story_arrow_btn">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" fill="none" viewBox="0 0 9 8">
                                                        <path fill="#fff" d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="row">
                                                <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
                                                    <div className="_feed_inner_profile_story _b_radious6">
                                                        <div className="_feed_inner_profile_story_image">
                                                            <img src="/assets/images/card_ppl1.png" alt="" className="_profile_story_img" />
                                                            <div className="_feed_inner_story_txt">
                                                                <div className="_feed_inner_story_btn">
                                                                    <button className="_feed_inner_story_btn_link" type="button">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                                                                            <path stroke="#fff" strokeLinecap="round" d="M.5 4.884h9M4.884 9.5v-9" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                                <p className="_feed_inner_story_para">Your Story</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
                                                    <div className="_feed_inner_public_story _b_radious6">
                                                        <div className="_feed_inner_public_story_image">
                                                            <img src="/assets/images/card_ppl2.png" alt="" className="_public_story_img" />
                                                            <div className="_feed_inner_pulic_story_txt">
                                                                <p className="_feed_inner_pulic_story_para">Ryan Roslansky</p>
                                                            </div>
                                                            <div className="_feed_inner_public_mini">
                                                                <img src="/assets/images/mini_pic.png" alt="" className="_public_mini_img" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 _custom_mobile_none">
                                                    <div className="_feed_inner_public_story _b_radious6">
                                                        <div className="_feed_inner_public_story_image">
                                                            <img src="/assets/images/card_ppl3.png" alt="" className="_public_story_img" />
                                                            <div className="_feed_inner_pulic_story_txt">
                                                                <p className="_feed_inner_pulic_story_para">Steve Jobs</p>
                                                            </div>
                                                            <div className="_feed_inner_public_mini">
                                                                <img src="/assets/images/mini_pic.png" alt="" className="_public_mini_img" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 _custom_none">
                                                    <div className="_feed_inner_public_story _b_radious6">
                                                        <div className="_feed_inner_public_story_image">
                                                            <img src="/assets/images/card_ppl4.png" alt="" className="_public_story_img" />
                                                            <div className="_feed_inner_pulic_story_txt">
                                                                <p className="_feed_inner_pulic_story_para">Dylan Field</p>
                                                            </div>
                                                            <div className="_feed_inner_public_mini">
                                                                <img src="/assets/images/mini_pic.png" alt="" className="_public_mini_img" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Story cards — mobile */}
                                        <div className="_feed_inner_ppl_card_mobile _mar_b16">
                                            <div className="_feed_inner_ppl_card_area">
                                                <ul className="_feed_inner_ppl_card_area_list">
                                                    <li className="_feed_inner_ppl_card_area_item">
                                                        <a href="#0" className="_feed_inner_ppl_card_area_link">
                                                            <div className="_feed_inner_ppl_card_area_story">
                                                                <img src="/assets/images/mobile_story_img.png" alt="" className="_card_story_img" />
                                                                <div className="_feed_inner_ppl_btn">
                                                                    <button className="_feed_inner_ppl_btn_link" type="button">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
                                                                            <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M6 2.5v7M2.5 6h7" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <p className="_feed_inner_ppl_card_area_link_txt">Your Story</p>
                                                        </a>
                                                    </li>
                                                    <li className="_feed_inner_ppl_card_area_item">
                                                        <a href="#0" className="_feed_inner_ppl_card_area_link">
                                                            <div className="_feed_inner_ppl_card_area_story_active">
                                                                <img src="/assets/images/mobile_story_img1.png" alt="" className="_card_story_img1" />
                                                            </div>
                                                            <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
                                                        </a>
                                                    </li>
                                                    <li className="_feed_inner_ppl_card_area_item">
                                                        <a href="#0" className="_feed_inner_ppl_card_area_link">
                                                            <div className="_feed_inner_ppl_card_area_story_inactive">
                                                                <img src="/assets/images/mobile_story_img2.png" alt="" className="_card_story_img1" />
                                                            </div>
                                                            <p className="_feed_inner_ppl_card_area_txt">Steve...</p>
                                                        </a>
                                                    </li>
                                                    <li className="_feed_inner_ppl_card_area_item">
                                                        <a href="#0" className="_feed_inner_ppl_card_area_link">
                                                            <div className="_feed_inner_ppl_card_area_story_active">
                                                                <img src="/assets/images/mobile_story_img1.png" alt="" className="_card_story_img1" />
                                                            </div>
                                                            <p className="_feed_inner_ppl_card_area_txt">Dylan...</p>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Post Composer */}
                                        <PostComposer onPostCreated={handlePostCreated} />

                                        {/* Posts */}
                                        {loading && (
                                            <p className="text-center text-muted py-4">Loading posts…</p>
                                        )}

                                        {!loading && posts.length === 0 && (
                                            <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
                                                <p className="text-center text-muted py-3">No posts yet. Be the first to post!</p>
                                            </div>
                                        )}

                                        {posts.map((post) => (
                                            <PostCard key={post.id} post={post} onDeleted={handlePostDeleted} />
                                        ))}

                                        {/* Infinite scroll sentinel */}
                                        {loadingMore && (
                                            <p className="text-center text-muted py-3">Loading…</p>
                                        )}
                                        <div ref={sentinelRef} style={{ height: 1 }} />
                                    </div>
                                </div>
                            </div>

                            {/* Right Sidebar */}
                            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                                <RightSidebar />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
