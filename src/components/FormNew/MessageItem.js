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
      editText: this.props.message.text,
      names: this.props.message.names,
    }));
  };

  onChangeEditTextA = event => {
    this.setState({ editText: event.target.value });
  };

  onChangeEditTextB = event => {
    this.setState({ names: event.target.value });
  };

  onSaveEditText = () => {
    this.props.onEditMessage(this.props.message, this.state.editText, this.state.names);

    this.setState({ editMode: false });
  };

  render() {
    const { message, onRemoveMessage } = this.props;
    const { editMode, editText, names } = this.state;

    return (
      <li>
        {editMode ? (
          <div>
          <input
            type="text"
            value={editText}
            onChange={this.onChangeEditTextA}
          />
          
 
          <label>Names</label>
<input 
    type="text" 
    name="names" 
    value={names}
    onChange={this.onChangeEditTextB}

     />

          </div>

        ) : (
          <span>
            <strong>
              {message.user.username || message.user.userId}
            </strong>{' '}
            {message.text} {message.editedAt && <span>(Edited)</span>}
          </span>
        )}

        {editMode ? (
          <span>
            <button onClick={this.onSaveEditText}>Save</button>
            <button onClick={this.onToggleEditMode}>Reset</button>
          </span>
        ) : (
          <button onClick={this.onToggleEditMode}>Edit</button>
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
