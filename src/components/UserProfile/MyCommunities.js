import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import FlipMove from "react-flip-move";
import CircularProgress from "@material-ui/core/CircularProgress";
import { setCurrentCommunityId } from "../../redux/actions/dataActions";
import {
  updateTabIndex,
  setActiveHeader,
} from "../../redux/actions/userActions";
import DialogWindow from "./DialogWindow";

const MyCommunities = ({
  myCommunities,
  loadingMyCommunities,
  setCurrentCommunityId,
  updateTabIndex,
  setActiveHeader,
}) => {
  const history = useHistory();
  const [openModal, setOpenModal] = useState(false);
  const communityClickHandler = (communityId) => {
    updateTabIndex(4);
    setActiveHeader(false);
    history.push("/communityHome");
    setCurrentCommunityId(communityId);
  };

  const handleModal = () => {
    if (myCommunities.length > 0) {
      setOpenModal((prevState) => !prevState);
    } else {
      updateTabIndex(2);
    }
  };
  const windowModal = (
    <div>
      <DialogWindow
        myCommunities={myCommunities}
        communityClickHandler={communityClickHandler}
        openModal={openModal}
        handleModal={handleModal}
        noOfPages={Math.ceil(myCommunities.length / 4)}
      />
    </div>
  );

  let filteredList = [];
  console.log("communities1", myCommunities);
  if (
    myCommunities &&
    Array.isArray(myCommunities) &&
    myCommunities.length > 0
  ) {
    filteredList = myCommunities.slice(0, 3);
    console.log("communities", filteredList);
  }

  return (
    <div className="MyCommunity">
      <div className="MyCommunity__heading">
        <div className="MyCommunity__header">
          <h3>My Communities</h3>
        </div>
        {filteredList &&
          Array.isArray(filteredList) &&
          filteredList.length > 0 && (
            <div className="MyNetworks__header__right">
              <span>{myCommunities.length} Communities</span>
            </div>
          )}
      </div>
      <div className="MyCommunity__body">
        {loadingMyCommunities && (
          <div className="MyCommunity__progressBar">
            <CircularProgress size={30} className="progress" />
          </div>
        )}
        {!loadingMyCommunities && myCommunities.length === 0 && (
          <p>You have not joined any communities.</p>
        )}
        <FlipMove>
          {filteredList.map((item) => (
            <div className="MyCommunity__body_item">
              <div className="mycPic">
                <Avatar
                  alt="Remy Sharp"
                  className="MyCommunity__body_item__image"
                  src={item.image}
                />
              </div>

              {/* <Typography
              <Typography
          variant="p"
         
          color="primary"
          className="MyCommunity__body_item_label"
          onClick={() => communityClickHandler(item.communityId)}
        >
         {item.name}
        </Typography>
             
                {/* <Link
                  to={`/communityHome/${item.communityId}`}
                  
                >
                  {item.name}
                </Link>
              </p> */}
              <p>
                <Link
                  to={`/communityHome/${item.communityId}`}
                  onClick={() => communityClickHandler(item.communityId)}
                >
                  {item.name}
                </Link>
              </p>
            </div>
          ))}
        </FlipMove>
      </div>
      <div className="MyCommunity__body__footer">
        <Typography
          variant="h6"
          component={Link}
          color="primary"
          className="recommended__communityBox_community_join_button"
          onClick={handleModal}
        >
          {myCommunities.length === 0
            ? "Explore Alumnae Communities"
            : "VIEW ALL"}
        </Typography>
        {windowModal}
      </div>
    </div>
  );
};

MyCommunities.propTypes = {};

const mapStateToProps = (state) => ({
  myCommunities: state.data.myCommunities.filter(({status})=> status ==='active'),
  loadingMyCommunities: state.data.loadingMyCommunities,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrentCommunityId: (communityId) =>
    dispatch(setCurrentCommunityId(communityId)),
  updateTabIndex: (tabIndex) => dispatch(updateTabIndex(tabIndex)),
  setActiveHeader: (value) => dispatch(setActiveHeader(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyCommunities);
