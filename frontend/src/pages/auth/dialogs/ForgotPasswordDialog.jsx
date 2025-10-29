import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import { requestPasswordReset } from "../../../api/auth";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { validateEmail } from "../../../utils/validation";

function ForgotPasswordDialog({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showSuccess, showError } = useSnackbar();

  const handleForgotPassword = async () => {
    setLoading(true);
    setError("");

    const isMailError = validateEmail(email);
    if (isMailError) {
      setError(isMailError);
      setLoading(false);
      return;
    }

    try {
      const response = await requestPasswordReset({ email });
      showSuccess(response.data.message);
      setEmail("");
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message;
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleForgotPassword();
    }
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
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
          variant="outlined"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          error={!!error}
          helperText={error}
          onChange={(e) => {
            setError("");
            setEmail(e.target.value);
          }}
          onKeyDown={handleKeyPress}
          disabled={loading}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          onClick={handleForgotPassword}
          variant="contained"
          disabled={loading}
        >
          {loading ? "Envoi en cours..." : "Envoyer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ForgotPasswordDialog;
