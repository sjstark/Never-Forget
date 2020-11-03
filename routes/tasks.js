const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')
const { csrfProtection, asyncHandler } = require('./utils')
const cors = require('cors')
// const { requireAuth } = require('../auth');
const db = require("../db/models")

const { Task, User } = db;
// router.use(requireAuth);


/****************** VALIDATION AND ERROR CHECKS **************************/


const validateTask = [
    check("createdBy")
        .exists(({ checkFalsy: true}))
        .withMessage('Must have User ID.')
        .custom((value) => {
            return db.User.findOne({where: {id: value}})
            .then((user) => {
                if (!user) {
                    return Promise.reject('No user could be found');
                }
            })
        }),
    check("title")
        .exists(({ checkFalsy: true}))
        .withMessage('Must provide a title.'),
    
    check('estimate')
        .exists({checkFalsy: true})
        .withMessage('Estimate cannot be null')
        .isLength({min: 0})    
    
    //TODO: VALIDATE LIST ID IF IT EXISTS
]

const validateEditTask = [
    check("title")
        .exists(({ checkFalsy: true}))
        .withMessage('Must provide a title.'),
    
    check('estimate')
        .exists({checkFalsy: true})
        .withMessage('Estimate cannot be null')
        .isLength({min: 0})    
]

const taskNotFoundError = (id) => {
    const error = new Error(`Task with id of ${id} not found`);
    error.title = 'Task not found';
    error.status = 404;
    return error
}

/***********************      ROUTES     *****************************/

router.get('/', csrfProtection, asyncHandler(async (req,res) => {
    const userId = req.session.auth.userId;
    let allTasks = await Task.findAll({    
        include: [{ model: User, as: "user", attributes:["email"]}],
        order: [["createdAt", "DESC"]],
        attributes: ["title"],
        where: {
            "createdBy": userId
        }
    });
    console.log("hit5")
    res.json({allTasks});
    // console.log(allTasks)

    // res.render('dummy-all-tasks', {
    //     title: 'Dummy',
    //     allTasks,
    //     csrfToken: req.csrfToken()
    // })
}));

// router.get('/:id(\\d+)', asyncHandler( async (req, res, next) => {
//     const taskId = parseInt(req.params.id, 10);
//     const task = await Task.findByPk(taskId);
  
//     if (task) {
//       res.json({task})
//     } else {
//         next(taskNotFoundError(taskId))
//     }
//   }))

router.post('/',  validateTask, asyncHandler(async (req, res) => {
    //TODO add user ID
    const userId = req.session.auth.userId;

    const {title, listId, estimate, dueDate} = req.body;
    const task = await Task.build(
        {createdBy: userId, 
         title,
         listId,
         estimate,
         dueDate,
          });
    res.status(201).json( {task} );
    
    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        await task.save();
        //TODO implement AJAX here.
    }else {
        const errors = validatorErrors.array().map((error) => error.msg);
        console.error(errors);
        //TODO implement AJAX here.
    }
}))

router.put('/:id(\\d+)', validateEditTask, asyncHandler( async (req,res, next) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await Task.findByPk(taskId);
    const userId = req.session.auth.userId;

    if (task) {

        // CHECKS TO SEE IF USER HAS ACCESS TO THAT TASK
        let userTasks = await Task.findAll({    
            include: [{ model: User, as: "user", attributes:["id"]}],
            attributes: ["id"],
            where: {
                "createdBy": userId
            }
        });

        if (!userTasks.includes(taskId)) {
            next(taskNotFoundError(taskId))
        }

        //CHECKS FOR ERRORS AND UPDATES

        const validatorErrors = validationResult(req);
        if(validatorErrors.isEmpty()) {
        const {title, estimate, listId, dueDate} = req.body;
        await task.update({title, estimate, listId, dueDate})
        // task.title = title;
        // task.estimate = estimate;
        // task.dueDate = dueDate
        // if (listId) {
        //     task.listId = listId
        // }
        res.status(201).json({task});
        //TODO Implement AJAX

        } else {
            const errors = validatorErrors.array().map((error) => error.msg);
            console.error(errors);  
        }
    } else {
        next(taskNotFoundError(taskId))
    }
    
}));

router.delete('/:id(\\d+)', validateTask, asyncHandler( async (req,res, next) => {
    const taskId = parseInt(req.params.id, 10);
    const task = await Task.findByPk(taskId);

    if (task) {
        await task.destroy()
        //TODO implement AJAX
        res.status(204).end()
    } else {
        next(taskNotFoundError(taskId))
    }
    
}));


module.exports = router