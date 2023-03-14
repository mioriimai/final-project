import React from 'react';

export default class SignUp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <form>
        <div className='sign-up-container'>
          <div className='sign-up-white-box'>
            <div className='row'>
              <h2 className='sign-up'>Sign Up</h2>
            </div>
            <div className='row'>
              <label htmlFor="name" className='sign-up-name'>
                Name<br />
                <input required type="text" id='name'className='sign-up-name-input'/>
              </label>
            </div>
            <div className='row'>
              <label htmlFor="usename" className='sign-up-username'>
                Username<br />
                <input required type="text" id='username' className='sign-up-username-input' />
              </label>
            </div>
            <div className='row'>
              <label htmlFor="password" className='sign-up-password'>
                Password<br />
                <input required type="password" id='passward' className='sign-up-password-input' />
              </label>
            </div>
            <div className='row'>
              <button type='submit' className='create-account-button'>
                Create Account
              </button>
            </div>
            <div className='row'>
              <p className='have-an-account'>Have an account?<a href="#sign-in" className='sign-in-button'>Sign In</a></p>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
