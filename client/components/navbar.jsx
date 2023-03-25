import React from 'react';
import AppContext from '../lib/app-context';
import AppDrawer from '../components/app-drawer';

export default class Navbar extends React.Component {
  render() {
    const { user, handleSignOut } = this.context;
    let signInIcon;
    if (user !== null) {
      signInIcon = <a className="sign-in-icon-wrapper" onClick={handleSignOut} ><i className="fa-solid fa-right-from-bracket" /><p className='sign-out'>Sign Out</p></a>;
    } else if (user === null) {
      signInIcon = <a className="sign-in-icon-wrapper" href="#sign-in"><i className='fa-solid fa-circle-user' /></a >;
    }
    return (
      <nav className='navbar-wrapper'>
        <a className='wearly' href='#home'>Wearly</a>
        <AppDrawer />
        {signInIcon}
      </nav>
    );
  }
}
Navbar.contextType = AppContext;
