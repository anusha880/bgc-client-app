import React, { useState, useEffect } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';


// MUI Stuff


// Redux stuff
import { connect } from "react-redux";
import { signupUser } from "../../redux/actions/userActions";
import GridItem from "../Grid/GridItem";
import GridContainer from "../Grid/GridContainer";
import "./BGCProfileHome.css";
import MyButton from "../../util/MyButton";
import ProfileHeader from "./ProfileHeader";
import Education from "./Education";
import Experience from "./Experience";
import Summary from "./Summary";
import MyNetworks from "./MyNetworks";
import MyCommunities from "./MyCommunities";
import { getMemberData } from '../../redux/actions/userActions';

const BGCProfileHome = ({ history, UI, user: { userInfo }, match : { params : { userId } = {} }, members, getMemberData }) => {
  const [readOnlyFlow, setReadOnlyFlow] = useState(false)
 useEffect(() => {
  if(userId && members && Array.isArray(members) && members.length > 0) {
    const currentMember = members.filter((item) => item.memberId === userId);
    getMemberData(currentMember[0].email);
    setReadOnlyFlow(true);
  } else {
    setReadOnlyFlow(false);
  }
 }, [userId])

  const progressSection = (<div className="spinnerDiv">
  <CircularProgress size={200} thickness={2} />
</div>);
  return (
    <React.Fragment>
      {!Object.keys(userInfo) > 0 ? progressSection: (<div className="bgc__profile__Container">
      <div className="bgc__profile_Container__header">
      <ProfileHeader credentials={userInfo} readOnlyFlow={readOnlyFlow} />
      </div>
      <div className="bgc__profile_Container__body">
     
      <div className="bgc__profile_Container__body__midPanel">
      <Summary readOnlyFlow={readOnlyFlow} />
      <Experience readOnlyFlow={readOnlyFlow} />
      <Education readOnlyFlow={readOnlyFlow} />
      </div>
      <div className="bgc__profile_Container__body__rightPanel">
     <MyNetworks readOnlyFlow={readOnlyFlow} />
     <MyCommunities readOnlyFlow={readOnlyFlow} />
      </div>
     
      </div>
    </div>
   
    
    
    )}

    </React.Fragment>
    
    );
   
    // </GridContainer>
};

BGCProfileHome.propTypes = {};
const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
  members : state.data.members

});
const mapDispatchToProps = { signupUser, getMemberData };

export default connect(mapStateToProps, mapDispatchToProps)(BGCProfileHome);
