import React from 'react';
import { ThreeDots } from 'react-loader-spinner';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';

export default class Outfits extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      outfits: [],
      itemsForOutfit: [],
      outfitId: null,
      loadingSpinner: true
    };

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleFavoriteClick = this.handleFavoriteClick.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      fetch(`/api/outfits/${this.context.user.userId}`)
        .then(res => res.json())
        .then(outfits => this.setState({ outfits }))
        .then(() => {
          return fetch(`/api/outfitItems/${this.context.user.userId}`);
        })
        .then(res => res.json())
        .then(itemsForOutfit => this.setState({ itemsForOutfit }))
        .then(() => {
          this.setState({
            loadingSpinner: false
          });
        });
    }, 2000);
  }

  handleMouseEnter(event) {
    this.setState({
      outfitId: event.target.id
    });
  }

  handleMouseLeave() {
    this.setState({
      outfitId: null
    });
  }

  handleFavoriteClick() {
    let favoriteStatus;
    const targetedOutfitId = Number(this.state.outfitId);
    for (let i = 0; i < this.state.outfits.length; i++) {
      if (this.state.outfits[i].outfitId === targetedOutfitId) {
        favoriteStatus = this.state.outfits[i].favorite;
      }
    }
    const status = { favorite: !favoriteStatus };

    fetch(`/api/outfitFavoriteUpdate/${this.state.outfitId}/${this.context.user.userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(status)
    });

    fetch(`/api/outfits/${this.context.user.userId}`)
      .then(res => res.json())
      .then(outfits => this.setState({ outfits }));
  }

  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;

    const outfitsArray = [];
    for (let i = 0; i < this.state.outfits.length; i++) {

      const itemsArray = [];
      for (let n = 0; n < this.state.itemsForOutfit.length; n++) {
        if (this.state.outfits[i].outfitId === this.state.itemsForOutfit[n].outfitId) {
          itemsArray.push(this.state.itemsForOutfit[n]);
        }
      }
      const targetedOutfitId = Number(this.state.outfitId);
      let hoverClassName = 'outfit-shadow-wrapper hidden';
      if (this.state.outfits[i].outfitId === targetedOutfitId) {
        hoverClassName = 'outfit-shadow-wrapper';
      } else {
        hoverClassName = 'outfit-shadow-wrapper hidden';
      }

      let isNotFavorite;
      let isFavorite;
      let favoriteIcon;
      if (this.state.outfits[i].favorite === false) {
        isNotFavorite = 'hover-favorite-icon';
        isFavorite = 'hover-favorite-icon hidden';
        favoriteIcon = 'favorite-icon hidden';
      } else if (this.state.outfits[i].favorite === true) {
        isNotFavorite = 'hover-favorite-icon hidden';
        isFavorite = 'hover-favorite-icon';
        favoriteIcon = 'favorite-icon';
      }
      outfitsArray.push(
        <div key={i} className='outfit-wrapper'>
          <Outfit
            items={itemsArray}
            outfit={this.state.outfits[i]}
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

    let noItemMessage;
    if (this.state.outfits.length === 0) {
      noItemMessage = 'no-item-message';
    } else {
      noItemMessage = 'no-item-message hidden';
    }

    let outfitsContainer;
    let loadingSpinner;
    if (this.state.loadingSpinner === true) {
      loadingSpinner = 'loading-spinner';
      outfitsContainer = 'hidden';
    } else if (this.state.loadingSpinner === false) {
      loadingSpinner = 'hidden';
      outfitsContainer = '';
    }

    return (
      <div className='outfits-view-container'>
        <div className='row'>
          <div className='mobile-column-full'>
            <p className='outfits'>Outfits</p>
          </div>
        </div>
        <a href="#add-outfit" className='add-items-button'>
          <i className="fa-solid fa-plus" />Add Outfits
        </a>
        <div className={loadingSpinner}>
          <ThreeDots
            height="80"
            width="80"
            radius="9"
            color="#8F8F8F"
            ariaLabel="three-dots-loading"
            wrapperStyle={{
              margin: '100px',
              display: 'block'
            }}
            wrapperClassName=""
            visible={true}
          />
        </div>
        <div className={outfitsContainer}>
          <p className={noItemMessage}>No outfits found. Let&rsquo;s add an outfit!</p>
          <div className='outfit-list-wrapper'>
            {outfitsArray}
          </div>
        </div>
      </div>
    );

  }
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
            <i className="fa-solid fa-pen outfit" />
          </a>
          <button type='button' className={props.isNotFavoriteIcon} onClick={props.handleFavoriteClick}><i className='fa-regular fa-heart outfit' /></button>
          <button type='button' className={props.isFavoriteIcon} onClick={props.handleFavoriteClick}><i className='fa-solid fa-heart outfit' /></button>
        </div>
      </div>
    </div>
  );
}
Outfits.contextType = AppContext;
