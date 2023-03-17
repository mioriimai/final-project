import React from 'react';

export default class SignIn extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  render() {
    return (
      <form /* onSubmit={this.handleSubmit} */>
        <div className='sign-up-container'>
          <div className='sign-up-white-box'>
            <div className='row'>
              <h2 className='sign-up'>Sign In</h2>
            </div>
            <div className='row username-wrapper'>
              <label htmlFor="usename" className='sign-up-username'>
                Username<br />
                <input required type="text" id='username' name='username' className='sign-up-username-input' value={this.state.username} /* onChange={this.handleChangeUsername} */ />
              </label>
              {/* <p className={usernameValidationMessage}>This username is taken. Please try anothor.</p> */}
            </div>
            <div className='row password-wrapper'>
              <label htmlFor="password" className='sign-up-password'>
                Password<br />
                <input required type="password" id='passward' name='password' className='sign-up-password-input' value={this.state.password} /* onChange={this.handleChangePassword} */ />
              </label>
              {/* <p className={passwordValidationMessage}>Password must be 4-15 characters.</p> */}
            </div>
            <div className='row'>
              <button type='submit' className='create-account-button'>
                Create Account
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
