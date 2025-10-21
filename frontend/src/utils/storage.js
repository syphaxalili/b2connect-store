export const setAuthToken = (token, rememberMe = false) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem("token", token);
};

export const getAuthToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

export const clearAuthToken = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
};

export const isAuthenticated = () => {
  return getAuthToken() !== null;
};

export const isAdmin = (user) => {
  return user?.role === "admin";
};
