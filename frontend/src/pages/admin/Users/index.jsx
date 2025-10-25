import { Box, Paper, Typography } from "@mui/material";
import PageHeader from "../../../components/admin/PageHeader";

function UsersPage() {
  return (
    <Box>
      <PageHeader
        title="Gestion des Utilisateurs"
        subtitle="Gérez tous les utilisateurs de la plateforme"
      />
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Contenu de la page utilisateurs à venir...
        </Typography>
      </Paper>
    </Box>
  );
}

export default UsersPage;
