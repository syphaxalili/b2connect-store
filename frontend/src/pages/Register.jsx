import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  Link,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Snackbar
} from '@mui/material';
import { Visibility, VisibilityOff, CheckCircle } from '@mui/icons-material';
import logoB2connect from '../assets/logoB2connect.webp';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    gender: '',
    rue: '',
    codePostal: '',
    ville: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent numbers in ville field
    if (name === 'ville' && /\d/.test(value)) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear API error when user modifies form
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.rue.trim()) {
      newErrors.rue = 'Street address is required';
    }
    if (!formData.codePostal.trim()) {
      newErrors.codePostal = 'Postal code is required';
    } else if (!/^\d{5}$/.test(formData.codePostal)) {
      newErrors.codePostal = 'Postal code must be 5 digits';
    }
    if (!formData.ville.trim()) {
      newErrors.ville = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    // Clear previous API error
    setApiError('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Format address as: rue, code postal ville, France
    const formattedAddress = `${formData.rue}, ${formData.codePostal} ${formData.ville}, France`;

    try {
      await axios.post('/api/users/register', {
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: formData.gender,
        address: formattedAddress
      });

      // Show success snackbar
      setSnackbarOpen(true);

      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      // Handle API errors
      if (error.response) {
        // Server responded with error status
        setApiError(
          error.response.data.message || 
          error.response.data.error || 
          'Registration failed. Please try again.'
        );
      } else if (error.request) {
        // Request made but no response
        setApiError('Unable to connect to server. Please try again.');
      } else {
        // Other errors
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleRegister();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 4 },
            maxWidth: '100%',
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <img 
              src={logoB2connect} 
              alt="B2CONNECT Logo" 
              style={{ maxWidth: '200px', height: 'auto' }}
            />
          </Box>

          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ mb: 3, fontWeight: 600 }}
          >
            Rejoignez nous maintenant!
          </Typography>

          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Créer votre compte pour commencer
          </Typography>

          {apiError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {apiError}
            </Alert>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Grid container spacing={2}>
              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Prénom"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  onKeyDown={handleKeyPress}
                  error={!!errors.first_name}
                  helperText={errors.first_name}
                  disabled={loading}
                  autoComplete="given-name"
                  variant="outlined"
                />
              </Grid>
            

              <Grid size={6}>
                <TextField
                  fullWidth
                  label="Nom"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  onKeyDown={handleKeyPress}
                  error={!!errors.last_name}
                  helperText={errors.last_name}
                  disabled={loading}
                  autoComplete="family-name"
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
              autoComplete="email"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="Mot de passe"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
              autoComplete="new-password"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              label="Confirmer le mot de passe"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              disabled={loading}
              autoComplete="new-password"
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              select
              label="Genre"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              error={!!errors.gender}
              helperText={errors.gender}
              disabled={loading}
              variant="outlined"
            >
              <MenuItem value="male">Homme</MenuItem>
              <MenuItem value="female">Femme</MenuItem>
            </TextField>

            <Typography variant="subtitle2" sx={{ mt: 1, mb: -1, fontWeight: 600 }}>
              Adresse (France)
            </Typography>

            <TextField
              fullWidth
              label="Rue"
              name="rue"
              value={formData.rue}
              onChange={handleChange}
              onKeyDown={handleKeyPress}
              error={!!errors.rue}
              helperText={errors.rue}
              disabled={loading}
              autoComplete="street-address"
              variant="outlined"
              placeholder="e.g., 111 boulevard Victor Hugo"
            />

            <Grid container spacing={2}>
              <Grid item size={{xs:12, sm:5}}>
                <TextField
                  fullWidth
                  label="Code Postal"
                  name="codePostal"
                  value={formData.codePostal}
                  onChange={handleChange}
                  onKeyDown={handleKeyPress}
                  error={!!errors.codePostal}
                  helperText={errors.codePostal}
                  disabled={loading}
                  autoComplete="postal-code"
                  variant="outlined"
                  placeholder="e.g., 92230"
                  inputProps={{ maxLength: 5 }}
                />
              </Grid>
              <Grid item size={{xs:12, sm: 'grow'}}>
                <TextField
                  fullWidth
                  label="Ville"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  onKeyDown={handleKeyPress}
                  error={!!errors.ville}
                  helperText={errors.ville}
                  disabled={loading}
                  autoComplete="address-level2"
                  variant="outlined"
                  placeholder="e.g., Gennevilliers"
                />
              </Grid>
            </Grid>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleRegister}
              disabled={loading}
              sx={{
                mt: 1,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600
              }}
            >
              {loading ? 'Création du compte...' : 'S\'inscrire'}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Déjà un compte?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  underline="hover"
                  sx={{ fontWeight: 600 }}
                >
                  Se connecter
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert 
            variant="filled"
            severity="success" 
            icon={<CheckCircle />}
            sx={{ 
              width: '100%',
              minWidth: '300px',
              fontSize: '1rem',
              '& .MuiAlert-message': {
                fontSize: '1rem'
              }
            }}
          >
            Inscription réussie! Redirection vers la page de connexion...
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Register;