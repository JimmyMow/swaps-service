const {URL} = require('url');

const chainServer = require('./conf/chain_server_defaults');

const decBase = 10;
const dummyScheme = 'http';

/** Get credentials for a given network's chain daemon

  {
    network: <Network Name String>
  }

  @throws
  <Error> when arguments are invalid

  @returns
  {
    host: <Host Address String>
    pass: <Password String>
    port: <Daemon Port Number>
    user: <Username String>
  }
*/
module.exports = ({network}) => {
  if (!network) {
    throw new Error('ExpectedNetworkForCredentials');
  }

  const service = chainServer[network];

  if (!service) {
    throw new Error('CredentialsUnknownForUnknownNetwork');
  }

  // Configured API
  const api = process.env[`SSS_CHAIN_${network.toUpperCase()}_RPC_API`];

  // For parsing purposes, construct a dummy URL from the API value
  const url = new URL(`${dummyScheme}://${api || service.rpc_api}`);

  if (!url.hostname) {
    throw new Error('MissingHostForChainApi');
  }

  if (!url.password) {
    throw new Error('MissingPassForChainApi');
  }

  if (!url.port) {
    throw new Error('MissingPortForChainApi');
  }

  if (!url.username) {
    throw new Error('MissingUserForChainApi');
  }

  return {
    host: url.hostname,
    pass: url.password,
    port: parseInt(url.port, decBase),
    user: url.username,
  };
};

