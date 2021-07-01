import React, { Component } from 'react'
import './App.css'
import dai from '../dai.png'

class Main extends Component {
   constructor(props){
       super(props);
       this.state = {
         name: "0x0",
         value: 0,
       }
   }
   
   handleInputChange(event) {
    event.preventDefault();
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({[name] : value})
    console.log(this.state.name, this.state.value);
  }

  render() {  
    return (
      <div id="content" className="mt-3">
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col">Staking Balance</th>
              <th scope="col">Reward Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} mDAI</td>
              <td>{window.web3.utils.fromWei(this.props.dappTokenBalance, 'Ether')} DAPP</td>
            </tr>
          </tbody>
        </table>

        <div className="card mb-4" >

          <div className="card-body">

            <form className="mb-3" onSubmit={(event) => {
                event.preventDefault()
                console.log(this.state.value, this.state.name)
                this.props.sendTokens(this.state.value, this.state.name)
              }}>
              <div>
                <label className="float-left"><b>Send Tokens</b></label>
                <span className="float-right text-muted">
                  Balance: {window.web3.utils.fromWei(this.props.userBalance)}
                </span>
              </div>
              <button className="float-right updateButton" onClick={this.props.updateBalance}>Update</button>
              <div className="input-group mb-4">
                <input
                  type="text"
                  name="value"
                  value={this.state.amount}
                  onChange={(e) => this.handleInputChange(e)}
                  className="form-control form-control-lg"
                  placeholder="0"
                  required />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={dai} height='32' alt=""/>
                    &nbsp;&nbsp;&nbsp; ETH
                  </div>
                </div>
              </div>
              <span>Address of recipient</span>
              <div className="input-group mb-4">
                <input
                  type="text"
                  name="name"
                  value={this.state.address}
                  onChange={(e) => this.handleInputChange(e)}
                  className="form-control form-control-lg"
                  placeholder="0x0"
                  required />
              </div>
              <button type="submit" className="btn btn-primary btn-block btn-lg">Send</button>
            </form>
            <button
              type="submit"
              className="btn btn-link btn-block btn-sm">
                UN-STAKE...
              </button>
          </div>
        </div>
      </div>
    );
  }
}


export default Main;