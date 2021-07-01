import React, { Component } from 'react'
import './App.css'

class Accounts extends Component {
   constructor(props){
       super(props);
   }

   render(){
       return (
           <div className="accounts-container">
               <h1 className="accounts-header">Accounts</h1>
               <ul className="accounts-list">
                   {this.props.accounts.map(account => (
                       <div className="accounts-item">
                           Name: {account.email}
                           <br></br>
                           Address: {account.account}
                       </div>
                   ))}
               </ul>
           </div>
       )
   }
}

export default Accounts;