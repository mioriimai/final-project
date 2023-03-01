import React from 'react';

export default class EditOutfit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      itemsForOutfit: []
    };
  }

  componentDidMount() {
    fetch(`/api/outfitItems/${this.props.outfitId}`)
      .then(res => res.json())
      .then(itemsForOutfit => this.setState({ itemsForOutfit }));

    fetch('/api/items')
      .then(res => res.json())
      .then(items => this.setState({ items }));
  }

  render() {

    // console.log('this.state:', this.state);
    return (
      <p>test</p>
    );
  }
}
