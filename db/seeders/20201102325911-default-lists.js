"use strict";

const { User } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    let updatedAt = new Date();
    let createdAt = new Date();
<<<<<<< HEAD
    let demoUser = await User.findOne({ where: { email: "demo@user.com" } });
    return queryInterface.bulkInsert(
      "Lists",
      [
        {
          title: "Work",
          userId: demoUser.id,
          createdAt,
          updatedAt,
        },
        {
          title: "Personal",
          userId: demoUser.id,
          createdAt,
          updatedAt,
        },
      ],
      {}
    );
=======
    let demoUser = await User.findOne({where: {email: "demo@user.com"}})
    return queryInterface.bulkInsert('Lists', [
      {
        title: 'Work',
        userId: demoUser.id,
        createdAt,
        updatedAt
      },
      {
        title: 'Personal',
        userId: demoUser.id,
        createdAt,
        updatedAt
      },
    ], {});
>>>>>>> d43aafae54a8613251eb3ad677d77dca8713b6d5
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
    return queryInterface.bulkDelete("Lists", null, {});
  },
};
