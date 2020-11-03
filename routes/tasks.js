const express = require('express');
const { check, validationResult } = require('express-validator')
const { csrfProtection, asyncHandler } = require('./utils')
const cors = require('cors')
const {Task} = require('../db/models')



const router = express.Router();


router.get('/', csrfProtection, asyncHandler(async (req,res) => {
    let allTasks = await Task.findAll();
    // console.log(allTasks)

    res.render('dummy-all-tasks', {
        title: 'Dummy',
        allTasks,
        csrfToken: req.csrfToken()
    })
}))



module.exports = router