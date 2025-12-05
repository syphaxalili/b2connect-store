import {
  ArrowBack as ArrowBackIcon,
  DeleteForever as DeleteForeverIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography,
  useTheme
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteAccount, requestPasswordReset, updateUser } from "../../../api";
import { useAuth } from "../../../hooks/useAuth";
import { useLogout } from "../../../hooks/useLogout";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { setCredentials } from "../../../store/slices/authSlice";

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user } = useAuth();
  const { logout } = useLogout();
  const { showSuccess, showError } = useSnackbar();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    street: "",
    postal_code: "",
    city: "",
    gender: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        street: user.address?.street || "",
        postal_code: user.address?.postal_code || "",
        city: user.address?.city || "",
        gender: user.gender || ""
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.first_name.trim())
      newErrors.first_name = "Le prénom est requis";
    if (!formData.last_name.trim()) newErrors.last_name = "Le nom est requis";
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email invalide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const dataToSend = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        gender: formData.gender,
        address: {
          street: formData.street,
          postal_code: formData.postal_code,
          city: formData.city
        }
      };

      const response = await updateUser(user.id, dataToSend);

      dispatch(setCredentials(response.data));

      setIsEditing(false);
      showSuccess("Profil mis à jour avec succès !");
    } catch (error) {
      console.error("Error updating profile:", error);
      showError(
        error.response?.data?.message ||
          "Erreur lors de la mise à jour du profil"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Réinitialiser le formulaire avec les données utilisateur
    setFormData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone_number: user.phone_number || "",
      street: user.address?.street || "",
      postal_code: user.address?.postal_code || "",
      city: user.address?.city || "",
      gender: user.gender || ""
    });
    setIsEditing(false);
    setErrors({});
  };

  const handlePasswordReset = async () => {
    setLoading(true);
    try {
      await requestPasswordReset({ email: user.email });
      showSuccess("Un email de réinitialisation a été envoyé à votre adresse.");
    } catch (error) {
      showError(
        error.response?.data?.message || "Erreur lors de l'envoi de l'email"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      await deleteAccount();
      showSuccess("Votre compte a été supprimé avec succès");
      // Déconnecter et rediriger vers la page d'accueil
      logout("/");
    } catch {
      showError("Erreur lors de la suppression du compte");
      setDeleteDialogOpen(false);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Alert severity="warning">
          Vous devez être connecté pour accéder à cette page.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/login")}
          sx={{ mt: 2 }}
        >
          Se connecter
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{ mb: 2 }}
        >
          Retour
        </Button>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <Typography variant="h3" fontWeight={700}>
            Mon Profil
          </Typography>
          {!isEditing && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
            >
              Modifier
            </Button>
          )}
        </Box>
      </Box>

      {/* Error Message */}
      {errors.general && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errors.general}
        </Alert>
      )}

      {/* Profile Card */}
      <Card elevation={0} sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {/* Informations personnelles */}
            <Grid size={12}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Informations personnelles
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Prénom"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                error={!!errors.first_name}
                helperText={errors.first_name}
                disabled={!isEditing}
                required
                sx={{
                  "& .MuiOutlinedInput-root.Mui-disabled:hover .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: theme.palette.action.disabled
                    }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Nom"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                error={!!errors.last_name}
                helperText={errors.last_name}
                disabled={!isEditing}
                required
                sx={{
                  "& .MuiOutlinedInput-root.Mui-disabled:hover .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: theme.palette.action.disabled
                    }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={!isEditing}
                required
                sx={{
                  "& .MuiOutlinedInput-root.Mui-disabled:hover .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: theme.palette.action.disabled
                    }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Téléphone"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="+33 6 12 34 56 78"
                sx={{
                  "& .MuiOutlinedInput-root.Mui-disabled:hover .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: theme.palette.action.disabled
                    }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                select
                label="Genre"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
                sx={{
                  "& .MuiOutlinedInput-root.Mui-disabled:hover .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: theme.palette.action.disabled
                    }
                }}
              >
                <MenuItem value="male">Homme</MenuItem>
                <MenuItem value="female">Femme</MenuItem>
              </TextField>
            </Grid>

            {/* Adresse */}
            <Grid size={12}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Adresse (France)
              </Typography>
              <Divider />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Rue"
                name="street"
                value={formData.street}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g., 111 boulevard Victor Hugo"
                sx={{
                  "& .MuiOutlinedInput-root.Mui-disabled:hover .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: theme.palette.action.disabled
                    }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 5 }}>
              <TextField
                fullWidth
                label="Code Postal"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g., 92230"
                slotProps={{
                  input: {
                    maxLength: 5
                  }
                }}
                sx={{
                  "& .MuiOutlinedInput-root.Mui-disabled:hover .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: (theme) => theme.palette.action.disabled
                    }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 7 }}>
              <TextField
                fullWidth
                label="Ville"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g., Gennevilliers"
                sx={{
                  "& .MuiOutlinedInput-root.Mui-disabled:hover .MuiOutlinedInput-notchedOutline":
                    {
                      borderColor: theme.palette.action.disabled
                    }
                }}
              />
            </Grid>

            {/* Informations compte */}
            <Grid size={12}>
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                sx={{ mt: 2 }}
              >
                Informations du compte
              </Typography>
              <Divider />
            </Grid>

            <Grid size={12}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Membre depuis
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {user.created_at
                    ? new Date(user.created_at).toLocaleDateString("fr-FR")
                    : "N/A"}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          {isEditing && (
            <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={loading}
              >
                Annuler
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Change Password Section */}
      <Card elevation={0} sx={{ borderRadius: 2, mt: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Modifier le mot de passe
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Pour modifier votre mot de passe, nous vous enverrons un lien de
            réinitialisation par email.
          </Typography>
          <Button
            variant="outlined"
            onClick={handlePasswordReset}
            disabled={loading}
          >
            {loading ? "Envoi en cours..." : "Recevoir le lien par email"}
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account Section */}
      <Card elevation={0} sx={{ borderRadius: 2, mt: 3, borderColor: "error.main" }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" fontWeight={600} gutterBottom color="error">
            Zone de danger
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            La suppression de votre compte est irréversible. Toutes vos données seront
            définitivement supprimées.
          </Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteForeverIcon />}
            onClick={() => setDeleteDialogOpen(true)}
            disabled={loading}
          >
            Supprimer mon compte
          </Button>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !loading && setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            color: "error.main"
          }}
        >
          Confirmer la suppression du compte
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est
            <strong> irréversible</strong> et entraînera la suppression de :
          </DialogContentText>
          <Box component="ul" sx={{ mt: 2, pl: 2 }}>
            <Typography component="li" variant="body2" color="text.secondary">
              Toutes vos informations personnelles
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Votre historique de commandes
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Votre panier en cours
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              Tous vos paramètres de compte
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            variant="contained"
            disabled={loading}
            startIcon={<DeleteForeverIcon />}
          >
            {loading ? "Suppression..." : "Supprimer définitivement"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Profile;
