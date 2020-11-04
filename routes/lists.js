const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { csrfProtection, asyncHandler } = require("./utils");
const cors = require("cors");
const db = require("../db/models");

const { Task, User, List } = db;

/****************** VALIDATION AND ERROR CHECKS **************************/

const validateList = [
  check("createdBy")
    .exists({ checkFalsy: true })
    .withMessage("Must have User ID.")
    .custom((value) => {
      return db.User.findOne({ where: { id: value } }).then((user) => {
        if (!user) {
          return Promise.reject("No user could be found");
        }
      });
    }),
  check("title")
    .exists({ checkFalsy: true })
    .withMessage("Must provide a title."),
];

const validateEditList = [
  check("title")
    .exists({ checkFalsy: true })
    .withMessage("Must provide a title.")
    .isLength({ max: 50 })
    .withMessage("Title cannot exceed 50 characters."),

  check("estimate")
    .exists({ checkFalsy: true })
    .withMessage("Estimate cannot be null")
    .isLength({ min: 0 }),
];

/***********************      ROUTES     *****************************/
