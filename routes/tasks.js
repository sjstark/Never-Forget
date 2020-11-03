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
        .withMessage('Must provide a title.')

]


router.get('/', csrfProtection, asyncHandler(async (req,res) => {
    let allTasks = await Task.findAll();
    // console.log(allTasks)

    res.render('dummy-all-tasks', {
        title: 'Dummy',
        allTasks,
        csrfToken: req.csrfToken()
    })
}))

router.post('/', csrfProtection, asyncHandler(async (req, res) => {
    //TODO add user ID
    const {createdBy, title, listId} = req.body;
    const task = db.Task.build(
        {createdBy,
         title,
         listId
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

router.put('/:id(\\d+)', )


module.exports = router