import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { MoreVert } from "@mui/icons-material";

export function ReportMenu({ onClick, status, children }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {children}
      </Button>
      {status === "noissue" || status === "removedbysystem" ? null : (
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem
            value="No Issue"
            onClick={() => {
              onClick("noissue");
              handleClose();
            }}
          >
            No Issue
          </MenuItem>
          {status === "pending" && (
            <MenuItem
              value="Remove"
              onClick={() => {
                onClick("remove");
                handleClose();
              }}
            >
              Remove
            </MenuItem>
          )}
        </Menu>
      )}
    </div>
  );
}
