import React, { Component } from 'react'
import farmer from '../farmer.png'

class Navbar extends Component {
  constructor (props){
    super(props);
    this.state = {
      email: "",
      password: "",
      key: "",
    };
    this.handleEmailChange = this.handleEmailChange.bind();
  }

  handleEmailChange(emailInput) {
      this.setState({email: emailInput})
  }

  

  onRecieveSignin = (user) => {
    this.setState({Email : user.email});
    this.setState({Password : user.password})
    this.props.login(user);
  }

  onRecieveSignup = (user) => {
    this.setState({Email : user.email});
    this.setState({Password : user.password})
    console.log(user);
    this.props.register(user);
  }


  render() {
    const email = this.state.email;
    const password = this.state.password;
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <div className="buttons">

          <Button displayFunction={"Signup"}/>
          <Signup 
          onRecieve={(user) => this.onRecieveSignup(user)}/>
          <Button displayFunction={"Signin"}/>
          <Signin email={email} password={password}
          onRecieve={(user) => this.onRecieveSignin(user)}
          />
          </div>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account">{this.props.email} : {this.props.account}</small>
            </small>
          </li>
        </ul>
      </nav>
    );
  }
}

class Button extends Component {
  constructor(props){
    super(props);
    this.state = {
      signinToggle : false,
      signupToggle : false
    }
  }

  toggle(mode) {
    if (mode == "signin"){ 
      this.setState({signinToggle : !this.state.signinToggle})
    } else if (mode == "signup"){
      this.setState({signupToggle : this.state.signupToggle})
    }
  }
  render() {
    if (this.props.displayFunction == "Signin"){
      return(
        <div className="signin" onClick={() => {toggleSignin()}
      }>Sign-In</div>
        )
      } else if (this.props.displayFunction == "Signup"){
        return (
        <div className="signin" onClick={() => {toggleSignup()}
      }>Sign-up</div>
      )
    }
  }
}

function displaySignin() {
    this.setState({display: "flex"})
    this.props.toggleDisplay("signin");
    console.log(this.state.display);
} 

function removeSignin() {
  this.setState({display: "none"});
  this.props.toggleDisplay("signin");
  console.log(this.state.display);
}

function toggleSignin() {
  if (this.state.display == "flex")
  this.setState({display: "none"});
  if (this.state.display == "none")
  this.setState({display: "flex"});
  console.log(this.state.display)
}

function displaySignup() {
    this.setState({display: "flex"})
    this.props.toggleDisplay("signup");
    console.log(this.state.display);
} 

function removeSignup() {
  this.setState({display: "none"});
  this.props.toggleDisplay("signup");
  console.log(this.state.display);
}

function toggleSignup() {
  if (this.state.display == "flex")
  this.setState({display: "none"});
  if (this.state.display == "none")
  this.setState({display: "flex"});
  console.log(this.state.display)
}

class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            display: 'none',
            email: '',
            password: '',
        };

        displaySignin = displaySignin.bind(this);
        removeSignin = removeSignin.bind(this);
        toggleSignin = toggleSignin.bind(this);
    }

    handleInputChange(event) {
      event.preventDefault();
      const target = event.target;
      const value = target.value;
      const name = target.name;

      this.setState({[name]: value})
      console.log(this.state.name);
    }

    onSubmit = (e) => {
      e.preventDefault();
      const user = {Email: this.state.email, Password: this.state.password};
      toggleSignin();
      this.props.onRecieve(user)
      this.setState({//reset to default
        email: "",
        password: ""})
    }

    render() {
        return( 
            <div className="sign-container sign-in" style={{display:this.state.display}}>
                <div className="email signin-item" > Email </div>
                <input type="email" name="email" value={this.state.email} onChange={(e) => this.handleInputChange(e)} className="email-form signin-item"/>
                <div className="password signin-item"> Password </div>
                <input type="password" name="password" value={this.state.password} onChange={(e) => this.handleInputChange(e)} className="password-form signin-item"/>
                <input type="submit" value ="submit" className="submit-button signin-item" onClick={(e) => this.onSubmit(e)}/>
            </div>
        )
    }
}

class Signup extends Component {
  constructor(props) {
      super(props);
      this.state = {
          display: 'none',
          email: '',
          password: '',
          account: 0x00
      };

      displaySignup = displaySignup.bind(this);
      removeSignup = removeSignup.bind(this);
      toggleSignup = toggleSignup.bind(this);
  }

  handleInputChange(event) {
    event.preventDefault();
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({[name]: value})
    console.log(this.state.name);
  }

  onSubmitSignup = (e) => {
    e.preventDefault();
    const user = {Email: this.state.email, Password: this.state.password};
    toggleSignup();
    this.props.onRecieve(user)
    this.setState({//reset to default
      email: "",
      password: ""})
  }

  render() {
      return( 
          <div className="sign-container sign-up" style={{display:this.state.display}}>
              <div className="email signin-item" > Email </div>
              <input type="email" name="email" value={this.state.email} onChange={(e) => this.handleInputChange(e)} className="email-form signin-item"/>
              <div className="password signin-item"> Password </div>
              <input type="password" name="password" value={this.state.password} onChange={(e) => this.handleInputChange(e)} className="password-form signin-item"/>
              <input type="submit" value ="submit" className="submit-button signin-item" onClick={(e) => this.onSubmitSignup(e)}/>
          </div>
      )
  }
}

export default Navbar;
