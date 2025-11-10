import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUser, getUsers } from "../../../api";
import AdminBreadcrumbs from "../../../components/admin/AdminBreadcrumbs";
import DataTable from "../../../components/admin/DataTable";
import TopActions from "../../../components/admin/DataTable/TopActions";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { USERS_COLUMNS as columns } from "../../../constants/admin/columns";
import { useSnackbar } from "../../../hooks/useSnackbar";
import useDebounce from "../../../hooks/useDebounce";

function UsersPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState("asc");
  const [visibleColumns, setVisibleColumns] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col.id]: true }), {})
  );
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    user: null
  });

  // Charger les utilisateurs depuis l'API
  const fetchUsers = async () => {
    try {
      const response = await getUsers({ 
        page: page + 1,
        limit: rowsPerPage,
        search: debouncedSearchValue || undefined,
        sortBy: orderBy,
        sortOrder: order.toUpperCase()
      });
      setUsers(response.data.users || []);
      setTotalCount(response.data.pagination?.total || 0);
    } catch {
      showError("Erreur lors du chargement des utilisateurs");
    }
  };

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, debouncedSearchValue, orderBy, order]);

  const paginatedData = users;

  const handleSearchChange = (value) => {
    setSearchValue(value);
    setPage(0); // Reset à la page 1 lors d'une recherche
  };

  const handleRefresh = () => {
    fetchUsers();
    showSuccess("Données rafraîchies!");
  };

  const handleAdd = () => {
    navigate("/admin/users/new");
  };

  const handleEdit = (user) => {
    navigate(`/admin/users/${user.id}/edit`);
  };

  const handleRowClick = (user) => {
    navigate(`/admin/users/${user.id}`);
  };

  const handleDeleteClick = (user) => {
    setDeleteDialog({ open: true, user });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUser(deleteDialog.user.id);
      showSuccess("Utilisateur supprimé avec succès!");
      setDeleteDialog({ open: false, user: null });
      fetchUsers(); // Recharger les données
    } catch {
      showError("Erreur lors de la suppression de l'utilisateur");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, user: null });
  };

  const handleToggleColumn = (columnId) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  const handleExport = async () => {
    try {
      const response = await getUsers({ limit: 10000 });
      const allUsers = response.data.users || [];

      const csv = [
        columns.map((col) => col.label).join(","),
        ...allUsers.map((user) =>
          columns
            .map((col) => {
              if (col.id === "address") {
                return user.address
                  ? `${user.address.street}, ${user.address.city}`
                  : "";
              }
              return user[col.id];
            })
            .join(",")
        )
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "users.csv";
      a.click();
      showSuccess("Export réussi!");
    } catch {
      showError("Erreur lors de l'export");
    }
  };

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
          Utilisateurs
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
        message={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${deleteDialog.user?.first_name} ${deleteDialog.user?.last_name}" ? Cette action est irréversible.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}

export default UsersPage;
