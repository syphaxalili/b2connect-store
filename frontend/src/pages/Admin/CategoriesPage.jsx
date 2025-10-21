import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminBreadcrumbs from "../../components/admin/AdminBreadcrumbs";
import DataTable from "../../components/admin/DataTable";
import DataTableToolbar from "../../components/admin/DataTableToolbar";
import ConfirmDialog from "../../components/dialogs/ConfirmDialog";
import { useSnackbar } from "../../hooks/useSnackbar";

// Données mockées - à remplacer par des appels API
const mockCategories = [
  {
    id: 1,
    name: "Électronique",
    description: "Produits électroniques et gadgets",
    created_at: "2024-01-15T10:30:00Z",
    product_count: 45
  },
  {
    id: 2,
    name: "Vêtements",
    description: "Mode et accessoires",
    created_at: "2024-01-20T14:20:00Z",
    product_count: 120
  },
  {
    id: 3,
    name: "Maison & Jardin",
    description: "Articles pour la maison et le jardin",
    created_at: "2024-02-01T09:15:00Z",
    product_count: 78
  },
  {
    id: 4,
    name: "Sports & Loisirs",
    description: "Équipements sportifs et loisirs",
    created_at: "2024-02-10T16:45:00Z",
    product_count: 32
  },
  {
    id: 5,
    name: "Livres",
    description: "Livres et magazines",
    created_at: "2024-02-15T11:00:00Z",
    product_count: 156
  }
];

const columns = [
  { id: "id", label: "ID", align: "center" },
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
    align: "center"
  }
];

function CategoriesPage() {
  const navigate = useNavigate();
  const { showSuccess } = useSnackbar();
  const [categories, setCategories] = useState(mockCategories);
  const [filteredCategories, setFilteredCategories] = useState(mockCategories);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState("asc");
  const [visibleColumns, setVisibleColumns] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col.id]: true }), {})
  );
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    category: null
  });

  const breadcrumbItems = [
    { label: "Admin", path: "/admin" },
    { label: "Catégories", path: "/admin/categories" }
  ];

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
      }

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
    // TODO: Appeler l'API pour rafraîchir les données
    showSuccess("Données rafraîchies!");
  };

  const handleAdd = () => {
    navigate("/admin/categories/new");
  };

  const handleEdit = (category) => {
    navigate(`/admin/categories/${category.id}/edit`);
  };

  const handleRowClick = (category) => {
    navigate(`/admin/categories/${category.id}`);
  };

  const handleDeleteClick = (category) => {
    setDeleteDialog({ open: true, category });
  };

  const handleDeleteConfirm = () => {
    // TODO: Appeler l'API pour supprimer
    setCategories((prev) =>
      prev.filter((cat) => cat.id !== deleteDialog.category.id)
    );
    showSuccess("Catégorie supprimée avec succès!");
    setDeleteDialog({ open: false, category: null });
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

  return (
    <Box>
      <AdminBreadcrumbs items={breadcrumbItems} />

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
