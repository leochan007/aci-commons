function genResponse(ctx, error_code, error_msg, data) {

  let body = {
    'error_code': error_code,
    'error_msg': error_msg,
    'data': data,
  }

  ctx.response.body = body

}

function genListResponse(ctx, error_code, error_msg, total_count, data) {

  let body = {
    'error_code': error_code,
    'error_msg': error_msg,
    data: {
      'total_count': total_count,
      'lst': data
    }
  }

  ctx.response.body = body

}

module.exports = {
  genResponse,
  genListResponse,
}
