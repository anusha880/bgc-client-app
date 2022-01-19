import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  orderBy,
  updateDoc,
  setDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import Fuse from "fuse.js";

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  getStorage,
} from "firebase/storage";

import { db, storage } from "../firebase";
import { checkInterestMatch } from "../util/validators";

const getAllRecommenededCommunities = async (user) => {
  try {
    let communityData = [];
    const { profileInfo, email } = user;
    const communityCollection = [];
    const usersInterests = profileInfo.filter(
      (item) => item.type === "interests"
    );
    const interests = [...usersInterests[0].details[0].interestFields];
    const chapter = usersInterests[0].details[0].chapter;
    const querySnapshot = await getDocs(collection(db, "community"));
    querySnapshot.forEach((item) => {
      if (
        item.data().members &&
        !item.data().members.filter((item) => item.email === email).length > 0
      ) {
        communityCollection.push({
          communityId: item.id,
          name: item.data().name,
          description: item.data().description,
          members: item.data().members,
          image: item.data().imageUrl,
          tags: item.data().tags,
          createdMember: item.data().createdMember,
        });
      }
    });
    interests.forEach((interest) => {
      const community = filterRecommendedCommunity(
        interest,
        communityCollection
      );
      if (
        community &&
        communityData.length < 3 &&
        communityData.filter(
          (item) => item.communityId === community.communityId
        ).length === 0
      ) {
        communityData.push(community);
      }
    });
    const community = filterRecommendedCommunity(chapter, communityCollection);
    if (
      community &&
      communityData.length < 3 &&
      communityData.filter((item) => item.communityId === community.communityId)
        .length === 0
    ) {
      communityData.push(community);
    }
    return communityData;
  } catch (error) {
    console.log("error", error);
  }
};

const filterRecommendedCommunity = (interest, communityCollection) => {
  const fuse = new Fuse(communityCollection, {
    keys: ["name", "tags"],
    includeScore: true,
  });
  const result = fuse.search(interest);
  const finalResult = [];
  if (result.length) {
    return result[0].item;
  }
};

const getAllUserMemberCommunityPost = async (user) => {
  let communityData = [];
  let usersPost = [];
  const { email } = user;
  const communityRef = collection(db, "community");
  var postRef = collection(db, "posts");
  const q = query(communityRef, orderBy("createdAt", "desc"));
  const firebaseStorage = getStorage();
  const querySnapshot = await getDocs(q);
  let selectedCommunityIds = [];
  querySnapshot.forEach((doc) => {
    if (
      doc.data().members &&
      doc.data().members.filter((item) => item.email === email).length > 0
    ) {
      communityData.push({ ...doc.data(), communityId: doc.id, posts: [] });
      selectedCommunityIds.push(doc.id);
    }
  });
  if (selectedCommunityIds.length > 0) {
    const q = query(
      postRef,
      where("communityId", "in", selectedCommunityIds),
      //  where("status", "==", "active"),
      orderBy("createdAt", "desc")
    );

    // const q1 = query(
    //   q,
    //  //where("status", "in", "active")
    // );
    const postsSnapshot = await getDocs(q);
    postsSnapshot.forEach((item) => {
      const index = communityData.findIndex(
        (dataItem) => dataItem.communityId === item.data().communityId
      );
      if (index >= 0) {
        var fileName = "";
        if (item.data().sharedDocumentURL) {
          const httpsReference = ref(
            firebaseStorage,
            item.data().sharedDocumentURL
          );
          fileName = httpsReference.name;
        }
        if (item.data().status && item.data().status !== "inactive") {
          usersPost.push({
            body: item.data().body,
            createdAt: item.data().createdAt,
            userHandle: item.data().userHandle,
            userImage: item.data().userImage,
            userName: item.data().userName,
            sharedImg: item.data().sharedImg,
            sharedVideo: item.data().sharedVideo,
            likeCount: item.data().likeCount,
            commentCount: item.data().commentCount,
            status: item.data().status,
            sharedDocumentURL: item.data().sharedDocumentURL,
            sharedDocumentName: fileName,
            docType: item.data().docType,
            postId: item.id,
            communityId: item.data().communityId,
            communityName: communityData[index].name,
            usersLiked: item.data().usersLiked,
          });
        }
      }
    });
  }
  return usersPost;
};
const myCommunity = async (user) => {
  let communties = [];
  const { email } = user;
  const communityRef = collection(db, "community");
  const q = query(communityRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    if (
      doc.data().members &&
      doc.data().members.filter((item) => item.email === email).length > 0
    ) {
      communties.push({
        communityId: doc.id,
        name: doc.data().name,
        description: doc.data().description,
        members: doc.data().members,
        image: doc.data().imageUrl,
        createdMember: doc.data().createdMember,
      });
    }
  });
  return communties;
};

