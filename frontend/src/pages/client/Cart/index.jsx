import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Remove as RemoveIcon,
  ShoppingCartOutlined as ShoppingCartOutlinedIcon
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../hooks/useCart";
import { useSnackbar } from "../../../hooks/useSnackbar";

/**
 * Cart page - Shopping cart with products, quantities, and checkout
 */
function Cart() {
  const navigate = useNavigate();
  const {
    items,
    total: cartTotal,
    isLoading,
    updateItem,
    removeItem,
    clearItems,
    isGuest
  } = useCart();
  const { showSuccess, showError } = useSnackbar();

  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= item.product.stock) {
      try {
        // Pour les invités, utiliser product_id; pour les utilisateurs, utiliser item.id
        const identifier = isGuest ? item.product_id : item.id;
        await updateItem(identifier, newQuantity);
      } catch {
        showError("Erreur lors de la mise à jour de la quantité");
      }
    }
  };

  const handleRemoveItem = async (item) => {
    try {
      // Pour les invités, utiliser product_id; pour les utilisateurs, utiliser item.id
      const identifier = isGuest ? item.product_id : item.id;
      await removeItem(identifier);
      showSuccess("Article supprimé du panier");
    } catch {
      showError("Erreur lors de la suppression de l'article");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearItems();
      showSuccess("Panier vidé");
    } catch {
      showError("Erreur lors du vidage du panier");
    }
  };

  const subtotal = cartTotal;
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Mon Panier
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {items.length === 0
            ? "Votre panier est vide"
            : `${items.length} article${items.length > 1 ? "s" : ""} dans votre panier`}
        </Typography>
      </Box>

      {items.length === 0 ? (
        /* Panier vide */
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            backgroundColor: "#f9f9f9",
            borderRadius: 2
          }}
        >
          <ShoppingCartOutlinedIcon
            sx={{ fontSize: 80, color: "text.secondary", mb: 2 }}
          />
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Votre panier est vide
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Découvrez nos produits et ajoutez-les à votre panier
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/")}
          >
            Continuer mes achats
          </Button>
        </Paper>
      ) : (
        /* Panier avec articles */
        <Grid container spacing={3}>
          {/* Liste des articles */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={0} sx={{ borderRadius: 2 }}>
              {items.map((item, index) => (
                <Box key={item.product_id}>
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                      {/* Image */}
                      <Grid size={{ xs: 3, sm: 2 }}>
                        <Box
                          component="img"
                          src={
                            item.product?.images?.[0] ||
                            "https://placehold.co/150x150/png"
                          }
                          alt={item.product?.name || "Produit"}
                          sx={{
                            width: "100%",
                            height: "auto",
                            objectFit: "cover",
                            borderRadius: 1,
                            border: "1px solid #e0e0e0"
                          }}
                        />
                      </Grid>

                      {/* Infos produit */}
                      <Grid size={{ xs: 9, sm: 5 }}>
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ mb: 0.5 }}
                        >
                          {item.product?.name || "Produit"}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Marque: {item.product?.brand || "N/A"}
                        </Typography>
                        <Typography
                          variant="h6"
                          color="primary"
                          fontWeight={700}
                        >
                          {item.price.toFixed(2)} €
                        </Typography>
                      </Grid>

                      {/* Quantité */}
                      <Grid
                        size={{ xs: 6, sm: 3 }}
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(item, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            sx={{
                              border: "1px solid #e0e0e0",
                              borderRadius: 1
                            }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <TextField
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              handleQuantityChange(item, value);
                            }}
                            size="small"
                            sx={{
                              width: 60,
                              "& input": { textAlign: "center" }
                            }}
                            inputProps={{
                              min: 1,
                              max: item.product?.stock || 99
                            }}
                          />
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(item, item.quantity + 1)
                            }
                            disabled={
                              item.quantity >= (item.product?.stock || 0)
                            }
                            sx={{
                              border: "1px solid #e0e0e0",
                              borderRadius: 1
                            }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>

                      {/* Total & Supprimer */}
                      <Grid
                        size={{ xs: 6, sm: 2 }}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: 1
                        }}
                      >
                        <Typography variant="h6" fontWeight={700}>
                          {(item.price * item.quantity).toFixed(2)} €
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveItem(item)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                  {index < items.length - 1 && <Divider />}
                </Box>
              ))}

              {/* Bouton vider le panier */}
              <Box sx={{ p: 2, textAlign: "right" }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleClearCart}
                  startIcon={<DeleteIcon />}
                >
                  Vider le panier
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Récapitulatif */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              elevation={0}
              sx={{
                position: "sticky",
                top: 20,
                border: "1px solid #e0e0e0",
                borderRadius: 2
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight={600} gutterBottom>
                  Récapitulatif
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Sous-total */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1.5
                  }}
                >
                  <Typography variant="body1">Sous-total</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {subtotal.toFixed(2)} €
                  </Typography>
                </Box>

                {/* Livraison */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1.5
                  }}
                >
                  <Typography variant="body1">Livraison</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {shipping.toFixed(2)} €
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Total */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 3
                  }}
                >
                  <Typography variant="h6" fontWeight={700}>
                    Total
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="primary.main"
                  >
                    {total.toFixed(2)} €
                  </Typography>
                </Box>

                {/* Bouton commander */}
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    mb: 2
                  }}
                  onClick={() => navigate("/checkout")}
                >
                  Passer la commande
                </Button>

                {/* Bouton continuer les achats */}
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  sx={{
                    py: 1.5,
                    fontSize: "1rem"
                  }}
                  onClick={() => navigate("/")}
                >
                  Continuer mes achats
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default Cart;
