export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token && { Authorization: `Bearer ${token}` }),
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) {
    let data = {};
    try {
      data = await res.clone().json();
    } catch (error) {
      console.error(error);
    }

    if (data.message === "TOKEN_EXPIRED") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return;
    }
  }

  return res;
};
