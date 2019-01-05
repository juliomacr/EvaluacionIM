import React, { Component } from 'react';

import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import MessageList from './MessageList';

class Messages extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      vendorName: '',
      job: '',
      text123: '',
      loading: false,
      messages: [],
      requesteddate: '',
      limit: 5
    };

    this.state = this.initialState;
    this.handleInputChange = this.handleInputChange.bind(this);
  }



  componentDidMount() {
    this.onListenForMessages();
  }

  onListenForMessages = () => {
    this.setState({ loading: true });

    this.props.firebase
      .messages()
      .orderByChild('createdAt')
      .limitToLast(this.state.limit)
      .on('value', snapshot => {
        const messageObject = snapshot.val();

        if (messageObject) {
          const messageList = Object.keys(messageObject).map(key => ({
            ...messageObject[key],
            uid: key,
          }));

          this.setState({
            messages: messageList,
            loading: false,
          });
        } else {
          this.setState({ messages: null, loading: false });
        }
      });
  };

  componentWillUnmount() {
    this.props.firebase.messages().off();
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }



  onClearMessage = event => {
    this.setState({ text: '', vendorName:'' });
    event.preventDefault();
  };




  onCreateMessage = (event, authUser) => {
    this.props.firebase.messages().push({
      text: this.state.text,
      vendorName: this.state.vendorName,
      userId: authUser.uid,
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
    });

    this.setState({ text: '', vendorName:'' });

    event.preventDefault();
  };

  onEditMessage = (message, text, vendorName) => {
    this.props.firebase.message(message.uid).set({
      ...message,
      text,
      vendorName,
      editedAt: this.props.firebase.serverValue.TIMESTAMP,
    });
  };

  onRemoveMessage = uid => {
    this.props.firebase.message(uid).remove();
  };

  onNextPage = () => {
    this.setState(
      state => ({ limit: state.limit + 5 }),
      this.onListenForMessages,
    );
  };

  render() {
    const { users } = this.props;
    const { text, messages, loading, vendorName, requesteddate } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
        <div>
         <form
            onSubmit = {
                event =>
                this.onCreateMessage(event, authUser)
              } >
            
            <label > Vendor Number: </label> 
            <input
            type = "text"
            name = "text"
            value = {
              text
            }
            onChange={ this.handleInputChange } 
            /> 
            
            <label> Vendor Name: </label> 
            <input
            type = "text"
            name = "vendorName"
            value = {
              vendorName
            }
            onChange={ this.handleInputChange } 

            /> 
            
            <label> Requested Date: </label> 
            <input
            type = "text"
            name = "requesteddate"
            value = {
              requesteddate
            }
            onChange={ this.handleInputChange } 
            /> 

            <label> Type of Request: </label> 
            <input
            type = "text"
            name = "vendorName1"
            value = {
              vendorName
            }
            onChange={ this.handleInputChange } 
            /> 

            <label> Comments: </label> 
            <input
            type = "text"
            name = "vendorName2"
            value = {
              vendorName
            }
            onChange={ this.handleInputChange } 
            /> 

            <label> ACH: </label> 
            <input
            type = "text"
            name = "vendorName3"
            value = {
              vendorName
            }
            onChange={ this.handleInputChange } 
            /> 



            <button type = "submit" > Save </button> 

            


            </form>

            <button type="button" onClick={this.onClearMessage} > Clear </button> 


            {!loading && messages && (
              <button type="button" onClick={this.onNextPage}>
                More
              </button>
            )}

            {loading && <div>Loading ...</div>}

            {messages && (
              <MessageList
                messages={messages.map(message => ({
                  ...message,
                  user: users
                    ? users[message.userId]
                    : { userId: message.userId },
                }))}
                onEditMessage={this.onEditMessage}
                onRemoveMessage={this.onRemoveMessage}
              />
            )}

            {!messages && <div>There are no Records ...</div>}

            
                                

            </div>

        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(Messages);
