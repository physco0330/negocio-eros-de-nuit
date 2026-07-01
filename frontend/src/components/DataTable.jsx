import React, { useState, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TableSortLabel, TablePagination, Paper, Checkbox, IconButton,
  Box, TextField, InputAdornment, Menu, MenuItem, ListItemIcon, ListItemText,
  Typography, Chip, Tooltip
} from '@mui/material';
import {
  Search, FileDownload, PictureAsPdf, TableChart,
  FirstPage, LastPage, ChevronLeft, ChevronRight
} from '@mui/icons-material';

function descendingComparator(a, b, orderBy) {
  const valA = orderBy.split('.').reduce((obj, key) => obj?.[key], a);
  const valB = orderBy.split('.').reduce((obj, key) => obj?.[key], b);
  if (valB < valA) return -1;
  if (valB > valA) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilized = array.map((el, index) => [el, index]);
  stabilized.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}

export default function DataTable({
  columns,
  data = [],
  title,
  actions,
  onRowClick,
  selectable = false,
  exportable = true,
  defaultOrderBy = '',
  defaultOrder = 'asc',
  emptyMessage = 'No hay datos disponibles',
  searchable = true,
}) {
  const [order, setOrder] = useState(defaultOrder);
  const [orderBy, setOrderBy] = useState(defaultOrderBy);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [exportAnchor, setExportAnchor] = useState(null);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredData.map((row) => row.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const filteredData = useMemo(() => {
    if (!search) return data;
    const lower = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const value = col.accessor ? row[col.accessor] : '';
        return String(value).toLowerCase().includes(lower);
      })
    );
  }, [data, search, columns]);

  const sortedData = useMemo(
    () => stableSort(filteredData, getComparator(order, orderBy)),
    [filteredData, order, orderBy]
  );

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const exportToExcel = async () => {
    try {
      const XLSX = await import('xlsx');
      const worksheetData = filteredData.map((row) => {
        const obj = {};
        columns.forEach((col) => {
          if (col.exportable !== false) {
            obj[col.label] = col.accessor ? row[col.accessor] : '';
          }
        });
        return obj;
      });
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, title || 'Datos');
      XLSX.writeFile(workbook, `${title || 'datos'}.xlsx`);
    } catch (err) {
      console.error('Error exportando Excel:', err);
    }
    setExportAnchor(null);
  };

  const exportToPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf');
      await import('jspdf-autotable');
      const doc = new jsPDF();
      const tableColumns = columns
        .filter((c) => c.exportable !== false)
        .map((c) => c.label);
      const tableData = filteredData.map((row) =>
        columns
          .filter((c) => c.exportable !== false)
          .map((c) => (c.accessor ? String(row[c.accessor]) : ''))
      );
      doc.text(title || 'Reporte', 14, 20);
      doc.autoTable({
        head: [tableColumns],
        body: tableData,
        startY: 30,
      });
      doc.save(`${title || 'reporte'}.pdf`);
    } catch (err) {
      console.error('Error exportando PDF:', err);
    }
    setExportAnchor(null);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'auto' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 600 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {searchable && (
            <TextField
              size="small"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 200 }}
            />
          )}
          {actions}
          {exportable && (
            <>
              <IconButton onClick={(e) => setExportAnchor(e.currentTarget)}>
                <FileDownload />
              </IconButton>
              <Menu
                anchorEl={exportAnchor}
                open={Boolean(exportAnchor)}
                onClose={() => setExportAnchor(null)}
              >
                <MenuItem onClick={exportToExcel}>
                  <ListItemIcon><TableChart fontSize="small" /></ListItemIcon>
                  <ListItemText>Exportar Excel</ListItemText>
                </MenuItem>
                <MenuItem onClick={exportToPDF}>
                  <ListItemIcon><PictureAsPdf fontSize="small" /></ListItemIcon>
                  <ListItemText>Exportar PDF</ListItemText>
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Box>

      <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)', overflowX: 'auto' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < filteredData.length}
                    checked={filteredData.length > 0 && selected.length === filteredData.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {columns.map((col) => (
                <TableCell
                  key={col.accessor || col.label}
                  sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}
                  sortDirection={orderBy === col.accessor ? order : false}
                >
                  {col.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === col.accessor}
                      direction={orderBy === col.accessor ? order : 'asc'}
                      onClick={() => handleSort(col.accessor)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (selectable ? 1 : 0)} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">{emptyMessage}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={() => onRowClick?.(row)}
                  sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  selected={selected.includes(row.id)}
                >
                  {selectable && (
                    <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selected.includes(row.id)}
                        onChange={() => handleSelect(row.id)}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.accessor || col.label}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
        ActionsComponent={({ count, page, rowsPerPage, onPageChange }) => (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" onClick={() => onPageChange(null, 0)} disabled={page === 0}>
              <FirstPage fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onPageChange(null, page - 1)} disabled={page === 0}>
              <ChevronLeft fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onPageChange(null, page + 1)} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
              <ChevronRight fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={() => onPageChange(null, Math.ceil(count / rowsPerPage) - 1)} disabled={page >= Math.ceil(count / rowsPerPage) - 1}>
              <LastPage fontSize="small" />
            </IconButton>
          </Box>
        )}
      />
    </Paper>
  );
}
