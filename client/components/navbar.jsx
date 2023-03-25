import React from 'react';
import AppContext from '../lib/app-context';
import AppDrawer from '../components/app-drawer';

export default class Navbar extends React.Component {
  render() {
    let signInIcon;
    if (this.context.user) {
      signInIcon = <><i className="fa-solid fa-right-from-bracket" /><p className='sign-out'>Sign Out</p></>;
    } else if (!this.context.user) {
      signInIcon = <i className='fa-solid fa-circle-user' />;
    }
    return (
      <nav className='navbar-wrapper'>
        <a className='wearly' href='#home'>Wearly</a>
        <AppDrawer />
        <a className="sign-in-icon-wrapper" href="#sign-up">
          {signInIcon}
        </a>
      </nav>
    );
  }
}
Navbar.contextType = AppContext;
