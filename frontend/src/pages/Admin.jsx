import { Container, Typography } from '@mui/material';

const Admin = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord Admin
      </Typography>
      <Typography variant="body1">
        Gestion des produits et commandes (à implémenter : tableaux MUI).
      </Typography>
    </Container>
  );
};

export default Admin;