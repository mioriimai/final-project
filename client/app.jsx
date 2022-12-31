import React from 'react';
import Home from './pages/home';
import AppContext from './lib/app-context';
import Navbar from './components/navbar';

export default class App extends React.Component {
  render() {
    return (
      <AppContext.Provider>
        <>
          <Navbar />
          <Home/>
        </>
      </AppContext.Provider>
    );
  }
}
