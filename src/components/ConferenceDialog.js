import * as React from 'react';
import { connect } from 'react-redux';
import { Actions, withTheme, Icon } from '@twilio/flex-ui';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import TextField from '@material-ui/core/TextField';
import ConferenceService from '../services/ConferenceService';

class ConferenceDialog extends React.Component {
  state = {
    conferenceTo: "",
    contacts: [],
  };

  closeDialog = () => {
    Actions.invokeAction("SetComponentState", {
      name: "ConferenceDialog",
      state: { isOpen: false },
    });
  };

  handleKeyPress = (e) => {
    const key = e.key;

    if (key === "Enter") {
      this.addConferenceParticipant();
      this.closeDialog();
    }
  };

  handleChange = (e) => {
    const value = e.target.value;
    this.setState({ conferenceTo: value });
  };

  handleDialButton = () => {
    this.addConferenceParticipant();
    this.closeDialog();
  };

  handleListItemClick = (pn) => {
    this.setState({ conferenceTo: pn }, () => {
      this.initiateCall();
    });
  };

  initiateCall = () => {
    this.addConferenceParticipant();
    this.closeDialog();
  };

  async componentDidMount() {
    try {
      const response = await fetch(
        `https://[your-service-url]/get-contacts`
      );
      const json = await response.json();
      console.log('JSOOONS', json)
      this.setState({ contacts: JSON.parse(json) });
    } catch (error) {
      console.log(error);
    }
  }

  handleClose = () => {
    this.closeDialog();
  };

  addConferenceParticipant = async () => {
    const to = this.state.conferenceTo;
    const {
      from,
      task,
      task: { taskSid },
    } = this.props;
    const conference = task && (task.conference || {});
    const { conferenceSid } = conference;

    // Adding entered number to the conference
    console.log(`Adding ${to} to conference`);
    let participantCallSid;
    try {
      participantCallSid = await ConferenceService.addParticipant(
        taskSid,
        from,
        to
      );
      ConferenceService.addConnectingParticipant(
        conferenceSid,
        participantCallSid,
        "unknown"
      );
    } catch (error) {
      console.error("Error adding conference participant:", error);
    }
    this.setState({ conferenceTo: "" });
  };

  formatPhoneNumber(phoneNumberString) {
    if (phoneNumberString.length === 10) {
      const cleaned = `${phoneNumberString}`.replace(/\D/g, "");
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    }

    return phoneNumberString;
  }

  render() {

    let contactList;
    if (this.state.contacts.length > 0) {
      contactList = this.state.contacts.map(pn => {
        return (
          <List>
            <ListItem
              button
              onClick={() => this.handleListItemClick(pn.phone)}
              key={pn.phone}
            >
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={pn.name}
                secondary={this.formatPhoneNumber(pn.phone)}
              />
            </ListItem>
          </List>
        );
      });
    } else {
      contactList = <p>No contacts found</p>;
    }

    return (
      <Dialog open={this.props.isOpen} onClose={this.handleClose}>
        <DialogTitle id="confirmation-dialog-title">
          External Transfer
        </DialogTitle>
        <DialogContent
          dividers
          style={{ overflowY: "visible", borderBottom: "1px solid #bbb" }}
        >
          <DialogContentText>Dialer</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="conferenceNumber"
            label="Phone Number"
            fullWidth
            variant="outlined"
            placeholder="17181234567"
            value={this.state.conferenceTo}
            onKeyPress={this.handleKeyPress}
            onChange={this.handleChange}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={this.handleDialButton}
          >
            <Icon icon="Call" />
            Call
          </Button>
        </DialogContent>
        <DialogContent style={{ borderBottom: "1px solid #bbb" }}>
          <DialogContentText>Directory</DialogContentText>
          {contactList}
        </DialogContent>
        <DialogActions style={{ bordeTop: "1px solid #bbb" }}>
          <Button onClick={this.closeDialog} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = state => {
  const componentViewStates = state.flex.view.componentViewStates;
  const conferenceDialogState = componentViewStates && componentViewStates.ConferenceDialog;
  const isOpen = conferenceDialogState && conferenceDialogState.isOpen;
  return {
    isOpen
  };
};

export default connect(mapStateToProps)(withTheme(ConferenceDialog));