const joinACommunity = async (user, communityId) => {
  const { email, firstName, imageUrl } = user;
  let membersArray = [];
  const docRef = doc(db, "community", communityId);
  const postRef = collection(db, "posts");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    membersArray = [...docSnap.data().members];
    membersArray.push({
      firstName,
      email,
      imageUrl,
    });
    const result = await updateDoc(docRef, { members: [...membersArray] });
    return result;
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
};

const leaveMemberFromCommunity = async (user, communityId) => {
  const { email, firstName, imageUrl } = user;
  let membersArray = [];
  const docRef = doc(db, "community", communityId);
  const postRef = collection(db, "posts");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    membersArray = [...docSnap.data().members];
    const index = membersArray.findIndex((item) => item.email === email);
    membersArray.splice(index, 1);
    const result = await updateDoc(docRef, { members: [...membersArray] });
    return result;
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
};

const getAllCommunityPosts = async (communityId) => {
  let communityData = {};
  const docRef = doc(db, "community", communityId);
  const firebaseStorage = getStorage();
  const postRef = collection(db, "posts");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    communityData.community = { ...docSnap.data(), communityId: communityId };
    const q = query(
      postRef,
      where("communityId", "==", communityId),
      // where("status", "==", "active"),
      orderBy("createdAt", "desc")
    );
    const postsSnapshot = await getDocs(q);
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
    console.log("communityData", communityData);
    return communityData;
  }
};
const commentOnAPost = async (newComment) => {
  try {
    const docRef = doc(db, "posts", newComment.postId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const result = await updateDoc(docRef, {
        commentCount: docSnap.data().commentCount + 1,
      });
      const newCommentRef = doc(collection(db, "comments"));
      const results = await setDoc(newCommentRef, newComment);
      return results;
    } else {
      // doc.data() will be undefined in this case
      console.log("No such post!");
    }
  } catch (error) {
    console.log(error);
  }
};

const getAPost = async (postId) => {
  let postData = {};
  const docRef = doc(db, "posts", postId);
  const commentRef = collection(db, "comments");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    postData = docSnap.data();
    postData.postId = docSnap.id;
    const q = query(
      commentRef,
      where("postId", "==", postId),
      orderBy("createdAt", "desc")
    );
    const commentSnapshot = await getDocs(q);
    postData.comments = [];
    commentSnapshot.forEach((doc) => {
      postData.comments.push({
        commentId: doc.id,
        postId: doc.data().postId,
        body: doc.data().body,
        createdAt: doc.data().createdAt,
        userHandle: doc.data().userHandle,
        userName: doc.data().userName,
        responseTo: doc.data().responseTo,
        userImage: doc.data().userImage,
        usersLiked: doc.data().usersLiked,
        likeCount: doc.data().likeCount,
      });
    });
    return postData;
  } else {
    console.log("No such post!");
  }
};

const addNewPost = async (newPost) => {
  const newCommentRef = doc(collection(db, "posts"));
  const results = await setDoc(newCommentRef, newPost);
  return results;
};

const updateEditPost = async (editPost) => {
  const docRef = doc(db, "posts", editPost.postId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const result = await updateDoc(docRef, {
      body: editPost.body,
      docType: editPost.docType,
      sharedDocumentURL: editPost.documentReset
        ? editPost.sharedDocumentURL
        : docSnap.data().sharedDocumentURL,
      sharedVideo: editPost.sharedVideo,
    });
    return result;
  } else {
    console.log("No such post!");
  }
};

const deletePost = async (deletePost) => {
  try {
    const docRef = doc(db, "posts", deletePost.postId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const result = await deleteDoc(docRef);
      return result;
    } else {
      console.log("No such post!");
    }
  } catch (error) {
    console.log(error);
  }
};

const addPostWithImageUpload = async (payload) => {
  if (payload.sharedImage != "") {
    try {
      const storageRef = ref(storage, `images/${payload.sharedImage.name}`);
      const uploadTask = uploadBytesResumable(storageRef, payload.sharedImage);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.log("error", error);
        },
        async () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
          });
        }
      );
    } catch (error) {
      console.log("error", error);
    }
  }
  // const downloadURL = await upload.snapshot.ref.getDownloadURL();
  // return downloadURL;
};

