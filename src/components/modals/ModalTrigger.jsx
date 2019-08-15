import React, { Component } from 'react';
class ModalTrigger extends Component {
  render() {
    return (
      <button
        ref={this.props.buttonRef}
        onClick={this.props.showModal}
        className={this.props.btnClass}
      >
        {this.props.btnText}
      </button>
    );
  }
}

export default ModalTrigger;