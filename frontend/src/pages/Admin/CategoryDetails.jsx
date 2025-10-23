import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteCategory, getCategoryById } from "../../api/categories";
import AdminBreadcrumbs from "../../components/admin/AdminBreadcrumbs";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog";
import { useSnackbar } from "../../hooks/useSnackbar";

function CategoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Charger les données de la catégorie
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await getCategoryById(id);
        setCategory(response.data);
      } catch (error) {
        showError("Erreur lors du chargement de la catégorie");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  const handleEdit = () => {
    navigate(`/admin/categories/${id}/edit`);
  };

  const handleDeleteClick = () => {
    setDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCategory(id);
      showSuccess("Catégorie supprimée avec succès!");
      navigate("/admin/categories");
    } catch (error) {
      showError("Erreur lors de la suppression de la catégorie");
      console.error(error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog(false);
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

  if (!category) {
    return (
      <Box>
        <AdminBreadcrumbs />
        <Typography>Catégorie non trouvée</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <AdminBreadcrumbs customLabel={category.name} />

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
                {category.product_count || "Non disponible"}
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
