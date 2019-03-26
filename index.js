const {
  CreditInquirySchema,
  CreditInquiryModel,
} = require('./models/credit-inquiry.model');

const {
  BlockIndexStateSchema,
  BlockIndexStateModel,
} = require('./models/block-index-state.model');

const States = require('./def/record-state');
const RetCode = require('./def/ret-code');
const ACIConfig = require('./config/config');
const { MongoDb } = require('./utils/mongo_helper');
const ciService = require('./services/credit-inquiry-service');
const rrService = require('./services/reward-record-service');

const io = require('./utils/io');

module.exports = {
  CreditInquirySchema,
  CreditInquiryModel,
  BlockIndexStateSchema,
  BlockIndexStateModel,
  States,
  RetCode,
  ACIConfig,
  MongoDb,
  ciService,
  rrService,
  io,
}