const likeAPost = async (payload) => {
  const docRef = doc(db, "posts", payload.postId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    let usersArray = [...docSnap.data().usersLiked];
    usersArray.push(payload.email);
    const result = await updateDoc(docRef, {
      likeCount: docSnap.data().likeCount + 1,
      usersLiked: [...usersArray],
    });
    return result;
  } else {
    console.log("No such post!");
  }
};

const likeAComment = async (payload) => {
  const docRef = doc(db, "comments", payload.commentId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const { usersLiked = [], likeCount = 0 } = docSnap.data();
    let usersArray = [...usersLiked, payload.email];
    const result = await updateDoc(docRef, {
      likeCount: likeCount + 1,
      usersLiked: usersArray,
    });
    return result;
  } else {
    console.log("No such comment!");
  }
};

const dislikeAComment = async (payload) => {
  try {
    const docRef = doc(db, "comments", payload.commentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { usersLiked = [], likeCount } = docSnap.data();
      const usersArray = usersLiked.filter(
        (userEmail) => userEmail !== payload.email
      );
      const result = await updateDoc(docRef, {
        likeCount: likeCount - 1,
        usersLiked: usersArray,
      });
      return result;
    } else {
      console.log("No such comment!");
    }
  } catch (error) {
    console.log(error);
  }
};

const addAReportToPost = async (postId, currentReport) => {
  const docRef = doc(db, "posts", postId);
  const docSnap = await getDoc(docRef);
  const reports = docSnap.data().reports;
  const statusValue = "active";
  let filterReports = null;
  if (reports) {
    const existingUserReports = reports.filter(
      (report) => report.userId === currentReport.userId
    );
    filterReports =
      existingUserReports.length > 0 ? null : [...reports, currentReport];
  } else {
    filterReports = [currentReport];
  }

  if (!filterReports) {
    console.log("Post Exist for User !");
    return;
  }

  // if(reports.length>=10)
  // {
  //   statusValue= 'inactive'

  // }
  if (docSnap.exists()) {
    //usersArray.push(payload.email);
    const result = await updateDoc(docRef, {
      reports: filterReports,
      status: docSnap.data().status || "active",
      isReportPresent: true,
    });
    return result;
  } else {
    console.log("No such post!");
  }
};

const disLikeAPost = async (payload) => {
  try {
    const docRef = doc(db, "posts", payload.postId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let usersArray = [...docSnap.data().usersLiked];
      const index = usersArray.findIndex((item) => item === payload.email);
      usersArray.splice(index, 1);
      const result = await updateDoc(docRef, {
        likeCount: docSnap.data().likeCount - 1,
        usersLiked: [...usersArray],
      });
      return result;
    } else {
      console.log("No such post!");
    }
  } catch (error) {
    console.log(error);
  }
};
const getAllMembers = async (user) => {
  try {
    let users = [];
    const { email } = user;
    const userRef = collection(db, "users");
    const q = query(userRef, orderBy("firstName", "asc"));
    const usersSnapshot = await getDocs(q);
    usersSnapshot.forEach((doc) => {
      if (doc.data().email !== email) {
        users.push({
          memberId: doc.data().userId,
          name: [doc.data().firstName, doc.data().lastName].join(" "),
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          email: doc.data().email,
          createdAt: doc.data().createdAt,
          imageUrl: doc.data().imageUrl,
          headLine: doc.data().headLine,
          lastLogin: doc.data().lastLogin,
          status: doc.data().status,
          userRole: doc.data().userRole,
        });
      }
    });
    const members = users.filter(({ userRole = "" }) => userRole === "member");
    return members;
  } catch (error) {
    console.log(error);
  }
};

export const getAllAdmins = async (user) => {
  try {
    let users = [];
    const { email } = user;
    const userRef = collection(db, "users");
    const q = query(userRef, orderBy("firstName", "asc"));
    const usersSnapshot = await getDocs(q);
    usersSnapshot.forEach((doc) => {
      if (doc.data().email !== email) {
        users.push({
          memberId: doc.data().userId,
          name: [doc.data().firstName, doc.data().lastName].join(" "),
          email: doc.data().email,
          createdAt: doc.data().createdAt,
          lastLogin: doc.data().lastLogin,
          status: doc.data().status,
          userRole: doc.data().userRole,
        });
      }
    });
    return users.filter(
      ({ userRole = "" }) =>
        userRole === "admin" || userRole === "admin-pending"
    );
  } catch (error) {
    console.log(error);
  }
};

