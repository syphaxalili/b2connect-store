import { Box, CircularProgress } from "@mui/material";

/**
 * Écran de chargement fullscreen
 * Utilisé pendant l'hydratation de l'authentification
 */
export default function LoadingScreen() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress />
    </Box>
  );
}
