import { Add as AddIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { Box, Button, IconButton, Tooltip } from "@mui/material";

function TopActions({ onAdd, onRefresh, showAddButton = true }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        justifyContent: "flex-end",
        alignItems: "center"
      }}
    >
      <Tooltip title="Rafraîchir">
        <IconButton onClick={onRefresh} color="primary">
          <RefreshIcon />
        </IconButton>
      </Tooltip>

      {showAddButton && onAdd && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          size="medium"
        >
          Ajouter
        </Button>
      )}
    </Box>
  );
}

export default TopActions;
