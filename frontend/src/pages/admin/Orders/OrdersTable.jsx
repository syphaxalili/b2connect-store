import {
  Archive as ArchiveIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  LocalShipping as LocalShippingIcon
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteOrder, getOrders, updateOrderStatus } from "../../../api";
import AdminBreadcrumbs from "../../../components/admin/AdminBreadcrumbs";
import DataTable from "../../../components/admin/DataTable";
import TopActions from "../../../components/admin/DataTable/TopActions";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import {
  ORDERS_COLUMNS as columns
} from "../../../constants/admin/columns";
import { useSnackbar } from "../../../hooks/useSnackbar";
import useDebounce from "../../../hooks/useDebounce";

function OrdersPage() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [orders, setOrders] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("status");
  const [order, setOrder] = useState("asc");
  const [visibleColumns, setVisibleColumns] = useState(
    columns.reduce((acc, col) => ({ ...acc, [col.id]: true }), {})
  );
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    order: null
  });
  const [actionDialog, setActionDialog] = useState({
    open: false,
    order: null,
    action: null
  });
  const [trackingDialog, setTrackingDialog] = useState({
    open: false,
    order: null,
    trackingNumber: ""
  });

  // Charger les commandes depuis l'API
  const fetchOrders = async () => {
    try {
      const response = await getOrders({ 
        page: page + 1,
        limit: rowsPerPage,
        search: debouncedSearchValue || undefined,
        status: statusFilter || undefined,
        sortBy: orderBy,
        sortOrder: order.toUpperCase()
      });
      setOrders(response.data.orders || []);
      setTotalCount(response.data.pagination?.total || 0);
    } catch {
      showError("Erreur lors du chargement des commandes");
    }
  };

  // Charger les commandes au montage du composant
  useEffect(() => {
    fetchOrders();
  }, [page, rowsPerPage, debouncedSearchValue, statusFilter, orderBy, order]);

  // Pas besoin de filtrage/tri côté client - tout est fait côté serveur
  const displayedOrders = orders;

  const handleSearchChange = (value) => {
    setSearchValue(value);
    setPage(0); // Reset à la page 1 lors d'une recherche
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
    } catch {
      showError("Erreur lors de la suppression de la commande");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, order: null });
  };

  const handleApprove = (order) => {
    setActionDialog({ open: true, order, action: "approve" });
  };

  const handleCancel = (order) => {
    setActionDialog({ open: true, order, action: "cancel" });
  };

  const handleActionConfirm = async () => {
    try {
      let newStatus;
      let successMessage;

      if (actionDialog.action === "approve") {
        newStatus = "approved";
        successMessage = "Commande validée avec succès!";
      } else if (actionDialog.action === "cancel") {
        newStatus = "cancelled";
        successMessage = "Commande annulée avec succès!";
      } else if (actionDialog.action === "archive") {
        newStatus = "archived";
        successMessage = "Commande archivée avec succès!";
      }

      await updateOrderStatus(actionDialog.order.id, newStatus);
      showSuccess(successMessage);
      setActionDialog({ open: false, order: null, action: null });
      fetchOrders();
    } catch {
      showError("Erreur lors de la mise à jour de la commande");
    }
  };

  const handleActionCancel = () => {
    setActionDialog({ open: false, order: null, action: null });
  };

  const handleTrackingClick = (order) => {
    setTrackingDialog({
      open: true,
      order,
      trackingNumber: order.tracking_number || ""
    });
  };

  const handleTrackingSave = async () => {
    if (!trackingDialog.trackingNumber.trim()) {
      showError("Veuillez entrer un numéro de suivi");
      return;
    }

    try {
      await updateOrderStatus(
        trackingDialog.order.id,
        "shipped",
        trackingDialog.trackingNumber
      );
      showSuccess("Numéro de suivi enregistré et commande expédiée!");
      setTrackingDialog({ open: false, order: null, trackingNumber: "" });
      fetchOrders();
    } catch {
      showError("Erreur lors de l'enregistrement du numéro de suivi");
    }
  };

  const handleTrackingCancel = () => {
    setTrackingDialog({ open: false, order: null, trackingNumber: "" });
  };

  const handleArchive = (order) => {
    setActionDialog({ open: true, order, action: "archive" });
  };

  const handleToggleColumn = (columnId) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  const handleExport = async () => {
    try {
      // Charger TOUTES les commandes pour l'export
      const response = await getOrders({ limit: 10000 });
      const allOrders = response.data.orders || [];

      const csv = [
        columns.map((col) => col.label).join(","),
        ...allOrders.map((order) =>
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
    } catch {
      showError("Erreur lors de l'export");
    }
  };

  // Les données sont déjà paginées par le backend
  const paginatedData = displayedOrders;

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
          mb: 2,
          gap: 2
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

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TopActions onRefresh={handleRefresh} showAddButton={false} />
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Filtre par statut</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              label="Filtre par statut"
            >
              <MenuItem value="">Tous les statuts</MenuItem>
              <MenuItem value="pending">En attente</MenuItem>
              <MenuItem value="approved">Validée</MenuItem>
              <MenuItem value="shipped">Expédiée</MenuItem>
              <MenuItem value="delivered">Livrée</MenuItem>
              <MenuItem value="cancelled">Annulée</MenuItem>
              <MenuItem value="archived">Archivée</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <DataTable
        columns={columns}
        data={paginatedData}
        visibleColumns={visibleColumns}
        onRowClick={handleRowClick}
        onDelete={handleDeleteClick}
        onCustomActions={(row) => {
          const actions = [];

          if (row.status === "pending") {
            actions.push(
              <Tooltip key="approve" title="Valider">
                <IconButton
                  size="small"
                  color="success"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(row);
                  }}
                >
                  <CheckCircleIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            );
            actions.push(
              <Tooltip key="cancel" title="Refuser">
                <IconButton
                  size="small"
                  color="warning"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCancel(row);
                  }}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            );
          }

          if (row.status === "approved") {
            actions.push(
              <Tooltip key="tracking" title="Entrer numéro de suivi">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTrackingClick(row);
                  }}
                >
                  <LocalShippingIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            );
          }

          if (row.status === "cancelled" || row.status === "delivered") {
            actions.push(
              <Tooltip key="archive" title="Archiver">
                <IconButton
                  size="small"
                  color="info"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleArchive(row);
                  }}
                >
                  <ArchiveIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            );
          }

          if (row.status === "cancelled" || row.status === "archived") {
            actions.push(
              <Tooltip key="delete" title="Supprimer">
                <IconButton
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(row);
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            );
          }

          return actions.length > 0 ? actions : null;
        }}
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
        showEditButton={false}
      />

      <ConfirmDialog
        open={deleteDialog.open}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer la commande n°${deleteDialog.order?.id}? Cette action est irréversible.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      <Dialog
        open={actionDialog.open}
        onClose={handleActionCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif" }
        }}
      >
        <DialogTitle>
          {actionDialog.action === "approve"
            ? "Valider la commande"
            : actionDialog.action === "cancel"
              ? "Refuser la commande"
              : "Archiver la commande"}
        </DialogTitle>
        <DialogContent>
          {actionDialog.action === "approve"
            ? `Êtes-vous sûr de vouloir valider la commande n°${actionDialog.order?.id}?`
            : actionDialog.action === "cancel"
              ? `Êtes-vous sûr de vouloir refuser la commande n°${actionDialog.order?.id}?`
              : `Êtes-vous sûr de vouloir archiver la commande n°${actionDialog.order?.id}?`}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleActionCancel}>Annuler</Button>
          <Button
            onClick={handleActionConfirm}
            variant="contained"
            color={
              actionDialog.action === "approve"
                ? "success"
                : actionDialog.action === "cancel"
                  ? "error"
                  : "info"
            }
          >
            {actionDialog.action === "approve"
              ? "Valider"
              : actionDialog.action === "cancel"
                ? "Refuser"
                : "Archiver"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={trackingDialog.open}
        onClose={handleTrackingCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif" }
        }}
      >
        <DialogTitle>Entrer le numéro de suivi</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Numéro de suivi"
            value={trackingDialog.trackingNumber}
            onChange={(e) =>
              setTrackingDialog((prev) => ({
                ...prev,
                trackingNumber: e.target.value
              }))
            }
            placeholder="Ex: 1Z999AA10123456784"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTrackingCancel}>Annuler</Button>
          <Button
            onClick={handleTrackingSave}
            variant="contained"
            color="success"
          >
            Expédier
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default OrdersPage;
