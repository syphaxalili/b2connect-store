import { Box, Container } from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

/**
 * Layout component with Header and Footer for public pages
 * Contains navigation and shopping cart icon
 */
function Layout({ cartCount = 0 }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    const userData =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
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
