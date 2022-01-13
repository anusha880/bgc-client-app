import React, { useState } from "react";
import { connect } from "react-redux";
import Clear from "@mui/icons-material/Clear";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { uploadCommunityProfileImage } from "../../redux/actions/postActions";
import { ButtonGroup, Button } from "@mui/material";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Avatar from "@mui/material/Avatar";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";

const CommunityPictureChange = ({
  uploadCommunityProfileImage,
  communityId,
  imageUrl,
}) => {
  const [openModel, setOpenModel] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [imgUrl, setImgUrl] = useState();
  const [imageDocument, setImageDocument] = useState();

  const [docChange, setDocChange] = useState(false);

  const handleUploadModelOpen = (value) => {
    setCurrentStep(0);
    setOpenModel(value);
    setImgUrl(imageUrl);
    setImageDocument(imageUrl);
    setDocChange(false);
  };

  const handleProfilePicChange = (e) => {
    const image = e.target.files[0];

    if (image === "" || image === undefined) {
      alert(`not an image, the file is a ${typeof image}`);
      return;
    }

    setImageDocument(image);
    setDocChange(true);
    setImgUrl(URL.createObjectURL(image));
  };

  const handleImageUpload = (e, currentStep) => {
    e.preventDefault();
    if (currentStep === 1) {
      uploadCommunityProfileImage(imageDocument, communityId);
    }

    setCurrentStep(currentStep);

    if (currentStep > 1) {
      reset(e);
    }
  };

  const removeImage = (e) => {
    e.preventDefault();

    setImageDocument("");
    setDocChange(true);
    setImgUrl();
  };

  const reset = (e) => {
    setImageDocument("");
    setOpenModel(false);
    setDocChange(false);
  };

  return (
    <>
      <PhotoCameraRoundedIcon
        style={{ marginLeft: "60px" }}
        onClick={() => handleUploadModelOpen(true)}
      />

      <Dialog
        open={openModel}
        onClose={() => setOpenModel(false)}
        PaperProps={{
          style: {
            width: "500px",
            maxWidth: "500px",
            borderRadius: "4px",
            backgroundColor: "#FFFFFF",
            boxShadow:
              "0 1px 1px 0 rgb(0,0,0,0.14), 0 2px 1px -1px rgb(0,0,0,0.12), 0 1px 3px 0 rgb(0 ,0, 0,0.2)",
          },
        }}
      >
        <DialogTitle>Profile Picture</DialogTitle>
        <DialogContent>
          {currentStep === 0 && (
            <div className="profile__picture_align">
              <Avatar
                alt="Remy Sharp"
                className="profile__header__image"
                src={imgUrl}
              />
              <div>
                <div style={{ marginBottom: 10 }}>
                  {imageDocument && (
                    <Button
                      onClick={(event) => removeImage(event)}
                      variant="text"
                      component="span"
                      color="primary"
                    >
                      <Clear />
                      <strong>REMOVE PHOTO</strong>
                    </Button>
                  )}
                </div>
                <div>
                  <input
                    disabled={imageDocument}
                    id="file-input"
                    type="file"
                    accept="image/gif, image/jgp, image/png, image/jpeg"
                    hidden
                    onChange={handleProfilePicChange}
                  />
                  <label htmlFor="file-input">
                    <Button
                      color="primary"
                      style={{ margin: "0 10px" }}
                      variant="outlined"
                      component="span"
                    >
                      UPLOAD NEW
                    </Button>
                  </label>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="__reportstep2__section__">
              <CheckCircleIcon
                color="primary"
                className="step7_section__checkBar"
              />
              <p>Your profile picture has been updated.</p>
            </div>
          )}
        </DialogContent>

        <ButtonGroup
          style={{ display: "flex", justifyContent: "flex-end", padding: 10 }}
        >
          <div className="__report__post__footer">
            {currentStep === 0 && (
              <div>
                <Button
                  onClick={() => setOpenModel(false)}
                  color="primary"
                  style={{ margin: "0 10px" }}
                  variant="outlined"
                >
                  CANCEL
                </Button>
              </div>
            )}

            <div className="signUp__footer__nextBtn">
              <Button
                color="primary"
                variant="contained"
                onClick={(event) => handleImageUpload(event, currentStep + 1)}
                disabled={!docChange}
              >
                {currentStep === 0 ? "SAVE" : "CLOSE"}
              </Button>
            </div>
          </div>
        </ButtonGroup>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    loading: state.UI.loading,
    user: state.user,
  };
};

const mapDispatchToProps = {
  uploadCommunityProfileImage,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunityPictureChange);
