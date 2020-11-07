'use strict';

const {User, List} = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let updatedAt = new Date();
    let createdAt = new Date();
    let demoUser = await User.findOne({ where: { email: "demo@user.com" } });
    await queryInterface.bulkInsert(
      "Lists",
      [
        {
          title: "Web App",
          userId: demoUser.id,
          createdAt,
          updatedAt,
        },
      ],
      {}
    );

    let webApp = await List.findOne({ where: { title: 'Web App', userId: demoUser.id }});

    const createDueDate = (dueDays) => {
      let today = new Date();
      return new Date(today.setDate(today.getDate() + dueDays))
    }

    return queryInterface.bulkInsert('Tasks', [
        {createdBy: demoUser.id, title:"Create Github Repo", listId: webApp.id, dueDate: createDueDate(0), estimate: 5, createdAt, updatedAt},
        {createdBy: demoUser.id, title:"Develop MVPs", listId: webApp.id, dueDate: createDueDate(0), estimate: 60, createdAt, updatedAt},
        {createdBy: demoUser.id, title:"Create User Stories", listId: webApp.id, dueDate: createDueDate(1), estimate: 240, createdAt, updatedAt},
        {createdBy: demoUser.id, title:"Create Auth Process", listId: webApp.id, dueDate: createDueDate(2), estimate: 400, createdAt, updatedAt},
        {createdBy: demoUser.id, title:"Make a landing page", listId: webApp.id, dueDate: createDueDate(2), estimate: 200, createdAt, updatedAt},
        {createdBy: demoUser.id, title:"Create our database schema", listId: webApp.id, dueDate: createDueDate(2), estimate: 180, createdAt, updatedAt},
        {createdBy: demoUser.id, title:"Generate Models and Migrations for Sequelize using PostgreSQL", listId: webApp.id, dueDate: createDueDate(3), estimate: 45, createdAt, updatedAt},
        {createdBy: demoUser.id, title:"Create CRUD implementation for Tasks", listId: webApp.id, dueDate: createDueDate(4), estimate: 500, createdAt, updatedAt},
        {createdBy: demoUser.id, title:"Create CRUD implementation for Lists", listId: webApp.id, dueDate: createDueDate(4), estimate: 300, createdAt, updatedAt},
        {createdBy: demoUser.id, title:"Make a Search function to find your tasks", listId: webApp.id, dueDate: createDueDate(5), estimate: 120, createdAt, updatedAt},
        {createdBy: demoUser.id, title:"Make it all pretty with CSS formatting", listId: webApp.id, dueDate: createDueDate(6), estimate: 600, createdAt, updatedAt},
        {createdBy: demoUser.id, title:"Create an app route utilizing AJAX for updating on updates", listId: webApp.id, dueDate: createDueDate(5), estimate: 750, createdAt, updatedAt},
        {createdBy: demoUser.id, title:"Make a Search function to find your tasks", listId: webApp.id, dueDate: createDueDate(5), estimate: 120, createdAt, updatedAt},
      ], {});
  },


  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Tasks", null, {});
  }
};
