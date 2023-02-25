import React from 'react';

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
                  <p>test</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
