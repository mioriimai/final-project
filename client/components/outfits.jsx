import React from 'react';

export default class Outfits extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      outfits: [],
      itemsForOutfit: [],
      outfitId: null
    };
  }

  componentDidMount() {
    fetch('/api/outfitItems')
      .then(res => res.json())
      .then(itemsForOutfit => this.setState({ itemsForOutfit }));

    fetch('/api/outfits')
      .then(res => res.json())
      .then(outfits => this.setState({ outfits }));
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
      outfitsArray.push(
        <div key={i} className='outfit-wrapper'>
          <Outfit
            items={itemsArray}
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
    let left;
    let top;
    let width;
    let height;
    if (window.innerWidth > 768) {
      left = `${items[r].deltaX}%`;
      top = `${items[r].deltaY}%`;
      width = '200px';
      height = '220px';
    } else if (window.innerWidth < 768) {
      left = items[r].deltaX;
      left = `${left}%`;
      top = items[r].deltaY;
      top = `${top}%`;
      width = '130px';
      height = '150px';
    }

    imageArray.push(
      <img key={r}
      src={items[r].image}
      alt={`outfit${r}`}
      className='test'
      style={{
        position: 'absolute',
        left: `${left}`,
        top: `${top}`,
        width: `${width}`,
        height: `${height}`
      }}
      // onMouseEnter={this.handleMouseEnter}
      // onMouseLeave={this.handleMouseLeave}
      />
    );
  }

  return (

    <div className='outfit-box no-margin'>
      <div className='outfit-box-inner'>
        {imageArray}
      </div>
    </div>
  );
}
