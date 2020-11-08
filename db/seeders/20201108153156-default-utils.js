'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    let updatedAt = new Date();
    let createdAt = new Date();

    return queryInterface.bulkInsert('Utils', [{
      name: 'tasksCreated',
      valueInt: 0,
      createdAt,
      updatedAt
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */

      return queryInterface.bulkDelete('Utils', null, {});
    }
};
