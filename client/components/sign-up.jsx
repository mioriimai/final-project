import React from 'react';

export default class SignUp extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      username: '',
      password: '',
      usernames: [],
      uniqueUsernameError: false,
      passwordError: false
    };

    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const usernameArray = [];
    fetch('/api/usernames')
      .then(res => res.json())
      .then(usernames => {
        usernames.forEach(username => {
          usernameArray.push(username.username);
        });
        this.setState({
          usernames: usernameArray
        });
      });
  }

  handleChangeName(event) {
    this.setState({
      name: event.target.value
    });
  }

  handleChangeUsername(event) {
    this.setState({
      username: event.target.value
    });
    for (let i = 0; i < this.state.usernames.length; i++) {
      if (event.target.value === this.state.usernames[i]) {
        this.setState({
          uniqueUsernameError: true
        });
        break;
      } else {
        this.setState({
          uniqueUsernameError: false
        });
      }
    }
  }

  handleChangePassword(event) {
    this.setState({
      password: event.target.value
    });
    if (event.target.value.length < 4 || event.target.value.length > 15) {
      this.setState({
        passwordError: true
      });
    } else {
      this.setState({
        passwordError: false
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.state.uniqueUsernameError === true || this.state.passwordError === true) {
      return false;

    } else {
      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state)
      };

      fetch('/api/auth/sign-up', req)
        .then(res => res.json())
        .then(result => {
          window.location.hash = '#sign-in';
        })
        .catch(err => {
          console.error(err);
        });
    }
  }

  render() {
    let usernameValidationMessage;
    if (this.state.uniqueUsernameError === false) {
      usernameValidationMessage = 'hidden';
    } else if (this.state.uniqueUsernameError === true) {
      usernameValidationMessage = 'username-validation-message';
    }

    let passwordValidationMessage;
    if (this.state.passwordError === false) {
      passwordValidationMessage = 'hidden';
    } else if (this.state.passwordError === true) {
      passwordValidationMessage = 'password-validation-message';
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <div className='sign-up-container'>
          <div className='sign-up-white-box'>
            <div className='row'>
              <h2 className='sign-up'>Sign Up</h2>
            </div>
            <div className='row'>
              <label htmlFor="name" className='sign-up-name'>
                Name<br />
                <input required type="text" id='name' name='name' className='sign-up-name-input' value={this.state.name} onChange={this.handleChangeName}/>
              </label>
            </div>
            <div className='row username-wrapper'>
              <label htmlFor="usename" className='sign-up-username'>
                Username<br />
                <input required type="text" id='username' name='username' className='sign-up-username-input' value={this.state.username} onChange={this.handleChangeUsername} />
              </label>
              <p className={usernameValidationMessage}>This username is taken. Please try anothor.</p>
            </div>
            <div className='row password-wrapper'>
              <label htmlFor="password" className='sign-up-password'>
                Password<br />
                <input required type="password" id='passward' name='password' className='sign-up-password-input' value={this.state.password} onChange={this.handleChangePassword} />
              </label>
              <p className={passwordValidationMessage}>Password must be 4-15 characters.</p>
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
