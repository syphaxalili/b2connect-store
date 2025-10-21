import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminBreadcrumbs from "../../components/admin/AdminBreadcrumbs";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog";
import { useSnackbar } from "../../hooks/useSnackbar";

// Mock data - à remplacer par un appel API
const mockCategory = {
  id: 1,
  name: "Électronique",
  description: "Produits électroniques et gadgets",
  created_at: "2024-01-15T10:30:00Z",
  product_count: 45
};

function CategoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess } = useSnackbar();
  const [category] = useState(mockCategory);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const breadcrumbItems = [
    { label: "Admin", path: "/admin" },
    { label: "Catégories", path: "/admin/categories" },
    { label: category.name, path: `/admin/categories/${id}` }
  ];

  const handleEdit = () => {
    navigate(`/admin/categories/${id}/edit`);
  };

  const handleDeleteClick = () => {
    setDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    // TODO: Appeler l'API pour supprimer
    showSuccess("Catégorie supprimée avec succès!");
    navigate("/admin/categories");
  };

  const handleDeleteCancel = () => {
    setDeleteDialog(false);
  };

  return (
    <Box>
      <AdminBreadcrumbs items={breadcrumbItems} />

      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 3
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {category.name}
              </Typography>
              <Chip
                label={`${category.product_count} produits`}
                color="primary"
                size="small"
              />
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEdit}
              >
                Modifier
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
              >
                Supprimer
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                ID
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                #{category.id}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Date de création
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {new Date(category.created_at).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Description
              </Typography>
              <Typography variant="body1">
                {category.description || "Aucune description"}
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Nombre de produits
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {category.product_count} produits dans cette catégorie
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialog}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ? Cette action est irréversible.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}

export default CategoryDetails;
