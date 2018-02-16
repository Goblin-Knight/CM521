import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { CircularProgress } from "material-ui/Progress";
import { withStyles } from "material-ui/styles";
import Drawer from "material-ui/Drawer";
//https://material-ui-1dab0.firebaseapp.com/demos/drawers/
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import Hidden from "material-ui/Hidden";
import MenuIcon from "material-ui-icons/Menu";
import CachedIcon from "material-ui-icons/Cached";
import Grid from "material-ui/Grid";
import ListSubheader from "material-ui/List/ListSubheader";
import List, { ListItem, ListItemText } from "material-ui/List";
import moment from "moment/min/moment-with-locales";
import Moment from "react-moment";
import ResizeAware from "react-resize-aware";
import * as Colyseus from "colyseus.js";
import Footer from "./footer";

moment.locale("zh-tw");

// Sets the moment instance to use.
Moment.globalMoment = moment;

// Set the locale for every react-moment instance to French.
Moment.globalLocale = "zh-tw";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    width: "100%",
    height: "100%",
    marginTop: theme.spacing.unit * 0,
    zIndex: 1,
    overflow: "hidden"
  },
  appFrame: {
    position: "relative",
    display: "flex",
    width: "100%",
    height: "100%"
  },
  flex: {
    flex: 1
  },
  appBar: {
    position: "absolute",
    marginLeft: drawerWidth,
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  navIconHide: {
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  drawerHeader: theme.mixins.toolbar,
  drawerPaper: {
    width: 250,
    height: "100vh",
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      position: "relative"
    }
  },
  content: {
    backgroundColor: theme.palette.background.default,
    width: "100%",
    padding: theme.spacing.unit * 0,
    height: "calc(100vh - 56px)",
    marginTop: 56,
    [theme.breakpoints.up("sm")]: {
      height: "calc(100vh - 64px)",
      marginTop: 64
    },
    [theme.breakpoints.up("md")]: {
      width: `calc(100vw - ${drawerWidth}px)`
    }
  },
  grid: {
    height: "100%"
  },
  footer: {
    height: "auto",
    minHeight: "85px"
  },
  msglist: {
    width: "100%",
    //backgroundColor: theme.palette.background.paper,
    backgroundColor: "#eee",
    position: "relative",
    overflow: "auto"
    //maxHeight: 300
  },
  listSection: {
    backgroundColor: "inherit",
    padding: 0,
    margin: 0
  },
  ul: {
    backgroundColor: "inherit",
    paddingTop: "8px",
    paddingBottom: "5px",
    paddingLeft: 0
  },
  selfUl: {
    paddingLeft: "30px"
  },
  listSubheader: {
    backgroundColor: "#eee",
    paddingLeft: 0,
    paddingTop: "5px",
    paddingBottom: "5px",
    lineHeight: "18px",
    fontSize: "16px"
  },
  listItem: {
    borderColor: "#888",
    borderRadius: 10,
    backgroundColor: "#fafafa",
    padding: "8px"
  },
  selfListItem: {
    //backgroundColor: "#3399ff"
    backgroundColor: "#3f51b5",
    color: "#fff"
  },
  listItemText: {
    wordBreak: "break-all"
  },
  listItemTime: { fontSize: "14px" },
  selfListItemText: {
    color: "#fff"
  }
});

function Header() {
  return (
    <header>
      <div>
        <img
          id="logo"
          src="https://rawgit.com/gamestdio/colyseus/master/media/header.png"
          alt="colyseus"
        />
        <div id="title">Goblin-Anonymous-Chatroom</div>
      </div>
    </header>
  );
}

