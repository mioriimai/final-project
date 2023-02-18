import React from 'react';

export default class EditItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null
    };
  }

  render() {
    return (
      <p>{this.props.itemId}</p>
    );
  }
}
