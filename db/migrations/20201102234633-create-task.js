"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Tasks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      createdBy: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      isComplete: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      listId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        defaultValue: null
        //REFERENCE TO THE LIST TABLE IS LOCATED IN THE 'LIST' MIGRATION FILE
      },
      dueDate: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      estimate: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Tasks");
  },
};
