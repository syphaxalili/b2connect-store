import { Container, Typography, TextField, Button, Box, Link } from '@mui/material';

const Login = () => {
  return (
    <Container maxWidth="xs" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Connexion
      </Typography>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Email" variant="outlined" fullWidth />
        <TextField label="Mot de passe" type="password" variant="outlined" fullWidth />
        <Button variant="contained" color="primary">
          Se connecter
        </Button>
        <Button color="secondary" component={Link} to="/register">
          Pas de compte ? Inscrivez-vous
        </Button>
      </Box>
    </Container>
  );
};

export default Login;