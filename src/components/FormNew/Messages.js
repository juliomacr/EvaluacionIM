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
      ach: '',
      loading: false,
      messages: [],
      checked: false,
      checkedB: false,
      limit: 5
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

  componentWillUnmount() {
    this.props.firebase.messages().off();
  }

 



  onClearMessage = event => {
    this.setState({ vendorNumber: '', vendorName:'', requesteddate:'', requesttype:'', comments:'', ach:'' , checked: false, checkedB: false});
    event.preventDefault();
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

    this.setState({ vendorNumber: '', vendorName:'', requesteddate:'', requesttype:'', comments:'', ach:'', checked: false, checkedB: false });

    event.preventDefault();
  };

  onEditMessage = (message, vendorNumber, vendorName) => {
    this.props.firebase.message(message.uid).set({
      ...message,
      vendorNumber,
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
    const { vendorNumber, messages, loading, vendorName, requesteddate, requesttype, comments, ach, checked, checkedB } = this.state;


    return (
      <AuthUserContext.Consumer>
        {authUser => (
        <div>




          
         <form
            onSubmit = {
                event =>
                this.onCreateMessage(event, authUser)
              } >

  <div className="contenedorform">

<div className="zona1">

<div className="col1a">
            <label > Vendor Number: </label> 
            <input
            type="number"
            placeholder="Vendor Number: #######(ex 1009516)"
            name = "vendorNumber"
            value = {
              vendorNumber
            }
            onChange={ this.handleInputChange } 
            /> 
             <span className="focus-border">
                <i></i>
              </span>
              </div>



              <div className="col2a">
            <label> Vendor Name: </label> 
            <input
            type = "text"
            className="effect-9"
            placeholder="Vendor Name: (ex L.L.Bean Inc.) "
            name = "vendorName"
            value = {
              vendorName
            }
            onChange={ this.handleInputChange } 
            /> 
             <span className="focus-border">
                <i></i>
              </span>
              </div>








</div>

<hr classname="linestyle" />
<br/>



            
<div className="zona2">    

<div className="col1a">
            
            <label> Requested Date: </label> 
            <div >
        <DayPicker
          onDayClick={this.handleDayClick}
          selectedDays={this.state.requesteddate}
        />
        {this.state.requesteddate ? (
          <p>You clicked {this.state.requesteddate.toLocaleDateString()}</p>
        ) : (
          <p>Please select a day.</p>
        )}
      </div>
      </div>



      <div className="col2a">
      <div className="switch">
        <label>Type of Request</label>
        <label htmlFor="normal-switch">
          <span>Is this a <b>NEW</b> or a <b>CHANGE</b> request?</span>
          <Switch
            onChange={this.handleSwitchChangeA}
            checked={this.state.checked}
            className="react-switch"
            id="normal-switch"
          />
        </label>
        <p>This is a <span>{this.state.checked ? <b>NEW</b>: <b>CHANGE</b>}</span> request.</p>
      </div>



<div className="switch">
        <label>ACH</label>
        <label htmlFor="normal-switch">
          <span>Is this an <b>ACH</b> request?</span>
          <Switch
            onChange={this.handleSwitchChangeB}
            checked={this.state.checkedB}
            className="react-switch"
            id="normal-switch"
          />
        </label>
        <p>This is <span>{this.state.checkedB ? <b>ACH</b>: <b>NOT an ACH</b>}</span> request.</p>
      </div>

      </div>

</div>
<br/>
<hr classname="linestyle" />
<br/>

<div className="zona3">
<div className="col2a">

<label> Comments: </label> 
            <TextArea
            type = "text"
            name = "comments"
            multiline
            rowsMax="4"
            margin="normal"
            value = {
              comments
            }
            onChange={ this.handleInputChange } 
            /> 


</div>
</div>




<div className="zonabotones">
            <button type = "submit" > Save </button> 

            

            <button type="button" onClick={this.onClearMessage} > Clear </button> 
</div>

</div>


            </form>

            <br/>
<hr classname="linestyle" />
<br/>


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
