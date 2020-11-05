"use strict";
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    "Task",
    {
      createdBy: { type: DataTypes.INTEGER, allowNull: false },
      title: { type: DataTypes.STRING(100), allowNull: false },
      isComplete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      listId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null},
      dueDate: { type: DataTypes.DATE, allowNull: true },
      estimate: { type: DataTypes.INTEGER, allowNull: true },
    },
    {}
  );
  Task.associate = function (models) {
    // associations can be defined here
    Task.belongsTo(models.User, {
      as: "user",
      foreignKey: "createdBy",
    });
    Task.belongsTo(models.List, { foreignKey: "listId" });
  };
  return Task;
};
