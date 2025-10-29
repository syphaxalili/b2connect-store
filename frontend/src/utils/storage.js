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

export const setUserData = (userData, rememberMe = false) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem("user", JSON.stringify(userData));
};

export const getUserData = () => {
  const userData = localStorage.getItem("user") || sessionStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
};

export const clearUserData = () => {
  localStorage.removeItem("user");
  sessionStorage.removeItem("user");
};

export const isAuthenticated = () => {
  return getAuthToken() !== null;
};

export const isAdmin = (user) => {
  return user?.role === "admin";
};
