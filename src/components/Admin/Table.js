import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  TextField,
  InputAdornment,
  CircularProgress,
  Paper,
  Card,
  TableSortLabel,
} from "@mui/material";

import { Search } from "@material-ui/icons";
import {
  useTable,
  usePagination,
  useGlobalFilter,
  useSortBy,
} from "react-table";
import TablePaginationActions from "./TablePaginationActions";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

export function DataTable({
  columns,
  data,
  loading,
  searchPlaceholder,
  TextFieldFlexComponent = null,
}) {
  const {
    getTableProps,
    headerGroups,
    prepareRow,
    page,
    gotoPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, selectedRowIds, globalFilter },
  } = useTable(
    {
      columns,
      data,
      //defaultColumn,
      //autoResetPage: !skipPageReset,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
    },
    useGlobalFilter,
    useSortBy,
    usePagination
    // useRowSelect
  );

  const handleChangePage = (event, newPage) => {
    gotoPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(Number(event.target.value));
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextField
          sx={{ p: 3 }}
          label={searchPlaceholder}
          placeholder={searchPlaceholder}
          id="outlined-start-adornment"
          className="search_community_searchBar"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          sx={{ width: "50%" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        {TextFieldFlexComponent}
      </div>

      <Table
        style={{ margin: "25px 0" }}
        component={Paper}
        {...getTableProps()}
      >
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{padding: 10}}
                >
                  {column.render("Header")}
                  {column.sortable ? (
                    <TableSortLabel
                      active={column.isSorted}
                      direction={column.isSortedDesc ? "desc" : "asc"}
                      IconComponent={ArrowDropDown}
                    />
                  ) : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {page.length ? (
            page.map((row, i) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <TableCell {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          ) : (
            <p style={{ textAlign: "center" }}>No results found </p>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[
                5,
                10,
                25,
                { label: "All", value: data.length },
              ]}
              colSpan={3}
              count={data.length}
              rowsPerPage={pageSize}
              page={pageIndex}
              SelectProps={{
                inputProps: { "aria-label": "rows per page" },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
