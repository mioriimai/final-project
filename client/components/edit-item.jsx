import React from 'react';

export default class EditItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: null
    };
  }

  componentDidMount() {
    fetch(`/api/items/${this.props.itemId}`)
      .then(res => res.json())
      .then(item => this.setState({ item }));
  }

  render() {
    // console.log('this.state:', this.state);

    if (!this.state.product) return null;

    return (
      <p>{this.props.itemId}</p>
    );
  }
}
