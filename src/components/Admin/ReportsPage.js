import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { connect } from "react-redux";
import ReactPlayer from "react-player";
import { addadminActionToPost } from "../../firebaseActions/dataServices";
import { AlertDialogWithActions, AlertInfoDialog } from "./Dialog";
import { getpostStatus } from "../../util/constant";
import "./ReportsPage.css";
import { ReportMenu } from "./ReportMenu";
import { format } from "date-fns";
import ReportBar from "./ReportBar";
import { DataTable } from "./Table";

function ReportsPage({ reportedData, user }) {
  const [data, setData] = useState({
    pending: 0,
    noissue: 0,
    removedbysystem: 0,
    removedbyadmin: 0,
  });
  const [showDialog, setShowDialog] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);

  const headCells = [
    {
      Header: "Content",
      accessor: "userName",
      sortable: true,
      Cell: ({ row }) => {
        return (
          <>
            <Typography
              variant="p"
              sx={{
                color: "#6200ee",
                margin: "16.5px 0px 10px 0px",
              }}
            >
              {row.original.userName}
              <span style={{ color: "rgba(0,0,0,0.74)" }}> posted:</span>
            </Typography>
            <div style={{ margin: "15px 0px 10px 0px" }}>
              <Typography variant="p">{row.original.body}</Typography>
            </div>
            {row.docType === "image" && showPostImg(row)}
            {ReactPlayer.canPlay(row.original.sharedVideo) ? (
              <ReactPlayer
                url={row.original.sharedVideo}
                className="reactPlayer_div"
              />
            ) : null}
          </>
        );
      },
    },
    {
      accessor: "reason",
      sortable: true,
      Header: "Reasons",
    },
    {
      accessor: "timesReported",
      Header: "Times Reported",
      sortable: true,
    },
    {
      Header: "Status",
      accessor: "status",
      sortable: true,
      Cell: ({ row }) => {
        return (
          <div
            style={{
              color: row.original.status === "pending" ? "#EA700B" : null,
            }}
          >
            {getpostStatus(row.original.status)}
          </div>
        );
      },
    },
    {
      accessor: "lastReportedAt",
      Header: "Last Reported On",
      sortable: true,
      Cell: ({ row }) => {
        return (
          <div>
            {format(new Date(row.original.lastReportedAt), "MMM dd, yyyy")}
          </div>
        );
      },
    },
    {
      accessor: "lastAction",
      Header: "Last Actioned",
      sortable: true,
    },
    {
      id: "actions",
      Cell: ({ row }) => {
        return (
          <ReportMenu
            status={row.original.status}
            onClick={(selectedValue) => {
              setSelectedAction(selectedValue);
              setSelectedPost(row.original);
              setShowDialog(true);
            }}
          >
            <MoreVert />
          </ReportMenu>
        );
      },
    },
  ];

  useEffect(() => {
    setData((prevState) => ({
      ...prevState,
      noissue: reportedData.filter((item) => item.status === "noissue").length,
    }));
    setData((prevState) => ({
      ...prevState,
      removedbyadmin: reportedData.filter(
        (item) => item.status === "removedbyadmin"
      ).length,
    }));
    setData((prevState) => ({
      ...prevState,
      removedbysystem: reportedData.filter(
        (item) => item.status === "removedbysystem"
      ).length,
    }));
    setData((prevState) => ({
      ...prevState,
      pending: reportedData.filter((item) => item.status === "pending").length,
    }));
  }, [reportedData]);

  const handleRequest = () => {
    let post = {};

    for (var i in selectedPost.reports) {
      if (!(typeof selectedPost.reports[i].history != "undefined")) {
        selectedPost.reports[i].history = `${format(
          new Date(),
          "MMM dd, yyyy hh:mm a "
        )} - ${selectedAction === "noissue" ? "Non Issue" : "Removed"} - ${
          user.userInfo.firstName
        } ${user.userInfo.lastName} `;
      }
    }
    post.lastAction = `${format(new Date(), "MMM dd, yyyy hh:mm a ")} - ${
      selectedAction === "no issue" ? "Non Issue" : "Removed"
    } - ${user.userInfo.firstName} ${user.userInfo.lastName} `;
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
    setShowSuccessModal(true);
    setShowDialog(false);
    // });
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

  return (
    <div>
      <ReportBar data={data} />
      <h2>Reported Content</h2>
      <DataTable columns={headCells} data={reportedData} />
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
