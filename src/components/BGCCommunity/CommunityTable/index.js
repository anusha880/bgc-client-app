import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CommunityCreateDailog from "../CommunityDailog";
import {
  setCurrentCommunityId,
  getAllUsersCommunity,
  joinCommunity,
} from "../../../redux/actions/dataActions";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Fuse from "fuse.js";
import LoadingButton from "@mui/lab/LoadingButton";
import TablePagination from "@mui/material/TablePagination";
import { visuallyHidden } from "@mui/utils";
import Box from "@mui/material/Box";
import TableSortLabel from "@mui/material/TableSortLabel";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import styled from "styled-components";
import { Typography } from "@material-ui/core";
import {
  updateTabIndex,
  setActiveHeader,
} from "../../../redux/actions/userActions";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const ResponsiveTable = styled.div`
  @media (max-width: 768px) {
    /* Force table to not be like tables anymore */
    table,
    thead,
    tbody,
    th,
    td,
    tr {
      height: auto !important;
      display: block;
    }

    /* Hide table headers (but not display: none;, for accessibility) */
    thead tr {
      position: absolute;
      top: -9999px;
      left: -9999px;
    }

    tr {
      padding: 7px;
      border-bottom: 1px solid #ccc;
    }

    td {
      /* Behave  like a "row" */
      border: none;
      text-align: left;
      position: relative;
      //padding-left: 50%;
    }

    td:before {
      /* Now like a table header */
      position: absolute;
      /* Top/left values mimic padding */
      top: 6px;
      left: 6px;
      width: 45%;
      padding-right: 10px;
      white-space: nowrap;
    }
  }
`;

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "avatar",
    numeric: false,
    disablePadding: true,
    label: "",
    sortRequired: false,
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Community Name",
    sortRequired: true,
  },
  {
    id: "description",
    numeric: false,
    disablePadding: false,
    label: "Description",
    sortRequired: true,
  },
  {
    id: "members",
    numeric: true,
    disablePadding: false,
    label: "Members",
    sortRequired: true,
  },
  {
    id: "joinLink",
    numeric: false,
    disablePadding: false,
    label: "",
    sortRequired: false,
  },
];

