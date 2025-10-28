import {
  AccountCircleOutlined as AccountCircleOutlinedIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
  ShoppingCartOutlined as ShoppingCartOutlinedIcon
} from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import b2connectLogo from "../../assets/images/logoB2connect.webp";

/**
 * Layout component with Header for public pages
 * Contains navigation and shopping cart icon
 */
function Layout({ children, cartCount = 0 }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Boutique", href: "/" },
    { label: "Qui sommes-nous", href: "/who-are-we" },
    { label: "Contactez-nous", href: "/contact" }
  ];

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = (href) => {
    navigate(href);
    setMobileMenuOpen(false);
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
        <AppBar
          position="static"
          color="default"
          sx={{
            boxShadow: "none",
            borderRadius: "0",
            backgroundColor: "transparent",
            color: "text.primary",
            borderBottom: "1px solid",
            borderColor: "divider",
            mb: 5
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              px: { xs: 1, md: 3 },
              py: { xs: 2, md: 3 }
            }}
          >
            {/* Mobile Menu Icon - Left */}
            <IconButton
              color="inherit"
              onClick={handleMobileMenuToggle}
              sx={{
                display: { xs: "flex", md: "none" }
              }}
            >
              <MenuIcon sx={{ color: "text.primary" }} />
            </IconButton>

            {/* Logo */}
            <Box
              component="button"
              onClick={() => navigate("/")}
              sx={{
                cursor: "pointer",
                border: "none",
                background: "none",
                padding: 0,
                display: "flex",
                alignItems: "center",
                "&:hover": {
                  opacity: 0.8
                }
              }}
            >
              <Box
                component="img"
                src={b2connectLogo}
                alt="b2connect logo"
                sx={{
                  height: 40,
                  width: "auto"
                }}
              />
            </Box>

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
                      color: "primary.main",
                      transform: "none",
                      boxShadow: "none"
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

        {/* Mobile Navigation Drawer */}
        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={handleMobileMenuToggle}
        >
          <Box
            sx={{
              width: 250,
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderBottom: "1px solid",
                borderColor: "divider"
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Menu
              </Typography>
              <IconButton onClick={handleMobileMenuToggle} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            <List sx={{ flex: 1 }}>
              {navItems.map((item) => (
                <ListItem key={item.label} disablePadding>
                  <ListItemButton
                    onClick={() => handleNavClick(item.href)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "action.hover"
                      }
                    }}
                  >
                    <ListItemText
                      primary={item.label}
                      sx={{
                        "& .MuiTypography-root": {
                          color: "text.primary"
                        }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box sx={{ flex: 1 }}>{children}</Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 5,
            mt: 6,
            borderTop: "1px solid",
            borderColor: "divider"
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} B2CONNECT. Tous droits réservés.
            </Typography>
          </Container>
        </Box>
      </Box>
    </Container>
  );
}

export default Layout;
