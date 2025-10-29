import {
  ArrowBack as ArrowBackIcon,
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
  Container,
  Divider,
  Grid,
  Paper,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

/**
 * Orders page - User orders list and details
 */
function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  // Données temporaires des commandes (à remplacer par un appel API)
  const mockOrders = [
    {
      id: "1",
      order_number: "ORD-2024-001",
      status: "delivered",
      total: 129.97,
      shipping: 5.99,
      created_at: "2024-01-15T10:30:00",
      items: [
        {
          name: "Batterie Dell Latitude E6420",
          quantity: 2,
          price: 49.99
        },
        {
          name: "Chargeur HP 65W",
          quantity: 1,
          price: 29.99
        }
      ],
      tracking_number: "FR123456789"
    },
    {
      id: "2",
      order_number: "ORD-2024-002",
      status: "shipped",
      total: 79.98,
      shipping: 5.99,
      created_at: "2024-01-20T14:20:00",
      items: [
        {
          name: "Souris Logitech MX Master 3",
          quantity: 1,
          price: 79.98
        }
      ],
      tracking_number: "FR987654321"
    },
    {
      id: "3",
      order_number: "ORD-2024-003",
      status: "pending",
      total: 159.99,
      shipping: 5.99,
      created_at: "2024-01-25T09:15:00",
      items: [
        {
          name: "Clavier mécanique RGB",
          quantity: 1,
          price: 159.99
        }
      ],
      tracking_number: null
    }
  ];

  useEffect(() => {
    // Récupérer les commandes de l'utilisateur
    if (user) {
      try {
        // TODO: Appel API pour récupérer les commandes
        // fetchOrders(user.id);
        setOrders(mockOrders);
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: "En attente",
      approved: "Validée",
      shipped: "Expédiée",
      delivered: "Livrée",
      cancelled: "Annulée"
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

  // Tri des commandes par statut (ordre de priorité)
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
      return orderA - orderB;
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      pr: 2,
                      flexWrap: "wrap",
                      gap: 2
                    }}
                  >
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Chip
                        label={getStatusLabel(order.status)}
                        color={getStatusColor(order.status)}
                        sx={{ fontWeight: 600 }}
                      />
                      <Typography variant="h6" fontWeight={700} color="primary">
                        {order.total.toFixed(2)} €
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ pt: 0 }}>
                  <Divider sx={{ mb: 2 }} />

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
                          {item.name} x{item.quantity}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {(item.price * item.quantity).toFixed(2)} €
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
                          {(order.total - order.shipping).toFixed(2)} €
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
                          Livraison
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {order.shipping.toFixed(2)} €
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
                          {order.total.toFixed(2)} €
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Numéro de suivi */}
                  {order.tracking_number && (
                    <Box
                      sx={{
                        mt: 2,
                        p: 2,
                        backgroundColor: "#e3f2fd",
                        borderRadius: 1,
                        border: "1px solid #90caf9"
                      }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        Numéro de suivi
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.tracking_number}
                      </Typography>
                    </Box>
                  )}
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
