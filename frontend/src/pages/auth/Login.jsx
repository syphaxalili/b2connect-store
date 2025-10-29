import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import { useSnackbar } from "../../hooks/useSnackbar";
import { setUser } from "../../store/slices/authSlice";
import { setAuthToken, setUserData } from "../../utils/storage";
import { validateEmail, validatePassword } from "../../utils/validation";
import PasswordField from "./components/PasswordField";
import ForgotPasswordDialog from "./dialogs/ForgotPasswordDialog";

const Login = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [fieldsErrors, setFieldsErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openPasswordResetDialog, setOpenPasswordResetDialog] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (fieldsErrors[name]) {
      setFieldsErrors((prev) => ({
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

    setFieldsErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const response = await login({
        email: formData.email,
        password: formData.password
      });

      const { token, name, email, role } = response.data;

      const userData = { name, email, role };

      // Sauvegarder les données utilisateur dans Redux et storage
      dispatch(setUser(userData));
      setAuthToken(token, rememberMe);
      setUserData(userData, rememberMe);

      showSuccess("Connexion réussie!");

      // Rediriger selon le rôle
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Erreur de connexion";
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleLogin();
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
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

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Adresse mail"
          name="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          error={!!fieldsErrors.email}
          helperText={fieldsErrors.email}
          disabled={loading}
        />

        <PasswordField
          label="Mot de passe"
          name="password"
          autoComplete="current-password"
          value={formData.password}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          error={!!fieldsErrors.password}
          helperText={fieldsErrors.password}
          disabled={loading}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={({ target }) => setRememberMe(target.checked)}
                disabled={loading}
                color="primary"
              />
            }
            label="Se souvenir de moi"
          />
          <Link
            component="button"
            variant="body2"
            onClick={() => setOpenPasswordResetDialog(true)}
            underline="hover"
            sx={{ fontWeight: 600, cursor: "pointer" }}
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
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 600
          }}
        >
          {loading ? "Connexion en cours..." : "Se connecter"}
        </Button>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Pas de compte?{" "}
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

      {openPasswordResetDialog ? (
        <ForgotPasswordDialog
          open={openPasswordResetDialog}
          onClose={() => setOpenPasswordResetDialog(false)}
        />
      ) : null}
    </Box>
  );
};

export default Login;
