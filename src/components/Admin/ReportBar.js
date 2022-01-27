import React from "react";
import { Box, Paper, IconButton } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";

export default function (props) {
  const { pending, noissue, removedbysystem, removedbyadmin } = props.data;
  const getTitle = () => {
    return (
      <div>
        A Post is systemetically removed from view on the portal if the number
        of reports is greater than 10 and the status has yet to be actioned by
        the administrator.
      </div>
    );
  };
  return (
    <div>
      <Box className="main_container">
        <Box className="box_container_pending" sx={{ boxShadow: 3 }}>
          Pending
          <p>{pending}</p>
        </Box>
        <Box className="box_container" sx={{ boxShadow: 3 }}>
          <div className="main">
            {" "}
            <div>Removed by system</div>
            <Tooltip title={getTitle()}>
              <IconButton sx={{ paddingTop: "5px" }}>
                <InfoOutlinedIcon className="toolTip" />
              </IconButton>
            </Tooltip>
          </div>
          <p>{removedbysystem}</p>
        </Box>
        <Box className="box_container" sx={{ boxShadow: 3 }}>
          {" "}
          Removed by admin
          <p>{removedbyadmin}</p>
        </Box>
        <Box className="box_container" sx={{ boxShadow: 3 }}>
          {" "}
          Non Issue
          <p>{noissue}</p>
        </Box>
      </Box>
    </div>
  );
}
