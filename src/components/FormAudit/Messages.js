import React, { Component } from 'react';
import { TextArea } from 'semantic-ui-react'

import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import MessageList from './MessageList';


import DayPicker from 'react-day-picker';
import Switch from "react-switch";

import 'react-day-picker/lib/style.css';

class Messages extends Component {
  constructor(props) {
    super(props);

    this.initialState = {
      requesteddate: undefined,
      vendorName: '',
      job: '',
      vendorNumber: '',
      requesttype: '',
      comments: '',
      auditComments:'',
      ach: '',
      loading: false,
      messages: [],
      checked: false,
      checkedB: false,
      limit: 5,
      error1: false,
      error2: false,
      error3: false,
      error4: false
    };

    this.state = this.initialState;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleSwitchChangeA = this.handleSwitchChangeA.bind(this);
    this.handleSwitchChangeB = this.handleSwitchChangeB.bind(this);

    }


  handleSwitchChangeA(checked) {
      this.setState({ checked });
  }

  handleSwitchChangeB(checkedB) {
      this.setState({ checkedB });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value

    });
  }

  handleDayClick(day, { selected }) {
      if (selected) {
        // Unselect the day if already selected
        this.setState({ requesteddate: undefined });
        return;
      }
      this.setState({ requesteddate: day });
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

	filterList(event) {
		var updatedList = this.state.messages;
		updatedList = updatedList.filter(function(item){
      return item.vendorNumber.search(
        event.target.value) !== -1;
    });
    this.setState({messages: updatedList});
	}


  componentWillUnmount() {
    this.props.firebase.messages().off();
  }

 



  onClearMessage = event => {
    this.setState({ vendorNumber: '', vendorName:'', requesteddate:'', requesttype:'', comments:'', ach:'' , checked: false, checkedB: false});
    event.preventDefault();
    this.onListenForMessages();
  };




  onCreateMessage = (event, authUser) => {
    this.props.firebase.messages().push({
      requesttype: this.state.checked,
      requesteddate: this.state.requesteddate.toLocaleDateString(),
      vendorNumber: this.state.vendorNumber,
      vendorName: this.state.vendorName,
      createdAt: this.props.firebase.serverValue.TIMESTAMP,
      userId: authUser.uid,
      comments: this.state.comments,
      ach: this.state.checkedB,
    });

    this.setState({ auditComments:'', vendorNumber: '', vendorName:'', requesteddate:'', requesttype:'', comments:'', ach:'', checkedA: false, checkedB: false });

    event.preventDefault();
  };

  onEditMessage = (message, auditComments, checkedA, checkedB, checkedC, checkedD ) => {
    this.props.firebase.message(message.uid).set({
      ...message,
      auditComments,
      editedAt: this.props.firebase.serverValue.TIMESTAMP,
      error1: checkedA,
      error2: checkedB,
      error3: checkedC,
      error4: checkedD
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
    const { vendorNumber, messages, loading, vendorName, requesteddate, requesttype, comments, ach, checked, checkedB } = this.state;


    return (
      <AuthUserContext.Consumer>
        {authUser => (
        <div>




          
 


            {!loading && messages && (
              <div>
              <button type="button" onClick={this.onNextPage}>
                More
              </button>
              <button type="button" onClick={this.onClearMessage} > Clear </button> 
              </div>
            )}

            {loading && <div>Loading ...</div>}

            {messages && (
              <div>
                
           <input type="text" className="form-control form-control-lg" placeholder="Search" onChange={this.filterList.bind(this)} />

              <MessageList
                messages={this.state.messages.map(message => ({
                  ...message,
                  user: users
                    ? users[message.userId]
                    : { userId: message.userId },
                }))}
                onEditMessage={this.onEditMessage}
                onRemoveMessage={this.onRemoveMessage}
              />
              </div>
            )}

            {!messages && <div>There are no Records ...</div>}

            
                                

            </div>
            

        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(Messages);
