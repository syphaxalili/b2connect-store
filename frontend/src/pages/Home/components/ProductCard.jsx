import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
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
        borderRadius: 0,
        boxShadow: "none",
        transition: "none",
        "&:hover": {
          boxShadow: "none"
        }
      }}
    >
      {/* Image - Clickable Square */}
      <Box
        component="button"
        onClick={handleViewDetails}
        sx={{
          cursor: "pointer",
          border: "none",
          background: "none",
          padding: 0,
          aspectRatio: "1 / 1",
          overflow: "hidden"
        }}
      >
        <CardMedia
          component="img"
          image={product.images?.[0] || "https://placehold.co/600x400/png"}
          alt={product.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 0,
            transition: "transform 0.3s ease",
            "&:hover": {
              opacity: 0.9,
              transform: "scale(1.05)"
            }
          }}
        />
      </Box>

      {/* Content */}
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "background.default",
          padding: "10px 0 0"
        }}
      >
        {/* Product Name */}
        <Typography
          variant="h5"
          component="h3"
          sx={{
            fontWeight: 600,
            color: "primary.main",
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
          {product.description || "Description non spécifiée"}
        </Typography>

        {/* Price */}
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            color: "primary.main",
            mt: "auto"
          }}
        >
          €{parseFloat(product.price).toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ProductCard;
