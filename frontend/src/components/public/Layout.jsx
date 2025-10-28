import {
  AccountCircleOutlined as AccountCircleOutlinedIcon,
  ShoppingCartOutlined as ShoppingCartOutlinedIcon
} from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";

/**
 * Layout component with Header for public pages
 * Contains navigation and shopping cart icon
 */
function Layout({ children, cartCount = 0 }) {
  const navigate = useNavigate();

  const navItems = [
    { label: "Boutique", href: "/" },
    { label: "Qui sommes-nous", href: "/who-are-we" },
    { label: "Contactez-nous", href: "/contact" }
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header */}
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{
          backgroundColor: "#ffffff",
          borderBottom: "1px solid",
          borderColor: "divider"
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            px: { xs: 2, md: 3 }
          }}
        >
          {/* Logo */}
          <Typography
            variant="h6"
            component="button"
            onClick={() => navigate("/")}
            sx={{
              textDecoration: "none",
              color: "primary.main",
              fontWeight: 700,
              cursor: "pointer",
              border: "none",
              background: "none",
              fontSize: "1.5rem",
              "&:hover": {
                opacity: 0.8
              }
            }}
          >
            b2connect
          </Typography>

          {/* Navigation (Center) - Hidden on mobile */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: 3,
              flex: 1,
              justifyContent: "center"
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.label}
                color="inherit"
                onClick={() => navigate(item.href)}
                sx={{
                  textTransform: "none",
                  fontSize: "1rem",
                  color: "text.primary",
                  "&:hover": {
                    color: "primary.main"
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Icons (Right) */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={() => navigate("/cart")}
              sx={{
                "&:hover": {
                  backgroundColor: "action.hover"
                }
              }}
            >
              <Badge badgeContent={cartCount} color="primary">
                <ShoppingCartOutlinedIcon sx={{ color: "text.primary" }} />
              </Badge>
            </IconButton>
            <IconButton
              color="inherit"
              onClick={() => navigate("/login")}
              sx={{
                "&:hover": {
                  backgroundColor: "action.hover"
                }
              }}
            >
              <AccountCircleOutlinedIcon sx={{ color: "text.primary" }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1 }}>{children}</Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          backgroundColor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
          py: 4,
          mt: 6
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} B2CONNECT. Tous droits réservés.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default Layout;
