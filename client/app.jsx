import React from 'react';
import Home from './pages/home';
import ItemView from './pages/item-view';
// import AppContext from './lib/app-context';
import Navbar from './components/navbar';
import parseRoute from './lib/parse-route';
import PageContainer from './components/page-container';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: parseRoute(window.location.hash)
    };
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
  }

  renderPage() {
    const { path } = this.state.route;
    if (path === 'home' || path === '') {
      return <Home />;
    }
    if (path === 'add-item') {
      return <ItemView />;
    }
  }

  render() {
    return (
    // <AppContext.Provider>
      <>
        <Navbar />
        <PageContainer>
          { this.renderPage()}
        </PageContainer>
        {/* <Home/> */}
      </>
    // </AppContext.Provider>
    );
  }
}
