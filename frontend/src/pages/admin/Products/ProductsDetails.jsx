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
  Divider,
  Grid,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteProduct, getCategoryById, getProductById } from "../../../api";
import AdminBreadcrumbs from "../../../components/admin/AdminBreadcrumbs";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useSelector } from "react-redux";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const loading = useSelector((state) => state.loading.requestCount > 0);

  // Charger les données du produit et sa catégorie
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        const productData = response.data;
        setProduct(productData);

        // Récupérer la catégorie si elle existe
        if (productData.category_id) {
          const categoryResponse = await getCategoryById(
            productData.category_id
          );
          setCategory(categoryResponse.data);
        }
      } catch {
        showError("Erreur lors du chargement du produit");
      }
    };
    fetchProduct();
  }, [id]);

  const handleEdit = () => {
    navigate(`/admin/products/${id}/edit`);
  };

  const handleDeleteClick = () => {
    setDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(id);
      showSuccess("Produit supprimé avec succès!");
      navigate("/admin/products");
    } catch {
      showError("Erreur lors de la suppression du produit");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog(false);
  };

  const handleBack = () => {
    navigate("/admin/products");
  };

  const renderSpecificationValue = (value, dataType) => {
    if (value === null || value === undefined) return "N/A";

    switch (dataType) {
      case "boolean":
        return value ? "Oui" : "Non";
      case "date":
        return new Date(value).toLocaleDateString("fr-FR");
      case "number":
        return value.toString();
      default:
        return value.toString();
    }
  };

  return !loading && (
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
      <AdminBreadcrumbs customLabel={product?.name} />

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
          {product?.name || `Produit ${id}`}
        </Typography>
      </Box>

      {!product ? (
        <Box sx={{ flexGrow: 1 }}>
          <Alert severity="error">Produit non trouvé</Alert>
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
                  {product.name}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Catégorie
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Chip
                    label={category?.name || "N/A"}
                    color="primary"
                    size="small"
                  />
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Marque
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {product.brand}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Prix
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {product.price.toFixed(2)} €
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Stock
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Chip
                    label={product.stock}
                    color={product.stock > 0 ? "success" : "error"}
                    size="small"
                  />
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Paper sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Date de création
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {new Date(product.created_at).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </Typography>
              </Paper>
            </Grid>

            {product.images && product.images.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Paper sx={{ px: 2, py: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Images
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexWrap: "wrap"
                    }}
                  >
                    {product.images.map((image, index) => (
                      <Box
                        key={index}
                        component="img"
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        loading="lazy"
                        sx={{
                          width: 150,
                          height: 150,
                          objectFit: "cover",
                          borderRadius: 1,
                          border: "1px solid",
                          borderColor: "divider"
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>
            )}

            {product.specifications &&
              Object.keys(product.specifications).length > 0 &&
              category?.specs && (
                <Grid size={{ xs: 12 }}>
                  <Paper sx={{ px: 2, py: 2 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      sx={{ mb: 2 }}
                    >
                      Spécifications
                    </Typography>
                    <Grid container spacing={2}>
                      {category.specs.map((spec) => {
                        const value = product.specifications[spec.name];
                        return (
                          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={spec.name}>
                            <Paper
                              variant="outlined"
                              sx={{ px: 2, py: 1.5, height: "100%" }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: "block", mb: 0.5 }}
                              >
                                {spec.label}
                              </Typography>
                              <Typography variant="body2" fontWeight={500}>
                                {renderSpecificationValue(value, spec.dataType)}
                              </Typography>
                            </Paper>
                          </Grid>
                        );
                      })}
                    </Grid>
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
        message={`Êtes-vous sûr de vouloir supprimer le produit "${product?.name}" ? Cette action est irréversible.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}

export default ProductDetails;
