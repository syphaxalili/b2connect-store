import { Box, Paper, Typography } from "@mui/material";
import PageHeader from "../../components/admin/PageHeader";

function ProductsPage() {
  return (
    <Box>
      <PageHeader
        title="Gestion des Produits"
        subtitle="Gérez tous les produits de votre catalogue"
      />
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Contenu de la page produits à venir...
        </Typography>
      </Paper>
    </Box>
  );
}

export default ProductsPage;
