import { Box, Container } from "@mui/material";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useSnackbar } from "../../hooks/useSnackbar";
import { clearCredentials } from "../../store/slices/authSlice";
import { resetCart } from "../../store/slices/cartSlice";
import Footer from "./Footer";
import Header from "./Header";

/**
 * ClientLayout component with Header and Footer for public pages
 * Contains navigation and shopping cart icon
 */
function ClientLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { showSuccess, showError } = useSnackbar();
  const { itemCount: cartCount } = useCart();

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(clearCredentials());
      dispatch(resetCart()); // Réinitialiser le panier lors de la déconnexion
      showSuccess("Déconnexion réussie");
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      dispatch(clearCredentials());
      dispatch(resetCart());
      showError("Erreur lors de la déconnexion");
      navigate("/");
    }
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          userSelect: "none"
        }}
      >
        {/* Header */}
        <Header user={user} cartCount={cartCount} onLogout={handleLogout} />

        {/* Main Content */}
        <Box sx={{ flex: 1 }}>
          <Outlet />
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    </Container>
  );
}

export default ClientLayout;
