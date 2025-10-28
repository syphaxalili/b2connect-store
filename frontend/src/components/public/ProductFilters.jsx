import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack
} from "@mui/material";
import { useState } from "react";

/**
 * ProductFilters component - filtering and sorting controls
 * Includes category, brand, price filters and sorting options
 */
function ProductFilters({ onFilterChange, onSortChange }) {

  const [filters, setFilters] = useState({
    category: "all",
    brand: "all",
    price: "all",
    sort: "new"
  });

  const categories = [
    { value: "all", label: "Toutes les catégories" },
    { value: "batteries", label: "Batteries" },
    { value: "chargers", label: "Chargeurs" },
    { value: "accessories", label: "Accessoires" },
    { value: "peripherals", label: "Périphériques" }
  ];

  const brands = [
    { value: "all", label: "Toutes les marques" },
    { value: "dell", label: "Dell" },
    { value: "hp", label: "HP" },
    { value: "lenovo", label: "Lenovo" },
    { value: "asus", label: "Asus" },
    { value: "apple", label: "Apple" },
    { value: "samsung", label: "Samsung" },
    { value: "logitech", label: "Logitech" }
  ];

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
    { value: "price_desc", label: "Prix : Décroissant" },
    { value: "popular", label: "Populaires" }
  ];

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const handleSortChange = (value) => {
    const newFilters = { ...filters, sort: value };
    setFilters(newFilters);
    if (onSortChange) {
      onSortChange(value);
    }
  };

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
              borderRadius: "50px"
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
              borderRadius: "50px"
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
              borderRadius: "50px"
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
            borderRadius: "50px"
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
}

export default ProductFilters;