export const handleActivateDeactivateProfile = async (selectedUser) => {
  const { email, status } = selectedUser;
  const newStatus = status === "active" ? "inactive" : "active";
  const docRef = doc(db, "users", email);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const updateData = {
      status: newStatus,
    };
    await updateDoc(docRef, updateData);
    return { ...docSnap.data(), ...updateData };
  }
};

export const inviteAdmin = async (email) => {
  try {
    const docRef = doc(db, "users", email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().userRole === "admin") {
      // handle admin user
      throw Error("Someone is already using that email address");
    }

    const results = await addDoc(collection(db, "mail"), {
      to: email,
      message: {
        subject: "Invite new Admin",
        html: `
        <div>
        Hello!, please click <a target="_blank" href="https://bgc-functions.firebaseapp.com/login"> here </a>
        to register as an admin.
        </div>
        `,
      },
    });
  } catch (err) {
    throw err;
  }
};

const addMemberToMyNetwork = async (user, newMember) => {
  try {
    var { email, firstName, lastName, imageUrl, headLine } = newMember;
    headLine = headLine ? headLine : "";

    const docRef = doc(db, "users", user.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let myNetwork = [...docSnap.data().myNetworks];
      const existingMember = myNetwork.filter((item) => item.email === email);
      if (existingMember && existingMember.length === 0) {
        myNetwork.push({
          firstName,
          lastName,
          email,
          imageUrl,
          headLine,
        });
        const result = await updateDoc(docRef, { myNetworks: [...myNetwork] });
        return result;
      }
    }
  } catch (error) {
    console.log("error", error);
  }
};

const removeMemberToMyNetwork = async (user, existEmail) => {
  try {
    const docRef = doc(db, "users", user.email);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let myNetwork = [...docSnap.data().myNetworks];
      const index = myNetwork.findIndex((item) => item.email === existEmail);
      myNetwork.splice(index, 1);
      const result = await updateDoc(docRef, { myNetworks: [...myNetwork] });
      return result;
    }
  } catch (error) {
    console.log("error", error);
  }
};

const getUserProfileInfo = async (email) => {
  const docRef = doc(db, "users", email);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
};

const updateUserDetails = async (userDetails) => {
  try {
    const { email } = userDetails;
    const docRef = doc(db, "users", email);
    const result = await updateDoc(docRef, { ...userDetails });
    return result;
  } catch (error) {
    console.log("error", error);
  }
};
const getAllCommunities = async (user) => {
  let communties = [];
  const { email } = user;
  const communityRef = collection(db, "community");
  const q = query(communityRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    communties.push({
      communityId: doc.id,
      name: doc.data().name,
      description: doc.data().description,
      members: doc.data().members,
      image: doc.data().imageUrl,
      createdMember: doc.data().createdMember,
      createdUsername: doc.data().createdUsername,
      createdAt: doc.data().createdAt,
      lastPostAt: doc.data().lastPostAt,
      status: doc.data().status
    });
  });
  return communties;
};

const addNewCommunity = async (newCommunity) => {
  try {
    const results = await addDoc(collection(db, "community"), {
      ...newCommunity,
    });
    console.log(results.id);
    return results.id;
  } catch (error) {
    console.log("error", error);
  }
};

const updateCommunityImage = async (currentCommunityId, imageUrl) => {
  try {
    const docRef = doc(db, "community", currentCommunityId);
    const result = await updateDoc(docRef, { imageUrl });
    return result;
  } catch (error) {
    console.log("error", error);
  }
};

const getMemberDetails = async (email) => {
  const docRef = doc(db, "users", email);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
  }
};

export {
  getAllRecommenededCommunities,
  getAllUserMemberCommunityPost,
  myCommunity,
  joinACommunity,
  leaveMemberFromCommunity,
  getAllCommunityPosts,
  commentOnAPost,
  getAPost,
  addNewPost,
  updateEditPost,
  deletePost,
  addPostWithImageUpload,
  likeAPost,
  likeAComment,
  dislikeAComment,
  disLikeAPost,
  addAReportToPost,
  getAllMembers,
  addMemberToMyNetwork,
  removeMemberToMyNetwork,
  getUserProfileInfo,
  updateUserDetails,
  getAllCommunities,
  addNewCommunity,
  updateCommunityImage,
  getMemberDetails,
};
