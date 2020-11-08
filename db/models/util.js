'use strict';
module.exports = (sequelize, DataTypes) => {
  const Util = sequelize.define('Util', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    valueStr: DataTypes.STRING,
    valueInt: DataTypes.INTEGER
  }, {});
  Util.associate = function(models) {
    // associations can be defined here
  };
  return Util;
};
