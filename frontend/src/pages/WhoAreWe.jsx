import {
  CheckCircle as CheckCircleIcon,
  Lightbulb as LightbulbIcon,
  People as PeopleIcon
} from "@mui/icons-material";
import TargetIcon from "@mui/icons-material/TrackChanges";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography
} from "@mui/material";
import Layout from "../layouts/public/HomePageLayout";

/**
 * WhoAreWe page - About B2CONNECT
 * Displays company information, mission, values, and team
 */
function WhoAreWe() {
  const values = [
    {
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      title: "Qualité",
      description:
        "Nous sélectionnons rigoureusement nos produits pour garantir la meilleure qualité à nos clients."
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      title: "Proximité",
      description:
        "Notre équipe est à votre écoute pour vous conseiller et vous accompagner dans vos achats."
    },
    {
      icon: <LightbulbIcon sx={{ fontSize: 40 }} />,
      title: "Innovation",
      description:
        "Nous proposons les dernières technologies et innovations en matière d'accessoires tech."
    },
    {
      icon: <TargetIcon sx={{ fontSize: 40 }} />,
      title: "Fiabilité",
      description:
        "Nos produits sont testés et certifiés pour vous offrir une expérience sans compromis."
    }
  ];

  return (
    <Layout>
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
            Qui sommes-nous ?
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
            B2CONNECT est votre partenaire de confiance pour tous vos besoins en
            accessoires technologiques. Depuis notre création, nous nous
            engageons à offrir des produits de qualité à des prix compétitifs.
          </Typography>
        </Box>

        {/* Mission & Vision Section */}
        <Grid container spacing={4} sx={{ mb: 10 }}>
          <Grid item size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                height: "100%",
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
                  sx={{ mb: 2 }}
                >
                  Notre Mission
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  Fournir à nos clients une sélection curatée d'accessoires
                  technologiques de haute qualité, en garantissant une
                  expérience d'achat fluide, des prix justes et un service
                  client irréprochable.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                height: "100%",
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
                  sx={{ mb: 2 }}
                >
                  Notre Vision
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                  Devenir le leader incontournable en France pour l'achat
                  d'accessoires technologiques, en mettant l'accent sur la
                  qualité, l'innovation et la satisfaction client.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Values Section */}
        <Box sx={{ mb: 10 }}>
          <Typography
            variant="h4"
            fontWeight={600}
            color="primary.main"
            sx={{ mb: 6, textAlign: "center" }}
          >
            Nos Valeurs
          </Typography>
          <Grid container spacing={3}>
            {values.map((value, index) => (
              <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={index}>
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
                    <Box sx={{ color: "primary.main", mb: 2 }}>
                      {value.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      color="primary.main"
                      sx={{ mb: 1 }}
                    >
                      {value.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {value.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
}

export default WhoAreWe;
