pragma solidity >=0.5.16;

import "./DappToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    //all code goes here 
    string public name = "DappTokenFarm";
    DappToken public dappToken;
    DaiToken public daiToken;
    address public owner;

    address[] public stakers;

    mapping(address => uint) public stakingBalance; //user to money mapping 
    mapping(address => bool) public hasStaked; //user to history of staking mapping
    mapping(address => bool) public isStaking; //user to currently staking mapping

    constructor (DappToken _dapptoken,  DaiToken _daiToken) public {
        dappToken = _dapptoken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    //stakes token (deposit)
    function stakeTokens(uint _amount) public {

        
        require(_amount > 0, 'amount cannot be 0');//balance must be greater than 0 to stake any tokens

        daiToken.transferFrom((msg.sender), address(this), _amount);//transfers dai tokens to your account

        stakingBalance[msg.sender] += _amount;//increments account value 

        if (!hasStaked[msg.sender]){//if haven't staked before add user to stakers
            stakers.push(msg.sender);
        }

        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }
    //unstaking token (withdrawal)

    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, 'cannot unstake with a balance of 0 tokens');

        daiToken.transfer(msg.sender, balance);//transfers the dai tokens back in their account

        stakingBalance[msg.sender] = 0;//updates variables
        isStaking[msg.sender] = false;
    }
    
    //Issuing Tokens (request)
    function issueTokens() public {//owner is the only one that can issue dapp Tokens to stakers
        require(msg.sender == owner, 'caller of this function must be the owner');
        for (uint i = 0; i < stakers.length; i++){//loops through all the stakers
            address recipient = stakers[i];//gets their address

            uint balance  = stakingBalance[recipient];
            if (balance > 0){
                dappToken.transfer(recipient,balance);//gives them dapp tokens based off of how much dai tokens they invested
            }
        }
    }
}