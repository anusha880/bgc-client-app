import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import { editUserDetails } from "../../redux/actions/userActions";
import ModelWindow from "./ModelWindow";
import { IndeterminateCheckBox } from "@material-ui/icons";
import {sortProfileItems} from '../../helpers/sortProfileItems';
import { useLocation } from "react-router-dom";

const Education = React.memo(
  ({
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
    const [currentEducation, setCurrentEducation] = useState([]);
    const [educationTest, setEducationTest] = useState({});
    const [profileInfoConst, setProfileInfoConst] = useState([]);
    const [indexToModal, setIndexToModal] = useState(1);
    const location = useLocation();

    useEffect(() =>{
      if(location.pathname === "/userprofile" || location.pathname === "/portalHome"){
        console.log('MY PROFILE');
      }else{
        if(selectedMember && selectedMember.profileInfo){
          setCurrentEducation(selectedMember.profileInfo[2].details);
        }
      }
    },[location,selectedMember]);

    useEffect(() => {
      if(location.pathname === "/userprofile" || location.pathname === "/portalHome"){
        setCurrentEducation(profileInfo[2].details);
      }
    }, [location]);

    // useEffect(() => {
    //   setCurrentEducation(profileInfo[2].details);
    // }, []);

    useEffect(() => {
      //Estas son las experiencias actuales
      if(location.pathname === "/userprofile" || location.pathname === "/portalHome"){
        setProfileInfoConst([
          profileInfo[0],
          profileInfo[1],
          { type: "education", details: currentEducation },
        ]);
      }
    }, [currentEducation]);

    // useEffect(() => {
    //   setCurrentEducation(profileInfo[2].details);
    // }, []);

    // useEffect(() => {
    //   setProfileInfoConst([
    //     profileInfo[0],
    //     profileInfo[1],
    //     { type: "education", details: currentEducation },
    //   ]);
    // }, [currentEducation]);

    useEffect(() => {
      if (Object.keys(educationTest).length > 0) {
        if (educationTest.type === "Add") {
          setCurrentEducation([...currentEducation, educationTest.payload]);
        } else if (educationTest.type === "Edit") {
          const newArray = currentEducation;
          newArray[educationTest.index] = educationTest.payload;
          setCurrentEducation([...newArray]);
          setProfile({});
        }else if(educationTest.type === "Delete"){
          const newArray = currentEducation;
          const filteredArray = newArray.filter(arrayItem => Object.keys(arrayItem).length > 1);
          const orderedArray = sortProfileItems(filteredArray);
          orderedArray.splice(educationTest.index, 1);
          setCurrentEducation(orderedArray);
          setProfile({});
        }
      }
    }, [educationTest]);

    useEffect(() => {
      if (profileInfoConst.length > 0) {
        const request = { ...userInfo, profileInfo: profileInfoConst };
        editUserDetails(request);
      }
    }, [profileInfoConst]);

    const [errorMessage, setErrormessage] = useState({});


    const handleAddModel = (value, mode) => {
      setOpenModel(value);
      setModeType("Add");
      setProfile({});
    };
    const handleModelChange = (value, item, index) => {
      setModeType("Edit");
      setProfile(item);
      setIndexToModal(index);
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
      info = profileDetails.filter((item) => item.type === "education");
    }

    if (profileDetails && info.length > 0 && currentEducation.length > 0) {
      const finalArray = sortProfileItems(currentEducation);

      educationInfo = finalArray.map((item, index) => {
        if (Object.keys(item).length > 1) {
          return (
            <div className="experience__item">
              <div className="experiance__item__body">
                <p className="education__subheader__fieldOfStudy">{item.fieldOfStudy}</p>
                <h4 className="education__subheader__university">{item.university}</h4>
                <p className="education__subheader__location">{item.location}</p>
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
                    EDIT
                  </span>
                </div>
              )}
            </div>
          );
        }
      });
    }
    return (
      <div className="education">
        <div className="education__heading">
          <div className="education__header">
            <h3 className="subText">Education</h3>
          </div>
          {!readOnlyFlow && (
            <div className="summary_add">
              <div className="education_add__icon">
                <AddIcon color="#6200EE" onClick={() => handleAddModel(true)} />
              </div>
              <span onClick={() => handleAddModel(true)}> ADD</span>
            </div>
          )}
        </div>
        {educationInfo}
        <ModelWindow
          profile={profile}
          setOpenModel={setOpenModel}
          openModel={openModel}
          type="education"
          errorMessage={errorMessage}
          modeType={modeType}
          setEducationTest={setEducationTest}
          origin="Education"
          indexToModal={indexToModal}
          setProfile={setProfile}
        />
      </div>
    );
  }
);


Education.propTypes = {};

const mapStateToProps = (state) => ({
  user: state.user,
});
const mapDispatchToProps = { editUserDetails };

export default connect(mapStateToProps, mapDispatchToProps)(Education);
