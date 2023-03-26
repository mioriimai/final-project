import React from 'react';
import AppContext from '../lib/app-context';
import Redirect from '../components/redirect';

export default class SignIn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      valid: ''
    };
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeUsername(event) {
    this.setState({
      username: event.target.value
    });
  }

  handleChangePassword(event) {
    this.setState({
      password: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const req = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.state)
    };
    fetch('/api/auth/sign-in', req)
      .then(res => res.json())
      .then(result => {
        if (result.user && result.token) {
          this.context.handleSignIn(result);
          window.location.hash = '#';
        } else {
          this.setState({ valid: false });
        }
      });
  }

  render() {

    const { user } = this.context;
    if (user) return <Redirect to="" />;

    let validationMessage;
    if (this.state.valid === false) {
      validationMessage = 'signin-validation-message';
    } else {
      validationMessage = 'hidden';
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <div className='sign-up-container'>
          <div className='sign-in-white-box'>
            <div className='row'>
              <h2 className='sign-up'>Sign In</h2>
            </div>
            <div className='row username-wrapper'>
              <label htmlFor='username' className='sign-up-username'>
                Username<br />
                <input required type="text" id='username' name='username' className='sign-up-username-input' value={this.state.username} onChange={this.handleChangeUsername} autoComplete='on' />
              </label>
            </div>
            <div className='row password-wrapper'>
              <label htmlFor='password' className='sign-up-password'>
                Password<br />
                <input required type='password' id='password' name='password' className='sign-up-password-input' value={this.state.password} onChange={this.handleChangePassword} autoComplete='on' />
              </label>
              <p className={validationMessage}>The username or password is incorrect.</p>
            </div>
            <div className='row'>
              <button type='submit' className='confirm-sign-in-button'>
                Sign In
              </button>
            </div>
            <div className='row'>
              <p className='have-an-account'>Don&rsquo;t have an account?<a href="#sign-up" className='sign-in-button'>Sign Up</a></p>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
SignIn.contextType = AppContext;
