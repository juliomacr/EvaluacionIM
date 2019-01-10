import React, { Component } from 'react';
import { TextArea } from 'semantic-ui-react'

import DayPicker from 'react-day-picker';
import Switch from "react-switch";

import Moment from 'react-moment';

import 'react-day-picker/lib/style.css';





class MessageItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      comments: this.props.message.comments,
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      vendorNumber: this.props.message.vendorNumber,
      vendorName: this.props.message.vendorName,
      requesteddate: this.props.message.requesteddate
    }));
  };


 

  
  onChangeEditText = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }


  onSaveEditText = () => {
    this.props.onEditMessage(this.props.message, this.state.comments);
    this.setState({ editMode: false });
  };



  render() {
    const { message, onRemoveMessage } = this.props;
    const { editMode, comments, vendorNumber, vendorName, requesteddate } = this.state;

    const  test =<Moment format="YYYY, MM, DD">{message.requesteddate}</Moment>;


    return (
      <li>
        {editMode ? (
          <div>
            <p>Auditing Vendor Request</p>
      
          <div>
          
          <form
            onSubmit = {
                event =>
                this.onCreateMessage(event)
              } >

  <div className="contenedorform">

<div className="zona1">

  <div className="col1a">
            <label > Vendor Number: </label> 
            <input
            type="number"
            disabled="disabled"
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
            disabled="disabled"
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

            
            <label> Requested Date: { requesteddate } lalalla {test}</label> 
            <div >
            <p>  {<Moment format="YYYY, MM, DD">{message.requesteddate}</Moment>}</p>
            

            

        <DayPicker
        


        
        selectedDays={[
          new Date(requesteddate),
        ]}
         
        />

        
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
            onChange={ this.onChangeEditText } 
            /> 


</div>
</div>





</div>


            </form>

</div>
      

          </div>

        ) : (
          <span>
            <strong>
              {message.user.username || message.user.userId}
            </strong>{' '}
            {message.comments}{message.comments}{message.requesteddate} <span>(Audited)</span>
          </span>
        )}

        {editMode ? (
          <span>
            <button onClick={this.onSaveEditText}>Save</button>
            <button onClick={this.onToggleEditMode}>Cancel</button>
          </span>
        ) : (
          <button onClick={this.onToggleEditMode}>Audit</button>
        )}

        {!editMode && (
          <button
            type="button"
            onClick={() => onRemoveMessage(message.uid)}
          >
            Delete
          </button>
        )}
      </li>
    );
  }
}

export default MessageItem;
