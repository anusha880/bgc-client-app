import React, { useState, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { connect,useDispatch } from "react-redux";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";

import Typography from "@material-ui/core/Typography";
import BGCProfileHome from "../UserProfile/BGCProfileHome";
import { logoutUser, updateTabIndex } from "../../redux/actions/userActions";
import { getRoutes } from "../../util/constant";
import "./AdminNavbar.css";
import "./Navigation.css";
import { Box } from "@mui/system";
import { Toolbar, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@material-ui/icons/Menu";

const AdminNavbar = ({
  logoutUser,
  userInfo,
  authenticated,
  currentTabIndex,
  updateTabIndex,
}) => {
  const { firstName, lastName } = userInfo;
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    logoutUser();
  };

  const a11yProps = (index) => {
    return {
      id: `menu-tab-${index}`,
      "aria-controls": `menu-tabpanel-${index}`,
    };
  };

  return (
    <AppBar position="static" className="header__bar">
      <Tabs variant="fullWidth" aria-label="menu bar">
        <img
          className="header__img"
          src="https://firebasestorage.googleapis.com/v0/b/bgc-functions.appspot.com/o/BGC-Logo.png?alt=media&token=ba7c24c2-d25e-467f-91fa-d57c69fe5c0b"
          alt=""
        />
        <Tab
          label="Alumnae Portal Admin"
          name="home"
          className="header__bar_item"
          {...a11yProps(1)}
        />
        <Tab
          label=""
          name="home"
          disabled
          className="header__bar_item"
          {...a11yProps(1)}
        />
        <Tab
          label=""
          name="home"
          disabled
          className="header__bar_item"
          {...a11yProps(1)}
        />
        <Tab
          label=""
          name="home"
          disabled
          className="header__bar_item"
          {...a11yProps(1)}
        />
        <Tab
          label={
            <>
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                className="admin_button"
                style={{ color: "white", fontSize:'15px' }}
              >
                {`${firstName} ${lastName}`} {open ? <ArrowDropDownIcon/>: <ArrowRightIcon style={{color: '#252525'}}/>}
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                className="admin_menu"
              >
                <MenuItem onClick={handleClose}>Change Password</MenuItem>
                <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
              </Menu>
            </>
          }
          className="header__bar_item"
          {...a11yProps(2)}
        />
      </Tabs>
    </AppBar>
  );
};

const mapStateToProps = (state) => ({
  userInfo: state.user.userInfo,
  UI: state.UI,
  authenticated: state.user.authenticated,
  currentTabIndex: state.UI.currentTabIndex,
});

const mapDispatchToProps = { logoutUser, updateTabIndex };

export default connect(mapStateToProps, mapDispatchToProps)(AdminNavbar);
