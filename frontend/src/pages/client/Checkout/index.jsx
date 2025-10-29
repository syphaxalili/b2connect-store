import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Checkout page - Order form with shipping info and payment
 */
function Checkout() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Données temporaires du panier (à remplacer par un state global ou context)
  const cartItems = [
    {
      id: "1",
      name: "Batterie Dell Latitude E6420",
      brand: "Dell",
      price: 49.99,
      quantity: 2,
      image: "https://placehold.co/150x150/png"
    },
    {
      id: "2",
      name: "Chargeur HP 65W",
      brand: "HP",
      price: 29.99,
      quantity: 1,
      image: "https://placehold.co/150x150/png"
    }
  ];

  const [formData, setFormData] = useState({
    // Informations personnelles
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    // Adresse de livraison
    address: "",
    city: "",
    postalCode: "",
    country: "France",
    // Notes
    notes: ""
  });

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
      if (!formData.address.trim()) newErrors.address = "L'adresse est requise";
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

  const handlePlaceOrder = () => {
    // TODO: Appel API pour créer la commande
    console.log("Order placed:", { formData, cartItems });
    setOrderPlaced(true);
    setActiveStep(steps.length - 1);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 5.99;
  const total = subtotal + shipping;

  // Page de confirmation
  if (orderPlaced && activeStep === steps.length - 1) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            backgroundColor: "#f9f9f9",
            borderRadius: 2
          }}
        >
          <CheckCircleIcon
            sx={{ fontSize: 100, color: "success.main", mb: 3 }}
          />
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Commande confirmée !
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Numéro de commande: <strong>#ORD-{Date.now()}</strong>
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Merci pour votre commande. Vous recevrez un email de confirmation à{" "}
            <strong>{formData.email}</strong>
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ textAlign: "left", mb: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Adresse de livraison
            </Typography>
            <Typography variant="body1">
              {formData.firstName} {formData.lastName}
            </Typography>
            <Typography variant="body1">{formData.address}</Typography>
            <Typography variant="body1">
              {formData.postalCode} {formData.city}
            </Typography>
            <Typography variant="body1">{formData.country}</Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/")}
            >
              Retour à la boutique
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/orders")}
            >
              Voir mes commandes
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
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

                <Grid size={12}>
                  <TextField
                    fullWidth
                    label="Adresse"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    error={!!errors.address}
                    helperText={errors.address}
                    placeholder="Numéro et nom de rue"
                    required
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

              {/* Informations de livraison */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Adresse de livraison
                </Typography>
                <Typography variant="body1">
                  {formData.firstName} {formData.lastName}
                </Typography>
                <Typography variant="body1">{formData.email}</Typography>
                <Typography variant="body1">{formData.phone}</Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {formData.address}
                </Typography>
                <Typography variant="body1">
                  {formData.postalCode} {formData.city}
                </Typography>
                <Typography variant="body1">{formData.country}</Typography>
                {formData.notes && (
                  <Box
                    sx={{
                      mt: 2,
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
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Articles */}
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Articles commandés
              </Typography>
              {cartItems.map((item) => (
                <Box
                  key={item.id}
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
                    src={item.image}
                    alt={item.name}
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 1
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" fontWeight={600}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.brand} • Quantité: {item.quantity}
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
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            {activeStep > 0 && activeStep < steps.length - 1 && (
              <Button variant="outlined" onClick={handleBack}>
                Retour
              </Button>
            )}
            {activeStep < steps.length - 1 && (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ ml: "auto" }}
              >
                {activeStep === steps.length - 2
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
                    key={item.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
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
