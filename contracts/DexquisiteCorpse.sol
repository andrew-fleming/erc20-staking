pragma solidity ^0.6.0;

import './DaiToken.sol';
import './DexquisiteToken.sol';

contract DexquisiteCorpse {
    string public name = 'Dexquisite Corpse';

    //save state variables, declaring smart contracts as 'types'
    DexquisiteToken public dexquisiteToken;
    DaiToken public daiToken;

    constructor(DexquisiteToken _dexquisiteToken, DaiToken _daiToken) public {
        dexquisiteToken = _dexquisiteToken;
        daiToken = _daiToken;
    }
}