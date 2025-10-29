import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../../../api/categories";
import { deleteProduct, getProducts } from "../../../api/products";
import AdminBreadcrumbs from "../../../components/admin/AdminBreadcrumbs";
import DataTable from "../../../components/admin/DataTable";
import TopActions from "../../../components/admin/DataTable/TopActions";
import ConfirmDialog from "../../../components/dialogs/ConfirmDialog";
import { PRODUCTS_COLUMNS as columns } from "../../../constants/admin/columns";
import { useSnackbar } from "../../../hooks/useSnackbar";

function ProductsPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [productsWithCategories, setProductsWithCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("_id");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col.id]: true }), {})
  );
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    product: null
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        getProducts(),
        getCategories()
      ]);

      const productsData = productsResponse.data;
      const categoriesData = categoriesResponse.data;

      const enrichedProducts = productsData.map((product) => {
        const category = categoriesData.find(
          (cat) => cat._id === product.category_id
        );

        return {
          ...product,
          category_id: category || { _id: product.category_id, name: "N/A" }
        };
      });

      setProductsWithCategories(enrichedProducts);
    } catch (error) {
      showError("Erreur lors du chargement des données");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrer et trier les produits
  useEffect(() => {
    let filtered = productsWithCategories.filter(
      (product) =>
        product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchValue.toLowerCase()) ||
        product.category_id?.name
          ?.toLowerCase()
          .includes(searchValue.toLowerCase())
    );

    // Tri
    filtered.sort((a, b) => {
      let aVal = a[orderBy];
      let bVal = b[orderBy];

      // Gestion spéciale pour category_id
      if (orderBy === "category_id") {
        aVal = a.category_id?.name || "";
        bVal = b.category_id?.name || "";
      }

      if (orderBy === "created_at") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
        return order === "asc" ? aVal - bVal : bVal - aVal;
      }

      // Pour les chaînes de caractères
      if (typeof aVal === "string" && typeof bVal === "string") {
        const comparison = aVal.localeCompare(bVal, "fr", {
          sensitivity: "base"
        });
        return order === "asc" ? comparison : -comparison;
      }

      // Pour les nombres
      if (aVal < bVal) return order === "asc" ? -1 : 1;
      if (aVal > bVal) return order === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredProducts(filtered);
  }, [productsWithCategories, searchValue, orderBy, order]);

  const handleSearchChange = (value) => {
    setSearchValue(value);
    setPage(0);
  };

  const handleRefresh = () => {
    fetchData();
    showSuccess("Données rafraîchies!");
  };

  const handleAdd = () => {
    navigate("/admin/products/new");
  };

  const handleEdit = (product) => {
    navigate(`/admin/products/${product._id}/edit`);
  };

  const handleRowClick = (product) => {
    navigate(`/admin/products/${product._id}`);
  };

  const handleDeleteClick = (product) => {
    setDeleteDialog({ open: true, product });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(deleteDialog.product._id);
      showSuccess("Produit supprimé avec succès!");
      setDeleteDialog({ open: false, product: null });
      fetchData();
    } catch (error) {
      console.error(error);
      showError("Erreur lors de la suppression du produit");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, product: null });
  };

  const handleToggleColumn = (columnId) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  const handleExport = () => {
    const csv = [
      columns.map((col) => col.label).join(","),
      ...filteredProducts.map((product) =>
        columns
          .map((col) => {
            if (col.id === "category_id") {
              return product.category_id?.name || "";
            }
            return product[col.id];
          })
          .join(",")
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();
    showSuccess("Export réussi!");
  };

  const paginatedData = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
    <Box
      sx={{
        width: "100%",
        maxWidth: { lg: "1200px" },
        height: "100%",
        mt: {
          xs: 0,
          md: 2
        },
        mx: "auto",
        px: { xs: 2, sm: 2, md: 3 },
        pb: 2
      }}
    >
      <AdminBreadcrumbs />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          fontWeight={600}
          sx={{ mb: 2, mt: 2 }}
          align={"center"}
        >
          Produits
        </Typography>

        <TopActions onAdd={handleAdd} onRefresh={handleRefresh} />
      </Box>

      <DataTable
        columns={columns}
        data={paginatedData}
        visibleColumns={visibleColumns}
        onRowClick={handleRowClick}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={filteredProducts.length}
        onPageChange={(e, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        orderBy={orderBy}
        order={order}
        onSort={(columnId, direction) => {
          setOrderBy(columnId);
          setOrder(direction);
        }}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onExport={handleExport}
        onToggleColumn={handleToggleColumn}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer le produit "${deleteDialog.product?.name}" ? Cette action est irréversible.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}

export default ProductsPage;
