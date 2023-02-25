import React from 'react';
import Draggable from 'react-draggable';

export default class FormOutfit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addItemPopup: false,
      items: [],
      itemId: null,
      chosenItems: []
    };
    this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleAddButtonClick() {
    this.setState({
      addItemPopup: !this.state.addItemPopup
    });
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
      <>
        <form>
          <div className='form-outfit-container'>
            <div className='form-outfit-white-box'>
              <div className='row'>
                <div className='column-full'>
                  <p className='form-outfit-title'>New Outfit</p>
                </div>
              </div>
              <div className='row'>
                <div className='column-half'>
                  <div className='outfit-box'>
                    <div style={{ width: '435px', height: '455px', padding: '10px', margin: '1.5px', verticalAlign: 'middle' }}>
                      <Draggable bounds="parent">
                        <div className='test-element' style={{
                          background: 'url("/images/IMG_5668-removebg-preview.png")',
                          backgroundSize: 'contain',
                          backgroundRepeat: 'no-repeat'
                        }} />
                      </Draggable>
                    </div>
                  </div>
                </div>
                <div className='column-half'>
                  <div className='row'>
                    <button type='button' className='add-item-to-outfit-button' onClick={this.handleAddButtonClick}><i className='fa-solid fa-plus outfit' />Add an Item</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className='choose-item-popup'>
          <div className='choose-item-view-container'>
            <div className='choose-items-wrapper'>
              {itemsArray}
            </div>
          </div>
        </div>

      </>
    );
  }
}

function Item(props) {
  const { image, itemId } = props.item;

  return (
    <div className='item-button' >
      <div className='position'>
        <img
          src={image}
          // alt={`Item ${itemId}`}
          className="item-image"
          onMouseEnter={props.handleMouseEnter}
          name={`${itemId}`}
        />
        {/* <div className={props.favoriteIcon}>
          <i className='fa-solid fa-heart item-stay ' />
        </div> */}
        <div className={props.hover} onMouseLeave={props.handleMouseLeave}>
          {/* <p className='items-notes'>{notes}</p>
          <a href={`#item?itemId=${itemId}`}>
            <i className="fa-solid fa-pen item" />
          </a>
          <button type='button' className={props.isNotFavoriteIcon} onClick={props.handleFavoriteClick}><i className='fa-regular fa-heart item' /></button>
          <button type='button' className={props.isFavoriteIcon} onClick={props.handleFavoriteClick}><i className='fa-solid fa-heart item' /></button> */}
        </div>
      </div>
    </div>
  );
}
