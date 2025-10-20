import { Box, Paper, Typography } from "@mui/material";
import PageHeader from "../../components/admin/PageHeader";

function CategoriesPage() {
  return (
    <Box>
      <PageHeader
        title="Gestion des Catégories"
        subtitle="Gérez toutes les catégories de produits"
      />
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Contenu de la page catégories à venir...
        </Typography>
      </Paper>
    </Box>
  );
}

export default CategoriesPage;
