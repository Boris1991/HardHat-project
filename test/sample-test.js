const { expect } = require("chai");


describe("Payment", () => {
  let Token, token, owner, addr1, addr2, addr3

  beforeEach(async ()=>{
    Payment = await ethers.getContractFactory('Payment');
    payment = await Payment.deploy();
    [owner, addr1, addr2, addr3, _] = await ethers.getSigners();
  });

  describe("Deployment", () => {
    it('should set the right owner', async () => {
      expect(await payment.owner()).to.equal(owner.address);
      console.log('Owner of the contract is %s', owner.address)
    });

    it('should refill accounts of users addr1, addr2, addr3 and cheking accounts', async () => {
      // Refilling accounts
      payment.setRefill(addr1.address, {value : 100});
      payment.setRefill(addr2.address, {value : 70});
      payment.setRefill(addr3.address, {value : 90});
      // Getting the balance
      balance1 = await payment.balanceOf(addr1.address);
      balance2 = await payment.balanceOf(addr2.address);
      balance3 = await payment.balanceOf(addr3.address);
      // Comparison 
      await expect(balance1).to.equal(100);
      await expect(balance2).to.equal(70);
      await expect(balance3).to.equal(90);

    });
    it('should refill balance of fund account through donators', async () => {
      console.log('trying to sent from the first account')
      payment.setRefill(addr1.address, {value : 100});
      await payment.gatherDonation(addr1.address, {value : 60});
      ownerBalance = await payment.balanceOf(owner.address);
      balance1 = await payment.balanceOf(addr1.address);
      await expect(ownerBalance).to.equal(60);
      await expect(balance1).to.equal(40);
      console.log('succesful')

      console.log('trying to sent from the second account')
      payment.setRefill(addr2.address, {value : 60});
      await payment.gatherDonation(addr2.address, {value : 50});
      ownerBalance = await payment.balanceOf(owner.address);
      balance2 = await payment.balanceOf(addr2.address);
      await expect(ownerBalance).to.equal(110);
      await expect(balance2).to.equal(10);
      console.log('succesful')
    });

    it('should cheking storages of donator adresses and total donations by address', async () => {
      // Refilling accounts
      await payment.setRefill(addr1.address, {value : 100});
      await payment.setRefill(addr2.address, {value : 70});
      await payment.setRefill(addr3.address, {value : 90});
      // Getting the balance
      await payment.gatherDonation(addr1.address, {value : 30});
      await payment.gatherDonation(addr2.address, {value : 40});
      await payment.gatherDonation(addr3.address, {value : 50});
      // 
      donators = await payment.getDonators();
      await console.log('Number of donators is %d', donators.length)
      
      donation1 = await payment.donationsFrom(addr1.address);
      donation2 = await payment.donationsFrom(addr2.address);
      donation3 = await payment.donationsFrom(addr3.address);
      console.log('Checking donations')
      await expect(donation1).to.equal(30);
      await expect(donation2).to.equal(40);
      await expect(donation3).to.equal(50);
      console.log('one more transaction from first account')

      await payment.gatherDonation(addr1.address, {value : 3});
      donation1 = await payment.donationsFrom(addr1.address);
      await expect(donation1).to.equal(33);
      console.log('Successful')
    });

  }); 
});
