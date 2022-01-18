import React, { useEffect, useState, useMemo } from "react";
import { Avatar, Button, Typography } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { connect } from "react-redux";
import { format } from "date-fns";

import {
  getAllCommunities,
  handleActivateDeactivateProfile,
} from "../../firebaseActions/dataServices";
import { DataTable } from "./Table";
import { ActionsMenu } from "./ActionsMenu";
import { AlertDialogWithActions, AlertInfoDialog } from "./Dialog";
import { getCommunityStatus, getStatusColor } from "../../util/constant";

function CommunitiesPage({ user }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const getCommunities = () => {
    setLoading(true);
    getAllCommunities(user)
      .then(setData)
      .finally(() => setLoading(false));
  };

  const handleClose = () => {
    setSelectedCommunity(null);
    setShowDialog(false);
  };

  const handleActivateDeactivate = async () => {
    await handleActivateDeactivateProfile(selectedCommunity);
    await getCommunities();
    handleClose();
  };

  const columns = useMemo(
    () => [
      {
        id: "image",
        Cell: ({ row }) => {
          return (
            <Avatar
              alt={row.original.name}
              className="MyCommunity__body_item__image"
              src={row.original.image}
            />
          );
        },
      },
      {
        Header: "Name",
        accessor: "name",
        sortable: true,
        Cell: ({ row }) => {
          return <Typography color="primary">{row.original.name}</Typography>;
        },
      },
      {
        Header: "Owner",
        accessor: "createdMember",
        sortable: true,
      },
      {
        Header: "Members",
        accessor: 'members.length',
        sortable: true,
        Cell: ({ row }) => {
          return <div>{row.original.members.length}</div>;
        },
      },
      {
        Header: "Status",
        accessor: 'status',
        sortable: true,
        Cell: ({ row }) => {
          return (
            <p style={{ color: getStatusColor(row.original.status) }}>
              {getCommunityStatus(row.original.status)}
            </p>
          );
        },
      },
      {
        Header: "Created",
        accessor: "createdAt",
        sortable: true,
        Cell: ({ row }) => {
          return (
            <div>
              {format(new Date(row.original.createdAt), "MMM dd, yyyy")}
            </div>
          );
        },
      },
      {
        Header: "Actions",
        Cell: ({ row }) => {
          const newStatus =
            row.original.status == "active"
              ? "Close Community"
              : "Activate Community";
          return (
            <ActionsMenu
              label={newStatus}
              onClick={() => {
                setSelectedCommunity(row.original);
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
    getCommunities();
  }, []);

  const isActive = () =>
    selectedCommunity && selectedCommunity.status === "active";

  const getActivateStatus = () => {
    return isActive() ? "Close" : "Activate";
  };

  const getCommunityName = () => (
    <strong>{selectedCommunity && selectedCommunity.name}</strong>
  );

  const getDialogBody = () => {
    return (
      <span>
        You are about to {getActivateStatus().toLowerCase()}{" "}
        {getCommunityName()} community. It will {isActive() ? "not" : "be"}{" "}
        visible to any members of the Alumnae portal.
      </span>
    );
  };

  const inviteSuccessDialogBody = () => {
    return (
      <div>
        Community was {getActivateStatus().toLowerCase()}d successfully!
      </div>
    );
  };

  const getActiveInactiveCommunities = useMemo(() => {
    if (data) {
      const active = data.filter(({ status }) => status === "active").length;
      const closed = data.filter(({ status }) => status === "inactive").length;
      return (
        <span>
          Active: <strong>{active}</strong> Closed: <strong>{closed}</strong>
        </span>
      );
    }
    return null;
  }, [data]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center' }}>
        <h2>Communities</h2>
        <div>{getActiveInactiveCommunities}</div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        searchPlaceholder="Search Communities"
        TextFieldFlexComponent={
          <Button variant="contained" onClick={() => {}}>
            CREATE A COMMUNITY
          </Button>
        }
      />
      <AlertInfoDialog
        open={showSuccessModal}
        handleClose={() => setShowSuccessModal(false)}
        dialogBody={inviteSuccessDialogBody()}
        dialogTitle={`${getActivateStatus()} Community `}
      />
      <AlertDialogWithActions
        open={showDialog}
        handleClose={handleClose}
        onAccept={handleActivateDeactivate}
        onReject={handleClose}
        acceptButtonText={getActivateStatus()}
        rejectButtonText="CANCEL"
        dialogBody={getDialogBody()}
        dialogTitle={`${getActivateStatus()} Community `}
      />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(CommunitiesPage);
