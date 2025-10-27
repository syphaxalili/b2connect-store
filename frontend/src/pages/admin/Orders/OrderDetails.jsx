import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Save as SaveIcon
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteOrder,
  getOrderById,
  updateOrderStatus
} from "../../../api/orders";
import { getProducts } from "../../../api/products";
import AdminBreadcrumbs from "../../../components/admin/AdminBreadcrumbs";
import ConfirmDialog from "../../../components/dialogs/ConfirmDialog";
import { useSnackbar } from "../../../hooks/useSnackbar";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const orderResponse = await getOrderById(id);
        const orderData = orderResponse.data;
        setOrder(orderData);
        setStatus(orderData.status);
        setTrackingNumber(orderData.tracking_number || "");

        // Récupérer les produits MongoDB
        const productsResponse = await getProducts();
        const productsMap = {};
        productsResponse.data.forEach((product) => {
          productsMap[product._id] = product;
        });
        setProducts(productsMap);
      } catch (error) {
        showError("Erreur lors du chargement de la commande");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleStatusSave = async () => {
    // Si passage à "shipped", forcer la saisie du numéro de suivi
    if (status === "shipped" && !trackingNumber.trim()) {
      showError("Veuillez entrer un numéro de suivi pour expédier la commande");
      return;
    }

    try {
      setUpdating(true);
      await updateOrderStatus(
        id,
        status,
        status === "shipped" ? trackingNumber : null
      );
      showSuccess("Statut mis à jour avec succès!");
      setOrder((prev) => ({
        ...prev,
        status,
        tracking_number:
          status === "shipped" ? trackingNumber : prev.tracking_number
      }));
    } catch (error) {
      showError("Erreur lors de la mise à jour du statut");
      console.error(error);
      setStatus(order.status);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteOrder(id);
      showSuccess("Commande supprimée avec succès!");
      navigate("/admin/orders");
    } catch (error) {
      showError("Erreur lors de la suppression de la commande");
      console.error(error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog(false);
  };

  const handleBack = () => {
    navigate("/admin/orders");
  };

  // const getStatusLabel = (status) => {
  //   const labels = {
  //     pending: "En attente",
  //     shipped: "Expédiée",
  //     delivered: "Livrée",
  //     cancelled: "Annulée"
  //   };
  //   return labels[status] || status;
  // };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px"
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ p: 2 }}>
        <AdminBreadcrumbs />
        <Alert severity="error">Commande non trouvée</Alert>
      </Box>
    );
  }

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
      <AdminBreadcrumbs />

      <Box sx={{ flexGrow: 1, width: "100%" }}>
        <Grid container spacing={2} sx={{ width: "100%" }}>
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Numéro de commande
              </Typography>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
                {order.id}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper
              sx={{
                px: 2,
                py: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Client
                </Typography>
                <Typography variant="body1" sx={{ mb: 0.5 }}>
                  {`${order.User?.first_name || ""} ${order.User?.last_name || ""}`.trim() ||
                    "N/A"}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {order.User?.email || "N/A"}
                </Typography>
                {order.User?.address && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {order.User.address}
                  </Typography>
                )}
                {order.User?.phone_number && (
                  <Typography variant="body2" color="text.secondary">
                    {order.User.phone_number}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper
              sx={{
                px: 2,
                py: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                  Statut
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <FormControl
                    size="small"
                    disabled={updating}
                    sx={{ flex: 1 }}
                  >
                    <Select value={status} onChange={handleStatusChange}>
                      {order.status === "pending" && [
                        <MenuItem key="pending" value="pending">
                          En attente
                        </MenuItem>,
                        <MenuItem key="approved" value="approved">
                          Validée
                        </MenuItem>,
                        <MenuItem key="cancelled" value="cancelled">
                          Annulée
                        </MenuItem>
                      ]}
                      {order.status === "approved" && [
                        <MenuItem key="approved" value="approved">
                          Validée
                        </MenuItem>,
                        <MenuItem key="shipped" value="shipped">
                          Expédiée
                        </MenuItem>,
                        <MenuItem key="cancelled" value="cancelled">
                          Annulée
                        </MenuItem>
                      ]}
                      {order.status === "shipped" && [
                        <MenuItem key="shipped" value="shipped">
                          Expédiée
                        </MenuItem>,
                        <MenuItem key="delivered" value="delivered">
                          Livrée
                        </MenuItem>
                      ]}
                      {order.status === "delivered" && [
                        <MenuItem key="delivered" value="delivered">
                          Livrée
                        </MenuItem>
                      ]}
                      {order.status === "cancelled" && [
                        <MenuItem key="cancelled" value="cancelled">
                          Annulée
                        </MenuItem>
                      ]}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<SaveIcon />}
                    onClick={handleStatusSave}
                    disabled={updating || status === order.status}
                  >
                    Enregistrer
                  </Button>
                </Stack>
                {status === "shipped" && order.status === "approved" && (
                  <TextField
                    fullWidth
                    size="small"
                    label="Numéro de suivi"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Ex: 1Z999AA10123456784"
                    sx={{ mt: 2 }}
                    required
                  />
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper
              sx={{
                px: 2,
                py: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Montant total
                </Typography>
                <Typography variant="h6" color="primary">
                  {parseFloat(order.total_amount).toFixed(2)} €
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Paper
              sx={{
                px: 2,
                py: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Date de commande
                </Typography>
                <Typography variant="body1">
                  {new Date(order.created_at).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {order.status === "shipped" && (
            <Grid size={{ xs: 12 }}>
              <Paper
                sx={{
                  px: 2,
                  py: 1,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Numéro de suivi
                  </Typography>
                  <Typography variant="body1">
                    {trackingNumber || "Non disponible"}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          )}

          {order.OrderItems && order.OrderItems.length > 0 && (
            <Grid size={{ xs: 12 }}>
              <Paper sx={{ px: 2, py: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  Articles commandés
                </Typography>
                <TableContainer sx={{ maxHeight: 400, overflowY: "auto" }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, bgcolor: "grey.50" }}>
                          Produit
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontWeight: 600, bgcolor: "grey.50" }}
                        >
                          Quantité
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontWeight: 600, bgcolor: "grey.50" }}
                        >
                          Prix unitaire
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ fontWeight: 600, bgcolor: "grey.50" }}
                        >
                          Total
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.OrderItems.map((item) => {
                        const product = products[item.product_id];
                        return (
                          <TableRow key={item.id} hover>
                            <TableCell>
                              {product?.name || `Produit ${item.product_id}`}
                            </TableCell>
                            <TableCell align="center">
                              {item.quantity}
                            </TableCell>
                            <TableCell align="right">
                              {parseFloat(item.unit_price).toFixed(2)} €
                            </TableCell>
                            <TableCell align="right">
                              {(
                                item.quantity * parseFloat(item.unit_price)
                              ).toFixed(2)}{" "}
                              €
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow sx={{ bgcolor: "grey.50" }}>
                        <TableCell colSpan={3} align="right">
                          <Typography variant="subtitle1" fontWeight={600}>
                            Total
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            color="primary"
                          >
                            {parseFloat(order.total_amount).toFixed(2)} €
                          </Typography>
                        </TableCell>
                      </TableRow>
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
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
          >
            Supprimer
          </Button>
        </Stack>
      </Box>

      <ConfirmDialog
        open={deleteDialog}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer la commande n°${order.id} ? Cette action est irréversible.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}

export default OrderDetails;
