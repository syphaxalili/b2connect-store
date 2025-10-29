import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { deleteUser, getUserById } from "../../../api";
import AdminBreadcrumbs from "../../../components/admin/AdminBreadcrumbs";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import { useSnackbar } from "../../../hooks/useSnackbar";

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Charger les données de l'utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await getUserById(id);
        setUser(response.data);
      } catch (error) {
        showError("Erreur lors du chargement de l'utilisateur");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleEdit = () => {
    navigate(`/admin/users/${id}/edit`);
  };

  const handleDeleteClick = () => {
    setDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUser(id);
      showSuccess("Utilisateur supprimé avec succès!");
      navigate("/admin/users");
    } catch (error) {
      showError("Erreur lors de la suppression de l'utilisateur");
      console.error(error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog(false);
  };

  const handleBack = () => {
    navigate("/admin/users");
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
      <AdminBreadcrumbs
        customLabel={user ? `${user.first_name} ${user.last_name}` : ""}
      />

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
        >
          {user ? `${user.first_name} ${user.last_name}` : `Utilisateur ${id}`}
        </Typography>
      </Box>

      {loading ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            minHeight: "400px"
          }}
        >
          <CircularProgress />
        </Box>
      ) : !user ? (
        <Box sx={{ flexGrow: 1 }}>
          <Alert severity="error">Utilisateur non trouvé</Alert>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, width: "100%" }}>
          <Grid container spacing={2} sx={{ width: "100%" }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  ID Utilisateur
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {user.id}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Rôle
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Chip
                    label={user.role === "admin" ? "Administrateur" : "Client"}
                    color={user.role === "admin" ? "primary" : "default"}
                    size="small"
                  />
                </Box>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Prénom
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {user.first_name}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Nom
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {user.last_name}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Paper sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Email
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {user.email}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Genre
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {user.gender === "male" ? "Homme" : "Femme"}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Date d'inscription
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {new Date(user.created_at).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Adresse
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {user.address || "Non renseignée"}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Paper sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Numéro de téléphone
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {user.phone_number || "Non renseigné"}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
            >
              Retour
            </Button>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
              >
                Modifier
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
              >
                Supprimer
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}

      <ConfirmDialog
        open={deleteDialog}
        title="Confirmer la suppression"
        message={`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user?.first_name} ${user?.last_name}" ? Cette action est irréversible.`}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </Box>
  );
}

export default UserDetails;
