//SPDX-License-Identifier: Unlicense
pragma solidity >= 0.5.0 < 0.9.0;

import "hardhat/console.sol";

contract Payment {
    // Payable address can receive Ether
    address payable public owner;
    address[] donators;
    mapping(address=>uint) balances;
    mapping(address=>uint) donations;

    uint public totalSupply = 0;
    
    constructor () payable {
        owner = payable(msg.sender);
        balances[owner] = totalSupply;
    }

    //  Function for refilling of accounts
    function setRefill(address _to) public payable{
        require(msg.sender == owner, "permit denied");
        balances[_to] = msg.value;
    }

    // Donates gathering for fund
    function gatherDonation(address _from) public payable {
       console.log('Sender balance is %s ', balances[msg.sender]);
       console.log('Trying to send %s to %s', msg.value, owner);
       require(balances[_from] >= msg.value, 'Not enough money');
       require(msg.value > 0);
       //payable(owner).transfer(msg.value);
       //balances[owner] += msg.value;
       balances[_from] -= msg.value;
       balances[owner] += msg.value;
       // If donator is in base, new sum adds to previous, e.g. each transaction don't keep
       if (donations[_from] != 0 ){
            donations[_from] += msg.value;
       }
       else {
           donations[_from] = msg.value;
           donators.push(_from);
        }
         
    }

    // Transaction from fund account to account to help other people
    function transferToAnotherAccount(address _to, uint amount) public payable {
        console.log('Sender balance is %s tokens', balances[msg.sender]);
        console.log('Trying to send %s tokens to %s', amount, _to);
        require(msg.sender == owner, "permit denied");
        require(balances[owner] >= amount, 'Not enough moneys');
        payable(_to).transfer(msg.value);
    }

     function getDonators() external view returns ( address[] memory) {
        address[] memory donatorAddresses = new address[](donators.length);
        for(uint i=0; i < donators.length; i++){
            donatorAddresses[i] = donators[i];
        }
        return(donatorAddresses);
    }

    function balanceOf(address account) external view returns(uint) {
        //console.log(balances[account]);
        return balances[account];
    }

    function donationsFrom(address account) external view returns(uint) {
        //console.log(balances[account]);
        return donations[account];
    }
}
