import { Save as SaveIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createProduct,
  getCategories,
  getProductById,
  updateProduct
} from "../../../api";
import AdminBreadcrumbs from "../../../components/admin/AdminBreadcrumbs";
import { useSnackbar } from "../../../hooks/useSnackbar";

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const isEditMode = id && id !== "new";

  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    brand: "",
    price: "",
    stock: "",
    description: "",
    images: [],
    specifications: {}
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageInput, setImageInput] = useState("");

  // Charger les catégories et les données du produit (en mode édition)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Charger les catégories
        const categoriesResponse = await getCategories();
        setCategories(categoriesResponse.data);

        // Charger le produit en mode édition
        if (isEditMode) {
          const productResponse = await getProductById(id);
          const product = productResponse.data;

          setFormData({
            name: product.name,
            category_id: product.category_id || "",
            brand: product.brand,
            price: product.price,
            stock: product.stock,
            description: product.description || "",
            images: product.images || [],
            specifications: product.specifications || {}
          });

          // Trouver la catégorie sélectionnée
          if (product.category_id) {
            const category = categoriesResponse.data.find(
              (cat) => cat._id === product.category_id
            );
            setSelectedCategory(category || null);
          }
        }
      } catch (error) {
        showError("Erreur lors du chargement des données");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const category = categories.find((cat) => cat._id === categoryId);

    setFormData((prev) => ({
      ...prev,
      category_id: categoryId,
      specifications: {} // Reset specifications when category changes
    }));
    setSelectedCategory(category || null);

    if (errors.category_id) {
      setErrors((prev) => ({ ...prev, category_id: "" }));
    }
  };

  const handleSpecificationChange = (specName, value, dataType) => {
    let processedValue = value;

    // Convert value based on dataType
    if (dataType === "number") {
      processedValue = value === "" ? "" : Number(value);
    } else if (dataType === "boolean") {
      processedValue = value;
    }

    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [specName]: processedValue
      }
    }));
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput("");
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }
    if (!formData.category_id) {
      newErrors.category_id = "La catégorie est requise";
    }
    if (!formData.brand.trim()) {
      newErrors.brand = "La marque est requise";
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Le prix doit être supérieur à 0";
    }
    if (formData.stock === "" || formData.stock < 0) {
      newErrors.stock = "Le stock doit être supérieur ou égal à 0";
    }

    // Validate required specifications
    if (selectedCategory?.specs) {
      selectedCategory.specs.forEach((spec) => {
        if (spec.required && !formData.specifications[spec.name]) {
          newErrors[`spec_${spec.name}`] = `${spec.label} est requis`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);

      const dataToSave = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock)
      };

      if (isEditMode) {
        await updateProduct(id, dataToSave);
        showSuccess("Produit modifié avec succès!");
      } else {
        await createProduct(dataToSave);
        showSuccess("Produit créé avec succès!");
      }
      navigate("/admin/products");
    } catch (error) {
      showError(
        error.response?.data?.error ||
          "Erreur lors de l'enregistrement du produit"
      );
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/products");
  };

  const renderSpecificationField = (spec) => {
    const value = formData.specifications[spec.name] || "";
    const error = errors[`spec_${spec.name}`];

    switch (spec.dataType) {
      case "boolean":
        return (
          <FormControlLabel
            key={spec.name}
            control={
              <Checkbox
                checked={value === true}
                onChange={(e) =>
                  handleSpecificationChange(
                    spec.name,
                    e.target.checked,
                    spec.dataType
                  )
                }
                disabled={submitting}
              />
            }
            label={spec.label + (spec.required ? " *" : "")}
          />
        );

      case "number":
        return (
          <TextField
            key={spec.name}
            fullWidth
            label={spec.label}
            type="number"
            value={value}
            onChange={(e) =>
              handleSpecificationChange(
                spec.name,
                e.target.value,
                spec.dataType
              )
            }
            error={!!error}
            helperText={error}
            required={spec.required}
            disabled={submitting}
          />
        );

      case "date":
        return (
          <TextField
            key={spec.name}
            fullWidth
            label={spec.label}
            type="date"
            value={value}
            onChange={(e) =>
              handleSpecificationChange(
                spec.name,
                e.target.value,
                spec.dataType
              )
            }
            error={!!error}
            helperText={error}
            required={spec.required}
            disabled={submitting}
            InputLabelProps={{ shrink: true }}
          />
        );

      case "text":
        return (
          <TextField
            key={spec.name}
            fullWidth
            label={spec.label}
            multiline
            rows={3}
            value={value}
            onChange={(e) =>
              handleSpecificationChange(
                spec.name,
                e.target.value,
                spec.dataType
              )
            }
            error={!!error}
            helperText={error}
            required={spec.required}
            disabled={submitting}
          />
        );

      default:
        return (
          <TextField
            key={spec.name}
            fullWidth
            label={spec.label}
            value={value}
            onChange={(e) =>
              handleSpecificationChange(
                spec.name,
                e.target.value,
                spec.dataType
              )
            }
            error={!!error}
            helperText={error}
            required={spec.required}
            disabled={submitting}
          />
        );
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, maxWidth: { lg: "1200px" }, mx: "auto" }}>
      <AdminBreadcrumbs />

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {isEditMode ? "Modifier le produit" : "Nouveau produit"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {isEditMode
              ? "Modifiez les informations du produit"
              : "Remplissez les informations du nouveau produit"}
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            {/* Champs de base */}
            <Typography variant="h6" fontWeight={600}>
              Informations de base
            </Typography>

            <TextField
              fullWidth
              label="Nom du produit"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
              disabled={submitting}
            />

            <TextField
              fullWidth
              label="Marque"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              error={!!errors.brand}
              helperText={errors.brand}
              required
              disabled={submitting}
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              disabled={submitting}
              placeholder="Description détaillée du produit"
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Prix (€)"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                error={!!errors.price}
                helperText={errors.price}
                required
                disabled={submitting}
                inputProps={{ step: "0.01", min: "0" }}
              />

              <TextField
                fullWidth
                label="Stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                error={!!errors.stock}
                helperText={errors.stock}
                required
                disabled={submitting}
                inputProps={{ min: "0" }}
              />
            </Box>

            {/* Images */}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" fontWeight={600}>
              Images
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="URL de l'image"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                disabled={submitting}
                placeholder="https://example.com/image.jpg"
              />
              <Button
                variant="outlined"
                onClick={handleAddImage}
                disabled={submitting || !imageInput.trim()}
              >
                Ajouter
              </Button>
            </Box>

            {formData.images.length > 0 && (
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {formData.images.map((image, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      width: 120,
                      height: 120
                    }}
                  >
                    <Box
                      component="img"
                      src={image}
                      alt={`Image ${index + 1}`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider"
                      }}
                    />
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleRemoveImage(index)}
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        minWidth: "auto",
                        p: 0.5
                      }}
                    >
                      ✕
                    </Button>
                  </Box>
                ))}
              </Box>
            )}

            {/* Catégorie */}
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" fontWeight={600}>
              Catégorie et caractéristiques
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Sélectionnez une catégorie pour afficher les champs de
              caractéristiques spécifiques
            </Typography>

            <FormControl fullWidth error={!!errors.category_id} required>
              <InputLabel>Catégorie</InputLabel>
              <Select
                value={formData.category_id}
                onChange={handleCategoryChange}
                label="Catégorie"
                disabled={submitting}
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.category_id && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                  {errors.category_id}
                </Typography>
              )}
            </FormControl>

            {/* Spécifications dynamiques */}
            {selectedCategory?.specs && selectedCategory.specs.length > 0 && (
              <>
                {selectedCategory.specs
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((spec) => renderSpecificationField(spec))}
              </>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={submitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={
                  submitting ? <CircularProgress size={20} /> : <SaveIcon />
                }
                disabled={submitting}
              >
                {submitting
                  ? "Enregistrement..."
                  : isEditMode
                    ? "Enregistrer"
                    : "Créer"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ProductForm;
