import { useEffect, useState } from 'react';
import api from '../services/api';
import type { Like } from '../types';

interface LikersModalProps {
    endpoint: string;
    onClose: () => void;
}

export default function LikersModal({ endpoint, onClose }: LikersModalProps) {
    const [likers, setLikers] = useState<Like[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<{ data: Like[] }>(endpoint)
            .then(({ data }) => setLikers(data.data ?? []))
            .finally(() => setLoading(false));
    }, [endpoint]);

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 1050,
                background: 'rgba(0,0,0,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: '#fff', borderRadius: 12, width: 360, maxHeight: 480,
                    display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 20px', borderBottom: '1px solid #f0f0f0',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                            width: 28, height: 28, borderRadius: '50%', background: '#1877F2',
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                                <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                            </svg>
                        </span>
                        <span style={{ fontWeight: 600, fontSize: 16, color: '#1a1a1a' }}>
                            {loading ? 'Likes' : `${likers.length} Like${likers.length !== 1 ? 's' : ''}`}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: '#f0f2f5', border: 'none', borderRadius: '50%',
                            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: '#606770',
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div style={{ overflowY: 'auto', flex: 1, padding: '8px 4px' }}>
                    {loading && (
                        <div style={{ padding: 24, textAlign: 'center', color: '#90949c', fontSize: 14 }}>
                            Loading…
                        </div>
                    )}
                    {!loading && likers.length === 0 && (
                        <div style={{ padding: 24, textAlign: 'center', color: '#90949c', fontSize: 14 }}>
                            No likes yet.
                        </div>
                    )}
                    {likers.map((like) => (
                        <div
                            key={like.id}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '8px 16px', borderRadius: 8, cursor: 'default',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f2f5'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                <img
                                    src={like.user?.avatar_url || '/assets/images/Avatar.png'}
                                    alt=""
                                    style={{
                                        width: 44, height: 44, borderRadius: '50%',
                                        objectFit: 'cover', border: '1px solid #e4e6eb',
                                    }}
                                />
                                <span style={{
                                    position: 'absolute', bottom: -2, right: -2,
                                    width: 18, height: 18, borderRadius: '50%', background: '#1877F2',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: '2px solid #fff',
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="#fff">
                                        <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
                                    </svg>
                                </span>
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a', lineHeight: 1.3 }}>
                                    {like.user?.first_name} {like.user?.last_name}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
