import React from 'react';
import AppContext from '../lib/app-context';
import AppDrawer from '../components/app-drawer';

export default class Navbar extends React.Component {
  render() {
    // const { user, handleSignOut } = this.context;
    return (
      <nav className='navbar-wrapper'>
        <a className='your-closet' href='#home'>Your Closet</a>
        {/* <i className="fa-solid fa-bars" /> */}
        <AppDrawer />
      </nav>
    );
  }
}
Navbar.contextType = AppContext;
