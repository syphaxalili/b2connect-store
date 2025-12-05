import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCheckoutSession } from "../../../api";
import { useAuth } from "../../../hooks/useAuth";
import { useCart } from "../../../hooks/useCart";
import { useSnackbar } from "../../../hooks/useSnackbar";

/**
 * Checkout page - Order form with shipping info and payment
 */
function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items: cartItems, total: cartTotal } = useCart();
  const { showError } = useSnackbar();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [activeStep, setActiveStep] = useState(0);
  const [useMyAddress, setUseMyAddress] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isInitialMount = useRef(true); // Vérifier si c'est le premier chargement

  const [formData, setFormData] = useState({
    // Informations personnelles
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    // Adresse de livraison
    street: "",
    city: "",
    postalCode: "",
    country: "France",
    // Notes
    notes: ""
  });

  // Charger les données utilisateur au montage
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        email: user.email || "",
        phone: user.phone_number || ""
      }));
    }
  }, [user]);

  // Gérer le changement de la checkbox
  const handleUseMyAddressChange = (e) => {
    const checked = e.target.checked;
    setUseMyAddress(checked);

    if (checked && user?.address) {
      setFormData((prev) => ({
        ...prev,
        street: user.address.street || "",
        postalCode: user.address.postal_code || "",
        city: user.address.city || ""
      }));
    } else if (!checked) {
      setFormData((prev) => ({
        ...prev,
        street: "",
        postalCode: "",
        city: ""
      }));
    }

    setErrors((prev) => ({
      ...prev,
      street: "",
      postalCode: "",
      city: ""
    }));
  };

  const [errors, setErrors] = useState({});

  const steps = ["Informations", "Récapitulatif", "Confirmation"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateStep = () => {
    const newErrors = {};

    if (activeStep === 0) {
      if (!formData.firstName.trim())
        newErrors.firstName = "Le prénom est requis";
      if (!formData.lastName.trim()) newErrors.lastName = "Le nom est requis";
      if (!formData.email.trim()) {
        newErrors.email = "L'email est requis";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email invalide";
      }
      if (!formData.phone.trim()) newErrors.phone = "Le téléphone est requis";
      if (!formData.street.trim()) newErrors.street = "La rue est requise";
      if (!formData.city.trim()) newErrors.city = "La ville est requise";
      if (!formData.postalCode.trim())
        newErrors.postalCode = "Le code postal est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (activeStep === steps.length - 2) {
        // Dernière étape avant confirmation
        handlePlaceOrder();
      } else {
        setActiveStep((prev) => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      showError("Votre panier est vide");
      return;
    }

    try {
      setSubmitting(true);

      // Préparer les données de la commande
      const product_ids = cartItems.map((item) => item.product_id);
      const quantities = cartItems.map((item) => item.quantity);

      // Préparer l'adresse de livraison
      const shipping_address = {
        street: formData.street,
        postal_code: formData.postalCode,
        city: formData.city,
        country: formData.country
      };

      // Créer une session de paiement Stripe
      const response = await createCheckoutSession(
        product_ids,
        quantities,
        shipping_address
      );

      // Rediriger directement vers l'URL Stripe Checkout
      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        showError("Erreur: URL de paiement non reçue");
      }
    } catch (error) {
      showError(
        error.response?.data?.error ||
          "Erreur lors de la création de la session de paiement"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const subtotal = cartTotal;
  const shipping = cartItems.length > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  // Rediriger si le panier est vide (seulement au premier chargement)
  useEffect(() => {
    if (isInitialMount.current && cartItems.length === 0) {
      // Attendre un peu pour que le panier se charge depuis l'API
      const timer = setTimeout(() => {
        if (cartItems.length === 0) {
          showError("Votre panier est vide");
          navigate("/cart");
        }
        isInitialMount.current = false;
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [cartItems, navigate, showError]);

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/cart")}
          sx={{ mb: 2 }}
        >
          Retour au panier
        </Button>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Finaliser ma commande
        </Typography>
      </Box>

      {/* Stepper */}
      <Stepper
        activeStep={activeStep}
        orientation={isSmallScreen ? "vertical" : "horizontal"}
        sx={{ mb: 4 }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        {/* Formulaire */}
        <Grid size={{ xs: 12, md: 8 }}>
          {activeStep === 0 && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Informations de livraison
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                {/* Informations personnelles */}
                <Grid size={12}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mb: 2 }}
                  >
                    Informations personnelles
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Prénom"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Nom"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Téléphone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    placeholder="+33 6 12 34 56 78"
                    required
                  />
                </Grid>

                {/* Adresse de livraison */}
                <Grid size={12}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ mt: 2, mb: 2 }}
                  >
                    Adresse de livraison
                  </Typography>
                </Grid>

                {user && user.address && (
                  <Grid size={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={useMyAddress}
                          onChange={handleUseMyAddressChange}
                          color="primary"
                        />
                      }
                      label="Utiliser mon adresse pour la livraison"
                    />
                  </Grid>
                )}

                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Rue"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    error={!!errors.street}
                    helperText={errors.street}
                    placeholder="Numéro et nom de rue"
                    required
                    disabled={useMyAddress}
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "rgba(0, 0, 0, 0.6)",
                        backgroundColor: "#f5f5f5"
                      }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Code postal"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    error={!!errors.postalCode}
                    helperText={errors.postalCode}
                    required
                    disabled={useMyAddress}
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "rgba(0, 0, 0, 0.6)",
                        backgroundColor: "#f5f5f5"
                      }
                    }}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Ville"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    error={!!errors.city}
                    helperText={errors.city}
                    required
                    disabled={useMyAddress}
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "rgba(0, 0, 0, 0.6)",
                        backgroundColor: "#f5f5f5"
                      }
                    }}
                  />
                </Grid>

                <Grid size={12}>
                  <TextField
                    fullWidth
                    select
                    label="Pays"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    disabled
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "rgba(0, 0, 0, 0.6)"
                      }
                    }}
                  >
                    <MenuItem value="France">France</MenuItem>
                  </TextField>
                </Grid>

                {/* Notes */}
                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Notes de commande (optionnel)"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    placeholder="Instructions de livraison, commentaires..."
                  />
                </Grid>
              </Grid>
            </Paper>
          )}

          {activeStep === 1 && (
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Récapitulatif de la commande
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: { xs: "100%", sm: "80%" },
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 2
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      gutterBottom
                    >
                      Informations de contact
                    </Typography>
                    <Typography variant="body1">
                      {formData.firstName} {formData.lastName}
                    </Typography>
                    <Typography variant="body1">{formData.email}</Typography>
                    <Typography variant="body1">{formData.phone}</Typography>
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      gutterBottom
                    >
                      Adresse de livraison
                    </Typography>
                    <Typography variant="body1">{formData.street}</Typography>
                    <Typography variant="body1">
                      {formData.postalCode} {formData.city}
                    </Typography>
                    <Typography variant="body1">{formData.country}</Typography>
                  </Box>
                </Box>
                {formData.notes && (
                  <>
                    <Box
                      sx={{
                        mt: 3,
                        p: 2,
                        backgroundColor: "#f9f9f9",
                        borderRadius: 1
                      }}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        Notes:
                      </Typography>
                      <Typography variant="body2">{formData.notes}</Typography>
                    </Box>
                  </>
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Articles */}
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Articles commandés
              </Typography>
              {cartItems.map((item) => (
                <Box
                  key={item.product_id}
                  sx={{
                    display: "flex",
                    gap: 2,
                    mb: 2,
                    p: 2,
                    backgroundColor: "#f9f9f9",
                    borderRadius: 1
                  }}
                >
                  <Box
                    component="img"
                    src={
                      item.product?.images?.[0] ||
                      "https://placehold.co/150x150/png"
                    }
                    alt={item.product?.name || "Produit"}
                    loading="lazy"
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 1
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight={600}>
                      {item.product?.name || "Produit"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.product?.brand || "N/A"} • Quantité: {item.quantity}
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={600}>
                    {(item.price * item.quantity).toFixed(2)} €
                  </Typography>
                </Box>
              ))}

              <Alert severity="info" sx={{ mt: 3 }}>
                Veuillez vérifier toutes les informations avant de confirmer
                votre commande.
              </Alert>
            </Paper>
          )}

          {/* Boutons de navigation */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              mt: 3
            }}
          >
            {activeStep > 0 && activeStep < steps.length - 1 && (
              <Button
                variant="outlined"
                onClick={handleBack}
                fullWidth={{ xs: true, md: false }}
              >
                Retour
              </Button>
            )}
            {activeStep < steps.length - 1 && (
              <Button
                variant="contained"
                onClick={handleNext}
                fullWidth={{ xs: true, md: false }}
                sx={{ ml: { xs: 0, md: "auto" } }}
                disabled={submitting}
              >
                {submitting
                  ? "Traitement en cours..."
                  : activeStep === steps.length - 2
                    ? "Confirmer la commande"
                    : "Continuer"}
              </Button>
            )}
          </Box>
        </Grid>

        {/* Récapitulatif prix */}
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
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Résumé
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Articles */}
              <Box sx={{ mb: 2 }}>
                {cartItems.map((item) => (
                  <Box
                    key={item.product_id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1
                    }}
                  >
                    <Typography variant="body2">
                      {item.product?.name || "Produit"} x{item.quantity}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {(item.price * item.quantity).toFixed(2)} €
                    </Typography>
                  </Box>
                ))}
              </Box>

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
                  justifyContent: "space-between"
                }}
              >
                <Typography variant="h6" fontWeight={700}>
                  Total
                </Typography>
                <Typography variant="h6" fontWeight={700} color="primary.main">
                  {total.toFixed(2)} €
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Checkout;
