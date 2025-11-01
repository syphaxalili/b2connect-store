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
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import b2connectLogo from "../../assets/images/logoB2connect.webp";

/**
 * Header component with navigation and user menu
 */
function Header({ user, cartCount = 0, onLogout }) {
  const navigate = useNavigate();
  const [navMenuAnchor, setNavMenuAnchor] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const navItems = [
    { label: "Boutique", href: "/" },
    { label: "Qui sommes-nous", href: "/who-are-we" },
    { label: "Contactez-nous", href: "/contact" }
  ];

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

  const handleLogoutClick = () => {
    handleUserMenuClose();
    onLogout();
  };

  return (
    <>
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
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {/* Shopping Cart */}
            <Box
              onClick={() => navigate("/cart")}
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
              <IconButton
                color="inherit"
                sx={{
                  p: 0,
                  "&:hover": {
                    backgroundColor: "transparent"
                  }
                }}
              >
                <ShoppingCartOutlinedIcon sx={{ color: "text.primary" }} />
              </IconButton>
              <Typography
                variant="body2"
                sx={{
                  display: { xs: "none", sm: "block" },
                  fontWeight: 600,
                  color: "primary.main",
                  minWidth: "20px",
                  textAlign: "center"
                }}
              >
                {`Mon panier (${cartCount})`}
              </Typography>
            </Box>

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
                    alt={`${user.first_name} ${user.last_name}`}
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: "0.875rem"
                    }}
                  >
                    {`${user.first_name} ${user.last_name}`
                      ?.charAt(0)
                      .toUpperCase()}
                  </Avatar>
                  <Typography
                    variant="body2"
                    sx={{
                      display: { xs: "none", sm: "block" },
                      color: "text.primary",
                      fontWeight: 500
                    }}
                  >
                    {`${user.first_name} ${user.last_name}`}
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
                  disableScrollLock={true}
                >
                  {user?.role === "admin" && (
                    <>
                      <MenuItem
                        onClick={() => {
                          navigate("/admin");
                          handleUserMenuClose();
                        }}
                      >
                        Dashboard
                      </MenuItem>
                      <Divider />
                    </>
                  )}
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
                    onClick={handleLogoutClick}
                    sx={{ color: "error.main" }}
                  >
                    <LogoutIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
                    Déconnexion
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box
                onClick={() => navigate("/login")}
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
                <AccountCircleOutlinedIcon sx={{ color: "text.primary" }} />
                <Typography
                  variant="body2"
                  sx={{
                    display: { xs: "none", sm: "block" },
                    color: "text.primary",
                    fontWeight: 500
                  }}
                >
                  S'authentifier
                </Typography>
              </Box>
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
          <MenuItem key={item.label} onClick={() => handleNavClick(item.href)}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

export default Header;
