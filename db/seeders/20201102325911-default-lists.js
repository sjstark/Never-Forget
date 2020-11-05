'use strict';

const {User} = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    let updatedAt = new Date();
    let createdAt = new Date();
    let demoUser = await User.findOne({where: {email: "demo@user.com"}})
    return queryInterface.bulkInsert('Lists', [
      {
        id: 1,
        title: 'Work',
        userId: demoUser.id,
        createdAt,
        updatedAt
      },
      {
        id: 2,
        title: 'Personal',
        userId: demoUser.id,
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
