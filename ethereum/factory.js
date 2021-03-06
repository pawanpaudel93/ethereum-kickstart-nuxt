import web3 from './web3';
import CampaignFactory from './build/contracts/CampaignFactory.json';

const instance = new web3.eth.Contract(CampaignFactory.abi, process.env.CAMPAIGN_FACTORY_ADDRESS);

export default instance;