class App extends React.Component {
  constructor() {
    super();
    
    // use current hostname/port as colyseus server endpoint
    var endpoint = "wss:colyseus-example.herokuapp.com";

    // development server
    //if (location.port && location.port !== "80") { endpoint += ":2657" }

    this.colyseus = new Colyseus.Client(endpoint);
    this.chatRoom = this.colyseus.join("basic");
    this.chatRoom.onJoin.add(() => {
      console.log("joined");
      this.setState({ isLoaded: true });
    });

    this.chatRoom.onUpdate.addOnce(function(state) {
      console.log("initial room data:", state);
    });

    // listen to patches coming from the server
    this.chatRoom.listen("messages/:number", this.onUpdateRemote.bind(this));

    this.chatRoom.listen(function(change) {
      console.log("patch:", change.path, change.operation, change.value);
    });

    this.state = {
      isLoaded: false,
      mobileOpen: false,
      messages: []
    };
/*
    this.state = {
      isLoaded: true,
      mobileOpen: false,
      messages: [
        {
          sid: "AHHHHHHHH",
          msg:
          "HAHAH11111111111111111111111111111 11111111111111111AHAHAHAHAHA 11111111111111111AHAHAHAHAHA",
          t: 1518597875000
        },
        {
          sid: "HHHHHHHHH",
          msg: "HAHAH1111111111111111111111111111111111111111111111AHAHAHAHAHA",
          t: 1518597875000
        },
        { sid: "HHHHHHHHH", msg: "HAHAHAHA", t: 1518597875000 },
        { sid: "HHHHHHHHH", msg: "HAHAHAHA", t: 1518597875000 },
        { sid: "HHHHHHHHH", msg: "HAHAHAHA", t: 1518597875000 }
      ]
    };*/
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  onUpdateRemote(change) {
    console.log("change: ", change);
    this.setState(
      { messages: [...this.state.messages, change.value] },
      this.autoScroll.bind(this)
    );
  }

  autoScroll() {
    var domMessages = ReactDOM.findDOMNode(this.refs.messages);
    domMessages.scrollTop = domMessages.scrollHeight;
  }

  updateDimensions() {
    console.log("updateDimensions");
    var footergrid = ReactDOM.findDOMNode(this.refs.footergrid);
    var messages = ReactDOM.findDOMNode(this.refs.messages);
    var vh = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
    messages.style.maxHeight = vh - footergrid.clientHeight - 70 + "px";
    this.autoScroll();

    //console.log(messages.style.maxHeight);
  }

  componentDidMount() {
    //this.updateDimensions().bind(this);
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  refreshPage() {
    window.location.reload();
  }

  render() {
    const { classes, theme } = this.props;
    const drawer = (
      <div>
        <div className={classes.drawerHeader} />
        <Grid
          spacing={0}
          container
          className={classes.grid}
          alignItems="center"
          justify="flex-start"
          direction="column"
        >
          <img
            src="https://github.com/gamestdio/colyseus/raw/master/media/header.png?raw=true"
            height="70px"
          />
          <Grid item xs>
            <Typography>colyseus.js v0.8.2</Typography>
          </Grid>
          <Grid item xs>
            <Typography>底層技術支援</Typography>
          </Grid>
        </Grid>
      </div>
    );

    if (!this.state.isLoaded) {
      this.screenview = (
        <main className={classes.content}>
          <Grid
            container
            alignItems="center"
            direction="column"
            justify="center"
            className={classes.grid}
          >
            <Grid item>
              <CircularProgress className={classes.progress} size={50} />
            </Grid>
          </Grid>
        </main>
      );
    } else {
      this.screenview = (
        <main className={classes.content}>
          <Grid
            wrap='nowrap'
            spacing={0}
            container
            className={classes.grid}
            alignItems="stretch"
            justify="flex-start"
            direction="column"
          >
            <Grid item xs>
              <List
                className={classes.msglist}
                subheader={<li />}
                ref="messages"
              >
                {this.state.messages.map((message, i) => (
                  <li key={`section-${i}`} className={classes.listSection}>
                    <ul
                      className={
                        //"AHHHHHHHH" == message.sid
                        this.chatRoom.sessionId == message.sid
                          ? 
                          [classes.ul, classes.selfUl]
                          : [classes.ul]
                      }
                    >
                      <ListSubheader className={classes.listSubheader}>
                        {`使用者:${message.sid} `}
                      </ListSubheader>
                      <ListItem
                        key={`item-${i}`}
                        className={
                          //"AHHHHHHHH" == message.sid
                          this.chatRoom.sessionId == message.sid
                            ? 
                            [classes.selfListItem, classes.listItem]
                            : [classes.listItem]
                        }
                      >
                        <Grid
                          spacing={0}
                          container
                          alignItems="stretch"
                          justify="flex-start"
                          direction="column"
                        >
                          <Grid item>
                            <Typography
                              className={
                                //"AHHHHHHHH" == message.sid
                                this.chatRoom.sessionId == message.sid
                                  ? 
                                  [
                                    classes.selfListItemText,
                                    classes.listItemText
                                  ]
                                  : [classes.listItemText]
                              }
                              dense
                            >
                              {message.msg}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Moment
                              format="YYYY/MM/DD hh:mm:ss Z"
                              unix
                              locale="zh-hk"
                              className={classes.listItemTime}
                            >
                              {message.t / 1000}
                            </Moment>
                          </Grid>
                        </Grid>
                      </ListItem>
                    </ul>
                  </li>
                ))}
              </List>
            </Grid>
            <Grid item className={classes.footer} ref="footergrid">
              <ResizeAware
                style={{ position: "relative" }}
                onlyEvent
                onResize={this.updateDimensions.bind(this)}
              >
                <Footer
                  chatRoom={this.chatRoom}                  
                />
              </ResizeAware>
            </Grid>
          </Grid>
        </main>
      );
    }

    return (
      <div className={classes.root}>
        <div className={classes.appFrame}>
          <AppBar className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerToggle}
                className={classes.navIconHide}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="title"
                color="inherit"
                noWrap
                className={classes.flex}
              >
                哥白尼匿名聊天室
              </Typography>
              <IconButton color="inherit" onClick={this.refreshPage.bind(this)}>
                <CachedIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Hidden mdUp>
            <Drawer
              variant="temporary"
              anchor={theme.direction === "rtl" ? "right" : "left"}
              open={this.state.mobileOpen}
              classes={{
                paper: classes.drawerPaper
              }}
              onClose={this.handleDrawerToggle}
              ModalProps={{
                keepMounted: true // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden smDown implementation="css">
            <Drawer
              variant="permanent"
              open
              classes={{
                paper: classes.drawerPaper
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          {this.screenview}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(App);
