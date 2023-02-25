import React from 'react';
import Draggable from 'react-draggable';

export default class FormOutfit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addItemPopup: false,
      items: [],
      chosenItems: []
    };
    this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
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

  render() {

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
          <div className='choose-item-items-container'>
            <p>test</p>
          </div>
        </div>

      </>
    );
  }
}
