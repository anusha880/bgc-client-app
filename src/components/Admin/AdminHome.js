import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Card } from "@mui/material";
import styled from "styled-components";
import AdminsPage from "./Admins";
import MembersPage from "./MembersPage";
import { connect } from "react-redux";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
  doc,
} from "@firebase/firestore";
import { useDispatch } from "react-redux";
import { db } from "../../firebase";
import {
  getAllMembers,
  getAllAdmins,
} from "../../firebaseActions/dataServices";
import { getAllUsersCommunity } from "../../redux/actions/dataActions";
import { SET_REPORTED_DATA } from "../../redux/types";

const StyledTabs = styled(Tabs)`
  .MuiTabs-indicator {
    background-color: black;
  }
`;

const a11yProps = (index) => {
  return {
    id: `admin-tab-${index}`,
    "aria-controls": `admin-tabpanel-${index}`,
  };
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Card style={{ margin: 5 }} sx={{ p: 3 }}>
          {children}
        </Card>
      )}
    </div>
  );
}

const AdminHomePage = ({
  user,
  reportedData,
  getAllReported,
  allUsersCommunities,
  getAllUsersCommunities,
}) => {
  const [value, setValue] = useState(0);
  const [data, setData] = useState({
    admin: 0,
    members: 0,
    report: 0,
    community: 0,
  });
  const dispatch = useDispatch();
  useEffect(() => {
    let reportsData = [];
    const postRef = query(
      collection(db, "posts"),
      where("isReportPresent", "==", true)
    );
    const unsubPostSnap = onSnapshot(postRef, (postsSnapshot) => {
      postsSnapshot.forEach((doc) => {
        reportsData.push({
          userHandle: doc.data().userHandle,
          body: doc.data().body,
          reports: doc.data().reports,
          createdAt: doc.data().createdAt,
        });
      });

      dispatch({
        type: SET_REPORTED_DATA,
        payload: reportsData,
      });
      setData((prevstate) => ({ ...prevstate, report: reportsData.length }));
    });
    getMembers();
    getAllUsersCommunities();
    getAdmins();
    return () => unsubPostSnap();
  }, []);

  const getMembers = () => {
    getAllMembers(user.userInfo).then((item) =>
      setData((prevstate) => ({ ...prevstate, members: item.length }))
    );
  };
  const getAdmins = () => {
    getAllAdmins(user.userInfo).then((item) =>
      setData((prevstate) => ({ ...prevstate, admin: item.length }))
    );
  };
  const handleChange = (_event, val) => {
    setValue(val);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Box style={{ padding: 5 }}>
        <StyledTabs
          value={value}
          onChange={handleChange}
          TabIndicatorProps={{ color: "text.primary" }}
          textColor="text.primary"
          //  indicatorColor="secondary"
        >
          <Tab
            disableRipple
            label={
              <strong>REPORTED CONTENT {`(${reportedData.length})`}</strong>
            }
            {...a11yProps(0)}
          />
          <Tab
            disableRipple
            label={<strong>MEMBERS {`(${data.members})`}</strong>}
            {...a11yProps(1)}
          />
          <Tab
            disableRipple
            label={
              <strong>COMMUNITIES {`(${allUsersCommunities.length})`}</strong>
            }
            {...a11yProps(2)}
          />
          <Tab
            disableRipple
            label={<strong>ADMINS {`(${data.admin})`}</strong>}
            {...a11yProps(3)}
          />
        </StyledTabs>
      </Box>
      <Box>
        <TabPanel value={value} index={0}>
          REPORTED CONTENT
        </TabPanel>
        <TabPanel value={value} index={1}>
          <MembersPage />
        </TabPanel>
        <TabPanel value={value} index={2}>
          COMMUNITIES
        </TabPanel>
        <TabPanel value={value} index={3}>
          <AdminsPage />
        </TabPanel>
      </Box>
    </Box>
  );
};
const mapStateToProps = (state) => {
  return {
    user: state.user,
    reportedData: state.data.reportedData,
    allUsersCommunities: state.data.allUsersCommunities,
  };
};
const mapDispatchToProps = (dispatch) => ({
  // getAllReported: () => dispatch(getAllReported()),
  getAllUsersCommunities: () => dispatch(getAllUsersCommunity()),
});

export const AdminHome = connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminHomePage);
