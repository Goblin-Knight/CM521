import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import TextField from "material-ui/TextField";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import Icon from "material-ui/Icon";

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: "0px",
    width: "100%"
  },
  grid: {},
  paper: {
    padding: theme.spacing.unit * 0.8
  },
  form: {
    border: "3px solid #666",
    borderRadius: "8px",
    padding: "5px 0px 10px 0px"
  },
  button: {
    margin: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
});

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      currentText: ""
    };
  }

  onInputChange(e) {
    e.preventDefault();
    this.setState({ currentText: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();
    this.props.chatRoom.send({ message: this.state.currentText });
    this.setState({ currentText: "" });
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.paper}>
        <form
          id="form"
          onSubmit={this.onSubmit.bind(this)}
          className={classes.form}
        >
          <Grid
            spacing={0}
            container
            className={classes.grid}
            alignItems="flex-end"
            direction="row"
          >
            <Grid item xs>
              <TextField
                label="請輸入你的訊息!"
                multiline
                rowsMax="10"
                value={this.state.currentText}
                className={classes.textField}
                onChange={this.onInputChange.bind(this)}
              />
            </Grid>
            <Grid item>
              <Button
                type="submit"
                className={classes.button}
                variant="raised"
                color="primary"
              >
                傳送
                <Icon className={classes.rightIcon}>send</Icon>
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    );
  }
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Footer);
