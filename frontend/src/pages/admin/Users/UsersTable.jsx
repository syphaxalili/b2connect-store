import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUser, getUsers } from "../../../api";
import AdminBreadcrumbs from "../../../components/admin/AdminBreadcrumbs";
import DataTable from "../../../components/admin/DataTable";
import TopActions from "../../../components/admin/DataTable/TopActions";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { USERS_COLUMNS as columns } from "../../../constants/admin/columns";
import { useSnackbar } from "../../../hooks/useSnackbar";

function UsersPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      showError("Erreur lors du chargement des utilisateurs");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    let filtered = users.filter(
      (user) =>
        user.first_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Tri
    filtered.sort((a, b) => {
      let aVal = a[orderBy];
      let bVal = b[orderBy];

      // Pour le nom complet (cas spécial)
      if (orderBy === "name") {
        aVal = `${a.first_name} ${a.last_name}`;
        bVal = `${b.first_name} ${b.last_name}`;
      }

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

    return filtered;
  }, [users, searchValue, orderBy, order]);

  const handleSearchChange = (value) => {
    setSearchValue(value);
    setPage(0);
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
    } catch (error) {
      showError("Erreur lors de la suppression de l'utilisateur");
      console.error(error);
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

  const handleExport = () => {
    const csv = [
      columns.map((col) => col.label).join(","),
      ...filteredUsers.map((user) =>
        columns
          .map((col) => {
            if (col.id === "name") {
              return `${user.first_name} ${user.last_name}`;
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
    a.download = "utilisateurs.csv";
    a.click();
    showSuccess("Export réussi!");
  };

  const paginatedData = filteredUsers.slice(
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
        totalCount={filteredUsers.length}
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
        message={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${deleteDialog.user?.first_name} ${deleteDialog.user?.last_name}" ? Cette action est irréversible.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}

export default UsersPage;
