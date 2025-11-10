import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack
} from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import { getCategoriesForFilters, getDistinctBrands } from "../../../../api";
import { useSnackbar } from "../../../../hooks/useSnackbar";

const ProductFilters = memo(({ onFilterChange, onSortChange }) => {
  const { showError } = useSnackbar();
  const [filters, setFilters] = useState({
    category: "all",
    brand: "all",
    price: "all",
    sort: "new"
  });

  const [categories, setCategories] = useState([
    { value: "all", label: "Toutes les catégories" }
  ]);
  const [brands, setBrands] = useState([
    { value: "all", label: "Toutes les marques" }
  ]);

  // Charger les catégories et marques au montage du composant
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        // Charger les catégories
        const categoriesResponse = await getCategoriesForFilters();
        const categoriesData = categoriesResponse.data || [];
        const formattedCategories = [
          { value: "all", label: "Toutes les catégories" },
          ...categoriesData.map((cat) => ({
            value: cat._id,
            label: cat.name
          }))
        ];
        setCategories(formattedCategories);

        // Charger les marques
        const brandsResponse = await getDistinctBrands();
        const brandsData = brandsResponse.data || [];
        const formattedBrands = [
          { value: "all", label: "Toutes les marques" },
          ...brandsData.map((brand) => ({
            value: brand.toLowerCase(),
            label: brand
          }))
        ];
        setBrands(formattedBrands);
      } catch (error) {
        console.error("Erreur lors du chargement des filtres:", error);
        showError("Erreur lors du chargement des filtres");
      }
    };

    loadFilterData();
  }, []);

  const priceRanges = [
    { value: "all", label: "Tous les prix" },
    { value: "0-50", label: "0 - 50 €" },
    { value: "50-100", label: "50 - 100 €" },
    { value: "100-500", label: "100 - 500 €" },
    { value: "500+", label: "500 € +" }
  ];

  const sortOptions = [
    { value: "new", label: "Nouveautés" },
    { value: "price_asc", label: "Prix : Croissant" },
    { value: "price_desc", label: "Prix : Décroissant" }
  ];

  const handleFilterChange = useCallback((filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  }, [filters, onFilterChange]);

  const handleSortChange = useCallback((value) => {
    const newFilters = { ...filters, sort: value };
    setFilters(newFilters);
    if (onSortChange) {
      onSortChange(value);
    }
  }, [filters, onSortChange]);

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", md: "center" }}
      spacing={2}
      sx={{ mb: 4 }}
    >
      {/* Filters (Left) */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ flex: 1 }}
      >
        {/* Category Filter */}
        <FormControl
          variant="outlined"
          size="small"
          sx={{
            minWidth: 160,
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px",
              backgroundColor: "background.paper"
            }
          }}
        >
          <InputLabel>Catégorie</InputLabel>
          <Select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            label="Catégorie"
          >
            {categories.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>
                {cat.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Brand Filter */}
        <FormControl
          variant="outlined"
          size="small"
          sx={{
            minWidth: 160,
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px",
              backgroundColor: "background.paper"
            }
          }}
        >
          <InputLabel>Marque</InputLabel>
          <Select
            value={filters.brand}
            onChange={(e) => handleFilterChange("brand", e.target.value)}
            label="Marque"
          >
            {brands.map((brand) => (
              <MenuItem key={brand.value} value={brand.value}>
                {brand.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Price Filter */}
        <FormControl
          variant="outlined"
          size="small"
          sx={{
            minWidth: 160,
            "& .MuiOutlinedInput-root": {
              borderRadius: "50px",
              backgroundColor: "background.paper"
            }
          }}
        >
          <InputLabel>Prix</InputLabel>
          <Select
            value={filters.price}
            onChange={(e) => handleFilterChange("price", e.target.value)}
            label="Prix"
          >
            {priceRanges.map((range) => (
              <MenuItem key={range.value} value={range.value}>
                {range.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {/* Sort (Right) */}
      <FormControl
        variant="outlined"
        size="small"
        sx={{
          minWidth: 160,
          "& .MuiOutlinedInput-root": {
            borderRadius: "50px",
            backgroundColor: "background.paper"
          }
        }}
      >
        <InputLabel>Trier par</InputLabel>
        <Select
          value={filters.sort}
          onChange={(e) => handleSortChange(e.target.value)}
          label="Trier par"
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  );
});

ProductFilters.displayName = 'ProductFilters';

export default ProductFilters;
