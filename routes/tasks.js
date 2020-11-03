const express = require('express');
const { check, validationResult } = require('express-validator')
const { csrfProtection, asyncHandler } = require('./utils')
const cors = require('cors')
const {Task} = require('../db/models');



const router = express.Router();

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

const taskNotFoundError = (id) => {
    const error = new Error(`Task with id of ${id} not found`);
    error.title = 'Task not found';
    error.status = 404;
    return error
}

router.get('/', csrfProtection, asyncHandler(async (req,res) => {
    let allTasks = await Task.findAll();
    // console.log(allTasks)

    res.render('dummy-all-tasks', {
        title: 'Dummy',
        allTasks,
        csrfToken: req.csrfToken()
    })
}))

router.post('/', csrfProtection, validateTask, asyncHandler(async (req, res) => {
    //TODO add user ID
    const {createdBy, title, listId} = req.body;
    const task = db.Task.build(
        {createdBy,
         title,
         listId,
         estimate
        }

    );
    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        await user.save();
        //TODO implement AJAX here.
    }else {
        const errors = validatorErrors.array().map((error) => error.msg);
        //TODO implement AJAX here.
    }
}))

router.put('/:id(\\d+)', csrfProtection, validateTask, asyncHandler( async (req,res, next) => {
    const taskId = parseInt(req.params.id, 10);


    const task = await Task.findByPk(taskId);
    if (task) {
        const {title,estimate,listId} = req.body;
        task.title = title;
        task.estimate = estimate;
        if (listId) {
            task.listId = listId
        }
        //TODO Implement AJAX
    } else {
        next(taskNotFoundError(taskId))
    }
    
}));

router.delete('/:id(\\d+)', csrfProtection, validateTask, asyncHandler( async (req,res, next) => {
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