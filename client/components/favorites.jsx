import React from 'react';
// import CreateOptions from './create-options';

export default class FormItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favoriteItems: [],
      itemId: null,
      showItems: true,
      showOutfits: false
    };
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleFavoriteClick = this.handleFavoriteClick.bind(this);
  }

  componentDidMount() {
    if (this.state.showItems === true) {
      fetch('/api/favoriteItems')
        .then(res => res.json())
        .then(favoriteItems => this.setState({ favoriteItems }));
    }
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

  handleFavoriteClick() {
    let favoriteStatus;
    const targetedItemId = Number(this.state.itemId);
    for (let i = 0; i < this.state.favoriteItems.length; i++) {
      if (this.state.favoriteItems[i].itemId === targetedItemId) {
        favoriteStatus = this.state.favoriteItems[i].favorite;
      }
    }
    const status = { favorite: !favoriteStatus };

    // Use fetch() to send a PATCH request to update item's favorite status
    fetch(`/api/itemFavoriteUpdate/${this.state.itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(status)
    });

    // Use fetch() to send a GET request to get all item that have favorite=true.
    if (this.state.showItems === true) {
      fetch('/api/favoriteItems')
        .then(res => res.json())
        .then(favoriteItems => this.setState({ favoriteItems }));
    }
  }

  render() {
    // console.log('this.state:', this.state);

    const itemsArray = [];
    for (let i = 0; i < this.state.favoriteItems.length; i++) {
      const targetedItemId = Number(this.state.itemId);

      let hoverClassName = 'shadow-wrapper hidden';
      if (this.state.favoriteItems[i].itemId === targetedItemId) {
        hoverClassName = 'shadow-wrapper';
      } else {
        hoverClassName = 'shadow-wrapper hidden';
      }

      let isNotFavorite;
      let isFavorite;
      let favoriteIcon;
      if (this.state.favoriteItems[i].favorite === false) {
        isNotFavorite = 'hover-favorite-icon';
        isFavorite = 'hover-favorite-icon hidden';
        favoriteIcon = 'favorite-icon hidden';
      } else if (this.state.favoriteItems[i].favorite === true) {
        isNotFavorite = 'hover-favorite-icon hidden';
        isFavorite = 'hover-favorite-icon';
        favoriteIcon = 'favorite-icon';
      }

      itemsArray.push(
        <div key={i} className="item-wrapper">
          <Item
            item={this.state.favoriteItems[i]}
            handleMouseEnter={this.handleMouseEnter}
            handleMouseLeave={this.handleMouseLeave}
            state={this.state}
            hover={hoverClassName}
            isNotFavoriteIcon={isNotFavorite}
            isFavoriteIcon={isFavorite}
            favoriteIcon={favoriteIcon}
            handleFavoriteClick={this.handleFavoriteClick}
          />
        </div>
      );
    }

    let noItemMessage;
    if (this.state.favoriteItems.length === 0) {
      noItemMessage = 'no-item-message';
    } else {
      noItemMessage = 'no-item-message hidden';
    }

    let addButton;
    if (this.state.showItems === true) {
      addButton = 'Items';
    } else if (this.state.showOutfits === true) {
      addButton = 'Outfits';
    }

    return (
      <div className='items-view-container'>
        <div className='row spacing'>
          <div className='favorites-title-and-buttons-wrapper'>
            <p className='favorites'>Favorites</p>
            <button type='button' className='favorites-items-button'>Items</button>
            <button type='button' className='favorites-outfits-button'>Outfits</button>
          </div>
          {/* <div className='mobile-column-full'>
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
          </div> */}
        </div>
        <a href="#add-item" className='add-items-button'>
          <i className="fa-solid fa-plus" />
          Add {addButton}
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
        <div className={props.favoriteIcon}>
          <i className='fa-solid fa-heart item-stay ' />
        </div>
        <div className={props.hover} onMouseLeave={props.handleMouseLeave}>
          <p className='items-notes'>{notes}</p>
          <a href={`#item?itemId=${itemId}`}>
            <i className="fa-solid fa-pen item" />
          </a>
          <button type='button' className={props.isNotFavoriteIcon} onClick={props.handleFavoriteClick}><i className='fa-regular fa-heart item' /></button>
          <button type='button' className={props.isFavoriteIcon} onClick={props.handleFavoriteClick}><i className='fa-solid fa-heart item' /></button>
        </div>
      </div>
    </div>
  );
}
