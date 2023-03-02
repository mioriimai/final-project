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
      reachedToTen: false,
      deleteConfirmation: false
    };
    this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
    this.handlePopupLeaveButtonClick = this.handlePopupLeaveButtonClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleOnDrag = this.handleOnDrag.bind(this);
    this.handleDeleteChoseItemClick = this.handleDeleteChoseItemClick.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.handleSaveConfirmPopupClick = this.handleSaveConfirmPopupClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDeleteConfirmPopupClick = this.handleDeleteConfirmPopupClick.bind(this);
    this.handleDeleteOutfit = this.handleDeleteOutfit.bind(this);
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

  handleMouseEnter(event) {
    if (event.target.name === undefined) {
      this.setState({
        itemId: event.target.id
      });
    } else {
      this.setState({
        itemId: event.target.name
      });
    }
  }

  handleMouseLeave() {
    this.setState({
      itemId: null
    });
  }

  handleItemClick() {
    fetch(`/api/items/${this.state.itemId}`)
      .then(res => res.json())
      .then(chosenItems => {
        chosenItems.deltaX = 0;
        chosenItems.deltaY = 0;
        const newChoseItems = [...this.state.chosenItems, chosenItems];
        this.setState({
          chosenItems: newChoseItems,
          addItemPopup: false
        });
      });
  }

  handleOnDrag(event, ui) {
    // change delta X and Y and perventage
    let width;
    let height;
    if (window.innerWidth > 768) {
      width = 440;
      height = 460;
    } else if (window.innerWidth < 768) {
      width = 280;
      height = 300;
    }

    // update chosenItem array with new deltaX and Y
    const copyChosenItems = [...this.state.chosenItems];
    const newChosenItems = [];
    const targetItemId = Number(event.target.id);
    copyChosenItems.forEach(item => {
      if (item.itemId === targetItemId) {
        const xPercent = Math.round(ui.x / width * 100);
        const yPercent = Math.round(ui.y / height * 100);
        newChosenItems.push({ ...item, deltaX: xPercent, deltaY: yPercent });
      } else {
        newChosenItems.push(item);
      }
    });
    this.setState({
      chosenItems: newChosenItems
    });
  }

  handleDeleteChoseItemClick() {
    const copyChosenItems = [...this.state.chosenItems];
    const targetId = Number(this.state.itemId);
    const newChosenItems = copyChosenItems.filter(v => v.itemId !== targetId);
    this.setState({
      chosenItems: newChosenItems
    });
  }

  handleNotesChange(event) {
    this.setState({
      updatedNotes: event.target.value
    });
  }

  handleSubmit(event) {

    // prevent the default form submission behavior.
    event.preventDefault();

    let updatedNotes;
    if (this.state.updatedNotes === null) {
      updatedNotes = this.state.outfit.notes;
    } else {
      updatedNotes = this.state.updatedNotes;
    }
    const newNotes = { notes: updatedNotes };

    fetch(`/api/outfitsNotes/${this.props.outfitId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newNotes)
    })
      .then(res => res.json())
      .then(data => {
        this.setState({
          saved: true,
          updatedNotes: ''
        });
      })
      .catch(err => console.error(err));

    fetch(`/api/outfitItems/${this.props.outfitId}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(data => {
        this.setState({
          saved: true
        });
      })
      .catch(err => console.error(err));
  }

  handleSaveConfirmPopupClick() {

    // Use fetch to send a post request to /api/store-item-for-outfit.
    for (let i = 0; i < this.state.chosenItems.length; i++) {

      if (i < this.state.chosenItems.length - 1) {
        // Create a `new` FormData object.
        const formDataItem = new FormData();

        const deltaX = Math.round(this.state.chosenItems[i].deltaX);
        const deltaY = Math.round(this.state.chosenItems[i].deltaY);

        //  Append entries to the form data object I created.
        formDataItem.append('userId', 1);
        formDataItem.append('outfitId', this.props.outfitId);
        formDataItem.append('itemId', this.state.chosenItems[i].itemId);
        formDataItem.append('deltaX', deltaX);
        formDataItem.append('deltaY', deltaY);

        fetch('/api/store-item-for-outfit', {
          method: 'POST',
          body: formDataItem
        })
          .then(res => res.json())
          .catch(err => console.error(err));

      } else if (i === this.state.chosenItems.length - 1) { // post the last item in the array
        // Create a `new` FormData object.
        const formDataItem = new FormData();

        const deltaX = Math.round(this.state.chosenItems[i].deltaX);
        const deltaY = Math.round(this.state.chosenItems[i].deltaY);

        //  Append entries to the form data object I created.
        formDataItem.append('userId', 1);
        formDataItem.append('outfitId', this.props.outfitId);
        formDataItem.append('itemId', this.state.chosenItems[i].itemId);
        formDataItem.append('deltaX', deltaX);
        formDataItem.append('deltaY', deltaY);

        fetch('/api/store-item-for-outfit', {
          method: 'POST',
          body: formDataItem
        })
          .then(res => res.json())
          .then(data => {
            this.setState({
              chosenItems: [],
              switchView: true
            });
          })
          .catch(err => console.error(err));
      }
    }
  }

  handleDeleteConfirmPopupClick() {
    this.setState({
      deleteConfirmation: !this.state.deleteConfirmation
    });
  }

  handleDeleteOutfit() {
    // Use fetch() to send a DELETE request to /api/outfits.
    fetch(`/api/outfits/${this.props.outfitId}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .catch(err => console.error(err));

    // Use fetch() to send a DELETE request to /api/outfitItems.
    fetch(`/api/outfitItems/${this.props.outfitId}`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .catch(err => console.error(err));
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
      if (window.innerWidth > 768) {
        const newX = this.state.chosenItems[i].deltaX * 440 / 100;
        const newY = this.state.chosenItems[i].deltaY * 460 / 100;
        defaultSize = {
          x: newX,
          y: newY,
          width: '200px',
          height: '220px',
          margin: 0
        };
      } else if (window.innerWidth < 768) {
        const newXForMobile = this.state.chosenItems[i].deltaX * 280 / 100;
        const newYForMobile = this.state.chosenItems[i].deltaY * 300 / 100;
        defaultSize = {
          x: newXForMobile,
          y: newYForMobile,
          width: '130px',
          height: '150px',
          margin: 0
        };
      }

      chosenItemsArray.push(
        <Rnd key={i}
          className='rnd'
          onMouseEnter={this.handleMouseEnter}
           onMouseLeave={this.handleMouseLeave}
          default={defaultSize}
          style={{
            backgroundImage: `url(${this.state.chosenItems[i].image})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
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
            handleMouseEnter={this.handleMouseEnter}
            handleMouseLeave={this.handleMouseLeave}
            state={this.state}
            hover={hoverClassName}
            handleItemClick={this.handleItemClick}
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

    let valueOfNotes = this.state.outfit.notes;
    if (this.state.updatedNotes !== null) {
      valueOfNotes = this.state.updatedNotes;
    }

    // save confirm popup-window
    const popup = this.state.saved ? 'pop-up' : 'pop-up hidden';

    // show or hide deleteConfirmPopup
    const deleteConfirmPopup = this.state.deleteConfirmation ? 'pop-up' : 'pop-up hidden';

    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <div className='form-outfit-container'>
            <div className='form-outfit-white-box'>
              <div className='row'>
                <div className='column-full'>
                  <p className='form-outfit-title'>Edit Outfit</p>
                </div>
              </div>
              <div className='row'>
                <div className='column-half mobile-dele-icon-position'>
                  <div className='outfit-box' >
                    <div className='outfit-box-inner' >
                      {chosenItemsArray}
                      <img src="/images/image-placeholder.png" alt="placeholder" className={placeholderClassName} />
                      <p className={uploadMessage}>Add an item to create outfit.</p>
                    </div>
                  </div>
                  <div className='mobile-column-half'>
                    <button type='button' className='outfit-delete-confirm-button' onClick={this.handleDeleteConfirmPopupClick}>
                      <i className="fa-regular fa-trash-can outfit" />
                      Delete</button>
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
                    <textarea name="notes" id='outfit-notes' value={valueOfNotes} onChange={this.handleNotesChange} />
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
          <div className='saved-popup-text-wrapper-outfit'>
            <h1 className='successfully-saved'>Successfully saved!</h1>
            <a className='add-more-items' href='#add-outfit' onClick={this.handleSaveConfirmPopupClick}>Add More Outfits</a>
            <br />
            <a className='see-items' href='#outfits' onClick={this.handleSaveConfirmPopupClick}>See Your Outfits</a>
          </div>
        </div>

        <div className={deleteConfirmPopup}>
          <div className='saved-popup-text-wrapper'>
            <h1 className='delete-confirm-message'>Are you sure you want to delete this item? <br />This process can&rsquo;t be undone.</h1>
            <button className='cancel-delete-button' type='button' onClick={this.handleDeleteConfirmPopupClick} >Cancel</button>
            <a className='delete-item-button' href='#outfits' onClick={this.handleDeleteOutfit} >Delete</a>
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
