import React from 'react';
import Items from '../components/items';

export default class ListView extends React.Component {
  render() {
    return (
      <div>
        <Items content="Items" />
      </div>
    );
  }
}
