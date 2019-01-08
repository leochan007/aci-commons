var mongoose = require('mongoose');

let BlockIndexStateSchema = null;
let BlockIndexStateModel = null;

try {
  BlockIndexStateSchema = new mongoose.Schema({
    blockNumber: Number,
    blockHash: String,
    isReplay: Boolean,
    handlerVersionName: String,
    createTime: {
      type: Date,
      default: Date.now,
    },
    updateTime: {
      type: Date,
      default: Date.now,
    }
  }, {
    versionKey: false,
    timestamps: {
      createdAt: 'createTime',
      updatedAt: 'updateTime',
    },
  })
  BlockIndexStateModel = mongoose.model('block_index_state', BlockIndexStateSchema, 'block_index_state')
} catch (e) {
  BlockIndexStateModel = mongoose.model('block_index_state')
}

module.exports = {
  BlockIndexStateSchema,
  BlockIndexStateModel,
}
