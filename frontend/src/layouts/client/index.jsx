import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useLogout } from "../../hooks/useLogout";
import Footer from "./Footer";
import Header from "./Header";

function ClientLayout() {
  const { user } = useAuth();
  const { itemsCount: cartCount } = useCart();
  const { logout: handleLogout } = useLogout();

  return (
    <Container maxWidth="lg" sx={{ padding: "0" }}>
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
