import {
  ArrowBack as ArrowBackIcon,
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
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useSnackbar } from "../../../hooks/useSnackbar";

/**
 * Profile page - User profile information and edit
 */
function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useSnackbar();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    city: "",
    postal_code: "",
    gender: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Initialiser le formulaire avec les données utilisateur depuis Redux
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        address: user.address || "",
        city: user.city || "",
        postal_code: user.postal_code || "",
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

    try {
      // TODO: Appel API pour mettre à jour le profil
      // await updateUserProfile(user.id, formData);
      console.log("Updating profile:", formData);

      setIsEditing(false);
      showSuccess("Profil mis à jour avec succès !");
    } catch (error) {
      console.error("Error updating profile:", error);
      showError("Erreur lors de la mise à jour du profil");
    }
  };

  const handleCancel = () => {
    // Réinitialiser le formulaire avec les données utilisateur
    setFormData({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone_number: user.phone_number || "",
      address: user.address || "",
      city: user.city || "",
      postal_code: user.postal_code || "",
      gender: user.gender || ""
    });
    setIsEditing(false);
    setErrors({});
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
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
    <Container maxWidth="md" sx={{ py: 4 }}>
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
              >
                <MenuItem value="">Non spécifié</MenuItem>
                <MenuItem value="male">Homme</MenuItem>
                <MenuItem value="female">Femme</MenuItem>
                <MenuItem value="other">Autre</MenuItem>
              </TextField>
            </Grid>

            {/* Adresse */}
            <Grid size={12}>
              <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
                sx={{ mt: 2 }}
              >
                Adresse
              </Typography>
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Adresse"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Numéro et nom de rue"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Code postal"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Ville"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!isEditing}
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
              <Divider sx={{ mb: 3 }} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Rôle
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {user.role === "admin" ? "Administrateur" : "Client"}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
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
              >
                Enregistrer
              </Button>
              <Button variant="outlined" onClick={handleCancel}>
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
            Sécurité
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Vous souhaitez modifier votre mot de passe ?
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate("/reset-password")}
          >
            Changer le mot de passe
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}

export default Profile;
