import React from 'react';
import AppContext from '../lib/app-context';

export default class Navbar extends React.Component {
  render() {
    // const { user, handleSignOut } = this.context;
    return (
      <nav className='navbar-wrapper'>
        <a className='your-closet' href='#home'>Your Closet</a>
        <i className="fa-solid fa-bars" />
      </nav>
    );
  }
}
Navbar.contextType = AppContext;
