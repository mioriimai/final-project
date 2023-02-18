import React from 'react';
import Home from './pages/home';
// import ItemView from './pages/item-view';
import FormItem from './components/form-item';
import EditItem from './components/edit-item';
import ListView from './pages/list-view';
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
    const { route } = this.state;
    if (route.path === 'home' || route.path === '') {
      return <Home />;
    }
    if (route.path === 'add-item') {
      return <FormItem title="New Item" />;
    }
    if (route.path === 'items') {
      return <ListView />;
    }
    if (route.path === 'item') {
      const itemId = route.params.get('itemId');
      return <EditItem itemId={itemId} />;
    }
  }

  render() {
    return (
      <>
        <Navbar />
        <PageContainer>
          { this.renderPage()}
        </PageContainer>
      </>
    );
  }
}
