import { Container, Typography } from '@mui/material';

const Cart = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Panier
      </Typography>
      <Typography variant="body1">
        Votre panier est vide pour le moment. (À implémenter : afficher les produits ajoutés)
      </Typography>
    </Container>
  );
};

export default Cart;