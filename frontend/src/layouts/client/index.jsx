import { Box, Container } from "@mui/material";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import { useSnackbar } from "../../hooks/useSnackbar";
import { clearCredentials } from "../../store/slices/authSlice";
import Footer from "./Footer";
import Header from "./Header";

/**
 * Layout component with Header and Footer for public pages
 * Contains navigation and shopping cart icon
 */
function Layout({ cartCount = 0 }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { showSuccess, showError } = useSnackbar();

  const handleLogout = async () => {
    try {
      await logout();
      dispatch(clearCredentials());
      showSuccess("Déconnexion réussie");
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      dispatch(clearCredentials());
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

export default Layout;
