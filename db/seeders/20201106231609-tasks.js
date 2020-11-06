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
        {createdBy: demoUser.id, title:"Learn Reacts JS library", listId: workList.id, dueDate: null, estimate: null, createdAt, updatedAt},
        {createdBy:  demoUser.id, title:"Don't forget to check-in", listId: personalList.id, dueDate: new Date(), estimate: 60, createdAt, updatedAt},
        {createdBy:  demoUser.id, title:"Pick up dry-cleaning", listId: workList.id, dueDate: new Date(), estimate: 10, createdAt, updatedAt},
        {createdBy:  demoUser.id, title:"Order Dinner after class", listId: workList.id, dueDate: new Date(), estimate: 10, createdAt, updatedAt},
        {createdBy:  demoUser.id, title:"Walk the dog", listId: workList.id, dueDate: new Date(), estimate: 10, createdAt, updatedAt},
        {createdBy:  demoUser.id, title:"Get my 30 minute workout in", listId: workList.id, dueDate: new Date(), estimate: 10, createdAt, updatedAt},
        {createdBy:  demoUser.id, title:"Study for 2-4 hours on off days", listId: workList.id, dueDate: new Date(), estimate: 10, createdAt, updatedAt},
        {createdBy:  demoUser.id, title:"Take out the trash", listId: workList.id, dueDate: new Date(), estimate: 10, createdAt, updatedAt},
        {createdBy:  demoUser.id, title:"Make sure to meditate for 5-10 minutes today", listId: workList.id, dueDate: new Date(), estimate: 10, createdAt, updatedAt},
      ], {});

  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Tasks', null, {});

  }
};
