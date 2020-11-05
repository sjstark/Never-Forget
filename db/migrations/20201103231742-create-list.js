"use strict";

const { query } = require("express");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("Lists", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        title: {
          allowNull: false,
          type: Sequelize.STRING(50),
        },
        userId: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: { model: "Users" },
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .then(() =>
        queryInterface.changeColumn("Tasks", "listId", {
          allowNull: true,
          type: Sequelize.INTEGER,
          references: { model: "Lists" },
        })
      );
  },
  down: async (queryInterface, Sequelize) => {
    // await queryInterface.removeConstraint("Tasks", "Tasks_listId_fkey");
    return queryInterface.dropTable("Lists");
  },
};
