let mongodb_url = "mongodb://localhost:27017/alphacar"

if (process.env.MONGODB_URL != undefined) {
  mongodb_url = process.env.MONGODB_URL
}

let mongodb_opt_str = "?authSource=admin"

if (process.env.MONGODB_OPT != undefined) {
  mongodb_opt_str = process.env.MONGODB_OPT
}

let eosio_http_url = "http://127.0.0.1:8888"

if (process.env.EOSIO_HTTP_URL != undefined) {
  eosio_http_url = process.env.EOSIO_HTTP_URL
}

let start_block = 1;

if (process.env.EOSIO_STARTING_BLOCK != undefined) {
  start_block = parseInt(process.env.EOSIO_STARTING_BLOCK, 10)
}

let eos_account = 'alphacartest'

if (process.env.EOSIO_CONTRACT_ACCOUNT != undefined) {
  eos_account = process.env.EOSIO_CONTRACT_ACCOUNT
}

let chainId = null;

if (process.env.EOSIO_CHAINID != undefined && process.env.EOSIO_CHAINID != '') {
  chainId = process.env.EOSIO_CHAINID
}

const mongo_opt = {
  autoIndex: true,
  authSource: 'admin',
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 100, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  useNewUrlParser: true,
};

module.exports = {
  mongo_opt,
  mongodb_url,
  mongodb_opt_str,
  eosio_http_url,
  eos_account,
  start_block,
  chainId,
}
