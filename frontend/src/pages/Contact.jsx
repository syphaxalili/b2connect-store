import {
  Email as EmailIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon
} from "@mui/icons-material";
import ClockIcon from "@mui/icons-material/Alarm";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";

/**
 * Contact page - Get in touch with B2CONNECT
 * Displays contact information and contact form
 */
function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const contactInfo = [
    {
      icon: <PhoneIcon sx={{ fontSize: 32 }} />,
      title: "Téléphone",
      details: "+33 1 23 45 67 89",
      description: "Lun-Ven: 9h-18h, Sam: 10h-16h"
    },
    {
      icon: <EmailIcon sx={{ fontSize: 32 }} />,
      title: "Email",
      details: "contact@b2connect.fr",
      description: "Réponse sous 24h"
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 32 }} />,
      title: "Adresse",
      details: "123 Rue de la Paix",
      description: "75000 Paris, France"
    },
    {
      icon: <ClockIcon sx={{ fontSize: 32 }} />,
      title: "Horaires",
      details: "Lun-Ven: 9h-18h",
      description: "Sam: 10h-16h, Dim: Fermé"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Veuillez entrer une adresse email valide");
      return;
    }

    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
    setError("");
    setSubmitted(true);

    // Hide success message after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 10, textAlign: "center" }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 3,
              color: "primary.main"
            }}
          >
            Contactez-nous
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              mx: "auto",
              lineHeight: 1.8
            }}
          >
            Vous avez une question ou besoin d'aide ? Notre équipe est là pour
            vous. N'hésitez pas à nous contacter, nous vous répondrons dans les
            plus brefs délais.
          </Typography>
        </Box>

        {/* Contact Info Cards */}
        <Grid container spacing={3} sx={{ mb: 10 }}>
          {contactInfo.map((info, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  backgroundColor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 8px 16px rgba(31, 45, 61, 0.12)"
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ color: "primary.main", mb: 2 }}>{info.icon}</Box>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    color="primary.main"
                    sx={{ mb: 1 }}
                  >
                    {info.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    color="text.primary"
                    sx={{ mb: 0.5 }}
                  >
                    {info.details}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {info.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Contact Form Section */}
        <Grid container spacing={6}>
          {/* Form */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card
              sx={{
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider"
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  fontWeight={600}
                  color="primary.main"
                  sx={{ mb: 4 }}
                >
                  Envoyez-nous un message
                </Typography>

                {submitted && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Merci ! Votre message a été envoyé avec succès. Nous vous
                    répondrons dans les plus brefs délais.
                  </Alert>
                )}

                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    {/* Name */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Nom complet"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Jean Dupont"
                        variant="outlined"
                      />
                    </Grid>

                    {/* Email */}
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="jean@example.com"
                        variant="outlined"
                      />
                    </Grid>

                    {/* Subject */}
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Sujet"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Sujet de votre message"
                        variant="outlined"
                      />
                    </Grid>

                    {/* Message */}
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Votre message ici..."
                        variant="outlined"
                        multiline
                        rows={6}
                      />
                    </Grid>

                    {/* Submit Button */}
                    <Grid size={{ xs: 12 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        size="large"
                        fullWidth
                        sx={{
                          fontWeight: 600,
                          py: 1.5
                        }}
                      >
                        Envoyer le message
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* FAQ Section */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                height: "100%"
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h5"
                  fontWeight={600}
                  color="primary.main"
                  sx={{ mb: 3 }}
                >
                  Questions fréquentes
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="primary.main"
                      sx={{ mb: 1 }}
                    >
                      Quel est le délai de livraison ?
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Nous proposons une livraison express en 24h pour les
                      commandes passées avant 14h.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="primary.main"
                      sx={{ mb: 1 }}
                    >
                      Quelle est votre politique de retour ?
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Vous avez 30 jours pour retourner un produit non utilisé
                      pour un remboursement complet.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="primary.main"
                      sx={{ mb: 1 }}
                    >
                      Acceptez-vous les paiements par carte ?
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Oui, nous acceptons tous les types de cartes bancaires
                      ainsi que PayPal.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="primary.main"
                      sx={{ mb: 1 }}
                    >
                      Comment puis-je suivre ma commande ?
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Un numéro de suivi vous est envoyé par email dès
                      l'expédition de votre colis.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
    </Container>
  );
}

export default Contact;
