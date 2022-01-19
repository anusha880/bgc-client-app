import React, { useEffect, useState, useMemo } from "react";
import { Card, Button, TextField } from "@mui/material";
import { Label, MoreVert } from "@mui/icons-material";
import { connect } from "react-redux";

import {
  getAllAdmins,
  inviteAdmin,
  handleActivateDeactivateProfile,
} from "../../firebaseActions/dataServices";
import { DataTable } from "./Table";
import { ActionsMenu } from "./ActionsMenu";
import {AlertDialogWithActions, AlertInfoDialog} from "./Dialog";
import { getStatus, getStatusColor } from "../../util/constant";

function AdminsPage({ user }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showInviteAdminModal, setShowInviteAdminModal] = useState(false);
  const [showInviteSuccessModal, setShowInviteSuccessModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [helperText, setHelperText] = useState("");

  const getAdmins = () => {
    setLoading(true);
    getAllAdmins(user.userInfo)
      .then(setData)
      .finally(() => setLoading(false));
  };
  const handleClose = () => {
    setSelectedUser(null);
    setShowDialog(false);
  };

  const handleAdminDialogClose = () => {
    setShowInviteAdminModal(false);
    setHelperText('')
    setAdminEmail('')
  };

  const handleActivateDeactivate = async () => {
    await handleActivateDeactivateProfile(selectedUser);
    await getAdmins();
    handleClose();
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        sortable: true,
      },
      {
        Header: "Email",
        accessor: "email",
        sortable: true,
      },
      {
        Header: "Status",
        sortable: true,
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
        id: "Actions",
        Cell: ({ row }) => {
          const newStatus =
            row.original.status == "active"
              ? "Deactivate Admin"
              : "Activate Admin";
          return (
            <ActionsMenu
              label={newStatus}
              onClick={() => {
                setSelectedUser(row.original);
                setShowDialog(true);
              }}
            >
              <MoreVert sx={{color: 'black'}}/>
            </ActionsMenu>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    getAdmins();
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
        profile. This admin will {isActive() ? "not" : "be"} able to access
        Alumnae Portal Admin with their registered email address.
      </span>
    );
  };

  const inviteAdminDialog = (
    <div style={{ padding: 5 }}>
      <TextField
        sx={{width: 340}}
        type="email"
        variant="outlined"
        label="Email address"
        value={adminEmail}
        onChange={(e) => setAdminEmail(e.target.value)}
        fullWidth
        error={helperText.length}
        helperText={helperText}
      />
    </div>
  );

  const onInviteAdmin = async () => {
    try {
      if (!adminEmail) {
        return setHelperText("Email address required");
      }
      if (!/\S+@\S+\.\S+/.test(adminEmail)) {
        return setHelperText("Email address is invalid");
      }
      await inviteAdmin(adminEmail);
      handleAdminDialogClose()
      setShowInviteSuccessModal(true)
    } catch (error) {
      setHelperText(error.message);
    }
  };

  const inviteSuccessDialogBody = ()=>{
    return <div>
      Email was sent to {adminEmail} successfully!
    </div>
  }

  return (
    <div>
      <h2>Alumnae Portal Admins</h2>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        searchPlaceholder="Search Admins"
        TextFieldFlexComponent={
          <Button
            variant="contained"
            onClick={() => setShowInviteAdminModal(true)}
          >
            INVITE NEW ADMIN
          </Button>
        }
      />
        <AlertInfoDialog
        open={showInviteSuccessModal}
        showActions={false}
        handleClose={()=>setShowInviteSuccessModal(false)}
        dialogBody={inviteSuccessDialogBody()}
        dialogTitle="Invite sent successfully"
      />
      <AlertDialogWithActions
        open={showInviteAdminModal}
        handleClose={handleAdminDialogClose}
        onAccept={onInviteAdmin}
        onReject={handleAdminDialogClose}
        acceptButtonText="SEND"
        rejectButtonText="CANCEL"
        dialogBody={inviteAdminDialog}
        dialogTitle="Invite New Admin User"
      />
      <AlertDialogWithActions
        open={showDialog}
        handleClose={handleClose}
        onAccept={handleActivateDeactivate}
        onReject={handleClose}
        acceptButtonText={getActivateStatus()}
        rejectButtonText="CANCEL"
        dialogBody={getDialogBody()}
        dialogTitle={`${getActivateStatus()} Admin`}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(AdminsPage);
