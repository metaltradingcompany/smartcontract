const {accounts, contract} = require('@openzeppelin/test-environment');
const {expect} = require('chai');
const {
    BN,           // Big Number support
    constants,    // Common constants, like the zero address and largest integers
    expectEvent,  // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

const ERC20 = contract.fromArtifact('MetalTradingCompanySmartContract');
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

describe('ERC20', function () {

    const [sender, receiver, receiver2, receiver3] = accounts;
    const tokenName = 'Metal Trading Company';
    const tokenSymbol = 'MTC';
    const owner = sender;
    const totalSupply = 100000000;
    const decimals = 0;
    console.log('Sender : ', sender);

    beforeEach(async function () {
        // The bundled BN library is the same one web3 uses under the hood
        this.value = new BN(1);

        this.erc20 = await ERC20.new();
        this.erc20.init({from: sender});
    });

    it('deployer is owner', async function () {
        expect(await this.erc20.owner()).to.equal(owner);
    });

    it('check contract owner', async function () {
        expect(await this.erc20.owner()).to.equal(owner);
    });

    it('check contract name', async function () {
        expect(await this.erc20.name()).to.equal(tokenName);
    });

    it('check contract totalSupply', async function () {
        let _totalSupply = new BN(totalSupply * 10 ** decimals);
        expect(await this.erc20.totalSupply()).to.be.bignumber.equal(_totalSupply);
    });

    it('check contract symbol', async function () {
        expect(await this.erc20.symbol()).to.equal(tokenSymbol);
    });

    it('reverts when transferring tokens to the zero address', async function () {
        // Conditions that trigger a require statement can be precisely tested

        await expectRevert(
            this.erc20.transfer(constants.ZERO_ADDRESS, this.value, {from: sender}),
            'ERC20: transfer to the zero address'
        );
    });

    it('check is paused contract', async function () {
        expect(await this.erc20.paused()).to.equal(false);
    });

    it('emits a Transfer event on successful transfers', async function () {
        const receipt = await this.erc20.transfer(
            receiver, this.value, {from: sender}
        );

        // Event assertions can verify that the arguments are the expected ones
        expectEvent(receipt, 'Transfer', {
            from: owner,
            to: receiver,
            value: this.value,
        });
    });

    it('approve the passed address to spend the specified amount', async function () {
        let value = new BN(100);
        let receipt = await this.erc20.approve(receiver, value, {from: sender});
        expectEvent(receipt, 'Approval', {
            owner: sender,
            spender: receiver,
            value: value
        });
    });

    it('check the amount of tokens that an owner allowed to a spender', async function () {
        let value = new BN(100);
        let receipt = await this.erc20.approve(receiver, value, {from: sender});
        expectEvent(receipt, 'Approval', {
            owner: sender,
            spender: receiver,
            value: value
        });
        expect(await this.erc20.allowance(owner, receiver)).to.be.bignumber.equal(value);
    });

    it('check balance of sender', async function () {
        expect(await this.erc20.balanceOf(owner))
            .to.be.bignumber.equal(new BN(totalSupply * 10 ** decimals));
    });

    it('updates balances on successful transfers', async function () {
        this.erc20.transfer(receiver, this.value, {from: owner});

        // BN assertions are automatically available via chai-bn (if using Chai)
        expect(await this.erc20.balanceOf(receiver))
            .to.be.bignumber.equal(this.value);
    });

    it('check minting', async function () {
        let amount = new BN(1000);
        receipt = await this.erc20.mint(sender, amount, {from: sender});
        expectEvent(receipt, 'Transfer', {
            to: sender,
            value: amount
        });
        expect(await this.erc20.totalSupply()).to.be.bignumber.equal((new BN(totalSupply * 10 ** decimals)).add(amount));
    });

    it('check contract pause', async function () {
        let receipt = await this.erc20.pause({from: sender});
        expectEvent(receipt, 'Paused');
    });

    it('unpause contract when it\'s unpaused', async function () {
        expectRevert(this.erc20.unpause({from: sender}), " Pausable: not paused");
    });

    it('pause contract when it paused', async function () {
        await this.erc20.pause({from: sender});
        expectRevert(this.erc20.pause({from: sender}), "Pausable: paused");
    });

    it('check contract unpause', async function () {
        await this.erc20.pause({from: sender});
        let receipt = await this.erc20.unpause({from: sender});
        expectEvent(receipt, 'Unpaused');
    });

    it('transfer to address tokens when it paused', async function () {
        await this.erc20.pause({from: sender});
        expectRevert(this.erc20.transfer(receiver, new BN(1), {from: sender}), "ERC20Pausable: contract paused");
    });

    it('transfer tokens from to when it paused', async function () {
        await this.erc20.pause({from: sender});
        expectRevert(this.erc20.transferFrom(sender, receiver, new BN(1), {from: sender}), "ERC20Pausable: token transfer while paused.");
    });

    it('increase allowance when it paused', async function () {
        await this.erc20.pause({from: sender});
        expectRevert(this.erc20.increaseAllowance(receiver, new BN(1), {from: sender}), "ERC20Pausable: contract paused");
    });

    it('approve spender when contract paused', async function () {
        await this.erc20.pause({from: sender});
        expectRevert(this.erc20.approve(receiver, new BN(1)), "ERC20Pausable: contract paused");
    });

    it('burn tokens from user account', async function () {
        let burnAmount = new BN(100);
        let receipt = await this.erc20.burn(burnAmount, {from: sender});
        expectEvent(receipt, 'Transfer', {
            from: sender,
            to: ZERO_ADDRESS,
            value: burnAmount
        });
        expect(await this.erc20.balanceOf(sender)).to.be.bignumber.equal(new BN(totalSupply * 10 ** decimals - 100));
    });

    it('test transfer tokens between users', async function () {
        let receipt = await this.erc20.transferFrom(
            sender, receiver, this.value, {from: sender}
        );
        // Event assertions can verify that the arguments are the expected ones
        expectEvent(receipt, 'Transfer', {
            from: owner,
            to: receiver,
            value: this.value,
        });
        expect(await this.erc20.balanceOf(receiver)).to.be.bignumber.equal(this.value);
        expect(await this.erc20.balanceOf(sender)).to.be.bignumber.equal(new BN(totalSupply * 10 ** decimals - 1));
        receipt = await this.erc20.transfer(
            receiver2, this.value, {from: receiver}
        );
        // Event assertions can verify that the arguments are the expected ones
        expectEvent(receipt, 'Transfer', {
            from: receiver,
            to: receiver2,
            value: this.value,
        });
        expect(await this.erc20.balanceOf(receiver2)).to.be.bignumber.equal(this.value);
        expect(await this.erc20.balanceOf(receiver)).to.be.bignumber.equal(new BN(0));

        receipt = await this.erc20.approve(receiver, this.value, { from : receiver2 });
        expectEvent(receipt, 'Approval', {
            owner: receiver2,
            spender: receiver,
            value: this.value,
        });
        receipt = await this.erc20.transferFrom(
            receiver2, receiver3, this.value, {from: receiver}
        );
        // Event assertions can verify that the arguments are the expected ones
        expectEvent(receipt, 'Transfer', {
            from: receiver2,
            to: receiver3,
            value: this.value,
        });
        expect(await this.erc20.balanceOf(receiver3)).to.be.bignumber.equal(this.value);
        expect(await this.erc20.balanceOf(receiver2)).to.be.bignumber.equal(new BN(0));

    });

    it('check increasing allowances', async function () {
        let receipt = await this.erc20.approve(receiver, this.value, { from : receiver2 });
        expectEvent(receipt, 'Approval', {
            owner: receiver2,
            spender: receiver,
            value: this.value,
        });
        receipt = await this.erc20.increaseAllowance(receiver, this.value, { from : receiver2 });
        expectEvent(receipt, 'Approval', {
            owner: receiver2,
            spender: receiver,
            value: new BN(2),
        });

        receipt = await this.erc20.decreaseAllowance(receiver, this.value, { from : receiver2 });
        expectEvent(receipt, 'Approval', {
            owner: receiver2,
            spender: receiver,
            value: new BN(1),
        });
    });

    it('burn tokens from users account', async function () {
        let burnAmount = new BN(100);
        let receipt = await this.erc20.burn(burnAmount, {from: sender});
        expectEvent(receipt, 'Transfer', {
            from: sender,
            to : ZERO_ADDRESS,
            value: burnAmount
        });
        expect(await this.erc20.balanceOf(sender)).to.be.bignumber.equal(new BN(totalSupply * 10 ** decimals - 100));
        receipt = await this.erc20.transfer(
            receiver2, this.value, {from: sender}
        );
        // Event assertions can verify that the arguments are the expected ones
        expectEvent(receipt, 'Transfer', {
            from: sender,
            to: receiver2,
            value: this.value,
        });
        expect(await this.erc20.balanceOf(receiver2)).to.be.bignumber.equal(this.value);
        receipt = await this.erc20.burn(this.value, {from: receiver2});
        expectEvent(receipt, 'Transfer', {
            from: receiver2,
            to : ZERO_ADDRESS,
            value: this.value
        });
        expect(await this.erc20.balanceOf(receiver2)).to.be.bignumber.equal(new BN(0));
        receipt = await this.erc20.transfer(
            receiver3, this.value, {from: sender}
        );
        // Event assertions can verify that the arguments are the expected ones
        expectEvent(receipt, 'Transfer', {
            from: sender,
            to: receiver3,
            value: this.value,
        });
        expectRevert(this.erc20.burnFrom(receiver3, this.value, {from: receiver2}),
            'ERC20: burn amount exceeds allowance');

        receipt = await this.erc20.increaseAllowance(receiver2, this.value, { from : receiver3 });
        expectEvent(receipt, 'Approval', {
            owner: receiver3,
            spender: receiver2,
            value: new BN(1),
        });
        receipt = await this.erc20.burnFrom(receiver3, this.value, {from: receiver2});
        expectEvent(receipt, 'Transfer', {
            from: receiver3,
            to: ZERO_ADDRESS,
            value: this.value
        });
        expectEvent(receipt, 'Approval', {
            owner: receiver3,
            spender: receiver2,
            value: new BN(0),
        });
    });

    it('check add new tokens', async function () {
        let amount = new BN(1000);
        receipt = await this.erc20.addTokens(amount, {from: sender});
        expectEvent(receipt, 'Transfer', {
            to: sender,
            value: amount
        });
        receipt = this.erc20.addTokens(amount, {from: receiver2});
        expectRevert(receipt, "MetalTradingCompanySmartContract: Only owner or admin user");
        expect(await this.erc20.totalSupply()).to.be.bignumber.equal((new BN(totalSupply * 10 ** decimals)).add(amount));
    });
});
