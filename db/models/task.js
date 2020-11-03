'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    createdBy: {type: 
      DataTypes.INTEGER,
      allowNull: false,
    },
    title: {type: 
      DataTypes.STRING,
      allowNull: false,
    },
    isComplete: {type: 
      DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    listId: {type: 
      DataTypes.INTEGER,
      allowNull: true,
    },
    dueDate: {type: 
      DataTypes.DATE,
      allowNull: false
    },
    estimate: {type: 
      DataTypes.INTEGER,
      allowNull: false
    },
  }, {});
  Task.associate = function(models) {
    // associations can be defined here
    Task.belongsTo(models.User, {
      as: "user",
      foreignKey: 'createdBy'})
  };
  return Task;
};