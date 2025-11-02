import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getProducts } from "../../../api";
import { useSnackbar } from "../../../hooks/useSnackbar";
import ProductFilters from "./components/ProductFilters";
import ProductGrid from "./components/ProductGrid";

function Home() {
  const { showError } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    brand: "all",
    price: "all",
    sort: "new"
  });

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        setProducts(response.data || []);
        setFilteredProducts(response.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        showError("Erreur lors du chargement des produits");
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];

    // Apply category filter
    if (filters.category !== "all") {
      result = result.filter(
        (product) =>
          product.category_id?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Apply brand filter
    if (filters.brand !== "all") {
      result = result.filter(
        (product) =>
          product.brand?.toLowerCase() === filters.brand.toLowerCase()
      );
    }

    // Apply price filter
    if (filters.price !== "all") {
      const [min, max] =
        filters.price === "500+"
          ? [500, Infinity]
          : filters.price.split("-").map(Number);
      result = result.filter(
        (product) => product.price >= min && product.price <= max
      );
    }

    // Apply sorting
    switch (filters.sort) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "new":
      default:
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }

    setFilteredProducts(result);
  }, [products, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (sortValue) => {
    setFilters((prev) => ({ ...prev, sort: sortValue }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Page Title */}
      <Typography
        variant="h1"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: "primary.main",
          mb: 3
        }}
      >
        Explorez notre catalogue
      </Typography>

      {/* Page Description */}
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 5, maxWidth: "800px" }}
      >
        Que vous cherchiez les derniers composants, un PC portable performant ou
        des périphériques fiables, trouvez tout ce dont vous avez besoin ici.
        Parcourez nos sélections et nouveautés.
      </Typography>

      {/* Filters */}
      <ProductFilters
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
      />

      {/* Loading State */}
      {loading ? (
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
      ) : (
        <>
          {/* Results Count */}
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {filteredProducts.length} produit
            {filteredProducts.length !== 1 ? "s" : ""} trouvé
            {filteredProducts.length !== 1 ? "s" : ""}
          </Typography>

          {/* Product Grid */}
          <ProductGrid products={filteredProducts} loading={false} />
        </>
      )}
    </Container>
  );
}

export default Home;
