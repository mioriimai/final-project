import React from 'react';
import { Rnd } from 'react-rnd';

export default class EditOutfit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      outfit: [],
      items: [],
      chosenItems: [],
      updatedNotes: null,
      itemId: null,
      addItemPopup: false,
      saved: false,
      savedOutfitId: null,
      reachedToTen: false
    };
    this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
    this.handlePopupLeaveButtonClick = this.handlePopupLeaveButtonClick.bind(this);
  }

  componentDidMount() {
    fetch(`/api/outfitItems/${this.props.outfitId}`)
      .then(res => res.json())
      .then(chosenItems => this.setState({ chosenItems }));

    fetch(`/api/outfits/${this.props.outfitId}`)
      .then(res => res.json())
      .then(outfit => this.setState({ outfit }));

    fetch('/api/items')
      .then(res => res.json())
      .then(items => this.setState({ items }));
  }

  handleAddButtonClick() {
    if (this.state.chosenItems.length < 10) {
      this.setState({
        addItemPopup: true
      });
    } else if (this.state.chosenItems.length >= 10) {
      this.setState({
        addItemPopup: false
      });
    }
  }

  handlePopupLeaveButtonClick() {
    this.setState({
      addItemPopup: false
    });
  }

  render() {

    // console.log('this.state:', this.state);

    // create array for the images of chose items
    const chosenItemsArray = [];
    for (let i = 0; i < this.state.chosenItems.length; i++) {
      const targetedItemId = Number(this.state.itemId);

      let hoverDeleteChosenItem = 'delete-chosen-item-icon-wrapper hidden';
      if (this.state.chosenItems[i].itemId === targetedItemId) {
        hoverDeleteChosenItem = 'delete-chosen-item-icon-wrapper';
      } else {
        hoverDeleteChosenItem = 'delete-chosen-item-icon-wrapper hidden';
      }

      let defaultSize;
      const left = `${this.state.chosenItems[i].deltaX}%`;
      const top = `${this.state.chosenItems[i].deltaY}%`;
      if (window.innerWidth > 768) {
        defaultSize = {
          // x: 0,
          // y: 0,
          width: '200px',
          height: '220px',
          margin: 0
        };
      } else if (window.innerWidth < 768) {
        defaultSize = {
          // x: 0,
          // y: 0,
          width: '130px',
          height: '150px',
          margin: 0
        };
      }

      chosenItemsArray.push(
        <Rnd key={i}
          className='rnd'
          /* onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave} */
          default={defaultSize}
          style={{
            backgroundImage: `url(${this.state.chosenItems[i].image})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            left: `${left}`,
            top: `${top}`
          }}
          dragAxis="both"
          enableResizing={{
            top: false,
            right: false,
            bottom: false,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false
          }}
          bounds='parent'
          id={`${this.state.chosenItems[i].itemId}`}
          onDrag={this.handleOnDrag}
        >
          <div className={hoverDeleteChosenItem} >
            <i className='fa-regular fa-circle-xmark chosen-item' onClick={this.handleDeleteChoseItemClick} />
          </div>
        </Rnd>
      );
    }

    // create array for items options
    const itemsArray = [];
    for (let i = 0; i < this.state.items.length; i++) {
      const targetedItemId = Number(this.state.itemId);

      let hoverClassName = 'shadow-wrapper hidden';
      if (this.state.items[i].itemId === targetedItemId) {
        hoverClassName = 'add-outfit-shadow-wrapper';
      } else {
        hoverClassName = 'add-outfit-shadow-wrapper hidden';
      }

      itemsArray.push(
        <div key={i} className="add-item-wrapper">
          <Item
            item={this.state.items[i]}
            // handleMouseEnter={this.handleMouseEnter}
            // handleMouseLeave={this.handleMouseLeave}
            state={this.state}
            hover={hoverClassName}
            // handleItemClick={this.handleItemClick}
          />
        </div>
      );
    }

    let addItemPopup;
    if (this.state.addItemPopup === true) {
      addItemPopup = 'add-item-popup';
    } else if (this.state.addItemPopup === false) {
      addItemPopup = 'hidden';
    }

    let upToTenMessage;
    let reachedToTenMessage;
    if (this.state.chosenItems.length <= 9) {
      upToTenMessage = 'up-to-ten-message';
      reachedToTenMessage = 'hidden';
    } else if (this.state.chosenItems.length > 9) {
      upToTenMessage = 'hidden';
      reachedToTenMessage = 'reached-to-ten-message';
    }

    let placeholderClassName = 'item-image-placeholder';
    let uploadMessage = 'upload-from-camera-roll';
    if (this.state.chosenItems.length > 0) {
      placeholderClassName = 'hidden';
      uploadMessage = 'upload-from-camera-roll hidden';
    }

    // save confirm popup-window
    const popup = this.state.saved ? 'pop-up' : 'pop-up hidden';

    // console.log('this.state:', this.state);
    return (
      <>
        <form /* onSubmit={this.handleSubmit} */>
          <div className='form-outfit-container'>
            <div className='form-outfit-white-box'>
              <div className='row'>
                <div className='column-full'>
                  <p className='form-outfit-title'>Edit Outfit</p>
                </div>
              </div>
              <div className='row'>
                <div className='column-half'>
                  <div className='outfit-box' >
                    <div className='outfit-box-inner' >
                      {chosenItemsArray}
                      <img src="/images/image-placeholder.png" alt="placeholder" className={placeholderClassName} />

                      <p className={uploadMessage}>Add an item to create outfit.</p>
                    </div>
                  </div>
                </div>
                <div className='column-half'>
                  <div className='row'>
                    <button type='button' className='add-item-to-outfit-button' onClick={this.handleAddButtonClick}><i className='fa-solid fa-plus outfit' />Add an Item</button>
                  </div>
                  <div className='row'>
                    <p className={upToTenMessage}><i className='fa-regular fa-lightbulb' />You can add up to 10 items.</p>
                    <p className={reachedToTenMessage}><i className='fa-solid fa-circle-exclamation' />You reached to 10 items.</p>
                  </div>
                  <div className='row'>
                    <label htmlFor="notes" className='outfit-notes'>Notes</label>
                  </div>
                  <div className='row'>
                    <textarea name="notes" id='outfit-notes' value={this.state.notes} /* onChange={this.handleNotesChange} */ />
                  </div>
                  <div className='row outfit-save-button-wrapper'>
                    <button type='submit' className='outfit-save-button'>SAVE</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className={addItemPopup}>
          <div className='add-item-view-container'>
            <i className='fa-solid fa-circle-arrow-right' onClick={this.handlePopupLeaveButtonClick} />
            <div className='add-item-list-wrapper'>
              {itemsArray}
            </div>
            <div className='non-scroll' />
          </div>
        </div>

        <div className={popup}>
          <div className='saved-popup-text-wrapper'>
            <h1 className='successfully-saved'>Successfully saved!</h1>
            <a className='add-more-items' href='#add-outfit' /* onClick={this.handleSaveConfirmPopupClick} */>Add More Outfits</a>
            <br />
            <a className='see-items' href='#outfits' /* onClick={this.handleSaveConfirmPopupClick} */>See Your Outfits</a>
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
          className="add-item-image"
          onMouseEnter={props.handleMouseEnter}
          name={`${itemId}`}
        />
        <div className={props.hover} onMouseLeave={props.handleMouseLeave} onClick={props.handleItemClick} />
      </div>
    </div>
  );
}
