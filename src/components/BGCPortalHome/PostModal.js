import React, { useState } from "react";
import styled from "styled-components";
import ReactPlayer from "react-player";
import { connect } from "react-redux";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import CloseIcon from "@mui/icons-material/Close";

import ImageIcon from "@mui/icons-material/Image";
import Button from "@material-ui/core/Button";
import {
  addAPost,
  addAPostwithImage,
  clearErrors,
} from "../../redux/actions/postActions";

// import firebase from 'firebase';
// import { postArticleAPI } from '../actions';

const PostModal = ({
  user: { userInfo },
  showModal,
  addACommunityPost,
  addACommunityPostwithImage,
  handleClick,
}) => {
  const [editorText, setEditorText] = useState("");
  const [sharedImage, setSharedImage] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [assetArea, setAssetArea] = useState("");

  const handleChange = (e) => {
    const image = e.target.files[0];

    if (image === "" || image === undefined) {
      alert(`not an image, the file is a ${typeof image}`);
      return;
    }
    setSharedImage(image);
  };

  const switchAssetArea = (area) => {
    setSharedImage("");
    setVideoLink("");
    setAssetArea(area);
  };

  const postArticle = (e) => {
    const { firstName, lastName } = userInfo;

    e.preventDefault();
    // if(e.target !== e.currentTarget)
    // {
    //     return;
    // }
    if (sharedImage !== "") {
      const formData = new FormData();
      formData.append("image", sharedImage, sharedImage.name);
      const payload = {
        postPayload: {
          sharedImg: "",
          sharedVideo: videoLink,
          body: editorText,
          isReportPresent: false,
          // Hard Coded for now, need to populate from selected community
          communityId: "hrOuNe4vM52rbPWX9ceh",
          userName: `${firstName} ${lastName}`,
        },
        formData,
      };
      addACommunityPostwithImage(payload);
      reset(e);
    } else {
      const payload = {
        postPayload: {
          sharedImg: "",
          sharedVideo: videoLink,
          body: editorText,
          isReportPresent: false,
          // Hard Coded for now, need to populate from selected community
          communityId: "hrOuNe4vM52rbPWX9ceh",
          userName: `${firstName} ${lastName}`,
        },
      };
      addACommunityPost(payload);
      reset(e);
    }
  };

  const reset = (e) => {
    setEditorText("");
    setSharedImage("");
    setVideoLink("");
    setAssetArea("");
    handleClick(e);
  };
  const { imageUrl, firstName } = userInfo;

  return (
    <>
      {showModal === "open" && (
        <Container>
          <Content>
            <Header>
              <h2>Create a post</h2>
              <CloseIcon onClick={(event) => reset(event)} color="primary" />
            </Header>

            <SharedContent>
              <UserInfo>
                {imageUrl ? (
                  <img src={imageUrl} />
                ) : (
                  <img src="/images/user.svg" alt="" />
                )}
                <span>{firstName}</span>
              </UserInfo>

              <Editor>
                <textarea
                  value={editorText}
                  onChange={(e) => setEditorText(e.target.value)}
                  placeholder="What do you want to talk about?"
                  onFocus={true}
                />
                {assetArea === "image" ? (
                  <UploadImage>
                    <input
                      type="file"
                      accept="image/gif, image/jgp, image/png, image/jpeg"
                      id="file"
                      style={{ display: "none" }}
                      onChange={handleChange}
                    />
                    <p>
                      <label htmlFor="file" style={{ cursor: "pointer" }}>
                        Select an image
                      </label>
                    </p>

                    {sharedImage && (
                      <img src={URL.createObjectURL(sharedImage)} />
                    )}
                  </UploadImage>
                ) : (
                  assetArea === "media" && (
                    <>
                      <input
                        type="text"
                        placeholder="Please upload a video"
                        value={videoLink}
                        onChange={(e) => setVideoLink(e.target.value)}
                      />
                      {ReactPlayer.canPlay(videoLink) ? (
                        <ReactPlayer width={"100%"} url={videoLink} />
                      ) : null}
                    </>
                  )
                )}
              </Editor>
            </SharedContent>

            <SharedCreation>
              <AttachAssets>
                <AssetButton onClick={() => switchAssetArea("image")}>
                  <ImageIcon color="primary" />
                  <span>Add Image</span>
                </AssetButton>
                <AssetButton onClick={() => switchAssetArea("media")}>
                  <OndemandVideoIcon color="primary" />
                  {/* <img src="/images/shared-vid.png" alt="" /> */}
                </AssetButton>
                <span>Add Video</span>
              </AttachAssets>

              <ShareComment>
                <AssetButton>
                  <img src="/images/shared-comment.png" alt="" />
                  Anyone
                </AssetButton>
              </ShareComment>
              <Button
                disabled={!editorText ? true : false}
                onClick={(event) => postArticle(event)}
                color="primary"
                name="post"
              >
                Post
              </Button>
              {/* <PostButton 
                                disabled = {!editorText ? true : false} 
                                onClick = {(event) => postArticle(event)} >
                                Post
                            </PostButton> */}
            </SharedCreation>
          </Content>
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  color: #000000;
  background-color: rgba(0, 0, 0, 0.8);
  animation: fadeIn 0.3s;
`;

const Content = styled.div`
  width: 100%;
  max-width: 552px;
  background-color: #fff;
  max-height: 90%;
  overflow: initial;
  border-radius: 5px;
  position: relative;
  display: flex;
  flex-direction: column;
  top: 80px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: block;
  padding: 0 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 14px;
  line-height: 1.5;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    height: 48px;
    width: 40px;
    min-width: auto;
    color: rgba(0, 0, 0, 0.15);

    img {
      pointer-events: none;
    }
    svg {
      margin: 10px !important;
    }
  }
`;

const SharedContent = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
  vertical-align: baseline;
  background: transparent;
  padding: 8px 12px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;

  svg,
  img {
    width: 48px;
    height: 48px;
    background-clip: content-box;
    border: 2px solid transparent;
    border-radius: 50%;
    margin-right: 5px;
  }

  span {
    font-weight: 600;
    font-size: 16px;
    line-height: 1.5;
  }
`;

const SharedCreation = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px 12px 16px;
`;

const AssetButton = styled.button`
  display: flex;
  align-items: center;
  height: 40px;
  min-width: auto;
  color: rgba(0, 0, 0, 0.5);
`;

const AttachAssets = styled.div`
  align-items: center;
  display: flex;
  padding-right: 8px;

  ${AssetButton} {
    width: 40px;
    margin: 0 10px 0 0;
  }
`;

const ShareComment = styled.div`
  padding-left: 8px;
  margin-right: auto;
  border-left: 1px solid rgba(0, 0, 0, 0.15);

  ${AssetButton} {
    img {
      margin-right: 5px;
    }
  }
`;

const PostButton = styled.button`
  min-width: 60px;
  border-radius: 20px;
  padding-left: 16px;
  padding-right: 16px;
  background: ${(props) => (props.disabled ? "rgba(0,0,0,0.5)" : "#0a66c2")};
  color: ${(props) => (props.disabled ? "rgba(1,1,1,0.2)" : "#fff")};

  &:hover {
    background: ${(props) => (props.disabled ? "rgba(0,0,0,0.08)" : "#004182")};
    cursor: ${(props) => (props.disabled ? "none" : "pointer")};
    outline: none !important;
  }
`;

const Editor = styled.div`
  padding: 12px 24px;

  textarea {
    width: 100%;
    min-height: 100px;
    resize: none;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    outline: none;
    color: rgba(0, 0, 0, 0.87);
    font-family: Roboto;
    font-size: 16px;
    letter-spacing: 0.15px;
    line-height: 24px;
  }

  input {
    width: 100%;
    height: 35px;
    font-size: 16px;
    margin-bottom: 20px;
  }
`;

const UploadImage = styled.div`
  text-align: center;

  img {
    width: 100%;
  }
`;

const mapStateToProps = (state) => {
  return {
    loading: state.UI.loading,
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  addACommunityPost: (payload) => dispatch(addAPost(payload)),
  addACommunityPostwithImage: (payload) => dispatch(addAPostwithImage(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
