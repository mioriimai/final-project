import React from 'react';
import Home from './pages/home';
import FormItem from './components/form-item';
import jwtDecode from 'jwt-decode';
import FormOutfit from './components/form-outfit';
import EditItem from './components/edit-item';
import EditOutfit from './components/edit-outfit';
import Items from './components/items';
import Outfits from './components/outfits';
import Favorites from './components/favorites';
import SignUp from './components/sign-up';
import SignIn from './components/sign-in';
import Navbar from './components/navbar';
import parseRoute from './lib/parse-route';
import PageContainer from './components/page-container';
import AppContext from './lib/app-context';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isAuthorizing: true,
      route: parseRoute(window.location.hash)
    };
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: parseRoute(window.location.hash)
      });
    });
    const token = window.localStorage.getItem('react-context-jwt');
    const user = token ? jwtDecode(token) : null;
    this.setState({ user, isAuthorizing: false });
  }

  handleSignIn(result) {
    const { user, token } = result;
    window.localStorage.setItem('react-context-jwt', token);
    this.setState({ user });
  }

  handleSignOut() {
    window.localStorage.removeItem('react-context-jwt');
    this.setState({ user: null });
  }

  renderPage() {
    const { route } = this.state;
    if (route.path === 'home' || route.path === '') {
      return <Home />;
    }
    if (route.path === 'add-item') {
      return <FormItem title="New Item" />;
    }
    if (route.path === 'items') {
      return <Items />;
    }
    if (route.path === 'item') {
      const itemId = route.params.get('itemId');
      return <EditItem itemId={itemId} />;
    }
    if (route.path === 'favorites') {
      return <Favorites />;
    }
    if (route.path === 'add-outfit') {
      return <FormOutfit />;
    }
    if (route.path === 'outfits') {
      return <Outfits />;
    }
    if (route.path === 'outfit') {
      const outfitId = route.params.get('outfitId');
      return <EditOutfit outfitId={outfitId} />;
    }
    if (route.path === 'sign-up') {
      return <SignUp />;
    }
    if (route.path === 'sign-in') {
      return <SignIn />;
    }

  }

  render() {
    if (this.state.isAuthorizing) return null;
    const { user, route } = this.state;
    const { handleSignIn, handleSignOut } = this;
    const contextValue = { user, route, handleSignIn, handleSignOut };
    return (
      <AppContext.Provider value={contextValue}>
        <>
          <Navbar />
          <PageContainer>
            { this.renderPage()}
          </PageContainer>
        </>
      </AppContext.Provider>
    );
  }
}
