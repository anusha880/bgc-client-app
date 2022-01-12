import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import Avatar from "@material-ui/core/Avatar";
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import {getAllMemberData, addMemberToNetwork } from '../../redux/actions/dataActions';
import { editUserDetails } from '../../redux/actions/userActions';
import ModelWindow from "./ModelWindow";
import Pagination from '@mui/material/Pagination'
import { Dialog, DialogContent, DialogTitle,DialogActions } from "@material-ui/core";
import { updateTabIndex, setActiveHeader } from "../../redux/actions/userActions";



  

const MyNetworks = ({ user: { userInfo : { myNetworks, setCurrentMyNetworkId } },members,getMemberData ,setActiveHeader }) => {
  const [openModel, setOpenModel] = useState(false);
  const history= useHistory();
  useEffect(() => {
    getMemberData();
}, [])
const [pageNumber, setPageNumber] = useState(1);
const limit=18;
const [pagesPerPage]= React.useState(Math.ceil(myNetworks.length/limit));

  const myNetworkClickHandler = (email) => {
    const memberId=members.filter((x)=>x.email=== email).map((y)=>y.memberId)
    setActiveHeader(false);
    history.push(`/userProfile/${memberId}`);

    setOpenModel(!openModel);
    
  }
  
  const handleMyNetwork=()=>{
    if(myNetworks.length>0){
    setOpenModel(!openModel);
  }
  else{


    history.push("/directory");
  }

   
  }
  const handleChangePage = (e, value) => {
    setPageNumber(value);
    
  };

  
  let filteredList = [];
  if(myNetworks && Array.isArray(myNetworks) && myNetworks.length > 0) {
    filteredList = myNetworks.slice(0,4);
  }
    return (
        <div className="MyNetworks">
        <div className="MyNetworks__heading">
          <div className="MyNetworks__header">
            <p>My Network</p>
          </div>

         { filteredList && Array.isArray(filteredList) && filteredList.length > 0 && (
            <div className="MyNetworks__header__right">
            <span>{myNetworks.length } Connections</span>
          </div>
         ) }
        </div>
        <div className="MyNetworks__body">
          {
            filteredList && Array.isArray(filteredList) && filteredList.length > 0 ?  filteredList.map((item) => (
              <div className="MyNetworks__body_item" onClick={()=> myNetworkClickHandler(item.email)}>
              <Avatar
                alt="Remy Sharp"
                className="MyNetworks__body_item__image"
                src={item.imageUrl}
                />
              <p className="linkProfile" onClick={()=> myNetworkClickHandler(item.email)}>
                {item.firstName}
                </p>
              
             
        </div>
            )) : (
              <p>You have not added any connections.</p>
            )
          }
        </div>
        <div className="MyNetworks__body__footer">
        <Typography
          variant="h6"
          component={Link}
          color="primary"
          className="recommended__communityBox_community_join_button"
          onClick={handleMyNetwork}
        >
        {myNetworks && Array.isArray(myNetworks) && myNetworks.length > 0 ? 'VIEW ALL' : 'View Alumnae Directory'} 
        
        </Typography>
       
        
        <Dialog  open={openModel}
          onClose={() => setOpenModel(false)}
          fullWidth
          maxWidth="md"          
          >
            
           
           <DialogTitle><span className="myn" >My Network </span>
             
            <span className="mynCon">{myNetworks.length } Connections</span>
          </DialogTitle>

       <DialogContent>
       <div className="mySplit">
       {myNetworks.slice((pageNumber-1)*limit,limit*pageNumber).map((item)=>(
          
              <div className="myNetworks__social__form_names">
              
       <div className="MyCommunity__body_item" onClick={()=> myNetworkClickHandler(item.email)}>
       <Avatar
                alt="Remy Sharp"
                className="myNetwork__dailogue_img"
                src={item.imageUrl}
              />
              
            <div className="mynModal">
       <div className="myNetworks__item_description_title" onClick={()=> myNetworkClickHandler(item.email)}>{item.firstName} {item.lastName} </div>
       <div className="myNetworks__item_description">
       {item.headLine}

         </div>
      
       </div>
       </div>
       </div>
       
       ))
       
        }
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

          // onChangeRowsPerPage={handleChangeRowsPerPage}
        />

            <Button onClick={()=>setOpenModel(!openModel)} color="primary">
              Cancel
            </Button>
            
          </DialogActions>
        </Dialog>
        
      </div>
      
      </div>);
}

MyNetworks.propTypes = {

}

const mapStateToProps = (state) => ({
    user :state.user,
    members: state.data.members,
   });
   const mapDispatchToProps = (dispatch) => ({
     editUserDetails,
   getMemberData: () => dispatch(getAllMemberData()),
   updateTabIndex: (tabIndex) => dispatch(updateTabIndex(tabIndex)),
   setActiveHeader: (value) => dispatch(setActiveHeader(value)),
  });
   export default connect(mapStateToProps, mapDispatchToProps) (MyNetworks);

