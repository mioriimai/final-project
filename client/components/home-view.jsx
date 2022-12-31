import React from 'react';

export default class HomeView extends React.Component {
  render() {
    return (
      <>
        <p>Wanna organize your closet digitally?</p>
        <a className='add-item-button' href="#add-item">Add an Item</a>
        <br />
        <a className='add-outfit-button' href="#add-outfit">Add an Outfit</a>
        <p>What are you going to wear today?</p>
        <a className='see-items-button' href="#items">See Items</a>
        <br />
        <a className='see-outfits-button' href="#outfits">See Outfits</a>
      </>
    );
  }
}
