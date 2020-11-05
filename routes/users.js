const express = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const { loginUser, logoutUser } = require("../auth");
const db = require("../db/models");
const { csrfProtection, asyncHandler } = require("./utils");

var router = express.Router();

/***********************    VALIDATORS   *****************************/

const loginValidators = [
  check("email")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Email"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Password"),
];

const userValidators = [
  check("firstName")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for First Name")
    .isLength({ max: 50 })
    .withMessage("First Name must not be more than 50 characters long"),

  check("lastName")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Last Name")
    .isLength({ max: 50 })
    .withMessage("Last Name must not be more than 50 characters long"),

  check("username")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Username")
    .isLength({ max: 50 })
    .withMessage("Last Name must not be more than 50 characters long")
    .custom((value) => {
      return db.User.findOne({ where: { username: value } }).then((user) => {
        if (user) {
          return Promise.reject(
            "The provided Username is already in use by another account"
          );
        }
      });
    }),

  check("email")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Email")
    .isLength({ max: 255 })
    .withMessage("Email Address must not be more than 255 characters long")
    .isEmail()
    .withMessage("Email Address is not a valid email")
    .custom((value) => {
      return db.User.findOne({ where: { email: value } }).then((user) => {
        if (user) {
          return Promise.reject(
            "The provided Email Address is already in use by another account"
          );
        }
      });
    }),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .isLength({ max: 50 })
    .withMessage("Password must not be more than 50 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, "g")
    .withMessage(
      'Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'
    ),
];

/***********************      ROUTES     *****************************/

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/signup", csrfProtection, (req, res, next) => {
  const user = db.User.build();
  res.render("signup", {
    title: "Sign Up",
    user,
    csrfToken: req.csrfToken(),
  });
});

router.post(
  "/signup",
  csrfProtection,
  userValidators,
  asyncHandler(async (req, res) => {
    const { firstName, lastName, email, username, password } = req.body;

    const user = db.User.build({
      firstName,
      lastName,
      email,
      username,
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      user.hashedPassword = await bcrypt.hash(password, 10);
      await user.save();
      loginUser(req, res, user);
      res.redirect("/app");
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render("signup", {
        title: "Sign Up",
        user,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  })
);

router.get("/login", csrfProtection, (req, res, next) => {
  res.render("login", {
    title: "Login",
    csrfToken: req.csrfToken(),
  });
});

router.post(
  "/login",
  csrfProtection,
  loginValidators,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    let errors = [];
    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      const user = await db.User.findOne({ where: { email } });

      if (user !== null) {
        const passwordMatch = await bcrypt.compare(
          password,
          user.hashedPassword.toString()
        );

        if (passwordMatch) {
          loginUser(req, res, user);
          return res.redirect("/app");
        }
      }

      errors.push("Login failed for the provided email address and password");
    } else {
      errors = validatorErrors.array().map((error) => error.msg);
    }

    res.render("login", {
      title: "Login",
      errors,
      csrfToken: req.csrfToken(),
    });
  })
);

router.get(
  "/demo",
  asyncHandler(async (req, res, next) => {
    let demoUser = await db.User.findOne({ where: { email: "demo@user.com" } });
    loginUser(req, res, demoUser);
    return res.redirect("/app");
  })
);

router.post("/logout", (req, res) => {
  logoutUser(req, res);
  return res.redirect("/");
});

module.exports = router;
