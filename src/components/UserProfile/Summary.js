import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import { editUserDetails } from "../../redux/actions/userActions";
import ModelWindow from "./ModelWindow";
import "./BGCProfileHome.css";

const Summary = ({
  user: { userInfo, selectedMember },
  readOnlyFlow,
  editUserDetails,
}) => {
  const [profile, setProfile] = useState({});
  const [openModel, setOpenModel] = useState(false);
  const [modeType, setModeType] = useState("Add");
  const [currentSummary, setSummary] = useState({});


  useEffect(() => {
    if(userInfo.summary && userInfo.summary.length > 0){
      setProfile({
        updatedDescription: userInfo.summary,
      });
    }else{
      editUserDetails({
        ...userInfo,
        summary: "",
      });
    }
  }, []);

  useEffect(() => {
    if (Object.keys(currentSummary).length > 0) {
      editUserDetails({
        ...userInfo,
        summary: currentSummary.description,
      });
      setOpenModel(false);
    }
  }, [currentSummary]);

  const { summary } = userInfo;

  let info = {};
  let summaryInfo = (
    <div className="experience__item">
      <p className="summary__subheader__p">
        {summary !== undefined ? summary : "Add a summary"}
      </p>
    </div>
  );
  if (readOnlyFlow) {
    const { summary } = selectedMember;
    info = {
      summary,
    };
    summaryInfo = (
      <div className="experience__item">
        <p className="summary__subheader__p">
          {summary !== undefined ? summary : "Add a summary"}
        </p>
      </div>
    );
  } else {
    const { summary } = userInfo;
    info = {
      summary,
    };
    summaryInfo = (
      <div className="experience__item">
        <p className="summary__subheader__p">
          {summary !== undefined ? summary : "Add a summary"}
        </p>
      </div>
    );
  }

  return (
    <div className="summary">
      <div className="summary__heading">
        <div className="summary__header">
          <h3 className="subText">About</h3>
        </div>
        {!readOnlyFlow && (
          <div>
            {profile.updatedDescription ?(
              <div className="summary_add">
                <div className="Summary_add__icon">
                  <EditIcon
                    color="#6200EE"
                    onClick={() => setOpenModel(true)}
                  />
                </div>
                <span
                  onClick={() => {
                    setOpenModel(true);
                    setModeType("Edit");
                  }}
                >
                  {" "}
                  EDIT{" "}
                </span>
              </div>
            ) : (
              <div className="summary_add">
                <div className="Summary_add__icon">
                  <AddIcon color="#6200EE" onClick={() => setOpenModel(true)} />
                </div>
                <span
                  onClick={() => {
                    setOpenModel(true);
                    setModeType("Add");
                  }}
                >
                  {" "}
                  ADD{" "}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {summaryInfo}

      <ModelWindow
        className="text_field_outline"
        variant="outlined"
        profile={profile}
        setOpenModel={setOpenModel}
        openModel={openModel}
        type="summary"
        origin="Summary"
        modeType={modeType}
        setSummary={setSummary}
      />
    </div>
  );
};

Summary.propTypes = {};

const mapStateToProps = (state) => ({
  user: state.user,
});
const mapDispatchToProps = { editUserDetails };

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
