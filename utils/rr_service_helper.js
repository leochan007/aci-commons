const States = require('../def/record-state');

function make_mask() {
  return {
    $project: {
      createTime: 1,
      account: {
        $concat: [{
          $substr: ["$account", 0, 3]
        }, "****", {
          $substr: ["$account", {
            $subtract: [{
                $strLenBytes: "$account"
              },
              3
            ]
          }, -1]
        }]
      },
      name: {
        $switch: {
          branches: [{
              case: {
                $eq: ['', "$name"]
              },
              then: ''
            },
            {
              case: {
                $lt: [{
                  $strLenCP: "$name"
                }, 3]
              },
              then: {
                $concat: [{
                  $substrCP: ["$name", 0, 1]
                }, "*"]
              }
            },
            {
              case: {
                $gte: [{
                  $strLenCP: "$name"
                }, 3]
              },
              then: {
                $concat: [{
                    $substrCP: ["$name", 0, 1]
                  }, "*",
                  {
                    $substrCP: ["$name", {
                      $subtract: [{
                          $strLenCP: "$name"
                        },
                        1
                      ]
                    }, 1]
                  }
                ]
              }
            },
          ],
          default: ''
        }
      },
      comments: {
        $concat: [{
          $substrCP: ["$comments", 0, 1]
        }, "*****"]
      },
      activityType: 1,
      issueNumber: 1,
      ranking: 1,
      recordTime: 1,
      hash: 1,
      txId: 1,
    }
  }
}

function gen_activity_cond(ctx) {

  const param = ctx.request.query;
  const activity_type = param['activity_type']
  const page = parseInt(param['page'])
  const page_size = parseInt(param['page_size'])

  return gen_cond('6', activity_type, page, page_size);

}

function gen_search_cond(ctx) {

  const param = ctx.request.query;
  const search_type = param['search_type']
  const search_txt = param['search_txt']
  const page = parseInt(param['page'])
  const page_size = parseInt(param['page_size'])

  return gen_cond(search_type, search_txt, page, page_size);

}

function gen_cond(search_type, search_txt, page, page_size) {

  let cond = {}

  var opt_lst = ['1', '2', '3', '4', '5', '6'];

  console.log('page:', page);

  console.log('page_size:', page_size);

  if (page === undefined || isNaN(page)) {
    page = 0
  }

  if (page_size === undefined || isNaN(page_size) || page_size > 100) {
    page_size = 100
  }

  if (search_type === undefined || search_type === '' || opt_lst.indexOf(search_type) === -1) {
    search_type = '0'
  }

  if (search_txt === undefined || search_txt === '') {;
  } else if (search_type === '0') {
    cond = {
      '$or': [{
          'account': search_txt
        },
        {
          'name': search_txt
        },
        {
          'comments': search_txt
        },
        {
          'reward': search_txt
        },
        {
          'txId': search_txt
        },
      ]
    }
  } else if (search_type === '1') {
    cond = {
      'account': search_txt
    }
  } else if (search_type === '2') {
    cond = {
      'name': search_txt
    }
  } else if (search_type === '3') {
    cond = {
      'comments': search_txt
    }
  } else if (search_type === '4') {
    cond = {
      'reward': search_txt
    }
  } else if (search_type === '5') {
    cond = {
      'txId': search_txt
    }
  } else if (search_type === '6') {
    cond = {
      'activityType': search_txt
    }
  }

  cond = {
    '$and': [cond, {
      'status': {
        $ne: States.STATE_DELETED
      }
    }]
  }

  return {
    'cond': cond,
    'page': page,
    'page_size': page_size
  }

}

module.exports = {
  make_mask,
  gen_activity_cond,
  gen_search_cond,
}
