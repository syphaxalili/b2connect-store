import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword, verifyResetToken } from "../../../api/auth";
import PasswordField from "../../../components/auth/PasswordField";
import { useSnackbar } from "../../../hooks/useSnackbar";
import AuthFormContainer from "../../../layouts/auth";
import { validatePassword } from "../../../utils/validation";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSuccess, showError } = useSnackbar();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [fieldsErrors, setFieldsErrors] = useState({});

  // Vérifier le token au chargement
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        showError("Token manquant");
        setTimeout(() => navigate("/login"), 1000);
        return;
      }

      try {
        await verifyResetToken(token);
        setTokenValid(true);
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "Token invalide ou expiré";
        showError(errorMessage);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

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

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer le mot de passe";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }

    setFieldsErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword({
        token,
        newPassword: formData.password
      });

      showSuccess("Mot de passe réinitialisé avec succès!");
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Erreur lors de la réinitialisation";
      showError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !submitting) {
      handleSubmit();
    }
  };

  if (loading) {
    return (
      <AuthFormContainer>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            gap: 2
          }}
        >
          <CircularProgress />
          <Typography color="text.secondary">
            Vérification du lien...
          </Typography>
        </Box>
      </AuthFormContainer>
    );
  }

  if (!tokenValid) {
    return (
      <AuthFormContainer>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "400px",
            gap: 2
          }}
        >
          <Typography variant="h6" color="error">
            Lien invalide ou expiré
          </Typography>
          <Typography color="text.secondary" align="center">
            Redirection vers la page de connexion...
          </Typography>
        </Box>
      </AuthFormContainer>
    );
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
        Réinitialiser votre mot de passe
      </Typography>

      <Typography
        variant="body1"
        align="center"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Entrez votre nouveau mot de passe ci-dessous
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <PasswordField
          label="Nouveau mot de passe"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          error={!!fieldsErrors.password}
          helperText={fieldsErrors.password}
          disabled={submitting}
        />

        <PasswordField
          label="Confirmer le mot de passe"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onKeyDown={handleKeyPress}
          error={!!fieldsErrors.confirmPassword}
          helperText={fieldsErrors.confirmPassword}
          disabled={submitting}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={submitting}
          sx={{
            mt: 2,
            py: 1.5,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 600
          }}
        >
          {submitting ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
        </Button>
      </Box>
    </AuthFormContainer>
  );
};

export default ResetPassword;
