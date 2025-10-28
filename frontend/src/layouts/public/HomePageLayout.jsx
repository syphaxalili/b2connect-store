import {
  AccountCircleOutlined as AccountCircleOutlinedIcon,
  ExpandMore as ExpandMoreIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  ShoppingCartOutlined as ShoppingCartOutlinedIcon
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import b2connectLogo from "../../assets/images/logoB2connect.webp";

/**
 * Layout component with Header for public pages
 * Contains navigation and shopping cart icon
 */
function Layout({ children, cartCount = 0 }) {
  const navigate = useNavigate();
  const [navMenuAnchor, setNavMenuAnchor] = useState(null);
  const [user, setUser] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const navItems = [
    { label: "Boutique", href: "/" },
    { label: "Qui sommes-nous", href: "/who-are-we" },
    { label: "Contactez-nous", href: "/contact" }
  ];

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

  const handleNavMenuOpen = (event) => {
    setNavMenuAnchor(event.currentTarget);
  };

  const handleNavMenuClose = () => {
    setNavMenuAnchor(null);
  };

  const handleNavClick = (href) => {
    navigate(href);
    handleNavMenuClose();
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setUserMenuAnchor(null);
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
              onClick={handleNavMenuOpen}
              sx={{
                display: { xs: "flex", md: "none" },
                mr: 1,
                "&:hover": {
                  backgroundColor: "action.hover"
                }
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
                  height: { xs: 35, md: 40 },
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
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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

              {user ? (
                <>
                  {/* User Profile Button */}
                  <Box
                    onClick={handleUserMenuOpen}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      cursor: "pointer",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "action.hover"
                      }
                    }}
                  >
                    <Avatar
                      alt={user.name}
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: "0.875rem"
                      }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography
                      variant="body2"
                      sx={{
                        display: { xs: "none", sm: "block" },
                        color: "text.primary",
                        fontWeight: 500
                      }}
                    >
                      {user.name}
                    </Typography>
                    <ExpandMoreIcon
                      sx={{
                        fontSize: "1.2rem",
                        color: "text.primary",
                        transition: "transform 0.2s ease",
                        transform: userMenuAnchor
                          ? "rotate(180deg)"
                          : "rotate(0deg)"
                      }}
                    />
                  </Box>

                  {/* User Menu */}
                  <Menu
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={handleUserMenuClose}
                  >
                    <Box sx={{ px: 2, py: 1 }}>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="text.primary"
                      >
                        {user.name}
                      </Typography>
                    </Box>
                    <Divider />
                    <MenuItem
                      onClick={() => {
                        navigate("/profile");
                        handleUserMenuClose();
                      }}
                    >
                      Mon Profil
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        navigate("/orders");
                        handleUserMenuClose();
                      }}
                    >
                      Mes Commandes
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={handleLogout}
                      sx={{ color: "error.main" }}
                    >
                      <LogoutIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
                      Déconnexion
                    </MenuItem>
                  </Menu>
                </>
              ) : (
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
              )}
            </Box>
          </Toolbar>
        </AppBar>

        {/* Mobile Navigation Menu */}
        <Menu
          anchorEl={navMenuAnchor}
          open={Boolean(navMenuAnchor)}
          onClose={handleNavMenuClose}
        >
          {navItems.map((item) => (
            <MenuItem
              key={item.label}
              onClick={() => handleNavClick(item.href)}
            >
              {item.label}
            </MenuItem>
          ))}
        </Menu>

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
