import { Box, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCategory, getCategories } from "../../api/categories";
import AdminBreadcrumbs from "../../components/admin/AdminBreadcrumbs";
import DataTable from "../../components/admin/DataTable";
import DataTableToolbar from "../../components/admin/DataTableToolbar";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog";
import { useSnackbar } from "../../hooks/useSnackbar";

const columns = [
  { id: "name", label: "Nom" },
  { id: "description", label: "Description" },
  {
    id: "created_at",
    label: "Date de création",
    render: (value) => new Date(value).toLocaleDateString("fr-FR")
  },
  {
    id: "product_count",
    label: "Nombre de produits",
    align: "center",
    render: (value) => value || "Non disponible"
  }
];

function CategoriesPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
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
    category: null
  });

  // Charger les catégories depuis l'API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      showError("Erreur lors du chargement des catégories");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les catégories au montage du composant
  useEffect(() => {
    fetchCategories();
  }, []);

  // Filtrer et trier les catégories
  useEffect(() => {
    let filtered = categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Tri
    filtered.sort((a, b) => {
      let aVal = a[orderBy];
      let bVal = b[orderBy];

      if (orderBy === "created_at") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
        return order === "asc" ? aVal - bVal : bVal - aVal;
      }

      // Pour les chaînes de caractères, utiliser localeCompare pour gérer les accents
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

    setFilteredCategories(filtered);
  }, [categories, searchValue, orderBy, order]);

  const handleSearchChange = (value) => {
    setSearchValue(value);
    setPage(0);
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
    } catch (error) {
      showError("Erreur lors de la suppression de la catégorie");
      console.error(error);
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

  const handleExport = () => {
    // TODO: Implémenter l'export CSV/Excel
    const csv = [
      columns.map((col) => col.label).join(","),
      ...filteredCategories.map((cat) =>
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
  };

  const paginatedData = filteredCategories.slice(
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
    <Box>
      <AdminBreadcrumbs />

      <DataTableToolbar
        title="Liste des catégories"
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onAdd={handleAdd}
        onRefresh={handleRefresh}
        onExport={handleExport}
        columns={columns}
        visibleColumns={visibleColumns}
        onToggleColumn={handleToggleColumn}
      />

      <DataTable
        columns={columns}
        data={paginatedData}
        visibleColumns={visibleColumns}
        onRowClick={handleRowClick}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={filteredCategories.length}
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
