import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";

/**
 * ProductCard component - displays individual product information
 * Shows image, name, type, price and rating
 */
function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        border: "none",
        backgroundColor: "#f5f5f5",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0px 8px 16px rgba(31, 45, 61, 0.12)"
        }
      }}
    >
      {/* Image */}
      <CardMedia
        component="img"
        height="240"
        image={product.images?.[0] || "https://via.placeholder.com/240"}
        alt={product.name}
        sx={{
          objectFit: "cover",
          backgroundColor: "#ffffff"
        }}
      />

      {/* Content */}
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Product Name */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 600,
            color: "primary.main",
            mb: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical"
          }}
        >
          {product.name}
        </Typography>

        {/* Product Type/Brand */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.brand || "Marque non spécifiée"}
        </Typography>

        {/* Rating */}
        {product.rating && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Rating
              value={product.rating}
              readOnly
              size="small"
              precision={0.5}
            />
            <Typography variant="caption" color="text.secondary">
              ({product.reviewCount || 0})
            </Typography>
          </Box>
        )}

        {/* Stock Status */}
        <Typography
          variant="caption"
          sx={{
            color: product.stock > 0 ? "success.main" : "error.main",
            fontWeight: 500,
            mb: 1
          }}
        >
          {product.stock > 0 ? "En stock" : "Rupture de stock"}
        </Typography>

        {/* Price */}
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            color: "primary.main",
            mt: "auto",
            mb: 2
          }}
        >
          {parseFloat(product.price).toFixed(2)} €
        </Typography>

        {/* Add to Cart Button */}
        <Button
          variant="contained"
          color="secondary"
          size="small"
          fullWidth
          onClick={handleViewDetails}
          disabled={product.stock === 0}
          sx={{
            textTransform: "none",
            fontWeight: 500
          }}
        >
          Voir détails
        </Button>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
