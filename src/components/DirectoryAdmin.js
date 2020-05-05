import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import isMobilePhone from 'validator/lib/isMobilePhone';
import ErrorMessage from '@twilio/flex-ui';

export default class DirectoryAdmin extends React.Component {
  constructor() {
    super();

    this.state = {
      contacts: [],
      newName: '',
      newPhone: '',
      invalidPhone: false,
      error: null,
    };

    this.serviceBaseUrl = 'https://[your-service-url].twil.io';
    this.updateName = this.updateName.bind(this);
    this.updatePhone = this.updatePhone.bind(this);
    this.createContact = this.createContact.bind(this);
    this.deleteContact = this.deleteContact.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await fetch(`${this.serviceBaseUrl}/get-contacts`);
      const json = await response.json();
      this.setState({ contacts: JSON.parse(json) });
    } catch (error) {
      console.log(error);
    }
  }

  formatPhoneNumber(phoneNumberString) {
    if (phoneNumberString.length === 10) {
      const cleaned = `${phoneNumberString}`.replace(/\D/g, '');
      const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
      }
    }

    return phoneNumberString;
  }

  async createContact(e) {
    e.preventDefault();

    if (isMobilePhone(this.state.newPhone, 'en-US') === true) {
      console.log(
        'valid contact',
        isMobilePhone(this.state.newPhone, 'en-US'),
        this.state.newPhone
      );
      const name = encodeURIComponent(this.state.newName);
      const phone = encodeURIComponent(this.state.newPhone);

      try {
        const response = await fetch(
          `${this.serviceBaseUrl}/create-contact?name=${name}&phone=${phone}`
        );
        const json = await response.json();

        let contacts = this.state.contacts;
        const newEntry = JSON.parse(json).data;
        contacts.push(newEntry);

        this.setState({
          newName: '',
          newPhone: '',
          contacts: contacts,
        });
      } catch (error) {
        console.log('ERRRR');
        console.log(error);
        this.setState({
          error,
        });
      }
    } else {
      console.log('invalid contact');
      this.setState({
        invalidPhone: true,
      });
    }
  }

  async deleteContact(key) {
    try {
      await fetch(`${this.serviceBaseUrl}/delete-contact?key=${encodeURIComponent(key)}`);

      const contacts = this.state.contacts.filter((el) => {
        if (el.phone !== key) {
          return el;
        }
      });

      this.setState({
        contacts,
      });
    } catch (error) {
      console.log(error);
      this.setState({
        error,
      });
    }
  }

  updateName(e) {
    this.setState({
      newName: e.target.value,
    });
  }

  updatePhone(e) {
    this.setState({
      newPhone: e.target.value,
      invalidPhone: false,
    });
  }

  render() {
    let errorComponent;

    if (this.state.error) {
      errorComponent = (
        <p
          style={{
            marginBottom: 15,
            background: '#fdecea',
            padding: 15,
            borderRadius: 3,
            fontSize: '1.3em',
          }}
        >
          {`${this.state.error}`}
        </p>
      );
    }

    let contactList;
    if (this.state.contacts.length > 0) {
      contactList = this.state.contacts.map((pn) => {
        return (
          <TableRow key={pn.phone}>
            <TableCell style={{ paddingLeft: 12, width: '250px', fontSize: '1.3em' }}>
              {pn.name}
            </TableCell>
            <TableCell style={{ width: '250px', fontSize: '1.3em' }}>
              {this.formatPhoneNumber(pn.phone)}
            </TableCell>
            <TableCell style={{ width: '250px' }}>
              <Button
                value={pn.phone}
                style={{ float: 'right' }}
                onClick={() => this.deleteContact(pn.phone)}
              >
                <DeleteForeverIcon />
              </Button>
            </TableCell>
          </TableRow>
        );
      });
    } else {
      contactList = (
        <p
          style={{
            marginTop: 15,
            background: '#00000033',
            padding: 15,
            borderRadius: 3,
            fontSize: '1.3em',
          }}
        >
          No contacts
        </p>
      );
    }

    const inputStyles = {
      marginTop: 15,
      marginBottom: 15,
      marginRight: 15,
    };

    return (
      <Paper style={{ margin: 15, maxWidth: 750 }} elevation={0}>
        {errorComponent}
        <Grid spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h3">
              Directory
            </Typography>
            <Typography component="p">
              Add external contacts that agents can use for warm transfers.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <form onSubmit={this.createContact}>
              <FormControl>
                <TextField
                  id="name"
                  label="Name"
                  variant="outlined"
                  style={inputStyles}
                  value={this.state.newName}
                  onChange={this.updateName}
                />
              </FormControl>
              <FormControl>
                <TextField
                  id="phone-number"
                  error={this.state.invalidPhone}
                  label="Phone Number"
                  variant="outlined"
                  style={inputStyles}
                  value={this.state.newPhone}
                  onChange={this.updatePhone}
                />
              </FormControl>
              <Fab color="primary" type="submit" aria-label="Add" style={inputStyles}>
                <AddIcon />
              </Fab>
            </form>
          </Grid>
          <Grid item xs={12} style={{ maxHeight: 440 }}>
            <Table stickyheader aria-label="simple table">
              <TableHead style={{ display: 'block' }}>
                <TableRow>
                  <TableCell style={{ paddingLeft: 12, width: '250px' }}>Name</TableCell>
                  <TableCell style={{ paddingLeft: 12, width: '250px' }}>Phone Number</TableCell>
                  <TableCell style={{ paddingLeft: 12, width: '250px' }} />
                </TableRow>
              </TableHead>
              <TableBody style={{ display: 'block', overflowY: 'auto', height: 600 }}>
                {contactList}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}
