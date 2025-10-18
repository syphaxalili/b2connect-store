import {
	Alert,
	Box,
	Button,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControlLabel,
	Link,
	TextField,
	Typography
} from '@mui/material'
import axios from 'axios'
import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import AuthFormContainer from '../components/common/AuthFormContainer'
import CustomSnackbar from '../components/common/CustomSnackbar'
import PasswordField from '../components/common/PasswordField'
import { setAuthToken } from '../utils/storage'
import { validateEmail, validatePassword } from '../utils/validation'

const Login = () => {
	const navigate = useNavigate()
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	})
	const [errors, setErrors] = useState({})
	const [apiError, setApiError] = useState('')
	const [loading, setLoading] = useState(false)
	const [rememberMe, setRememberMe] = useState(false)
	const [snackbarOpen, setSnackbarOpen] = useState(false)
	const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false)
	const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
	const [forgotPasswordError, setForgotPasswordError] = useState('')
	const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false)
	const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
	const [forgotPasswordErrorSnackbar, setForgotPasswordErrorSnackbar] =
		useState(false)

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: value
		}))
		// Clear field-specific error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({
				...prev,
				[name]: ''
			}))
		}
		// Clear API error when user modifies form
		if (apiError) {
			setApiError('')
		}
	}

	const validateForm = () => {
		const newErrors = {}

		const emailError = validateEmail(formData.email)
		if (emailError) newErrors.email = emailError

		const passwordError = validatePassword(formData.password)
		if (passwordError) newErrors.password = passwordError

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleLogin = async () => {
		// Clear previous API error
		setApiError('')

		// Validate form
		if (!validateForm()) {
			return
		}

		setLoading(true)

		try {
			const response = await axios.post('/api/users/login', {
				email: formData.email,
				password: formData.password
			})

			if (response.data.token) {
				setAuthToken(response.data.token, response.data.user_id, rememberMe)
				setSnackbarOpen(true)
				setTimeout(() => navigate('/'), 1000)
			} else {
				setApiError('Connexion réussie mais aucun token reçu')
			}
		} catch (error) {
			// Handle API errors
			if (error.response) {
				// Server responded with error status
				setApiError(
					error.response.data.message ||
						error.response.data.error ||
						'Invalid email or password'
				)
			} else if (error.request) {
				// Request made but no response
				setApiError('Unable to connect to server. Please try again.')
			} else {
				// Other errors
				setApiError('An unexpected error occurred. Please try again.')
			}
		} finally {
			setLoading(false)
		}
	}

	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && !loading) {
			handleLogin()
		}
	}

	const handleForgotPassword = async () => {
		setForgotPasswordError('')

		const emailError = validateEmail(forgotPasswordEmail)
		if (emailError) {
			setForgotPasswordError(emailError)
			setForgotPasswordErrorSnackbar(true)
			return
		}

		setForgotPasswordLoading(true)

		try {
			// Simulate API call - replace with actual endpoint
			await axios.post('/api/users/forgot-password', {
				email: forgotPasswordEmail
			})

			// Show success snackbar
			setForgotPasswordSuccess(true)
			setForgotPasswordOpen(false)
			setForgotPasswordEmail('')
		} catch (error) {
			if (error.response) {
				setForgotPasswordError(
					error.response.data.message ||
						error.response.data.error ||
						'Failed to send reset email'
				)
			} else {
				setForgotPasswordError('Unable to connect to server. Please try again.')
			}
			setForgotPasswordErrorSnackbar(true)
		} finally {
			setForgotPasswordLoading(false)
		}
	}

	return (
		<AuthFormContainer>
			<Typography
				variant="h4"
				component="h1"
				gutterBottom
				align="center"
				sx={{ mb: 3, fontWeight: 600 }}
			>
				Bienvenue sur B2CONNECT
			</Typography>

			<Typography
				variant="body1"
				align="center"
				color="text.secondary"
				sx={{ mb: 4 }}
			>
				Se connecter à votre compte
			</Typography>

			{apiError && (
				<Alert severity="error" sx={{ mb: 3 }}>
					{apiError}
				</Alert>
			)}

			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
				<TextField
					fullWidth
					label="Adresse mail"
					name="email"
					type="email"
					value={formData.email}
					onChange={handleChange}
					onKeyPress={handleKeyPress}
					error={!!errors.email}
					helperText={errors.email}
					disabled={loading}
					autoComplete="email"
					variant="outlined"
				/>

				<PasswordField
					label="Mot de passe"
					name="password"
					value={formData.password}
					onChange={handleChange}
					onKeyDown={handleKeyPress}
					error={!!errors.password}
					helperText={errors.password}
					disabled={loading}
					autoComplete="current-password"
				/>

				<Box
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center'
					}}
				>
					<FormControlLabel
						control={
							<Checkbox
								checked={rememberMe}
								onChange={(e) => setRememberMe(e.target.checked)}
								disabled={loading}
								color="primary"
							/>
						}
						label="Se souvenir de moi"
					/>
					<Link
						component="button"
						variant="body2"
						onClick={() => setForgotPasswordOpen(true)}
						underline="hover"
						sx={{ fontWeight: 600, cursor: 'pointer' }}
						type="button"
					>
						Mot de passe oublié?
					</Link>
				</Box>

				<Button
					fullWidth
					variant="contained"
					size="large"
					onClick={handleLogin}
					disabled={loading}
					sx={{
						mt: 1,
						py: 1.5,
						textTransform: 'none',
						fontSize: '1rem',
						fontWeight: 600
					}}
				>
					{loading ? 'Connexion en cours...' : 'Se connecter'}
				</Button>

				<Box sx={{ textAlign: 'center', mt: 2 }}>
					<Typography variant="body2" color="text.secondary">
						Pas de compte?{' '}
						<Link
							component={RouterLink}
							to="/register"
							underline="hover"
							sx={{ fontWeight: 600 }}
						>
							S'inscrire
						</Link>
					</Typography>
				</Box>
			</Box>

			<CustomSnackbar
				open={snackbarOpen}
				onClose={() => setSnackbarOpen(false)}
				message="Connexion réussie!"
				severity="success"
			/>

			<CustomSnackbar
				open={forgotPasswordSuccess}
				onClose={() => setForgotPasswordSuccess(false)}
				message="Email de réinitialisation de mot de passe envoyé! Veuillez vérifier votre boîte de réception."
				severity="success"
				autoHideDuration={4000}
			/>

			<CustomSnackbar
				open={forgotPasswordErrorSnackbar}
				onClose={() => {
					setForgotPasswordErrorSnackbar(false)
					setForgotPasswordError('')
				}}
				message={forgotPasswordError}
				severity="error"
				autoHideDuration={4000}
			/>

			<Dialog
				open={forgotPasswordOpen}
				onClose={() => {
					setForgotPasswordOpen(false)
					setForgotPasswordEmail('')
					setForgotPasswordError('')
				}}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Mot de passe oublié</DialogTitle>
				<DialogContent>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mb: 3, mt: 1 }}
					>
						Entrez votre adresse mail et nous vous enverrons un lien pour
						réinitialiser votre mot de passe.
					</Typography>
					<TextField
						fullWidth
						label="Email"
						type="email"
						value={forgotPasswordEmail}
						onChange={(e) => {
							setForgotPasswordEmail(e.target.value)
						}}
						disabled={forgotPasswordLoading}
						autoComplete="email"
						variant="outlined"
					/>
				</DialogContent>
				<DialogActions sx={{ px: 3, pb: 3 }}>
					<Button
						onClick={() => {
							setForgotPasswordOpen(false)
							setForgotPasswordEmail('')
							setForgotPasswordError('')
						}}
						disabled={forgotPasswordLoading}
					>
						Annuler
					</Button>
					<Button
						onClick={handleForgotPassword}
						variant="contained"
						disabled={forgotPasswordLoading}
					>
						{forgotPasswordLoading
							? 'Envoi en cours...'
							: 'Envoyer le lien de réinitialisation'}
					</Button>
				</DialogActions>
			</Dialog>
		</AuthFormContainer>
	)
}

export default Login
