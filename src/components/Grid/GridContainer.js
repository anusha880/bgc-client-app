import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
  grid: {
    margin: "0 -15px !important",
    width: "unset",
  },
};



const GridContainer = (props) => {
  const {classes } = props;
  const { children, ...rest } = props;
  return (
    <Grid container {...rest} className={classes.grid}>
      {children}
    </Grid>
  );
}

GridContainer.propTypes = {
  children: PropTypes.node,
};
export default (withStyles(styles) (GridContainer));
