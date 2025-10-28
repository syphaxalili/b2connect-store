import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { clearUser } from "../../store/slices/authSlice";
import { clearAuthToken } from "../../utils/storage";
import Header from "./Header";
import Sidebar from "./Sidebar";

const mapStateToProps = (state) => ({ user: state.auth });

const drawerWidth = 280;

function AdminLayout({ user }) {
  const navigate = useNavigate();
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

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {isMobile && <Header onDrawerToggle={handleDrawerToggle} />}

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
          <Sidebar
            user={user}
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
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
          <Sidebar
            user={user}
            onLogout={handleLogout}
            onNavigate={handleNavigation}
          />
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
