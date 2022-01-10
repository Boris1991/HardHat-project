# Project 

This project has some functions of contracts and contained such functions:
1) setRefill(address _to) allows to refill account with address '_to' through msg.value.
2) gatherDonation(address _from) allows to make transactions from address '_from' to fund address.
3) transferToAnotherAccount(address _to, uint amount) allows making transactions from fund address to 'to' at 'amount'.
4) getDonators() allows to get addresses of donators.
5) balanceOf(address account) allows to find out the balance at address 'account'.
6) donationsFrom(address account) allows to find out the total donation sum using address 'account'.
