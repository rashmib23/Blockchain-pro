// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AuxiliaryContract {
    // Simple reward mechanism (dummy)

    mapping(address => uint) public rewards;

    event RewardGiven(address user, uint amount);

    function giveReward(address _user, uint _amount) public {
        rewards[_user] += _amount;
        emit RewardGiven(_user, _amount);
    }

    function getReward(address _user) public view returns (uint) {
        return rewards[_user];
    }
}
