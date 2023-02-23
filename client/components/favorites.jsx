import React from 'react';

export default class FormItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favoritesItems: [],
      itemId: null,
      showItems: true,
      showOutfits: false
    };
  }

  componentDidMount() {
    if (this.state.showItems === true) {
      fetch('/api/favoriteItems')
        .then(res => res.json())
        .then(items => this.setState({ items }));
    }
  }

  // render() {

  // }

}
