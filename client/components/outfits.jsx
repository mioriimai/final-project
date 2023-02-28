import React from 'react';

export default class Outfits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      outfits: [],
      itemsForOutfit: [],
      outfitId: null
    };
  }

  componentDidMount() {
    fetch('/api/outfitItems')
      .then(res => res.json())
      .then(itemsForOutfit => this.setState({ itemsForOutfit }));

    fetch('/api/outfits')
      .then(res => res.json())
      .then(outfits => this.setState({ outfits }));
  }

  render() {

    // console.log('this.state:', this.state);

    return (
      <p>test</p>
    );
  }
}
