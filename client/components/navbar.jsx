import React from 'react';
import AppContext from '../lib/app-context';
import AppDrawer from '../components/app-drawer';

export default class Navbar extends React.Component {
  render() {
    return (
      <nav className='navbar-wrapper'>
        <a className='your-closet' href='#home'>Your Closet</a>
        <AppDrawer />
      </nav>
    );
  }
}
Navbar.contextType = AppContext;
