'use strict';

const {User, List} = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let updatedAt = new Date();
    let createdAt = new Date();
    let demoUser = await User.findOne({where: {email: "demo@user.com"}})
    let workList = await List.findOne({where: {title: "Work"}})
    let personalList = await List.findOne({where: {title: "Personal"}})
      return queryInterface.bulkInsert('Tasks', [
        {createdBy: demoUser.id, title:"Finish my App Academy website", listId: workList.id, dueDate: null, estimate: null, createdAt, updatedAt},
        {createdBy:  demoUser.id, title:"Go grocery shopping", listId: personalList.id, dueDate: new Date(), estimate: 60, createdAt, updatedAt},
        {createdBy:  demoUser.id, title:"Complete my end of day review", listId: workList.id, dueDate: new Date(), estimate: 10, createdAt, updatedAt},
      ], {});

  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Tasks', null, {});

  }
};
