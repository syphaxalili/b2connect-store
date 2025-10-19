import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  TextField,
  Typography
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AuthFormContainer from "../components/common/AuthFormContainer";
import CustomSnackbar from "../components/common/CustomSnackbar";
import PasswordField from "../components/common/PasswordField";
import ForgotPasswordDialog from "../components/dialogs/ForgotPasswordDialog";
import { setAuthToken } from "../utils/storage";
import { validateEmail, validatePassword } from "../utils/validation";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [fieldsErrors, setFieldsErrors] = useState({});
  const [snackBarData, setSnackBarData] = useState({
    message: "",
    severity: "success"
  });
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] =
    useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

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
      const response = await axios.post("/api/users/login", {
        email: formData.email,
        password: formData.password
      });

      setAuthToken(response.data.token, response.data.user_id, rememberMe);
      setSnackBarData({
        severity: "success",
        message: "Connexion reussie"
      });
      setShowSnackbar(true);
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setSnackBarData({
        message: err.response.data.error,
        severity: "error"
      });
      setShowSnackbar(true);
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
            onClick={() => setForgotPasswordDialogOpen(true)}
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

      <CustomSnackbar
        severity={snackBarData.severity}
        open={showSnackbar}
        onClose={() => setShowSnackbar(false)}
        message={snackBarData.message}
      />

      {forgotPasswordDialogOpen ? (
        <ForgotPasswordDialog
          open={forgotPasswordDialogOpen}
          onClose={() => setForgotPasswordDialogOpen(false)}
          setShowSnackbar={setShowSnackbar}
          setSnackBarData={setSnackBarData}
        />
      ) : null}
    </AuthFormContainer>
  );
};

export default Login;
