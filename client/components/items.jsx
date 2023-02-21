import React from 'react';
import CreateOptions from './create-options';

export default class Items extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      itemId: null,
      sortCategory: '',
      sortBrand: '',
      sortColor: ''
    };
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleSortCategoryChange = this.handleSortCategoryChange.bind(this);
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

  handleSortCategoryChange(event) {
    this.setState({
      sortCategory: event.target.value
    });
  }

  render() {

    // console.log('this.state:', this.state);
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
        <div className='row'>
          <div className='mobile-column-full'>
            <p className='items'>{this.props.content}</p>
          </div>
          <div className='mobile-column-full'>
            <form className='sort-wrapper'>
              <select name="category" id="sort-category" value={this.state.sortCategory} onChange={this.handleSortCategoryChange}>
                <CreateOptions options="category" usage="sort" />
              </select>
              <select name="brand" id="sort-brand" /* value={this.state.sortBrand} */>
                <CreateOptions options="brand" usage="sort" />
              </select>
              <select name="color" id="sort-color" /* value={this.state.sortColor} */>
                <CreateOptions options="color" usage="sort" />
              </select>
            </form>
          </div>
        </div>
        <a href="#add-item" className='add-items-button'>
          <i className="fa-solid fa-plus" />
          Add {this.props.content}
        </a>
        <div className='item-list-wrapper'>
          {itemsArray}
        </div>
      </div>
    );
  }
}

function Item(props) {
  const { image, notes, itemId } = props.item;

  return (
    <div className='item-button' >
      <div className='position'>
        <img
          src={image}
          alt={`Item ${itemId}`}
          className="item-image"
          onMouseEnter={props.handleMouseEnter}
          name={`${itemId}`}
        />
        <div className={props.hover} onMouseLeave={props.handleMouseLeave}>
          <p className='items-notes'>{notes}</p>
          <a href={`#item?itemId=${itemId}`}>
            <i className="fa-solid fa-pen item" />
          </a>
        </div>
      </div>
    </div>
  );
}
