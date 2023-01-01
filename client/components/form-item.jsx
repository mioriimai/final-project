import React from 'react';

export default class FormItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <div className='item-view-wrapper'>
        <h1>{this.props.title}</h1>
      </div>
    );
  }
}
