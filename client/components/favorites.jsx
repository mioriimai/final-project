import React from 'react';

export default class FormItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      itemId: null,
      showItems: true,
      outFits: false
    };
  }

}
