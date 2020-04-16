import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

export default class DirectoryAdmin extends React.Component {

  constructor() {
    super();

    this.state = {
      contacts: [],
      newName: '',
      newPhone: ''
    };

    this.updateName = this.updateName.bind(this);
    this.updatePhone = this.updatePhone.bind(this);
    this.createContact = this.createContact.bind(this);
  }

  async componentDidMount() {
    try {
      const response = await fetch(
        'https://charcoal-toad-5592.twil.io/get-contacts'
      );
      const json = await response.json();
      console.log('JSOOONS', json);
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

    console.log('saved');


    try {
      const response = await fetch(
        `https://charcoal-toad-5592.twil.io/create-contact?name=${this.state.newName}&phone=${this.state.newPhone}`
      );
      const json = await response.json();

      let contacts = this.state.contacts;
      let newEntry = JSON.parse(json).data;
      contacts.push(newEntry);
      console.log('ud contacts', contacts);

      this.setState({
        newName: '',
        newPhone: '',
        contacts: contacts
      });
    } catch (error) {
      console.log(error);
    }
  }

  updateName(e) {
    this.setState({
      newName: e.target.value
    });
  }

  updatePhone(e) {
    this.setState({
      newPhone: e.target.value
    });
  }

  render() {
    let contactList;
    if (this.state.contacts.length > 0) {
      contactList = this.state.contacts.map(pn => {
        return (
          <TableRow key={pn.phone}>
            <TableCell style={{ paddingLeft: 12 }}>{pn.name}</TableCell>
            <TableCell>{pn.phone}</TableCell>
          </TableRow>
        );
      });
    } else {
      contactList = <p>No contacts found</p>;
    }

    const inputStyles = {
      margin: 12
    };

    return (
      <div>
        <Grid spacing={2}>
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
                  label="Phone Number"
                  variant="outlined"
                  style={inputStyles}
                  value={this.state.newPhone}
                  onChange={this.updatePhone}
                />
              </FormControl>
              <Fab
                color="primary"
                type="submit"
                aria-label="Add"
                style={inputStyles}
              >
                <AddIcon />
              </Fab>
            </form>
          </Grid>
          <Grid item xs={12}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Phone Number</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{contactList}</TableBody>
            </Table>
          </Grid>
        </Grid>
      </div>
    );
  }
}
