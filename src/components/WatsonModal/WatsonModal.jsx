import React, { Component, PropTypes } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import GhostButton from '../GhostButton';
import Socket from 'socket.io-client'

// Socket.io socket to communicate with backend
const socket = Socket();

export default class WatsonModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      query: "",
      response: ""
    };
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleQueryChange(event) {
    this.setState({
      query: event.target.value
    });
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.submitQuery()
    }
  }

  submitQuery() {
    const query = this.state.query;
    if (query) {
      this.askWatson(query);
    }
  }

  askWatson(query) {
    socket.emit('reqWatson', query);
    socket.on('resWatson', (response) => {
      this.setState({
        response: response,
        query: ""
      });
    })
  }

  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={true}
        onClick={this.handleClose.bind(this)}
      />,
      <FlatButton
        label="Ask"
        primary={true}
        onClick={this.submitQuery.bind(this)}
      />,
    ];

    return (
      <div>
        <GhostButton
          label="Ask Watson"
          primary={false}
          id="viewInActionButton"
          onTouchTap={this.handleOpen.bind(this)}
        />
        <Dialog
          title="Ask Watson A Question"
          actions={actions}
          modal={true}
          open={this.state.open}
        >
        <TextField
          ref="queryText"
          onChange={this.handleQueryChange.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
          value={this.state.query}
          hintText="i.e. What is the shipment status of my fleet?"
          fullWidth={true}
        />
        <br />
        <p>
          {this.state.response}
        </p>
        </Dialog>
      </div>
    );
  }
}
