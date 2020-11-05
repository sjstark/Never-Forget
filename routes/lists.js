const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { csrfProtection, asyncHandler } = require("./utils");
const db = require("../db/models");

const { Task, User, List } = db;

/****************** VALIDATION AND ERROR CHECKS **************************/

const validateList = [
  // check("createdBy")
  //   .exists({ checkFalsy: true })
  //   .withMessage("Must have User ID.")
  //   .custom((value) => {
  //     return db.User.findOne({ where: { id: value } }).then((user) => {
  //       if (!user) {
  //         return Promise.reject("No user could be found");
  //       }
  //     });
  //   }),
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

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const userId = res.locals.user.id;

    let allLists = await List.findAll({
      attributes: ["id", "title"],
      where: { userId: userId },
      // order: [["title", "DESC"]],
    });

    res.json({ allLists });
  })
);

router.get(
  "/:id(\\d+)",
  csrfProtection,
  asyncHandler(async (req, res, next) => {
    console.log("hello");
    const taskId = parseInt(req.params.id, 10);
    let allTasks;
    try {
      allTasks = await Task.findAll({
        include: [
          {
            model: User,
            as: "user",
            attributes: ["estimate", "createdBy", "isComplete"],
          },
        ],
        order: [["createdAt", "DESC"]],
        attributes: ["title"],
        where: {
          listId: taskId,
        },
      });
    } catch (error) {
      console.error(error);
    }
    res.json({ allTasks });
  })
);

router.post(
  "/",
  csrfProtection,
  validateList,
  asyncHandler(async (req, res, next) => {
    const userId = res.locals.user.id;
    const { title } = req.body;
    // console.log('Hey, Im working here', title);
    const list = await List.build({
      title,
      userId,
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
      try {
        await list.save();
      } catch (err) {
        console.error(err);
      }
      res.status(201).json({ list });
      //TODO implement AJAX here.
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      next(errors);
      //TODO implement AJAX here.
    }
  })
);

router.put(
  "/:id(\\d+)",
  csrfProtection,
  validateEditList,
  asyncHandler(async (req, res, next) => {
    const listId = parseInt(req.params.id, 10);
    const list = await List.findByPk(listId);
    // const userId = req.session.auth.userId;

    if (list) {
      // // CHECKS TO SEE IF USER HAS ACCESS TO THAT LIST
      //MM: do we need to check if user has access to the list? presumably the user has already been authorized at this point?

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
    } else {
      next(listNotFoundError(listId));
    }
  })
);

router.delete(
  "/:id(\\d+)",
  validateList,
  asyncHandler(async (req, res, next) => {
    const listId = parseInt(req.params.id, 10);
    const list = await List.findByPk(listId);

    if (list) {
      await list.destroy();
      //TODO implement AJAX
      res.status(204).end();
    } else {
      next(listNotFoundError(listId));
    }
  })
);

module.exports = router;
