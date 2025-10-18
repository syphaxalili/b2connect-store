import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Admin from './pages/Admin';

const App = () => {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            B2CONNECT
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Accueil
          </Button>
          <Button color="inherit" component={Link} to="/cart">
            Panier
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Connexion
          </Button>
          <Button color="inherit" component={Link} to="/admin">
            Admin
          </Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;