import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography
} from "@mui/material";
import ProductCard from "./ProductCard";

/**
 * ProductGrid component - displays products in a responsive grid
 * Handles loading and empty states
 */
function ProductGrid({ products, loading = false }) {
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px"
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
            flexDirection: "column",
            gap: 2
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Aucun produit trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Essayez d'ajuster vos filtres ou votre recherche
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}

export default ProductGrid;
