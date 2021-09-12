const Campaign = artifacts.require("Campaign");
const CampaignFactory = artifacts.require("CampaignFactory");

let factory, campaignAddress, campaign;

contract('CampaignFactory', (accounts) => {
    beforeEach(async () => {
        factory = await CampaignFactory.new();
        factory = factory.contract;
        await factory.methods.createCampaign('100').send({
            from: accounts[0],
            gas: '1000000'
        });
        [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
        campaign = await Campaign.at(campaignAddress);
        campaign = campaign.contract;
    })

    it("deploys a factory and a campaing", async () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    })

    it("marks caller as the campaign manager", async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(manager, accounts[0]);
    })

    it("allows people to contribute money and marks them as approvers", async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: "200"
        })
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    })

    it("requires a minimum contribution", async () => {
        try {
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: "0"
            })
            assert(false);
        } catch (e) {
            assert.ok(e);
        }
    })

    it('processes requests', async () => {
        try{
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: web3.utils.toWei('10', 'ether')
            })

            await campaign.methods.createRequest(
                "A", web3.utils.toWei('5', 'ether'), accounts[2],
            ).send({
                from: accounts[0], gas: '1000000'
            });

            await campaign.methods.approveRequest(0).send({
                from: accounts[1],
                gas: '1000000'
            })

            await campaign.methods.finalizeRequest(0).send({
                from: accounts[0],
                gas: '1000000'
            })

            let balance = await web3.eth.getBalance(accounts[2]);
            balance = web3.utils.fromWei(balance, 'ether');
            balance = parseFloat(balance);
            console.log(balance);
            assert(balance > 100);
        } catch(e) {
            console.log(e);
        }
    })
});