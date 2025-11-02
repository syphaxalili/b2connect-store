import {
  FileDownload as ExportIcon,
  Search as SearchIcon,
  ViewColumn as ViewColumnIcon
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Tooltip
} from "@mui/material";
import { useState } from "react";

function TableFilters({
  searchValue,
  onSearchChange,
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
    <Box
      sx={{
        display: "flex",
        gap: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        p: 2,
        bgcolor: "grey.100",
        borderBottom: 1,
        borderColor: "divider",
        flexWrap: { xs: "wrap", sm: "nowrap" }
      }}
    >
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
        sx={{
          minWidth: { xs: "100%", sm: 200 },
          bgcolor: "white"
        }}
      />

      <Box sx={{ display: "flex", gap: 0.5 }}>
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
    </Box>
  );
}

export default TableFilters;
