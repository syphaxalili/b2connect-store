import {
  ArrowBack as ArrowBackIcon,
  ContentCopy as ContentCopyIcon,
  ExpandMore as ExpandMoreIcon
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserOrders } from "../../../api";
import { useAuth } from "../../../hooks/useAuth";
import { useSnackbar } from "../../../hooks/useSnackbar";

/**
 * Orders page - User orders list and details
 */
function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useSnackbar();

  const handleCopyTrackingNumber = (trackingNumber) => {
    navigator.clipboard.writeText(trackingNumber);
    showSuccess("Numéro de suivi copié!");
  };

  useEffect(() => {
    // Récupérer les commandes de l'utilisateur
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getUserOrders();
      // Transformer les données du backend pour le rendu
      const transformedOrders = response.data.map((order) => ({
        id: order.id,
        order_number: `ORD-${order.id.toString().padStart(6, "0")}`,
        status: order.status,
        total_amount: order.total_amount,
        shipping_fee: order.shipping_fee || 5.99,
        created_at: order.created_at,
        items: order.OrderItems || [],
        tracking_number: order.tracking_number
      }));
      setOrders(transformedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      showError("Erreur lors du chargement des commandes");
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: "⏳ En attente",
      approved: "✅ Validée",
      shipped: "📦 Expédiée",
      delivered: "🎉 Livrée",
      cancelled: "❌ Annulée"
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: "warning",
      approved: "info",
      shipped: "primary",
      delivered: "success",
      cancelled: "error"
    };
    return colorMap[status] || "default";
  };

  // Tri des commandes par statut (ordre de priorité) puis par date (récent en haut)
  const sortOrdersByStatus = (orders) => {
    const statusOrder = {
      pending: 1,
      approved: 2,
      shipped: 3,
      delivered: 4,
      cancelled: 5
    };
    return [...orders].sort((a, b) => {
      const orderA = statusOrder[a.status] || 999;
      const orderB = statusOrder[b.status] || 999;

      // Tri par statut d'abord
      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // Si même statut, tri par date (récent en haut)
      return new Date(b.created_at) - new Date(a.created_at);
    });
  };

  const sortedOrders = sortOrdersByStatus(orders);

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Vous devez être connecté pour accéder à vos commandes.
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Chargement de vos commandes...
        </Typography>
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
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Mes Commandes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {orders.length === 0
            ? "Vous n'avez pas encore passé de commande"
            : `${orders.length} commande${orders.length > 1 ? "s" : ""}`}
        </Typography>
      </Box>

      {orders.length === 0 ? (
        /* Aucune commande */
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            backgroundColor: "#f9f9f9",
            borderRadius: 2
          }}
        >
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Aucune commande
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Vous n'avez pas encore passé de commande
          </Typography>
          <Button variant="contained" onClick={() => navigate("/")}>
            Découvrir nos produits
          </Button>
        </Paper>
      ) : (
        <>
          {/* Résumé des commandes */}
          <Card elevation={0} sx={{ borderRadius: 2, mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Résumé
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" fontWeight={700} color="primary">
                      {orders.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Commandes
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      color="warning.main"
                    >
                      {orders.filter((o) => o.status === "pending").length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      En attente
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" fontWeight={700} color="info.main">
                      {orders.filter((o) => o.status === "shipped").length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      En cours
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      color="success.main"
                    >
                      {orders.filter((o) => o.status === "delivered").length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Livrées
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Liste des commandes avec Accordions */}
          <Box>
            {sortedOrders.map((order) => (
              <Accordion
                key={order.id}
                elevation={0}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  "&:before": { display: "none" },
                  border: "1px solid #e0e0e0"
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    "& .MuiAccordionSummary-content": {
                      my: 2
                    }
                  }}
                >
                  <Grid
                    container
                    spacing={2}
                    sx={{ width: "100%", pr: 2 }}
                    alignItems="center"
                  >
                    {/* N° Commande et Date */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {order.order_number}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(order.created_at).toLocaleDateString(
                            "fr-FR",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            }
                          )}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Statut */}
                    <Grid
                      size={{ xs: 12, sm: 6, md: 3 }}
                      sx={{
                        display: "flex",
                        justifyContent: { xs: "flex-start", md: "center" }
                      }}
                    >
                      <Chip
                        label={getStatusLabel(order.status)}
                        color={getStatusColor(order.status)}
                        sx={{ fontWeight: 600 }}
                      />
                    </Grid>

                    {/* Nombre d'articles */}
                    <Grid
                      size={{ xs: 12, sm: 6, md: 3 }}
                      sx={{
                        display: "flex",
                        justifyContent: { xs: "flex-start", md: "center" }
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {order.items.length} article
                        {order.items.length > 1 ? "s" : ""}
                      </Typography>
                    </Grid>

                    {/* Total */}
                    <Grid
                      size={{ xs: 12, sm: 6, md: 3 }}
                      sx={{
                        display: "flex",
                        justifyContent: { xs: "flex-start", md: "flex-end" }
                      }}
                    >
                      <Typography variant="h6" fontWeight={700} color="primary">
                        {order.total_amount} €
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionSummary>

                <AccordionDetails sx={{ pt: 0 }}>
                  <Divider sx={{ mb: 2 }} />

                  {/* Numéro de suivi */}
                  {order.tracking_number && (
                    <Box
                      sx={{
                        mb: 2,
                        p: 2,
                        backgroundColor: "#e3f2fd",
                        borderRadius: 1,
                        border: "1px solid #90caf9"
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          gap: 2
                        }}
                      >
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            Numéro de suivi
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ userSelect: "text" }}
                          >
                            {order.tracking_number}
                          </Typography>
                        </Box>
                        <Tooltip title="Copier le numéro">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleCopyTrackingNumber(order.tracking_number)
                            }
                            sx={{
                              color: "primary.main",
                              "&:hover": {
                                backgroundColor: "rgba(31, 45, 61, 0.1)"
                              }
                            }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  )}

                  {/* Articles */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      gutterBottom
                    >
                      Articles ({order.items.length})
                    </Typography>
                    {order.items.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          py: 1,
                          px: 2,
                          backgroundColor: "#f9f9f9",
                          borderRadius: 1,
                          mb: 1
                        }}
                      >
                        <Typography variant="body2">
                          {item.product?.name || "Produit inconnu"} x
                          {item.quantity}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {item.unit_price * item.quantity} €
                        </Typography>
                      </Box>
                    ))}

                    {/* Sous-total et livraison */}
                    <Box sx={{ mt: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          py: 0.5
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Sous-total
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {order.total_amount - order.shipping_fee} €
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          py: 0.5
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Frais de livraison
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {order.shipping_fee} €
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          py: 0.5
                        }}
                      >
                        <Typography variant="body1" fontWeight={700}>
                          Total
                        </Typography>
                        <Typography
                          variant="body1"
                          fontWeight={700}
                          color="primary"
                        >
                          {order.total_amount} €
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </>
      )}
    </Container>
  );
}

export default Orders;
