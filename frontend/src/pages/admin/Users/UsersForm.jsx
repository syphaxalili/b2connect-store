import { Save as SaveIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createUser, getUserById, updateUser } from "../../../api";
import AdminBreadcrumbs from "../../../components/admin/AdminBreadcrumbs";
import { useSnackbar } from "../../../hooks/useSnackbar";
import {
  validateCity,
  validateEmail,
  validatePostalCode,
  validateRequired
} from "../../../utils/validation";

function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const isEditMode = id && id !== "new";

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    gender: "",
    phone_number: "",
    role: "client",
    rue: "",
    codePostal: "",
    ville: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Charger les données en mode édition
  useEffect(() => {
    if (isEditMode) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const response = await getUserById(id);
          const user = response.data;

          setFormData({
            email: user.email || "",
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            gender: user.gender || "",
            phone_number: user.phone_number || "",
            role: user.role || "client",
            rue: user.address?.street || "",
            codePostal: user.address?.postal_code || "",
            ville: user.address?.city || ""
          });
        } catch (error) {
          showError("Erreur lors du chargement de l'utilisateur");
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);

      const dataToSave = {
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: formData.gender,
        phone_number: formData.phone_number,
        role: formData.role,
        address: {
          street: formData.rue,
          postal_code: formData.codePostal,
          city: formData.ville
        }
      };

      if (isEditMode) {
        await updateUser(id, dataToSave);
        showSuccess("Utilisateur modifié avec succès!");
      } else {
        await createUser(dataToSave);
        showSuccess("Utilisateur créé avec succès!");
      }
      navigate("/admin/users");
    } catch (error) {
      showError(
        error.response?.data?.error ||
          "Erreur lors de l'enregistrement de l'utilisateur"
      );
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/users");
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, maxWidth: { lg: "1200px" }, mx: "auto" }}>
      <AdminBreadcrumbs />

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {isEditMode ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {isEditMode
              ? "Modifiez les informations de l'utilisateur"
              : "Remplissez les informations du nouvel utilisateur"}
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  select
                  label="Rôle"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  error={!!errors.role}
                  helperText={errors.role}
                  required
                  disabled={submitting}
                >
                  <MenuItem value="client">Client</MenuItem>
                  <MenuItem value="admin">Administrateur</MenuItem>
                </TextField>
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
                  required
                  disabled={submitting}
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
                  required
                  disabled={submitting}
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
                  required
                  disabled={submitting}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Numéro de téléphone"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  disabled={submitting}
                  autoComplete="tel"
                  placeholder="e.g., +33 1 23 45 67 89"
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
                  error={!!errors.gender}
                  helperText={errors.gender}
                  required
                  disabled={submitting}
                >
                  <MenuItem value="male">Homme</MenuItem>
                  <MenuItem value="female">Femme</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: 600 }}>
                  Adresse (France)
                </Typography>
              </Grid>

              <TextField
                fullWidth
                label="Rue"
                name="rue"
                value={formData.rue}
                onChange={handleChange}
                error={!!errors.rue}
                helperText={errors.rue}
                required
                disabled={submitting}
                placeholder="e.g., 111 boulevard Victor Hugo"
              />

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Code Postal"
                  name="codePostal"
                  value={formData.codePostal}
                  onChange={handleChange}
                  error={!!errors.codePostal}
                  helperText={errors.codePostal}
                  required
                  disabled={submitting}
                  placeholder="e.g., 92230"
                  inputProps={{ maxLength: 5 }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Ville"
                  name="ville"
                  value={formData.ville}
                  onChange={handleChange}
                  error={!!errors.ville}
                  helperText={errors.ville}
                  required
                  disabled={submitting}
                  placeholder="e.g., Gennevilliers"
                />
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={submitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={
                  submitting ? <CircularProgress size={20} /> : <SaveIcon />
                }
                disabled={submitting}
              >
                {submitting
                  ? "Enregistrement..."
                  : isEditMode
                    ? "Enregistrer"
                    : "Créer"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default UserForm;
