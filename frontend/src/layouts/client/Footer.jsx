import { Box, Container, Typography } from "@mui/material";

/**
 * Footer component
 */
function Footer() {
  return (
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
  );
}

export default Footer;
