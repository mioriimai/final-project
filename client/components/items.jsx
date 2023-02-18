import React from 'react';

export default class Items extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      itemId: null
    };
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentDidMount() {
    fetch('/api/items')
      .then(res => res.json())
      .then(items => this.setState({ items }));
  }

  handleMouseEnter(event) {
    this.setState({
      itemId: event.target.name
    });
  }

  handleMouseLeave() {
    this.setState({
      itemId: null
    });
  }

  render() {

    // console.log(this.state);

    const itemsArray = [];
    for (let i = 0; i < this.state.items.length; i++) {
      const targetedItemId = Number(this.state.itemId);

      let hoverClassName = 'shadow-wrapper hidden';
      if (this.state.items[i].itemId === targetedItemId) {
        hoverClassName = 'shadow-wrapper';
      } else {
        hoverClassName = 'shadow-wrapper hidden';
      }
      itemsArray.push(
        <div key={i} className="item-wrapper">
          <Item
      item={this.state.items[i]}
      handleMouseEnter={this.handleMouseEnter}
      handleMouseLeave={this.handleMouseLeave}
      state={this.state}
      hover={hoverClassName}
      />
        </div>
      );
    }
    return (
      <div className='items-view-container'>
        <p className='items'>{this.props.content}</p>
        <a href="#add-item" className='add-items-button'>Add {this.props.content}</a>

        <div className='item-list-wrapper'>
          {itemsArray}
        </div>
      </div>
    );
  }
}

function Item(props) {
  const { originalImage, notes, itemId } = props.item;

  return (
    <a href={`#items?itemId=${itemId}`} className='item-button' >
      <div className='position'>
        <img
          src={originalImage}
          alt={`Item ${itemId}`}
          className="item-image"
          onMouseEnter={props.handleMouseEnter}
          name={`${itemId}`}
        />
        <div className={props.hover} onMouseLeave={props.handleMouseLeave}>
          <p className='items-notes'>{notes}</p>
        </div>
      </div>
    </a>
  );
}
