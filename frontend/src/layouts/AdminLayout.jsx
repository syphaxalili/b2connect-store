import {
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import b2connectLogo from "../assets/images/logoB2connect.webp";
import { clearUser } from "../store/slices/authSlice";
import { clearAuthToken } from "../utils/storage";

const mapStateToProps = (state) => ({ user: state.auth });

const drawerWidth = 280;

const menuItems = [
  { text: "Catégories", icon: <CategoryIcon />, path: "/admin/categories" },
  { text: "Produits", icon: <InventoryIcon />, path: "/admin/products" },
  { text: "Commandes", icon: <ShoppingCartIcon />, path: "/admin/orders" },
  { text: "Utilisateurs", icon: <PeopleIcon />, path: "/admin/users" }
];

function AdminLayout({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(clearUser());
    clearAuthToken();
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper"
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: 3,
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <img src={b2connectLogo} alt="b2connect logo" width={200} />
      </Box>

      <Divider />

      {/* Menu Items */}
      <List sx={{ flexGrow: 1, p: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": {
                    bgcolor: "primary.dark"
                  },
                  "& .MuiListItemIcon-root": {
                    color: "white"
                  }
                }
              }}
            >
              <ListItemIcon
                sx={{
                  color:
                    location.pathname === item.path ? "white" : "text.secondary"
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ display: { xs: "none", md: "flex" } }} />

      {/* Admin Info & Logout */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            bgcolor: "grey.100",
            borderRadius: 2,
            mb: 1
          }}
        >
          <Avatar
            src={user?.photo || ""}
            alt={"Admin avatar"}
            sx={{ width: 40, height: 40 }}
          >
            {user?.name?.charAt(0) || "A"}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {user?.name || "Admin"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block"
              }}
            >
              {user?.email || "admin@b2connect.com"}
            </Typography>
          </Box>
        </Box>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: "error.main",
            "&:hover": {
              bgcolor: "error.lighter"
            }
          }}
        >
          <ListItemIcon sx={{ color: "error.main" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Se déconnecter" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* AppBar for mobile */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            width: "100%",
            zIndex: theme.zIndex.drawer + 1
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <img src={b2connectLogo} alt="b2connect logo" width={120} />
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              pt: 6,
              boxSizing: "border-box",
              width: drawerWidth
            }
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 0, sm: 2, md: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 10, md: 0 },
          bgcolor: "grey.50",
          minHeight: "100vh",
          overflow: "hidden"
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default connect(mapStateToProps)(AdminLayout);
