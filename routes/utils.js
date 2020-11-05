const csrf = require('csurf')

const csrfProtection = csrf({cookie:true})

const asyncHandler = (handler) => {
  return (req, res, next) => {
    handler(req, res, next).catch((e)=>{
      console.log('hey! we got an error!')
      next(e)
    })
  }
}

module.exports = {
  csrfProtection,
  asyncHandler
}
