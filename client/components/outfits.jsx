import React from 'react';

export default class Items extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      outfits: [],
      outfitId: null
    };
  }
}
