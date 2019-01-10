import React, { Component } from 'react';

class MessageItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editMode: false,
      editText: this.props.message.text,
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      vendorNumber: this.props.message.vendorNumber,
      vendorName: this.props.message.vendorName,
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
    this.props.onEditMessage(this.props.message, this.state.vendorNumber, this.state.vendorName);

    this.setState({ editMode: false });
  };

  render() {
    const { message, onRemoveMessage } = this.props;
    const { editMode, vendorNumber, vendorName } = this.state;

    return (
      <li>
        {editMode ? (
          <div>
          
          <label>Vendor Number: </label>
          <input
            type="number"
            name="vendorNumber"
            value={vendorNumber}
            onChange={this.onChangeEditText}
          />
          
 
          <label>Vendor Name: </label>
<input 
    type="text" 
    name="vendorName" 
    value={vendorName}
    onChange={ this.onChangeEditText } 
    
     />

          </div>

        ) : (
          <span>
            <strong>
              {message.user.username || message.user.userId}
            </strong>{' '}
            {message.text} {message.editedAt && <span>(Audited)</span>}
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
