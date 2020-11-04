"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.changeColumn("Tasks", "listId", {
      allowNull: true,
      type: Sequelize.INTEGER,
      references: { model: "Lists" },
    });

    return queryInterface.createTable("Lists", {
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
    return queryInterface.dropTable("Lists");
  },
};
