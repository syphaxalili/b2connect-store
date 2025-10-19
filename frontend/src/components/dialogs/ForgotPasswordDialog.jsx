import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { validateEmail } from "../../utils/validation";

function ForgotPasswordDialog({
  open,
  onClose,
  setSnackBarData,
  setShowSnackbar
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      await axios.post("/api/users/forgot-password", {
        email
      });

      onClose();
    } catch (error) {
      setLoading(false);
      setSnackBarData({
        severity: "error",
        message: error.message
      });
      setShowSnackbar(true);
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
          {loading
            ? "Envoi en cours..."
            : "Envoyer le lien de réinitialisation"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ForgotPasswordDialog;
