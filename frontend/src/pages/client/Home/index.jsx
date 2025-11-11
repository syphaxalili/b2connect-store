import { Box, Container, Pagination, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { getProducts } from "../../../api";
import { useSnackbar } from "../../../hooks/useSnackbar";
import ProductFilters from "./components/ProductFilters";
import ProductGrid from "./components/ProductGrid";

function Home() {
  const { showError } = useSnackbar();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: "all",
    brand: "all",
    price: "all",
    sort: "new"
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {
          page,
          limit: 20,
          category_id: filters.category === "all" ? undefined : filters.category,
          brand: filters.brand === "all" ? undefined : filters.brand,
          price: filters.price === "all" ? undefined : filters.price,
          sort: filters.sort === "new" ? undefined : filters.sort,
        };

        const response = await getProducts(params);
        
        setProducts(response.data.products || []);
        setTotalPages(response.data.pagination.pages || 1);
      } catch {
        showError("Erreur lors du chargement des produits");
        setProducts([]);
      }
    };

    fetchProducts();
  }, [page, filters.category, filters.brand, filters.price, filters.sort]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((sortValue) => {
    setFilters((prev) => ({ ...prev, sort: sortValue }));
    setPage(1);
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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

      {/* Results Count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {products.length} produit
        {products.length !== 1 ? "s" : ""} trouvé
        {products.length !== 1 ? "s" : ""}
      </Typography>

      {/* Product Grid */}
      <ProductGrid products={products} loading={false} />

      {/* Pagination */}
      {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
    </Container>
  );
}

export default Home;
