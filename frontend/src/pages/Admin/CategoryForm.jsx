import { Save as SaveIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCategory,
  getCategoryById,
  updateCategory
} from "../../api/categories";
import AdminBreadcrumbs from "../../components/admin/AdminBreadcrumbs";
import { useSnackbar } from "../../hooks/useSnackbar";

function CategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const isEditMode = id && id !== "new";

  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const breadcrumbItems = [
    { label: "Admin", path: "/admin" },
    { label: "Catégories", path: "/admin/categories" },
    {
      label: isEditMode ? "Modifier" : "Nouvelle catégorie",
      path: isEditMode
        ? `/admin/categories/${id}/edit`
        : "/admin/categories/new"
    }
  ];

  // Charger les données en mode édition
  useEffect(() => {
    if (isEditMode) {
      const fetchCategory = async () => {
        try {
          setLoading(true);
          const response = await getCategoryById(id);
          setFormData({
            name: response.data.name,
            description: response.data.description || ""
          });
        } catch (error) {
          showError("Erreur lors du chargement de la catégorie");
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchCategory();
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
    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      if (isEditMode) {
        await updateCategory(id, formData);
        showSuccess("Catégorie modifiée avec succès!");
      } else {
        await createCategory(formData);
        showSuccess("Catégorie créée avec succès!");
      }
      navigate("/admin/categories");
    } catch (error) {
      showError(
        error.response?.data?.error ||
          "Erreur lors de l'enregistrement de la catégorie"
      );
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/categories");
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
    <Box>
      <AdminBreadcrumbs items={breadcrumbItems} />

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {isEditMode ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {isEditMode
              ? "Modifiez les informations de la catégorie"
              : "Remplissez les informations de la nouvelle catégorie"}
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              fullWidth
              label="Nom de la catégorie"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
              disabled={submitting}
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              error={!!errors.description}
              helperText={errors.description}
              disabled={submitting}
            />

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

export default CategoryForm;
