import React from 'react';
import Draggable from 'react-draggable';

export default class FormOutfit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
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
                      <p className='test'>test</p>
                    </Draggable>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
