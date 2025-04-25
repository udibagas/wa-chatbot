"use strict";
const { Model } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }

    comparePassword(password) {
      return bcrypt.compareSync(password, this.password);
    }

    generateAuthToken() {
      const { id, name, email } = this;
      return jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
    }
  }

  User.init(
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: { msg: "Name is required" },
          notEmpty: { msg: "Name is required" },
        },
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: { msg: "Email already exists" },
        validate: {
          isEmail: { msg: "Invalid email format" },
          notNull: { msg: "Email is required" },
          notEmpty: { msg: "Email is required" },
        },
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
        set(value) {
          if (!value) return;
          const hash = bcrypt.hashSync(value, 10);
          this.setDataValue("password", hash);
        },
        validate: {
          notNull: { msg: "Password is required" },
          notEmpty: { msg: "Password is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
    }
  );

  return User;
};
