export const setAuthToken = (token, userId, rememberMe = false) => {
	const storage = rememberMe ? localStorage : sessionStorage
	storage.setItem('token', token)
	storage.setItem('user_id', userId)
}

export const getAuthToken = () => {
	return localStorage.getItem('token') || sessionStorage.getItem('token')
}

export const clearAuthToken = () => {
	localStorage.removeItem('token')
	localStorage.removeItem('user_id')
	sessionStorage.removeItem('token')
	sessionStorage.removeItem('user_id')
}

export const isAuthenticated = () => {
	return getAuthToken() !== null
}
