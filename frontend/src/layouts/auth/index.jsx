import { Box, Container, Paper } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import logoB2connect from "../../assets/images/logoB2connect.webp";

const AuthFormLayout = ({ maxWidth = "md" }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4
      }}
    >
      <Container maxWidth={maxWidth}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 4 },
            maxWidth: "100%",
            borderRadius: 2
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <img
              src={logoB2connect}
              alt="B2CONNECT Logo"
              onClick={handleLogoClick}
              style={{
                maxWidth: "200px",
                height: "auto",
                cursor: "pointer",
                transition: "transform 0.2s ease-in-out"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          </Box>
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthFormLayout;
