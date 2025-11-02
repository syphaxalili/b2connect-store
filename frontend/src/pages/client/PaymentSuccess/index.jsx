import { CheckCircle as CheckCircleIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { axiosPublic } from "../../../api";
import { useCart } from "../../../hooks/useCart";
import { useSnackbar } from "../../../hooks/useSnackbar";

/**
 * Payment Success page - Displayed after successful Stripe payment
 */
function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearItems } = useCart();
  const { showSuccess, showError } = useSnackbar();
  const [loading, setLoading] = useState(true);
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

    // Créer la commande et vider le panier après paiement réussi
    const processPaymentSuccess = async () => {
      try {
        // Simuler le webhook pour créer la commande (en développement)
        await axiosPublic.post("/stripe/simulate-webhook", {
          session_id: sessionId
        });

        // Vider le panier
        await clearItems();
        showSuccess("Paiement réussi! Votre commande a été confirmée.");
      } catch (error) {
        console.error("Erreur lors du traitement du paiement:", error);
        showError("Erreur lors de la création de la commande");
      } finally {
        setLoading(false);
      }
    };

    processPaymentSuccess();
  }, []); // S'exécute une seule fois au montage

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Traitement de votre paiement...
        </Typography>
      </Container>
    );
  }

  return (
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
