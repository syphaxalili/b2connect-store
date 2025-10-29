import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteCategory, getCategoryById } from "../../../api/categories";
import AdminBreadcrumbs from "../../../components/admin/AdminBreadcrumbs";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { useSnackbar } from "../../../hooks/useSnackbar";

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

  const handleBack = () => {
    navigate("/admin/categories");
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { lg: "1200px" },
        height: "100%",
        mt: {
          xs: 0,
          md: 2
        },
        mx: "auto",
        px: { xs: 2, sm: 2, md: 3 },
        pb: 2
      }}
    >
      <AdminBreadcrumbs customLabel={category?.name} />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          fontWeight={600}
          sx={{ mb: 2, mt: 2 }}
        >
          {category?.name || `Catégorie ${id}`}
        </Typography>
      </Box>

      {loading ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            minHeight: "400px"
          }}
        >
          <CircularProgress />
        </Box>
      ) : !category ? (
        <Box sx={{ flexGrow: 1 }}>
          <Alert severity="error">Catégorie non trouvée</Alert>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          <Grid container spacing={2} sx={{ width: "100%" }}>
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Nom
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {category.name}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Paper sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Description
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {category.description || "Aucune description"}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Nombre de produits
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {category.product_count}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Date de création
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {new Date(category.created_at).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </Typography>
              </Paper>
            </Grid>

            {category.specs && category.specs.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Paper sx={{ width: "100%", overflow: "hidden" }}>
                  <Box sx={{ px: 2, pt: 2, pb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Spécifications
                    </Typography>
                  </Box>
                  <TableContainer sx={{ overflowX: "auto" }}>
                    <Table sx={{ minWidth: 500 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            sx={{ fontWeight: 600, bgcolor: "grey.50" }}
                          >
                            Label
                          </TableCell>
                          <TableCell
                            sx={{ fontWeight: 600, bgcolor: "grey.50" }}
                          >
                            Type de données
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ fontWeight: 600, bgcolor: "grey.50" }}
                          >
                            Requis
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {category.specs.map((spec, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 }
                            }}
                          >
                            <TableCell component="th" scope="row">
                              <Typography variant="body2" fontWeight={500}>
                                {spec.label}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={spec.dataType}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={spec.required ? "Oui" : "Non"}
                                size="small"
                                color={spec.required ? "success" : "default"}
                                variant={spec.required ? "filled" : "outlined"}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            )}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
            >
              Retour
            </Button>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
              >
                Modifier
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
              >
                Supprimer
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}

      <ConfirmDialog
        open={deleteDialog}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer la catégorie "${category?.name}" ? Cette action est irréversible.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}

export default CategoryDetails;
