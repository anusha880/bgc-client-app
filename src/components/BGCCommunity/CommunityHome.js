import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import styled from "styled-components";
import { collection, query, onSnapshot, orderBy, where, doc } from "@firebase/firestore";
import { SET_COMMUNITY_POSTS } from '../../redux/types';
import { db } from "../../firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from "firebase/storage";
import PostModal from "./PostModal";
import { connect } from "react-redux";
import { getPostsOfCommunity } from "../../redux/actions/dataActions";
import CircularProgress from "@mui/material/CircularProgress";
import { getPostDetails } from "../../redux/actions/postActions";
import Post from "../BGCPortalHome/Post";
import FlipMove from "react-flip-move";
import { updateTabIndex } from "../../redux/actions/userActions";
import Button from "@mui/material/Button";
import "./CommunityHome.css";

import dayjs from "dayjs";

// import { getArticlesAPI } from '../actions';

const CommunityHome = ({
  user: { userInfo },
  loading,
  getAllPostOfACommunity,
  getCommentOfAPost,
  currentCommunityId,
}) => {
  const [showModal, setShowModal] = useState("close");
  const [commentLists, setCommentsList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentSelectedPost, setCurrentSelectedPost] = useState("");
  const [currentCommunityPosts, setCurrentCommunityPosts] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentCommunityId !== null) {
      const firebaseStorage = getStorage();
      const unsubCommSnap = onSnapshot(doc(db, "community", currentCommunityId), (docSnap) => {
        let communityData = {};
        if (docSnap.exists()) {
          communityData.community = { ...docSnap.data(), communityId: currentCommunityId };

          if (communityData.community.members) {
            let emailArray = [];
            let communityMembers =[];
            communityData.community.members.map((item) => { emailArray.push(item.email)});
  
             const userRef = query(
               collection(db, "users"),
               orderBy("firstName", "asc")
             );
             let ImgUrl = "https://firebasestorage.googleapis.com/v0/b/bgc-functions.appspot.com/o/no-img.png?alt=media";
               onSnapshot(userRef, (uersSnapshot) => { 
                if (doc.data().imageUrl) {
                  ImgUrl = doc.data().imageUrl;
                } 
                uersSnapshot.forEach((doc) => {
                  if(doc.data().email && emailArray.includes(doc.data().email)){
                  communityMembers.push({
                    firstName: doc.data().firstName,
                    lastName: doc.data().lastName,
                    email: doc.data().email,
                    imageUrl: ImgUrl,
                    headLine: doc.data().headLine,
                   });
                  }
                });  
             
                communityData.community.members = communityMembers ; //Constructed Members Assign
              }); 
           }
          const postRef = query(collection(db, "posts"),
            where("communityId", "==", currentCommunityId),
            orderBy("createdAt", "desc"));
          const unsubPostSnap = onSnapshot(postRef, (postsSnapshot) => {
            communityData.posts = [];
            postsSnapshot.forEach((doc) => {
              var fileName = "";
              if (doc.data().sharedDocumentURL) {
                const httpsReference = ref(
                  firebaseStorage,
                  doc.data().sharedDocumentURL
                );
                fileName = httpsReference.name;
              }
              if (doc.data().status && doc.data().status !== "inactive") {
                communityData.posts.push({
                  body: doc.data().body,
                  createdAt: doc.data().createdAt,
                  userHandle: doc.data().userHandle,
                  userImage: doc.data().userImage,
                  userName: doc.data().userName,
                  sharedImg: doc.data().sharedImg,
                  docType: doc.data().docType,
                  sharedDocumentURL: doc.data().sharedDocumentURL,
                  sharedDocumentName: fileName,
                  status: doc.data().status,
                  sharedVideo: doc.data().sharedVideo,
                  likeCount: doc.data().likeCount,
                  commentCount: doc.data().commentCount,
                  postId: doc.id,
                  communityId: doc.data().communityId,
                  usersLiked: doc.data().usersLiked,
                });
              }
            });
            dispatch({
              type: SET_COMMUNITY_POSTS,
              payload: communityData
            });
            setCurrentCommunityPosts({ ...communityData });
          });
          return () => unsubPostSnap()
        }
      });
      return () => unsubCommSnap()
    }
  }, []);

  const handleClick = (e) => {
    // e.preventDefault();
    // if(e.target !== e.currentTarget) {
    //     return;
    // }

    switch (showModal) {
      case "open":
        setShowModal("close");
        break;
      case "close":
        setShowModal("open");
        break;
      default:
        setShowModal("close");
        break;
    }
  };

  const HandleCommentDialoge = (postId) => {
    setOpenDialog(true);
    getCommentOfAPost(postId);
    setCurrentSelectedPost(postId);
  };

  const updateComment = (newComment) => {
    setCommentsList([...commentLists.concat(newComment)]);
  };
  const { imageUrl, email } = userInfo;
  let enablePost =
    currentCommunityPosts &&
      currentCommunityPosts.community &&
      Array.isArray(currentCommunityPosts.community.members) &&
      currentCommunityPosts.community.members.filter((item) => item.email === email)
        .length > 0
      ? true
      : false;
  return (
    <Container>
      <ShareBox>
        <div className="__community__feed__">
          <h2>Community Feed</h2>
          {enablePost && (
            <Button
              variant="contained"
              onClick={handleClick}
              disabled={loading ? true : false}
              color="primary"
            >
              POST SOMETHING
            </Button>
          )}
        </div>
      </ShareBox>
      <Content>
        <FlipMove>
          {loading && <CircularProgress size={30} thickness={2} />}
          {currentCommunityPosts &&
            Array.isArray(currentCommunityPosts.posts) &&
            currentCommunityPosts.posts.length != 0 &&
            currentCommunityPosts.posts.map((article, key) => (
              <Post key={key} article={article} source="community" />
            ))}
        </FlipMove>
      </Content>

      <PostModal
        showModal={showModal}
        handleClick={handleClick}
        communityId={currentCommunityId}
      />
    </Container>
  );
};

