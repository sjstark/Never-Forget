const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { csrfProtection, asyncHandler } = require("./utils");
const db = require("../db/models");

const { Task, User, List } = db;

/****************** VALIDATION AND ERROR CHECKS **************************/

const validateList = [
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
];

const listNotFoundError = (listId) => {
  const error = new Error(`List with id of ${listId} not found`);
  error.title = "List not found";
  error.status = 404;
  return error;
};

const notAuthorizedError = (listId) => {
  const error = new Error(
    `User does not have authorization to interact with list ${listId}`
  );
  error.title = "User Not Authorized";
  error.status = 401;
  return error;
};

/***********************      ROUTES     *****************************/

//GET ALL LISTS FOR A SPECIFIC USER
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const loggedInUserId = res.locals.user.id;

    let allLists = await List.findAll({
      attributes: ["id", "title"],
      where: { userId: loggedInUserId },
      // order: [["title", "DESC"]],
    });

    res.json({ allLists });
  })
);

//GET ALL TASKS FOR A SPECIFIC LIST
router.get(
  "/:id(\\d+)",
  csrfProtection,
  asyncHandler(async (req, res, next) => {
    const listId = parseInt(req.params.id, 10);

    const loggedInUserId = res.locals.user.id;
    const { userId: listUser } = await List.findOne({
      where: { id: listId },
    });

    //check if user is accessing his own list
    if (loggedInUserId !== listUser) {
      next(notAuthorizedError(listId));
    } else {
      const allTasks = await Task.findAll({
        order: [["createdAt", "DESC"]],
        attributes: ["title", "estimate", "isComplete", "dueDate"],
        where: {
          listId,
        },
      });

      res.json({ allTasks });
    }
  })
);

//THIS IS A ROUTE TO CREATE A LIST
router.post(
  "/",
  csrfProtection,
  validateList,
  asyncHandler(async (req, res, next) => {
    const loggedInUserId = res.locals.user.id;
    const { title } = req.body;
    // console.log('Hey, Im working here', title);
    const list = await List.build({
      title,
      userId: loggedInUserId,
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      await list.save();
      res.status(201).json({ list });
      //TODO implement AJAX here.
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      next(errors);
      //TODO implement AJAX here.
    }
  })
);

// THIS IS A PUT ROUTE TO EDIT LIST TITLE
router.post(
  "/put/:id(\\d+)",
  csrfProtection,
  validateEditList,
  asyncHandler(async (req, res, next) => {
    const listId = parseInt(req.params.id, 10);
    const loggedInUserId = res.locals.user.id;
    const list = await List.findOne({
      where: { id: listId },
    });

    //check if list exists
    if (!list) {
      next(listNotFoundError(listId));
      return;
    }

    //destructure userId from list
    const { userId: listUser } = await List.findOne({
      where: { id: listId },
    });

    // // CHECKS TO SEE IF USER HAS ACCESS TO THAT LIST
    if (loggedInUserId !== listUser) {
      next(notAuthorizedError(listId));
    } else {
      //CHECKS FOR ERRORS AND UPDATES
      const validatorErrors = validationResult(req);

      if (validatorErrors.isEmpty()) {
        const { title } = req.body;
        await list.update({ title });

        res.status(201).json({ list });
        //TODO Implement AJAX
      } else {
        const errors = validatorErrors.array().map((error) => error.msg);
        next(errors);
      }
    }
  })
);

//THIS IS A DELETE ROUTE TO REMOVE A LIST
router.post(
  "/delete/:id(\\d+)",
  validateList,
  asyncHandler(async (req, res, next) => {
    const listId = parseInt(req.params.id, 10);
    const loggedInUserId = res.locals.user.id;
    const list = await List.findOne({
      where: { id: listId },
    });

    //check if list exists
    if (!list) {
      next(listNotFoundError(listId));
      return;
    }

    //destructure userId from list
    const { userId: listUser } = await List.findOne({
      where: { id: listId },
    });

    //CHECKS TO SEE IF USER AUTHORIZED TO DELETE THAT LIST
    if (loggedInUserId !== listUser) {
      next(notAuthorizedError(listId));
    } else {
      await list.destroy();
      res.status(204).end();
      //TODO implement some AJAX
    }
  })
);

module.exports = router;
