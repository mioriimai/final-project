import React from 'react';
import AppContext from '../lib/app-context';
import AppDrawer from '../components/app-drawer';

export default class Navbar extends React.Component {
  render() {
    return (
      <nav className='navbar-wrapper'>
        <a className='wearly' href='#home'>Wearly</a>
        <AppDrawer />
        <a href="#sign-up">
          <i className='fa-solid fa-circle-user'/>
        </a>
      </nav>
    );
  }
}
Navbar.contextType = AppContext;
