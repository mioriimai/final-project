import React from 'react';

export default class FormItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favoriteItems: [],
      favoriteOutfits: [],
      itemsForOutfit: [],
      itemId: null,
      outfitId: null,
      showItems: true,
      showOutfits: false
    };
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleFavoriteClick = this.handleFavoriteClick.bind(this);
    this.handleItemsButtonClick = this.handleItemsButtonClick.bind(this);
    this.handleOutfitsButtonClick = this.handleOutfitsButtonClick.bind(this);
  }

  componentDidMount() {
    fetch('/api/favoriteItems')
      .then(res => res.json())
      .then(favoriteItems => this.setState({ favoriteItems }));

    fetch('/api/favoriteOutfits')
      .then(res => res.json())
      .then(favoriteOutfits => this.setState({ favoriteOutfits }));

    fetch('/api/outfitItems')
      .then(res => res.json())
      .then(itemsForOutfit => this.setState({ itemsForOutfit }));
  }

  handleMouseEnter(event) {
    this.setState({
      itemId: event.target.name,
      outfitId: event.target.id
    });
  }

  handleMouseLeave() {
    this.setState({
      itemId: null,
      outfitId: null
    });
  }

  handleFavoriteClick() {
    if (this.state.showItems === true) {
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
      fetch('/api/favoriteItems')
        .then(res => res.json())
        .then(favoriteItems => this.setState({ favoriteItems }));

    } else if (this.state.showOutfits === true) {
      let favoriteStatus;
      const targetedOutfitId = Number(this.state.outfitId);
      for (let i = 0; i < this.state.favoriteOutfits.length; i++) {
        if (this.state.favoriteOutfits[i].outfitId === targetedOutfitId) {
          favoriteStatus = this.state.favoriteOutfits[i].favorite;
        }
      }
      const status = { favorite: !favoriteStatus };

      // Use fetch() to send a PATCH request to update item's favorite status
      fetch(`/api/outfitFavoriteUpdate/${this.state.outfitId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(status)
      });

      // Use fetch() to send a GET request to get all outfits that have favorite=true.
      fetch('/api/favoriteOutfits')
        .then(res => res.json())
        .then(favoriteOutfits => this.setState({ favoriteOutfits }));
    }
  }

  handleItemsButtonClick() {
    if (this.state.showItems === false) {
      this.setState({
        showItems: !this.state.showItems,
        showOutfits: !this.state.showOutfits
      });
    }
  }

  handleOutfitsButtonClick() {
    if (this.state.showOutfits === false) {
      this.setState({
        showItems: !this.state.showItems,
        showOutfits: !this.state.showOutfits
      });
    }
  }

  render() {
    // console.log('this.state:', this.state);

    // create arrays for favorite items
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

    // create arrays for favorite outfits
    const outfitsArray = [];
    for (let i = 0; i < this.state.favoriteOutfits.length; i++) {

      const itemsArray = [];
      for (let n = 0; n < this.state.itemsForOutfit.length; n++) {
        if (this.state.favoriteOutfits[i].outfitId === this.state.itemsForOutfit[n].outfitId) {
          itemsArray.push(this.state.itemsForOutfit[n]);
        }
      }
      const targetedOutfitId = Number(this.state.outfitId);
      let hoverClassName = 'outfit-shadow-wrapper hidden';
      if (this.state.favoriteOutfits[i].outfitId === targetedOutfitId) {
        hoverClassName = 'outfit-shadow-wrapper';
      } else {
        hoverClassName = 'outfit-shadow-wrapper hidden';
      }

      let isNotFavorite;
      let isFavorite;
      let favoriteIcon;
      if (this.state.favoriteOutfits[i].favorite === false) {
        isNotFavorite = 'hover-favorite-icon';
        isFavorite = 'hover-favorite-icon hidden';
        favoriteIcon = 'favorite-icon hidden';
      } else if (this.state.favoriteOutfits[i].favorite === true) {
        isNotFavorite = 'hover-favorite-icon hidden';
        isFavorite = 'hover-favorite-icon';
        favoriteIcon = 'favorite-icon';
      }
      outfitsArray.push(
        <div key={i} className='outfit-wrapper'>
          <Outfit
            items={itemsArray}
            outfit={this.state.favoriteOutfits[i]}
            handleMouseEnter={this.handleMouseEnter}
            handleMouseLeave={this.handleMouseLeave}
            hover={hoverClassName}
            isNotFavoriteIcon={isNotFavorite}
            isFavoriteIcon={isFavorite}
            favoriteIcon={favoriteIcon}
            handleFavoriteClick={this.handleFavoriteClick}
          />
        </div>
      );
    }

    let list;
    if (this.state.showItems === true) {
      list = itemsArray;
    } else if (this.state.showOutfits === true) {
      list = outfitsArray;
    }

    let noItemMessage;
    if (this.state.favoriteItems.length === 0 && this.state.showItems === true) {
      noItemMessage = 'no-item-message';
    } else {
      noItemMessage = 'no-item-message hidden';
    }

    let noOutfitMessage;
    if (this.state.favoriteOutfits.length === 0 && this.state.showOutfits === true) {
      noOutfitMessage = 'no-item-message';
    } else {
      noOutfitMessage = 'no-item-message hidden';
    }

    let addButton;
    if (this.state.showItems === true) {
      addButton = 'Items';
    } else if (this.state.showOutfits === true) {
      addButton = 'Outfits';
    }

    let itemsButton;
    let outfitsButton;
    if (this.state.showItems === true) {
      itemsButton = 'favorites-items-button';
      outfitsButton = 'favorites-outfits-button-light';
    } else if (this.state.showOutfits === true) {
      itemsButton = 'favorites-items-button-light';
      outfitsButton = 'favorites-outfits-button';
    }

    return (
      <div className='items-view-container'>
        <div className='row spacing'>
          <div className='favorites-title-and-buttons-wrapper'>
            <p className='favorites'>Favorites</p>
            <button type='button' className={itemsButton} onClick={this.handleItemsButtonClick}>Items</button>
            <button type='button' className={outfitsButton} onClick={this.handleOutfitsButtonClick}>Outfits</button>
          </div>
        </div>
        <a href="#add-item" className='add-items-button'>
          <i className="fa-solid fa-plus" />
          Add {addButton}
        </a>
        <p className={noItemMessage}>There is no item in your favorite list.</p>
        <p className={noOutfitMessage}>There is no outfit in your favorite list.</p>
        <div className='item-list-wrapper'>
          {list}
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

function Outfit(props) {

  const items = props.items;
  const { outfitId, notes } = props.outfit;

  const imageArray = [];
  for (let r = 0; r < items.length; r++) {
    const left = `${items[r].deltaX}%`;
    const top = `${items[r].deltaY}%`;
    let width;
    let height;
    if (window.innerWidth > 768) {
      width = '200px';
      height = '220px';
    } else if (window.innerWidth < 768) {
      width = '130px';
      height = '150px';
    }
    imageArray.push(
      <img key={r}
        id={items[r].outfitId}
        src={items[r].image}
        alt={`outfit${items[r].outfitId}`}
        className='test'
        style={{
          position: 'absolute',
          left: `${left}`,
          top: `${top}`,
          width: `${width}`,
          height: `${height}`
        }}
      />
    );
  }

  return (
    <div className='outfit-box-wrapper'>
      <div className='outfit-box-inner ' id={outfitId} onMouseEnter={props.handleMouseEnter}>
        {imageArray}
        <div className={props.favoriteIcon}>
          <i className='fa-solid fa-heart item-stay outfit' />
        </div>
        <div className={props.hover} onMouseLeave={props.handleMouseLeave}>
          <p className='show-outfit-notes'>{notes}</p>
          <a href={`#outfit?outfitId=${outfitId}`}>
            <i className="fa-solid fa-pen item" />
          </a>
          <button type='button' className={props.isNotFavoriteIcon} onClick={props.handleFavoriteClick}><i className='fa-regular fa-heart item' /></button>
          <button type='button' className={props.isFavoriteIcon} onClick={props.handleFavoriteClick}><i className='fa-solid fa-heart item' /></button>
        </div>
      </div>
    </div>
  );
}
