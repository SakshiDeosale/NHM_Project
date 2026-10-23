
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

    // Attach JWT automatically when available.
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    // Expired, invalid, or missing token on a protected endpoint.
    if (response.status === 401) {
        clearAuthData();

        if (window.location.pathname !== "/login") {
            window.location.replace("/login");
        }
    }

    return response;
}

export { getAuthToken, clearAuthData };
