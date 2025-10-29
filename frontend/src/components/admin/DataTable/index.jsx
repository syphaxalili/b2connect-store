import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip
} from "@mui/material";
import TableFilters from "./Filters";

function DataTable({
  columns,
  data,
  visibleColumns,
  onRowClick,
  onEdit,
  onDelete,
  onCustomActions,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  orderBy,
  order,
  onSort,
  searchValue,
  onSearchChange,
  onExport,
  onToggleColumn,
  showEditButton = true
}) {
  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === "asc";
    onSort(columnId, isAsc ? "desc" : "asc");
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableFilters
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        onExport={onExport}
        columns={columns}
        visibleColumns={visibleColumns}
        onToggleColumn={onToggleColumn}
      />

      <TableContainer
        sx={{
          maxHeight: 600,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch"
        }}
      >
        <Table stickyHeader sx={{ minWidth: 650 }}>
          {/* Table header */}
          <TableHead>
            <TableRow>
              {columns
                .filter((col) => visibleColumns[col.id])
                .map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || "left"}
                    sx={{ fontWeight: 600, bgcolor: "grey.50" }}
                  >
                    {column.sortable !== false ? (
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : "asc"}
                        onClick={() => handleSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    ) : (
                      column.label
                    )}
                  </TableCell>
                ))}
              <TableCell
                sx={{
                  fontWeight: 600,
                  bgcolor: "grey.50",
                  textAlign: "right"
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          {/* Table body */}
          <TableBody>
            {data.length > 0 ? (
              data.map((row) => (
                <TableRow
                  key={row._id || row.id}
                  hover
                  sx={{
                    cursor: "pointer",
                    "&:hover": { bgcolor: "action.hover" }
                  }}
                  onClick={() => onRowClick(row)}
                >
                  {columns
                    .filter((col) => visibleColumns[col.id])
                    .map((column) => (
                      <TableCell key={column.id} align={column.align || "left"}>
                        {column.render
                          ? column.render(row[column.id], row)
                          : row[column.id]}
                      </TableCell>
                    ))}
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        justifyContent: "flex-end",
                        flexWrap: "wrap"
                      }}
                    >
                      {showEditButton && onEdit && (
                        <Tooltip title="Modifier">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(row);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onCustomActions && onCustomActions(row)}
                      {!onCustomActions && (
                        <Tooltip title="Supprimer">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(row);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  Aucune donnée disponible
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Table pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Lignes par page:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} sur ${count}`
        }
      />
    </Paper>
  );
}

export default DataTable;
