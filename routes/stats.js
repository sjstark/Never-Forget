const express = require('express')
const statsRouter = express.Router();

const db = require('../db/models');
const { asyncHandler } = require('./utils');

const incrementTaskCount = async() => {
  let taskCount = await db.Util.findOne({
    where: {name: 'tasksCreated'}
  })

  if (!taskCount) {
    let count = {
      name: 'tasksCreated',
      valueInt: 1
    }
    taskCount = await db.Util.create(count)
  }

  taskCount.valueInt ++

  await taskCount.save();
}

statsRouter.get('/tasks-created', asyncHandler(async (req, res) => {
  let taskCount = await db.Util.findOne({
    where: {name: 'tasksCreated'}
  })

  if (!taskCount) {
    let count = {
      name: 'tasksCreated',
      valueInt: 1
    }
    taskCount = await db.Util.create(count)
  }

  return res.json({
    schemaVersion: 1,
    label: 'Tasks Created',
    message: `${taskCount.valueInt}`,
    labelColor: '#8125B9',
    color: '#CDBFEA',
  })
}))

module.exports = {
  statsRouter,
  incrementTaskCount
}
