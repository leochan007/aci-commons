const {
  RewardRecordSchema,
} = require('../models/reward-record.model');

const States = require('../def/record-state');
const RetCode = require('../def/ret-code');

const { MongoDb } = require('../utils/mongo_helper');

const alphacar = new MongoDb('alphacar');

process.on('SIGINT', () => {
  alphacar.close();
});

alphacar.db.connection.on('close', () => {
  console.log('db closed! try to exit...');
  process.exit(0);
});

const RewardRecordModel = alphacar.db.model('reward_record', RewardRecordSchema, 'reward_record');

const service_helper = require('../utils/rr_service_helper');

async function getLatestRewardRecord(ctx) {

  let pipeline = [
    service_helper.make_mask(),
    {
      $sort: {
        recordTime: -1,
        activityType: -1,
        ranking: 1,
      }
    },
    {
      $limit: 1
    },
  ];

  let error_code = RetCode.RET_NO_DATA;
  let error_msg = RetCode.ERRMSG_NO_DATA;
  let data;

  try {

    let res = await RewardRecordModel.aggregate(pipeline).exec();

    if (res.length > 0) {
      error_code = RetCode.RET_OK;
      error_msg = RetCode.ERRMSG_EMPTY;
      data = res[0];
    }

  } catch (err) {
    error_code = RetCode.RET_QUERY_FAILED;
    error_msg = RetCode.ERRMSG_QUERY_FAILED;
  }

  service_helper.genResponse(ctx, error_code, error_msg, data);
}

async function getRewardRecordByHash(ctx) {
  let hash = ctx.params.hash

  let pipeline = [{
      $match: {
        hash: hash
      }
    },
    service_helper.make_mask(),
    {
      $sort: {
        recordTime: -1
      }
    },
    {
      $limit: 1
    },
  ];

  let error_code = RetCode.RET_NO_DATA;
  let error_msg = RetCode.ERRMSG_NO_DATA;
  let data;

  try {
    let res = await RewardRecordModel.aggregate(pipeline).exec();

    if (res.length > 0) {
      error_code = RetCode.RET_OK;
      error_msg = RetCode.ERRMSG_EMPTY;
      data = res[0];
    }
  } catch (err) {
    error_code = RetCode.RET_QUERY_FAILED;
    error_msg = RetCode.ERRMSG_QUERY_FAILED;
  }

  service_helper.genResponse(ctx, error_code, error_msg, data);
}

async function getRewardRecordListByCond(ctx, cond) {

  let pipeline = [{
      $match: cond['cond']
    },
    service_helper.make_mask(),
    {
      $sort: {
        recordTime: -1
      }
    },
  ];

  if (cond['page'] !== -1 && cond['page_size'] !== -1) {
    pipeline = pipeline.concat([{
      $skip: cond['page'] * cond['page_size']
    }, {
      $limit: cond['page_size']
    }]);
    //console.log('pipeline:', pipeline);
  }

  let error_code = RetCode.RET_OK;
  let error_msg = RetCode.ERRMSG_EMPTY;
  let total_count = 0;
  let data;

  try {
    data = await RewardRecordModel.aggregate(pipeline).exec();
    if (cond['page'] == -1 || cond['page_size'] == -1) {
      total_count = data.length;
    } else {
      total_count = await RewardRecordModel.count(cond['cond']).exec();
    }

  } catch (err) {
    error_code = RetCode.RET_QUERY_FAILED;
    error_msg = RetCode.ERRMSG_QUERY_FAILED;
  }

  service_helper.genListResponse(ctx, error_code, error_msg, total_count, data);

}

async function getRewardRecordListByMoralCrisisType(ctx) {

  const cond = service_helper.gen_moral_crisis_cond(ctx);

  await getRewardRecordListByCond(ctx, cond);

}

async function getRewardRecordList(ctx) {

  const cond = service_helper.gen_search_cond(ctx);

  await getRewardRecordListByCond(ctx, cond);

}

async function getCountGroupByMoralCrisisType(ctx) {

  let cond = [{
      '$match': {
        'status': {
          '$ne': States.STATE_DELETED
        }
      }
    }, {
      '$group': {
        '_id': '$moralCrisisType',
        'count': {
          '$sum': 1
        }
      }
    },
    {
      '$sort': {
        'count': 1,
        '_id': 1
      }
    },
  ]

  let error_code = RetCode.RET_OK;
  let error_msg = RetCode.ERRMSG_EMPTY;
  let txs_count = [];

  try {

    txs_count = await RewardRecordModel.aggregate(cond).exec();

  } catch (err) {
    console.log(err);
    error_code = RetCode.RET_QUERY_FAILED;
    error_msg = RetCode.ERRMSG_QUERY_FAILED;
  }

  service_helper.genResponse(ctx, error_code, error_msg, {'txs_count': txs_count});

}

async function getRewardRecordTxCountList(ctx) {
  let dates = ctx.request.body;
  let date_arr = [];
  for (var i = 0; i < dates.length; i++) {
    date_arr.push({
      '_id': dates[i]
    })
  }

  let cond = [{
      '$match': {
        'status': {
          $ne: States.STATE_DELETED
        }
      }
    }, {
      '$group': {
        '_id': {
          '$dateToString': {
            'format': '%Y-%m-%d',
            'date': '$recordTime',
            'timezone': '+08:00'
          }
        },
        'count': {
          '$sum': 1
        }
      }
    }, {
      '$match': {
        '$or': date_arr
      }
    },
    {
      '$sort': {
        '_id': 1
      }
    },
  ]

  let error_code = RetCode.RET_OK;
  let error_msg = RetCode.ERRMSG_EMPTY;
  let final_res = [];

  try {

    let txs_count = await RewardRecordModel.aggregate(cond).exec();

    let tmp = {};

    for (var i = 0; i < txs_count.length; i++) {
      tmp[txs_count[i]._id] = txs_count[i].count;
    }

    for (var i = 0; i < dates.length; i++) {
      if (!tmp.hasOwnProperty(dates[i])) {
        tmp[dates[i]] = 0;
      }
    }

    for (var i = 0; i < dates.length; i++) {
      final_res.push(tmp[dates[i]])
    }

  } catch (err) {
    error_code = RetCode.RET_QUERY_FAILED;
    error_msg = RetCode.ERRMSG_QUERY_FAILED;
  }

  service_helper.genResponse(ctx, error_code, error_msg, {'txs_count': final_res});

}

module.exports = {
  getLatestRewardRecord,
  getRewardRecordByHash,
  getCountGroupByMoralCrisisType,
  getRewardRecordListByMoralCrisisType,
  getRewardRecordList,
  getRewardRecordTxCountList,
}
