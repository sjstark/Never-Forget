"use strict";
module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define(
    "List",
    {
      title: {
        allowNull: false,
        type: DataTypes.STRING(50),
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: { model: "Users" },
      },
    },
    {}
  );
  List.associate = function (models) {
    // associations can be defined here
    List.hasMany(models.Task, { foreignKey: "createdBy" });
  };
  return List;
};
