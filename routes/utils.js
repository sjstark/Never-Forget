const csrf = require('csurf')

const csrfProtection = csrf({ cookie: true })

const asyncHandler = (handler) => {
  return (req, res, next) => {
    handler(req, res, next).catch((e) => {
      next(e)
    })
  }
}

module.exports = {
  csrfProtection,
  asyncHandler
}
