import React, { useEffect, useState, useMemo } from "react";
import { Card, Button } from "@mui/material";
import { Label, MoreVert } from "@mui/icons-material";
import { connect } from "react-redux";

import {
  getAllMembers,
  handleActivateDeactivateProfile,
} from "../../firebaseActions/dataServices";
import { DataTable } from "./Table";
import { ActionsMenu } from "./ActionsMenu";
import {AlertDialogWithActions, AlertInfoDialog} from "./Dialog";
import { getStatus, getStatusColor } from "../../util/constant";

function MembersPage({ user }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const getMembers = () => {
    setLoading(true);
    getAllMembers(user.userInfo)
      .then(setData)
      .finally(() => setLoading(false));
  };
  const handleClose = () => {
    setSelectedUser(null);
    setShowDialog(false);
  };

  const handleActivateDeactivate = async () => {
    await handleActivateDeactivateProfile(selectedUser);
    await getMembers();
    setShowSuccessModal(true)
    setShowDialog(false)
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        filterable: true,
        sortable: true,
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Status",
        Cell: ({ row }) => {
          return (
            <p style={{ color: getStatusColor(row.original.status) }}>
              {getStatus(row.original.status)}
            </p>
          );
        },
      },
      {
        Header: "Last Login",
        accessor: "lastLogin",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => {
          const newStatus =
            row.original.status == "active"
              ? "Deactivate Profile"
              : "Activate Profile";
          return (
            <ActionsMenu
              label={newStatus}
              onClick={() => {
                setSelectedUser(row.original);
                setShowDialog(true);
              }}
            >
              <MoreVert />
            </ActionsMenu>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    getMembers();
  }, []);

  const isActive = () => selectedUser && selectedUser.status === "active";
  const getActivateStatus = () => {
    return isActive() ? "Deactivate" : "Activate";
  };

  const getUsername = () => (
    <strong>{selectedUser && selectedUser.name} 's</strong>
  );

  const getDialogBody = () => {
    return (
      <span>
        You are about to {getActivateStatus().toLowerCase()} {getUsername()}{" "}
        profile. This member will {isActive() ? "not" : "be"} able to access the
        Alumnae Portal with their registered email address.
      </span>
    );
  };

  const successDialogBody = ()=>{
    return(
      <div>
        The profile has been {getActivateStatus().toLowerCase()}d.
      </div>
    )
  }

  return (
    <div>
      <h2>Alumnae Portal Members</h2>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        searchPlaceholder="Search Members"
      />
      <AlertDialogWithActions
        open={showDialog}
        handleClose={handleClose}
        onAccept={handleActivateDeactivate}
        onReject={handleClose}
        acceptButtonText={getActivateStatus()}
        rejectButtonText="CANCEL"
        dialogBody={getDialogBody()}
        dialogTitle={`${getActivateStatus()} Profile`}
      />
      <AlertInfoDialog
        open={showSuccessModal}
        showActions={false}
        handleClose={()=>{
          handleClose()
          setShowSuccessModal(false)
        }}
        dialogBody={successDialogBody()}
        dialogTitle={`${getActivateStatus()} Profile`}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(MembersPage);
