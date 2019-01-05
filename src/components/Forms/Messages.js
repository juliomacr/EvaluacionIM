import React, { Component } from 'react';

import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import MessageList from './MessageList';

class Messages extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      names: '',
      job: '',
      text123: '',
      loading: false,
      messages: [],
      limit: 5
    };

    this.state = this.initialState;
  }

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({
        [name] : value
    });
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

  onChangeTextA = event => {
    this.setState({ text: event.target.value });
  };

  onChangeTextB = event => {
    this.setState({ names: event.target.value });
  };

  onCreateMessage = (event, authUser) => {
    this.props.firebase.messages().push({
      text: this.state.text,
      names: this.state.names,
      userId: authUser.uid,
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
    });

    this.setState({ text: '', names:'' });

    event.preventDefault();
  };

  onEditMessage = (message, text, names) => {
    this.props.firebase.message(message.uid).set({
      ...message,
      text,
      names,
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
    const { text, messages, loading, names } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
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

            < form
            onSubmit = {
                event =>
                this.onCreateMessage(event, authUser)
              } >
              <label> Text </label> <
              input
            type = "text"
            value = {
              text
            }
            onChange = {
              this.onChangeTextA
            }
            /> <
            label > Names </label> <
              input
            type = "text"
            name = "names"
            value = {
              names
            }
            onChange = {
              this.onChangeTextB
            }
            />



            <
            button type = "submit" > Send </button> 
            </form>
          
 

</div>

        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(Messages);
