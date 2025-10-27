import {
  Box,
  Button,
  Grid,
  Link,
  MenuItem,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { register } from "../../api/auth";
import { useSnackbar } from "../../hooks/useSnackbar";
import {
  validateCity,
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validatePostalCode,
  validateRequired
} from "../../utils/validation";
import PasswordField from "./components/PasswordField";
import AuthFormContainer from "./layouts/AuthFormContainer";

const Register = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    gender: "",
    phone_number: "",
    rue: "",
    codePostal: "",
    ville: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    const firstNameError = validateRequired(formData.first_name, "Prénom");
    if (firstNameError) newErrors.first_name = firstNameError;

    const lastNameError = validateRequired(formData.last_name, "Nom");
    if (lastNameError) newErrors.last_name = lastNameError;

    const genderError = validateRequired(formData.gender, "Genre");
    if (genderError) newErrors.gender = genderError;

    const rueError = validateRequired(formData.rue, "Rue");
    if (rueError) newErrors.rue = rueError;

    const codePostalError = validatePostalCode(formData.codePostal);
    if (codePostalError) newErrors.codePostal = codePostalError;

    const villeError = validateCity(formData.ville);
    if (villeError) newErrors.ville = villeError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const formattedAddress = `${formData.rue}, ${formData.codePostal} ${formData.ville}, France`;

    try {
      await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: formData.gender,
        phone_number: formData.phone_number,
        address: formattedAddress
      });

      showSuccess("Registration successful!");

      navigate("/login");
    } catch (error) {
      showError(
        error.response.data.error || "Registration failed. Please try again."
      );

      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleRegister();
    }
  };

  return (
    <AuthFormContainer>
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

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
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

        <PasswordField
          fullWidth
          label="Mot de passe"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          error={!!errors.password}
          helperText={errors.password}
          disabled={loading}
          autoComplete="new-password"
          variant="outlined"
        />

        <PasswordField
          fullWidth
          label="Confirmer le mot de passe"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          disabled={loading}
          autoComplete="new-password"
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

        <TextField
          fullWidth
          label="Numéro de téléphone"
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          disabled={loading}
          autoComplete="tel"
          variant="outlined"
          placeholder="e.g., +33 1 23 45 67 89"
        />

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
          <Grid item size={{ xs: 12, sm: 5 }}>
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
          <Grid item size={{ xs: 12, sm: "grow" }}>
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
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 600
          }}
        >
          {loading ? "Création du compte..." : "S'inscrire"}
        </Button>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Déjà un compte?{" "}
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
    </AuthFormContainer>
  );
};

export default Register;
