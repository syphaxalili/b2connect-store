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
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../../../api";
import { useCart } from "../../../hooks/useCart";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { getStockStatus } from "../../../utils/stockStatus";
import { useSelector } from "react-redux";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const thumbnailsRef = useRef(null);
  const { showSuccess, showError } = useSnackbar();
  const { addItem, isLoading: cartLoading } = useCart();
  let loading = useSelector((state) => state.loading.requestCount > 0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await getProductById(id);
      setProduct(response.data);
    } catch {
      showError("Impossible de charger le produit");
      navigate("/");
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

  const handleAddToCart = async () => {
    if (!product) {
      showError("Produit non disponible");
      return;
    }

    if (quantity < 1) {
      showError("La quantité doit être au moins 1");
      return;
    }

    if (quantity > product?.stock) {
      showError(`Stock insuffisant. Disponible: ${product?.stock}`);
      return;
    }

    try {
      await addItem(product, quantity);
      showSuccess(`Le produit a été bien ajouté au panier`);
      navigate("/");
    } catch (err) {
      showError(err.message || "Erreur lors de l'ajout au panier");
    }
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

  const images =
    product?.images && product?.images.length > 0
      ? product?.images
      : ["/placeholder-product?.jpg"];

  return !loading && (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        sx={{ mb: 3 }}
      >
        Retour à la boutique
      </Button>

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
                alt={product?.name}
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
                      alt={`${product?.name} - ${index + 1}`}
                      loading="lazy"
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
              {product?.name}
            </Typography>

            {/* Marque */}
            {product?.brand && (
              <Typography
                variant="h6"
                color="primary"
                sx={{ fontWeight: 400, mb: 2 }}
              >
                Marque: {product?.brand}
              </Typography>
            )}

            {/* Prix */}
            <Typography
              variant="h4"
              color="primary"
              sx={{ fontWeight: 700, mb: 3 }}
            >
              {product?.price.toFixed(2)} €
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
                {product?.description || "Aucune description disponible."}
              </Typography>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Stock Status */}
            <Box sx={{ mb: 3 }}>
              {(() => {
                const stockStatus = getStockStatus(product?.stock);
                return (
                  <Chip
                    label={stockStatus.label}
                    color={stockStatus.color}
                    sx={{ fontWeight: 600 }}
                  />
                );
              })()}
            </Box>

            {/* Sélecteur de quantité */}
            {product?.stock > 0 && (
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
                        if (!isNaN(val) && val >= 1 && val <= product?.stock) {
                          setQuantity(val);
                        }
                      }}
                      inputProps={{
                        min: 1,
                        max: product?.stock,
                        style: { textAlign: "center" }
                      }}
                      sx={{ width: 80 }}
                    />
                    <IconButton
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product?.stock}
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
                  disabled={cartLoading || quantity > product?.stock}
                  sx={{
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: 600
                  }}
                >
                  {cartLoading ? "Ajout en cours..." : "Ajouter au panier"}
                </Button>
              </>
            )}
          </Box>
        </Grid>

        {/* Caractéristiques - Pleine largeur */}
        {product?.specifications &&
          Object.keys(product?.specifications).length > 0 && (
            <Grid size={{ xs: 12 }} sx={{ mt: 4 }}>
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
                {Object.entries(product?.specifications).map(([key, value]) => (
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
