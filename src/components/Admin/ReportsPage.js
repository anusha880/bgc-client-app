import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import {  MoreVert } from "@mui/icons-material";
import { connect } from "react-redux";
import ReactPlayer from "react-player";
import { addadminActionToPost } from "../../firebaseActions/dataServices";
import { AlertDialogWithActions, AlertInfoDialog } from "./Dialog";
import { getStatusColor, getpostStatus } from "../../util/constant";
import { db } from "../../firebase";
import { Table, Paper } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import "./ReportsPage.css";
import { ReportMenu } from "./ReportMenu";
import { format } from "date-fns";
import ReportBar from "./ReportBar";
import { SET_REPORTED_DATA } from "../../redux/types";

import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
  doc,
} from "@firebase/firestore";
import { useDispatch } from "react-redux";

function ReportsPage({ reportedData, user }) {
  const [data, setData] = useState({pending:0,noissue:0,removedbysystem:0,removedbyadmin:0});
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch = useDispatch();

  const headCells = [
    {
      id: "content",
      label: "Content",
    },
    {
      id: "reasons",

      label: "Reasons",
    },
    {
      id: "timesReported",
      label: "Times Reported",
      sortRequired: true,
    },
    {
      id: "status",
      label: "Status",
    },
    {
      id: "lastReported",
      label: "Last Reported On",
    },
    {
      id: "lastActioned",
      label: "Last Actioned",
    },
    {
      id: "actions",
      label: "Actions",
    },
  ];
  useEffect(() => {
   
   setData(prevState=>({...prevState,noissue: reportedData.filter((item)=>item.status ==="noissue").length})) 
   setData(prevState=>({...prevState,removedbyadmin: reportedData.filter((item)=>item.status ==="removedbyadmin").length})) 
   setData(prevState=>({...prevState,removedbysystem: reportedData.filter((item)=>item.status ==="removedbysystem").length})) 
   setData(prevState=>({...prevState,pending: reportedData.filter((item)=>item.status ==="pending").length})) 

    
  }, [reportedData]);
  const getAllpostforAdmin = async () => {
    let reportsData = [];
    const postRef = query(
      collection(db, "posts"),
      where("isReportPresent", "==", true)
    );
    const unsubPostSnap = onSnapshot(postRef, (postsSnapshot) => {
      console.log(postsSnapshot);
      postsSnapshot.forEach((doc) => {
        console.log(doc.id);
        reportsData.push({
          postId: doc.id,
          status: doc.data().adminAction,
          reason: doc
            .data()
            .reports.map((a) => a.type)
            .toString(),
          timesReported: doc.data().reports.length,
          userName: doc.data().userName,
          body: doc.data().body,
          reports: doc.data().reports,
          lastReportedAt: doc.data().lastReportedAt,
          sharedDocumentURL: doc.data().sharedDocumentURL,
          sharedVideo: doc.data().sharedVideo,
          docType: doc.data().docType,
          lastAction: doc.data().lastAction,
        });
      });

      dispatch({
        type: SET_REPORTED_DATA,
        payload: reportsData,
      });
    });
    await unsubPostSnap();
  };
  const handleRequest = () => {
    let post = {};

    for (var i in selectedPost.reports) {
      if (!(typeof selectedPost.reports[i].history != "undefined")) {
        selectedPost.reports[i].history = `${format(
          new Date(),
          "MMM dd, yyyy hh:mm a "
        )} ||${user.userInfo.firstName} ${
          user.userInfo.lastName
        } || ${selectedAction} by admin`;
      }
    }
    post.lastAction = `${format(new Date(), "MMM dd, yyyy hh:mm a ")} ||${
      user.userInfo.firstName
    } ${user.userInfo.lastName}|| ${selectedAction} by admin`;
    post.adminAction =
      selectedAction === "noissue" ? "noissue" : "removedbyadmin";
    post.reports = [...selectedPost.reports];
    post.status = selectedAction === "noissue" ? "active" : "inactive";
    post.postId = selectedPost.postId;
    return post;
  };
  const handleAction = async () => {
    const post = handleRequest();
    await addadminActionToPost(post);
    await getAllpostforAdmin().then(() => {
      setShowSuccessModal(true);
      setShowDialog(false);
    });
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const showPostImg = (row) => {
    if (row.sharedDocumentURL && row.docType === "image") {
      return (
        <div className="img_div">
          <img className="img" src={row.sharedDocumentURL} alt={row.postId} />
        </div>
      );
    }

    return null;
  };

  const handleClose = () => {
    setSelectedPost(null);
    setSelectedAction(null);
    setShowDialog(false);
  };
  const successDialogBody = () => {
    return (
      <div>
        The post has been{" "}
        {selectedAction === "noissue" ? (
          <span>marked and Non Issue</span>
        ) : (
          <span>Removed</span>
        )}
      </div>
    );
  };
  const getDialogBody = () => {
    if (selectedAction === "noissue") {
      return (
        <span>
          This post will be marked as {selectedAction.toLowerCase()}. It will
          remain visible and members will continue to be able to interact with
          it.
        </span>
      );
    } else if (selectedAction === "remove") {
      return (
        <span>
          This post will be removed. Members will no longer see it in the
          Alumnae Portal.
        </span>
      );
    }
    return <></>;
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage) : 0;
  return (
    <div>
      <ReportBar data={data}/>
      <h2>Reported Content</h2>
      <Table
        component={Paper}
        fixedHeader={false}
        style={{ width: "auto", tableLayout: "auto" }}
      >
        <TableHead>
          <TableRow>
            {headCells.map((headCell) => (
              <TableCell key={headCell.id} align="left">
                <div style={{ padding: 16 }}>{headCell.label}</div>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
          {reportedData
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
                    <Typography
                      variant="p"
                      sx={{
                        color: "#6200ee",
                        margin: "16.5px 0px 10px 20.5px",
                      }}
                    >
                      {row.userName}
                      <span style={{ color: "rgba(0,0,0,0.74)" }}>
                        {" "}
                        posted:
                      </span>
                    </Typography>
                    <div style={{ margin: "15px 0px 10px 20.5px" }}>
                      <Typography variant="p">{row.body}</Typography>
                    </div>
                    {row.docType === "image" && showPostImg(row)}
                    {ReactPlayer.canPlay(row.sharedVideo) ? (
                      <ReactPlayer
                        style={{ padding: "0 16px" }}
                        url={row.sharedVideo}
                        className="reactPlayer_div"
                      />
                    ) : null}
                  </TableCell>
                  <TableCell
                    component="td"
                    id={labelId}
                    scope="row"
                    align="center"
                  >
                    {row.reason}
                  </TableCell>
                  <TableCell align="center">{row.timesReported}</TableCell>
                  <TableCell align="center">
                    <div style={{ color: getStatusColor(row.status) }}>
                      {getpostStatus(row.status)}
                    </div>
                  </TableCell>
                  <TableCell align="left">{row.lastReportedAt}</TableCell>
                  <TableCell align="left">
                    <div>{row.lastAction}</div>
                  </TableCell>
                  <TableCell align="center">
                    <ReportMenu
                      status={row.status}
                      onClick={(selectedValue) => {
                        setSelectedAction(selectedValue);
                        setSelectedPost(row);
                        setShowDialog(true);
                      }}
                    >
                      <MoreVert />
                    </ReportMenu>
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
          count={reportedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage=""
        />
      </div>
      <AlertDialogWithActions
        open={showDialog}
        handleClose={handleClose}
        onAccept={handleAction}
        onReject={handleClose}
        acceptButtonText={
          selectedAction === "noissue" ? "No Issue" : selectedAction
        }
        rejectButtonText="CANCEL"
        dialogBody={getDialogBody()}
        dialogTitle={`${
          selectedAction === "noissue" ? "No Issue" : selectedAction
        } Post`}
      />
      <AlertInfoDialog
        open={showSuccessModal}
        showActions={false}
        handleClose={() => {
          handleClose();
          setShowSuccessModal(false);
        }}
        dialogBody={successDialogBody()}
        dialogTitle={`${
          selectedAction === "noissue" ? "No Issue" : selectedAction
        } Post`}
      />
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    reportedData: state.data.reportedData,
    user: state.user,
  };
};

export default connect(mapStateToProps)(ReportsPage);
