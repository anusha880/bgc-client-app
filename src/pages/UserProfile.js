import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import GridItem from '../components/Grid/GridItem';
import GridContainer from '../components/Grid/GridContainer'
import Card from '../components/Card/Card';
import CardHeader from '../components/Card/CardHeader.js';
import CardBody from '../components/Card/CardBody';
import CardFooter from '../components/Card/CardFooter';
import withStyles from '@material-ui/core/styles/withStyles';
import Profile from '../components/profile/Profile';

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
  },
};

const StyledAppBar = withStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
  label: {
    textTransform: 'capitalize',
  },
})(CardHeader);

const UserProfile = (props) => {
    const {classes } = props;
  return (
    <div>
       
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Edit User Profile</h4>
            </CardHeader>
            <CardBody><Profile /></CardBody>
            <CardFooter></CardFooter>
          </Card>
        </GridItem>
        {/* <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={(e) => e.preventDefault()}>
                <img src={avatar} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h6 className={classes.cardCategory}>CEO / CO-FOUNDER</h6>
              <h4 className={classes.cardTitle}>Alec Thompson</h4>
              <p className={classes.description}>
                Don{"'"}t be scared of the truth because we need to restart the
                human foundation in truth And I love you like Kanye loves Kanye
                I love Rick Owens’ bed design but the back is...
              </p>
              <Button color="primary" round>
                Follow
              </Button>
            </CardBody>
          </Card>
        </GridItem> */}
      </GridContainer>
    </div>
  );
}

export default (withStyles(styles) (UserProfile));
