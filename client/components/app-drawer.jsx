import React from 'react';

export default class AppDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpened: false
    };
    this.handleMenuIconClick = this.handleMenuIconClick.bind(this);
    this.handleLinksOrShadeClick = this.handleLinksOrShadeClick.bind(this);
  }

  handleMenuIconClick() {
    this.setState({
      isMenuOpened: true
    });
  }

  handleLinksOrShadeClick() {
    this.setState({
      isMenuOpened: false
    });
  }

  render() {
    const classNameOfMenu = this.state.isMenuOpened ? 'menu is-active' : 'menu';
    const classNameOfBackground = this.state.isMenuOpened ? 'menu-background is-active' : 'menu-background';
    return (
      <>
        <i className="fa-solid fa-bars" onClick={this.handleMenuIconClick} />
        <nav className={classNameOfMenu} onClick={this.handleLinksOrShadeClick}>
          <ul className='menu-list'>
            <li className='menu-item'>
              <a href="#home" className='item-menu'>Menu</a>
            </li>
            <li className='menu-item'>
              <a href="#items" className='item-items'>Items</a>
            </li>
            <li className='menu-item'>
              <a href="#outfits" className='item-outfits'>Outfits</a>
            </li>
            <li className='menu-item'>
              <a href="#favorites" className='item-favorites'>Favorites</a>
            </li>
          </ul>
        </nav>
        <div className={classNameOfBackground} onClick={this.handleLinksOrShadeClick} />
      </>
    );
  }
}
