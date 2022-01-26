import React, { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { createCommunity } from "../../../redux/actions/dataActions";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import "./CommunityForm.css";

const CommunityCreateDailog = ({
  user: { userInfo },
  createCommunity,
  props,
}) => {
  const { ...other } = props;
  const [openModel, setOpenModel] = useState(false);
  const [commnunityProfile, setCommunityProfile] = useState({});
  const [nameText, setNameText] = useState("");
  const [descText, setDescText] = useState("");
  const [tagText, setTagText] = useState("");

  const history = useHistory();
  const handleChange = (event) => {
    if (event.target.name === "name") {
      setNameText(event.target.value);
    } else if (event.target.name === "description") {
      setDescText(event.target.value);
    } else if (event.target.name === "tags") {
      setTagText(event.target.value);
    }

    setCommunityProfile({
      ...commnunityProfile,
      [event.target.name]: event.target.value,
    });
  };
  const handleModelChange = (value) => {
    setOpenModel(value);
  };


  const reset = (e) => {
    setNameText(""); 
    setDescText(""); 
    setTagText(""); 
   // setCommunityProfile();
    setOpenModel(false);
  };

  const handleSubmit = (e) => {
    const { name, description, tags } = commnunityProfile;
    const { email, firstName, lastName, imageUrl } = userInfo;
    const noImg = "no-img.png";
    const newCommunity = {
      name,
      description,
      tags: tags.split(","),
      imageUrl: `https://firebasestorage.googleapis.com/v0/b/bgc-functions.appspot.com/o/${noImg}?alt=media`,
      members: [{ email, firstName, imageUrl }],
      createdAt: new Date().toISOString(),
      createdMember: email,
      createdUsername: `${firstName} ${lastName}`
    };
    createCommunity(newCommunity, history);
    reset(e);
  };

  const { name, description, tags } = commnunityProfile;
  return (
    <div>
      <Button
        variant="contained"
        onClick={() => handleModelChange(true)}
        color="primary"
      >
        CREATE A COMMUNITY
      </Button>
      <Dialog
        open={openModel}
        onClose={() => setOpenModel(false)}
        PaperProps={{
          style: {
            width: "780px",
            height: "600px",
            maxWidth: "780px",
            borderRadius: "4px",
            backgroundColor: "#FFFFFF",
            boxShadow:
              "0 1px 1px 0 rgb(0,0,0,0.14), 0 2px 1px -1px rgb(0,0,0,0.12), 0 1px 3px 0 rgb(0 ,0, 0,0.2)",
          },
        }}
      >
        <DialogTitle>Create a Community</DialogTitle>
        <DialogContent style={{ padding: "0 20px 0px", marginRight: 20 }}>
          <TextField
            className="communityCreate__form__page"
            required
            // error={!!errorMessage.firstName}
            name="name"
            id="outlined-required"
            label="Community Name"
            value={nameText}
            variant="outlined"
            onChange={handleChange}
            fullWidth
          />
          <TextField
            className="communityCreate__form__page"
            required
            // error={!!errorMessage.firstName}
            name="description"
            id="outlined-required"
            label="Description"
            value={descText}
            variant="outlined"
            onChange={handleChange}
            rows="5"
            multiline
            fullWidth
          />
          <div>
            <TextField
              className="communityCreate__form__page"
              required
              // error={!!errorMessage.firstName}
              name="tags"
              id="outlined-required"
              label="Tags"
              value={tagText}
              variant="outlined"
              onChange={handleChange}
              placeholder="Tags"
              fullWidth
              helperText="Make it easier for other members to find this community by entering meaningful keywords."
            />
          </div>
          {/* <div className="__create__community__agree__div">
              <Alert variant="outlined" severity="error"> 
                <span className="create__community__agree__message">
                  By proceeding to create this community, you agree to abide by
                  the guidelines established for the Black Girls Code Alumnae
                  Portal.
                </span>
              </Alert>
            </div> */}
          <div className="__create__community__agree__div">
            &nbsp;&nbsp;
            <InfoOutlinedIcon />
            &nbsp;&nbsp;
            <span className="create__community__agree__message">
              By proceeding to create this community, you agree to abide by the
              guidelines established for the Black Girls Code Alumnae Portal.
            </span>
          </div>
        </DialogContent>

        <DialogActions style={{ margin: 25 }}>
          <Button onClick={(event) => reset(event)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={(event) => handleSubmit(event)}
            disabled={!nameText || !descText || !tagText}
            color="primary"
            variant="contained"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

CommunityCreateDailog.propTypes = {};
const mapStateToProps = (state) => ({
  user: state.user,
});
const mapDispatchToProps = { createCommunity };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunityCreateDailog);

