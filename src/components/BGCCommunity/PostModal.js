import React, { useState } from "react";
import styled from "styled-components";
import ReactPlayer from "react-player";
import { connect } from "react-redux";
import {Add, Clear} from '@mui/icons-material';

import TextField from "@mui/material/TextField";
import { addAPost, addAPostwithImage, addAPostwithDocument, clearErrors } from '../../redux/actions/postActions';
import { ButtonGroup, Modal, Button } from "@mui/material";
import { linkRegex } from "../../util/constant";


// import firebase from 'firebase';
// import { postArticleAPI } from '../actions';

const PostModal = ({ user: {userInfo}, showModal, addACommunityPost, addACommunityPostwithImage, addACommunityPostwithDocument, handleClick, communityId }) => {
  const [editorText, setEditorText] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [sharedDocument, setSharedDocument] = useState("");
  const [assetArea, setAssetArea] = useState("");
  const [documentType, setDocumentType] = useState("")


  const handleDocumentChange = (e) => {
    const doc = e.target.files[0];

    if (!doc) {
      alert(`Not a valid image/document`);
      return;
    }

    const imageTypes = ['image/gif', 'image/jgp', 'image/png', 'image/jpeg']
    if(imageTypes.includes(doc.type)){
      setDocumentType('image')
    }
    else setDocumentType('document')

    setSharedDocument(doc);
  };


  const postArticle = (e) => {
    const { firstName, lastName, imageUrl, email } = userInfo;

    e.preventDefault();

     if (sharedDocument) {
      const payload = {
        postPayload: {
          // sharedImg: '',
          sharedVideo: videoLink,
          body: editorText,
          docType: documentType,
          communityId: communityId,
          userName: `${firstName} ${lastName}`,
          userHandle: email,
          userImage: imageUrl,
          createdAt: new Date().toISOString(),
          likeCount: 0,
          commentCount: 0,
          usersLiked: [],
          status: 'active',
          isReportPresent: false,
        },
        sharedDocument
      };
      addACommunityPostwithDocument(payload);
      reset(e);
    }
    else {
        const payload = {
            postPayload: {
            sharedImg: '',
            sharedVideo: videoLink,
            body: editorText,
            communityId: communityId,
            userName: `${firstName} ${lastName}`,
            userHandle: email,
            userImage: imageUrl,
            createdAt: new Date().toISOString(), 
            likeCount: 0,
            commentCount: 0,
            usersLiked:[],
            status: 'active',
            isReportPresent: false,
            }
        };
        addACommunityPost(payload);
            reset(e);
    }
  };

  const reset = (e) => {
    setEditorText("");
    setVideoLink("");
    setAssetArea("");
    setSharedDocument('')
    handleClick(e);
  };
  const { imageUrl, firstName } = userInfo;



  return (
    <>
      {showModal === "open" && (
        <Container>
          <Content>
              <h2 style={{padding : '0 10px'}}>Post Something</h2>
            <SharedContent>
                <TextField
                  color="primary"
                  value={editorText}
                  onChange={(e) => {
                    const link = e.target.value.match(linkRegex)
                    setEditorText(e.target.value)
                    setVideoLink(()=> link && link[0] ? link[0] : null)
                  }}
                  label="What do you want to share?"
                  multiline
                  variant='outlined'
                  fullWidth
                  rows={4}
                />
                


              {ReactPlayer.canPlay(videoLink)?  <ReactPlayer width={"100%"} url={videoLink} />: null}
            </SharedContent>
            <div style={{padding: '0 16px'}}>
              {sharedDocument ? (
                <>
                  <a target="_blank" download={sharedDocument.name} href={URL.createObjectURL(sharedDocument)}>
                    {sharedDocument.name}
                  </a>
                  <Button
                    onClick={() => setSharedDocument("")}
                    variant='text'
                    component="span"
                    color="primary"
                  >
                    <Clear />
                    <strong>REMOVE FILE</strong>
                  </Button>
                </>
              ) : (
                <>
                  <input
                    disabled={sharedDocument}
                    id="file-input"
                    type="file"
                    accept="image/gif, image/jgp, image/png, image/jpeg, .pdf, .docx"
                    hidden
                    onChange={handleDocumentChange}
                  />
                  <label htmlFor="file-input">
                    <Button
                      variant='text'
                      component="span"
                      color="primary"
                    >
                      <Add />
                      <strong>ATTACH IMAGE OR FILE</strong>
                    </Button>
                  </label>
                </>
              )}

            </div>


              <ButtonGroup style={{display: 'flex', justifyContent:'flex-end', padding: 10}}>
              <Button
                style={{margin: '0 10px'}}
                onClick={(event) => reset(event)}
                color="primary"
                variant='text'
              >
                CANCEL
              </Button>
              <Button
                disabled={!editorText}
                onClick={(event) => postArticle(event)}
                color="primary"
                variant='text'
              >
                POST
              </Button>
              </ButtonGroup>
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
  // border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  font-size: 14px;
  line-height: 1.5;
  // color: rgba(0, 0, 0, 0.6);
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
  padding: 10px;
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
    loadingUsersPosts: state.data.loadingUsersPosts
  };
};

const mapDispatchToProps = (dispatch) => ({
  addACommunityPost: (payload) => dispatch(addAPost(payload)),
  addACommunityPostwithImage: (payload) => dispatch(addAPostwithImage(payload)),
  addACommunityPostwithDocument: (payload) => dispatch(addAPostwithDocument(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(PostModal);
