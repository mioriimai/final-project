import React from 'react';
import CreateOptions from './create-options';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';

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
    this.handleFavoriteClick = this.handleFavoriteClick.bind(this);
  }

  componentDidMount() {
    fetch(`/api/items/${this.context.user.userId}`)
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
      fetch(`/api/items/${this.context.user.userId}`)
        .then(res => res.json())
        .then(items => this.setState({ items }));

    } else {
      // Use fetch() to send a GET request to get items that meet the conditons
      fetch(`/api/items/${event.target.value}/${this.state.sortBrand}/${this.state.sortColor}/${this.context.user.userId}`, {
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
      fetch(`/api/items/${this.context.user.userId}`)
        .then(res => res.json())
        .then(items => this.setState({ items }));

    } else {
      // Use fetch() to send a GET request to get items that meet the conditons
      fetch(`/api/items/${this.state.sortCategory}/${event.target.value}/${this.state.sortColor}/${this.context.user.userId}`, {
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
      fetch(`/api/items/${this.context.user.userId}`)
        .then(res => res.json())
        .then(items => this.setState({ items }));

    } else {
      // Use fetch() to send a GET request to get items that meet the conditons
      fetch(`/api/items/${this.state.sortCategory}/${this.state.sortBrand}/${event.target.value}/${this.context.user.userId}`, {
        method: 'GET'
      })
        .then(res => res.json())
        .then(items => this.setState({ items }))
        .catch(err => console.error(err));
    }
  }

  handleSortReset() {
    // Use fetch() to send a GET request to get all items
    fetch(`/api/items/${this.context.user.userId}`)
      .then(res => res.json())
      .then(items => this.setState({ items }));

    this.setState({
      sortCategory: 'Category',
      sortBrand: 'Brand',
      sortColor: 'Color'
    });
  }

  handleFavoriteClick() {
    let favoriteStatus;
    const targetedItemId = Number(this.state.itemId);
    for (let i = 0; i < this.state.items.length; i++) {
      if (this.state.items[i].itemId === targetedItemId) {
        favoriteStatus = this.state.items[i].favorite;
      }
    }
    const status = { favorite: !favoriteStatus };

    // Use fetch() to send a PATCH request to update item's favorite status
    fetch(`/api/itemFavoriteUpdate/${this.state.itemId}/${this.context.user.userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(status)
    });

    if (this.state.sortCategory === 'Category' && this.state.sortBrand === 'Brand' && this.state.sortColor === 'Color') {
      // Use fetch() to send a GET request to get all items
      fetch(`/api/items/${this.context.user.userId}`)
        .then(res => res.json())
        .then(items => this.setState({ items }));

    } else {
      // Use fetch() to send a GET request to get items that meet the conditons
      fetch(`/api/items/${this.state.sortCategory}/${this.state.sortBrand}/${this.state.sortColor}/${this.context.user.userId}`, {
        method: 'GET'
      })
        .then(res => res.json())
        .then(items => this.setState({ items }))
        .catch(err => console.error(err));
    }
  }

  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;

    const itemsArray = [];
    for (let i = 0; i < this.state.items.length; i++) {
      const targetedItemId = Number(this.state.itemId);

      let hoverClassName = 'shadow-wrapper hidden';
      if (this.state.items[i].itemId === targetedItemId) {
        hoverClassName = 'shadow-wrapper';
      } else {
        hoverClassName = 'shadow-wrapper hidden';
      }

      let isNotFavorite;
      let isFavorite;
      let favoriteIcon;
      if (this.state.items[i].favorite === false) {
        isNotFavorite = 'hover-favorite-icon';
        isFavorite = 'hover-favorite-icon hidden';
        favoriteIcon = 'favorite-icon hidden';
      } else if (this.state.items[i].favorite === true) {
        isNotFavorite = 'hover-favorite-icon hidden';
        isFavorite = 'hover-favorite-icon';
        favoriteIcon = 'favorite-icon';
      }

      itemsArray.push(
        <div key={i} className='item-wrapper'>
          <Item
            item={this.state.items[i]}
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
    if (this.state.items.length === 0) {
      noItemMessage = 'no-item-message';
    } else {
      noItemMessage = 'no-item-message hidden';
    }

    return (
      <div className='items-view-container'>
        <div className='row spacing'>
          <div className='mobile-column-full'>
            <p className='items'>Items</p>
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
          Add Items
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
Items.contextType = AppContext;
