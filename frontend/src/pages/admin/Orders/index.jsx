import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteOrder, getOrders } from "../../../api/orders";
import AdminBreadcrumbs from "../../../components/admin/AdminBreadcrumbs";
import DataTable from "../../../components/admin/DataTable";
import TopActions from "../../../components/admin/DataTable/TopActions";
import ConfirmDialog from "../../../components/dialogs/ConfirmDialog";
import { ORDERS_COLUMNS as columns } from "../../../constants/admin/columns";
import { useSnackbar } from "../../../hooks/useSnackbar";

function OrdersPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [visibleColumns, setVisibleColumns] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col.id]: true }), {})
  );
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    order: null
  });

  // Charger les commandes depuis l'API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders();
      setOrders(response.data);
    } catch (error) {
      showError("Erreur lors du chargement des commandes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les commandes au montage du composant
  useEffect(() => {
    fetchOrders();
  }, []);

  // Filtrer et trier les commandes
  useEffect(() => {
    let filtered = orders.filter((order) => {
      const fullName =
        `${order.User?.first_name || ""} ${order.User?.last_name || ""}`.trim();
      return (
        order.id.toString().includes(searchValue) ||
        fullName.toLowerCase().includes(searchValue.toLowerCase()) ||
        order.User?.email?.toLowerCase().includes(searchValue.toLowerCase())
      );
    });

    // Tri
    filtered.sort((a, b) => {
      let aVal = a[orderBy];
      let bVal = b[orderBy];

      // Gestion spéciale pour User
      if (orderBy === "User") {
        aVal = `${a.User?.first_name || ""} ${a.User?.last_name || ""}`.trim();
        bVal = `${b.User?.first_name || ""} ${b.User?.last_name || ""}`.trim();
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

    setFilteredOrders(filtered);
  }, [orders, searchValue, orderBy, order]);

  const handleSearchChange = (value) => {
    setSearchValue(value);
    setPage(0);
  };

  const handleRefresh = () => {
    fetchOrders();
    showSuccess("Données rafraîchies!");
  };

  const handleRowClick = (order) => {
    navigate(`/admin/orders/${order.id}`);
  };

  const handleDeleteClick = (order) => {
    setDeleteDialog({ open: true, order });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteOrder(deleteDialog.order.id);
      showSuccess("Commande supprimée avec succès!");
      setDeleteDialog({ open: false, order: null });
      fetchOrders();
    } catch (error) {
      showError("Erreur lors de la suppression de la commande");
      console.error(error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, order: null });
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
      ...filteredOrders.map((order) =>
        columns
          .map((col) => {
            const value = order[col.id];
            if (col.render) {
              return col.render(value, order);
            }
            return value;
          })
          .join(",")
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "commandes.csv";
    a.click();
    showSuccess("Export réussi!");
  };

  const paginatedData = filteredOrders.slice(
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
          Commandes
        </Typography>

        <TopActions onRefresh={handleRefresh} />
      </Box>

      <DataTable
        columns={columns}
        data={paginatedData}
        visibleColumns={visibleColumns}
        onRowClick={handleRowClick}
        onDelete={handleDeleteClick}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={filteredOrders.length}
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
        message={`Êtes-vous sûr de vouloir supprimer la commande n°${deleteDialog.order?.id} ? Cette action est irréversible.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}

export default OrdersPage;
