import {
  Add as AddIcon,
  FileDownload as ExportIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  ViewColumn as ViewColumnIcon
} from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";
import { useState } from "react";

function DataTableToolbar({
  title,
  searchValue,
  onSearchChange,
  onAdd,
  onRefresh,
  onExport,
  columns,
  visibleColumns,
  onToggleColumn
}) {
  const [columnMenuAnchor, setColumnMenuAnchor] = useState(null);

  const handleColumnMenuOpen = (event) => {
    setColumnMenuAnchor(event.currentTarget);
  };

  const handleColumnMenuClose = () => {
    setColumnMenuAnchor(null);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        py: 2
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        component="div"
        fontWeight={600}
      >
        {title}
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          flexWrap: { xs: "wrap", sm: "nowrap" },
          width: { xs: "100%", sm: "auto" }
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAdd}
          sx={{ mr: 1 }}
        >
          Ajouter
        </Button>

        <TextField
          size="small"
          placeholder="Rechercher..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }
          }}
          sx={{ minWidth: 200 }}
        />

        <Tooltip title="Rafraîchir">
          <IconButton onClick={onRefresh} size="small">
            <RefreshIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Gérer les colonnes">
          <IconButton onClick={handleColumnMenuOpen} size="small">
            <ViewColumnIcon />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={columnMenuAnchor}
          open={Boolean(columnMenuAnchor)}
          onClose={handleColumnMenuClose}
        >
          {columns.map((column) => (
            <MenuItem
              key={column.id}
              onClick={() => onToggleColumn(column.id)}
              sx={{ minWidth: 200 }}
            >
              <Box
                component="span"
                sx={{
                  width: 20,
                  height: 20,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 0.5,
                  mr: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: visibleColumns[column.id]
                    ? "primary.main"
                    : "transparent",
                  color: visibleColumns[column.id] ? "white" : "transparent"
                }}
              >
                ✓
              </Box>
              {column.label}
            </MenuItem>
          ))}
        </Menu>

        <Tooltip title="Exporter">
          <IconButton onClick={onExport} size="small">
            <ExportIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Toolbar>
  );
}

export default DataTableToolbar;
