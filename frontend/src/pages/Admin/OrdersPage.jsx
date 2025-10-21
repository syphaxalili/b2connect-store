import { Box, Paper, Typography } from "@mui/material";
import PageHeader from "../../components/admin/PageHeader";

function OrdersPage() {
  return (
    <Box>
      <PageHeader
        title="Gestion des Commandes"
        subtitle="Suivez et gérez toutes les commandes"
      />
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Contenu de la page commandes à venir...
        </Typography>
      </Paper>
    </Box>
  );
}

export default OrdersPage;
