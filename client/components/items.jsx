import React from 'react';

export default class Items extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
  }

  componentDidMount() {
    fetch('/api/items')
      .then(res => res.json())
      .then(items => this.setState({ items }));
  }

  render() {
    return (
      <div className='items-container'>
        <h1>{this.props.content}</h1>
      </div>
    );
  }
}
