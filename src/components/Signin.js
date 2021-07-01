import React, { Component } from 'react'

class Signin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
        };
    }

    toggleClass() {
        const currentState = this.state.active;
        this.setState({active: !currentState});
    }; 

    render() {
        return( 
            <div className="signin-container">
                <div className="email signin-item"> Email </div>
                <input type="text" name="name" className="email-form signin-item"/>
                <div className="password signin-item"> Password </div>
                <input type="password" name="password" className="password-form signin-item"/>
                <input type="submit" value ="submit" className="submit-button signin-item"/>
            </div>
        )
    }
}
export default Signin;