export const BASE_URL = 'http://localhost:8000';

export const API_PATHS = {
    AUTH: {
        LOGIN: `/api/auth/login`,
        REGISTER: `/api/auth/register`,
        GET_PROFILE: `/api/auth/profile`,
    },
    IMAGE: {
        UPLOAD_IMAGE: `/api/auth/upload-image`,
    },
    DASHBOARD: {
        GET_DASHBOARD_DATA: `/api/dashboard-summary`,
    },
    AI: {
        GENERATE_POST_SUMMARY: `/api/ai/generate-summary`,
        GENERATE_BLOG_POST_IDEAS: `/api/ai/generate-ideas`,
        GENERATE_COMMENT_REPLY: `/api/ai/generate-reply`,
        GENERATE_BLOG_POST: `/api/ai/generate`,
    },
    POSTS: {
        CREATE: "/api/posts",
        GET_ALL: "/api/posts",
        GET_TRENDING_POSTS: "/api/posts/trending",
        GET_BY_SLUG: (slug) => `/api/posts/slug/${slug}`,
        UPDATE: (id) => `/api/posts/${id}`,
        DELETE: (id) => `/api/posts/${id}`,
        GET_BY_TAG: (tag) => `/api/posts/tag/${tag}`,
        INCREMENT_VIEW: (id) => `/api/posts/${id}/view`,
        LIKE: (id) => `/api/posts/${id}/like`,
        SEARCH: `/api/posts/search`,
    },
    COMMENTS: {
        ADD: (postId) => `/api/comments/${postId}`,
        GET_ALL: "/api/comments",
        GET_ALL_BY_POST: (postId) => `/api/comments/${postId}`,
        DELETE: (commentId) => `/api/comments/${commentId}`,
    }
}