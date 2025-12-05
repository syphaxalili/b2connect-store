import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography
} from "@mui/material";
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../../../hooks/useCart";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useSelector } from "react-redux";

/**
 * Payment Success page - Displayed after successful Stripe payment
 */
function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearItems } = useCart();
  const { showSuccess, showError } = useSnackbar();
  let loading = useSelector((state) => state.loading.requestCount > 0);
  const hasProcessed = useRef(false); // Protection contre les doubles appels

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      navigate("/");
      return;
    }

    // Protection contre les doubles appels (React StrictMode)
    if (hasProcessed.current) {
      return;
    }
    hasProcessed.current = true;

    // Vider le panier après paiement réussi
    // Note: La commande est créée automatiquement par le webhook Stripe
    const processPaymentSuccess = async () => {
      try {
        // Vider le panier
        await clearItems();
        
        // Nettoyer les données du formulaire Checkout sauvegardées
        localStorage.removeItem('checkout_form_data');
        
        showSuccess("Paiement réussi! Votre commande a été confirmée.");
      } catch {
        showError("Erreur lors du traitement");
      }
    };

    processPaymentSuccess();
  }, []); // S'exécute une seule fois au montage

  return !loading && (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: "center",
          backgroundColor: "#f9f9f9",
          borderRadius: 2
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 100, color: "success.main", mb: 3 }} />
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Paiement réussi !
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
          Votre commande a été confirmée
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Merci pour votre achat. Vous recevrez un email de confirmation sous
          peu.
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
            justifyContent: { xs: "flex-start", md: "center" }
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/")}
            fullWidth={{ xs: true, md: false }}
          >
            Retour à la boutique
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate("/orders")}
            fullWidth={{ xs: true, md: false }}
          >
            Voir mes commandes
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default PaymentSuccess;
