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
      personId: {
        $cond: {
          if: {
            $or: [{
              $eq: [
                "",
                {
                  $trim: {
                    input: "$personId"
                  }
                }
              ]
            }, {
              $lt: [{
                $strLenCP: "$personId"
              }, 8]
            }]
          },
          then: "",
          else: {
            $concat: [{
                $substrCP: ["$personId", 0, 3]
              },
              {
                $switch: {
                  branches: [{
                    case: {
                      $eq: [{
                        $strLenCP: "$personId"
                      }, 15]
                    },
                    then: "*********"
                  }],
                  default: '************'
                }
              },
              {
                $substrCP: ["$personId", {
                  $subtract: [{
                      $strLenCP: "$personId"
                    },
                    3
                  ]
                }, 3]
              }
            ]
          }
        }
      },
      comments: {
        $concat: [{
          $substrCP: ["$comments", 0, 1]
        }, "*****"]
      },
      registerTime: 1,
      moralCrisisType: 1,
      reason: 1,
      recordTime: 1,
      hash: 1,
      txId: 1,
    }
  }
}

function gen_moral_crisis_cond(ctx) {

  var param = ctx.request.query;
  let moral_crisis_type = param['moral_crisis_type']
  let page = parseInt(param['page'])
  let page_size = parseInt(param['page_size'])

  return gen_cond('5', moral_crisis_type, page, page_size);

}

function gen_search_cond(ctx) {

  var param = ctx.request.query;
  let search_type = param['search_type']
  let search_txt = param['search_txt']
  let page = parseInt(param['page'])
  let page_size = parseInt(param['page_size'])

  return gen_cond(search_type, search_txt, page, page_size);

}

function gen_cond(search_type, search_txt, page, page_size) {

  let cond = {}

  var opt_lst = ['1', '2', '3', '4', '5'];

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
          'personId': search_txt
        },
        {
          'comments': search_txt
        },
        {
          'reason': search_txt
        },
        {
          'money': search_txt
        },
        {
          'hash': search_txt
        },
        {
          'txId': search_txt
        },
        {
          'moralCrisisType': search_txt
        },
      ]
    }
  } else if (search_type === '1') {
    cond = {
      'account': search_txt
    }
  } else if (search_type === '2') {
    cond = {
      'personId': search_txt
    }
  } else if (search_type === '3') {
    cond = {
      'reason': search_txt
    }
  } else if (search_type === '4') {
    cond = {
      'txId': search_txt
    }
  } else if (search_type === '5') {
    cond = {
      'moralCrisisType': search_txt
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
  gen_moral_crisis_cond,
  gen_search_cond,
}
