import React from "react";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import { Link } from "react-router-dom";
import { setActiveHeader,updateTabIndex } from "../../redux/actions/userActions";
import { connect } from "react-redux";

const Member = ({
  member: { imageUrl, firstName, lastName, headLine, email, memberId },
  myNetworks,
  addMemberHandler,
  updateTabIndex,
  setActiveHeader,
}) => {
  const generateActionLink = () => {
    if (
      myNetworks &&
      Array.isArray(myNetworks) &&
      myNetworks.filter((item) => item.email === email).length > 0
    ) {
      return (
        <div className="member_on_my_network">
          <React.Fragment>
            <CheckIcon onClick={() => addMemberHandler(email)} />{" "}
            <span
              onClick={() => addMemberHandler(email)}
              className="member_add_action_label"
            >
              ON MY NETWORK
            </span>
          </React.Fragment>
        </div>
      );
    } else {
      return (
        <div className="member_add_action">
          <React.Fragment>
            <AddIcon onClick={() => addMemberHandler(email)} />{" "}
            <span
              onClick={() => addMemberHandler(email)}
              className="member_add_action_label"
            >
              ADD TO MY NETWORK
            </span>
          </React.Fragment>
        </div>
      );
    }
  };

  // const userClickHandler = (userId) => {
  //     history.push("/userProfile");
  //   };

  return (
    <div className="member_block">
      <Avatar alt="Remy Sharp" className="member__image" src={imageUrl} />
      <span className="member_block_name">
        <Link
          to={`/userProfile/${memberId}`}
          onClick={() => {
            setActiveHeader(false);
            updateTabIndex(4);
          }}
        >
          {" "}
          {firstName} {lastName}
        </Link>
      </span>
      <span className="member_block_role">{headLine}</span>
      <div className="member_add_action">{generateActionLink()}</div>
    </div>
  );
};

Member.propTypes = {};
const mapDispatchToProps = (dispatch) => ({
  setActiveHeader: (value) => dispatch(setActiveHeader(value)),
  updateTabIndex: (value) => dispatch(updateTabIndex(value)),
});
export default connect(null, mapDispatchToProps)(Member);
