const db = require("./db/models");

const loginUser = (req, res, user) => {
  req.session.auth = {
    userId: user.id,
  };
  res.redirect("/app");
};

const restoreUser = async (req, res, next) => {
  if (req.session.auth) {
    const { userId } = req.session.auth;

    try {
      const user = await db.User.findByPk(userId);

      if (user) {
        res.locals.authenticated = true;
        res.locals.user = user;
        if (req.path === "/") {
          res.redirect("/app");
        }
        next();
      }
    } catch (err) {
      res.locals.authenticated = false;
      next(err);
    }
  } else {
    res.locals.authenticated = false;
    if (!req.path.startsWith("/users") && req.path !== "/") {
      res.redirect("/users/login");
    } else {
      next();
    }
  }
};

const logoutUser = (req, res) => {
  delete req.session.auth;
};

module.exports = {
  loginUser,
  restoreUser,
  logoutUser,
};
