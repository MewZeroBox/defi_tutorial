import React, { Component, useEffect, useState } from 'react'
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'
import Navbar from './Navbar'
import Main from './main'
import Accounts from './Accounts.js'
import Landing from './Landing.js'
import './App.css'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockChainData();
    await this.fetchUsers();
  }

  async componentDidMount() {
    await this.fetchUsers();
    console.log("users", this.state.users)

  }



  async loadBlockChainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const currBalance = await web3.eth.getBalance(accounts[0]);
    console.log("balance", currBalance);

    const networkID = await web3.eth.net.getId();
    console.log(networkID)


    //Initialize Dai Tokens
    console.log("initializing Dai Tokens")
    const daiTokenData = DaiToken.networks[networkID]
    if (daiTokenData) {
      console.log("Retrieved DaiToken Data");
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      this.setState({ daiToken })
      let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      this.setState({ daiTokenBalance: daiTokenBalance.toString() })
      console.log("Saved Dai Token Balance as state")
    } else {
      window.alert('DaiToken contr not deployed to detected network')
    }

    //INitialize Dapp Tokens

    console.log("initializing Dapp Tokens")
    const dappTokenData = DappToken.networks[networkID]
    if (dappTokenData) {
      const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address)
      this.setState({ dappToken })
      let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call()
      this.setState({ dappTokenBalance: dappTokenBalance.toString() })
    } else {
      window.alert('DaiToken contract not deployed to detected network')
    }

    //initial Token Farm 

    console.log("initializing Token Farm")
    const tokenFarmData = TokenFarm.networks[networkID];
    if (tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address);
      this.setState({ tokenFarm })
      let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call();
      this.setState({ stakingBalance: stakingBalance.toString() })
    } else {
      window.alert('TokenFarm contract not deployed to detected network')
    }

    this.setState({ loading: false });
  }

  async loadWeb3() {
    if (window.ethereum) {//if ethereum is available on the browser
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {//if 
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert("Non-Ethereum browser detected. YOu should consider trying MetaMask");
    }
  }

  async getData(url) {
    const newData = await fetch(url, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(res => res.json());
    console.log(newData)
  }

  async sendData(url, data) {
    console.log(data)
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    })
    console.log(result.json())
    return result;
  }



  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.daiToken.methods.approve(this.state.tokenFarm._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.tokenFarm.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  unstakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.tokenFarm.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  async fetchUsers() {
    console.log("fethcing users")
    const newData = await fetch('http://localhost:3001/accounts', {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(res => res.json());
    console.log(newData)
    this.setState({ users: newData })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: 0x0,
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: '0',
      dappTokenBalance: '0',
      stakingBalance: '0',
      loading: false,
      users: [],
      fetchedUsers: [],
      activeUser: {},
      landingState: true,
    }
  } 


  loginUser = async (user) => {
    const users = this.state.users;
    var currentUser;
    let x = false;
    for (let i = 0; i < users.length; i++) {
      console.log(user.Email, users[i].Email);
      if (user.Email.toLowerCase() == users[i].Email.toLowerCase() && user.Password == users[i].Password) {
        x = true;
        currentUser = users[i];
      }
    }
    if (x == false) {
      console.log("Account not found with specified email and/or password")
      console.log("User: ", user)
      console.log("Users: ", this.state.users);
    } else {
      console.log("Sign in succesful");
      console.log(user);
      // user.balance = await window.web3.eth.getBalance(currentUser.account);
      console.log(currentUser);
      this.setState({ account: currentUser.account })
      this.setState({ activeUser: currentUser });
      console.log(this.state.activeUser)
    }
  };

  registerUser = async (user) => {
    const users = this.state.users;
    [user.account] = await window.web3.eth.getAccounts();
    console.log("original account", this.state.account);
    if (typeof user.account != undefined) {
      // user.balance = await window.web3.eth.getBalance(user.account);
    }
    console.log("user balance", user.balance);
    let x = true;
    for (let i = 0; i < users.length; i++) {
      console.log(users)
      if (user.Email.toLowerCase() == users[i].Email.toLowerCase() && user.Password == users[i].Password) {
        x = false;
      }
    }
    if (x == false) {
      console.log("Account already exists")
    } else {
      console.log("Sign up succesful");
      console.log(user);
      let tempUsers = this.state.users;
      tempUsers.push(user);
      this.setState({ users: tempUsers });
      console.log(this.state.users);
    }

    this.sendData('http://localhost:3001/accounts', user)
    this.fetchUsers();
  }

  sendTokens = async (amount, rcvAddress) => {
    console.log(amount, rcvAddress);
    const web3 = window.web3;
    const address = this.state.activeUser.account;
    console.log({ "address": address, "rcv": rcvAddress, "balance: ": web3.utils.toWei(amount.toString(), "ether") })
    const createTransaction = await web3.eth.accounts.signTransaction(
      {
        from: address,
        to: rcvAddress,
        value: web3.utils.toWei(amount.toString(), 'ether'),
        gas: 21000
      }, this.state.activeUser.key
    )
    const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
    );
    let user = this.state.activeUser;
    user.balance = await window.web3.eth.getBalance(user.account);
    this.setState({ activeUser: user })
  }

  updateBalance = async () => {
    let user = this.state.activeUser;
    user.balance = await window.web3.eth.getBalance(user.account);
    this.setState({ activeUser: user })
    console.log(user.balance);
  }

  toggleLanding = () => {
    this.setState({landingState: !this.state.landingState})
  }


  render() {
    // this.getData('http://localhost:3001/api');
    // this.sendData('http://localhost:3001/accounts', {"account": "Name"})
    console.log(this.state.fetchedUsers);
    console.log(this.state.users);
    let content
    let mainPage =
      (<div>
        <Navbar
          account={this.state.account}
          email={this.state.activeUser.Email}
          register={(user) => this.registerUser(user)}
          login={(user) => this.loginUser(user)}
        />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
        <Accounts accounts={this.state.users} />
      </div>);
    let page;

    if (this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      let balance = 0;
      if ((typeof this.state.activeUser) && Object.keys(this.state.activeUser).length === 0 && this.state.activeUser.constructor === Object) {
        balance = 0;
      } else {
        balance = this.state.activeUser.balance;
      }
      balance = 0;
      console.log(this.state.landingState);
      content = (<Main
        daiTokenBalance={this.state.daiTokenBalance}
        userBalance={balance.toString()}
        dappTokenBalance={this.state.dappTokenBalance}
        stakingBalance={this.state.stakingBalance}
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
        sendTokens={this.sendTokens}
        updateBalance={this.updateBalance}
      />)
      console.log(content);

      if (this.state.landingState == true) {
        page = (<Landing onSignup={this.registerUser} onLogin={this.loginUser} toggleLanding={this.toggleLanding}/>)
      } else {
        page = mainPage;
      }
    }

    return (
      page
    );
  }
}

export default App;

