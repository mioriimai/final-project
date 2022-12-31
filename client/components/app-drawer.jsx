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
    return (
      <i className="fa-solid fa-bars" />
    );
  }
}
