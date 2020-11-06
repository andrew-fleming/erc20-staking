pragma solidity ^0.6.0;

import './DaiToken.sol';
import './DexquisiteToken.sol';

contract DexquisiteCorpse {
    address public owner;
    string public name = 'Dexquisite Corpse';

    DexquisiteToken public dexquisiteToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }

    constructor(DexquisiteToken _dexquisiteToken, DaiToken _daiToken) public {
        dexquisiteToken = _dexquisiteToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }


    //stake tokens
    function stake(uint256 _amount) public {
        require(_amount > 0, 'You cannot stake zero tokens');
        daiToken.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] += _amount;
        //if user hasn't staked, add them to array
        if(!hasStaked[msg.sender]){
            stakers.push(msg.sender);
        }

        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }


    //unstake tokens
    function unstake() public {
        require(isStaking[msg.sender] = true, 'You are not staking tokens');
        uint256 balance = stakingBalance[msg.sender];
        stakingBalance[msg.sender] = 0;
        daiToken.transferFrom(address(this), msg.sender, balance);
        hasStaked[msg.sender] = false;
    }

    //issue tokens
    function issueTokens() public onlyOwner{
        for(uint i = 0; i < stakers.length; i++){
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0){
                dexquisiteToken.transfer(recipient, balance);
            }
        }
    }

}