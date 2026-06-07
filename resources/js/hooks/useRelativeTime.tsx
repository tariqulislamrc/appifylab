export function useRelativeTime(): (isoString?: string) => string {
    function relativeTime(isoString?: string): string {
        if (!isoString) return '';
        const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
        if (diff < 60) return 'just now';
        if (diff < 3600) return `${Math.floor(diff / 60)} minute ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hour ago`;
        if (diff < 604800) return `${Math.floor(diff / 86400)} day ago`;
        return new Date(isoString).toLocaleDateString();
    }
    return relativeTime;
}
