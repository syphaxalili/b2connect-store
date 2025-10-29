import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../../../api/products";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const thumbnailsRef = useRef(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await getProductById(id);
      setProduct(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Impossible de charger le produit");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 999)) {
      setQuantity(newQuantity);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.max(prev - 0.5, 1);
      if (newZoom === 1) {
        setImagePosition({ x: 0, y: 0 }); // Reset position when zoom is 1
      }
      return newZoom;
    });
  };

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - imagePosition.x,
        y: e.clientY - imagePosition.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleAddToCart = () => {
    // TODO: Implémenter l'ajout au panier
    console.log("Add to cart:", { product, quantity });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const scrollThumbnails = (direction) => {
    if (thumbnailsRef.current) {
      const scrollAmount = 100;
      thumbnailsRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton
              variant="rectangular"
              height={500}
              sx={{ borderRadius: 2 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" height={40} width="60%" />
            <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || "Produit non trouvé"}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Retour à la boutique
        </Button>
      </Container>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["/placeholder-product.jpg"];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Bouton retour */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        sx={{ mb: 3 }}
      >
        Retour à la boutique
      </Button>

      {addedToCart && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Produit ajouté au panier avec succès !
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Galerie d'images - Gauche */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: "#f9f9f9",
              borderRadius: 2,
              position: "relative"
            }}
          >
            {/* Image principale avec zoom et drag */}
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 2,
                backgroundColor: "white",
                height: { xs: 300, sm: 400, md: 500 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2
              }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <Box
                component="img"
                src={images[selectedImage]}
                alt={product.name}
                onMouseDown={handleMouseDown}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  transform: `scale(${zoom}) translate(${imagePosition.x / zoom}px, ${imagePosition.y / zoom}px)`,
                  transition: isDragging ? "none" : "transform 0.3s ease",
                  cursor:
                    zoom > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
                  userSelect: "none",
                  pointerEvents: zoom > 1 ? "auto" : "auto"
                }}
                onClick={() => {
                  if (zoom === 1) {
                    handleZoomIn();
                  } else if (!isDragging) {
                    setZoom(1);
                    setImagePosition({ x: 0, y: 0 });
                  }
                }}
                draggable={false}
              />

              {/* Contrôles de zoom */}
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  display: "flex",
                  gap: 1,
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  borderRadius: 1,
                  p: 0.5
                }}
              >
                <IconButton
                  size="small"
                  onClick={handleZoomIn}
                  disabled={zoom >= 3}
                  sx={{
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "white" }
                  }}
                >
                  <ZoomInIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleZoomOut}
                  disabled={zoom <= 1}
                  sx={{
                    backgroundColor: "white",
                    "&:hover": { backgroundColor: "white" }
                  }}
                >
                  <ZoomOutIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {/* Miniatures avec scroll horizontal */}
            {images.length > 1 && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {/* Flèche gauche */}
                <IconButton
                  size="small"
                  onClick={() => scrollThumbnails("left")}
                  sx={{
                    flexShrink: 0,
                    backgroundColor: "#f0f0f0",
                    "&:hover": { backgroundColor: "#e0e0e0" }
                  }}
                >
                  <ChevronLeftIcon fontSize="small" />
                </IconButton>

                {/* Conteneur des miniatures */}
                <Box
                  ref={thumbnailsRef}
                  sx={{
                    display: "flex",
                    gap: 1,
                    overflowX: "auto",
                    overflowY: "hidden",
                    pb: 1,
                    scrollBehavior: "smooth",
                    flex: 1,
                    "&::-webkit-scrollbar": {
                      height: "6px"
                    },
                    "&::-webkit-scrollbar-track": {
                      backgroundColor: "#f0f0f0",
                      borderRadius: "3px"
                    },
                    "&::-webkit-scrollbar-thumb": {
                      backgroundColor: "#1f2d3d",
                      borderRadius: "3px",
                      "&:hover": {
                        backgroundColor: "#2a3847"
                      }
                    }
                  }}
                >
                  {images.map((image, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      onClick={() => {
                        setSelectedImage(index);
                        setZoom(1);
                        setImagePosition({ x: 0, y: 0 });
                      }}
                      sx={{
                        width: 80,
                        height: 80,
                        minWidth: 80,
                        objectFit: "cover",
                        borderRadius: 1,
                        cursor: "pointer",
                        border:
                          selectedImage === index
                            ? "3px solid #1f2d3d"
                            : "3px solid transparent",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          opacity: 0.8,
                          transform: "scale(1.05)"
                        }
                      }}
                    />
                  ))}
                </Box>

                {/* Flèche droite */}
                <IconButton
                  size="small"
                  onClick={() => scrollThumbnails("right")}
                  sx={{
                    flexShrink: 0,
                    backgroundColor: "#f0f0f0",
                    "&:hover": { backgroundColor: "#e0e0e0" }
                  }}
                >
                  <ChevronRightIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Informations produit - Droite */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box>
            {/* Titre */}
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 }}>
              {product.name}
            </Typography>

            {/* Marque */}
            {product.brand && (
              <Typography
                variant="h6"
                color="primary"
                sx={{ fontWeight: 400, mb: 2 }}
              >
                Marque: {product.brand}
              </Typography>
            )}

            {/* Prix */}
            <Typography
              variant="h4"
              color="primary"
              sx={{ fontWeight: 700, mb: 3 }}
            >
              {product.price.toFixed(2)} €
            </Typography>

            <Divider sx={{ mb: 3 }} />

            {/* Description */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Description
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.8 }}
              >
                {product.description || "Aucune description disponible."}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Stock */}
            <Box sx={{ mb: 3 }}>
              {product.stock > 0 ? (
                <Chip
                  label={`${product.stock} en stock`}
                  color="success"
                  sx={{ fontWeight: 600 }}
                />
              ) : (
                <Chip
                  label="Rupture de stock"
                  color="error"
                  sx={{ fontWeight: 600 }}
                />
              )}
            </Box>

            {/* Sélecteur de quantité */}
            {product.stock > 0 && (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    Quantité
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <IconButton
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      sx={{
                        border: "2px solid #e0e0e0",
                        "&:hover": { borderColor: "#1f2d3d" }
                      }}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <TextField
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val >= 1 && val <= product.stock) {
                          setQuantity(val);
                        }
                      }}
                      inputProps={{
                        min: 1,
                        max: product.stock,
                        style: { textAlign: "center" }
                      }}
                      sx={{ width: 80 }}
                    />
                    <IconButton
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                      sx={{
                        border: "2px solid #e0e0e0",
                        "&:hover": { borderColor: "#1f2d3d" }
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>

                {/* Bouton Ajouter au panier */}
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleAddToCart}
                  sx={{
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600
                  }}
                >
                  Ajouter au panier
                </Button>
              </>
            )}
          </Box>
        </Grid>

        {/* Caractéristiques - Pleine largeur */}
        {product.specifications &&
          Object.keys(product.specifications).length > 0 && (
            <Grid xs={12} sx={{ mt: 4 }}>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 600, mb: 2 }}
              >
                Caractéristiques
              </Typography>
              <Box
                component="ul"
                sx={{
                  pl: 2,
                  m: 0,
                  listStyle: "none"
                }}
              >
                {Object.entries(product.specifications).map(([key, value]) => (
                  <Box
                    component="li"
                    key={key}
                    sx={{
                      mb: 1,
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      gap: 1.5,
                      "&::before": {
                        content: '"•"',
                        color: "primary.main",
                        fontWeight: 700,
                        fontSize: "1.5rem",
                        lineHeight: 1,
                        flexShrink: 0
                      }
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        textTransform: "uppercase",
                        color: "primary.main",
                        fontSize: "0.9rem",
                        letterSpacing: "0.5px"
                      }}
                    >
                      {key.replace(/_/g, " ")}:
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {typeof value === "boolean"
                        ? value
                          ? "Oui"
                          : "Non"
                        : value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          )}
      </Grid>
    </Container>
  );
};

export default ProductDetails;
