import {
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  Logout as LogoutIcon,
  People as PeopleIcon,
  ShoppingCart as ShoppingCartIcon
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";
import { useLocation } from "react-router-dom";
import b2connectLogo from "../../assets/images/logoB2connect.webp";

const menuItems = [
  { text: "Catégories", icon: <CategoryIcon />, path: "/admin/categories" },
  { text: "Produits", icon: <InventoryIcon />, path: "/admin/products" },
  { text: "Commandes", icon: <ShoppingCartIcon />, path: "/admin/orders" },
  { text: "Utilisateurs", icon: <PeopleIcon />, path: "/admin/users" }
];

const Sidebar = ({ user, onLogout, onNavigate }) => {
  const location = useLocation();

  return (
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
              onClick={() => onNavigate(item.path)}
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
          onClick={onLogout}
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
};

export default Sidebar;
