import React from 'react';

export default class EditItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originalImage: '',
      bgRemovedImage: 'None',
      category: '',
      brand: '',
      color: '',
      notes: '',
      preview: null,
      saved: false
    };
  }

  render() {
    return (
      <p>{this.props.itemId}</p>
    );
  }
}
