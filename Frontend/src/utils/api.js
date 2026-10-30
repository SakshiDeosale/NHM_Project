
const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
    throw new Error("VITE_API_URL is not configured");
}

export const API_URL =
    `${API_BASE_URL.replace(/\/+$/, "")}/api`;

export default API_URL;

const getAuthToken = () =>
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

const clearAuthData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
};

export async function apiFetch(url, options = {}) {
    const headers = new Headers(options.headers || {});
    const token = getAuthToken();

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        clearAuthData();

        if (window.location.pathname !== "/login") {
            window.location.replace("/login");
        }
    }

    return response;
}

export { getAuthToken, clearAuthData };
