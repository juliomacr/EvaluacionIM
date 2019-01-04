import React, { Component } from 'react';
import { compose } from 'recompose';

import { withAuthorization, withEmailVerification } from '../Session';
import { withFirebase } from '../Firebase';
import Messages from '../Messages';

import Form from '../FormNew/';



class CreatePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: null,
    };
  }

  componentDidMount() {
    this.props.firebase.users().on('value', snapshot => {
      this.setState({
        users: snapshot.val(),
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const { characters } = this.state;
    return (
      <div className="container">
      <h1>Create New</h1>
      <p>Add a character with a name and a job to the table.</p>

      <h3>Add New</h3>
      <Form handleSubmit={this.handleSubmit} />

  
  

        <h1>Create New</h1>
        <p>The Home Page is accessible by every signed in user.</p>

        <Messages users={this.state.users} />
      </div>



    );
  }
}

const condition = authUser => !!authUser;

export default compose(
  withFirebase,
  withEmailVerification,
  withAuthorization(condition),
)(CreatePage);
