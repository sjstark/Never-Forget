'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let updatedAt = new Date();
    let createdAt = new Date();
      return queryInterface.bulkInsert('Tasks', [
        {createdBy: 1, title:"test1", listId: 0, dueDate: new Date(), estimate: 0, createdAt, updatedAt},
        {createdBy: 1, title:"test2", listId: 0, dueDate: new Date(), estimate: 5, createdAt, updatedAt},
        {createdBy: 2, title:"test3", listId: 0, dueDate: new Date(), estimate: 10, createdAt, updatedAt},
        {createdBy: 2, title:"test4", listId: 0, dueDate: new Date(), estimate: 15, createdAt, updatedAt},
        {createdBy: 3, title:"test5", listId: 0, dueDate: new Date(), estimate: 25, createdAt, updatedAt},
        {createdBy: 3, title:"test6", listId: 0, dueDate: new Date(), estimate: 12, createdAt, updatedAt},
        {createdBy: 4, title:"test7", listId: 0, dueDate: new Date(), estimate: 9, createdAt, updatedAt},
        {createdBy: 4, title:"test8", listId: 0, dueDate: new Date(), estimate: 21, createdAt, updatedAt}
      ], {});
    
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Tasks', null, {});
    
  }
};
