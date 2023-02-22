import React from 'react';
import CreateOptions from './create-options';

export default class Items extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      itemId: null,
      sortCategory: 'Category',
      sortBrand: 'Brand',
      sortColor: 'Color'
    };
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleSortCategoryChange = this.handleSortCategoryChange.bind(this);
    this.handleSortBrandChange = this.handleSortBrandChange.bind(this);
    this.handleSortColorChange = this.handleSortColorChange.bind(this);
    this.handleSortReset = this.handleSortReset.bind(this);
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

    if (event.target.value === 'Category' && this.state.sortBrand === 'Brand' && this.state.sortColor === 'Color') {
      // Use fetch() to send a GET request to get all items
      fetch('/api/items')
        .then(res => res.json())
        .then(items => this.setState({ items }));

    } else {
      // Use fetch() to send a GET request to get items that meet the conditons
      fetch(`/api/items/${event.target.value}/${this.state.sortBrand}/${this.state.sortColor}`, {
        method: 'GET'
      })
        .then(res => res.json())
        .then(items => this.setState({ items }))
        .catch(err => console.error(err));
    }
  }

  handleSortBrandChange(event) {
    this.setState({
      sortBrand: event.target.value
    });

    if (this.state.sortCategory === 'Category' && event.target.value === 'Brand' && this.state.sortColor === 'Color') {
      // Use fetch() to send a GET request to get all items
      fetch('/api/items')
        .then(res => res.json())
        .then(items => this.setState({ items }));

    } else {
      // Use fetch() to send a GET request to get items that meet the conditons
      fetch(`/api/items/${this.state.sortCategory}/${event.target.value}/${this.state.sortColor}`, {
        method: 'GET'
      })
        .then(res => res.json())
        .then(items => this.setState({ items }))
        .catch(err => console.error(err));
    }
  }

  handleSortColorChange(event) {
    this.setState({
      sortColor: event.target.value
    });

    if (this.state.sortCategory === 'Category' && this.state.sortBrand === 'Brand' && event.target.value === 'Color') {
      // Use fetch() to send a GET request to get all items
      fetch('/api/items')
        .then(res => res.json())
        .then(items => this.setState({ items }));

    } else {
      // Use fetch() to send a GET request to get items that meet the conditons
      fetch(`/api/items/${this.state.sortCategory}/${this.state.sortBrand}/${event.target.value}`, {
        method: 'GET'
      })
        .then(res => res.json())
        .then(items => this.setState({ items }))
        .catch(err => console.error(err));
    }
  }

  handleSortReset() {
    // Use fetch() to send a GET request to get all items
    fetch('/api/items')
      .then(res => res.json())
      .then(items => this.setState({ items }));

    this.setState({
      sortCategory: 'Category',
      sortBrand: 'Brand',
      sortColor: 'Color'
    });
  }

  render() {

    const itemsArray = [];
    for (let i = 0; i < this.state.items.length; i++) {
      const targetedItemId = Number(this.state.itemId);

      let hoverClassName = 'shadow-wrapper hidden';
      if (this.state.items[i].itemId === targetedItemId) {
        hoverClassName = 'shadow-wrapper';
      } else {
        hoverClassName = 'shadow-wrapper'; // don't forget to add hidden here!
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

    let noItemMessage;
    if (this.state.items.length === 0) {
      noItemMessage = 'no-item-message';
    } else {
      noItemMessage = 'no-item-message hidden';
    }

    return (
      <div className='items-view-container'>
        <div className='row spacing'>
          <div className='mobile-column-full'>
            <p className='items'>{this.props.content}</p>
          </div>
          <div className='mobile-column-full'>
            <form className='sort-wrapper'>
              <select name="category" id="sort-category" value={this.state.sortCategory} onChange={this.handleSortCategoryChange}>
                <CreateOptions options="category" usage="sort" />
              </select>
              <select name="brand" id="sort-brand" value={this.state.sortBrand} onChange={this.handleSortBrandChange}>
                <CreateOptions options="brand" usage="sort" />
              </select>
              <select name="color" id="sort-color" value={this.state.sortColor} onChange={this.handleSortColorChange}>
                <CreateOptions options="color" usage="sort" />
              </select>
              <button type='button' className='sort-reset-button' onClick={this.handleSortReset}>Reset</button>
            </form>
          </div>
        </div>
        <a href="#add-item" className='add-items-button'>
          <i className="fa-solid fa-plus" />
          Add {this.props.content}
        </a>
        <p className={noItemMessage}>No items found. Let&rsquo;s add an item!</p>
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
            <i className="fa-regular fa-heart item" />
          </a>
        </div>
      </div>
    </div>
  );
}
