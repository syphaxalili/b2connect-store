import { Save as SaveIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminBreadcrumbs from "../../components/admin/AdminBreadcrumbs";
import { useSnackbar } from "../../hooks/useSnackbar";

function CategoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess } = useSnackbar();
  const isEditMode = id !== "new";

  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // TODO: Appeler l'API pour créer/modifier
    showSuccess(
      isEditMode
        ? "Catégorie modifiée avec succès!"
        : "Catégorie créée avec succès!"
    );
    navigate("/admin/categories");
  };

  const handleCancel = () => {
    navigate("/admin/categories");
  };

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
            />

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={handleCancel}>
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
              >
                {isEditMode ? "Enregistrer" : "Créer"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default CategoryForm;
