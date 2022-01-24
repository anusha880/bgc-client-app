import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import { editUserDetails } from "../../redux/actions/userActions";
import ModelWindow from "./ModelWindow";
import { formatISO } from "date-fns";
import {sortProfileItems} from '../../helpers/sortProfileItems';
import { useLocation } from "react-router-dom";

const Experience = ({
  user,

  user: {
    userInfo,
    userInfo: { profileInfo },
    selectedMember,
  },
  readOnlyFlow,
  editUserDetails,
}) => {
  const [profile, setProfile] = useState({});
  const [openModel, setOpenModel] = useState(false);
  const [modeType, setModeType] = useState("Add");
  const [currentExperiences, setCurrentExperiences] = useState([]);
  const [experienceTest, setExpierenceTest] = useState({});
  const [profileInfoConst, setProfileInfoConst] = useState([]);
  const [indexToModal, setIndexToModal] = useState(1);
  const [currentPath, setCurrentPath] = useState();
  const location = useLocation();

  useEffect(() =>{
    if(location.pathname === "/userprofile" || location.pathname === "/portalHome"){
      console.log('MY PROFILE');
    }else{
      if(selectedMember && selectedMember.profileInfo){
        setCurrentExperiences(selectedMember.profileInfo[0].details);
      }
    }
  },[location,selectedMember]);

  useEffect(() => {
    if(location.pathname === "/userprofile" || location.pathname === "/portalHome"){
      setCurrentExperiences(profileInfo[0].details);
    }
  }, [location]);

  useEffect(() => {
    //Estas son las experiencias actuales
    if(location.pathname === "/userprofile" || location.pathname === "/portalHome"){
      setProfileInfoConst([
        { type: "workforce", details: currentExperiences },
        profileInfo[1],
        profileInfo[2],
      ]);
    }
  }, [currentExperiences]);

  useEffect(() => {
    if (Object.keys(experienceTest).length > 0) {
      if (experienceTest.type === "Add") {
        setCurrentExperiences([...currentExperiences, experienceTest.payload]);
      } else if (experienceTest.type === "Edit") {
        const newArray = currentExperiences;
        newArray[experienceTest.index] = experienceTest.payload;
        setCurrentExperiences([...newArray]);
        setProfile({});
      }else if(experienceTest.type === "Delete"){
        const newArray = currentExperiences;
        const filteredArray = newArray.filter(arrayItem => Object.keys(arrayItem).length > 1);
        const orderedArray = sortProfileItems(filteredArray);
        orderedArray.splice(experienceTest.index, 1);
        setCurrentExperiences(orderedArray);
        setProfile({});
      }
    }
  }, [experienceTest]);

  useEffect(() => {
    if (profileInfoConst.length > 0) {
      const request = { ...userInfo, profileInfo: profileInfoConst };
      editUserDetails(request);
    }

  }, [profileInfoConst]);

  const handleAddModel = (value, mode) => {
    setOpenModel(value);
    setModeType("Add");
    setProfile({});
  };
  const handleModelChange = (value, item, index) => {
    setModeType("Edit");
    setIndexToModal(index);
    setProfile(item);
    setOpenModel(value);
  };

  let profileDetails = [];
  if (
    readOnlyFlow &&
    selectedMember &&
    Array.isArray(selectedMember.profileInfo)
  ) {
    const { profileInfo } = selectedMember;
    profileDetails = [...profileInfo];
  } else if (
    userInfo &&
    userInfo.profileInfo &&
    Array.isArray(userInfo.profileInfo)
  ) {
    const { profileInfo } = userInfo;
    profileDetails = [...profileInfo];
  }

  let educationInfo = (
    <div className="experience__item">
      <p className="experience__subheader__p">No Data exists</p>
    </div>
  );
  let info = [];
  if (profileDetails) {
    info = profileDetails.filter((item) => item.type === "workforce");
  }

  if (profileDetails && info.length > 0 && currentExperiences.length > 0) {
    const finalArray = sortProfileItems(currentExperiences);

    educationInfo = finalArray.map((item, index) => {
      if (Object.keys(item).length > 1) {
        return (
          <div className="experience__item">
            <div className="experiance__item__body">
              <h4 className="experience__subheader__title">{item.jobTtile}</h4>
              <p className="experience__subheader__company">{item.company}</p>
              {item.startMonth && (
                <p className="experience__subheader__dates">

                  {item.startMonth} {item.startYear} -{" "}
                  {item.endMonth === "Present"
                    ? "Present"
                    : item.endMonth
                    ? item.endMonth + " " + item.endYear
                    : "Present"}
                </p>
              )}
              {item.description && (
                <div className="expwrap">
                  <p className="experience__subheader__description">
                    {item.description}
                  </p>{" "}
                </div>
              )}
            </div>
            {!readOnlyFlow && (
              <div className="summary_add">
                <div className="experience__edit__icon">
                  <EditIcon
                    color="#6200EE"
                    onClick={() => handleModelChange(true, item, index)}
                  />
                </div>
                <span onClick={() => handleModelChange(true, item, index)}>
                  EDIT{" "}
                </span>
              </div>
            )}
          </div>
        );
      }
    });
  }
  return (
    <div className="experience">
      <div className="experience__heading">
        <div className="experience__header">
          <h3 className="subText">Experience</h3>
        </div>
        {!readOnlyFlow && (
          <div className="summary_add">
            <div className="experience__add__icon">
              <AddIcon color="#6200EE" onClick={() => handleAddModel(true)} />
            </div>
            <span onClick={() => handleAddModel(true)}>ADD</span>
          </div>
        )}
      </div>

      {educationInfo}

      <ModelWindow
        profile={profile}
        setOpenModel={setOpenModel}
        openModel={openModel}
        type="workforce"
        modeType={modeType}
        setExpierenceTest={setExpierenceTest}
        indexToModal={indexToModal}
        origin="Experience"
        setProfile={setProfile}
      />

    </div>
  );
};

Experience.propTypes = {};

const mapStateToProps = (state) => ({
  user: state.user,
});
const mapDispatchToProps = { editUserDetails };

export default connect(mapStateToProps, mapDispatchToProps)(Experience);
