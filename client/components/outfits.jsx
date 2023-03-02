import React from 'react';

export default class Outfits extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      outfits: [],
      itemsForOutfit: [],
      outfitId: null
    };

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  async componentDidMount() {
    const outfitJson = await fetch('/api/outfits');
    const outfits = await outfitJson.json();
    const outfitItemsJson = await fetch('/api/outfitItems');
    const itemsForOutfit = await outfitItemsJson.json();
    this.setState({ outfits, itemsForOutfit });
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

  render() {
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
      outfitsArray.push(
        <div key={i} className='outfit-wrapper'>
          <Outfit
            items={itemsArray}
            outfit={this.state.outfits[i]}
            handleMouseEnter={this.handleMouseEnter}
            handleMouseLeave={this.handleMouseLeave}
            hover={hoverClassName}
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

    return (
      <div className='outfits-view-container'>
        <div className='row'>
          <div className='mobile-column-full'>
            <p className='outfits'>Outfits</p>
          </div>
        </div>
        <a href="#add-outfit" className='add-items-button'>
          <i className="fa-solid fa-plus" />
          Add Outfits
        </a>
        <p className={noItemMessage}>No outfits found. Let&rsquo;s add an outfit!</p>
        <div className='outfit-list-wrapper'>
          {outfitsArray}
        </div>
      </div>
    );
  }
}

function Outfit(props) {

  const items = props.items;

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

  const { outfitId, notes } = props.outfit;

  return (

    <div className='outfit-box-wrapper'>
      <div className='outfit-box-inner ' id={outfitId} onMouseEnter={props.handleMouseEnter}>
        {imageArray}
        {/* <div className={props.favoriteIcon}>
          <i className='fa-solid fa-heart item-stay ' />
        </div> */}
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
