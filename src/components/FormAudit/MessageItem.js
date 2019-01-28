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
      checkedA: false,
      checkedB: false,
      checkedC: false,
      checkedD: false
    };
    this.handleSwitchChangeA = this.handleSwitchChangeA.bind(this);
    this.handleSwitchChangeB = this.handleSwitchChangeB.bind(this);
    this.handleSwitchChangeC = this.handleSwitchChangeC.bind(this);
    this.handleSwitchChangeD = this.handleSwitchChangeD.bind(this);

  }

  

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      vendorNumber: this.props.message.vendorNumber,
      vendorName: this.props.message.vendorName,
      requesteddate: this.props.message.requesteddate,
      ach: this.props.message.ach,
      requesttype: this.props.message.requesttype,
      comments: this.props.message.comments, 
      editedAt: this.props.message.editedAt,
      auditComments:'',
      checkedA: false,
      checkedB: false,
      checkedC: false,
      checkedD: false
    }));
  };

//Para cuando ya están auditados que cargue con los valores de la auditoria
  // onToggleEditMode = () => {
  //   this.setState(state => ({
  //     editMode: !state.editMode,
  //     vendorNumber: this.props.message.vendorNumber,
  //     vendorName: this.props.message.vendorName,
  //     requesteddate: this.props.message.requesteddate,
  //     ach: this.props.message.ach,
  //     requesttype: this.props.message.requesttype,
  //     comments: this.props.message.comments, 
  //     editedAt: this.props.message.editedAt,
  //     auditComments: this.props.message.auditComments,
  //     checkedA: this.props.message.error1,
  //     checkedB: this.props.message.error2,
  //     checkedC: this.props.message.error3,
  //     checkedD: this.props.message.error4
  //   }));
  // };


 

  
  onChangeEditText = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

handleSwitchChangeA(checkedA) {
    this.setState({ checkedA });
}

handleSwitchChangeB(checkedB) {
    this.setState({ checkedB });
}
handleSwitchChangeC(checkedC) {
  this.setState({ checkedC });
}

handleSwitchChangeD(checkedD) {
  this.setState({ checkedD });
}

  onSaveEditText = () => {
    this.props.onEditMessage(this.props.message, this.state.auditComments, this.state.checkedA, this.state.checkedB, this.state.checkedC, this.state.checkedD);
    this.setState({ editMode: false });
  };



  render() {
    const { message, onRemoveMessage } = this.props;
    const { editMode, comments, vendorNumber, vendorName, requesteddate, ach, requesttype, auditComments,  editedAt } = this.state;


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

            
            <label> Requested Date: { requesteddate }</label> 
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
            checked={requesttype}
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
            checked={ach}
            className="react-switch"
            id="normal-switch"
          />
        </label>
        <p>This is <span>{this.state.message ? <b>an ACH</b>: <b>NOT an ACH</b>}</span> request.</p>
      </div>

      </div>

</div>


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
            /> 


</div>
</div>

<br/>
<hr classname="linestyle" />
<br/>


<div className="zona4">
<div className="col2a">

<label>Audit Error: </label> 
<p> Select all the error types that apply</p>


<div className="switch">
        <label>error1</label>
        <label htmlFor="normal-switch">
          <span>error1?</span>
          <Switch
            checked={this.state.checkedA}
            onChange={this.handleSwitchChangeA}
            className="react-switch"
            id="normal-switch"
          />
        </label>
  </div>
  <div className="switch">
        <label>error2</label>
        <label htmlFor="normal-switch">
          <span>error2?</span>
          <Switch
            checked={this.state.checkedB}
            onChange={this.handleSwitchChangeB}
            className="react-switch"
            id="normal-switch"
          />
        </label>
  </div>
  <div className="switch">
        <label>error3</label>
        <label htmlFor="normal-switch">
          <span>error3?</span>
          <Switch
            checked={this.state.checkedC}
            onChange={this.handleSwitchChangeC}
            className="react-switch"
            id="normal-switch"
          />
        </label>
  </div>
  <div className="switch">
        <label>error4</label>
        <label htmlFor="normal-switch">
          <span>error4?</span>
          <Switch
            checked={this.state.checkedD}
            onChange={this.handleSwitchChangeD}
            className="react-switch"
            id="normal-switch"
          />
        </label>
  </div>




<label>Audit Comments: </label> 
            <TextArea
            type = "text"
            name = "auditComments"
            multiline
            rowsMax="4"
            margin="normal"
            value = {
              auditComments
            }
            onChange={ this.onChangeEditText } 
            /> 


</div>
</div>

<br/>
<hr classname="linestyle" />
<br/>

</div>


            </form>

</div>
      

          </div>

        ) : (
          <span>
            <strong>
              {message.vendorNumber}
            </strong>{' '}
            {message.vendorName } {message.requesteddate} {message.createdAt} {message.editedAt} {message.editedAt && <span>(Audited)</span>}
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
