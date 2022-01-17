import React, { useState } from "react";
import { connect } from "react-redux";
import Avatar from "@mui/material/Avatar";
import { useHistory } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import {
  setActiveHeader,updateTabIndex
} from "../../redux/actions/userActions";
import { editUserDetails } from "../../redux/actions/userActions";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";

const Members = ({ communityPosts: { community: { members } = [] } = {} }) => {
  const [openModel, setOpenModel] = useState(false);
  const history = useHistory();

  const [pageNumber, setPageNumber] = useState(1);
  const limit = 20;
  const [pagesPerPage] = members
    ? React.useState(Math.ceil(members.length / limit))
    : React.useState(0);

  const myNetworkClickHandler = (email) => {
    const memberId = members
      .filter((x) => x.email === email)
      .map((y) => y.memberId);
      updateTabIndex(4);
    setActiveHeader(false);
    history.push(`/userProfile/${memberId}`);
  };

  const handleMyNetwork = () => {
    setOpenModel(!openModel);
  };
  const handleChangePage = (e, value) => {
    setPageNumber(value);
  };

  console.log("info users mynetwork", members);
  let filteredList = [];
  if (members && Array.isArray(members) && members.length > 0) {
    filteredList = members.slice(0, 4);
  }

  return (
    <div className="MyNetworks">
      <div className="MyNetworks__heading">
        <div className="MyNetworks__header">
          <p>Members</p>
        </div>
        <div className="MyNetworks__header__right">
          {filteredList &&
            Array.isArray(filteredList) &&
            filteredList.length > 0 && <span>{members.length} Members</span>}
        </div>
      </div>
      <div className="MyNetworks__body">
        {filteredList &&
          Array.isArray(filteredList) &&
          filteredList.map((item) => (
            <div className="MyNetworks__body_item">
              <Avatar
                alt="Remy Sharp"
                className="MyNetworks__body_item__image"
                src={item.imageUrl}
              />
              <p>{item.firstName}</p>
            </div>
          ))}
      </div>
      <div className="MyNetworks__body__footer">
        <Typography
          variant="h6"
          component={Link}
          color="primary"
          className="recommended__communityBox_community_join_button"
          onClick={handleMyNetwork}
        >
          {members && Array.isArray(members) && members.length > 0
            ? "VIEW ALL"
            : "View Alumnae Directory"}
        </Typography>
        {filteredList &&
          Array.isArray(filteredList) &&
          filteredList.length > 0 && (
            <Dialog
              open={openModel}
              onClose={() => setOpenModel(false)}
              fullWidth
              maxWidth="md"
            >
              <DialogTitle>
                Members
                <span className="mynCon">{members.length} Members</span>
              </DialogTitle>

              <DialogContent>
                <div className="mySplit">
                  {members
                    .slice((pageNumber - 1) * limit, limit * pageNumber)
                    .map((item) => (
                      <div className="myNetworks__social__form_names">
                        <div
                          className="MyCommunity__body_item"
                          onClick={() => myNetworkClickHandler(item.email)}
                        >
                          <Avatar
                            alt="Remy Sharp"
                            className="myNetwork__dailogue_img"
                            src={item.imageUrl}
                          />

                          <div className="mynModal">
                            <div
                              className="myNetworks__item_description_title"
                              onClick={() => myNetworkClickHandler(item.email)}
                            >
                              {item.firstName} {item.lastName}{" "}
                            </div>
                            <div className="myNetworks__item_description">
                              {item.headLine}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </DialogContent>
              <DialogActions>
                <Pagination
                  rowsPerPageOptions={[]}
                  component="div"
                  count={pagesPerPage}
                  rowsPerPage={limit}
                  page={pageNumber}
                  onChange={handleChangePage}
                />
                <Button
                  onClick={() => setOpenModel(!openModel)}
                  color="primary"
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          )}
      </div>
    </div>
  );
};

Members.propTypes = {};

const mapStateToProps = (state) => ({
  user: state.user,
  communityPosts: state.data.communityPosts,
});

const mapDispatchToProps =(dispatch)=> ({ 
  updateTabIndex: (value) => dispatch(updateTabIndex(value)),
 });

export default connect(mapStateToProps, mapDispatchToProps)(Members);
