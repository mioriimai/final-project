import React from 'react';
// import Draggable from 'react-draggable';
import { Rnd } from 'react-rnd';

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
    this.handlePopupLeaveButtonClick = this.handlePopupLeaveButtonClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleOnDrag = this.handleOnDrag.bind(this);
  }

  componentDidMount() {
    fetch('/api/items')
      .then(res => res.json())
      .then(items => this.setState({ items }));
  }

  handleAddButtonClick() {
    this.setState({
      addItemPopup: true
    });
  }

  handlePopupLeaveButtonClick() {
    this.setState({
      addItemPopup: false
    });
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

  handleOnDrag(event, direction, ref, delta, position) {
    // create an object with update delta x and y
    let updateobject;
    for (let i = 0; i < this.state.chosenItems.length; i++) {
      const itemId = Number(event.target.id);
      if (itemId === this.state.chosenItems[i].itemId) {
        updateobject = this.state.chosenItems[i];
        updateobject.deltaX = direction.x;
        updateobject.deltaY = direction.y;
      }
    }
    // create a new array with the updated object
    const newChoseItems = this.state.chosenItems.map(v => {
      if (v.id === updateobject.itemId) {
        return updateobject;
      }
      return v;
    });

    this.setState({
      itemId: event.target.id,
      chosenItems: newChoseItems
    });
  }

  render() {

    // console.log('this.state:', this.state);

    // create draggable elements
    // const chosenItemsArray = [];
    // for (let i = 0; i < this.state.chosenItems.length; i++) {
    //   chosenItemsArray.push(
    //     <Draggable bounds="parent">
    //       <div className='test-element' style={{
    //         background: `url(${this.state.chosenItems[i].image})`,
    //         backgroundSize: 'contain',
    //         backgroundRepeat: 'no-repeat'
    //       }} />
    //     </Draggable>);
    // }

    const chosenItemsArray = [];
    for (let i = 0; i < this.state.chosenItems.length; i++) {

      chosenItemsArray.push(
        <Rnd className='rnd'
        default={{
          x: 0,
          y: 0,
          width: '170px',
          height: '200px',
          margin: 0
        }}
        style={{
          background: `url(${this.state.chosenItems[i].image})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat'
        }}
        dragAxis="both"
        enableResizing={{
          top: true,
          right: true,
          bottom: true,
          left: true,
          topRight: false,
          bottomRight: true,
          bottomLeft: true,
          topLeft: true
        }}
        bounds='parent'
        id={`${this.state.chosenItems[i].itemId}`}
        // onResize={this.onResize}
        onDrag={this.handleOnDrag}
         />);
    }

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
                    <div className='outfit-box-inner'>
                      {chosenItemsArray}
                      {/* <Draggable bounds="parent">
                        <div className='test-element' style={{
                          background: 'url("/images/IMG_5668-removebg-preview.png")',
                          backgroundSize: 'contain',
                          backgroundRepeat: 'no-repeat'
                        }} />
                      </Draggable> */}

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

        <div className={addItemPopup}>
          <div className='add-item-view-container'>
            <i className='fa-solid fa-circle-arrow-right' onClick={this.handlePopupLeaveButtonClick} />
            <div className='add-item-list-wrapper'>
              {itemsArray}
            </div>
            <div className='non-scroll' />
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
          className="add-item-image"
          onMouseEnter={props.handleMouseEnter}
          name={`${itemId}`}
        />
        <div className={props.hover} onMouseLeave={props.handleMouseLeave} onClick={props.handleItemClick}/>
      </div>
    </div>
  );
}
