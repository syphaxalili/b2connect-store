import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCategory, getCategories } from "../../../api";
import AdminBreadcrumbs from "../../../components/admin/AdminBreadcrumbs";
import DataTable from "../../../components/admin/DataTable";
import TopActions from "../../../components/admin/DataTable/TopActions";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { CATEGORIES_COLUMNS as columns } from "../../../constants/admin/columns";
import { useSnackbar } from "../../../hooks/useSnackbar";
import useDebounce from "../../../hooks/useDebounce";

function CategoriesPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("_id");
  const [order, setOrder] = useState("asc");
  const [visibleColumns, setVisibleColumns] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col.id]: true }), {})
  );
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    category: null
  });

  // Charger les catégories depuis l'API
  const fetchCategories = async () => {
    try {
      const response = await getCategories({ 
        page: page + 1,
        limit: rowsPerPage,
        search: debouncedSearchValue || undefined,
        sortBy: orderBy,
        sortOrder: order
      });
      setCategories(response.data.categories || []);
      setTotalCount(response.data.pagination?.total || 0);
    } catch {
      showError("Erreur lors du chargement des catégories");
    }
  };

  // Charger les catégories au montage du composant
  useEffect(() => {
    fetchCategories();
  }, [page, rowsPerPage, debouncedSearchValue, orderBy, order]);

  const displayedCategories = categories;

  const handleSearchChange = (value) => {
    setSearchValue(value);
    setPage(0); // Reset à la page 1 lors d'une recherche
  };

  const handleRefresh = () => {
    fetchCategories();
    showSuccess("Données rafraîchies!");
  };

  const handleAdd = () => {
    navigate("/admin/categories/new");
  };

  const handleEdit = (category) => {
    navigate(`/admin/categories/${category._id}/edit`);
  };

  const handleRowClick = (category) => {
    navigate(`/admin/categories/${category._id}`);
  };

  const handleDeleteClick = (category) => {
    setDeleteDialog({ open: true, category });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCategory(deleteDialog.category._id);
      showSuccess("Catégorie supprimée avec succès!");
      setDeleteDialog({ open: false, category: null });
      fetchCategories(); // Recharger les données
    } catch {
      showError("Erreur lors de la suppression de la catégorie");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, category: null });
  };

  const handleToggleColumn = (columnId) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  const handleExport = async () => {
    try {
      const response = await getCategories({ limit: 10000 });
      const allCategories = response.data.categories || [];

      const csv = [
        columns.map((col) => col.label).join(","),
        ...allCategories.map((cat) =>
          columns.map((col) => cat[col.id]).join(",")
        )
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "categories.csv";
      a.click();
      showSuccess("Export réussi!");
    } catch {
      showError("Erreur lors de l'export");
    }
  };

  const paginatedData = displayedCategories;

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
          Catégories
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
        totalCount={totalCount}
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
          setPage(0); // Reset à la page 1 lors d'un tri
        }}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onExport={handleExport}
        onToggleColumn={handleToggleColumn}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer la catégorie "${deleteDialog.category?.name}" ? Cette action est irréversible.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}

export default CategoriesPage;
