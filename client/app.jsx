import React from 'react';
import Home from './pages/home';
// import AppContext from './lib/app-context';
import Navbar from './components/navbar';
import parseRoute from './lib/parse-route';

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

  render() {
    return (
    // <AppContext.Provider>
      <>
        <Navbar />
        <Home/>
      </>
    // </AppContext.Provider>
    );
  }
}
