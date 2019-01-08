var mongoose = require('mongoose');

let CreditInquirySchema = null;
let CreditInquiryModel = null;

try {
  CreditInquirySchema = new mongoose.Schema({
    createTime: {
      type: Date,
      default: Date.now,
    },
    updateTime: {
      type: Date,
      default: Date.now,
    },
    account: {
      type: String,
    },
    name: {
      type: String,
    },
    personId: {
      type: String,
    },
    comments: {
      type: String,
    },
    registerTime: {
      type: Date,
    },
    moralCrisisType: {
      type: String,
    },
    reason: {
      type: String,
    },
    recordTime: {
      type: Date,
    },
    hash: {
      type: String,
      index: {
        unique: true,
      }
    },
    txId: {
      type: String,
    },
    localTxId: {
      type: String,
    },
    status: {
      type: String,
    },
    reserved: {
      type: String,
    },
  }, {
    versionKey: false,
    timestamps: {
      createdAt: 'createTime',
      updatedAt: 'updateTime',
    },
  });

  CreditInquiryModel = mongoose.model('credit_inquiry', CreditInquirySchema, 'credit_inquiry');
} catch (error) {
  CreditInquiryModel = mongoose.model('credit_inquiry');
}

module.exports = {
  CreditInquirySchema,
  CreditInquiryModel,
}
