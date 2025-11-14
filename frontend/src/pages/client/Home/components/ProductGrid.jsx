import {
  Box,
  Container,
  Grid,
  Typography
} from "@mui/material";
import { memo } from "react";
import ProductCard from "./ProductCard";

const ProductGrid = memo(({ products, loading = false }) => {
  return !loading && (
      (!products || products.length === 0) ?
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
    : (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product._id}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
    )
  );
});

ProductGrid.displayName = 'ProductGrid';

export default ProductGrid;
