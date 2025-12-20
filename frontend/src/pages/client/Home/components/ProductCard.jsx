import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import noImageAvailable from "../../../../assets/images/image-no-available.svg";

const ProductCard = memo(({ product }) => {
  const navigate = useNavigate();

  const handleViewDetails = useCallback(() => {
    navigate(`/product/${product._id}`);
  }, [navigate, product._id]);

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
          mb: 0.5,
          padding: 0,
          aspectRatio: "1 / 1",
          overflow: "hidden"
        }}
      >
        <CardMedia
          component="img"
          image={product.images?.[0] || noImageAvailable}
          alt={product.name}
          loading="lazy"
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
        onClick={handleViewDetails}
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "background.default",
          padding: "10px 0 0",
          cursor: "pointer",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "#eeeeee"
          }
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

        {/* Product Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 0.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {product.description || "Aucune description"}
        </Typography>

        {/* Product Price */}
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
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
