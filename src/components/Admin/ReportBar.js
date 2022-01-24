import React from "react";
import { Box, Paper, IconButton } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Tooltip from "@mui/material/Tooltip";

export default function (props) {
  const { pending, noissue, removedbysystem, removedbyadmin } = props.data;
 const getTitle=()=>{
   return <div>
     A Post is systemetically removed from view on the portal if the number of reports is greater than 10 and the status has yet to be actioned by the administrator.
   </div>
 }
  return (
    <div>
      <Box>
        <Paper className="main_container" elevation={3}>
          <Box className="box_container_pending">
            <p>Pending</p>
            <p>{pending}</p>
          </Box>
          <Box className="box_container">
            <div className="main_container">
              {" "}
              <p>Removed by system</p>
              <Tooltip title={getTitle()}>
                <IconButton>
                  <InfoOutlinedIcon className="toolTip" />
                </IconButton>
              </Tooltip>
            </div>
            <p>{removedbysystem}</p>
          </Box>
          <Box className="box_container">
            {" "}
            <p>Removed by admin</p>
            <p>{removedbyadmin}</p>
          </Box>
          <Box className="box_container">
            {" "}
            <p>Non Issue</p>
            <p>{noissue}</p>
          </Box>
        </Paper>
      </Box>
    </div>
  );
}
