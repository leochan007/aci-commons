var mongoose = require('mongoose');

let RewardRecordSchema = null;
let RewardRecordModel = null;

try {
  RewardRecordSchema = new mongoose.Schema({
    createTime: {
      type: Date,
      default: Date.now,
    },
    updateTime: {
      type: Date,
      default: Date.now,
    },
    activityType: {
      type: String,
    },
    issueNumber: {
      type: Number,
    },
    ranking: {
      type: Number,
    },
    name: {
      type: String,
    },
    account: {
      type: String,
    },
    reward: {
      type: Number,
    },
    comments: {
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
  }, {
    versionKey: false,
    timestamps: {
      createdAt: 'createTime',
      updatedAt: 'updateTime',
    },
  });

  RewardRecordModel = mongoose.model('reward_record', RewardRecordSchema, 'reward_record');
} catch (error) {
  RewardRecordModel = mongoose.model('reward_record');
}

module.exports = {
  RewardRecordSchema,
  RewardRecordModel,
}