function CommunityTableHead(props) {
  const { order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={"normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            className="_communitytable_tableCell__"
          >
            {headCell.sortRequired ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
                IconComponent={ArrowDropDown}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              ""
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

CommunityTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const CommunityTable = ({
  allUsersCommunities,
  setCurrentCommunityId,
  updateTabIndex,
  user: { userInfo },
  joinACommunity,
  getAllUsersCommunities,
  allUsersCommunitiesLoading,
  joinCommunityLoading,
  setActiveHeader,
}) => {
  const history = useHistory();

  useEffect(() => {
    const { email } = userInfo;
    if (email !== undefined) {
      getAllUsersCommunities();
    }
  }, []);

  const [searchItems, setSearchItem] = useState(
    allUsersCommunities && Array.isArray(allUsersCommunities)
      ? allUsersCommunities
      : []
  );

  useEffect(() => {
    if (
      allUsersCommunities &&
      Array.isArray(allUsersCommunities) &&
      allUsersCommunities.length > 0
    ) {
      setSearchItem(allUsersCommunities);
    }
  }, [allUsersCommunitiesLoading]);

  const [updateCommunityId, setUpdatedCommunityId] = useState("");

  const communityClickHandler = (communityId) => {
    updateTabIndex(4);
    setActiveHeader(false);
    history.push("/communityHome");
    setCurrentCommunityId(communityId);
    // updateTabIndex(3);
  };

  const joinCommunityHandler = (communityId) => {
    console.log("communityId", communityId);
    setUpdatedCommunityId(communityId);
    joinACommunity(communityId);
  };

  const searchCommunityHandler = (query) => {
    const fuse = new Fuse(allUsersCommunities, {
      keys: ["name", "description"],
      includeScore: true,
    });
    const result = fuse.search(query);
    const finalResult = [];
    if (result.length) {
      result.forEach((item) => {
        finalResult.push(item.item);
      });
      setSearchItem(finalResult);
    } else {
      setSearchItem(allUsersCommunities);
    }
  };
  console.log("searchItems", searchItems);

  const { email } = userInfo;

  const generateActionLink = (community) => {
    if (joinCommunityLoading && updateCommunityId === community.communityId) {
      return (
        <React.Fragment>
          <LoadingButton loading variant="outlined">
            Submit
          </LoadingButton>
        </React.Fragment>
      );
    } else if (
      (community &&
        community.members &&
        community.members.length > 0 &&
        community.members.filter((member) => member.email === email).length >
          0) ||
      (updateCommunityId && updateCommunityId === community.communityId)
    ) {
      return (
        <div className="__community_joined_button_action">
          <React.Fragment>
            <CheckIcon
            // onClick={() => joinCommunityHandler(community.communityId)}
            />{" "}
            <span
              // onClick={() => joinCommunity(email)}
              className="__community_join__action_label"
            >
              JOINED
            </span>
          </React.Fragment>
        </div>
      );
    } else {
      return (
        <div className="__community_join_button_action">
          <React.Fragment>
            <AddIcon
              onClick={() => joinCommunityHandler(community.communityId)}
            />{" "}
            <span
              onClick={() => joinCommunityHandler(community.communityId)}
              className="__community_join__action_label"
            >
              JOIN
            </span>
          </React.Fragment>
        </div>
      );
    }
  };

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - searchItems.length) : 0;

  return (
    <div>
      {Array.isArray(searchItems) && searchItems.length > 0 && (
        <div className="all_community_container">
          <div className="all_communityBox_header">
            <h2>All Alumnae Communities</h2>
          </div>
          <div className="search_community__header">
            <div className="search_community_left">
              <TextField
                label="Search Community"
                id="outlined-start-adornment"
                className="search_community_searchBar"
                onChange={(e) => searchCommunityHandler(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
            <div>
              <CommunityCreateDailog />
            </div>
          </div>
          {/* <Box sx={{ margin: "0px 20px 20px 20px", display: "flex" }}> */}
          <ResponsiveTable>
            <Paper className="__communitytable__container__">
              <Table
                stickyHeader
                aria-label="sticky table"
                aria-labelledby="tableTitle"
                size={dense ? "small" : "medium"}
              >
                <CommunityTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={searchItems.length}
                />

                <TableBody>
                  {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                  {stableSort(searchItems, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          key={row.name}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="td" scope="row">
                            <Avatar
                              aria-label="recipe"
                              alt="Remy Sharp"
                              className="MyCommunity__body_item__image"
                              src={row.image}
                            />
                          </TableCell>
                          <TableCell
                            align="right"
                            component="td"
                            id={labelId}
                            scope="row"
                          >
                            <Typography variant="button" color="primary">
                              <Link
                                to={`/communityHome/${row.communityId}`}
                                onClick={() =>
                                  communityClickHandler(row.communityId)
                                }
                              >
                                {row.name}
                              </Link>
                            </Typography>
                          </TableCell>
                          <TableCell align="left">{row.description}</TableCell>
                          <TableCell align="right">
                            {row.members && Array.isArray(row.members)
                              ? row.members.length
                              : 0}{" "}
                            Members
                          </TableCell>
                          <TableCell align="right">
                            {generateActionLink(row)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="__communitytable__pagination__">
                <TablePagination
                  rowsPerPageOptions={[]}
                  component="div"
                  count={searchItems.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage=""
                />
              </div>
            </Paper>
          </ResponsiveTable>
          {/* </Box> */}
        </div>
      )}
    </div>
  );
};

CommunityTable.propTypes = {};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    allUsersCommunities: state.data.allUsersCommunities,
    joinCommunityLoading: state.data.joinCommunityLoading,
    allUsersCommunities: state.data.allUsersCommunities.filter(({status})=>status ==='active'),
  };
};

const mapDispatchToProps = (dispatch) => ({
  getAllUsersCommunities: () => dispatch(getAllUsersCommunity()),
  joinACommunity: (communityId) => dispatch(joinCommunity(communityId)),
  setCurrentCommunityId: (communityId) =>
    dispatch(setCurrentCommunityId(communityId)),
  updateTabIndex: (tabIndex) => dispatch(updateTabIndex(tabIndex)),
  setActiveHeader: (value) => dispatch(setActiveHeader(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommunityTable);
