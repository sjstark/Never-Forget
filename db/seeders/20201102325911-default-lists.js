'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    let updatedAt = new Date();
    let createdAt = new Date();
    return queryInterface.bulkInsert('Lists', [
      {
        id: 1,
        title: 'Work',
        userId: 1,
        createdAt,
        updatedAt
      },
      {
        id: 2,
        title: 'Personal',
        userId: 1,
        createdAt,
        updatedAt
      },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.bulkDelete('Lists', null, {});
  }
};