const Container = styled.div`
  grid-area: main;
`;

const CommonCard = styled.div`
  text-align: center;
  overflow: hidden;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 5px;
  position: relative;
  border: none;
  border-radius: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
  box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 0 0 rgb(0 0 0 / 20%);
`;

const ShareBox = styled(CommonCard)`
  display: flex;
  flex-direction: column;
  color: #958b7b;
  margin: 0 0 20px 0;
  background: #fff;

  div {
    .post-space {
      box-shadow: 1px 1px 2px 1px rgba(159, 156, 156, 0.75);
    }

    .post-icon {
      width: 27px;
    }

    &:first-child {
      display: flex;
      align-items: center;
      padding: 4px 16px;
      text-align: left;
      justify-content: "space-between" img {
        width: 48px;
        margin-right: 8px;
        border-radius: 50%;
      }
    }

    &:nth-child(2) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      padding-bottom: 4px;
    }
  }
`;

const Article = styled(CommonCard)`
  padding: 0;
  margin: 0 0 8px;
  overflow: visible;
`;

const SharedActor = styled.div`
  padding-right: 40px;
  flex-wrap: nowrap;
  padding: 12px 16px 0;
  margin-bottom: 8px;
  align-items: center;
  display: flex;

  a {
    margin-right: 12px;
    flex-grow: 1;
    overflow: hidden;
    display: flex;
    text-decoration: none;

    img {
      width: 48px;
      height: 48px;
    }

    & > div {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      flex-basis: 0;
      margin-left: 8px;
      overflow: hidden;

      span {
        text-align: left;

        &:first-child {
          font-size: 14px;
          font-weight: 700;
          color: rgba(0, 0, 0, 1);
        }

        &:nth-child(n + 1) {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.6);
        }
      }
    }
  }

  button {
    position: absolute;
    right: 12px;
    outline: none;
    border: none;
    top: 0;
    background: transparent;
  }
`;

const Description = styled.div`
  padding: 0 16px;
  overflow: hidden;
  color: rgba(0, 0, 0, 0.9);
  font-size: 14px;
  text-align: left;
`;

const SharedImage = styled.div`
  margin-top: 8px;
  width: 100%;
  max-height: 250px;
  display: block;
  position: relative;
  background-color: #f9fafb;

  img {
    object-fit: fill;
    width: 100%;
    height: 100%;
  }
`;

const SocialCounts = styled.ul`
  line-height: 100%;
  display: flex;
  align-items: flex-start;
  overflow: auto;
  list-style: none;
  margin: 0 16px;
  padding: 8px 0;
  border-bottom: 1px solid #e9e5df;

  li {
    margin-right: 5px;
    font-size: 12px;

    button {
      display: flex;
      border: none;
      background: #fff;
    }
  }

  img {
    width: 18px;
  }
`;

const SocialActions = styled.div`
  align-items: center;
  display: flex;
  justify-content: flex-start;
  margin: 0;
  min-height: 40px;
  padding: 4px 8px;

  button {
    display: inline-flex;
    align-items: center;
    padding: 8px;
    color: #6200ee;
    border: none;
    cursor: pointer;
    background-color: #fff;

    @media (min-width: 768px) {
      span {
        margin-left: 8px;
      }
    }
  }
  p {
    color: #6200ee;
    margin: 0 10px 0 10px;
  }
`;

const Content = styled.div`
  text-align: center;
  & > img {
    width: 30px;
  }
`;

const mapStateToProps = (state) => {
  return {
    loading: state.UI.loading,
    user: state.user,
    communityPosts: state.data.communityPosts,
    currentCommunityId: state.data.currentCommunityId,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getAllPostOfACommunity: (communityId) =>
    dispatch(getPostsOfCommunity(communityId)),
  getCommentOfAPost: (postId) => dispatch(getPostDetails(postId)),
  updateTabIndex: () => dispatch(updateTabIndex(3)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommunityHome);
