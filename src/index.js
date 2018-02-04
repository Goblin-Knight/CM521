import React from 'react';
import ReactDOM from 'react-dom';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


function Header() {
  return <header>
    <div>
      <img id="logo" src="https://rawgit.com/gamestdio/colyseus/master/media/header.png" alt="colyseus" />
      <div id="title" >Goblin-Anonymous-Chatroom</div>      
    </div>
  </header>
}

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      currentText: ""
    }
  }

  onInputChange(e) {
    e.preventDefault()
    this.setState({ currentText: e.target.value })
  }

  onSubmit(e) {
    e.preventDefault()
    this.props.chatRoom.send({ message: this.state.currentText })
    this.setState({ currentText: "" })
  }

  render() {
    return <footer> 
      <form id="form" onSubmit={this.onSubmit.bind(this)}>
        <div className="row">
          <TextField
            hintText="Please Input your Message!!!"
          />
          <input id="input" type="text" onChange={this.onInputChange.bind(this)} value={this.state.currentText}
            value={this.state.currentText} />          
          <button type="submit" className="noselect">send</button>
        </div>
      </form>
    </footer>
  }
}

class App extends React.Component {

  constructor() {
    super();

    // use current hostname/port as colyseus server endpoint
    var endpoint = "wss://colyseus-example.herokuapp.com";

    // development server
    //if (location.port && location.port !== "80") { endpoint += ":2657" }

    this.colyseus = new Colyseus.Client(endpoint);
    this.chatRoom = this.colyseus.join('basic');
    this.chatRoom.onJoin.add(function () {
      console.log("joined");
    });

    this.chatRoom.onUpdate.addOnce(function (state) {
      console.log("initial room data:", state);
    });

    // listen to patches coming from the server
    this.chatRoom.listen("messages/:number", this.onUpdateRemote.bind(this));

    this.chatRoom.listen(function (change) {
      console.log("patch:", change.path, change.operation, change.value)
    });

    this.state = {
      messages: []
    };
  }

  onUpdateRemote(change) {
    console.log("change: ", change)
    this.setState({ messages: [...this.state.messages, change.value] }, this.autoScroll.bind(this));
  }

  autoScroll() {
    var domMessages = ReactDOM.findDOMNode(this.refs.messages)
    domMessages.scrollTop = domMessages.scrollHeight
  }

  render() {
    return <MuiThemeProvider>          
      <div className="row">
        <div className="small-12 columns">
          <AppBar
            title="Goblin-Anonymous-Chatroom"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
          />
          
          <div id="messages" ref="messages">
            {this.state.messages.map((message, i) => {
              return <div key={i}>
                <div>{message.sid}</div>
                <div>{message.msg}</div>
                <div>{message.t}</div>
              </div>
            })}
          </div>
          <p className="loading">Loading...</p>
          <Footer chatRoom={this.chatRoom}></Footer>
        </div>
      </div>
    </MuiThemeProvider>
  }
}

ReactDOM.render(<App />, document.getElementById("app"));

document.ontouchstart = function () { };

/*
const App = () => (
  <MuiThemeProvider>    
    <TextField
      hintText="Please Input your Message!!!"
    />
  </MuiThemeProvider>
);

render(<App />, document.querySelector("#app"));
*/
