import { Menu as MenuIcon } from "@mui/icons-material";
import { AppBar, IconButton, Toolbar, useTheme } from "@mui/material";
import b2connectLogo from "../../assets/images/logoB2connect.webp";

const Header = ({ onDrawerToggle }) => {
  const theme = useTheme();

  return (
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
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <img src={b2connectLogo} alt="b2connect logo" width={120} />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
